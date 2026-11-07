"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { seededRandom } from "@/lib/town/scatter";
import { Figure, type FigureLook } from "../kit/figure";
import { PALETTE, solid } from "../kit/materials";
import { Block, Box, Cylinder, type Vec3 } from "../kit/shapes";
import { useTown } from "../town-context";

const COW_WHITE = "#f4f1ea";
const COW_BLACK = "#24252a";

/** A Breton black-and-white cow, grazing. Faces +z. */
function Cow({ position, rotationY, phase }: { position: Vec3; rotationY: number; phase: number }) {
  const head = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!head.current) return;
    const graze = Math.max(0, Math.sin(clock.elapsedTime * 0.5 + phase));
    head.current.rotation.x = 0.2 + graze * 0.6;
  });
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <Block position={[0, 0.7, 0]} size={[0.9, 0.75, 1.7]} color={COW_WHITE} />
      <Box position={[0.46, 1.1, 0.2]} size={[0.02, 0.4, 0.6]} color={COW_BLACK} shadow={false} />
      <Box position={[-0.46, 0.95, -0.3]} size={[0.02, 0.45, 0.7]} color={COW_BLACK} shadow={false} />
      <Box position={[0, 1.46, -0.4]} size={[0.6, 0.02, 0.6]} color={COW_BLACK} shadow={false} />
      {[
        [-0.3, 0.6],
        [0.3, 0.6],
        [-0.3, -0.6],
        [0.3, -0.6],
      ].map(([x, z]) => (
        <Block key={`${x}${z}`} position={[x, 0, z]} size={[0.18, 0.72, 0.18]} color={COW_WHITE} />
      ))}
      <Box position={[0, 0.9, -0.92]} size={[0.06, 0.5, 0.06]} color={COW_BLACK} />
      <group ref={head} position={[0, 1.15, 0.85]}>
        <Box position={[0, 0, 0.25]} size={[0.5, 0.5, 0.55]} color={COW_BLACK} />
        <Box position={[0, -0.12, 0.55]} size={[0.42, 0.26, 0.12]} color="#e8b4a8" />
        {[-1, 1].map((side) => (
          <Box key={side} position={[side * 0.32, 0.2, 0.2]} size={[0.16, 0.05, 0.08]} color="#e9dcc6" />
        ))}
      </group>
    </group>
  );
}

function HayBale({ position, rotationY }: { position: Vec3; rotationY: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <Cylinder position={[0, 0.65, 0]} rotation={[0, 0, Math.PI / 2]} radius={0.65} height={1.1} color="#d8b75a" segments={12} />
      <Cylinder position={[0, 0.65, 0]} rotation={[0, 0, Math.PI / 2]} radius={0.4} height={1.12} color="#c9a64a" segments={12} />
    </group>
  );
}

const DUCK_ORBIT = 1.3;

function Duck({ phase, speed }: { phase: number; speed: number }) {
  const duck = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!duck.current) return;
    const t = clock.elapsedTime * speed + phase;
    duck.current.position.set(Math.cos(t) * DUCK_ORBIT, 0.08 + Math.sin(t * 3) * 0.02, Math.sin(t) * DUCK_ORBIT * 0.7);
    duck.current.rotation.y = -t;
  });
  return (
    <group ref={duck}>
      <Block size={[0.28, 0.2, 0.42]} color="#f7f4ec" />
      <Block position={[0, 0.18, 0.16]} size={[0.18, 0.2, 0.18]} color="#3d7a4a" />
      <Box position={[0, 0.26, 0.29]} size={[0.1, 0.05, 0.12]} color="#f29b38" />
    </group>
  );
}

