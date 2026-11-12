"use client";

import { litBulb, PALETTE } from "../kit/materials";
import { Block, Box, Cylinder } from "../kit/shapes";
import { Sign } from "../kit/sign";
import { Dartboard } from "../places/rennes";
import { ThrownDarts, useDarts } from "./darts";
import { Pendant } from "./furniture";
import { InteriorSpot } from "./interior-spot";
import { BAR_LAYOUT as LAYOUT } from "./layouts";
import { Doorway, Room } from "./room";

const PLACE = "petit-bar";
const BAR_GREEN = "#24533f";
const GOLD = "#e7c76a";
const BOTTLES = ["#3d6b3a", "#7a2f2f", "#c98a2a", "#2f4f7a", "#e9dcc6", "#5a3a2a"];

/** Exposed beams on the plaster walls, like the timber frame outside. */
function Beams() {
  const height = 3.2;
  return (
    <group>
      {[-3.8, -1.2, 1.4, 4].map((x) => (
        <Box key={`b${x}`} position={[x, height / 2, -LAYOUT.halfDepth + 0.03]} size={[0.16, height, 0.06]} color="#5b3b2b" shadow={false} />
      ))}
      {[-2.2, 1.2].map((z) => (
        <Box key={`l${z}`} position={[-LAYOUT.halfWidth + 0.03, height / 2, z]} size={[0.06, height, 0.16]} color="#5b3b2b" shadow={false} />
      ))}
      <Box position={[0, 2.6, -LAYOUT.halfDepth + 0.04]} size={[LAYOUT.halfWidth * 2, 0.14, 0.06]} color="#5b3b2b" shadow={false} />
    </group>
  );
}

function Counter() {
  return (
    <group>
      <Block size={[5, 1.05, 0.85]} color={BAR_GREEN} />
      <Box position={[0, 1.08, 0.02]} size={[5.15, 0.07, 0.95]} color={PALETTE.woodDark} />
      {[-1.6, -0.8, 0, 0.8, 1.6].map((x) => (
        <Box key={x} position={[x, 0.55, 0.43]} size={[0.06, 0.9, 0.02]} color={GOLD} shadow={false} />
      ))}
      {[-0.4, 0, 0.4].map((x) => (
        <group key={x} position={[x, 1.12, -0.1]}>
          <Cylinder position={[0, 0.22, 0]} radius={0.04} height={0.44} color={GOLD} segments={8} />
          <Box position={[0, 0.4, 0.08]} size={[0.05, 0.05, 0.16]} color={GOLD} />
        </group>
      ))}
      {[1.3, 1.6].map((x) => (
        <Cylinder key={x} position={[x, 1.24, 0.15]} radius={0.06} height={0.24} color="#f2c14e" segments={8} />
      ))}
    </group>
  );
}

/** Bottles on lit shelves along the back wall. */
function BackShelves() {
  return (
    <group>
      {[1.4, 2].map((y, shelf) => (
        <group key={y}>
          <Box position={[0, y, 0.1]} size={[4.6, 0.05, 0.25]} color={PALETTE.wood} shadow={false} />
          {Array.from({ length: 14 }, (_, index) => (
            <Cylinder
              key={index}
              position={[-2.1 + index * 0.32, y + 0.17, 0.1]}
              radius={0.06}
              height={0.3 + (index % 3) * 0.04}
              color={BOTTLES[(index + shelf * 2) % BOTTLES.length]}
              segments={6}
            />
          ))}
        </group>
      ))}
      <mesh position={[0, 2.38, 0.1]} material={litBulb}>
        <boxGeometry args={[4.4, 0.03, 0.03]} />
      </mesh>
    </group>
  );
}

function Stool({ x }: { x: number }) {
  return (
    <group position={[x, 0, 0]}>
      <Cylinder position={[0, 0.36, 0]} radius={0.04} height={0.72} color="#2c3238" segments={6} />
      <Cylinder position={[0, 0.74, 0]} radius={0.2} height={0.08} color="#b0453a" segments={10} />
      <Cylinder position={[0, 0.02, 0]} radius={0.18} height={0.04} color="#2c3238" segments={10} />
    </group>
  );
}

