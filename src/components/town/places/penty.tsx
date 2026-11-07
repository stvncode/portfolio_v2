"use client";

import { PALETTE } from "../kit/materials";
import { Block, Box, Door, PitchedRoof } from "../kit/shapes";
import { Sign } from "../kit/sign";

const WIDTH = 5;
const DEPTH = 4.4;
const WALL = 2.4;
const FRONT = DEPTH / 2;

/** The small stone outbuilding that became the gaming room. Front faces +z. */
export function Penty() {
  return (
    <group>
      <Block size={[WIDTH, WALL, DEPTH]} color={PALETTE.granite} />
      <PitchedRoof
        position={[0, WALL, 0]}
        length={WIDTH}
        span={DEPTH}
        height={2.1}
        wallColor={PALETTE.granite}
        roofColor={PALETTE.slate}
        overhang={0.25}
      />
      <Block position={[WIDTH / 2 - 0.5, WALL + 1.2, 0]} size={[0.7, 1.4, 0.8]} color={PALETTE.granite} />
      <Door position={[-1.2, 0, FRONT + 0.02]} color={PALETTE.bretonBlue} />

      {/* Gaming window: a monitor glow you can see from outside. */}
      <group position={[0.9, 1.35, FRONT + 0.02]}>
        <Box size={[1.9, 1.15, 0.08]} color={PALETTE.frame} shadow={false} />
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[1.7, 0.95, 0.04]} />
          <meshStandardMaterial color="#2a2f5a" emissive="#5a62ff" emissiveIntensity={0.55} />
        </mesh>
        <mesh position={[0, -0.05, 0.08]}>
          <boxGeometry args={[0.9, 0.5, 0.02]} />
          <meshStandardMaterial color="#0c0f1f" emissive="#3fd0ff" emissiveIntensity={0.9} />
        </mesh>
      </group>
      <Sign
        text="GAMING ROOM"
        position={[0.9, 2.15, FRONT + 0.06]}
        width={1.6}
        background="#1b1e2e"
        color="#9fb2ff"
        font="800 64px ui-monospace, Menlo, monospace"
        glow
      />
    </group>
  );
}

/** The moving van, half unloaded. Faces +z. */
export function MovingVan() {
  return (
    <group>
      <Block position={[0, 0.45, -0.5]} size={[2.1, 2.3, 3]} color={PALETTE.white} />
      <Block position={[0, 0.45, 1.45]} size={[2, 1.5, 1.1]} color={PALETTE.white} />
      <Box position={[0, 1.55, 1.98]} size={[1.7, 0.6, 0.05]} color="#9ec3d8" shadow={false} />
      <Box position={[1.06, 1.5, -0.5]} size={[0.02, 0.4, 2.9]} color={PALETTE.haBlue} shadow={false} />
      <Sign
        text="On the move"
        position={[1.07, 2, -0.5]}
        rotation={[0, Math.PI / 2, 0]}
        width={2.2}
        background={PALETTE.white}
        color={PALETTE.ink}
        font="700 64px ui-sans-serif, system-ui, sans-serif"
      />
      {[
        [-1.05, 1.3],
        [1.05, 1.3],
        [-1.05, -1.3],
        [1.05, -1.3],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.4, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 10]} />
          <meshStandardMaterial color="#26272b" flatShading />
        </mesh>
      ))}
    </group>
  );
}

const BOX_COLOR = "#c99b62";
const TAPE_COLOR = "#e5c48f";

function CardboardBox({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
  return (
    <group position={position}>
      <Block size={size} color={BOX_COLOR} />
      <Box position={[0, size[1] + 0.005, 0]} size={[size[0] + 0.01, 0.01, 0.12]} color={TAPE_COLOR} shadow={false} />
    </group>
  );
}

export function MovingBoxes() {
  return (
    <group>
      <CardboardBox position={[0, 0, 0]} size={[0.8, 0.6, 0.7]} />
      <CardboardBox position={[0.05, 0.6, 0.05]} size={[0.6, 0.45, 0.55]} />
      <CardboardBox position={[0.95, 0, 0.3]} size={[0.7, 0.55, 0.6]} />
      <CardboardBox position={[-0.8, 0, 0.5]} size={[0.55, 0.4, 0.5]} />
    </group>
  );
}

/** Raised vegetable beds by the house. */
export function VegetableGarden() {
  return (
    <group>
      {[-1.4, 0, 1.4].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <Block size={[1.1, 0.3, 3.4]} color={PALETTE.woodDark} />
          <Block position={[0, 0.3, 0]} size={[0.95, 0.02, 3.2]} color="#6b4a33" />
          {[-1.2, -0.4, 0.4, 1.2].map((z) => (
            <mesh key={z} position={[0, 0.48, z]} castShadow>
              <icosahedronGeometry args={[0.24, 0]} />
              <meshStandardMaterial color={x === 0 ? "#8fc65a" : "#5e9e45"} flatShading />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
