"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { seededRandom } from "@/lib/town/scatter";
import { Instances, type Placement } from "./instances";
import type { Vec3 } from "./shapes";

/** A hole in the wall the stones should leave clear: centre and size on the wall's face. */
export interface Opening {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface StoneworkProps {
  /** Bottom centre of the wall face. */
  position: Vec3;
  width: number;
  height: number;
  /** `front` is a wall facing +z, `side` one facing +x. */
  facing?: "front" | "side";
  openings?: Opening[];
  /** For gable ends: the wall narrows to a point this far above `height`. */
  gable?: number;
  seed?: number;
  shades?: string[];
}

const GRANITE_SHADES = ["#aba395", "#c5beb1", "#b4ac9e", "#a0988b", "#bdb5a7", "#b0a99d"];
const COURSE_HEIGHT = 0.34;
const JOINT = 0.05;
const PROUD = 0.035;
const stone = new THREE.BoxGeometry(1, 1, 1);

function overlaps(x: number, y: number, w: number, h: number, opening: Opening) {
  return Math.abs(x - opening.x) < (w + opening.w) / 2 && Math.abs(y - opening.y) < (h + opening.h) / 2;
}

/** Courses of rough-cut stones laid over a wall, the way granite farmhouses are built. */
export function Stonework({
  position,
  width,
  height,
  facing = "front",
  openings = [],
  gable = 0,
  seed = 1,
  shades = GRANITE_SHADES,
}: StoneworkProps) {
  const placements = useMemo(() => {
    const random = seededRandom(seed);
    const stones: Placement[] = [];
    const courses = Math.floor((height + gable) / COURSE_HEIGHT);
    for (let course = 0; course < courses; course += 1) {
      const y = JOINT + course * COURSE_HEIGHT + COURSE_HEIGHT / 2;
      // Above the eaves, a gable narrows towards the ridge.
      const reach = y > height && gable > 0 ? (width / 2) * (1 - (y - height) / gable) - 0.2 : width / 2;
      let x = -reach + (course % 2) * 0.2;
      while (x < reach - 0.25) {
        const length = Math.min(0.38 + random() * 0.6, reach - x);
        const centre = x + length / 2;
        const tall = COURSE_HEIGHT - JOINT;
        if (!openings.some((opening) => overlaps(centre, y, length, tall, opening))) {
          const along: [number, number, number] =
            facing === "front"
              ? [position[0] + centre, position[1] + y, position[2] + PROUD / 2]
              : [position[0] + PROUD / 2, position[1] + y, position[2] + centre];
          stones.push({
            position: along,
            scale: facing === "front" ? [length - JOINT, tall, PROUD] : [PROUD, tall, length - JOINT],
            color: shades[Math.floor(random() * shades.length)],
          });
        }
        x += length;
      }
    }
    return stones;
  }, [position, width, height, facing, openings, gable, seed, shades]);

  return <Instances geometry={stone} color={shades[0]} placements={placements} castShadow={false} />;
}
