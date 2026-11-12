"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { isSolid, vertexSolid } from "./materials";

/** Put this on a group's `userData` to keep its moving parts out of a batch. */
export const DYNAMIC = { dynamic: true } as const;

interface Bucket {
  material: THREE.Material;
  castShadow: boolean;
  receiveShadow: boolean;
  sources: THREE.Mesh[];
}

function collect(object: THREE.Object3D, buckets: Map<string, Bucket>) {
  if (object.userData.dynamic) return;
  const mesh = object as THREE.Mesh;
  const instanced = (object as THREE.InstancedMesh).isInstancedMesh;
  if (mesh.isMesh && !instanced && !Array.isArray(mesh.material) && mesh.visible) {
    // Solid colours all share one batch; anything else batches with its own material.
    const solidColour = isSolid(mesh.material);
    const key = `${solidColour ? "solid" : mesh.material.uuid}:${mesh.castShadow}:${mesh.receiveShadow}`;
    const bucket = buckets.get(key) ?? {
      material: solidColour ? vertexSolid : mesh.material,
      castShadow: mesh.castShadow,
      receiveShadow: mesh.receiveShadow,
      sources: [],
    };
    bucket.sources.push(mesh);
    buckets.set(key, bucket);
  }
  for (const child of object.children) collect(child, buckets);
}

/**
 * Merges the still meshes inside it into as few meshes as it can, so a village
 * made of thousands of boxes costs a handful of draw calls.
 * Only wrap things that never move; mark moving parts with `userData={DYNAMIC}`.
 */
export function Batched({ children }: { children: ReactNode }) {
  const root = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    const group = root.current;
    if (!group) return;
    group.updateWorldMatrix(true, true);
    const toLocal = group.matrixWorld.clone().invert();
    const buckets = new Map<string, Bucket>();
    collect(group, buckets);

    const created: THREE.Mesh[] = [];
    const hidden: THREE.Mesh[] = [];
    const matrix = new THREE.Matrix4();
    for (const bucket of Array.from(buckets.values())) {
      if (bucket.sources.length < 2) continue;
      const parts = bucket.sources.map((source: THREE.Mesh) => {
        const part = source.geometry.index ? source.geometry.toNonIndexed() : source.geometry.clone();
        // These materials are plain colours: position and normal are all they need.
        for (const name of Object.keys(part.attributes)) {
          if (name !== "position" && name !== "normal") part.deleteAttribute(name);
        }
        part.applyMatrix4(matrix.multiplyMatrices(toLocal, source.matrixWorld));
        const material = source.material as THREE.Material;
        if (isSolid(material)) {
          const vertices = part.attributes.position.count;
          const colors = new Float32Array(vertices * 3);
          for (let vertex = 0; vertex < vertices; vertex += 1) material.color.toArray(colors, vertex * 3);
          part.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        }
        return part;
      });
      const geometry = mergeGeometries(parts, false);
      for (const part of parts) part.dispose();
      if (!geometry) continue;
      const merged = new THREE.Mesh(geometry, bucket.material);
      merged.castShadow = bucket.castShadow;
      merged.receiveShadow = bucket.receiveShadow;
      merged.userData.dynamic = true;
      group.add(merged);
      created.push(merged);
      for (const source of bucket.sources) {
        source.visible = false;
        hidden.push(source);
      }
    }

    return () => {
      for (const merged of created) {
        group.remove(merged);
        merged.geometry.dispose();
      }
      for (const source of hidden) source.visible = true;
    };
  }, []);

  return <group ref={root}>{children}</group>;
}
