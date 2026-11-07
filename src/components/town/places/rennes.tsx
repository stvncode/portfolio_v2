"use client";

import { glow, PALETTE } from "../kit/materials";
import { Block, Box, Cylinder, Door } from "../kit/shapes";
import { Sign } from "../kit/sign";
import { TimberHouse } from "../kit/timber-house";

const BAR_GREEN = "#24533f";
const GOLD = "#e7c76a";

function Dartboard() {
  const rings = [
    { radius: 0.34, color: "#1d1d1d" },
    { radius: 0.3, color: "#c23b2f" },
    { radius: 0.26, color: "#efe3c4" },
    { radius: 0.18, color: "#2f7a3e" },
    { radius: 0.14, color: "#efe3c4" },
    { radius: 0.06, color: "#2f7a3e" },
    { radius: 0.03, color: "#c23b2f" },
  ];
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {rings.map((ring, index) => (
        <Cylinder
          key={ring.radius}
          position={[0, index * 0.012, 0]}
          radius={ring.radius}
          height={0.03}
          color={ring.color}
          segments={20}
        />
      ))}
      <Box position={[0.08, 0.12, -0.05]} rotation={[0.3, 0, 0.2]} size={[0.02, 0.2, 0.02]} color="#d9d9d9" />
      <Box position={[-0.1, 0.12, 0.04]} rotation={[0.2, 0, -0.3]} size={[0.02, 0.2, 0.02]} color="#d9d9d9" />
    </group>
  );
}

function BarFront() {
  return (
    <group>
      <Box position={[0, 1.4, 0.04]} size={[6, 2.8, 0.08]} color={BAR_GREEN} shadow={false} />
      {[-1.9, 1.2].map((x) => (
        <group key={x} position={[x, 1.25, 0.1]}>
          <Box size={[1.7, 1.5, 0.06]} color={GOLD} shadow={false} />
          <Box position={[0, 0, 0.02]} size={[1.55, 1.35, 0.06]} material={glow.window} shadow={false} />
        </group>
      ))}
      <Door position={[-0.35, 0, 0.08]} width={0.95} height={2.1} color="#183a2c" frame={GOLD} />
      <group position={[2.55, 1.6, 0.12]}>
        <Dartboard />
      </group>
      <Sign
        text="LE PETIT BAR"
        position={[0, 2.45, 0.1]}
        width={3.4}
        background={BAR_GREEN}
        color={GOLD}
        font="700 72px Georgia, 'Times New Roman', serif"
      />
    </group>
  );
}

function TerraceTable({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <Cylinder position={[0, 0.37, 0]} radius={0.05} height={0.74} color="#2c3238" segments={6} />
      <Cylinder position={[0, 0.75, 0]} radius={0.38} height={0.04} color="#d7d2c6" segments={12} />
      {[-0.55, 0.55].map((offset) => (
        <group key={offset} position={[offset, 0, 0]}>
          <Block position={[0, 0.42, 0]} size={[0.36, 0.05, 0.36]} color="#b0453a" />
          <Block position={[offset > 0 ? 0.16 : -0.16, 0.42, 0]} size={[0.05, 0.42, 0.36]} color="#b0453a" />
          <Block size={[0.04, 0.42, 0.04]} color="#2c3238" />
        </group>
      ))}
      <Cylinder position={[0.1, 0.85, 0.05]} radius={0.05} height={0.16} color="#f2c14e" segments={8} />
    </group>
  );
}

/** Le Petit Bar, Place des Lices. Front faces +z. */
export function PetitBar() {
  return (
    <group>
      <TimberHouse
        width={6}
        depth={4.4}
        floors={2}
        plaster="#efe0c2"
        timber="#6b3a2a"
        ground={BAR_GREEN}
        shop={<BarFront />}
      />
      <TerraceTable x={-1.8} z={3.4} />
      <TerraceTable x={1.4} z={3.6} />
    </group>
  );
}

interface NeighbourProps {
  plaster: string;
  timber: string;
  floors: number;
  shopColor: string;
  shopName: string;
}

