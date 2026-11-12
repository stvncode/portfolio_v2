import { PALETTE } from "./kit/materials";

/** An axis-aligned rectangle on the ground: centre x/z, width along x, depth along z. */
export interface Rect {
  x: number;
  z: number;
  w: number;
  d: number;
}

export interface ColoredRect extends Rect {
  color: string;
}

export type TreeKind = "oak" | "pine" | "apple";

export interface TreeSpot {
  x: number;
  z: number;
  scale: number;
  kind: TreeKind;
}

export const SPAWN: [number, number] = [2, 7];

export const PLAYER_RADIUS = 0.4;

/** Where the family is, and where you stand to say hello. */
export interface FriendSpot {
  /** Where they are: x, y, z. */
  at: [number, number, number];
  rotationY: number;
  /** Where the player stands: x, z. */
  stand: [number, number];
}

export const FRIEND_SPOTS: Record<string, FriendSpot> = {
  mathilde: { at: [-10.4, 0, 19.5], rotationY: 0.6, stand: [-9.6, 20.5] },
  malo: { at: [-12.2, 0, 20.1], rotationY: 0.9, stand: [-11.3, 21.1] },
  ponyo: { at: [-8.1, 0.52, 18.35], rotationY: 0.5, stand: [-8.1, 19.5] },
  plume: { at: [-1.75, 1.05, 20.45], rotationY: -0.4, stand: [-1.8, 21.9] },
};

/** How close you need to be to a friend for their bubble to show. */
export const FRIEND_RADIUS = 1.4;

/** Centre of the car-football pitch. */
export const PITCH_ORIGIN: [number, number] = [-4, 31.5];

/** The player can't leave this rectangle. */
export const WALK_BOUNDS = { minX: -31, maxX: 30, minZ: -24, maxZ: 37 };

export const PATHS: Rect[] = [
  { x: 0, z: 5, w: 62, d: 3 },
  { x: 2, z: 5, w: 3, d: 38 },
  { x: 2.5, z: -14, w: 36, d: 2.6 },
  { x: -2, z: 21.6, w: 24, d: 2.4 },
  { x: -3, z: 24.2, w: 2.2, d: 3 },
  { x: 19, z: 12, w: 2.4, d: 12 },
  { x: -20, z: 2.5, w: 3, d: 4 },
];

export const PLAZA: Rect = { x: -20, z: -5, w: 18, d: 10 };

/** The gravel courtyard in front of the farmhouse. */
export const COURTYARD: Rect = { x: -6.4, z: 19.15, w: 15.6, d: 2.5 };

export interface BushSpot {
  x: number;
  z: number;
  scale: number;
  /** Colour of its blossom, for the ones in flower. */
  bloom?: string;
}

export const BUSHES: BushSpot[] = [
  // Around the penty and the lane home.
  { x: 4.3, z: 18.1, scale: 0.8, bloom: "#f08bb4" },
  { x: 10, z: 17.9, scale: 0.9 },
  { x: 10.4, z: 14.2, scale: 1 },
  { x: -14.4, z: 18.6, scale: 0.9, bloom: "#ffffff" },
  // The Open Home Foundation row.
  { x: -13.7, z: -16.6, scale: 0.9 },
  { x: -6.4, z: -16.2, scale: 0.8, bloom: "#f6d55c" },
  { x: 4.3, z: -16, scale: 0.8 },
  { x: 11.7, z: -15.9, scale: 0.9, bloom: "#8fb8f0" },
  { x: 18.8, z: -15.6, scale: 1 },
  // The village green.
  { x: -1.7, z: 2.4, scale: 0.7, bloom: "#e85d4f" },
  { x: 1.8, z: 2.3, scale: 0.6 },
  { x: -4.6, z: 8.2, scale: 0.8 },
  { x: 5.4, z: 9.6, scale: 0.7, bloom: "#b48be0" },
  { x: 11.4, z: -3.4, scale: 0.9 },
  { x: 3.8, z: -7.4, scale: 0.8, bloom: "#ffffff" },
  // The cinema and the square.
  { x: 15.4, z: -2.2, scale: 1 },
  { x: 26.8, z: -1.9, scale: 1.1, bloom: "#f08bb4" },
  { x: -29.8, z: -0.6, scale: 0.9 },
  { x: -10.4, z: -9.6, scale: 1, bloom: "#f6d55c" },
  { x: -9.8, z: 2.6, scale: 0.8 },
];

export const FIELDS: ColoredRect[] = [
  { x: -46, z: -10, w: 26, d: 40, color: PALETTE.field },
  { x: -46, z: 26, w: 26, d: 30, color: PALETTE.grassDark },
  { x: 44, z: -14, w: 24, d: 28, color: PALETTE.fieldPlowed },
  { x: 44, z: 18, w: 24, d: 34, color: PALETTE.field },
  { x: 0, z: -38, w: 40, d: 22, color: PALETTE.grassDark },
  { x: -36, z: -38, w: 30, d: 22, color: PALETTE.fieldPlowed },
  { x: 36, z: -40, w: 30, d: 26, color: PALETTE.field },
  { x: 14, z: 48, w: 30, d: 20, color: PALETTE.fieldPlowed },
  { x: -22, z: 48, w: 40, d: 20, color: PALETTE.field },
];

