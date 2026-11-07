"use client";

import { Html } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { type ReactNode, useEffect, useState } from "react";
import { useTown } from "../town-context";

export type SpotMarker = "new" | "visited" | "none";

interface SpotProps {
  /** The spot to walk to when this is clicked. */
  id: string;
  position: [number, number, number];
  rotationY?: number;
  /** Height of the speech bubble above the model's origin. */
  bubbleHeight: number;
  title: string;
  line: string;
  /** Shown under the line when you're standing at it, on devices with a keyboard. */
  keyHint?: string;
  /** Shown instead of `keyHint` on touch screens. */
  touchHint?: string;
  nearby: boolean;
  /** A panel is open: no bubbles. */
  quiet: boolean;
  marker: SpotMarker;
  children?: ReactNode;
}

function Marker({ marker }: { marker: SpotMarker }) {
  if (marker === "none") return null;
  if (marker === "visited") {
    return <span aria-hidden className="block size-3 rotate-45 rounded-[3px] border-2 border-white bg-emerald-500 shadow-md" />;
  }
  return (
    <span aria-hidden className="block animate-bounce">
      <span className="block size-3.5 rotate-45 rounded-[3px] border-2 border-white bg-amber-400 shadow-md" />
    </span>
  );
}

/** Wraps a model you can walk up to: click to go there, a bubble when you're close. */
export function Spot({
  id,
  position,
  rotationY = 0,
  bubbleHeight,
  title,
  line,
  keyHint,
  touchHint,
  nearby,
  quiet,
  marker,
  children,
}: SpotProps) {
  const town = useTown();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = "pointer";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  function handlePointerDown(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    town.walkToSpot(id);
  }

  function handlePointerOver(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    setHovered(true);
  }

  const showBubble = !quiet && (nearby || hovered);

  return (
    <group position={position}>
      <group
        rotation={[0, rotationY, 0]}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={() => setHovered(false)}
      >
        {children}
      </group>
      <Html position={[0, bubbleHeight, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
        {showBubble ? (
          <div className="relative w-max max-w-[250px] -translate-y-1/2 rounded-2xl bg-[#fffdf8] px-3.5 py-2.5 text-left shadow-[0_8px_24px_rgba(30,25,15,0.18)] ring-1 ring-black/5">
            <p className="text-[13px] font-semibold leading-tight text-neutral-900">{title}</p>
            <p className="mt-0.5 text-xs leading-snug text-neutral-600">{line}</p>
            {nearby && (keyHint || touchHint) && (
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wide text-amber-700">
                {touchHint && <span className="sm:hidden">{touchHint}</span>}
                {keyHint && <span className="max-sm:hidden">{keyHint}</span>}
              </p>
            )}
            <span aria-hidden className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 bg-[#fffdf8]" />
          </div>
        ) : (
          <Marker marker={marker} />
        )}
      </Html>
    </group>
  );
}
