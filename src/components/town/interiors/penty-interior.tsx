"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { PALETTE } from "../kit/materials";
import { Block, Box, Cylinder } from "../kit/shapes";
import { Frame, Plant, Rug } from "./furniture";
import { InteriorSpot } from "./interior-spot";
import { PENTY_LAYOUT as LAYOUT } from "./layouts";
import { Doorway, Room } from "./room";

const PLACE = "penty";
const RGB_SPEED = 0.15;

function Screen({ size, color, intensity = 0.9 }: { size: [number, number]; color: string; intensity?: number }) {
  return (
    <mesh>
      <boxGeometry args={[size[0], size[1], 0.03]} />
      <meshStandardMaterial color="#0b0d18" emissive={color} emissiveIntensity={intensity} />
    </mesh>
  );
}

/** A PC tower whose light strip slowly cycles through colours. */
function PcTower() {
  const strip = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (!strip.current) return;
    strip.current.emissive.setHSL((clock.elapsedTime * RGB_SPEED) % 1, 0.9, 0.55);
  });
  return (
    <group>
      <Block size={[0.5, 1, 0.24]} color="#1c1d22" />
      <mesh position={[0, 0.5, 0.125]}>
        <boxGeometry args={[0.04, 0.85, 0.01]} />
        <meshStandardMaterial ref={strip} color="#111111" emissive="#7a5cff" emissiveIntensity={1.4} />
      </mesh>
    </group>
  );
}

