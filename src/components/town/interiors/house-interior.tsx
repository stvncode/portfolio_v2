"use client";

import { Cat, PLUME, PONYO } from "../kit/cat";
import { Figure, MALO, MATHILDE } from "../kit/figure";
import { PALETTE } from "../kit/materials";
import { Block, Box, Cylinder } from "../kit/shapes";
import { Sign } from "../kit/sign";
import { MovingBoxes } from "../places/penty";
import { Armchair, Bookcase, CoffeeTable, Fireplace, FloorLamp, Frame, Pendant, Plant, Rug, Sofa } from "./furniture";
import { InteriorSpot } from "./interior-spot";
import { HOUSE_LAYOUT as LAYOUT } from "./layouts";
import { Doorway, Room } from "./room";

const PLACE = "longere";
const CABINET = "#ebe6dc";
const FRIDGE = "#a8d3c0";

function Kitchen() {
  return (
    <group position={[2.5, 0, -LAYOUT.halfDepth + 0.38]}>
      <Block size={[3.4, 0.86, 0.7]} color={CABINET} />
      {[-1.25, -0.42, 0.42, 1.25].map((x) => (
        <Box key={x} position={[x, 0.45, 0.36]} size={[0.78, 0.7, 0.02]} color="#dcd5c8" shadow={false} />
      ))}
      <Box position={[0, 0.89, 0.02]} size={[3.5, 0.06, 0.76]} color={PALETTE.wood} />
      <Box position={[-0.8, 0.91, 0.05]} size={[0.6, 0.02, 0.42]} color="#9aa3ab" shadow={false} />
      <Cylinder position={[-0.8, 1.1, -0.22]} radius={0.025} height={0.35} color="#c9ced3" segments={6} />
      <Box position={[0.9, 0.93, 0.04]} size={[0.7, 0.03, 0.55]} color="#26272b" shadow={false} />
      {[-0.17, 0.17].map((x) =>
        [-0.13, 0.13].map((z) => (
          <Cylinder key={`${x}${z}`} position={[0.9 + x, 0.955, 0.04 + z]} radius={0.09} height={0.01} color="#4a4c52" segments={10} />
        )),
      )}
      <Box position={[0, 2.05, -0.16]} size={[2.4, 0.05, 0.32]} color={PALETTE.wood} />
      {["#f29b38", "#efe6d4", "#3fae8a", "#e85d4f", "#efe6d4"].map((color, index) => (
        <Cylinder key={index} position={[-0.9 + index * 0.42, 2.2, -0.16]} radius={0.08} height={0.24} color={color} segments={8} />
      ))}
      <group position={[2.25, 0, 0]}>
        <Block size={[0.82, 1.85, 0.7]} color={FRIDGE} />
        <Box position={[0, 1.25, 0.36]} size={[0.76, 0.02, 0.02]} color="#8ab5a2" shadow={false} />
        <Box position={[-0.3, 1.45, 0.37]} size={[0.04, 0.3, 0.04]} color="#d8dde0" shadow={false} />
        <Box position={[-0.3, 0.85, 0.37]} size={[0.04, 0.3, 0.04]} color="#d8dde0" shadow={false} />
      </group>
    </group>
  );
}

function DiningTable() {
  return (
    <group>
      <Block position={[0, 0.72, 0]} size={[2.6, 0.08, 1.15]} color="#a37a52" />
      {[-1.15, 1.15].map((x) =>
        [-0.45, 0.45].map((z) => <Block key={`${x}${z}`} position={[x, 0, z]} size={[0.1, 0.72, 0.1]} color={PALETTE.woodDark} />),
      )}
      {[-0.95, 0.95].map((z) => (
        <group key={z} position={[0, 0, z]}>
          <Block position={[0, 0.42, 0]} size={[2.3, 0.07, 0.34]} color="#a37a52" />
          {[-0.95, 0.95].map((x) => (
            <Block key={x} position={[x, 0, 0]} size={[0.08, 0.42, 0.28]} color={PALETTE.woodDark} />
          ))}
        </group>
      ))}
      <Cylinder position={[0.3, 0.86, 0]} radius={0.24} radiusBottom={0.14} height={0.18} color="#e9dcc6" segments={10} />
      {["#e85d4f", "#f2c94c", "#7fb069"].map((color, index) => (
        <mesh key={color} position={[0.2 + index * 0.1, 0.98, (index - 1) * 0.08]}>
          <sphereGeometry args={[0.07, 8, 6]} />
          <meshStandardMaterial color={color} flatShading />
        </mesh>
      ))}
      <Cylinder position={[-0.6, 0.86, 0.1]} radius={0.07} height={0.22} color="#3f73a3" segments={8} />
      {["#f08bb4", "#ffffff", "#f2c94c"].map((color, index) => (
        <mesh key={color} position={[-0.6 + (index - 1) * 0.07, 1.06, 0.1]}>
          <sphereGeometry args={[0.06, 6, 5]} />
          <meshStandardMaterial color={color} flatShading />
        </mesh>
      ))}
    </group>
  );
}

const TOY_COLORS = ["#e85d4f", "#f2c94c", "#4f8fe8", "#3fae8a"];