/** A neighbouring half-timbered house with a small shop. */
export function Neighbour({ plaster, timber, floors, shopColor, shopName }: NeighbourProps) {
  return (
    <TimberHouse
      width={5}
      depth={4}
      floors={floors}
      plaster={plaster}
      timber={timber}
      ground={shopColor}
      shop={
        <group>
          <Box position={[-1, 1.2, 0.04]} size={[1.9, 1.4, 0.06]} material={glow.window} shadow={false} />
          <Door position={[1.2, 0, 0.04]} width={0.9} color="#3b2a22" />
          <Sign
            text={shopName}
            position={[0, 2.4, 0.08]}
            width={2.6}
            background={shopColor}
            color={PALETTE.white}
            font="700 64px Georgia, serif"
          />
        </group>
      }
    />
  );
}

/** Turns an octagon so a flat face, not a corner, points at +z. */
const FACE_ON: [number, number, number] = [0, Math.PI / 8, 0];

const MANGA_COVERS = ["#e85d4f", "#4f8fe8", "#f2c94c", "#7d5ba6", "#3fae8a", "#f08bb4", "#2c2f3a", "#f29b38"];

/** A green newspaper kiosk that only sells manga. Front faces +z. */
export function Kiosk() {
  return (
    <group>
      <Cylinder position={[0, 1.2, 0]} radius={1.2} height={2.4} color="#2f5a46" segments={8} rotation={FACE_ON} />
      <Cylinder position={[0, 2.5, 0]} radius={1.45} height={0.2} color="#244a39" segments={8} rotation={FACE_ON} />
      <mesh position={[0, 3.05, 0]} rotation={FACE_ON} castShadow>
        <coneGeometry args={[1.4, 0.9, 8]} />
        <meshStandardMaterial color="#2f5a46" flatShading />
      </mesh>
      <Cylinder position={[0, 3.6, 0]} radius={0.08} height={0.35} color={GOLD} segments={6} />
      {[0, Math.PI / 4, -Math.PI / 4, Math.PI / 2].map((angle, side) => (
        <group key={angle} rotation={[0, angle, 0]}>
          <group position={[0, 0, 1.13]}>
            {MANGA_COVERS.slice(side * 2, side * 2 + 4).map((color, index) => (
              <Box
                key={color + index}
                position={[(index % 2) * 0.42 - 0.21, 1.05 + Math.floor(index / 2) * 0.62, 0.02]}
                size={[0.34, 0.5, 0.03]}
                color={color}
                shadow={false}
              />
            ))}
          </group>
        </group>
      ))}
      <Sign
        text="MANGA · ANIME"
        position={[0, 2.5, 1.48]}
        width={1.8}
        background="#244a39"
        color={GOLD}
        font="800 64px ui-sans-serif, system-ui, sans-serif"
      />
    </group>
  );
}

const STALL_STRIPES = ["#e8e2d2", "#c8463c"];

/** A Saturday market stall, Place des Lices style. */
export function MarketStall({ produce }: { produce: string[] }) {
  return (
    <group>
      <Block position={[0, 0.8, 0]} size={[2.2, 0.1, 1.1]} color={PALETTE.wood} />
      {[-1, 1].map((x) =>
        [-0.5, 0.5].map((z) => (
          <Block key={`${x}${z}`} position={[x, 0, z]} size={[0.07, 2.1, 0.07]} color={PALETTE.woodDark} />
        )),
      )}
      {Array.from({ length: 6 }, (_, index) => (
        <Box
          key={index}
          position={[-1.1 + 0.2 + index * 0.36, 2.15, 0.1]}
          rotation={[0.25, 0, 0]}
          size={[0.36, 0.05, 1.5]}
          color={STALL_STRIPES[index % 2]}
        />
      ))}
      {produce.map((color, index) => (
        <group key={color + index} position={[-0.75 + index * 0.5, 0.85, 0]}>
          <Block size={[0.42, 0.18, 0.5]} color={PALETTE.woodDark} />
          <Box position={[0, 0.22, 0]} size={[0.36, 0.1, 0.44]} color={color} />
        </group>
      ))}
    </group>
  );
}
