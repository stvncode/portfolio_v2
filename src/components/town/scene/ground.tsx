"use client";

import type { ThreeEvent } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { scatter, seededRandom } from "@/lib/town/scatter";
import { Instances, type Placement } from "../kit/instances";
import { PALETTE, solid } from "../kit/materials";
import { COURTYARD, FIELDS, PATHS, PLAZA, type Rect } from "../world-layout";

const GROUND_SIZE = 320;
const stoneGeometry = new THREE.CylinderGeometry(1, 1, 1, 7);
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const FLAGSTONE_SHADES = ["#d5c59d", "#e6d9b6", "#d9caa3", "#cfbf97"];
const SETT_SHADES = ["#bcb1a2", "#b0a595", "#c7bdae", "#a69b8c", "#b8ad9d"];
const GRAVEL_SHADES = ["#cfc7b3", "#e2dccb", "#bdb5a2"];
/** Flagstones per square unit of path. */
const FLAGSTONE_DENSITY = 0.5;
const SETT_WIDTH = 0.9;
const SETT_DEPTH = 0.58;
const SETT_GAP = 0.07;
const FURROW_SPACING = 1.25;

interface GroundProps {
  onWalkTo: (x: number, z: number) => void;
}

function Patch({ rect, color, y }: { rect: Rect; color: string; y: number }) {
  return (
    <mesh position={[rect.x, y, rect.z]} rotation={[-Math.PI / 2, 0, 0]} material={solid(color)} receiveShadow>
      <planeGeometry args={[rect.w, rect.d]} />
    </mesh>
  );
}

/** Flat stones laid into the sandy paths, each a slightly different shade. */
function useFlagstones(): Placement[] {
  return useMemo(() => {
    const random = seededRandom(41);
    return PATHS.flatMap((path, index) => {
      const inner = { ...path, w: path.w - 0.5, d: path.d - 0.5 };
      const count = Math.round(path.w * path.d * FLAGSTONE_DENSITY);
      return scatter({ count, seed: 50 + index, area: inner, avoid: [PLAZA], margin: 0 }).map((point) => {
        const size = 0.2 + random() * 0.24;
        return {
          position: [point.x, 0.035, point.z] as [number, number, number],
          scale: [size, 0.03, size * (0.7 + random() * 0.5)] as [number, number, number],
          rotationY: random() * Math.PI,
          color: FLAGSTONE_SHADES[Math.floor(random() * FLAGSTONE_SHADES.length)],
        };
      });
    });
  }, []);
}

/** The square's granite setts, laid in offset rows like Place des Lices. */
function useSetts(): Placement[] {
  return useMemo(() => {
    const random = seededRandom(17);
    const setts: Placement[] = [];
    const rows = Math.floor(PLAZA.d / (SETT_DEPTH + SETT_GAP));
    const columns = Math.floor(PLAZA.w / (SETT_WIDTH + SETT_GAP));
    for (let row = 0; row < rows; row += 1) {
      const offset = row % 2 ? (SETT_WIDTH + SETT_GAP) / 2 : 0;
      for (let column = 0; column < columns - (row % 2); column += 1) {
        setts.push({
          position: [
            PLAZA.x - PLAZA.w / 2 + SETT_WIDTH / 2 + SETT_GAP + offset + column * (SETT_WIDTH + SETT_GAP),
            0.045,
            PLAZA.z - PLAZA.d / 2 + SETT_DEPTH / 2 + SETT_GAP + row * (SETT_DEPTH + SETT_GAP),
          ],
          scale: [SETT_WIDTH, 0.04 + random() * 0.015, SETT_DEPTH],
          color: SETT_SHADES[Math.floor(random() * SETT_SHADES.length)],
        });
      }
    }
    return setts;
  }, []);
}

/** Ploughed furrows and rows of wheat, so the fields read as worked land. */
function useFurrows(): Placement[] {
  return useMemo(() => {
    const furrows: Placement[] = [];
    for (const field of FIELDS) {
      if (field.color === PALETTE.grassDark) continue;
      const ploughed = field.color === PALETTE.fieldPlowed;
      const rows = Math.floor(field.d / FURROW_SPACING);
      for (let row = 1; row < rows; row += 1) {
        furrows.push({
          position: [field.x, 0.03, field.z - field.d / 2 + row * FURROW_SPACING],
          scale: [field.w - 1.6, ploughed ? 0.07 : 0.16, ploughed ? 0.45 : 0.5],
          color: ploughed ? "#96795a" : row % 2 ? "#d9d37c" : "#d1ca70",
        });
      }
    }
    return furrows;
  }, []);
}

function useGravel(): Placement[] {
  return useMemo(() => {
    const random = seededRandom(29);
    return scatter({ count: 150, seed: 77, area: COURTYARD, avoid: [], margin: 0 }).map((point) => {
      const size = 0.07 + random() * 0.09;
      return {
        position: [point.x, 0.04, point.z] as [number, number, number],
        scale: [size, 0.03, size] as [number, number, number],
        rotationY: random() * Math.PI,
        color: GRAVEL_SHADES[Math.floor(random() * GRAVEL_SHADES.length)],
      };
    });
  }, []);
}

/** Grass, fields, paths and the cobbled square. Clicking anywhere on it walks there. */
export function Ground({ onWalkTo }: GroundProps) {
  const flagstones = useFlagstones();
  const setts = useSetts();
  const furrows = useFurrows();
  const gravel = useGravel();

  function handlePointerDown(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    onWalkTo(event.point.x, event.point.z);
  }

  return (
    <group onPointerDown={handlePointerDown}>
      <Patch rect={{ x: 0, z: 0, w: GROUND_SIZE, d: GROUND_SIZE }} color={PALETTE.grass} y={0} />
      {FIELDS.map((field) => (
        <Patch key={`${field.x}:${field.z}`} rect={field} color={field.color} y={0.01} />
      ))}
      <Instances geometry={boxGeometry} color="#96795a" placements={furrows} castShadow={false} />
      {PATHS.map((path) => (
        <Patch key={`${path.x}:${path.z}`} rect={path} color={PALETTE.path} y={0.02} />
      ))}
      <Instances geometry={stoneGeometry} color={PALETTE.path} placements={flagstones} castShadow={false} />
      <Patch rect={COURTYARD} color="#d6cfbc" y={0.025} />
      <Instances geometry={stoneGeometry} color="#cfc7b3" placements={gravel} castShadow={false} />
      <Patch rect={PLAZA} color="#9d9384" y={0.03} />
      <Instances geometry={boxGeometry} color={PALETTE.cobble} placements={setts} castShadow={false} />
    </group>
  );
}
