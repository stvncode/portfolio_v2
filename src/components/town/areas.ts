import { TOWN_PLACES } from "@/data/town";
import type { Bounds, Rect } from "@/lib/town/movement";
import { INTERIOR_LAYOUTS } from "./interiors/layouts";
import { OBSTACLES, SPAWN, WALK_BOUNDS } from "./world-layout";

/** Somewhere you can walk up to: a place's entrance outside, a hotspot inside. */
export interface Spot {
  id: string;
  x: number;
  z: number;
}

/** A walkable space: the village, or the inside of a building. */
export interface Area {
  id: string;
  bounds: Bounds;
  obstacles: Rect[];
  spots: Spot[];
  spawn: [number, number];
  /** World units visible from top to bottom at the default zoom. */
  visibleHeight: number;
  /** How close counts as standing at a spot. */
  nearDistance: number;
}

export const OUTSIDE_ID = "outside";

export const OUTSIDE: Area = {
  id: OUTSIDE_ID,
  bounds: WALK_BOUNDS,
  obstacles: OBSTACLES,
  spots: TOWN_PLACES.map((place) => ({ id: place.id, x: place.entrance[0], z: place.entrance[1] })),
  spawn: SPAWN,
  visibleHeight: 22,
  nearDistance: 2.6,
};

const INTERIOR_VISIBLE_HEIGHT = 12;
const INTERIOR_NEAR_DISTANCE = 1.5;

export function areaFor(inside: string | null): Area {
  const layout = inside ? INTERIOR_LAYOUTS[inside] : undefined;
  if (!inside || !layout) return OUTSIDE;
  return {
    id: inside,
    bounds: layout.bounds,
    obstacles: layout.obstacles,
    spots: Object.entries(layout.spots).map(([id, [x, z]]) => ({ id, x, z })),
    spawn: layout.spawn,
    visibleHeight: INTERIOR_VISIBLE_HEIGHT,
    nearDistance: INTERIOR_NEAR_DISTANCE,
  };
}
