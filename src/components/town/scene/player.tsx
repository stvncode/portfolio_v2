"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import { angleDelta, screenToWorld, slide } from "@/lib/town/movement";
import { type Area, OUTSIDE_ID } from "../areas";
import { Figure, type FigureMotion, STEVEN } from "../kit/figure";
import { useTown } from "../town-context";
import { PLAYER_RADIUS } from "../world-layout";

const SPEED = 6.5;
const ARRIVE_DISTANCE = 0.15;
const TURN_RATE = 12;
const STRIDE = 2.4;
const MAX_FRAME = 0.05;
const DUST_PUFFS = 6;
const DUST_SECONDS = 0.55;

const KEY_UP = ["arrowup", "w", "z"];
const KEY_DOWN = ["arrowdown", "s"];
const KEY_LEFT = ["arrowleft", "a", "q"];
const KEY_RIGHT = ["arrowright", "d"];

function held(keys: Set<string>, names: string[]) {
  return names.some((name) => keys.has(name)) ? 1 : 0;
}

function nearestSpot(area: Area, x: number, z: number): string | null {
  let best: string | null = null;
  let bestDistance = Infinity;
  for (const spot of area.spots) {
    const distance = Math.hypot(spot.x - x, spot.z - z);
    if (distance < (spot.radius ?? area.nearDistance) && distance < bestDistance) {
      best = spot.id;
      bestDistance = distance;
    }
  }
  return best;
}

interface Puff {
  x: number;
  z: number;
  bornAt: number;
}

/** You: click to walk, or use the arrow keys / WASD / ZQSD. */
export function Player() {
  const town = useTown();
  const group = useRef<THREE.Group>(null);
  const motion = useRef<FigureMotion>({ phase: 0, speed: 0 });
  const nearby = useRef<string | null>(null);
  const dust = useRef<THREE.Mesh[]>([]);
  const puffs = useRef<Puff[]>([]);
  const lastStep = useRef(0);

  useFrame(({ clock }, rawDelta) => {
    const delta = Math.min(rawDelta, MAX_FRAME);
    const area = town.areaNow.current;
    const player = town.player.current;
    const keys = town.keys.current;
    const right = held(keys, KEY_RIGHT) - held(keys, KEY_LEFT);
    const down = held(keys, KEY_DOWN) - held(keys, KEY_UP);

    let direction = { x: 0, z: 0 };
    let stepLength = SPEED * delta;
    if (town.intro) {
      town.target.current = null;
    } else if (right || down) {
      town.target.current = null;
      direction = screenToWorld(right, down);
    } else if (town.target.current) {
      const target = town.target.current;
      const waypoint = target.path[0];
      const dx = waypoint ? waypoint.x - player.x : 0;
      const dz = waypoint ? waypoint.z - player.z : 0;
      const distance = Math.hypot(dx, dz);
      if (distance < ARRIVE_DISTANCE) {
        target.path.shift();
        if (target.path.length === 0) {
          town.target.current = null;
          if (target.placeId) town.arrive(target.placeId);
        }
      } else {
        direction = { x: dx / distance, z: dz / distance };
        stepLength = Math.min(distance, stepLength);
      }
    }

    const moving = direction.x !== 0 || direction.z !== 0;
    const before = { x: player.x, z: player.z };
    if (moving) {
      const next = slide(
        player.x,
        player.z,
        direction.x * stepLength,
        direction.z * stepLength,
        PLAYER_RADIUS,
        area.obstacles,
        area.bounds,
      );
      const travelled = Math.hypot(next.x - player.x, next.z - player.z);
      if (travelled < 0.0001 && town.target.current) {
        // Blocked: give up, but still act on the spot if we got close enough.
        const target = town.target.current;
        town.target.current = null;
        if (target.placeId && nearestSpot(area, player.x, player.z) === target.placeId) {
          town.arrive(target.placeId);
        }
      }
      player.x = next.x;
      player.z = next.z;
      const wanted = Math.atan2(direction.x, direction.z);
      player.heading += angleDelta(player.heading, wanted) * Math.min(1, TURN_RATE * delta);
      motion.current.phase += (travelled / STRIDE) * Math.PI * 2;
    }
    player.vx = (player.x - before.x) / delta;
    player.vz = (player.z - before.z) / delta;
    motion.current.speed += ((moving ? 1 : 0) - motion.current.speed) * Math.min(1, 10 * delta);

    if (group.current) {
      group.current.position.set(player.x, 0, player.z);
      group.current.rotation.y = player.heading;
    }

    // A puff of dust at every footfall, outdoors only.
    const step = Math.floor(motion.current.phase / Math.PI);
    if (moving && step !== lastStep.current && area.id === OUTSIDE_ID) {
      puffs.current[step % DUST_PUFFS] = { x: player.x, z: player.z, bornAt: clock.elapsedTime };
    }
    lastStep.current = step;
    dust.current.forEach((mesh, index) => {
      const puff = puffs.current[index];
      const age = puff ? (clock.elapsedTime - puff.bornAt) / DUST_SECONDS : 1;
      mesh.visible = age < 1;
      if (!puff || age >= 1) return;
      mesh.position.set(puff.x, 0.08 + age * 0.25, puff.z);
      mesh.scale.setScalar(0.1 + age * 0.22);
      (mesh.material as THREE.MeshBasicMaterial).opacity = 0.35 * (1 - age);
    });

    const near = nearestSpot(area, player.x, player.z);
    if (near !== nearby.current) {
      nearby.current = near;
      town.setNearby(near);
    }
  });

  return (
    <>
      <group ref={group}>
        <Figure look={STEVEN} motion={motion} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <circleGeometry args={[0.45, 20]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.14} depthWrite={false} />
        </mesh>
      </group>
      {Array.from({ length: DUST_PUFFS }, (_, index) => (
        <mesh
          key={index}
          ref={(mesh) => {
            if (mesh) dust.current[index] = mesh;
          }}
          visible={false}
        >
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#e9dfc6" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}
