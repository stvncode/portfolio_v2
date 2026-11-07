"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import { glow, PALETTE } from "../kit/materials";
import { Block, Box, Cylinder, Door, PitchedRoof } from "../kit/shapes";
import { Sign } from "../kit/sign";

const MA_BLUE = "#03a9f4";
const SHOP_BLACK = "#1f2126";

/** The Home Assistant hall: a white house with a blue roof. Front faces +z. */
export function HomeAssistantHall() {
  return (
    <group>
      <Block size={[9, 4.2, 7]} color="#f3f5f6" />
      <PitchedRoof
        position={[0, 4.2, 0]}
        length={9}
        span={7}
        height={2.8}
        wallColor="#f3f5f6"
        roofColor={PALETTE.haBlue}
        overhang={0.35}
        thickness={0.22}
      />
      <group position={[0, 0, 3.5]}>
        <Box position={[0, 1.6, 0.04]} size={[7.2, 2.7, 0.06]} color="#d6dde2" shadow={false} />
        <Box position={[0, 1.6, 0.08]} size={[7, 2.5, 0.05]} material={glow.window} shadow={false} />
        {[-2.4, -1.2, 1.2, 2.4].map((x) => (
          <Box key={x} position={[x, 1.6, 0.12]} size={[0.08, 2.5, 0.04]} color="#d6dde2" shadow={false} />
        ))}
        <Door position={[0, 0, 0.1]} width={1.6} height={2.2} color="#bcd7e6" frame="#d6dde2" />
        <Sign
          text="Home Assistant"
          position={[0, 3.55, 0.06]}
          width={4.6}
          background="#f3f5f6"
          color={PALETTE.haBlue}
          font="700 72px ui-sans-serif, system-ui, sans-serif"
        />
        <Sign
          text="OPEN HOME FOUNDATION"
          position={[0, 3.05, 0.06]}
          width={2.8}
          background="#f3f5f6"
          color="#5b6770"
          font="600 56px ui-monospace, Menlo, monospace"
        />
      </group>
      {[-3.8, 3.8].map((x) => (
        <group key={x} position={[x, 0, 4.2]}>
          <Block size={[1, 0.55, 1]} color="#c9d0d5" />
          <mesh position={[0, 0.95, 0]} castShadow>
            <icosahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial color={PALETTE.leaf} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function SpinningRecord() {
  const record = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (record.current) record.current.rotation.y += delta * 0.8;
  });
  return (
    <group position={[0, 3.65, 0.4]}>
      <Block size={[0.3, 0.5, 0.3]} color="#2c2f36" />
      {/* Stood on its edge and turned towards the camera, spinning on its own axis. */}
      <group position={[0, 1.65, 0]} rotation={[0, Math.PI / 4, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group ref={record}>
            <Cylinder radius={1.25} height={0.08} color="#141417" segments={28} />
            <Cylinder position={[0, 0.05, 0]} radius={0.95} height={0.02} color="#26262b" segments={28} />
            <Cylinder position={[0, 0.07, 0]} radius={0.42} height={0.02} color={MA_BLUE} segments={20} />
            <Box position={[0.2, 0.09, 0]} size={[0.16, 0.02, 0.08]} color={PALETTE.white} />
          </group>
        </group>
      </group>
    </group>
  );
}

const SLEEVES = ["#03a9f4", "#f2c94c", "#e85d4f", "#7d5ba6", "#3fae8a", "#f29b38"];

/** Music Assistant Records: a black shop front with a vinyl on the roof. Front faces +z. */
export function RecordShop() {
  return (
    <group>
      <Block size={[6, 3.4, 5]} color={SHOP_BLACK} />
      <Block position={[0, 3.4, 0]} size={[6.2, 0.25, 5.2]} color="#2c2f36" />
      <group position={[0, 0, 2.5]}>
        <Box position={[-1, 1.3, 0.04]} size={[3, 1.8, 0.06]} material={glow.window} shadow={false} />
        {SLEEVES.map((color, index) => (
          <Box
            key={color}
            position={[-2.1 + (index % 3) * 1.05, 0.85 + Math.floor(index / 3) * 0.85, 0.1]}
            rotation={[0, 0, (index % 2 ? 1 : -1) * 0.06]}
            size={[0.62, 0.62, 0.03]}
            color={color}
            shadow={false}
          />
        ))}
        <Door position={[1.9, 0, 0.06]} width={1} height={2.1} color={MA_BLUE} frame="#2c2f36" />
        <Sign
          text="MUSIC ASSISTANT RECORDS"
          position={[0, 2.75, 0.08]}
          width={5.2}
          background={SHOP_BLACK}
          color={MA_BLUE}
          font="800 64px ui-sans-serif, system-ui, sans-serif"
          glow
        />
      </group>
      <SpinningRecord />
    </group>
  );
}

const LED_COLORS = ["#ff4d4d", "#4dff88", "#4dc3ff"];

function BlinkingLeds() {
  const leds = useRef<THREE.Mesh[]>([]);
  useFrame(({ clock }) => {
    const beat = Math.floor(clock.elapsedTime * 2);
    leds.current.forEach((led, index) => {
      const material = led.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = (beat + index) % 3 === 0 ? 2.2 : 0.15;
    });
  });
  return (
    <>
      {LED_COLORS.map((color, index) => (
        <mesh
          key={color}
          ref={(mesh) => {
            if (mesh) leds.current[index] = mesh;
          }}
          position={[-0.5 + index * 0.5, 0, 0]}
        >
          <sphereGeometry args={[0.1, 8, 6]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.15} />
        </mesh>
      ))}
    </>
  );
}

/** ESPHome Workshop: a tinkerer's garage, door half up. Front faces +z. */
export function EsphomeWorkshop() {
  return (
    <group>
      <Block size={[5.5, 3.2, 5]} color="#8e959d" />
      {/* Corrugated side wall. */}
      {[-2, -1, 0, 1, 2].map((z) => (
        <Box key={z} position={[2.76, 1.6, z]} size={[0.04, 3.2, 0.06]} color="#7d848c" shadow={false} />
      ))}
      <Block position={[0, 3.2, 0]} size={[5.8, 0.25, 5.3]} color="#5d636b" />
      {/* Garage door rolled half up, workbench pulled out front. */}
      <group position={[-0.5, 0, 2.5]}>
        <Box position={[0, 1.1, 0.02]} size={[3, 2.2, 0.04]} color="#2a2d33" shadow={false} />
        <Box position={[0, 1.55, 0.06]} size={[2.2, 0.7, 0.04]} color="#b98b5a" shadow={false} />
        {[-0.7, -0.2, 0.3, 0.8].map((x) => (
          <Box key={x} position={[x, 1.6, 0.1]} size={[0.05, 0.35, 0.05]} color="#5d636b" shadow={false} />
        ))}
        <Box position={[0, 2.1, 0.08]} size={[3.1, 0.45, 0.14]} color="#c9ced3" />
        <Block position={[0, 0, 0.55]} size={[2.4, 0.85, 0.7]} color={PALETTE.wood} />
        {[-0.8, -0.2, 0.4].map((x) => (
          <Box key={x} position={[x, 0.88, 0.55]} size={[0.42, 0.04, 0.3]} color="#2f7d4a" />
        ))}
        <Box position={[0.95, 0.98, 0.5]} size={[0.24, 0.22, 0.24]} color="#d24a3a" />
        <Box position={[0.95, 1.12, 0.6]} rotation={[0.6, 0, 0]} size={[0.03, 0.3, 0.03]} color="#c9ced3" />
      </group>
      <Door position={[1.9, 0, 2.52]} width={0.9} color="#2a2d33" frame="#5d636b" />
      <group position={[0, 2.75, 2.56]}>
        <Sign
          text="ESPHome"
          position={[-1.2, 0, 0]}
          width={2.2}
          background="#15171b"
          color={PALETTE.white}
          font="800 72px ui-sans-serif, system-ui, sans-serif"
        />
        <group position={[1.3, 0, 0.05]}>
          <BlinkingLeds />
        </group>
      </group>
      <Cylinder position={[2, 4.2, -1.5]} radius={0.04} height={1.8} color="#5d636b" segments={5} />
    </group>
  );
}

const DEVICE_COLORS = ["#f2c94c", "#ffffff", "#4f8fe8", "#3fae8a", "#e85d4f", "#c7ccd1", "#7d5ba6"];

/** Device Database: a small library where the shelves hold smart-home devices. Front faces +z. */
export function DeviceLibrary() {
  return (
    <group>
      <Block size={[6, 3.6, 5]} color="#e9e1d1" />
      <PitchedRoof
        position={[0, 3.6, 0]}
        length={6}
        span={5}
        height={1.6}
        wallColor="#e9e1d1"
        roofColor={PALETTE.slate}
        overhang={0.3}
      />
      <group position={[0, 0, 2.5]}>
        <Box position={[0, 1.55, 0.02]} size={[4.6, 2.5, 0.04]} color="#5a4636" shadow={false} />
        {[0.65, 1.35, 2.05, 2.7].map((y, row) =>
          Array.from({ length: 9 }, (_, column) => (
            <Box
              key={`${row}:${column}`}
              position={[-2 + column * 0.5, y + 0.15, 0.12]}
              size={[0.32, 0.3 - (column % 3) * 0.05, 0.12]}
              color={DEVICE_COLORS[(row * 3 + column) % DEVICE_COLORS.length]}
              shadow={false}
            />
          )),
        )}
        {[0.65, 1.35, 2.05, 2.7].map((y) => (
          <Box key={y} position={[0, y, 0.12]} size={[4.6, 0.06, 0.22]} color="#8a6b4f" shadow={false} />
        ))}
        {[-2.6, 2.6].map((x) => (
          <Block key={x} position={[x, 0, 0.2]} size={[0.5, 3.4, 0.4]} color="#f6f1e6" />
        ))}
        <Sign
          text="DEVICE DATABASE"
          position={[0, 3.25, 0.03]}
          width={3.4}
          background="#e9e1d1"
          color="#4b5564"
          font="700 64px Georgia, serif"
        />
      </group>
    </group>
  );
}
