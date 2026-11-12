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

const SHAFTS: { x: number; z: number; lean: number; width: number }[] = [
  { x: -1.4, z: -0.6, lean: 0.32, width: 0.9 },
  { x: 0.3, z: 0.2, lean: 0.38, width: 1.3 },
  { x: 1.9, z: -0.9, lean: 0.3, width: 0.7 },
];

/** Sunbeams slanting through the trees by day, and a slow glint on the sword. */
function GladeLight() {
  const town = useTown();
  const shafts = useRef<THREE.Group>(null);
  const glint = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const day = 1 - town.nightLevel.current;
    if (shafts.current) {
      shafts.current.visible = day > 0.05;
      shafts.current.children.forEach((shaft, index) => {
        const material = (shaft as THREE.Mesh).material as THREE.MeshBasicMaterial;
        material.opacity = day * (0.1 + Math.sin(clock.elapsedTime * 0.6 + index * 2) * 0.035);
      });
    }
    if (glint.current) {
      // A sparkle that swells and fades every few seconds.
      const pulse = Math.max(0, Math.sin(clock.elapsedTime * 1.4)) ** 6;
      glint.current.scale.setScalar(0.05 + pulse * 0.3);
      glint.current.rotation.z = clock.elapsedTime * 0.8;
    }
  });

  return (
    <>
      <group ref={shafts}>
        {SHAFTS.map((shaft) => (
          <mesh key={shaft.x} position={[shaft.x - 1.2, 3.2, shaft.z]} rotation={[0, Math.PI / 4, shaft.lean]}>
            <planeGeometry args={[shaft.width, 7]} />
            <meshBasicMaterial color="#fff3c4" transparent opacity={0.1} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
      <mesh ref={glint} position={[0.12, 2.15, 0.1]} rotation={[0, Math.PI / 4, 0]}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#fffbe0" />
      </mesh>
    </>
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
      <GladeLight />
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
