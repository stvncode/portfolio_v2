"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { PALETTE, solid } from "../kit/materials";
import { HEDGES, type Rect, TREES, type TreeKind, type TreeSpot } from "../world-layout";

interface Placement {
  position: [number, number, number];
  scale: [number, number, number];
  rotationY?: number;
}

interface InstancesProps {
  geometry: THREE.BufferGeometry;
  color: string;
  placements: Placement[];
}

/** One draw call for many copies of the same shape. */
function Instances({ geometry, color, placements }: InstancesProps) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    placements.forEach(({ position, scale, rotationY = 0 }, index) => {
      quaternion.setFromAxisAngle(up, rotationY);
      matrix.compose(
        new THREE.Vector3(...position),
        quaternion,
        new THREE.Vector3(...scale),
      );
      mesh.setMatrixAt(index, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [placements]);

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, solid(color), placements.length]}
      castShadow
      receiveShadow
    />
  );
}

const trunkGeometry = new THREE.CylinderGeometry(0.16, 0.22, 1, 6);
const roundCanopy = new THREE.IcosahedronGeometry(1, 0);
const pineCanopy = new THREE.ConeGeometry(1, 1, 7);
const unitBox = new THREE.BoxGeometry(1, 1, 1);

const TRUNK_HEIGHT: Record<TreeKind, number> = { oak: 1.6, apple: 1.1, pine: 1.2 };

function spin(spot: TreeSpot) {
  return (spot.x * 12.9898 + spot.z * 78.233) % (Math.PI * 2);
}

function useTreePlacements() {
  return useMemo(() => {
    const trunks: Placement[] = [];
    const round: Placement[] = [];
    const roundDark: Placement[] = [];
    const apple: Placement[] = [];
    const pines: Placement[] = [];

    for (const spot of TREES) {
      const trunk = TRUNK_HEIGHT[spot.kind] * spot.scale;
      trunks.push({
        position: [spot.x, trunk / 2, spot.z],
        scale: [spot.scale, trunk, spot.scale],
      });
      const rotationY = spin(spot);
      if (spot.kind === "pine") {
        [0, 1, 2].forEach((tier) => {
          const radius = (1.5 - tier * 0.35) * spot.scale;
          pines.push({
            position: [spot.x, trunk + (0.6 + tier * 1.05) * spot.scale, spot.z],
            scale: [radius, 1.7 * spot.scale, radius],
            rotationY,
          });
        });
      } else if (spot.kind === "apple") {
        apple.push({
          position: [spot.x, trunk + 0.8 * spot.scale, spot.z],
          scale: [1.3 * spot.scale, 1.05 * spot.scale, 1.3 * spot.scale],
          rotationY,
        });
      } else {
        round.push({
          position: [spot.x, trunk + 1.2 * spot.scale, spot.z],
          scale: [1.8 * spot.scale, 1.5 * spot.scale, 1.8 * spot.scale],
          rotationY,
        });
        roundDark.push({
          position: [spot.x + 0.5 * spot.scale, trunk + 2.1 * spot.scale, spot.z - 0.3 * spot.scale],
          scale: [1.2 * spot.scale, 1.1 * spot.scale, 1.2 * spot.scale],
          rotationY: rotationY + 1,
        });
      }
    }
    return { trunks, round, roundDark, apple, pines };
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
      scale: [rect.w * 0.96 - 0.12, 0.3, rect.d * 0.96 - 0.12].map((v) =>
        Math.max(v, 0.4),
      ) as [number, number, number],
    },
  ]);
}

export function Nature() {
  const trees = useTreePlacements();
  const hedges = useMemo(() => hedgePlacements(HEDGES), []);

  return (
    <group>
      <Instances geometry={trunkGeometry} color={PALETTE.trunk} placements={trees.trunks} />
      <Instances geometry={roundCanopy} color={PALETTE.leaf} placements={trees.round} />
      <Instances geometry={roundCanopy} color={PALETTE.leafDark} placements={trees.roundDark} />
      <Instances geometry={roundCanopy} color="#7fae58" placements={trees.apple} />
      <Instances geometry={pineCanopy} color="#3f6e3c" placements={trees.pines} />
      <Instances geometry={unitBox} color={PALETTE.hedge} placements={hedges} />
    </group>
  );
}
