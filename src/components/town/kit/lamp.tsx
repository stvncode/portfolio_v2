"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useTown } from "../town-context";
import { glow } from "./materials";
import { Block, Box, Cylinder, type Vec3 } from "./shapes";

const POST = "#2c3238";
const LIGHT_INTENSITY = 14;
const LIGHT_DISTANCE = 9;
const HALO_OPACITY = 0.13;

interface LampProps {
  position: Vec3;
  /** Real light at night. Keep these few: each one costs on every pixel. */
  lit?: boolean;
}

/** A cast-iron street lamp whose lantern glows at night. */
export function Lamp({ position, lit = false }: LampProps) {
  const town = useTown();
  const light = useRef<THREE.PointLight>(null);
  const halo = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    const night = town.nightLevel.current;
    if (light.current) light.current.intensity = night * LIGHT_INTENSITY;
    if (halo.current) halo.current.opacity = night * HALO_OPACITY;
  });

  return (
    <group position={position}>
      <Block size={[0.36, 0.3, 0.36]} color={POST} />
      <Cylinder position={[0, 1.6, 0]} radius={0.07} height={2.6} color={POST} segments={6} />
      <Box position={[0, 3.05, 0]} size={[0.42, 0.06, 0.42]} color={POST} />
      <Box position={[0, 3.3, 0]} size={[0.3, 0.42, 0.3]} material={glow.bulb} shadow={false} />
      <mesh position={[0, 3.62, 0]} castShadow>
        <coneGeometry args={[0.3, 0.26, 4]} />
        <meshStandardMaterial color={POST} flatShading />
      </mesh>
      <mesh position={[0, 3.3, 0]}>
        <sphereGeometry args={[0.6, 12, 8]} />
        <meshBasicMaterial ref={halo} color="#ffcf7a" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {lit && <pointLight ref={light} position={[0, 3.1, 0]} intensity={0} distance={LIGHT_DISTANCE} decay={1.6} color="#ffc778" />}
    </group>
  );
}

/** A plain wooden bench, facing +z. */
export function Bench({ position, rotationY = 0 }: { position: Vec3; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <Block position={[0, 0.42, 0]} size={[1.6, 0.08, 0.45]} color="#a0774f" />
      <Block position={[0, 0.55, -0.2]} size={[1.6, 0.4, 0.06]} color="#a0774f" />
      {[-0.65, 0.65].map((x) => (
        <Block key={x} position={[x, 0, 0]} size={[0.08, 0.42, 0.4]} color={POST} />
      ))}
    </group>
  );
}
