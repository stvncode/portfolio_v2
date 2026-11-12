"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { angleDelta } from "@/lib/town/movement";
import { useTown } from "../town-context";
import { Batched, DYNAMIC } from "./batched";
import type { Watcher } from "./figure";
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
  /** Follow the player with the head when they come close. */
  watch?: Watcher;
  /** Bump this number when the cat is petted. */
  petted?: number;
}

const TAIL_SWAY = 0.35;
const TAIL_SPEED = 1.6;
const WATCH_DISTANCE = 6;
const MAX_HEAD_TURN = 1.2;
const PET_SECONDS = 1.6;
const BLINK_EVERY = 4;
const BLINK_SECONDS = 0.14;

/** A small blocky cat facing +z, paws at y = 0. */
export function Cat({
  look,
  position,
  rotation,
  scale = 1,
  sitting = false,
  watch,
  petted = 0,
}: CatProps) {
  const town = useTown();
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const offset = useRef(Math.random() * Math.PI * 2);
  const pettedAt = useRef(-10);
  const now = useRef(0);

  useEffect(() => {
    if (petted > 0) pettedAt.current = now.current;
  }, [petted]);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    now.current = time;
    const happy = time - pettedAt.current < PET_SECONDS;
    if (tail.current) {
      // A happy cat holds its tail up and quivers it.
      tail.current.rotation.y =
        Math.sin(time * (happy ? 9 : TAIL_SPEED) + offset.current) *
        (happy ? 0.15 : TAIL_SWAY);
      const lift = happy ? -0.7 : 0;
      tail.current.rotation.x +=
        (lift - tail.current.rotation.x) * Math.min(1, delta * 8);
    }
    if (body.current) {
      // Breathing, and leaning into the hand when petted.
      const lean = happy ? Math.sin((time - pettedAt.current) * 8) * 0.04 : 0;
      body.current.scale.set(
        1 + lean,
        1 + Math.sin(time * 2.2 + offset.current) * 0.015 - lean,
        1,
      );
    }
    if (eyes.current) {
      const blinking = (time + offset.current) % BLINK_EVERY < BLINK_SECONDS;
      eyes.current.scale.y = happy || blinking ? 0.15 : 1;
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
        (turn - head.current.rotation.y) * Math.min(1, delta * 4);
    }
  });

  const bodyY = sitting ? 0.3 : 0.26;
  const tailRadius = look.fluffy ? 0.075 : 0.04;

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      userData={DYNAMIC}
    >
      <group ref={body}>
        <Batched>
          {sitting ? (
            <>
              <Box
                position={[0, 0.24, -0.05]}
                size={[0.3, 0.42, 0.34]}
                rotation={[-0.25, 0, 0]}
                color={look.fur}
              />
              {[-0.08, 0.08].map((x) => (
                <Box
                  key={x}
                  position={[x, 0.14, 0.12]}
                  size={[0.07, 0.28, 0.08]}
                  color={look.fur}
                />
              ))}
            </>
          ) : (
            <>
              <Box
                position={[0, bodyY, 0]}
                size={[0.28, 0.24, 0.56]}
                color={look.fur}
              />
              {[
                [-0.09, 0.18],
                [0.09, 0.18],
                [-0.09, -0.2],
                [0.09, -0.2],
              ].map(([x, z]) => (
                <Box
                  key={`${x}${z}`}
                  position={[x, 0.08, z]}
                  size={[0.08, 0.16, 0.08]}
                  color={look.fur}
                />
              ))}
            </>
          )}
          {look.fluffy && (
            <Box
              position={[0, sitting ? 0.36 : 0.3, sitting ? 0.1 : 0.27]}
              size={[0.32, 0.22, 0.12]}
              color={look.belly}
            />
          )}
        </Batched>
      </group>
      <group
        ref={head}
        position={[0, sitting ? 0.52 : 0.42, sitting ? 0.06 : 0.3]}
      >
        <Box size={[0.26, 0.22, 0.22]} color={look.fur} />
        <Box
          position={[0, -0.05, 0.11]}
          size={[0.12, 0.08, 0.04]}
          color={look.belly}
          shadow={false}
        />
        <Box
          position={[0, -0.03, 0.135]}
          size={[0.035, 0.025, 0.01]}
          color="#e8a0a0"
          shadow={false}
        />
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
        <group ref={eyes} position={[0, 0.02, 0.115]}>
          {[-0.06, 0.06].map((x) => (
            <Box
              key={x}
              position={[x, 0, 0]}
              size={[0.045, 0.045, 0.01]}
              color={look.eyes}
              shadow={false}
            />
          ))}
        </group>
      </group>
      <group
        ref={tail}
        position={[0, sitting ? 0.1 : 0.34, sitting ? -0.22 : -0.28]}
      >
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