/** A small pond with lily pads, reeds and two ducks. */
export function Pond() {
  const stones = useMemo(() => {
    const random = seededRandom(5);
    return Array.from({ length: 16 }, (_, index) => {
      const angle = (index / 16) * Math.PI * 2;
      return { x: Math.cos(angle) * 2.55, z: Math.sin(angle) * 1.95, size: 0.22 + random() * 0.14 };
    });
  }, []);
  return (
    <group>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.78, 1]} material={solid("#7cb7d4")} receiveShadow>
        <circleGeometry args={[2.5, 24]} />
      </mesh>
      <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.78, 1]} material={solid("#94c8e0")}>
        <ringGeometry args={[1.6, 1.75, 24]} />
      </mesh>
      {stones.map((stone) => (
        <mesh key={`${stone.x}`} position={[stone.x, 0.08, stone.z]} scale={[stone.size, stone.size * 0.7, stone.size]} material={solid(PALETTE.graniteDark)} castShadow>
          <dodecahedronGeometry args={[1, 0]} />
        </mesh>
      ))}
      {[
        [0.9, -0.6],
        [-1.2, 0.5],
        [0.3, 0.9],
      ].map(([x, z]) => (
        <Cylinder key={`${x}${z}`} position={[x, 0.05, z]} radius={0.28} height={0.02} color="#5e9e45" segments={9} />
      ))}
      {[-2.1, -1.9, -1.7, -2.2].map((x, index) => (
        <Cylinder key={index} position={[x, 0.45, -0.9 + index * 0.25]} radius={0.03} height={0.9 + (index % 2) * 0.3} color="#6f8f3f" segments={4} />
      ))}
      <Duck phase={0} speed={0.35} />
      <Duck phase={2.4} speed={0.35} />
    </group>
  );
}

const SMOKE_PUFFS = 5;
const SMOKE_RISE = 3;
const SMOKE_CYCLE = 4;

/** Slow puffs of smoke from a chimney top. */
export function ChimneySmoke({ position }: { position: Vec3 }) {
  const puffs = useRef<THREE.Mesh[]>([]);
  useFrame(({ clock }) => {
    puffs.current.forEach((puff, index) => {
      const t = ((clock.elapsedTime / SMOKE_CYCLE + index / SMOKE_PUFFS) % 1 + 1) % 1;
      puff.position.set(Math.sin(t * 4 + index) * 0.25 + t * 0.6, t * SMOKE_RISE, -t * 0.3);
      const size = 0.2 + t * 0.45;
      puff.scale.setScalar(size);
      (puff.material as THREE.MeshStandardMaterial).opacity = 0.55 * (1 - t);
    });
  });
  return (
    <group position={position}>
      {Array.from({ length: SMOKE_PUFFS }, (_, index) => (
        <mesh
          key={index}
          ref={(mesh) => {
            if (mesh) puffs.current[index] = mesh;
          }}
        >
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#f2f0ec" transparent opacity={0.5} depthWrite={false} flatShading />
        </mesh>
      ))}
    </group>
  );
}

const WING_COLORS = ["#f6d55c", "#f08bb4", "#8fb8f0", "#ffffff"];

