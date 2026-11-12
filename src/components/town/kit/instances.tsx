"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { solid } from "./materials";

export interface Placement {
  position: [number, number, number];
  scale: [number, number, number];
  rotationY?: number;
  /** Per-copy colour; when any copy has one, the base colour is ignored. */
  color?: string;
}

interface InstancesProps {
  geometry: THREE.BufferGeometry;
  color: string;
  placements: Placement[];
  castShadow?: boolean;
  /** Rock gently in the wind, by this many radians. */
  sway?: number;
}

const matrix = new THREE.Matrix4();
const quaternion = new THREE.Quaternion();
const euler = new THREE.Euler();
const position = new THREE.Vector3();
const scale = new THREE.Vector3();

function place(mesh: THREE.InstancedMesh, index: number, placement: Placement, tiltX: number, tiltZ: number) {
  euler.set(tiltX, placement.rotationY ?? 0, tiltZ);
  quaternion.setFromEuler(euler);
  matrix.compose(position.set(...placement.position), quaternion, scale.set(...placement.scale));
  mesh.setMatrixAt(index, matrix);
}

/** One draw call for many copies of the same shape. */
export function Instances({ geometry, color, placements, castShadow = true, sway = 0 }: InstancesProps) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const tinted = placements.some((placement) => placement.color);
  const material = useMemo(() => (tinted ? solid("#ffffff") : solid(color)), [tinted, color]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const tint = new THREE.Color();
    placements.forEach((placement, index) => {
      place(mesh, index, placement, 0, 0);
      if (tinted) mesh.setColorAt(index, tint.set(placement.color ?? color));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [placements, tinted, color]);

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh || sway === 0) return;
    const time = clock.elapsedTime;
    placements.forEach((placement, index) => {
      // Neighbours move together, like one gust passing through.
      const phase = placement.position[0] * 0.3 + placement.position[2] * 0.22;
      place(mesh, index, placement, Math.sin(time * 1.1 + phase) * sway, Math.cos(time * 0.85 + phase) * sway);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[geometry, material, placements.length]} castShadow={castShadow} receiveShadow />;
}
