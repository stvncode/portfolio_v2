"use client";

import { type ThreeEvent, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { angleDelta } from "@/lib/town/movement";
import { DYNAMIC } from "../kit/batched";
import { Burst } from "../kit/burst";
import { glow, PALETTE, solid } from "../kit/materials";
import { Block, Box } from "../kit/shapes";
import { Sign } from "../kit/sign";
import { Spot } from "../scene/spot";
import { useTown } from "../town-context";
import { PITCH_ORIGIN, PLAYER_RADIUS } from "../world-layout";

const TURF = "#6fae4f";
const TURF_STRIPE = "#79b858";
const HALF_LENGTH = 8;
const HALF_WIDTH = 5;
const LINE = 0.12;
const GOAL_HALF = 1.6;
const BALL_RADIUS = 0.6;
const CAR_RADIUS = 0.95;
/** Slower than you on foot (6.5), so you can beat it to the ball. */
const CAR_SPEED = 3.3;
const CAR_TURN = 2.2;
/** The car waits this long after kick-off, to give you first touch. */
const HEAD_START = 1.2;
/** How much of a kicker's speed the ball takes: more than 1 makes it fly off the foot. */
const KICK = 1.5;
const FRICTION = 1.1;
const WALL_BOUNCE = 0.75;
/** A ball pinned against the boards this long gets popped back into play. */
const STUCK_SECONDS = 1.2;
/** After a goal: a moment to celebrate, then back to the centre spot. */
const RESET_SECONDS = 1.3;
const YOU_COLOR = "#f29b38";
const CAR_COLOR = "#2f6fe0";

interface Body {
  x: number;
  z: number;
  vx: number;
  vz: number;
}

interface Score {
  you: number;
  car: number;
}

/** Bumps the ball away from something moving into it. */
function kick(ball: Body, x: number, z: number, vx: number, vz: number, reach: number) {
  const dx = ball.x - x;
  const dz = ball.z - z;
  const distance = Math.hypot(dx, dz);
  if (distance >= reach || distance === 0) return;
  const nx = dx / distance;
  const nz = dz / distance;
  ball.x = x + nx * reach;
  ball.z = z + nz * reach;
  const closing = (vx - ball.vx) * nx + (vz - ball.vz) * nz;
  if (closing > 0) {
    ball.vx += nx * closing * KICK;
    ball.vz += nz * closing * KICK;
  }
}

function Goal({ side, color }: { side: 1 | -1; color: string }) {
  return (
    <group position={[side * (HALF_LENGTH + 0.6), 0, 0]}>
      {[-GOAL_HALF, GOAL_HALF].map((z) => (
        <Block key={z} position={[0, 0, z]} size={[0.14, 1.9, 0.14]} color={color} />
      ))}
      <Box position={[0, 1.9, 0]} size={[0.14, 0.14, GOAL_HALF * 2 + 0.14]} color={color} />
      <mesh position={[side * 0.6, 0.95, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[GOAL_HALF * 2, 1.9]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Car() {
  return (
    <group rotation={[0, -Math.PI / 2, 0]}>
      <Block position={[0, 0.25, 0]} size={[1.7, 0.45, 0.95]} color={CAR_COLOR} />
      <Block position={[-0.15, 0.7, 0]} size={[0.8, 0.35, 0.8]} color="#1e2a44" />
      <Box position={[-0.85, 0.85, 0]} size={[0.12, 0.08, 0.95]} color={YOU_COLOR} />
      <Box position={[0.86, 0.45, 0]} size={[0.04, 0.16, 0.7]} material={glow.bulb} />
      {[
        [0.55, 0.5],
        [0.55, -0.5],
        [-0.55, 0.5],
        [-0.55, -0.5],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.22, z]} rotation={[Math.PI / 2, 0, 0]} material={solid("#1c1d21")} castShadow>
          <cylinderGeometry args={[0.24, 0.24, 0.16, 10]} />
        </mesh>
      ))}
    </group>
  );
}

interface PitchProps {
  /** Everything the place's bubble and marker need. */
  spot: Omit<Parameters<typeof Spot>[0], "position" | "bubbleHeight" | "children">;
}

/** Car football behind the house: walk into the ball to kick it, and try to beat the car. */
export function Pitch({ spot }: PitchProps) {
  const town = useTown();
  const [score, setScore] = useState<Score>({ you: 0, car: 0 });
  const [cheer, setCheer] = useState({ count: 0, x: 0 });
  const ball = useRef<Body>({ x: 0, z: 0, vx: 0, vz: 0 });
  const car = useRef({ x: -5, z: 0, vx: 0, vz: 0, heading: Math.PI / 2 });
  const resetAt = useRef(-1);
  const kickOffAt = useRef(0);
  const wasPlaying = useRef(false);
  const stuckFor = useRef(0);
  const ballMesh = useRef<THREE.Mesh>(null);
  const carGroup = useRef<THREE.Group>(null);
  const flame = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const time = clock.elapsedTime;
    const body = ball.current;
    const racer = car.current;
    const playerX = town.player.current.x - PITCH_ORIGIN[0];
    const playerZ = town.player.current.z - PITCH_ORIGIN[1];
    // The car only plays when you're on the pitch; otherwise it does lazy laps.
    const playing = Math.abs(playerX) < HALF_LENGTH + 1.5 && Math.abs(playerZ) < HALF_WIDTH + 1.5;
    const celebrating = resetAt.current >= 0;
    // Stepping onto the pitch counts as a kick-off: the car gives you a moment.
    if (playing && !wasPlaying.current) kickOffAt.current = time;
    wasPlaying.current = playing;

    let aimX = Math.cos(time * 0.5) * 4.4;
    let aimZ = Math.sin(time * 0.5) * 2.8;
    if (playing && !celebrating) {
      // Get behind the ball, then drive it at the orange goal.
      const goalX = HALF_LENGTH - body.x;
      const goalZ = -body.z;
      const length = Math.hypot(goalX, goalZ) || 1;
      const behind = ((body.x - racer.x) * goalX + (body.z - racer.z) * goalZ) / length > 0.4;
      aimX = behind ? body.x : body.x - (goalX / length) * 1.6;
      aimZ = behind ? body.z : body.z - (goalZ / length) * 1.6;
    }
    const wanted = Math.atan2(aimX - racer.x, aimZ - racer.z);
    const turn = THREE.MathUtils.clamp(angleDelta(racer.heading, wanted), -CAR_TURN * delta, CAR_TURN * delta);
    racer.heading += turn;
    const waiting = playing && time < kickOffAt.current + HEAD_START;
    const speed = celebrating || waiting ? 0 : CAR_SPEED * (playing ? 1 : 0.6);
    racer.vx = Math.sin(racer.heading) * speed;
    racer.vz = Math.cos(racer.heading) * speed;
    racer.x = THREE.MathUtils.clamp(racer.x + racer.vx * delta, -HALF_LENGTH + 0.9, HALF_LENGTH - 0.9);
    racer.z = THREE.MathUtils.clamp(racer.z + racer.vz * delta, -HALF_WIDTH + 0.7, HALF_WIDTH - 0.7);

    if (!celebrating) {
      kick(body, playerX, playerZ, town.player.current.vx, town.player.current.vz, PLAYER_RADIUS + BALL_RADIUS);
      kick(body, racer.x, racer.z, racer.vx, racer.vz, CAR_RADIUS + BALL_RADIUS);
    }
    body.x += body.vx * delta;
    body.z += body.vz * delta;
    const drag = Math.exp(-FRICTION * (celebrating ? 4 : 1) * delta);
    body.vx *= drag;
    body.vz *= drag;

    if (Math.abs(body.z) > HALF_WIDTH - BALL_RADIUS) {
      body.z = Math.sign(body.z) * (HALF_WIDTH - BALL_RADIUS);
      body.vz *= -WALL_BOUNCE;
    }
    if (!celebrating && Math.abs(body.x) > HALF_LENGTH - BALL_RADIUS) {
      const inGoalMouth = Math.abs(body.z) < GOAL_HALF - 0.15;
      if (!inGoalMouth) {
        body.x = Math.sign(body.x) * (HALF_LENGTH - BALL_RADIUS);
        body.vx *= -WALL_BOUNCE;
      } else if (Math.abs(body.x) > HALF_LENGTH + 0.25) {
        const youScored = body.x < 0;
        setScore((current) => (youScored ? { ...current, you: current.you + 1 } : { ...current, car: current.car + 1 }));
        setCheer((current) => ({ count: current.count + 1, x: Math.sign(body.x) * HALF_LENGTH }));
        resetAt.current = time + RESET_SECONDS;
      }
    }
    // Pinned in a corner by the car: pop it back towards the middle, like a rebound.
    const pinned =
      Math.hypot(body.vx, body.vz) < 1.5 &&
      (Math.abs(body.x) > HALF_LENGTH - 1.1 || Math.abs(body.z) > HALF_WIDTH - 1.1);
    stuckFor.current = pinned && !celebrating ? stuckFor.current + delta : 0;
    if (stuckFor.current > STUCK_SECONDS) {
      stuckFor.current = 0;
      body.vx = -Math.sign(body.x) * 6;
      body.vz = -Math.sign(body.z || 1) * 4.5;
    }
    if (celebrating && time > resetAt.current) {
      resetAt.current = -1;
      kickOffAt.current = time;
      Object.assign(body, { x: 0, z: 0, vx: 0, vz: 0 });
      // The car lines up off-centre, so it can't just drive the ball straight in.
      Object.assign(racer, { x: -5.5, z: Math.sin(time * 7) > 0 ? 3 : -3, heading: Math.PI / 2 });
    }

    if (ballMesh.current) {
      ballMesh.current.position.set(body.x, BALL_RADIUS, body.z);
      ballMesh.current.rotation.x += (body.vz * delta) / BALL_RADIUS;
      ballMesh.current.rotation.z -= (body.vx * delta) / BALL_RADIUS;
    }
    if (carGroup.current) {
      carGroup.current.position.set(racer.x, 0, racer.z);
      carGroup.current.rotation.y = racer.heading;
    }
    if (flame.current) {
      flame.current.visible = playing && !celebrating;
      flame.current.scale.z = 0.8 + Math.sin(time * 30) * 0.25;
    }
  });

  function handleTurfClick(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    town.walkTo(event.point.x, event.point.z);
  }

  return (
    <group position={[PITCH_ORIGIN[0], 0, PITCH_ORIGIN[1]]}>
      <group onPointerDown={handleTurfClick}>
        {Array.from({ length: 8 }, (_, index) => (
          <mesh
            key={index}
            position={[-HALF_LENGTH + 1 + index * 2, 0.03, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            material={solid(index % 2 ? TURF : TURF_STRIPE)}
            receiveShadow
          >
            <planeGeometry args={[2, HALF_WIDTH * 2]} />
          </mesh>
        ))}
        {[-1, 1].map((side) => (
          <Box key={`z${side}`} position={[0, 0.05, side * HALF_WIDTH]} size={[HALF_LENGTH * 2, 0.02, LINE]} color={PALETTE.white} shadow={false} />
        ))}
        {[-1, 0, 1].map((side) => (
          <Box key={`x${side}`} position={[side * HALF_LENGTH, 0.05, 0]} size={[LINE, 0.02, HALF_WIDTH * 2]} color={PALETTE.white} shadow={false} />
        ))}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} material={solid(PALETTE.white)}>
          <ringGeometry args={[1.7, 1.82, 32]} />
        </mesh>
      </group>

      <Spot {...spot} position={[0, 0, 0]} bubbleHeight={4.4}>
        <Goal side={-1} color={CAR_COLOR} />
        <Goal side={1} color={YOU_COLOR} />
        {/* The scoreboard, on the house side of the pitch, clear of where you walk in. */}
        <group position={[4.8, 0, -HALF_WIDTH - 0.7]}>
          {[-1.5, 1.5].map((x) => (
            <Block key={x} position={[x, 0, 0]} size={[0.14, 2.2, 0.14]} color={PALETTE.woodDark} />
          ))}
          <Box position={[0, 2.5, 0]} size={[3.6, 1.1, 0.16]} color="#20242c" />
          <Sign
            text={`YOU ${score.you}  :  ${score.car} CAR`}
            position={[0, 2.5, 0.09]}
            width={3.3}
            background="#20242c"
            color="#ffd76a"
            font="800 72px ui-monospace, Menlo, monospace"
            glow
          />
        </group>
      </Spot>

      <mesh ref={ballMesh} position={[0, BALL_RADIUS, 0]} material={solid("#e6e7e9")} castShadow userData={DYNAMIC}>
        <icosahedronGeometry args={[BALL_RADIUS, 1]} />
      </mesh>
      <group ref={carGroup} userData={DYNAMIC}>
        <Car />
        <mesh ref={flame} position={[0, 0.42, -1.15]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
          <coneGeometry args={[0.16, 0.7, 6]} />
          <meshBasicMaterial color="#ffb347" />
        </mesh>
      </group>
      <Burst trigger={cheer.count} kind="confetti" position={[cheer.x, 1.2, 0]} />
    </group>
  );
}