/** Desk on the left wall: two screens, keyboard, headset. Faces +x. */
function Desk() {
  return (
    <group>
      <Block position={[0, 0.74, 0]} size={[0.9, 0.06, 2.4]} color="#2c2f36" />
      {[-1.1, 1.1].map((z) => (
        <Block key={z} position={[0, 0, z]} size={[0.8, 0.74, 0.06]} color="#2c2f36" />
      ))}
      <group position={[-0.2, 0.8, 0]} rotation={[0, Math.PI / 2, 0]}>
        {[-0.5, 0.5].map((x) => (
          <group key={x} position={[x, 0.45, 0]} rotation={[0, -x * 0.4, 0]}>
            <Box size={[0.95, 0.58, 0.04]} color="#15161a" />
            <group position={[0, 0, 0.025]}>
              <Screen size={[0.88, 0.5]} color={x < 0 ? "#3fd0ff" : "#8f6bff"} />
            </group>
          </group>
        ))}
        <Box position={[0, 0.12, 0]} size={[0.1, 0.24, 0.1]} color="#15161a" />
      </group>
      <Box position={[0.15, 0.79, 0]} size={[0.22, 0.03, 0.7]} color="#1c1d22" />
      <Box position={[0.18, 0.8, 0.5]} size={[0.14, 0.03, 0.09]} color="#1c1d22" />
      <group position={[-0.25, 0, -0.85]}>
        <PcTower />
      </group>
      <group position={[0.1, 0.77, -0.9]}>
        <Cylinder position={[0, 0.15, 0]} radius={0.02} height={0.3} color="#3a3d44" segments={6} />
        <mesh position={[0, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.1, 0.025, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#e85d4f" flatShading />
        </mesh>
      </group>
    </group>
  );
}

/** A high-backed gaming chair facing -x. */
function GamingChair() {
  return (
    <group rotation={[0, -Math.PI / 2, 0]}>
      <Cylinder position={[0, 0.06, 0]} radius={0.3} height={0.06} color="#26272b" segments={5} />
      <Cylinder position={[0, 0.25, 0]} radius={0.04} height={0.35} color="#26272b" segments={6} />
      <Block position={[0, 0.42, 0]} size={[0.56, 0.12, 0.52]} color="#1c1d22" />
      <Block position={[0, 0.5, -0.24]} size={[0.56, 0.95, 0.12]} color="#1c1d22" />
      <Box position={[0, 0.95, -0.17]} size={[0.3, 0.6, 0.02]} color="#e85d4f" />
    </group>
  );
}

const GAME_BOXES = ["#e85d4f", "#3fae8a", "#f2c94c", "#4f8fe8", "#7d5ba6", "#f29b38", "#efe6d4"];

function GameShelf() {
  return (
    <group>
      <Block size={[2, 1.8, 0.4]} color={PALETTE.woodDark} />
      {[0.15, 0.75, 1.35].map((y, shelf) => (
        <group key={y}>
          <Box position={[0, y, 0.12]} size={[1.9, 0.04, 0.3]} color={PALETTE.wood} shadow={false} />
          {Array.from({ length: 9 - shelf * 2 }, (_, index) => (
            <Box
              key={index}
              position={[-0.8 + index * 0.18, y + 0.2, 0.12]}
              size={[0.06, 0.36, 0.26]}
              color={GAME_BOXES[(index + shelf * 3) % GAME_BOXES.length]}
              shadow={false}
            />
          ))}
        </group>
      ))}
    </group>
  );
}

/** TV on a low stand with a console, against the back wall. */
function TvCorner() {
  return (
    <group>
      <Block size={[2.1, 0.5, 0.55]} color="#3a3d44" />
      <Block position={[-0.55, 0.5, 0.05]} size={[0.32, 0.06, 0.24]} color="#efefef" />
      <Box position={[-0.4, 0.51, 0.08]} size={[0.03, 0.05, 0.16]} color="#e85d4f" shadow={false} />
      <Box position={[-0.7, 0.51, 0.08]} size={[0.03, 0.05, 0.16]} color="#4f8fe8" shadow={false} />
      <group position={[0, 1.35, -0.1]}>
        <Box size={[1.9, 1.1, 0.06]} color="#111215" />
        <group position={[0, 0, 0.04]}>
          <Screen size={[1.8, 1]} color="#6fb7ff" intensity={0.7} />
        </group>
      </group>
    </group>
  );
}

function Couch() {
  return (
    <group rotation={[0, Math.PI, 0]}>
      <Block position={[0, 0.1, 0]} size={[2.3, 0.35, 0.95]} color="#6a5a9a" />
      <Block position={[0, 0.1, -0.38]} size={[2.3, 0.85, 0.22]} color="#6a5a9a" />
      {[-1.08, 1.08].map((x) => (
        <Block key={x} position={[x, 0.1, 0]} size={[0.2, 0.6, 0.95]} color="#6a5a9a" />
      ))}
      {[-0.5, 0.5].map((x) => (
        <Block key={x} position={[x, 0.45, 0.05]} size={[0.95, 0.12, 0.7]} color="#7d6db0" />
      ))}
      <Box position={[0.4, 0.6, 0.15]} rotation={[0, 0.4, 0]} size={[0.22, 0.05, 0.14]} color="#222327" />
    </group>
  );
}

/** Inside the penty: the gaming room. */
export function PentyInterior({ nearbyId }: { nearbyId: string | null }) {
  const spot = { placeId: PLACE, nearbyId };
  return (
    <group>
      <Room
        layout={LAYOUT}
        floor="#7a5d45"
        plank="#664c37"
        wall="#c7bfb1"
        trim="#4a3a2c"
        wallHeight={2.9}
        windows={[{ wall: "left", at: 2.3, width: 1, height: 1 }]}
      />
      {/* A soft purple light strip along the top of the walls. */}
      <mesh position={[0, 2.75, -LAYOUT.halfDepth + 0.04]}>
        <boxGeometry args={[LAYOUT.halfWidth * 2, 0.05, 0.03]} />
        <meshStandardMaterial color="#2a1f4a" emissive="#8f6bff" emissiveIntensity={1.4} />
      </mesh>
      <pointLight position={[0, 2.3, -1.5]} color="#9c7bff" intensity={3} distance={6} decay={1.8} />
      <pointLight position={[-2.5, 1.6, 0]} color="#7fd4ff" intensity={2} distance={4} decay={1.8} />

      <InteriorSpot {...spot} spotId="exit" position={[LAYOUT.doorX, 0, -LAYOUT.halfDepth + 0.02]} bubbleHeight={2.7}>
        <Doorway frame="#4a3a2c" />
      </InteriorSpot>
      <InteriorSpot {...spot} spotId="desk" position={[-LAYOUT.halfWidth + 0.5, 0, -0.4]} bubbleHeight={2.3}>
        <Desk />
      </InteriorSpot>
      <group position={[-2.8, 0, -0.4]}>
        <GamingChair />
      </group>
      <InteriorSpot {...spot} spotId="shelf" position={[-1.4, 0, -LAYOUT.halfDepth + 0.22]} bubbleHeight={2.4}>
        <GameShelf />
      </InteriorSpot>
      <Frame position={[-1.4, 2.25, -LAYOUT.halfDepth + 0.03]} width={1.2} height={0.5} colors={["#2a1f4a", "#8f6bff", "#3fd0ff"]} />
      <group position={[1.4, 0, -LAYOUT.halfDepth + 0.3]}>
        <TvCorner />
      </group>
      <group position={[1.4, 0, 0.1]}>
        <Rug size={[3, 2.2]} color="#3d3a5c" border="#5a5680" />
      </group>
      <InteriorSpot {...spot} spotId="couch" position={[1.4, 0, 0.6]} bubbleHeight={2}>
        <Couch />
      </InteriorSpot>
      <mesh position={[-1.6, 0.32, 2.4]} scale={[1, 0.6, 1]} castShadow>
        <sphereGeometry args={[0.55, 10, 8]} />
        <meshStandardMaterial color="#f29b38" flatShading />
      </mesh>
      <group position={[3.8, 0, 2.8]}>
        <Plant scale={0.9} />
      </group>
    </group>
  );
}
