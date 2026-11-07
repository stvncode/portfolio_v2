import { type Bounds, collides, type Rect } from "./movement";

export interface Point {
  x: number;
  z: number;
}

export interface WalkGrid {
  bounds: Bounds;
  cell: number;
  columns: number;
  rows: number;
  /** 1 where a circle of the walker's radius would hit something. */
  blocked: Uint8Array;
}

export function buildWalkGrid(bounds: Bounds, obstacles: Rect[], radius: number, cell: number): WalkGrid {
  const columns = Math.ceil((bounds.maxX - bounds.minX) / cell) + 1;
  const rows = Math.ceil((bounds.maxZ - bounds.minZ) / cell) + 1;
  const blocked = new Uint8Array(columns * rows);
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = bounds.minX + column * cell;
      const z = bounds.minZ + row * cell;
      blocked[row * columns + column] = collides(x, z, radius, obstacles) ? 1 : 0;
    }
  }
  return { bounds, cell, columns, rows, blocked };
}

function toCell(grid: WalkGrid, point: Point) {
  const column = Math.round((point.x - grid.bounds.minX) / grid.cell);
  const row = Math.round((point.z - grid.bounds.minZ) / grid.cell);
  return {
    column: Math.min(grid.columns - 1, Math.max(0, column)),
    row: Math.min(grid.rows - 1, Math.max(0, row)),
  };
}

function toPoint(grid: WalkGrid, index: number): Point {
  const column = index % grid.columns;
  const row = Math.floor(index / grid.columns);
  return { x: grid.bounds.minX + column * grid.cell, z: grid.bounds.minZ + row * grid.cell };
}

/** The free cell closest to `index`, searching outwards ring by ring. */
function nearestFree(grid: WalkGrid, index: number): number {
  if (!grid.blocked[index]) return index;
  const column = index % grid.columns;
  const row = Math.floor(index / grid.columns);
  const maxRing = Math.max(grid.columns, grid.rows);
  for (let ring = 1; ring < maxRing; ring += 1) {
    let best = -1;
    let bestDistance = Infinity;
    for (let dz = -ring; dz <= ring; dz += 1) {
      for (let dx = -ring; dx <= ring; dx += 1) {
        if (Math.max(Math.abs(dx), Math.abs(dz)) !== ring) continue;
        const c = column + dx;
        const r = row + dz;
        if (c < 0 || r < 0 || c >= grid.columns || r >= grid.rows) continue;
        const candidate = r * grid.columns + c;
        const distance = dx * dx + dz * dz;
        if (!grid.blocked[candidate] && distance < bestDistance) {
          best = candidate;
          bestDistance = distance;
        }
      }
    }
    if (best >= 0) return best;
  }
  return index;
}

/** True when a straight walk from `a` to `b` stays on free cells. */
export function hasLineOfSight(grid: WalkGrid, a: Point, b: Point): boolean {
  const distance = Math.hypot(b.x - a.x, b.z - a.z);
  const steps = Math.ceil(distance / (grid.cell / 2));
  for (let step = 1; step <= steps; step += 1) {
    const t = step / steps;
    const { column, row } = toCell(grid, { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t });
    if (grid.blocked[row * grid.columns + column]) return false;
  }
  return true;
}

const NEIGHBOURS = [
  [1, 0, 1],
  [-1, 0, 1],
  [0, 1, 1],
  [0, -1, 1],
  [1, 1, Math.SQRT2],
  [1, -1, Math.SQRT2],
  [-1, 1, Math.SQRT2],
  [-1, -1, Math.SQRT2],
] as const;

