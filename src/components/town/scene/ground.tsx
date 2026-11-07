"use client";

import type { ThreeEvent } from "@react-three/fiber";
import { PALETTE, solid } from "../kit/materials";
import { FIELDS, PATHS, PLAZA, type Rect } from "../world-layout";

const GROUND_SIZE = 320;

interface GroundProps {
  onWalkTo: (x: number, z: number) => void;
}

function Patch({ rect, color, y }: { rect: Rect; color: string; y: number }) {
  return (
    <mesh position={[rect.x, y, rect.z]} rotation={[-Math.PI / 2, 0, 0]} material={solid(color)} receiveShadow>
      <planeGeometry args={[rect.w, rect.d]} />
    </mesh>
  );
}

/** Grass, fields, paths and the cobbled square. Clicking anywhere on it walks there. */
export function Ground({ onWalkTo }: GroundProps) {
  function handlePointerDown(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    onWalkTo(event.point.x, event.point.z);
  }

  return (
    <group onPointerDown={handlePointerDown}>
      <Patch rect={{ x: 0, z: 0, w: GROUND_SIZE, d: GROUND_SIZE }} color={PALETTE.grass} y={0} />
      {FIELDS.map((field) => (
        <Patch key={`${field.x}:${field.z}`} rect={field} color={field.color} y={0.01} />
      ))}
      {PATHS.map((path) => (
        <Patch key={`${path.x}:${path.z}`} rect={path} color={PALETTE.path} y={0.02} />
      ))}
      <Patch rect={PLAZA} color={PALETTE.cobble} y={0.03} />
    </group>
  );
}
