"use client";

import { LightPool } from "../kit/light-pool";
import { glow, PALETTE, solid } from "../kit/materials";
import { Block, Box, Cylinder, Door, PitchedRoof, Window } from "../kit/shapes";
import { type Opening, Stonework } from "../kit/stonework";

const LENGTH = 14;
const DEPTH = 5.6;
const WALL = 3;
const ROOF = 3.1;
const PLINTH = 0.35;
const FRONT = DEPTH / 2;
const SIDE = LENGTH / 2;
const WINDOWS = [-5.1, -3.1, 1.4];
const DOOR_X = -0.8;
const BARN_X = 4.9;
const FLOWERS = ["#e85d4f", "#f08bb4", "#ffffff", "#f6d55c"];

/** Where the stones leave room for windows and doors, measured from the top of the plinth. */
const FRONT_OPENINGS: Opening[] = [
  ...WINDOWS.map((x) => ({ x, y: 1.2, w: 2.05, h: 1.45 })),
  { x: DOOR_X, y: 1.2, w: 1.7, h: 2.6 },
  { x: BARN_X, y: 1.2, w: 2.8, h: 2.6 },
];
const GABLE_OPENINGS: Opening[] = [
  { x: -1, y: 1.2, w: 1.2, h: 1.45 },
  { x: 0, y: 3.55, w: 0.9, h: 1 },
];
const FRONT_WALL: [number, number, number] = [0, PLINTH, FRONT];
const GABLE_WALL: [number, number, number] = [SIDE, PLINTH, 0];

function Dormer({ x }: { x: number }) {
  return (
    <group position={[x, WALL, FRONT - 0.7]}>
      <Block size={[1.5, 1.3, 1.4]} color={PALETTE.granite} />
      <Window position={[0, 0.7, 0.71]} width={0.7} height={0.8} />
      <group position={[0, 1.3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <PitchedRoof
          position={[0, 0, 0]}
          length={1.4}
          span={1.5}
          height={0.9}
          wallColor={PALETTE.granite}
          roofColor={PALETTE.slate}
          overhang={0.18}
          thickness={0.12}
        />
      </group>
    </group>
  );
}

function Hydrangea({ x, z, color }: { x: number; z: number; color: string }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.35, 0]} material={solid("#5f9147")} castShadow>
        <icosahedronGeometry args={[0.45, 0]} />
      </mesh>
      {[
        [0.18, 0.62, 0.15],
        [-0.2, 0.58, 0.1],
        [0, 0.7, -0.12],
      ].map(([px, py, pz]) => (
        <mesh key={`${px}${pz}`} position={[px, py, pz]} material={solid(color)} castShadow>
          <icosahedronGeometry args={[0.2, 0]} />
        </mesh>
      ))}
    </group>
  );
}

/** A planter under a window, full of flowers. */
function FlowerBox({ x }: { x: number }) {
  return (
    <group position={[x, 0.92, FRONT + 0.16]}>
      <Box size={[1, 0.16, 0.22]} color={PALETTE.woodDark} />
      {[-0.36, -0.18, 0, 0.18, 0.36].map((offset, index) => (
        <mesh key={offset} position={[offset, 0.14, 0.02]} material={solid(FLOWERS[index % FLOWERS.length])}>
          <icosahedronGeometry args={[0.09, 0]} />
        </mesh>
      ))}
      {[-0.27, 0.09, 0.27].map((offset) => (
        <mesh key={offset} position={[offset, 0.1, -0.02]} material={solid("#5f9147")}>
          <icosahedronGeometry args={[0.1, 0]} />
        </mesh>
      ))}
    </group>
  );
}