function PlayCorner() {
  return (
    <group>
      {[0, 1, 2, 3].map((index) => (
        <Box
          key={index}
          position={[(index % 2) * 0.9 - 0.45, 0.02, Math.floor(index / 2) * 0.7 - 0.35]}
          size={[0.88, 0.03, 0.68]}
          color={TOY_COLORS[index]}
          shadow={false}
        />
      ))}
      {[
        [0.55, 0.3],
        [0.7, 0.1],
        [0.4, -0.1],
      ].map(([x, z], index) => (
        <Block key={index} position={[x, 0.03, z]} size={[0.18, 0.18, 0.18]} color={TOY_COLORS[(index + 1) % 4]} />
      ))}
      <Block position={[0.55, 0.21, 0.3]} size={[0.16, 0.16, 0.16]} color={TOY_COLORS[3]} />
      <group position={[-0.5, 0, -0.3]}>
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.18, 8, 6]} />
          <meshStandardMaterial color="#a87a4f" flatShading />
        </mesh>
        <mesh position={[0, 0.44, 0]}>
          <sphereGeometry args={[0.13, 8, 6]} />
          <meshStandardMaterial color="#a87a4f" flatShading />
        </mesh>
        {[-0.09, 0.09].map((x) => (
          <mesh key={x} position={[x, 0.55, 0]}>
            <sphereGeometry args={[0.05, 6, 5]} />
            <meshStandardMaterial color="#8a6040" flatShading />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function CatTree() {
  return (
    <group>
      <Block size={[0.85, 0.08, 0.85]} color="#8f9499" />
      <Cylinder position={[0, 0.95, 0]} radius={0.11} height={1.8} color="#d8c39a" segments={8} />
      <Block position={[0.12, 0.7, 0.05]} size={[0.6, 0.06, 0.55]} color="#8f9499" />
      <Block position={[-0.1, 1.25, -0.05]} size={[0.55, 0.06, 0.5]} color="#8f9499" />
      <Cylinder position={[0, 1.86, 0]} radius={0.38} height={0.14} color="#9aa0a6" segments={12} />
    </group>
  );
}

/** Inside La Longère: living room by the fire, a kitchen, the family and the cats. */
export function HouseInterior({ nearbyId }: { nearbyId: string | null }) {
  const spot = { placeId: PLACE, nearbyId };
  return (
    <group>
      <Room
        layout={LAYOUT}
        floor="#b8906a"
        plank="#a27c58"
        wall="#d6cfc2"
        trim="#8a6b4f"
        windows={[
          { wall: "back", at: -3.2 },
          { wall: "back", at: 1.6, width: 1, height: 1 },
          { wall: "left", at: 2.8 },
        ]}
      />
      <InteriorSpot {...spot} spotId="exit" position={[LAYOUT.doorX, 0, -LAYOUT.halfDepth + 0.02]} bubbleHeight={2.9}>
        <Doorway frame="#8a6b4f" />
      </InteriorSpot>
      <InteriorSpot {...spot} spotId="fireplace" position={[-LAYOUT.halfWidth + 0.5, 0, 0]} bubbleHeight={3.6}>
        <Fireplace />
      </InteriorSpot>

      <group position={[-4.6, 0, 0]}>
        <Rug size={[3.4, 2.8]} color="#b5533c" border="#e7c99a" />
      </group>
      <group position={[-2.4, 0, 0]}>
        <Sofa color="#5b7c99" cushion="#6d8fae" />
      </group>
      <group position={[-4.4, 0, 0]}>
        <CoffeeTable />
      </group>
      <group position={[-4.8, 0, -2.9]}>
        <Armchair color="#d9a441" />
      </group>
      <FloorLamp position={[-1.6, 0, 1.7]} />
      <group position={[-6.6, 0, -LAYOUT.halfDepth + 0.2]}>
        <Bookcase />
      </group>
      <Frame position={[-1.9, 2.15, -LAYOUT.halfDepth + 0.03]} width={0.8} height={0.6} colors={["#bfe0f0", "#f2d68a", "#8fbf6a", "#6a9a4f"]} />
      <Cat look={PONYO} position={[-5.5, 0.02, -0.9]} rotation={[0, -Math.PI / 2, 0]} scale={1.8} />

      <InteriorSpot {...spot} spotId="cats" position={[-0.6, 0, -LAYOUT.halfDepth + 0.9]} bubbleHeight={2.9}>
        <CatTree />
        <Cat look={PLUME} position={[0, 1.93, 0]} rotation={[0, Math.PI / 4, 0]} scale={1.3} sitting />
      </InteriorSpot>

      <Kitchen />
      <InteriorSpot {...spot} spotId="table" position={[3, 0, 0.6]} bubbleHeight={2.4}>
        <DiningTable />
      </InteriorSpot>
      <Pendant position={[2.3, 2.6, 0.6]} color="#e3b75a" />
      <Pendant position={[3.7, 2.6, 0.6]} color="#e3b75a" />
      <Figure look={MATHILDE} position={[1.2, 0, 2.1]} rotation={[0, -Math.PI / 2, 0]} />

      <InteriorSpot {...spot} spotId="malo" position={[-5.6, 0, 2.9]} bubbleHeight={2.2}>
        <PlayCorner />
        <Figure look={MALO} position={[-0.1, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={0.6} />
      </InteriorSpot>

      <InteriorSpot {...spot} spotId="boxes" position={[6.6, 0, 2.8]} bubbleHeight={2.2}>
        <MovingBoxes />
        <Sign
          text="FRAGILE"
          position={[0.4, 0.3, 0.36]}
          width={0.5}
          background="#c99b62"
          color="#b23a2e"
          font="800 64px ui-sans-serif, system-ui, sans-serif"
        />
      </InteriorSpot>
      <group position={[7.3, 0, -3.2]}>
        <Plant scale={1.2} />
      </group>
    </group>
  );
}
