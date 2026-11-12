"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { scatter, seededRandom } from "@/lib/town/scatter";
import { Instances, type Placement } from "../kit/instances";
import { PALETTE } from "../kit/materials";
import { BUSHES, COURTYARD, HEDGES, OBSTACLES, PATHS, PLAZA, type Rect, TREES, type TreeKind, type TreeSpot } from "../world-layout";

const trunkGeometry = new THREE.CylinderGeometry(0.16, 0.22, 1, 6);
const roundCanopy = new THREE.IcosahedronGeometry(1, 0);
const pineCanopy = new THREE.ConeGeometry(1, 1, 7);
const unitBox = new THREE.BoxGeometry(1, 1, 1);
const flowerGeometry = new THREE.IcosahedronGeometry(1, 0);
const tuftGeometry = new THREE.ConeGeometry(1, 1, 4);
const patchGeometry = new THREE.CircleGeometry(1, 9).rotateX(-Math.PI / 2);
const rockGeometry = new THREE.DodecahedronGeometry(1, 0);

/** How far the canopies rock in the wind, in radians. */
const SWAY = 0.03;
const BUSH_GREENS = ["#5f9449", "#6aa052", "#578a43"];

const TRUNK_HEIGHT: Record<TreeKind, number> = { oak: 1.6, apple: 1.1, pine: 1.2 };
const OAK_GREENS = ["#6ea251", "#78ad57", "#63984a", "#82b25c"];
const PINE_GREENS = ["#3f6e3c", "#467a41", "#386536"];
const APPLE_GREEN = "#7fae58";
const FLOWER_COLORS = ["#fffaf0", "#f6d55c", "#f08bb4", "#b48be0", "#e85d4f", "#8fb8f0"];

function spin(spot: TreeSpot) {
  return (spot.x * 12.9898 + spot.z * 78.233) % (Math.PI * 2);
}

function pick<T>(list: T[], seed: number): T {
  return list[Math.abs(Math.floor(seed * 1000)) % list.length];
}

function useTreePlacements() {
  return useMemo(() => {
    const trunks: Placement[] = [];
    const round: Placement[] = [];
    const roundTop: Placement[] = [];
    const apples: Placement[] = [];
    const fruit: Placement[] = [];
    const pines: Placement[] = [];

    for (const spot of TREES) {
      const trunk = TRUNK_HEIGHT[spot.kind] * spot.scale;
      const rotationY = spin(spot);
      trunks.push({ position: [spot.x, trunk / 2, spot.z], scale: [spot.scale, trunk, spot.scale] });
      if (spot.kind === "pine") {
        const green = pick(PINE_GREENS, rotationY);
        [0, 1, 2].forEach((tier) => {
          const radius = (1.5 - tier * 0.35) * spot.scale;
          pines.push({
            position: [spot.x, trunk + (0.6 + tier * 1.05) * spot.scale, spot.z],
            scale: [radius, 1.7 * spot.scale, radius],
            rotationY,
            color: green,
          });
        });
      } else if (spot.kind === "apple") {
        apples.push({
          position: [spot.x, trunk + 0.8 * spot.scale, spot.z],
          scale: [1.3 * spot.scale, 1.05 * spot.scale, 1.3 * spot.scale],
          rotationY,
        });
        const random = seededRandom(Math.round(spot.x * 100 + spot.z));
        for (let index = 0; index < 6; index += 1) {
          const angle = random() * Math.PI * 2;
          const radius = 1.15 * spot.scale;
          fruit.push({
            position: [spot.x + Math.cos(angle) * radius, trunk + (0.5 + random() * 0.7) * spot.scale, spot.z + Math.sin(angle) * radius],
            scale: [0.12, 0.12, 0.12],
          });
        }
      } else {
        const green = pick(OAK_GREENS, rotationY);
        round.push({
          position: [spot.x, trunk + 1.2 * spot.scale, spot.z],
          scale: [1.8 * spot.scale, 1.5 * spot.scale, 1.8 * spot.scale],
          rotationY,
          color: green,
        });
        roundTop.push({
          position: [spot.x + 0.5 * spot.scale, trunk + 2.1 * spot.scale, spot.z - 0.3 * spot.scale],
          scale: [1.2 * spot.scale, 1.1 * spot.scale, 1.2 * spot.scale],
          rotationY: rotationY + 1,
          color: new THREE.Color(green).offsetHSL(0, 0, -0.06).getStyle(),
        });
      }
    }
    return { trunks, round, roundTop, apples, fruit, pines };
  }, []);
}

const HEDGE_HEIGHT = 1.15;

function hedgePlacements(rects: Rect[]): Placement[] {
  return rects.flatMap((rect) => [
    {
      position: [rect.x, HEDGE_HEIGHT / 2, rect.z] as [number, number, number],
      scale: [rect.w, HEDGE_HEIGHT, rect.d] as [number, number, number],
    },
    {
      position: [rect.x, HEDGE_HEIGHT + 0.12, rect.z] as [number, number, number],
      scale: [rect.w * 0.96 - 0.12, 0.3, rect.d * 0.96 - 0.12].map((v) => Math.max(v, 0.4)) as [number, number, number],
    },
  ]);
}

/** The village's green: everywhere you can walk, minus paths and buildings. */
const GREEN: Rect = { x: -0.5, z: 6.5, w: 63, d: 63 };
const KEEP_CLEAR: Rect[] = [...PATHS, PLAZA, COURTYARD, ...OBSTACLES, { x: -4, z: 31.5, w: 17, d: 11 }, { x: 20, z: 19.5, w: 11, d: 11 }];

