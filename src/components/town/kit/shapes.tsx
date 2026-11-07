"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { glow, solid } from "./materials";

export type Vec3 = [number, number, number];

interface BoxProps {
  position?: Vec3;
  size: Vec3;
  color?: string;
  material?: THREE.Material;
  rotation?: Vec3;
  shadow?: boolean;
}

/** A box sitting with its centre at `position`. */
export function Box({
  position = [0, 0, 0],
  size,
  color = "#ffffff",
  material,
  rotation,
  shadow = true,
}: BoxProps) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      material={material ?? solid(color)}
      castShadow={shadow}
      receiveShadow
    >
      <boxGeometry args={size} />
    </mesh>
  );
}

/** A box whose bottom sits at y = 0 of its position, handy for walls. */
export function Block({ position = [0, 0, 0], size, ...rest }: BoxProps) {
  return (
    <Box
      position={[position[0], position[1] + size[1] / 2, position[2]]}
      size={size}
      {...rest}
    />
  );
}

interface CylinderProps {
  position?: Vec3;
  radius: number;
  radiusBottom?: number;
  height: number;
  color: string;
  segments?: number;
  rotation?: Vec3;
}

export function Cylinder({
  position = [0, 0, 0],
  radius,
  radiusBottom,
  height,
  color,
  segments = 8,
  rotation,
}: CylinderProps) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      material={solid(color)}
      castShadow
      receiveShadow
    >
      <cylinderGeometry
        args={[radius, radiusBottom ?? radius, height, segments]}
      />
    </mesh>
  );
}

function useGableGeometry(span: number, height: number, length: number) {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-span / 2, 0);
    shape.lineTo(span / 2, 0);
    shape.lineTo(0, height);
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: length,
      bevelEnabled: false,
    });
    geometry.translate(0, 0, -length / 2);
    // Run the ridge along x.
    geometry.rotateY(Math.PI / 2);
    return geometry;
  }, [span, height, length]);
}

interface PitchedRoofProps {
  /** Bottom centre of the roof, on top of the walls. */
  position: Vec3;
  /** Along the ridge (x). */
  length: number;
  /** Across the ridge (z). */
  span: number;
  height: number;
  wallColor: string;
  roofColor: string;
  overhang?: number;
  thickness?: number;
}

/** Gable walls plus two roof slopes, with the ridge along x. */
export function PitchedRoof({
  position,
  length,
  span,
  height,
  wallColor,
  roofColor,
  overhang = 0.35,
  thickness = 0.18,
}: PitchedRoofProps) {
  const gable = useGableGeometry(span, height, length);
  const half = span / 2;
  const rafter = Math.hypot(half, height);
  const slope = rafter + overhang;
  const angle = Math.atan2(height, half);
  const panelLength = length + overhang * 2;
  // Panel centre: halfway down the slope from the ridge, pushed out by half its thickness.
  const along = slope / 2 / rafter;
  const centreZ = half * along + ((height / rafter) * thickness) / 2;
  const centreY = height - height * along + ((half / rafter) * thickness) / 2;

  return (
    <group position={position}>
      <mesh geometry={gable} material={solid(wallColor)} castShadow receiveShadow />
      {[1, -1].map((side) => (
        <mesh
          key={side}
          position={[0, centreY, side * centreZ]}
          rotation={[side * angle, 0, 0]}
          material={solid(roofColor)}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[panelLength, thickness, slope]} />
        </mesh>
      ))}
      <Box
        position={[0, height + thickness * 0.55, 0]}
        size={[panelLength, thickness * 1.2, thickness * 2.2]}
        color={roofColor}
      />
    </group>
  );
}

type Facing = "front" | "side";

interface WindowProps {
  /** Centre of the window on the wall surface. */
  position: Vec3;
  width?: number;
  height?: number;
  /** `front` sits on a wall facing +z, `side` on a wall facing +x. */
  facing?: Facing;
  frame?: string;
  shutters?: string;
}

/** A framed window that glows at night, with optional shutters. */
export function Window({
  position,
  width = 0.9,
  height = 1.1,
  facing = "front",
  frame = "#f5f2ea",
  shutters,
}: WindowProps) {
  const rotation: Vec3 = facing === "front" ? [0, 0, 0] : [0, Math.PI / 2, 0];
  return (
    <group position={position} rotation={rotation}>
      <Box size={[width + 0.16, height + 0.16, 0.08]} color={frame} shadow={false} />
      <Box
        position={[0, 0, 0.03]}
        size={[width, height, 0.06]}
        material={glow.window}
        shadow={false}
      />
      <Box position={[0, 0, 0.07]} size={[0.06, height, 0.04]} color={frame} shadow={false} />
      {shutters &&
        [-1, 1].map((side) => (
          <Box
            key={side}
            position={[side * (width / 2 + 0.3), 0, 0.04]}
            size={[0.42, height + 0.1, 0.06]}
            color={shutters}
            shadow={false}
          />
        ))}
    </group>
  );
}

interface DoorProps {
  /** Bottom centre of the door on the wall surface. */
  position: Vec3;
  width?: number;
  height?: number;
  color: string;
  facing?: Facing;
  frame?: string;
}

export function Door({
  position,
  width = 1,
  height = 1.9,
  color,
  facing = "front",
  frame = "#f5f2ea",
}: DoorProps) {
  const rotation: Vec3 = facing === "front" ? [0, 0, 0] : [0, Math.PI / 2, 0];
  return (
    <group position={position} rotation={rotation}>
      <Box position={[0, height / 2 + 0.04, 0]} size={[width + 0.16, height + 0.08, 0.08]} color={frame} shadow={false} />
      <Box position={[0, height / 2, 0.04]} size={[width, height, 0.08]} color={color} shadow={false} />
      <Box position={[width * 0.32, height * 0.48, 0.1]} size={[0.08, 0.08, 0.05]} color="#d8b45a" shadow={false} />
    </group>
  );
}
