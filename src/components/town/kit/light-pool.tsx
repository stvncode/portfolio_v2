"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useTown } from "../town-context";
import type { Vec3 } from "./shapes";

const TEXTURE_SIZE = 128;

let glowTexture: THREE.CanvasTexture | null = null;

/** A soft round gradient, white in the middle and clear at the edge. */
export function getGlowTexture(): THREE.CanvasTexture {
  if (!glowTexture) {
    const canvas = document.createElement("canvas");
    canvas.width = TEXTURE_SIZE;
    canvas.height = TEXTURE_SIZE;
    const context = canvas.getContext("2d");
    if (context) {
      const half = TEXTURE_SIZE / 2;
      const gradient = context.createRadialGradient(half, half, 0, half, half, half);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.35, "rgba(255,255,255,0.55)");
      gradient.addColorStop(0.7, "rgba(255,255,255,0.16)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);
    }
    glowTexture = new THREE.CanvasTexture(canvas);
  }
  return glowTexture;
}

interface LightPoolProps {
  /** Centre of the pool on the ground. */
  position: Vec3;
  radius?: number;
  color?: string;
  strength?: number;
  /** Stretch along x, for the light spilling out of a row of windows. */
  stretch?: number;
}

/**
 * Warm light spilling on the ground at night. It's a painted glow rather than
 * a real light, so the village can have dozens of them for free.
 */
export function LightPool({ position, radius = 3, color = "#ffc56e", strength = 0.6, stretch = 1 }: LightPoolProps) {
  const town = useTown();
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    const night = town.nightLevel.current;
    if (mesh.current) mesh.current.visible = night > 0.02;
    if (material.current) material.current.opacity = night * strength;
  });

  return (
    <mesh
      ref={mesh}
      position={[position[0], position[1] + 0.07, position[2]]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[radius * stretch, radius, 1]}
      renderOrder={2}
      visible={false}
    >
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial
        ref={material}
        map={getGlowTexture()}
        color={color}
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