function Butterfly({ centre, phase, color }: { centre: Vec3; phase: number; color: string }) {
  const town = useTown();
  const body = useRef<THREE.Group>(null);
  const left = useRef<THREE.Mesh>(null);
  const right = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!body.current) return;
    body.current.visible = town.nightLevel.current < 0.5;
    const t = clock.elapsedTime * 0.6 + phase;
    body.current.position.set(centre[0] + Math.sin(t) * 1.6, centre[1] + Math.sin(t * 2.7) * 0.3, centre[2] + Math.sin(t * 1.3) * 1.2);
    body.current.rotation.y = Math.cos(t) > 0 ? Math.PI / 2 : -Math.PI / 2;
    const flap = Math.sin(clock.elapsedTime * 18 + phase) * 0.9;
    if (left.current) left.current.rotation.z = flap;
    if (right.current) right.current.rotation.z = -flap;
  });
  return (
    <group ref={body}>
      <mesh ref={left} position={[-0.01, 0, 0]}>
        <planeGeometry args={[0.22, 0.16]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={right} position={[0.01, 0, 0]}>
        <planeGeometry args={[0.22, 0.16]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

const VILLAGER_LOOKS: FigureLook[] = [
  { skin: "#f0c7a4", hair: "#d9b46a", top: "#3f73a3", bottom: "#2f3a4f", shoes: "#3b2a22", longHair: true },
  { skin: "#c98f6a", hair: "#2a1d16", top: "#e8c46a", bottom: "#4b5564", shoes: "#23272e" },
  { skin: "#e9b996", hair: "#7a7a7a", beard: "#8a8a8a", top: "#7d5ba6", bottom: "#3b4d66", shoes: "#5a3b2a" },
  { skin: "#8d5a3c", hair: "#1c1410", top: "#e85d4f", bottom: "#23272e", shoes: "#f1f1ee", longHair: true },
];

/** Cows, hay, a pond, smoke and a few neighbours, so the village feels lived in. */
export function VillageLife() {
  return (
    <group>
      <Cow position={[-38, 0, 24]} rotationY={0.6} phase={0} />
      <Cow position={[-41.5, 0, 29]} rotationY={-2.2} phase={1.7} />
      <Cow position={[-37, 0, 32]} rotationY={2.6} phase={3.1} />
      <HayBale position={[-38, 0, -6]} rotationY={0.4} />
      <HayBale position={[-41, 0, -12]} rotationY={1.3} />
      <HayBale position={[-37.5, 0, -16]} rotationY={-0.3} />
      <HayBale position={[40, 0, 14]} rotationY={0.9} />
      <HayBale position={[38, 0, 22]} rotationY={-0.6} />
      <group position={[7.5, 0, -5.5]}>
        <Pond />
      </group>
      <ChimneySmoke position={[-12.55, 7.6, 15]} />
      <Butterfly centre={[-9, 1.2, 9]} phase={0} color={WING_COLORS[0]} />
      <Butterfly centre={[12, 1, 4]} phase={2} color={WING_COLORS[1]} />
      <Butterfly centre={[-17, 1.1, 18]} phase={4} color={WING_COLORS[2]} />
      <Butterfly centre={[24, 1.3, 12]} phase={1} color={WING_COLORS[3]} />
      {/* Neighbours chatting on the bar's terrace and at the market. */}
      <Figure look={VILLAGER_LOOKS[0]} position={[-24.4, 0, -3.4]} rotation={[0, 1.2, 0]} />
      <Figure look={VILLAGER_LOOKS[1]} position={[-23.2, 0, -3.1]} rotation={[0, -1.8, 0]} />
      <Figure look={VILLAGER_LOOKS[2]} position={[-26.6, 0, -0.4]} rotation={[0, Math.PI, 0]} />
      <Figure look={VILLAGER_LOOKS[3]} position={[-1.5, 0, -11.9]} rotation={[0, 0.3, 0]} />
    </group>
  );
}

/** A picket fence around the vegetable garden, with a gap to walk in. */
export function GardenFence({ width, depth }: { width: number; depth: number }) {
  const pickets = useMemo(() => {
    const points: { x: number; z: number; along: "x" | "z" }[] = [];
    for (let x = -width / 2; x <= width / 2 + 0.01; x += 0.45) {
      points.push({ x, z: -depth / 2, along: "x" });
      if (Math.abs(x - width / 2 + 0.8) > 0.6) points.push({ x, z: depth / 2, along: "x" });
    }
    for (let z = -depth / 2 + 0.45; z < depth / 2; z += 0.45) {
      points.push({ x: -width / 2, z, along: "z" });
      points.push({ x: width / 2, z, along: "z" });
    }
    return points;
  }, [width, depth]);
  return (
    <group>
      {pickets.map((picket) => (
        <Block key={`${picket.x}:${picket.z}`} position={[picket.x, 0, picket.z]} size={[0.08, 0.75, 0.08]} color="#f2ede2" />
      ))}
      <Box position={[0, 0.5, -depth / 2]} size={[width, 0.06, 0.04]} color="#f2ede2" />
      <Box position={[-width / 2, 0.5, 0]} size={[0.04, 0.06, depth]} color="#f2ede2" />
      <Box position={[width / 2, 0.5, 0]} size={[0.04, 0.06, depth]} color="#f2ede2" />
      <Box position={[-0.6, 0.5, depth / 2]} size={[width - 1.6, 0.06, 0.04]} color="#f2ede2" />
    </group>
  );
}

/** A Breton post box by the lane. */
export function Mailbox() {
  return (
    <group>
      <Block size={[0.1, 1, 0.1]} color={PALETTE.woodDark} />
      <Block position={[0, 1, 0]} size={[0.45, 0.35, 0.3]} color="#f2c94c" />
      <Box position={[0, 1.2, 0.16]} size={[0.3, 0.04, 0.02]} color={PALETTE.ink} shadow={false} />
    </group>
  );
}
