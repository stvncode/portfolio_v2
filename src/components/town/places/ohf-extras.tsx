"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import { DYNAMIC } from "../kit/batched";
import { Block, Box, Cylinder, type Vec3 } from "../kit/shapes";

/** The patch of lawn the robot keeps tidy: min and max x, then min and max z. */
const LAWN = { minX: -6, maxX: 3, minZ: -11.8, maxZ: -9.4 };
const MOWER_SPEED = 0.9;

/** A robot mower pottering about the lawn, as any smart home worth the name would have. */
export function RobotMower() {
  const mower = useRef<THREE.Group>(null);
  const led = useRef<THREE.MeshStandardMaterial>(null);
  const state = useRef({ x: -2, z: -10.5, vx: MOWER_SPEED * 0.8, vz: MOWER_SPEED * 0.6 });

  useFrame(({ clock }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const robot = state.current;
    robot.x += robot.vx * delta;
    robot.z += robot.vz * delta;
    // Bounce off the edge of its patch, the way these things do.
    if (robot.x < LAWN.minX || robot.x > LAWN.maxX) robot.vx *= -1;
    if (robot.z < LAWN.minZ || robot.z > LAWN.maxZ) robot.vz *= -1;
    if (mower.current) {
      mower.current.position.set(robot.x, 0, robot.z);
      const heading = Math.atan2(robot.vx, robot.vz);
      mower.current.rotation.y += (heading - mower.current.rotation.y) * Math.min(1, delta * 6);
    }
    if (led.current) led.current.emissiveIntensity = Math.sin(clock.elapsedTime * 4) > 0 ? 2 : 0.2;
  });

  return (
    <group ref={mower} userData={DYNAMIC}>
      <Block position={[0, 0.08, 0]} size={[0.6, 0.2, 0.8]} color="#3a3d44" />
      <Block position={[0, 0.26, -0.05]} size={[0.5, 0.1, 0.55]} color="#18bcf2" />
      {[-0.32, 0.32].map((x) => (
        <Cylinder key={x} position={[x, 0.12, -0.25]} rotation={[0, 0, Math.PI / 2]} radius={0.12} height={0.08} color="#1c1d21" segments={8} />
      ))}
      <mesh position={[0, 0.38, 0.1]}>
        <sphereGeometry args={[0.04, 6, 5]} />
        <meshStandardMaterial ref={led} color="#7dff9a" emissive="#3dff6a" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

/** Solar panels on a roof slope facing +z. `angle` is the slope of the roof. */
export function SolarPanels({ position, angle, count }: { position: Vec3; angle: number; count: number }) {
  return (
    <group position={position} rotation={[angle, 0, 0]}>
      {Array.from({ length: count }, (_, index) => (
        <group key={index} position={[index * 1.75, 0, 0]}>
          <Box size={[1.6, 0.06, 2.3]} color="#1d3557" />
          <Box position={[0, 0.035, 0]} size={[1.5, 0.01, 0.03]} color="#5f7ea8" shadow={false} />
          {[-0.4, 0.4].map((x) => (
            <Box key={x} position={[x, 0.035, 0]} size={[0.03, 0.01, 2.2]} color="#5f7ea8" shadow={false} />
          ))}
        </group>
      ))}
    </group>
  );
}

const CUP_ARMS = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];

/** A little weather station: a mast with spinning cups, feeding somebody's dashboard. */
export function WeatherStation({ position }: { position: Vec3 }) {
  const cups = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (cups.current) cups.current.rotation.y += delta * 3.2;
  });
  return (
    <group position={position}>
      <Cylinder position={[0, 0.8, 0]} radius={0.04} height={1.6} color="#5d636b" segments={5} />
      <Box position={[0, 1.1, 0.12]} size={[0.22, 0.28, 0.14]} color="#f3f5f6" />
      <group ref={cups} position={[0, 1.65, 0]} userData={DYNAMIC}>
        {CUP_ARMS.map((angle) => (
          <group key={angle} rotation={[0, angle, 0]}>
            <Box position={[0.2, 0, 0]} size={[0.4, 0.03, 0.03]} color="#5d636b" />
            <mesh position={[0.42, 0, 0]}>
              <sphereGeometry args={[0.08, 8, 6]} />
              <meshStandardMaterial color="#f3f5f6" flatShading />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