function BarTable() {
  return (
    <group>
      <Cylinder position={[0, 0.37, 0]} radius={0.05} height={0.74} color="#2c3238" segments={6} />
      <Cylinder position={[0, 0.75, 0]} radius={0.45} height={0.05} color={PALETTE.woodDark} segments={14} />
      {[-0.65, 0.65].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <Block position={[0, 0.42, 0]} size={[0.36, 0.05, 0.36]} color="#5b3b2b" />
          <Block position={[x > 0 ? 0.16 : -0.16, 0.42, 0]} size={[0.05, 0.45, 0.36]} color="#5b3b2b" />
          {[-0.14, 0.14].map((z) => (
            <Block key={z} position={[0, 0, z]} size={[0.04, 0.42, 0.04]} color="#3a2a1e" />
          ))}
        </group>
      ))}
      <Cylinder position={[0, 0.83, 0]} radius={0.04} height={0.1} color="#efe6d4" segments={8} />
      <mesh position={[0, 0.92, 0]} material={litBulb}>
        <sphereGeometry args={[0.025, 6, 5]} />
      </mesh>
    </group>
  );
}

/** Inside Le Petit Bar: the counter, the bottles, and the dartboard. */
export function BarInterior({ nearbyId }: { nearbyId: string | null }) {
  const spot = { placeId: PLACE, nearbyId };
  const game = useDarts("darts");
  return (
    <group>
      <Room
        layout={LAYOUT}
        floor="#6b4a33"
        plank="#5a3d2a"
        wall="#efe0c2"
        trim="#5b3b2b"
        windows={[{ wall: "left", at: -1.4, width: 0.8, height: 1.1 }]}
      />
      <Beams />
      <InteriorSpot {...spot} spotId="exit" position={[LAYOUT.doorX, 0, -LAYOUT.halfDepth + 0.02]} bubbleHeight={2.9}>
        <Doorway frame="#5b3b2b" />
      </InteriorSpot>
      <group position={[2, 0, -LAYOUT.halfDepth + 0.05]}>
        <BackShelves />
      </group>
      <Sign
        text="LE PETIT BAR"
        position={[2, 2.85, -LAYOUT.halfDepth + 0.04]}
        width={2.4}
        background={BAR_GREEN}
        color={GOLD}
        font="700 72px Georgia, 'Times New Roman', serif"
      />
      <InteriorSpot {...spot} spotId="counter" position={[2, 0, -2.3]} bubbleHeight={2.4}>
        <Counter />
      </InteriorSpot>
      <group position={[0, 0, -1.4]}>
        {[0, 1.3, 2.6, 3.9].map((x) => (
          <Stool key={x} x={x} />
        ))}
      </group>
      <InteriorSpot
        {...spot}
        spotId="darts"
        position={[-LAYOUT.halfWidth + 0.06, 1.75, 0.4]}
        bubbleHeight={1.3}
        line={game.line}
        keyHint={game.keyHint}
        touchHint={game.touchHint}
      >
        <group rotation={[0, Math.PI / 2, 0]}>
          <Dartboard darts={false} />
        </group>
        <ThrownDarts darts={game.darts} />
        <Box position={[-0.03, 0, 0]} size={[0.04, 0.9, 0.9]} color="#3a2a1e" />
      </InteriorSpot>
      <Box position={[-2.45, 0.015, 0.4]} size={[0.06, 0.02, 1]} color={GOLD} shadow={false} />
      <group position={[-1.4, 0, 2.2]}>
        <BarTable />
      </group>
      <group position={[2.6, 0, 2.2]}>
        <BarTable />
      </group>
      <Pendant position={[-1.4, 2.4, 2.2]} color={BAR_GREEN} />
      <Pendant position={[2.6, 2.4, 2.2]} color={BAR_GREEN} />
      <Pendant position={[2, 2.6, -1.2]} color={BAR_GREEN} />
    </group>
  );
}
