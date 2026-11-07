"use client";

import { Html } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { type ReactNode, useState } from "react";
import { findTownPlace } from "@/data/town";
import { useTown } from "../town-context";

interface ClickablePlaceProps {
  id: string;
  position: [number, number, number];
  rotationY?: number;
  /** Height of the speech bubble above the model's origin. */
  bubbleHeight: number;
  nearby: boolean;
  /** A panel is open: no bubbles. */
  quiet: boolean;
  visited: boolean;
  children: ReactNode;
}

/** Wraps a place's model: click to walk there, bubble when you're close. */
export function ClickablePlace({
  id,
  position,
  rotationY = 0,
  bubbleHeight,
  nearby,
  quiet,
  visited,
  children,
}: ClickablePlaceProps) {
  const town = useTown();
  const [hovered, setHovered] = useState(false);
  const place = findTownPlace(id);

  function handlePointerDown(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    town.walkToPlace(id);
  }

  function handlePointerOver(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  }

  function handlePointerOut() {
    setHovered(false);
    document.body.style.cursor = "";
  }

  if (!place) return null;
  const showBubble = !quiet && (nearby || hovered);

  return (
    <group position={position}>
      <group
        rotation={[0, rotationY, 0]}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {children}
      </group>
      <Html position={[0, bubbleHeight, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
        {showBubble ? (
          <div className="w-max max-w-[240px] -translate-y-1/2 rounded-xl border border-black/10 bg-white/95 px-3 py-2 text-left shadow-lg">
            <p className="text-sm font-semibold text-neutral-900">{place.name}</p>
            <p className="text-xs leading-snug text-neutral-600">{place.bubble}</p>
            {nearby && (
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-neutral-500">
                <span className="sm:hidden">Tap to visit</span>
                <span className="max-sm:hidden">
                  Press <kbd className="rounded border border-neutral-300 px-1">Enter</kbd> or click to visit
                </span>
              </p>
            )}
          </div>
        ) : (
          <span aria-hidden className={visited ? "block" : "block animate-bounce"}>
            <span
              className={
                visited
                  ? "block size-3 rotate-45 rounded-[2px] border-2 border-white bg-emerald-500 shadow"
                  : "block size-3.5 rotate-45 rounded-[2px] border-2 border-white bg-amber-400 shadow"
              }
            />
          </span>
        )}
      </Html>
    </group>
  );
}
