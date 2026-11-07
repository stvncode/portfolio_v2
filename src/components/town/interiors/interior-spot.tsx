"use client";

import type { ReactNode } from "react";
import { EXIT_SPOT, findInteriorSpot } from "@/data/town-interiors";
import { Spot } from "../scene/spot";

interface InteriorSpotProps {
  placeId: string;
  spotId: string;
  nearbyId: string | null;
  position: [number, number, number];
  bubbleHeight: number;
  children?: ReactNode;
}

/** A hotspot inside a building, with its text from the interiors data. */
export function InteriorSpot({ placeId, spotId, nearbyId, position, bubbleHeight, children }: InteriorSpotProps) {
  const spot = findInteriorSpot(placeId, spotId);
  if (!spot) return <group position={position}>{children}</group>;
  const isExit = spot.id === EXIT_SPOT;
  return (
    <Spot
      id={spot.id}
      position={position}
      bubbleHeight={bubbleHeight}
      title={spot.name}
      line={spot.line}
      keyHint={isExit ? "Press Enter or click to go out" : undefined}
      touchHint={isExit ? "Tap to go out" : undefined}
      nearby={nearbyId === spot.id}
      quiet={false}
      marker="none"
    >
      {children}
    </Spot>
  );
}
