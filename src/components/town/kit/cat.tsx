"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import { solid } from "./materials";
import { Box, type Vec3 } from "./shapes";

export interface CatLook {
  fur: string;
  belly: string;
  eyes: string;
  /** Maine Coons get a ruff, ear tufts and a bushy tail. */
  fluffy?: boolean;
}

interface CatProps {
  look: CatLook;
  position?: Vec3;
  rotation?: Vec3;
  scale?: number;
  sitting?: boolean;
}

const TAIL_SWAY = 0.35;
const TAIL_SPEED = 1.6;

/** A small blocky cat facing +z, paws at y = 0. */
export function Cat({ look, position, rotation, scale = 1, sitting = false }: CatProps) {
  const tail = useRef<THREE.Group>(null);
  const offset = useRef(Math.random() * Math.PI * 2);

  useFrame(({ clock }) => {
    if (!tail.current) return;
    tail.current.rotation.y =
      Math.sin(clock.elapsedTime * TAIL_SPEED + offset.current) * TAIL_SWAY;
  });

  const bodyY = sitting ? 0.3 : 0.26;
  const tailRadius = look.fluffy ? 0.075 : 0.04;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {sitting ? (
        <Box position={[0, 0.24, -0.05]} size={[0.3, 0.42, 0.34]} rotation={[-0.25, 0, 0]} color={look.fur} />
      ) : (
        <>
          <Box position={[0, bodyY, 0]} size={[0.28, 0.24, 0.56]} color={look.fur} />
          {[
            [-0.09, 0.18],
            [0.09, 0.18],
            [-0.09, -0.2],
            [0.09, -0.2],
          ].map(([x, z]) => (
            <Box key={`${x}${z}`} position={[x, 0.08, z]} size={[0.08, 0.16, 0.08]} color={look.fur} />
          ))}
        </>
      )}
      {look.fluffy && (
        <Box position={[0, sitting ? 0.36 : 0.3, sitting ? 0.1 : 0.27]} size={[0.32, 0.22, 0.12]} color={look.belly} />
      )}
      <group position={[0, sitting ? 0.52 : 0.42, sitting ? 0.06 : 0.3]}>
        <Box size={[0.26, 0.22, 0.22]} color={look.fur} />
        <Box position={[0, -0.05, 0.11]} size={[0.12, 0.08, 0.04]} color={look.belly} shadow={false} />
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.08, 0.13, -0.02]}>
            <mesh material={solid(look.fur)} castShadow>
              <coneGeometry args={[0.055, 0.12, 4]} />
            </mesh>
            {look.fluffy && (
              <mesh position={[0, 0.08, 0]} material={solid(look.belly)}>
                <coneGeometry args={[0.015, 0.06, 3]} />
              </mesh>
            )}
          </group>
        ))}
        {[-0.06, 0.06].map((x) => (
          <Box key={x} position={[x, 0.02, 0.115]} size={[0.045, 0.045, 0.01]} color={look.eyes} shadow={false} />
        ))}
      </group>
      <group ref={tail} position={[0, sitting ? 0.1 : 0.34, sitting ? -0.22 : -0.28]}>
        <mesh
          position={[0, sitting ? 0 : 0.14, -0.14]}
          rotation={[sitting ? Math.PI / 2 : -0.7, 0, 0]}
          material={solid(look.fur)}
          castShadow
        >
          <cylinderGeometry args={[tailRadius, tailRadius * 0.8, 0.36, 6]} />
        </mesh>
      </group>
    </group>
  );
}

export const PLUME: CatLook = {
  fur: "#1c1c21",
  belly: "#2a2a30",
  eyes: "#e8c547",
};

export const PONYO: CatLook = {
  fur: "#8b6544",
  belly: "#e9dcc6",
  eyes: "#7fb069",
  fluffy: true,
};
