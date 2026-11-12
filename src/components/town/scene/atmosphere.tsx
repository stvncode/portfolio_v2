"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { seededRandom } from "@/lib/town/scatter";
import { DYNAMIC } from "../kit/batched";
import { getGlowTexture } from "../kit/light-pool";
import { useTown } from "../town-context";

const CLOUDS = 6;
const CLOUD_SPAN = 150;
const CLOUD_SPEED = 1.3;
const CLOUD_SHADE = 0.11;

/** Soft cloud shadows drifting over the fields, so the light never sits still. */
function CloudShadows() {
  const town = useTown();
  const group = useRef<THREE.Group>(null);
  const clouds = useMemo(() => {
    const random = seededRandom(88);
    return Array.from({ length: CLOUDS }, () => ({
      start: random() * CLOUD_SPAN,
      z: -45 + random() * 95,
      size: 9 + random() * 8,
      stretch: 1.3 + random() * 0.8,
      speed: CLOUD_SPEED * (0.8 + random() * 0.5),
    }));
  }, []);
  const shared = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: getGlowTexture(),
        color: "#0c1f14",
        transparent: true,
        opacity: CLOUD_SHADE,
        depthWrite: false,
      }),
    [],
  );

  useFrame(({ clock }) => {
    const day = 1 - town.nightLevel.current;
    shared.opacity = CLOUD_SHADE * day;
    if (!group.current) return;
    group.current.visible = day > 0.05;
    group.current.children.forEach((cloud, index) => {
      const data = clouds[index];
      const x = ((data.start + clock.elapsedTime * data.speed) % CLOUD_SPAN) - CLOUD_SPAN / 2;
      cloud.position.set(x, 0.065, data.z + x * 0.2);
    });
  });

  return (
    <group ref={group} userData={DYNAMIC}>
      {clouds.map((cloud, index) => (
        <mesh key={index} rotation={[-Math.PI / 2, 0, 0.3]} scale={[cloud.size * cloud.stretch, cloud.size, 1]} material={shared} renderOrder={1}>
          <planeGeometry args={[2, 2]} />
        </mesh>
      ))}
    </group>
  );
}

const FLOCK = [
  [0, 0],
  [-1.1, 0.9],
  [-1.2, -0.9],
  [-2.3, 1.8],
  [-2.4, -1.7],
];
const FLIGHT_SPAN = 120;
const FLIGHT_SPEED = 5.5;
const FLIGHT_HEADING = -0.42;
const WING = new THREE.PlaneGeometry(0.55, 0.22).translate(0.275, 0, 0);

/** A small flock crossing the sky every so often. Their shadows cross the village too. */
function Birds() {
  const town = useTown();
  const flock = useRef<THREE.Group>(null);
  const wings = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    if (!flock.current) return;
    flock.current.visible = town.nightLevel.current < 0.5;
    const travelled = clock.elapsedTime * FLIGHT_SPEED;
    const pass = Math.floor(travelled / FLIGHT_SPAN);
    const along = (travelled % FLIGHT_SPAN) - FLIGHT_SPAN / 2;
    // Each pass takes a different line across the village.
    const offset = ((pass * 37) % 40) - 20;
    flock.current.position.set(
      Math.cos(FLIGHT_HEADING) * along,
      11 + Math.sin(clock.elapsedTime * 0.7) * 0.6,
      offset - Math.sin(FLIGHT_HEADING) * along,
    );
    wings.current.forEach((wing, index) => {
      const flap = Math.sin(clock.elapsedTime * 9 + Math.floor(index / 2)) * 0.7;
      wing.rotation.z = index % 2 ? Math.PI - flap : flap;
    });
  });

  return (
    <group ref={flock} rotation={[0, FLIGHT_HEADING, 0]} userData={DYNAMIC}>
      {FLOCK.map(([x, z], bird) => (
        <group key={bird} position={[x, 0, z]} rotation={[0, Math.PI / 2, 0]}>
          {[0, 1].map((side) => (
            <mesh
              key={side}
              ref={(mesh) => {
                if (mesh) wings.current[bird * 2 + side] = mesh;
              }}
              geometry={WING}
              rotation={[-Math.PI / 2, 0, side ? Math.PI : 0]}
              castShadow
            >
              <meshBasicMaterial color="#2b2f36" side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/** Weather and wildlife overhead. */
export function Atmosphere() {
  return (
    <>
      <CloudShadows />
      <Birds />
    </>
  );
}
