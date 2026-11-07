import type { Rect } from "./movement";

/** A small seeded random generator, so the scenery is the same on every visit. */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function inside(x: number, z: number, rect: Rect, margin: number) {
  return Math.abs(x - rect.x) < rect.w / 2 + margin && Math.abs(z - rect.z) < rect.d / 2 + margin;
}

export interface ScatterOptions {
  count: number;
  seed: number;
  area: Rect;
  /** Spots to keep clear: paths, buildings, the square. */
  avoid: Rect[];
  margin?: number;
}

/** Random points in `area` that stay clear of everything in `avoid`. */
export function scatter({ count, seed, area, avoid, margin = 0.4 }: ScatterOptions): { x: number; z: number }[] {
  const random = seededRandom(seed);
  const points: { x: number; z: number }[] = [];
  const maxTries = count * 20;
  for (let tries = 0; points.length < count && tries < maxTries; tries += 1) {
    const x = area.x - area.w / 2 + random() * area.w;
    const z = area.z - area.d / 2 + random() * area.d;
    if (avoid.some((rect) => inside(x, z, rect, margin))) continue;
    points.push({ x, z });
  }
  return points;
}
