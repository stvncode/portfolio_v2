"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { Vec3 } from "./shapes";

interface SignProps {
  text: string;
  position: Vec3;
  rotation?: Vec3;
  /** World width of the sign; the height follows the text. */
  width: number;
  background: string;
  color: string;
  /** Canvas font, for example `700 64px Georgia, serif`. */
  font?: string;
  glow?: boolean;
}

const CANVAS_HEIGHT = 128;
const PADDING = 32;

/** Flat text drawn on a canvas, so signs need no font download. */
export function Sign({
  text,
  position,
  rotation,
  width,
  background,
  color,
  font = "700 72px ui-sans-serif, system-ui, sans-serif",
  glow = false,
}: SignProps) {
  const { texture, aspect } = useMemo(() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return { texture: null, aspect: 4 };
    context.font = font;
    const textWidth = Math.ceil(context.measureText(text).width);
    canvas.width = textWidth + PADDING * 2;
    canvas.height = CANVAS_HEIGHT;
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = font;
    context.fillStyle = color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, canvas.width / 2, CANVAS_HEIGHT / 2 + 4);
    const canvasTexture = new THREE.CanvasTexture(canvas);
    canvasTexture.colorSpace = THREE.SRGBColorSpace;
    canvasTexture.anisotropy = 4;
    return { texture: canvasTexture, aspect: canvas.width / canvas.height };
  }, [text, background, color, font]);

  useEffect(() => () => texture?.dispose(), [texture]);

  if (!texture) return null;
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, width / aspect]} />
      {glow ? (
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={0.25}
        />
      ) : (
        <meshStandardMaterial map={texture} roughness={0.8} />
      )}
    </mesh>
  );
}
