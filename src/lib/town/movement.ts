export interface Rect {
  x: number;
  z: number;
  w: number;
  d: number;
}

export interface Bounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

/** True when a circle at (x, z) overlaps any rectangle. */
export function collides(x: number, z: number, radius: number, rects: Rect[]): boolean {
  return rects.some(
    (rect) =>
      Math.abs(x - rect.x) < rect.w / 2 + radius &&
      Math.abs(z - rect.z) < rect.d / 2 + radius,
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Moves a circle by (dx, dz), sliding along walls instead of stopping dead.
 * Returns the new position.
 */
export function slide(
  x: number,
  z: number,
  dx: number,
  dz: number,
  radius: number,
  rects: Rect[],
  bounds: Bounds,
): { x: number; z: number } {
  const nextX = clamp(x + dx, bounds.minX, bounds.maxX);
  const nextZ = clamp(z + dz, bounds.minZ, bounds.maxZ);
  if (!collides(nextX, nextZ, radius, rects)) return { x: nextX, z: nextZ };
  if (!collides(nextX, z, radius, rects)) return { x: nextX, z };
  if (!collides(x, nextZ, radius, rects)) return { x, z: nextZ };
  return { x, z };
}

/**
 * The camera looks from +x, +y, +z: screen right is world (1, -1) in x/z and
 * screen down is (1, 1). Turns screen-space input into a unit world direction.
 */
export function screenToWorld(right: number, down: number): { x: number; z: number } {
  const x = right + down;
  const z = down - right;
  const length = Math.hypot(x, z);
  if (length === 0) return { x: 0, z: 0 };
  return { x: x / length, z: z / length };
}

/** Shortest signed angle from `from` to `to`, in radians. */
export function angleDelta(from: number, to: number): number {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}
