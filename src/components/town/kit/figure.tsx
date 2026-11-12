"use client";

import { useFrame } from "@react-three/fiber";
import { type MutableRefObject, useEffect, useRef } from "react";
import * as THREE from "three";
import { angleDelta } from "@/lib/town/movement";
import { useTown } from "../town-context";
import { Batched, DYNAMIC } from "./batched";
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

/** Where a standing figure is in the world, so it can turn its head to you. */
export interface Watcher {
  x: number;
  z: number;
  /** The way the body faces, in radians. */
  facing: number;
}

interface FigureProps {
  look: FigureLook;
  position?: Vec3;
  rotation?: Vec3;
  scale?: number;
  motion?: MutableRefObject<FigureMotion>;
  /** Follow the player with the head when they come close. */
  watch?: Watcher;
  /** Bump this number to make the figure wave. */
  wave?: number;
  /** Hop while waving, the way small children say hello. */
  hops?: boolean;
}

const SWING = 0.7;
const LEG_HEIGHT = 0.72;
const TORSO_HEIGHT = 0.6;
const HEAD = 0.4;
const WALK_BOB = 0.05;
const BREATH = 0.012;
const WATCH_DISTANCE = 7;
const MAX_HEAD_TURN = 1.1;
const WAVE_SECONDS = 1.8;
const ARM_UP = 2.5;

