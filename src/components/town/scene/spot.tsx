"use client";

import { Html } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { Check, type LucideIcon } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
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
  /** Drawn in the marker that floats over a place. */
  icon?: LucideIcon;
  children?: ReactNode;
}

function Marker({ marker, icon: Icon }: { marker: SpotMarker; icon?: LucideIcon }) {
  if (marker === "none") return null;
  if (marker === "visited") {
    return (
      <span aria-hidden className="relative grid size-7 place-items-center rounded-full bg-[#fffdf8]/90 shadow-md ring-1 ring-black/10">
        {Icon && <Icon className="size-3.5 text-neutral-400" />}
        <span className="absolute -right-1 -top-1 grid size-3.5 place-items-center rounded-full bg-emerald-500 ring-2 ring-[#fffdf8]">
          <Check className="size-2.5 text-white" strokeWidth={4} />
        </span>
      </span>
    );
  }
  return (
    <span aria-hidden className="block animate-bounce">
      <span className="relative grid size-9 place-items-center rounded-full bg-[#fffdf8] shadow-[0_6px_16px_rgba(30,25,15,0.25)] ring-2 ring-amber-400">
        {Icon ? <Icon className="size-[18px] text-neutral-800" /> : <span className="size-2 rounded-full bg-amber-400" />}
        <span className="absolute -bottom-[7px] left-1/2 size-2.5 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-amber-400 bg-[#fffdf8]" />
      </span>
    </span>
  );
}

/** Space kept between a bubble and the edge of the screen, in pixels. */
const EDGE_MARGIN = 10;

interface BubbleProps {
  title: string;
  line: string;
  hint: ReactNode;
}

/** The speech bubble. It slides sideways to stay on screen, and its tail stays on the spot. */
function Bubble({ title, line, hint }: BubbleProps) {
  const bubble = useRef<HTMLDivElement>(null);
  const tail = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    let shift = 0;
    function keepInView() {
      const element = bubble.current;
      if (element) {
        const rect = element.getBoundingClientRect();
        const left = rect.left - shift;
        const overflowRight = left + rect.width - (window.innerWidth - EDGE_MARGIN);
        const wanted = left < EDGE_MARGIN ? EDGE_MARGIN - left : overflowRight > 0 ? -overflowRight : 0;
        if (Math.abs(wanted - shift) > 0.5) {
          shift = wanted;
          element.style.translate = `${shift}px -50%`;
          // Keep the tail pointing at the spot, but inside the bubble's rounded corners.
          const reach = rect.width / 2 - 22;
          if (tail.current) tail.current.style.translate = `${Math.max(-reach, Math.min(reach, -shift))}px 0`;
        }
      }
      frame = requestAnimationFrame(keepInView);
    }
    frame = requestAnimationFrame(keepInView);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      ref={bubble}
      style={{ translate: "0 -50%" }}
      className="relative w-max max-w-[250px] rounded-2xl bg-[#fffdf8] px-3.5 py-2.5 text-left shadow-[0_8px_24px_rgba(30,25,15,0.18)] ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150"
    >
      <p className="text-[13px] font-semibold leading-tight text-neutral-900">{title}</p>
      <p className="mt-0.5 text-xs leading-snug text-neutral-600">{line}</p>
      {hint}
      <span ref={tail} aria-hidden className="absolute -bottom-1.5 left-1/2 -ml-1.5 size-3 rotate-45 bg-[#fffdf8]" />
    </div>
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
  icon,
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
          <Bubble
            title={title}
            line={line}
            hint={
              nearby && (keyHint || touchHint) ? (
                <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wide text-amber-700">
                  {touchHint && <span className="sm:hidden">{touchHint}</span>}
                  {keyHint && <span className="max-sm:hidden">{keyHint}</span>}
                </p>
              ) : null
            }
          />
        ) : (
          <Marker marker={marker} icon={icon} />
        )}
      </Html>
    </group>
  );
}