/** A rose climbing up one side of the front door and over the lintel. */
function ClimbingRose() {
  const stems: [number, number][] = [
    [-0.82, 0.55],
    [-0.9, 1],
    [-0.8, 1.45],
    [-0.88, 1.9],
    [-0.78, 2.35],
    [-0.6, 2.7],
    [-0.25, 2.85],
    [0.15, 2.82],
    [0.5, 2.72],
  ];
  return (
    <group position={[DOOR_X, PLINTH, FRONT + 0.12]}>
      {stems.map(([x, y], index) => (
        <group key={y} position={[x, y, 0]}>
          <mesh scale={[1, 1, 0.5]} material={solid(index % 2 ? "#5f9147" : "#6aa052")} castShadow>
            <icosahedronGeometry args={[0.26, 0]} />
          </mesh>
          <mesh position={[index % 2 ? 0.12 : -0.1, 0.08, 0.1]} material={solid(index % 3 ? "#f08bb4" : "#f6c4d8")}>
            <icosahedronGeometry args={[0.08, 0]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Split logs stacked against the wall, for the fireplace. */
function Woodpile() {
  return (
    <group position={[6.52, 0, FRONT + 0.3]}>
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2].slice(0, row === 3 ? 2 : 3).map((column) => {
          const x = (column - 1) * 0.26 + (row % 2) * 0.1;
          return (
            <group key={`${row}${column}`} position={[x, 0.13 + row * 0.23, 0]}>
              <Cylinder rotation={[Math.PI / 2, 0, 0]} radius={0.12} height={0.55} color="#7a5a3d" segments={7} />
              <Cylinder position={[0, 0, 0.28]} rotation={[Math.PI / 2, 0, 0]} radius={0.1} height={0.02} color="#d9b98a" segments={7} />
            </group>
          );
        }),
      )}
    </group>
  );
}

function ChimneyStack({ x }: { x: number }) {
  return (
    <group position={[x, WALL + ROOF - 0.6, 0]}>
      <Block size={[0.9, 1.9, 1.1]} color={PALETTE.granite} />
      <Block position={[0, 1.9, 0]} size={[1.05, 0.15, 1.25]} color={PALETTE.graniteDark} />
      {[-0.25, 0.25].map((z) => (
        <Cylinder key={z} position={[0, 2.25, z]} radius={0.13} radiusBottom={0.16} height={0.4} color="#c8734b" segments={8} />
      ))}
    </group>
  );
}

/** A traditional long, narrow Breton stone farmhouse. Front faces +z. */
export function Longere() {
  return (
    <group>
      <group>
        <Block size={[LENGTH + 0.3, PLINTH, DEPTH + 0.3]} color={PALETTE.graniteDark} />
        <Block position={[0, PLINTH, 0]} size={[LENGTH, WALL - PLINTH, DEPTH]} color="#cbc4b7" />
        <PitchedRoof
          position={[0, WALL, 0]}
          length={LENGTH}
          span={DEPTH}
          height={ROOF}
          wallColor="#cbc4b7"
          roofColor={PALETTE.slate}
          overhang={0.3}
          courses={9}
        />
        <ChimneyStack x={-SIDE + 0.45} />
        <ChimneyStack x={SIDE - 0.45} />

        {/* The house end: front door, windows, dormers. */}
        {WINDOWS.map((x) => (
          <group key={x}>
            <Window position={[x, 1.55, FRONT + 0.05]} shutters={PALETTE.bretonBlue} />
            <FlowerBox x={x} />
          </group>
        ))}
        <Door position={[DOOR_X, PLINTH, FRONT + 0.05]} width={1.05} height={2} color={PALETTE.bretonBlue} />
        <Box position={[DOOR_X, 2.55, FRONT + 0.08]} size={[1.5, 0.28, 0.12]} color={PALETTE.graniteDark} shadow={false} />
        <Dormer x={-4.1} />
        <Dormer x={0.3} />
        <ClimbingRose />

        {/* The old barn end, kept with its big wooden door. */}
        <group position={[BARN_X, PLINTH, FRONT + 0.05]}>
          <Box position={[0, 1.1, 0]} size={[2.2, 2.2, 0.1]} color={PALETTE.woodDark} shadow={false} />
          {[-0.55, 0, 0.55].map((x) => (
            <Box key={x} position={[x, 1.1, 0.06]} size={[0.06, 2.1, 0.04]} color="#5a3f2b" shadow={false} />
          ))}
          <Box position={[0, 2.32, 0.02]} size={[2.6, 0.26, 0.14]} color={PALETTE.graniteDark} shadow={false} />
          {[0.6, 1.6].map((y) => (
            <Box key={y} position={[0, y, 0.08]} size={[2.1, 0.08, 0.03]} color="#2c2f33" shadow={false} />
          ))}
        </group>
        <Woodpile />

        {/* Gable windows facing +x. */}
        <Window position={[SIDE + 0.05, WALL + 0.9, 0]} facing="side" width={0.6} height={0.7} />
        <Window position={[SIDE + 0.05, 1.55, -1]} facing="side" />

        {/* Front step, bench, a lantern by the door and a potted bay tree. */}
        <Block position={[DOOR_X, 0, FRONT + 0.45]} size={[1.6, 0.18, 0.7]} color={PALETTE.graniteDark} />
        <group position={[-2.1, 0, FRONT + 0.6]}>
          <Block position={[0, 0.42, 0]} size={[1.5, 0.1, 0.42]} color={PALETTE.wood} />
          {[-0.6, 0.6].map((x) => (
            <Block key={x} position={[x, 0, 0]} size={[0.1, 0.42, 0.38]} color={PALETTE.woodDark} />
          ))}
        </group>
        <group position={[0.12, 0, FRONT + 0.5]}>
          <Cylinder position={[0, 0.22, 0]} radius={0.24} radiusBottom={0.18} height={0.44} color="#c8734b" segments={9} />
          <Cylinder position={[0, 0.7, 0]} radius={0.03} height={0.55} color={PALETTE.trunk} segments={5} />
          <mesh position={[0, 1.15, 0]} material={solid("#4f7f3c")} castShadow>
            <icosahedronGeometry args={[0.34, 1]} />
          </mesh>
        </group>
        <Box position={[0.05, 2.25, FRONT + 0.12]} size={[0.08, 0.3, 0.14]} color="#2c3238" shadow={false} />
        <Hydrangea x={-6.4} z={FRONT + 0.7} color="#7d9fe3" />
        <Hydrangea x={2.6} z={FRONT + 0.7} color="#e79bc3" />
        <Hydrangea x={-4.1} z={FRONT + 0.75} color="#a98be0" />
      </group>

      <Box position={[0.05, 2.1, FRONT + 0.2]} size={[0.16, 0.2, 0.16]} material={glow.bulb} shadow={false} />
      <Stonework position={FRONT_WALL} width={LENGTH} height={WALL - PLINTH} openings={FRONT_OPENINGS} seed={21} />
      <Stonework
        position={GABLE_WALL}
        width={DEPTH}
        height={WALL - PLINTH}
        gable={ROOF}
        facing="side"
        openings={GABLE_OPENINGS}
        seed={22}
      />

      {/* Warm light spilling out of the windows at night. */}
      {[...WINDOWS, DOOR_X].map((x) => (
        <LightPool key={x} position={[x, 0, FRONT + 1.5]} radius={2} strength={0.46} />
      ))}
    </group>
  );
}
