"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import { litBulb, PALETTE, solid } from "../kit/materials";
import { Block, Box, Cylinder, type Vec3 } from "../kit/shapes";

const FLICKER_SPEED = 9;

/** A big granite fireplace on the left wall, with a fire that flickers. */
export function Fireplace() {
  const light = useRef<THREE.PointLight>(null);
  const flames = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * FLICKER_SPEED;
    const flicker = 0.8 + Math.sin(t) * 0.1 + Math.sin(t * 2.3) * 0.08;
    if (light.current) light.current.intensity = 6 * flicker;
    if (flames.current) flames.current.scale.set(1, flicker, 1);
  });

  return (
    <group>
      <Block position={[0.05, 0, 0]} size={[1.5, 0.08, 3.1]} color={PALETTE.graniteDark} />
      {[-1.15, 1.15].map((z) => (
        <Block key={z} position={[0, 0, z]} size={[0.9, 1.6, 0.55]} color="#b3aa9c" />
      ))}
      <Block position={[0, 1.6, 0]} size={[1.05, 0.38, 3]} color="#a59c8e" />
      <Block position={[-0.1, 1.98, 0]} size={[0.75, 1.22, 2.5]} color="#b8b0a3" />
      <Box position={[-0.38, 0.8, 0]} size={[0.06, 1.6, 1.8]} color="#1c1a18" shadow={false} />
      {[-0.2, 0.2].map((z, index) => (
        <mesh key={z} position={[-0.05, 0.16, z]} rotation={[0, 0, Math.PI / 2 + (index ? 0.15 : -0.15)]} material={solid("#5a3f2b")}>
          <cylinderGeometry args={[0.1, 0.1, 0.8, 7]} />
        </mesh>
      ))}
      <group ref={flames} position={[-0.05, 0.22, 0]}>
        {[
          [-0.18, 0.5, "#ff8a2a"],
          [0.15, 0.42, "#ffb347"],
          [0, 0.62, "#ffd36a"],
        ].map(([z, height, color]) => (
          <mesh key={String(z)} position={[0, (height as number) / 2, z as number]}>
            <coneGeometry args={[0.16, height as number, 5]} />
            <meshStandardMaterial color={color as string} emissive={color as string} emissiveIntensity={2} />
          </mesh>
        ))}
      </group>
      <pointLight ref={light} position={[0.8, 0.8, 0]} color="#ff9a4a" intensity={5} distance={7} decay={1.6} />
      {/* A few things on the mantel. */}
      <Box position={[0.2, 1.88, -0.9]} size={[0.12, 0.2, 0.3]} color="#3f73a3" />
      <Cylinder position={[0.2, 1.9, 0.7]} radius={0.08} height={0.24} color="#efe6d4" segments={8} />
    </group>
  );
}

export function Rug({ size, color, border }: { size: [number, number]; color: string; border: string }) {
  return (
    <group>
      <Box position={[0, 0.012, 0]} size={[size[0], 0.02, size[1]]} color={border} shadow={false} />
      <Box position={[0, 0.02, 0]} size={[size[0] - 0.3, 0.02, size[1] - 0.3]} color={color} shadow={false} />
    </group>
  );
}

/** A three-seat sofa facing -x. */
export function Sofa({ color, cushion }: { color: string; cushion: string }) {
  return (
    <group>
      <Block position={[0, 0.1, 0]} size={[0.95, 0.35, 2.5]} color={color} />
      <Block position={[0.38, 0.1, 0]} size={[0.25, 0.95, 2.5]} color={color} />
      {[-1.2, 1.2].map((z) => (
        <Block key={z} position={[0, 0.1, z]} size={[0.95, 0.6, 0.22]} color={color} />
      ))}
      {[-0.6, 0.6].map((z) => (
        <Block key={z} position={[-0.05, 0.45, z]} size={[0.75, 0.14, 1.05]} color={cushion} />
      ))}
      <Box position={[0.18, 0.75, -0.75]} rotation={[0, 0, -0.2]} size={[0.14, 0.4, 0.4]} color="#e8c46a" />
      {[-1.1, 1.1].map((z) =>
        [-0.35, 0.35].map((x) => <Block key={`${x}${z}`} position={[x, 0, z]} size={[0.08, 0.1, 0.08]} color={PALETTE.woodDark} />),
      )}
    </group>
  );
}

export function Armchair({ color }: { color: string }) {
  return (
    <group>
      <Block position={[0, 0.1, 0]} size={[0.95, 0.38, 0.9]} color={color} />
      <Block position={[0, 0.1, -0.36]} size={[0.95, 0.95, 0.2]} color={color} />
      {[-0.42, 0.42].map((x) => (
        <Block key={x} position={[x, 0.1, 0]} size={[0.14, 0.6, 0.9]} color={color} />
      ))}
    </group>
  );
}

