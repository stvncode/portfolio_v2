"use client";

import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { solid } from "../kit/materials";
import { Block, Box } from "../kit/shapes";
import { useTown } from "../town-context";
import type { InteriorLayout } from "./layouts";

const WALL_THICKNESS = 0.4;
/** The two walls nearest the camera are cut down to this, dollhouse style. */
const CUTAWAY_HEIGHT = 0.45;
const PLANK_WIDTH = 0.55;

export interface RoomWindow {
  wall: "back" | "left";
  /** Position along the wall: x on the back wall, z on the left one. */
  at: number;
  width?: number;
  height?: number;
}

interface RoomProps {
  layout: InteriorLayout;
  floor: string;
  plank: string;
  wall: string;
  trim: string;
  wallHeight?: number;
  windows?: RoomWindow[];
}

const DAY_SKY = new THREE.Color("#cfe9f5");
const NIGHT_SKY = new THREE.Color("#1d2a4a");

function RoomWindowPane({ window: pane, halfWidth, halfDepth, trim }: { window: RoomWindow; halfWidth: number; halfDepth: number; trim: string }) {
  const town = useTown();
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: DAY_SKY.clone(), emissive: DAY_SKY.clone(), emissiveIntensity: 0.55 }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);
  useFrame(() => {
    material.color.lerpColors(DAY_SKY, NIGHT_SKY, town.nightLevel.current);
    material.emissive.copy(material.color);
  });

  const width = pane.width ?? 1.2;
  const height = pane.height ?? 1.3;
  const onBack = pane.wall === "back";
  const position: [number, number, number] = onBack ? [pane.at, 1.75, -halfDepth + 0.01] : [-halfWidth + 0.01, 1.75, pane.at];
  return (
    <group position={position} rotation={[0, onBack ? 0 : Math.PI / 2, 0]}>
      <Box size={[width + 0.2, height + 0.2, 0.06]} color={trim} shadow={false} />
      <mesh position={[0, 0, 0.04]} material={material}>
        <boxGeometry args={[width, height, 0.02]} />
      </mesh>
      <Box position={[0, 0, 0.06]} size={[0.06, height, 0.03]} color={trim} shadow={false} />
      <Box position={[0, 0, 0.06]} size={[width, 0.06, 0.03]} color={trim} shadow={false} />
      <Box position={[0, -height / 2 - 0.12, 0.12]} size={[width + 0.3, 0.06, 0.22]} color={trim} />
    </group>
  );
}

/** A dollhouse room: floor, two full walls at the back, the front two cut low. */
export function Room({ layout, floor, plank, wall, trim, wallHeight = 3.2, windows = [] }: RoomProps) {
  const town = useTown();
  const { halfWidth, halfDepth } = layout;
  const width = halfWidth * 2;
  const depth = halfDepth * 2;
  const planks = Math.floor(depth / PLANK_WIDTH);

  function handlePointerDown(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    town.walkTo(event.point.x, event.point.z);
  }

  return (
    <group>
      <group onPointerDown={handlePointerDown}>
        <Block position={[0, -0.3, 0]} size={[width + WALL_THICKNESS * 2, 0.3, depth + WALL_THICKNESS * 2]} color="#2b2621" />
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} material={solid(floor)} receiveShadow>
          <planeGeometry args={[width, depth]} />
        </mesh>
      </group>
      {Array.from({ length: planks }, (_, index) => (
        <Box
          key={index}
          position={[0, 0.006, -halfDepth + (index + 1) * PLANK_WIDTH]}
          size={[width, 0.004, 0.025]}
          color={plank}
          shadow={false}
        />
      ))}
      {/* Full walls at the back and on the left. */}
      <Block position={[0, 0, -halfDepth - WALL_THICKNESS / 2]} size={[width + WALL_THICKNESS * 2, wallHeight, WALL_THICKNESS]} color={wall} />
      <Block position={[-halfWidth - WALL_THICKNESS / 2, 0, 0]} size={[WALL_THICKNESS, wallHeight, depth]} color={wall} />
      <Box position={[0, wallHeight + 0.05, -halfDepth - WALL_THICKNESS / 2]} size={[width + WALL_THICKNESS * 2 + 0.1, 0.1, WALL_THICKNESS + 0.1]} color={trim} />
      <Box position={[-halfWidth - WALL_THICKNESS / 2, wallHeight + 0.05, 0]} size={[WALL_THICKNESS + 0.1, 0.1, depth]} color={trim} />
      {/* Skirting boards. */}
      <Box position={[0, 0.08, -halfDepth + 0.02]} size={[width, 0.16, 0.04]} color={trim} shadow={false} />
      <Box position={[-halfWidth + 0.02, 0.08, 0]} size={[0.04, 0.16, depth]} color={trim} shadow={false} />
      {/* The cut-down walls nearest the camera. */}
      <Block position={[0, 0, halfDepth + WALL_THICKNESS / 2]} size={[width + WALL_THICKNESS * 2, CUTAWAY_HEIGHT, WALL_THICKNESS]} color={wall} />
      <Block position={[halfWidth + WALL_THICKNESS / 2, 0, 0]} size={[WALL_THICKNESS, CUTAWAY_HEIGHT, depth]} color={wall} />
      {windows.map((pane) => (
        <RoomWindowPane key={`${pane.wall}${pane.at}`} window={pane} halfWidth={halfWidth} halfDepth={halfDepth} trim={trim} />
      ))}
    </group>
  );
}

/** The way out: a door left ajar, daylight behind it. Sits on a wall facing +z. */
export function Doorway({ frame }: { frame: string }) {
  return (
    <group>
      <Box position={[0, 1.1, 0]} size={[1.3, 2.3, 0.06]} color={frame} shadow={false} />
      <mesh position={[0, 1.05, 0.04]}>
        <boxGeometry args={[1.05, 2.1, 0.02]} />
        <meshStandardMaterial color="#fff2cf" emissive="#ffe6a8" emissiveIntensity={0.7} />
      </mesh>
      <group position={[0.52, 0, 0.05]} rotation={[0, -1.1, 0]}>
        <Box position={[-0.5, 1.05, 0]} size={[1.0, 2.05, 0.07]} color="#6e4f35" />
        <Box position={[-0.85, 1, 0.06]} size={[0.07, 0.07, 0.05]} color="#d8b45a" shadow={false} />
      </group>
      <Box position={[0, 0.012, 0.5]} size={[1.1, 0.02, 0.6]} color="#8a6b4f" shadow={false} />
    </group>
  );
}

const INTERIOR_BACKGROUND = new THREE.Color("#221d19");

/** Warm indoor light. Point lights belong to the rooms' lamps and fires. */
export function InteriorLighting() {
  const { scene } = useThree();
  const sun = useRef<THREE.DirectionalLight>(null);

  useEffect(() => {
    scene.background = INTERIOR_BACKGROUND;
    scene.fog = null;
    return () => {
      scene.background = null;
    };
  }, [scene]);

  return (
    <>
      <hemisphereLight args={["#fff4e2", "#5a4a3c", 1.25]} />
      <directionalLight
        ref={sun}
        position={[6, 12, 9]}
        intensity={1.5}
        color="#fff1dc"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
    </>
  );
}
