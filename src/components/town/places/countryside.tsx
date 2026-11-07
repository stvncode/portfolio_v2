"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { glow, PALETTE, solid } from "../kit/materials";
import { Block, Box, Cylinder, PitchedRoof } from "../kit/shapes";
import { Sign } from "../kit/sign";
import { useTown } from "../town-context";

const STEEL = "#d7dde3";
const GOLD = "#d9b14a";

function SwordInStone() {
  return (
    <group>
      <mesh position={[0, 0.45, 0]} scale={[1.2, 0.75, 1]} material={solid(PALETTE.granite)} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.8, 0]} />
      </mesh>
      <group position={[0.05, 0.9, 0]} rotation={[0.05, 0.3, 0.08]}>
        <Box position={[0, 0.55, 0]} size={[0.12, 1.1, 0.035]} color={STEEL} />
        <Box position={[0, 1.13, 0]} size={[0.62, 0.08, 0.1]} color={GOLD} />
        <Box position={[0, 1.4, 0]} size={[0.07, 0.46, 0.07]} color="#6b4428" />
        <mesh position={[0, 1.68, 0]} material={solid(GOLD)} castShadow>
          <icosahedronGeometry args={[0.07, 0]} />
        </mesh>
      </group>
    </group>
  );
}

function TreasureChest() {
  return (
    <group rotation={[0, -0.5, 0]}>
      <Block size={[1, 0.55, 0.65]} color={PALETTE.woodDark} />
      <mesh position={[0, 0.58, 0.02]} material={glow.bulb}>
        <boxGeometry args={[0.86, 0.06, 0.52]} />
      </mesh>
      <group position={[0, 0.55, -0.32]} rotation={[-0.9, 0, 0]}>
        <Box position={[0, 0.06, 0.32]} size={[1.02, 0.14, 0.66]} color="#7b5536" />
      </group>
      {[-0.35, 0.35].map((x) => (
        <Box key={x} position={[x, 0.28, 0]} size={[0.08, 0.57, 0.67]} color={GOLD} />
      ))}
      <Box position={[0, 0.38, 0.33]} size={[0.14, 0.16, 0.03]} color={GOLD} />
    </group>
  );
}

function Mushroom({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Cylinder position={[0, 0.1, 0]} radius={0.05} height={0.2} color="#efe6d4" segments={6} />
      <mesh position={[0, 0.22, 0]} material={solid("#c8463c")} castShadow>
        <sphereGeometry args={[0.14, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
    </group>
  );
}

const FIREFLY_COUNT = 14;
const FIREFLY_RADIUS = 4.5;

function Fireflies() {
  const town = useTown();
  const group = useRef<THREE.Group>(null);
  const seeds = useMemo(
    () => Array.from({ length: FIREFLY_COUNT }, (_, index) => ({ angle: (index / FIREFLY_COUNT) * Math.PI * 2, speed: 0.2 + (index % 5) * 0.06, height: 0.8 + (index % 4) * 0.5 })),
    [],
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.visible = town.nightLevel.current > 0.05;
    group.current.children.forEach((child, index) => {
      const seed = seeds[index];
      const t = clock.elapsedTime * seed.speed + seed.angle;
      const radius = FIREFLY_RADIUS * (0.4 + 0.6 * Math.abs(Math.sin(t * 0.7)));
      child.position.set(Math.cos(t) * radius, seed.height + Math.sin(t * 2.3) * 0.3, Math.sin(t) * radius);
    });
  });

  return (
    <group ref={group}>
      {seeds.map((seed) => (
        <mesh key={seed.angle}>
          <sphereGeometry args={[0.06, 6, 4]} />
          <meshBasicMaterial color="#f8f28a" />
        </mesh>
      ))}
    </group>
  );
}

/** A clearing in Brocéliande, the Breton forest of legends. Centred on the stone. */
export function BroceliandeGlade() {
  return (
    <group>
      <mesh position={[0, 0.025, 0.5]} rotation={[-Math.PI / 2, 0, 0]} material={solid("#a7d07c")} receiveShadow>
        <circleGeometry args={[5.4, 18]} />
      </mesh>
      <SwordInStone />
      <group position={[2.4, 0, 1.4]}>
        <TreasureChest />
      </group>
      <mesh position={[-3.2, 1.4, -1.6]} scale={[0.7, 2.2, 0.5]} rotation={[0, 0.4, 0.05]} material={solid(PALETTE.graniteDark)} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.8, 0]} />
      </mesh>
      <Mushroom position={[-1.5, 0, 2.2]} />
      <Mushroom position={[-1.2, 0, 2.5]} />
      <Mushroom position={[3.4, 0, -1.4]} />
      <Fireflies />
    </group>
  );
}

const TURF = "#6fae4f";
const TURF_STRIPE = "#79b858";
const PITCH_LENGTH = 16;
const PITCH_WIDTH = 10;
const LINE = 0.12;

