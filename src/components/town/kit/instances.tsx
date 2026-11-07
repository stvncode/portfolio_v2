"use client";

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
}

/** One draw call for many copies of the same shape. */
export function Instances({ geometry, color, placements, castShadow = true }: InstancesProps) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const tinted = placements.some((placement) => placement.color);
  const material = useMemo(() => (tinted ? solid("#ffffff") : solid(color)), [tinted, color]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    const tint = new THREE.Color();
    placements.forEach(({ position, scale, rotationY = 0, color: placementColor }, index) => {
      quaternion.setFromAxisAngle(up, rotationY);
      matrix.compose(new THREE.Vector3(...position), quaternion, new THREE.Vector3(...scale));
      mesh.setMatrixAt(index, matrix);
      if (tinted) mesh.setColorAt(index, tint.set(placementColor ?? color));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [placements, tinted, color]);

  return <instancedMesh ref={ref} args={[geometry, material, placements.length]} castShadow={castShadow} receiveShadow />;
}