/** A tiny binary heap of cell indices ordered by score. */
class Frontier {
  private items: number[] = [];
  constructor(private readonly score: Float32Array) {}
  get size() {
    return this.items.length;
  }
  push(index: number) {
    const items = this.items;
    items.push(index);
    let child = items.length - 1;
    while (child > 0) {
      const parent = (child - 1) >> 1;
      if (this.score[items[parent]] <= this.score[items[child]]) break;
      [items[parent], items[child]] = [items[child], items[parent]];
      child = parent;
    }
  }
  pop(): number {
    const items = this.items;
    const top = items[0];
    const last = items.pop() as number;
    if (items.length > 0) {
      items[0] = last;
      let parent = 0;
      for (;;) {
        const left = parent * 2 + 1;
        const right = left + 1;
        let smallest = parent;
        if (left < items.length && this.score[items[left]] < this.score[items[smallest]]) smallest = left;
        if (right < items.length && this.score[items[right]] < this.score[items[smallest]]) smallest = right;
        if (smallest === parent) break;
        [items[parent], items[smallest]] = [items[smallest], items[parent]];
        parent = smallest;
      }
    }
    return top;
  }
}

/** Drops waypoints you can skip by walking straight, so paths don't zig-zag. */
function smooth(grid: WalkGrid, points: Point[]): Point[] {
  if (points.length <= 2) return points;
  const result: Point[] = [points[0]];
  let anchor = 0;
  while (anchor < points.length - 1) {
    let next = points.length - 1;
    while (next > anchor + 1 && !hasLineOfSight(grid, points[anchor], points[next])) next -= 1;
    result.push(points[next]);
    anchor = next;
  }
  return result;
}

/**
 * Waypoints from `from` to `to` around obstacles (A* on the grid), not
 * including the start. Ends at `to`, or the nearest free spot to it.
 */
export function findPath(grid: WalkGrid, from: Point, to: Point): Point[] {
  const startCell = toCell(grid, from);
  const goalCell = toCell(grid, to);
  const start = nearestFree(grid, startCell.row * grid.columns + startCell.column);
  const goal = nearestFree(grid, goalCell.row * grid.columns + goalCell.column);
  const goalPoint = goal === goalCell.row * grid.columns + goalCell.column ? to : toPoint(grid, goal);

  if (hasLineOfSight(grid, from, goalPoint)) return [goalPoint];

  const total = grid.columns * grid.rows;
  const cost = new Float32Array(total).fill(Infinity);
  const score = new Float32Array(total).fill(Infinity);
  const cameFrom = new Int32Array(total).fill(-1);
  const closed = new Uint8Array(total);
  const goalColumn = goal % grid.columns;
  const goalRow = Math.floor(goal / grid.columns);
  const heuristic = (index: number) => {
    const dx = Math.abs((index % grid.columns) - goalColumn);
    const dz = Math.abs(Math.floor(index / grid.columns) - goalRow);
    return Math.max(dx, dz) + (Math.SQRT2 - 1) * Math.min(dx, dz);
  };

  const frontier = new Frontier(score);
  cost[start] = 0;
  score[start] = heuristic(start);
  frontier.push(start);

  while (frontier.size > 0) {
    const current = frontier.pop();
    if (current === goal) break;
    if (closed[current]) continue;
    closed[current] = 1;
    const column = current % grid.columns;
    const row = Math.floor(current / grid.columns);
    for (const [dx, dz, step] of NEIGHBOURS) {
      const c = column + dx;
      const r = row + dz;
      if (c < 0 || r < 0 || c >= grid.columns || r >= grid.rows) continue;
      const next = r * grid.columns + c;
      if (grid.blocked[next] || closed[next]) continue;
      // Don't cut corners diagonally between two blocked cells.
      if (dx !== 0 && dz !== 0 && (grid.blocked[row * grid.columns + c] || grid.blocked[r * grid.columns + column])) continue;
      const nextCost = cost[current] + step;
      if (nextCost < cost[next]) {
        cost[next] = nextCost;
        score[next] = nextCost + heuristic(next);
        cameFrom[next] = current;
        frontier.push(next);
      }
    }
  }

  if (goal === start) return [goalPoint];
  if (cameFrom[goal] === -1) return [];
  const cells: Point[] = [];
  for (let index = goal; index !== -1 && index !== start; index = cameFrom[index]) {
    cells.push(toPoint(grid, index));
  }
  cells.reverse();
  cells[cells.length - 1] = goalPoint;
  return smooth(grid, [from, ...cells]).slice(1);
}
