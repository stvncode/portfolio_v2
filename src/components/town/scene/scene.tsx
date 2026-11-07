"use client";

import { BarInterior } from "../interiors/bar-interior";
import { HouseInterior } from "../interiors/house-interior";
import { PentyInterior } from "../interiors/penty-interior";
import { InteriorLighting } from "../interiors/room";
import { Exterior } from "./exterior";
import { Player } from "./player";
import { CameraRig, Lighting } from "./rig";

interface SceneProps {
  /** The place you're inside, or null when you're out in the village. */
  inside: string | null;
  nearbyId: string | null;
  openId: string | null;
  visited: Set<string>;
}

const INTERIORS: Record<string, (props: { nearbyId: string | null }) => JSX.Element> = {
  longere: HouseInterior,
  penty: PentyInterior,
  "petit-bar": BarInterior,
};

export function Scene({ inside, nearbyId, openId, visited }: SceneProps) {
  const Interior = inside ? INTERIORS[inside] : undefined;
  return (
    <>
      <CameraRig />
      <Player />
      {Interior ? (
        <>
          <InteriorLighting />
          <Interior nearbyId={nearbyId} />
        </>
      ) : (
        <>
          <Lighting />
          <Exterior nearbyId={nearbyId} openId={openId} visited={visited} />
        </>
      )}
    </>
  );
}
