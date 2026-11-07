import type { Bounds, Rect } from "@/lib/town/movement";

/** Where things are inside a building. Rooms are centred on the origin, walls on -x and -z. */
export interface InteriorLayout {
  /** Half the room's width (x) and depth (z). */
  halfWidth: number;
  halfDepth: number;
  bounds: Bounds;
  obstacles: Rect[];
  /** Where you stand to look at each hotspot, keyed by spot id. */
  spots: Record<string, [number, number]>;
  spawn: [number, number];
  /** x of the door in the back wall. */
  doorX: number;
}

function boundsFor(halfWidth: number, halfDepth: number): Bounds {
  const wall = 0.6;
  return { minX: -halfWidth + wall, maxX: halfWidth - 0.4, minZ: -halfDepth + wall, maxZ: halfDepth - 0.4 };
}

export const HOUSE_LAYOUT: InteriorLayout = {
  halfWidth: 8,
  halfDepth: 4,
  bounds: boundsFor(8, 4),
  doorX: 6.2,
  spawn: [5.4, -1],
  obstacles: [
    { x: -7.2, z: 0, w: 1.3, d: 2.9 },
    { x: -2.4, z: 0, w: 1.1, d: 2.7 },
    { x: -4.4, z: 0, w: 0.9, d: 1.4 },
    { x: -4.8, z: -2.9, w: 1.1, d: 1.1 },
    { x: -0.6, z: -3.1, w: 1, d: 1 },
    { x: 2.9, z: -3.4, w: 4.6, d: 0.9 },
    { x: -6.6, z: -3.6, w: 1.7, d: 0.6 },
    { x: 3, z: 0.6, w: 2.9, d: 2.4 },
    { x: 6.6, z: 2.8, w: 1.7, d: 1.5 },
    { x: 7.3, z: -3.2, w: 0.8, d: 0.8 },
    { x: -5.7, z: 2.9, w: 0.5, d: 0.5 },
    { x: 1.2, z: 2.1, w: 0.5, d: 0.5 },
  ],
  spots: {
    exit: [6.2, -2.7],
    fireplace: [-5.6, 1.7],
    table: [3, 2.4],
    malo: [-4.2, 3.1],
    cats: [-0.6, -2],
    boxes: [5.3, 2.7],
  },
};

export const PENTY_LAYOUT: InteriorLayout = {
  halfWidth: 4.5,
  halfDepth: 3.5,
  bounds: boundsFor(4.5, 3.5),
  doorX: 3.5,
  spawn: [3, -0.9],
  obstacles: [
    { x: -3.9, z: -0.4, w: 1.1, d: 2.6 },
    { x: -2.8, z: -0.4, w: 0.8, d: 0.8 },
    { x: -1.4, z: -3.2, w: 2.2, d: 0.6 },
    { x: 1.4, z: -3.2, w: 2.2, d: 0.7 },
    { x: 1.4, z: 0.6, w: 2.5, d: 1.1 },
    { x: -1.6, z: 2.4, w: 1, d: 1 },
  ],
  spots: {
    exit: [3.5, -2.4],
    desk: [-2.4, 1.3],
    couch: [1.4, -1.4],
    shelf: [-1.4, -2.2],
  },
};

export const BAR_LAYOUT: InteriorLayout = {
  halfWidth: 5,
  halfDepth: 3.5,
  bounds: boundsFor(5, 3.5),
  doorX: -3.6,
  spawn: [-3, -0.9],
  obstacles: [
    { x: 2, z: -2.3, w: 5.2, d: 1 },
    { x: 2, z: -1.4, w: 4.6, d: 0.5 },
    { x: -1.4, z: 2.2, w: 1.8, d: 1.6 },
    { x: 2.6, z: 2.2, w: 1.8, d: 1.6 },
  ],
  spots: {
    exit: [-3.6, -2.4],
    counter: [1.8, -0.5],
    darts: [-2.4, 0.4],
  },
};

export const INTERIOR_LAYOUTS: Record<string, InteriorLayout> = {
  longere: HOUSE_LAYOUT,
  penty: PENTY_LAYOUT,
  "petit-bar": BAR_LAYOUT,
};