/** Bocage: the hedgerows that edge Breton fields. */
export const HEDGES: Rect[] = [
  { x: -33, z: 6, w: 0.9, d: 62 },
  { x: 32, z: 4, w: 0.9, d: 60 },
  { x: 0, z: -26.5, w: 66, d: 0.9 },
  { x: -2, z: 38.8, w: 62, d: 0.9 },
  { x: -46, z: 10.5, w: 26, d: 0.9 },
  { x: 44, z: 0.5, w: 24, d: 0.9 },
  { x: -20, z: -38, w: 0.9, d: 22 },
  { x: 20, z: -39, w: 0.9, d: 24 },
  { x: -1, z: 48, w: 0.9, d: 20 },
  { x: -15, z: 9.2, w: 12, d: 0.7 },
  { x: -15, z: 13, w: 0.7, d: 7.6 },
];

export const TREES: TreeSpot[] = [
  // Along the bocage.
  { x: -33, z: -18, scale: 1.3, kind: "oak" },
  { x: -33, z: -2, scale: 1.1, kind: "oak" },
  { x: -33, z: 22, scale: 1.4, kind: "oak" },
  { x: -33, z: 32, scale: 1.2, kind: "oak" },
  { x: 32, z: -20, scale: 1.2, kind: "oak" },
  { x: 32, z: 32, scale: 1.3, kind: "oak" },
  { x: -24, z: -26.5, scale: 1.2, kind: "oak" },
  { x: 8, z: -26.5, scale: 1.4, kind: "oak" },
  { x: 24, z: -26.5, scale: 1.1, kind: "oak" },
  { x: -20, z: 38.8, scale: 1.3, kind: "oak" },
  { x: 14, z: 38.8, scale: 1.2, kind: "oak" },
  // Around the village green.
  { x: -7, z: 0, scale: 1, kind: "oak" },
  { x: 9, z: 0.5, scale: 0.9, kind: "oak" },
  { x: -8, z: -8, scale: 1.1, kind: "oak" },
  { x: 11, z: -8, scale: 0.9, kind: "oak" },
  { x: 26, z: -10, scale: 1.2, kind: "oak" },
  { x: 27, z: 10, scale: 1, kind: "oak" },
  // Orchard by the farmhouse.
  { x: -22, z: 17, scale: 0.8, kind: "apple" },
  { x: -25, z: 20, scale: 0.75, kind: "apple" },
  { x: -21, z: 23, scale: 0.85, kind: "apple" },
  { x: -26, z: 25, scale: 0.8, kind: "apple" },
  { x: 13, z: 13, scale: 0.9, kind: "apple" },
  // Brocéliande: trees close in behind the glade, so the camera still sees into it.
  { x: 14, z: 14.5, scale: 1.4, kind: "pine" },
  { x: 16, z: 12.6, scale: 1.1, kind: "pine" },
  { x: 13.4, z: 19.5, scale: 1.5, kind: "oak" },
  { x: 14.2, z: 24, scale: 1.3, kind: "pine" },
  { x: 23.5, z: 13.4, scale: 1.3, kind: "pine" },
  { x: 27, z: 15.4, scale: 1.4, kind: "oak" },
  { x: 28.6, z: 19.5, scale: 1.1, kind: "pine" },
  { x: 11.5, z: 22, scale: 1.2, kind: "pine" },
  { x: 10.5, z: 17.5, scale: 1, kind: "pine" },
  { x: 28.5, z: 31, scale: 0.9, kind: "pine" },
  { x: 12, z: 32, scale: 0.9, kind: "pine" },
];

/** Things you can't walk through. Building footprints are listed with their models. */
export const OBSTACLES: Rect[] = [
  // La Longère, the penty and the moving van.
  { x: -6, z: 15, w: 14.4, d: 5.8 },
  { x: 7, z: 15.4, w: 5.2, d: 4.6 },
  { x: 1.2, z: 19.2, w: 2.2, d: 4.4 },
  { x: -1.7, z: 20.5, w: 2.4, d: 1.3 },
  // Rennes: Le Petit Bar, its neighbours and the kiosk.
  { x: -22, z: -7.5, w: 6.2, d: 4.6 },
  { x: -27.6, z: -7.8, w: 5, d: 4.2 },
  { x: -16.4, z: -7.8, w: 5, d: 4.2 },
  { x: -14, z: -0.6, w: 2.6, d: 2.6 },
  { x: -26.5, z: -1.6, w: 2.4, d: 1.3 },
  { x: -18.2, z: -1.4, w: 2.4, d: 1.3 },
  // Open Home Foundation row.
  { x: -10, z: -19.5, w: 6.2, d: 5.2 },
  { x: -1, z: -20, w: 9.2, d: 7.2 },
  { x: 8, z: -19, w: 6.2, d: 5.2 },
  { x: 15.5, z: -18.5, w: 5.6, d: 5.2 },
  // Cinema screen, the well and the glade's stone.
  { x: 21, z: -1.6, w: 9, d: 0.8 },
  { x: 0, z: 1, w: 1.8, d: 1.8 },
  { x: 20, z: 19, w: 1.6, d: 1.4 },
  // The duck pond and the vegetable garden.
  { x: 7.5, z: -5.5, w: 5.4, d: 4.2 },
  { x: -19, z: 13.6, w: 5.2, d: 4.6 },
  // Hedges inside the walkable area.
  { x: -15, z: 9.2, w: 12, d: 0.9 },
  { x: -15, z: 13, w: 0.9, d: 7.6 },
];
