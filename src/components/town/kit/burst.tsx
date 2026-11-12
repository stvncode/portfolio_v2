"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { seededRandom } from "@/lib/town/scatter";
import type { Vec3 } from "./shapes";

type BurstKind = "hearts" | "confetti";

interface BurstProps {
  /** Bump this number to fire the burst. */
  trigger: number;
  kind: BurstKind;
  position?: Vec3;
}

interface Particle {
  velocity: THREE.Vector3;
  spin: number;
  delay: number;
  color: string;
}

const SETTINGS: Record<BurstKind, { count: number; life: number; gravity: number; size: number; colors: string[] }> = {
  hearts: { count: 6, life: 1.6, gravity: 0, size: 0.34, colors: ["#f2647c", "#f58aa0", "#ee4f6b"] },
  confetti: { count: 28, life: 1.8, gravity: 9, size: 0.14, colors: ["#f2c94c", "#e85d4f", "#4f8fe8", "#3fae8a", "#f08bb4", "#ffffff"] },
};

/** The camera looks from +x and +z, so flat shapes turned this way face it. */
const FACE_CAMERA = Math.PI / 4;

let heartGeometry: THREE.ShapeGeometry | null = null;
function getHeartGeometry() {
  if (!heartGeometry) {
    const heart = new THREE.Shape();
    heart.moveTo(0, -0.5);
    heart.bezierCurveTo(-0.95, 0.05, -0.5, 0.8, 0, 0.3);
    heart.bezierCurveTo(0.5, 0.8, 0.95, 0.05, 0, -0.5);
    heartGeometry = new THREE.ShapeGeometry(heart, 6);
  }
  return heartGeometry;
}

const confettiGeometry = new THREE.BoxGeometry(1, 0.2, 0.6);

/** A little burst of hearts or confetti, fired by bumping `trigger`. */
export function Burst({ trigger, kind, position }: BurstProps) {
  const settings = SETTINGS[kind];
  const meshes = useRef<THREE.Mesh[]>([]);
  const startedAt = useRef(-1);
  const clockNow = useRef(0);

  const particles = useMemo<Particle[]>(() => {
    const random = seededRandom(kind === "hearts" ? 3 : 9);
    return Array.from({ length: settings.count }, (_, index) => {
      const angle = random() * Math.PI * 2;
      const spread = kind === "hearts" ? 0.35 : 2.2 + random() * 1.8;
      return {
        velocity: new THREE.Vector3(
          Math.cos(angle) * spread,
          kind === "hearts" ? 1 + random() * 0.5 : 4 + random() * 3,
          Math.sin(angle) * spread,
        ),
        spin: (random() - 0.5) * 14,
        delay: kind === "hearts" ? index * 0.12 : 0,
        color: settings.colors[index % settings.colors.length],
      };
    });
  }, [kind, settings]);

  useEffect(() => {
    if (trigger > 0) startedAt.current = clockNow.current;
  }, [trigger]);

  useFrame(({ clock }) => {
    clockNow.current = clock.elapsedTime;
    const running = startedAt.current >= 0;
    meshes.current.forEach((mesh, index) => {
      const particle = particles[index];
      const age = running ? clock.elapsedTime - startedAt.current - particle.delay : -1;
      if (age < 0 || age > settings.life) {
        mesh.visible = false;
        return;
      }
      const progress = age / settings.life;
      mesh.visible = true;
      mesh.position.set(
        particle.velocity.x * age,
        particle.velocity.y * age - 0.5 * settings.gravity * age * age,
        particle.velocity.z * age,
      );
      const pop = Math.min(1, age * 8);
      const fade = kind === "hearts" ? 1 - progress ** 3 : 1;
      mesh.scale.setScalar(settings.size * pop * fade);
      if (kind === "confetti") mesh.rotation.set(age * particle.spin, age * particle.spin * 0.7, 0);
      (mesh.material as THREE.MeshBasicMaterial).opacity = 1 - progress ** 2;
    });
    if (running && clock.elapsedTime - startedAt.current > settings.life + 1) startedAt.current = -1;
  });

  return (
    <group position={position} rotation={kind === "hearts" ? [0, FACE_CAMERA, 0] : undefined}>
      {particles.map((particle, index) => (
        <mesh
          key={index}
          ref={(mesh) => {
            if (mesh) meshes.current[index] = mesh;
          }}
          geometry={kind === "hearts" ? getHeartGeometry() : confettiGeometry}
          visible={false}
        >
          <meshBasicMaterial color={particle.color} transparent side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
