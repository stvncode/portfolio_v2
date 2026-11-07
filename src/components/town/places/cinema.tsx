"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { findTownPlace } from "@/data/town";
import { glow, PALETTE } from "../kit/materials";
import { Block, Box } from "../kit/shapes";
import { Sign } from "../kit/sign";
import { useTown } from "../town-context";

const SCREEN_WIDTH = 8;
const SCREEN_HEIGHT = 4.5;
const SCREEN_BOTTOM = 1.5;
const FILM_SECONDS = 6;
const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 576;
const FILMS = findTownPlace("cinema")?.list?.items ?? [];
const POSTER_COLORS = [
  ["#1e3a5f", "#f2c94c"],
  ["#5a3d2b", "#f4d6a0"],
  ["#2b1b3d", "#e85d4f"],
  ["#23402f", "#d9e8c4"],
  ["#3b2a1a", "#f29b38"],
  ["#2f4858", "#f6ae2d"],
];

function drawScreen(context: CanvasRenderingContext2D, title: string, subtitle: string, colors: string[]) {
  const gradient = context.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, "#0d0d10");
  context.fillStyle = gradient;
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.fillStyle = colors[1];
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "600 34px ui-monospace, Menlo, monospace";
  context.fillText(subtitle.toUpperCase(), CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.3);
  context.fillStyle = "#ffffff";
  let size = 96;
  context.font = `700 ${size}px Georgia, serif`;
  while (context.measureText(title).width > CANVAS_WIDTH * 0.86 && size > 40) {
    size -= 4;
    context.font = `700 ${size}px Georgia, serif`;
  }
  context.fillText(title, CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.55);
}

function Screen() {
  const town = useTown();
  const [film, setFilm] = useState(0);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const { canvas, texture } = useMemo(() => {
    const element = document.createElement("canvas");
    element.width = CANVAS_WIDTH;
    element.height = CANVAS_HEIGHT;
    const canvasTexture = new THREE.CanvasTexture(element);
    canvasTexture.colorSpace = THREE.SRGBColorSpace;
    return { canvas: element, texture: canvasTexture };
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  useEffect(() => {
    if (!town.showtime) return;
    const timer = window.setInterval(() => setFilm((index) => (index + 1) % FILMS.length), FILM_SECONDS * 1000);
    return () => window.clearInterval(timer);
  }, [town.showtime]);

  useEffect(() => {
    const context = canvas.getContext("2d");
    if (!context) return;
    if (town.showtime) {
      drawScreen(context, FILMS[film] ?? "", `Tonight · ${film + 1} of ${FILMS.length}`, POSTER_COLORS[film % POSTER_COLORS.length]);
    } else {
      drawScreen(context, "Cinéma en plein air", "Visit every place to start the show", ["#2a3140", "#f2c94c"]);
    }
    texture.needsUpdate = true;
  }, [canvas, texture, film, town.showtime]);

  useFrame(() => {
    if (!material.current) return;
    material.current.emissiveIntensity = town.showtime ? 0.35 + town.nightLevel.current * 0.75 : 0.15;
  });

  return (
    <mesh position={[0, SCREEN_BOTTOM + SCREEN_HEIGHT / 2, 0.08]}>
      <planeGeometry args={[SCREEN_WIDTH, SCREEN_HEIGHT]} />
      <meshStandardMaterial ref={material} map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0.15} />
    </mesh>
  );
}

const STRIPES: Record<string, string> = { blue: "#3f73a3", red: "#c8463c", yellow: "#e0b13f" };

function Deckchair({ x, z, stripe }: { x: number; z: number; stripe: string }) {
  return (
    <group position={[x, 0, z]} rotation={[0, Math.PI, 0]}>
      {[-0.32, 0.32].map((side) => (
        <Box key={side} position={[side, 0.45, 0]} rotation={[0.6, 0, 0]} size={[0.06, 1.1, 0.06]} color={PALETTE.wood} />
      ))}
      <Box position={[0, 0.48, 0.02]} rotation={[0.6, 0, 0]} size={[0.6, 1, 0.03]} color={STRIPES[stripe]} />
      <Box position={[0, 0.5, 0.03]} rotation={[0.6, 0, 0]} size={[0.2, 1, 0.035]} color={PALETTE.white} />
      <Box position={[0, 0.3, -0.35]} rotation={[-0.5, 0, 0]} size={[0.66, 0.06, 0.7]} color={PALETTE.wood} />
    </group>
  );
}

const STRING_POLES: [number, number][] = [
  [-5, 2],
  [5, 2],
  [5, 8],
  [-5, 8],
];
const BULBS_PER_SPAN = 7;
const POLE_HEIGHT = 3.2;
const SAG = 0.6;

function StringLights() {
  const bulbs = useMemo(() => {
    const points: [number, number, number][] = [];
    STRING_POLES.forEach(([x1, z1], index) => {
      const [x2, z2] = STRING_POLES[(index + 1) % STRING_POLES.length];
      for (let step = 1; step < BULBS_PER_SPAN; step += 1) {
        const t = step / BULBS_PER_SPAN;
        const y = POLE_HEIGHT - Math.sin(Math.PI * t) * SAG;
        points.push([x1 + (x2 - x1) * t, y, z1 + (z2 - z1) * t]);
      }
    });
    return points;
  }, []);

  return (
    <group>
      {STRING_POLES.map(([x, z]) => (
        <Block key={`${x}${z}`} position={[x, 0, z]} size={[0.12, POLE_HEIGHT + 0.1, 0.12]} color={PALETTE.woodDark} />
      ))}
      {bulbs.map((position) => (
        <mesh key={position.join(":")} position={position} material={glow.bulb}>
          <sphereGeometry args={[0.09, 8, 6]} />
        </mesh>
      ))}
    </group>
  );
}

function ProjectorBeam() {
  const town = useTown();
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const { position, quaternion, length } = useMemo(() => {
    const from = new THREE.Vector3(0, 1.35, 9);
    const to = new THREE.Vector3(0, SCREEN_BOTTOM + SCREEN_HEIGHT / 2, 0.1);
    const direction = new THREE.Vector3().subVectors(from, to);
    const beamLength = direction.length();
    const rotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    return { position: new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5), quaternion: rotation, length: beamLength };
  }, []);

  useFrame(() => {
    if (material.current) material.current.opacity = town.showtime ? town.nightLevel.current * 0.12 : 0;
  });

  return (
    <mesh position={position} quaternion={quaternion}>
      <coneGeometry args={[SCREEN_HEIGHT * 0.55, length, 4, 1, true]} />
      <meshBasicMaterial ref={material} color="#fff4d6" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
    </mesh>
  );
}

