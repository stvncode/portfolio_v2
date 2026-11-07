"use client";

import type { ReactNode } from "react";
import { PALETTE } from "./materials";
import { Block, Box, PitchedRoof, Window } from "./shapes";

const GROUND = 2.8;
const FLOOR = 2.2;
const JETTY = 0.3;
const BEAM = 0.14;

interface TimberHouseProps {
  width: number;
  depth: number;
  floors: number;
  plaster: string;
  timber: string;
  /** Ground floor colour when there's no shop front. */
  ground?: string;
  /** Drawn on the ground floor's front, for shop fronts. */
  shop?: ReactNode;
}

function TimberFloor({ width, timber, y, z }: { width: number; timber: string; y: number; z: number }) {
  const posts = Math.max(3, Math.round(width / 1.1));
  const spacing = width / posts;
  return (
    <group position={[0, y, z]}>
      <Box position={[0, BEAM / 2, 0]} size={[width + 0.04, BEAM, 0.08]} color={timber} shadow={false} />
      <Box position={[0, FLOOR - BEAM / 2, 0]} size={[width + 0.04, BEAM, 0.08]} color={timber} shadow={false} />
      <Box position={[0, FLOOR * 0.42, 0]} size={[width, BEAM * 0.8, 0.07]} color={timber} shadow={false} />
      {Array.from({ length: posts + 1 }, (_, index) => {
        const x = -width / 2 + index * spacing;
        return <Box key={x} position={[x, FLOOR / 2, 0]} size={[BEAM, FLOOR, 0.08]} color={timber} shadow={false} />;
      })}
      {Array.from({ length: posts }, (_, index) => {
        const x = -width / 2 + (index + 0.5) * spacing;
        if (index % 2 === 0) {
          return <Window key={x} position={[x, FLOOR * 0.62, 0.01]} width={spacing * 0.55} height={0.9} frame={PALETTE.frame} />;
        }
        const brace = Math.hypot(spacing, FLOOR * 0.42);
        const angle = Math.atan2(FLOOR * 0.42, spacing) * (index % 4 === 1 ? 1 : -1);
        return (
          <Box
            key={x}
            position={[x, FLOOR * 0.21, 0]}
            rotation={[0, 0, angle]}
            size={[brace, BEAM * 0.8, 0.07]}
            color={timber}
            shadow={false}
          />
        );
      })}
    </group>
  );
}

/** A Rennes half-timbered house: each upper floor juts out over the street. Front faces +z. */
export function TimberHouse({ width, depth, floors, plaster, timber, ground, shop }: TimberHouseProps) {
  const roofY = GROUND + floors * FLOOR;
  const roofZ = (floors * JETTY) / 2;
  return (
    <group>
      <Block size={[width, GROUND, depth]} color={ground ?? plaster} />
      {shop && <group position={[0, 0, depth / 2]}>{shop}</group>}
      {Array.from({ length: floors }, (_, index) => {
        const y = GROUND + index * FLOOR;
        const z = (index + 1) * JETTY;
        return (
          <group key={y}>
            <Block position={[0, y, z / 2]} size={[width, FLOOR, depth + z]} color={plaster} />
            <TimberFloor width={width} timber={timber} y={y} z={depth / 2 + z + 0.03} />
          </group>
        );
      })}
      <PitchedRoof
        position={[0, roofY, roofZ]}
        length={width}
        span={depth + floors * JETTY}
        height={2.6}
        wallColor={plaster}
        roofColor={PALETTE.slateDark}
        overhang={0.3}
      />
    </group>
  );
}
