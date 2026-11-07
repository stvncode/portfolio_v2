"use client";

import { PALETTE } from "../kit/materials";
import { Block, Box, Door, PitchedRoof, Window } from "../kit/shapes";

const LENGTH = 14;
const DEPTH = 5.6;
const WALL = 3;
const ROOF = 3.1;
const FRONT = DEPTH / 2;
const SIDE = LENGTH / 2;

/** Corner stones in alternating sizes, the way granite longères are built. */
function Quoins({ x, sideSign }: { x: number; sideSign: 1 | -1 }) {
  return (
    <>
      {[0.25, 0.85, 1.45, 2.05, 2.65].map((y, index) => {
        const long = index % 2 === 0;
        return (
          <Box
            key={y}
            position={[x - sideSign * (long ? 0.35 : 0.2), y, FRONT + 0.03]}
            size={[long ? 0.8 : 0.5, 0.5, 0.1]}
            color={PALETTE.graniteDark}
            shadow={false}
          />
        );
      })}
    </>
  );
}

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
      <mesh position={[0, 0.35, 0]} castShadow>
        <icosahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial color="#5f9147" flatShading />
      </mesh>
      {[
        [0.18, 0.62, 0.15],
        [-0.2, 0.58, 0.1],
        [0, 0.7, -0.12],
      ].map(([px, py, pz]) => (
        <mesh key={`${px}${pz}`} position={[px, py, pz]} castShadow>
          <icosahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial color={color} flatShading />
        </mesh>
      ))}
    </group>
  );
}

/** A traditional long, narrow Breton stone farmhouse. Front faces +z. */
export function Longere() {
  return (
    <group>
      <Block position={[0, 0, 0]} size={[LENGTH + 0.3, 0.35, DEPTH + 0.3]} color={PALETTE.graniteDark} />
      <Block position={[0, 0.35, 0]} size={[LENGTH, WALL - 0.35, DEPTH]} color={PALETTE.granite} />
      <PitchedRoof
        position={[0, WALL, 0]}
        length={LENGTH}
        span={DEPTH}
        height={ROOF}
        wallColor={PALETTE.granite}
        roofColor={PALETTE.slate}
        overhang={0.3}
      />
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (SIDE - 0.45), WALL + ROOF - 0.6, 0]}>
          <Block size={[0.9, 1.9, 1.1]} color={PALETTE.granite} />
          <Block position={[0, 1.9, 0]} size={[1.05, 0.15, 1.25]} color={PALETTE.graniteDark} />
        </group>
      ))}
      <Quoins x={-SIDE} sideSign={-1} />
      <Quoins x={SIDE} sideSign={1} />

      {/* The house end: front door, windows, dormers. */}
      <Window position={[-5.1, 1.55, FRONT + 0.02]} shutters={PALETTE.bretonBlue} />
      <Window position={[-3.1, 1.55, FRONT + 0.02]} shutters={PALETTE.bretonBlue} />
      <Door position={[-0.8, 0.35, FRONT + 0.02]} width={1.05} height={2} color={PALETTE.bretonBlue} />
      <Box position={[-0.8, 2.55, FRONT + 0.05]} size={[1.5, 0.28, 0.12]} color={PALETTE.graniteDark} shadow={false} />
      <Window position={[1.4, 1.55, FRONT + 0.02]} shutters={PALETTE.bretonBlue} />
      <Dormer x={-4.1} />
      <Dormer x={0.3} />

      {/* The old barn end, kept with its big wooden door. */}
      <group position={[4.9, 0.35, FRONT + 0.03]}>
        <Box position={[0, 1.1, 0]} size={[2.2, 2.2, 0.1]} color={PALETTE.woodDark} shadow={false} />
        {[-0.55, 0, 0.55].map((x) => (
          <Box key={x} position={[x, 1.1, 0.06]} size={[0.06, 2.1, 0.04]} color="#5a3f2b" shadow={false} />
        ))}
        <Box position={[0, 2.32, 0.02]} size={[2.6, 0.26, 0.14]} color={PALETTE.graniteDark} shadow={false} />
      </group>

      {/* Gable window facing +x. */}
      <Window position={[SIDE + 0.02, WALL + 0.9, 0]} facing="side" width={0.6} height={0.7} />
      <Window position={[SIDE + 0.02, 1.55, -1]} facing="side" />

      {/* Front step, bench and hydrangeas. */}
      <Block position={[-0.8, 0, FRONT + 0.45]} size={[1.6, 0.18, 0.7]} color={PALETTE.graniteDark} />
      <group position={[-2.1, 0, FRONT + 0.6]}>
        <Block position={[0, 0.42, 0]} size={[1.5, 0.1, 0.42]} color={PALETTE.wood} />
        {[-0.6, 0.6].map((x) => (
          <Block key={x} position={[x, 0, 0]} size={[0.1, 0.42, 0.38]} color={PALETTE.woodDark} />
        ))}
      </group>
      <Hydrangea x={-6.4} z={FRONT + 0.7} color="#7d9fe3" />
      <Hydrangea x={2.6} z={FRONT + 0.7} color="#e79bc3" />
      <Hydrangea x={-4.1} z={FRONT + 0.75} color="#a98be0" />
    </group>
  );
}
