"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import { useTown } from "../town-context";

const RIPPLE_MS = 650;

/** A ring that ripples out where you clicked, so you see where you're heading. */
export function ClickMarker() {
  const town = useTown();
  const ring = useRef<THREE.Mesh>(null);
  const dot = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const mark = town.clickMark.current;
    const age = mark ? (performance.now() - mark.at) / RIPPLE_MS : 1;
    const walking = town.target.current !== null;
    if (ring.current) {
      ring.current.visible = Boolean(mark) && age < 1;
      if (mark && age < 1) {
        ring.current.position.set(mark.x, 0.09, mark.z);
        ring.current.scale.setScalar(0.35 + age * 0.9);
        (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.9 * (1 - age);
      }
    }
    if (dot.current) {
      // The dot stays until you get there.
      dot.current.visible = Boolean(mark) && walking;
      if (mark) dot.current.position.set(mark.x, 0.09, mark.z);
    }
  });

  return (
    <>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} visible={false} renderOrder={3}>
        <ringGeometry args={[0.78, 1, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={dot} rotation={[-Math.PI / 2, 0, 0]} visible={false} renderOrder={3}>
        <circleGeometry args={[0.16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.75} depthWrite={false} />
      </mesh>
    </>
  );
}