/** An open-air cinema in a field. The screen faces +z. */
export function OpenAirCinema() {
  return (
    <group>
      {[-1, 1].map((side) => (
        <Block key={side} position={[side * (SCREEN_WIDTH / 2 + 0.2), 0, 0]} size={[0.3, SCREEN_BOTTOM + SCREEN_HEIGHT + 0.3, 0.3]} color={PALETTE.ink} />
      ))}
      <Box position={[0, SCREEN_BOTTOM + SCREEN_HEIGHT / 2, 0]} size={[SCREEN_WIDTH + 0.3, SCREEN_HEIGHT + 0.3, 0.12]} color={PALETTE.ink} />
      <Screen />
      {[-2.7, -0.9, 0.9, 2.7].map((x, index) =>
        [3.4, 5.4].map((z, row) => (
          <Deckchair key={`${x}${z}`} x={x} z={z} stripe={["blue", "red", "yellow"][(index + row) % 3]} />
        )),
      )}
      <group position={[0, 0, 9]}>
        <Block size={[0.8, 0.9, 0.6]} color={PALETTE.woodDark} />
        <Block position={[0, 0.9, 0]} size={[0.5, 0.35, 0.6]} color="#3a3d44" />
        <Box position={[0, 1.07, -0.34]} rotation={[Math.PI / 2, 0, 0]} size={[0.18, 0.1, 0.18]} material={glow.bulb} />
      </group>
      <ProjectorBeam />
      <StringLights />
      <Sign
        text="CINÉMA EN PLEIN AIR"
        position={[5.6, 1.2, 8.6]}
        rotation={[0, Math.PI / 4, 0]}
        width={2.6}
        background="#2a3140"
        color="#f2c94c"
        font="800 60px ui-sans-serif, system-ui, sans-serif"
      />
      <Block position={[5.6, 0, 8.55]} size={[0.1, 0.9, 0.1]} color={PALETTE.woodDark} />
    </group>
  );
}
