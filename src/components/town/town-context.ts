"use client";

import { createContext, type MutableRefObject, useContext } from "react";

export interface PlayerState {
  x: number;
  z: number;
  heading: number;
}

export interface WalkTarget {
  /** Waypoints still to walk, the last one being the destination. */
  path: { x: number; z: number }[];
  /** Set when walking to a place: arriving opens it. */
  placeId: string | null;
}

export interface TownControls {
  player: MutableRefObject<PlayerState>;
  target: MutableRefObject<WalkTarget | null>;
  /** Keys held right now, as `KeyboardEvent.key` values lowercased. */
  keys: MutableRefObject<Set<string>>;
  /** 0 is day, 1 is night, eased over time. */
  nightLevel: MutableRefObject<number>;
  night: boolean;
  showtime: boolean;
  /** A place's panel covers part of the screen. */
  panelOpen: boolean;
  walkTo: (x: number, z: number) => void;
  walkToPlace: (id: string) => void;
  setNearby: (id: string | null) => void;
  arrive: (id: string) => void;
}

export const TownContext = createContext<TownControls | null>(null);

export function useTown(): TownControls {
  const controls = useContext(TownContext);
  if (!controls) throw new Error("useTown must be used inside the town");
  return controls;
}