/** A small blocky person. Feet sit at y = 0, facing +z. */
export function Figure({
  look,
  position,
  rotation,
  scale = 1,
  motion,
  watch,
  wave = 0,
  hops = false,
}: FigureProps) {
  const town = useTown();
  const root = useRef<THREE.Group>(null);
  const upper = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const seed = useRef(Math.random() * 10);
  const waveStart = useRef(-10);
  const now = useRef(0);

  useEffect(() => {
    if (wave > 0) waveStart.current = now.current;
  }, [wave]);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    now.current = time;
    const phase = motion?.current.phase ?? 0;
    const speed = motion?.current.speed ?? 0;
    const swing = Math.sin(phase) * SWING * speed;
    if (leftLeg.current) leftLeg.current.rotation.x = swing;
    if (rightLeg.current) rightLeg.current.rotation.x = -swing;
    if (leftArm.current) leftArm.current.rotation.x = -swing * 0.8;

    const waving = time - waveStart.current < WAVE_SECONDS;
    if (rightArm.current) {
      const arm = rightArm.current.rotation;
      arm.x = waving ? 0 : swing * 0.8;
      const lift = waving ? ARM_UP + Math.sin(time * 14) * 0.3 : 0;
      arm.z += (lift - arm.z) * Math.min(1, delta * 12);
    }
    if (root.current) {
      const hop =
        waving && hops
          ? Math.abs(Math.sin((time - waveStart.current) * 9)) * 0.22
          : 0;
      root.current.position.y = (position?.[1] ?? 0) + hop * scale;
    }
    if (upper.current) {
      upper.current.position.y =
        Math.sin(time * 1.8 + seed.current) * BREATH +
        Math.abs(Math.sin(phase)) * WALK_BOB * speed;
    }
    if (head.current && watch) {
      const dx = town.player.current.x - watch.x;
      const dz = town.player.current.z - watch.z;
      const close = Math.hypot(dx, dz) < WATCH_DISTANCE;
      const turn = close
        ? THREE.MathUtils.clamp(
            angleDelta(watch.facing, Math.atan2(dx, dz)),
            -MAX_HEAD_TURN,
            MAX_HEAD_TURN,
          )
        : 0;
      head.current.rotation.y +=
        (turn - head.current.rotation.y) * Math.min(1, delta * 5);
    }
  });

  const shoulderY = LEG_HEIGHT + TORSO_HEIGHT - 0.06;
  const headY = LEG_HEIGHT + TORSO_HEIGHT + HEAD / 2 + 0.02;

  return (
    <group
      ref={root}
      position={position}
      rotation={rotation}
      scale={scale}
      userData={DYNAMIC}
    >
      {[
        { ref: leftLeg, x: -0.12 },
        { ref: rightLeg, x: 0.12 },
      ].map(({ ref, x }) => (
        <group key={x} ref={ref} position={[x, LEG_HEIGHT, 0]}>
          <Batched>
            <Box
              position={[0, -LEG_HEIGHT / 2, 0]}
              size={[0.19, LEG_HEIGHT, 0.21]}
              color={look.bottom}
            />
            <Box
              position={[0, -LEG_HEIGHT + 0.05, 0.04]}
              size={[0.2, 0.1, 0.28]}
              color={look.shoes}
            />
          </Batched>
        </group>
      ))}
      <group ref={upper}>
        <Box
          position={[0, LEG_HEIGHT + TORSO_HEIGHT / 2, 0]}
          size={[0.5, TORSO_HEIGHT, 0.3]}
          color={look.top}
        />
        {[
          { ref: leftArm, x: -0.33 },
          { ref: rightArm, x: 0.33 },
        ].map(({ ref, x }) => (
          <group key={x} ref={ref} position={[x, shoulderY, 0]}>
            <Batched>
              <Box
                position={[0, -0.26, 0]}
                size={[0.14, 0.52, 0.17]}
                color={look.top}
              />
              <Box
                position={[0, -0.56, 0]}
                size={[0.13, 0.1, 0.15]}
                color={look.skin}
              />
            </Batched>
          </group>
        ))}
        <group ref={head} position={[0, headY, 0]}>
          <Batched>
            <Box size={[HEAD, HEAD, HEAD]} color={look.skin} />
            <Box
              position={[0, HEAD / 2 - 0.03, -0.02]}
              size={[HEAD + 0.04, 0.12, HEAD + 0.02]}
              color={look.hair}
            />
            <Box
              position={[0, 0.02, -HEAD / 2 + 0.02]}
              size={[HEAD + 0.04, HEAD * 0.7, 0.08]}
              color={look.hair}
            />
            {look.longHair && (
              <Box
                position={[0, -0.12, -HEAD / 2 + 0.02]}
                size={[HEAD + 0.06, HEAD * 1.1, 0.12]}
                color={look.hair}
              />
            )}
            {look.beard && (
              <>
                <Box
                  position={[0, -0.12, HEAD / 2 + 0.01]}
                  size={[HEAD + 0.02, 0.16, 0.06]}
                  color={look.beard}
                />
                {[-1, 1].map((side) => (
                  <Box
                    key={side}
                    position={[side * (HEAD / 2 + 0.01), -0.05, 0.06]}
                    size={[0.04, 0.26, 0.22]}
                    color={look.beard}
                  />
                ))}
              </>
            )}
            <Box
              position={[-0.09, 0.03, HEAD / 2 + 0.01]}
              size={[0.06, 0.06, 0.02]}
              color="#24211f"
              shadow={false}
            />
            <Box
              position={[0.09, 0.03, HEAD / 2 + 0.01]}
              size={[0.06, 0.06, 0.02]}
              color="#24211f"
              shadow={false}
            />
            {look.glasses &&
              [-0.09, 0.09].map((x) => (
                <group key={x} position={[x, 0.03, HEAD / 2 + 0.03]}>
                  <Box
                    size={[0.14, 0.02, 0.02]}
                    position={[0, 0.06, 0]}
                    color="#c9a24a"
                    shadow={false}
                  />
                  <Box
                    size={[0.14, 0.02, 0.02]}
                    position={[0, -0.06, 0]}
                    color="#c9a24a"
                    shadow={false}
                  />
                  <Box
                    size={[0.02, 0.12, 0.02]}
                    position={[-0.06, 0, 0]}
                    color="#c9a24a"
                    shadow={false}
                  />
                  <Box
                    size={[0.02, 0.12, 0.02]}
                    position={[0.06, 0, 0]}
                    color="#c9a24a"
                    shadow={false}
                  />
                </group>
              ))}
          </Batched>
        </group>
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
