"use client";

import { useFrame } from "@react-three/fiber";
import { type MutableRefObject, useRef } from "react";
import type * as THREE from "three";
import { Box, type Vec3 } from "./shapes";

export interface FigureLook {
  skin: string;
  hair: string;
  top: string;
  bottom: string;
  shoes: string;
  beard?: string;
  glasses?: boolean;
  longHair?: boolean;
}

/** Motion shared with the figure: `phase` advances while walking, `speed` is 0 to 1. */
export interface FigureMotion {
  phase: number;
  speed: number;
}

interface FigureProps {
  look: FigureLook;
  position?: Vec3;
  rotation?: Vec3;
  scale?: number;
  motion?: MutableRefObject<FigureMotion>;
}

const SWING = 0.7;
const LEG_HEIGHT = 0.72;
const TORSO_HEIGHT = 0.6;
const HEAD = 0.4;

/** A small blocky person. Feet sit at y = 0, facing +z. */
export function Figure({ look, position, rotation, scale = 1, motion }: FigureProps) {
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!motion) return;
    const swing = Math.sin(motion.current.phase) * SWING * motion.current.speed;
    if (leftLeg.current) leftLeg.current.rotation.x = swing;
    if (rightLeg.current) rightLeg.current.rotation.x = -swing;
    if (leftArm.current) leftArm.current.rotation.x = -swing * 0.8;
    if (rightArm.current) rightArm.current.rotation.x = swing * 0.8;
  });

  const shoulderY = LEG_HEIGHT + TORSO_HEIGHT - 0.06;
  const headY = LEG_HEIGHT + TORSO_HEIGHT + HEAD / 2 + 0.02;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {[
        { ref: leftLeg, x: -0.12 },
        { ref: rightLeg, x: 0.12 },
      ].map(({ ref, x }) => (
        <group key={x} ref={ref} position={[x, LEG_HEIGHT, 0]}>
          <Box position={[0, -LEG_HEIGHT / 2, 0]} size={[0.19, LEG_HEIGHT, 0.21]} color={look.bottom} />
          <Box position={[0, -LEG_HEIGHT + 0.05, 0.04]} size={[0.2, 0.1, 0.28]} color={look.shoes} />
        </group>
      ))}
      <Box position={[0, LEG_HEIGHT + TORSO_HEIGHT / 2, 0]} size={[0.5, TORSO_HEIGHT, 0.3]} color={look.top} />
      {[
        { ref: leftArm, x: -0.33 },
        { ref: rightArm, x: 0.33 },
      ].map(({ ref, x }) => (
        <group key={x} ref={ref} position={[x, shoulderY, 0]}>
          <Box position={[0, -0.26, 0]} size={[0.14, 0.52, 0.17]} color={look.top} />
          <Box position={[0, -0.56, 0]} size={[0.13, 0.1, 0.15]} color={look.skin} />
        </group>
      ))}
      <group position={[0, headY, 0]}>
        <Box size={[HEAD, HEAD, HEAD]} color={look.skin} />
        <Box position={[0, HEAD / 2 - 0.03, -0.02]} size={[HEAD + 0.04, 0.12, HEAD + 0.02]} color={look.hair} />
        <Box position={[0, 0.02, -HEAD / 2 + 0.02]} size={[HEAD + 0.04, HEAD * 0.7, 0.08]} color={look.hair} />
        {look.longHair && (
          <Box position={[0, -0.12, -HEAD / 2 + 0.02]} size={[HEAD + 0.06, HEAD * 1.1, 0.12]} color={look.hair} />
        )}
        {look.beard && (
          <>
            <Box position={[0, -0.12, HEAD / 2 + 0.01]} size={[HEAD + 0.02, 0.16, 0.06]} color={look.beard} />
            {[-1, 1].map((side) => (
              <Box key={side} position={[side * (HEAD / 2 + 0.01), -0.05, 0.06]} size={[0.04, 0.26, 0.22]} color={look.beard} />
            ))}
          </>
        )}
        <Box position={[-0.09, 0.03, HEAD / 2 + 0.01]} size={[0.06, 0.06, 0.02]} color="#24211f" shadow={false} />
        <Box position={[0.09, 0.03, HEAD / 2 + 0.01]} size={[0.06, 0.06, 0.02]} color="#24211f" shadow={false} />
        {look.glasses &&
          [-0.09, 0.09].map((x) => (
            <group key={x} position={[x, 0.03, HEAD / 2 + 0.03]}>
              <Box size={[0.14, 0.02, 0.02]} position={[0, 0.06, 0]} color="#c9a24a" shadow={false} />
              <Box size={[0.14, 0.02, 0.02]} position={[0, -0.06, 0]} color="#c9a24a" shadow={false} />
              <Box size={[0.02, 0.12, 0.02]} position={[-0.06, 0, 0]} color="#c9a24a" shadow={false} />
              <Box size={[0.02, 0.12, 0.02]} position={[0.06, 0, 0]} color="#c9a24a" shadow={false} />
            </group>
          ))}
      </group>
    </group>
  );
}

export const STEVEN: FigureLook = {
  skin: "#e7b892",
  hair: "#3a2a20",
  beard: "#33251c",
  glasses: true,
  top: "#202227",
  bottom: "#3b4d66",
  shoes: "#f1f1ee",
};

export const MATHILDE: FigureLook = {
  skin: "#efc4a3",
  hair: "#6b4428",
  longHair: true,
  top: "#c8624f",
  bottom: "#2f3a4f",
  shoes: "#5a3b2a",
};

export const MALO: FigureLook = {
  skin: "#f1c8a8",
  hair: "#7a5233",
  top: "#f2c94c",
  bottom: "#4f78a8",
  shoes: "#e85d4f",
};