function Goal({ side, color }: { side: 1 | -1; color: string }) {
  const x = side * (PITCH_LENGTH / 2 + 0.6);
  return (
    <group position={[x, 0, 0]}>
      {[-1.6, 1.6].map((z) => (
        <Block key={z} position={[0, 0, z]} size={[0.14, 1.9, 0.14]} color={color} />
      ))}
      <Box position={[0, 1.9, 0]} size={[0.14, 0.14, 3.34]} color={color} />
      <mesh position={[side * 0.6, 0.95, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[3.2, 1.9]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

const ORBIT_X = 4.2;
const ORBIT_Z = 2.6;
const CAR_SPEED = 0.55;

function RocketCar() {
  const car = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!car.current) return;
    const t = clock.elapsedTime * CAR_SPEED;
    car.current.position.set(Math.cos(t) * ORBIT_X, 0, Math.sin(t) * ORBIT_Z);
    car.current.rotation.y = Math.atan2(-Math.sin(t) * ORBIT_X, Math.cos(t) * ORBIT_Z);
  });
  return (
    <group ref={car}>
      {/* Modelled along +x; turned so the bonnet points along +z, the way it drives. */}
      <group rotation={[0, -Math.PI / 2, 0]}>
        <Block position={[0, 0.25, 0]} size={[1.7, 0.45, 0.95]} color="#2f6fe0" />
        <Block position={[-0.15, 0.7, 0]} size={[0.8, 0.35, 0.8]} color="#1e2a44" />
        <Box position={[-0.85, 0.85, 0]} size={[0.12, 0.08, 0.95]} color="#f29b38" />
        <Box position={[-0.88, 0.45, 0]} size={[0.06, 0.2, 0.3]} material={glow.bulb} />
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
    </group>
  );
}

function Ball() {
  const ball = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ball.current) ball.current.position.y = 0.6 + Math.abs(Math.sin(clock.elapsedTime * 1.8)) * 0.5;
  });
  return (
    <mesh ref={ball} position={[0, 0.6, 0]} material={solid("#e6e7e9")} castShadow>
      <icosahedronGeometry args={[0.6, 1]} />
    </mesh>
  );
}

/** A small car-football pitch behind the house, centred on the kick-off spot. */
export function Pitch() {
  return (
    <group>
      {Array.from({ length: 8 }, (_, index) => (
        <mesh
          key={index}
          position={[-PITCH_LENGTH / 2 + PITCH_LENGTH / 16 + (index * PITCH_LENGTH) / 8, 0.03, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={solid(index % 2 ? TURF : TURF_STRIPE)}
          receiveShadow
        >
          <planeGeometry args={[PITCH_LENGTH / 8, PITCH_WIDTH]} />
        </mesh>
      ))}
      {[-1, 1].map((side) => (
        <Box key={`z${side}`} position={[0, 0.05, (side * PITCH_WIDTH) / 2]} size={[PITCH_LENGTH, 0.02, LINE]} color={PALETTE.white} shadow={false} />
      ))}
      {[-1, 0, 1].map((side) => (
        <Box key={`x${side}`} position={[(side * PITCH_LENGTH) / 2, 0.05, 0]} size={[LINE, 0.02, PITCH_WIDTH]} color={PALETTE.white} shadow={false} />
      ))}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} material={solid(PALETTE.white)}>
        <ringGeometry args={[1.7, 1.82, 32]} />
      </mesh>
      <Goal side={-1} color="#4f8fe8" />
      <Goal side={1} color="#f29b38" />
      <Ball />
      <RocketCar />
    </group>
  );
}

/** The village well on the green. */
export function Well() {
  return (
    <group>
      <Cylinder position={[0, 0.45, 0]} radius={0.85} height={0.9} color={PALETTE.granite} segments={10} />
      <Cylinder position={[0, 0.92, 0]} radius={0.62} height={0.05} color="#3a5a78" segments={10} />
      {[-0.7, 0.7].map((x) => (
        <Block key={x} position={[x, 0.9, 0]} size={[0.12, 1.4, 0.12]} color={PALETTE.woodDark} />
      ))}
      <Cylinder position={[0, 2.05, 0]} radius={0.06} height={1.5} color={PALETTE.wood} rotation={[0, 0, Math.PI / 2]} segments={6} />
      <PitchedRoof position={[0, 2.25, 0]} length={1.9} span={1.4} height={0.6} wallColor={PALETTE.woodDark} roofColor={PALETTE.slate} overhang={0.15} thickness={0.1} />
    </group>
  );
}

interface Arrow {
  label: string;
  angle: number;
}

/** A crossroads signpost. */
export function Signpost({ arrows }: { arrows: Arrow[] }) {
  return (
    <group>
      <Block size={[0.14, 2.6, 0.14]} color={PALETTE.woodDark} />
      {arrows.map((arrow, index) => (
        <group key={arrow.label} position={[0, 2.3 - index * 0.38, 0]} rotation={[0, arrow.angle, 0]}>
          <Box position={[0.75, 0, 0]} size={[1.5, 0.3, 0.06]} color={PALETTE.white} />
          {[1, -1].map((face) => (
            <Sign
              key={face}
              text={arrow.label}
              position={[0.75, 0, face * 0.035]}
              rotation={[0, face > 0 ? 0 : Math.PI, 0]}
              width={1.4}
              background={PALETTE.white}
              color={PALETTE.ink}
              font="700 56px ui-sans-serif, system-ui, sans-serif"
            />
          ))}
        </group>
      ))}
    </group>
  );
}