function useGroundDetail() {
  return useMemo(() => {
    const flowers: Placement[] = [];
    const random = seededRandom(7);
    // Flowers grow in little clusters.
    for (const centre of scatter({ count: 70, seed: 11, area: GREEN, avoid: KEEP_CLEAR, margin: 1 })) {
      const color = FLOWER_COLORS[Math.floor(random() * FLOWER_COLORS.length)];
      const blooms = 3 + Math.floor(random() * 4);
      for (let index = 0; index < blooms; index += 1) {
        const size = 0.09 + random() * 0.06;
        flowers.push({
          position: [centre.x + (random() - 0.5) * 1.2, 0.18 + random() * 0.1, centre.z + (random() - 0.5) * 1.2],
          scale: [size, size, size],
          color,
        });
      }
    }
    const tufts: Placement[] = scatter({ count: 260, seed: 23, area: GREEN, avoid: KEEP_CLEAR, margin: 0.5 }).map((point) => {
      const height = 0.25 + random() * 0.25;
      return {
        position: [point.x, height / 2, point.z],
        scale: [0.12, height, 0.12],
        rotationY: random() * Math.PI,
        color: random() > 0.5 ? "#6f9f4f" : "#7caf58",
      };
    });
    const patches: Placement[] = scatter({ count: 40, seed: 31, area: GREEN, avoid: KEEP_CLEAR, margin: 1.5 }).map((point) => {
      const size = 1.2 + random() * 1.8;
      return { position: [point.x, 0.008, point.z], scale: [size, 1, size * (0.6 + random() * 0.4)], rotationY: random() * Math.PI };
    });
    const rocks: Placement[] = scatter({ count: 26, seed: 59, area: GREEN, avoid: KEEP_CLEAR, margin: 1.2 }).map((point) => {
      const size = 0.16 + random() * 0.3;
      return {
        position: [point.x, size * 0.35, point.z],
        scale: [size, size * 0.7, size * (0.8 + random() * 0.5)],
        rotationY: random() * Math.PI,
        color: random() > 0.5 ? "#a9a195" : "#bdb6aa",
      };
    });
    return { flowers, tufts, patches, rocks };
  }, []);
}

/** Round shrubs by the buildings, some of them in flower. */
function useBushes() {
  return useMemo(() => {
    const random = seededRandom(13);
    const leaves: Placement[] = [];
    const blooms: Placement[] = [];
    for (const bush of BUSHES) {
      const green = BUSH_GREENS[Math.floor(random() * BUSH_GREENS.length)];
      leaves.push({
        position: [bush.x, 0.42 * bush.scale, bush.z],
        scale: [0.85 * bush.scale, 0.62 * bush.scale, 0.85 * bush.scale],
        rotationY: random() * Math.PI,
        color: green,
      });
      leaves.push({
        position: [bush.x + 0.45 * bush.scale, 0.3 * bush.scale, bush.z + 0.3 * bush.scale],
        scale: [0.5 * bush.scale, 0.42 * bush.scale, 0.5 * bush.scale],
        rotationY: random() * Math.PI,
        color: green,
      });
      if (!bush.bloom) continue;
      for (let index = 0; index < 7; index += 1) {
        const angle = random() * Math.PI * 2;
        const reach = 0.25 + random() * 0.45;
        blooms.push({
          position: [
            bush.x + Math.cos(angle) * reach * bush.scale,
            (0.75 + random() * 0.2) * bush.scale,
            bush.z + Math.sin(angle) * reach * bush.scale,
          ],
          scale: [0.1, 0.1, 0.1],
          color: bush.bloom,
        });
      }
    }
    return { leaves, blooms };
  }, []);
}

export function Nature() {
  const trees = useTreePlacements();
  const hedges = useMemo(() => hedgePlacements(HEDGES), []);
  const ground = useGroundDetail();
  const bushes = useBushes();

  return (
    <group>
      <Instances geometry={trunkGeometry} color={PALETTE.trunk} placements={trees.trunks} />
      <Instances geometry={roundCanopy} color={PALETTE.leaf} placements={trees.round} sway={SWAY} />
      <Instances geometry={roundCanopy} color={PALETTE.leafDark} placements={trees.roundTop} sway={SWAY * 1.4} />
      <Instances geometry={roundCanopy} color={APPLE_GREEN} placements={trees.apples} sway={SWAY} />
      <Instances geometry={flowerGeometry} color="#d9473a" placements={trees.fruit} castShadow={false} />
      <Instances geometry={pineCanopy} color="#3f6e3c" placements={trees.pines} sway={SWAY * 0.7} />
      <Instances geometry={roundCanopy} color={BUSH_GREENS[0]} placements={bushes.leaves} />
      <Instances geometry={flowerGeometry} color="#ffffff" placements={bushes.blooms} castShadow={false} />
      <Instances geometry={rockGeometry} color="#a9a195" placements={ground.rocks} />
      <Instances geometry={unitBox} color={PALETTE.hedge} placements={hedges} />
      <Instances geometry={flowerGeometry} color="#ffffff" placements={ground.flowers} castShadow={false} />
      <Instances geometry={tuftGeometry} color="#6f9f4f" placements={ground.tufts} castShadow={false} />
      <Instances geometry={patchGeometry} color="#86b862" placements={ground.patches} castShadow={false} />
    </group>
  );
}
