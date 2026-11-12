"use client";

import { createContext, type MutableRefObject, useContext, useEffect, useRef } from "react";
import type { Area } from "./areas";

export interface PlayerState {
  x: number;
  z: number;
  heading: number;
  /** Velocity in world units per second, for things you can bump into. */
  vx: number;
  vz: number;
}

export interface WalkTarget {
  /** Waypoints still to walk, the last one being the destination. */
  path: { x: number; z: number }[];
  /** Set when walking to a place: arriving opens it. */
  placeId: string | null;
}

export interface ClickMark {
  x: number;
  z: number;
  /** `performance.now()` when the click landed. */
  at: number;
}

export interface TownControls {
  player: MutableRefObject<PlayerState>;
  target: MutableRefObject<WalkTarget | null>;
  /** Keys held right now, as `KeyboardEvent.key` values lowercased. */
  keys: MutableRefObject<Set<string>>;
  /** 0 is day, 1 is night, eased over time. */
  nightLevel: MutableRefObject<number>;
  /** Where the last walk-here click landed, for the ripple on the ground. */
  clickMark: MutableRefObject<ClickMark | null>;
  /**
   * The area the player is walking in right now. It changes the instant you go
   * through a door, a frame or two before `area` (which drives what is drawn).
   */
  areaNow: MutableRefObject<Area>;
  /** What happens at spots that do something, keyed by spot id. */
  interactions: MutableRefObject<Map<string, () => void>>;
  night: boolean;
  showtime: boolean;
  /** The welcome card is up: the camera drifts high over the village. */
  intro: boolean;
  /** A place's panel covers part of the screen. */
  panelOpen: boolean;
  /** Where you are: the village, or inside a building. */
  area: Area;
  walkTo: (x: number, z: number) => void;
  /** Walk to a spot in the current area: a place outside, a hotspot inside. */
  walkToSpot: (id: string) => void;
  /** Called by the player when the closest spot changes. */
  setNearby: (id: string | null) => void;
  /** Called by the player on reaching the spot it was walking to. */
  arrive: (id: string) => void;
}

export const TownContext = createContext<TownControls | null>(null);

export function useTown(): TownControls {
  const controls = useContext(TownContext);
  if (!controls) throw new Error("useTown must be used inside the town");
  return controls;
}

/** Runs `handler` when the player reaches the spot `id`, or presses Enter next to it. */
export function useInteraction(id: string, handler: () => void) {
  const { interactions } = useTown();
  const latest = useRef(handler);
  latest.current = handler;

  useEffect(() => {
    const registry = interactions.current;
    const run = () => latest.current();
    registry.set(id, run);
    return () => {
      if (registry.get(id) === run) registry.delete(id);
    };
  }, [id, interactions]);
}