export function CoffeeTable() {
  return (
    <group>
      <Block position={[0, 0.32, 0]} size={[0.8, 0.07, 1.4]} color={PALETTE.wood} />
      {[-0.32, 0.32].map((x) =>
        [-0.6, 0.6].map((z) => <Block key={`${x}${z}`} position={[x, 0, z]} size={[0.06, 0.32, 0.06]} color={PALETTE.woodDark} />),
      )}
      <Cylinder position={[0.1, 0.45, -0.3]} radius={0.06} height={0.14} color="#e85d4f" segments={8} />
      <Box position={[-0.1, 0.41, 0.3]} rotation={[0, 0.3, 0]} size={[0.3, 0.05, 0.42]} color="#3f73a3" />
    </group>
  );
}

/** A tall lamp with a fabric shade that glows a little more at night. */
export function FloorLamp({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <Cylinder position={[0, 0.03, 0]} radius={0.2} height={0.06} color="#2c3238" segments={10} />
      <Cylinder position={[0, 0.8, 0]} radius={0.03} height={1.55} color="#2c3238" segments={6} />
      <mesh position={[0, 1.65, 0]} material={litBulb}>
        <cylinderGeometry args={[0.18, 0.3, 0.38, 10, 1, true]} />
      </mesh>
      <Cylinder position={[0, 1.65, 0]} radius={0.17} radiusBottom={0.29} height={0.36} color="#f3e6c8" segments={10} />
      <pointLight position={[0, 1.5, 0]} color="#ffd8a0" intensity={3} distance={5} decay={1.8} />
    </group>
  );
}

/** A pendant lamp hanging from the top of the room. */
export function Pendant({ position, color = "#2c3238" }: { position: Vec3; color?: string }) {
  return (
    <group position={position}>
      <Box position={[0, 0.35, 0]} size={[0.02, 0.7, 0.02]} color="#222222" shadow={false} />
      <mesh position={[0, 0, 0]} material={solid(color)}>
        <cylinderGeometry args={[0.08, 0.3, 0.28, 12]} />
      </mesh>
      <mesh position={[0, -0.08, 0]} material={litBulb}>
        <sphereGeometry args={[0.08, 8, 6]} />
      </mesh>
      <pointLight position={[0, -0.2, 0]} color="#ffd59a" intensity={4} distance={5} decay={1.8} />
    </group>
  );
}

const BOOK_COLORS = ["#e85d4f", "#3f73a3", "#f2c94c", "#3fae8a", "#7d5ba6", "#efe6d4", "#f29b38"];

/** A bookcase against the back wall, facing +z. */
export function Bookcase({ width = 1.6, height = 2.2 }: { width?: number; height?: number }) {
  const shelves = 4;
  const booksPerShelf = Math.floor(width / 0.16);
  return (
    <group>
      <Block size={[width, height, 0.4]} color={PALETTE.woodDark} />
      <Box position={[0, height / 2, 0.19]} size={[width - 0.12, height - 0.12, 0.02]} color="#4a3424" shadow={false} />
      {Array.from({ length: shelves }, (_, shelf) => {
        const y = 0.12 + (shelf * (height - 0.2)) / shelves;
        return (
          <group key={shelf}>
            <Box position={[0, y, 0.12]} size={[width - 0.1, 0.04, 0.3]} color={PALETTE.wood} shadow={false} />
            {Array.from({ length: booksPerShelf - (shelf % 2) * 2 }, (_, book) => {
              const tall = 0.32 + ((book * 7 + shelf * 3) % 5) * 0.03;
              return (
                <Box
                  key={book}
                  position={[-width / 2 + 0.14 + book * 0.15, y + 0.02 + tall / 2, 0.12]}
                  size={[0.12, tall, 0.24]}
                  color={BOOK_COLORS[(book + shelf * 2) % BOOK_COLORS.length]}
                  shadow={false}
                />
              );
            })}
          </group>
        );
      })}
    </group>
  );
}

/** A potted plant with big, generous leaves. */
export function Plant({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      <Cylinder position={[0, 0.25, 0]} radius={0.28} radiusBottom={0.22} height={0.5} color="#c8734b" segments={10} />
      {[
        [0, 1.0, 0, 0.45],
        [0.25, 0.85, 0.15, 0.36],
        [-0.22, 0.8, -0.1, 0.38],
        [0.05, 1.25, -0.15, 0.32],
      ].map(([x, y, z, size]) => (
        <mesh key={`${x}${y}`} position={[x, y, z]} scale={[1, 0.55, 1]} material={solid(PALETTE.leafDark)} castShadow>
          <icosahedronGeometry args={[size, 0]} />
        </mesh>
      ))}
    </group>
  );
}

/** A framed picture on the back wall. */
export function Frame({ position, width = 1, height = 0.7, colors }: { position: Vec3; width?: number; height?: number; colors: string[] }) {
  return (
    <group position={position}>
      <Box size={[width + 0.12, height + 0.12, 0.05]} color="#3a2a1e" shadow={false} />
      {colors.map((color, index) => (
        <Box
          key={color + index}
          position={[0, height / 2 - (height / colors.length) * (index + 0.5), 0.03]}
          size={[width, height / colors.length, 0.02]}
          color={color}
          shadow={false}
        />
      ))}
    </group>
  );
}
