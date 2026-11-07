"use client";

import { Canvas } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { findTownPlace, TOWN_PLACES } from "@/data/town";
import { buildWalkGrid, findPath } from "@/lib/town/pathfinding";
import { Scene } from "./scene/scene";
import { type PlayerState, TownContext, type TownControls, type WalkTarget } from "./town-context";
import { Hud } from "./ui/hud";
import { PlacePanel } from "./ui/place-panel";
import { OBSTACLES, PLAYER_RADIUS, SPAWN, WALK_BOUNDS } from "./world-layout";

/** Already this close to a place's entrance: open it instead of walking. */
const ALREADY_THERE = 0.6;
/** Path grid resolution, in world units. */
const GRID_CELL = 0.5;
/** A little extra room so paths don't scrape walls. */
const GRID_CLEARANCE = 0.1;

function readHashPlace(): string | null {
  const id = window.location.hash.slice(1);
  return findTownPlace(id) ? id : null;
}

export default function TownApp() {
  const player = useRef<PlayerState>({ x: SPAWN[0], z: SPAWN[1], heading: Math.PI * 0.75 });
  const target = useRef<WalkTarget | null>(null);
  const keys = useRef(new Set<string>());
  const nightLevel = useRef(0);

  const [nearbyId, setNearbyId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(() => new Set());
  const [night, setNight] = useState(false);
  const [showtime, setShowtime] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const arrive = useCallback((id: string) => {
    setOpenId(id);
    setVisited((previous) => (previous.has(id) ? previous : new Set(previous).add(id)));
    window.history.replaceState(null, "", `#${id}`);
  }, []);

  const closePanel = useCallback(() => {
    setOpenId(null);
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const grid = useMemo(
    () => buildWalkGrid(WALK_BOUNDS, OBSTACLES, PLAYER_RADIUS + GRID_CLEARANCE, GRID_CELL),
    [],
  );

  const pathTo = useCallback(
    (x: number, z: number) => findPath(grid, { x: player.current.x, z: player.current.z }, { x, z }),
    [grid],
  );

  const walkTo = useCallback(
    (x: number, z: number) => {
      target.current = { path: pathTo(x, z), placeId: null };
      setShowHint(false);
      setOpenId(null);
    },
    [pathTo],
  );

  const walkToPlace = useCallback(
    (id: string) => {
      const place = findTownPlace(id);
      if (!place) return;
      setShowHint(false);
      const [x, z] = place.entrance;
      if (Math.hypot(player.current.x - x, player.current.z - z) < ALREADY_THERE) {
        arrive(id);
        return;
      }
      setOpenId(null);
      target.current = { path: pathTo(x, z), placeId: id };
    },
    [arrive, pathTo],
  );

  // Arriving from a shared link: start at that place with it open.
  useEffect(() => {
    const id = readHashPlace();
    const place = findTownPlace(id);
    if (!id || !place) return;
    player.current.x = place.entrance[0];
    player.current.z = place.entrance[1];
    arrive(id);
  }, [arrive]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      if (key === "escape") {
        closePanel();
        return;
      }
      if (key === "enter" && nearbyId && !openId) {
        arrive(nearbyId);
        return;
      }
      if (key.startsWith("arrow")) event.preventDefault();
      keys.current.add(key);
      setShowHint(false);
    }
    function handleKeyUp(event: KeyboardEvent) {
      keys.current.delete(event.key.toLowerCase());
    }
    function handleBlur() {
      keys.current.clear();
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [arrive, closePanel, nearbyId, openId]);

  // The finale: once every place is visited, night falls and the film starts.
  useEffect(() => {
    if (showtime || visited.size < TOWN_PLACES.length) return;
    setShowtime(true);
    setNight(true);
  }, [showtime, visited]);

  const controls = useMemo<TownControls>(
    () => ({
      player,
      target,
      keys,
      nightLevel,
      night,
      showtime,
      panelOpen: openId !== null,
      walkTo,
      walkToPlace,
      setNearby: setNearbyId,
      arrive,
    }),
    [night, showtime, openId, walkTo, walkToPlace, arrive],
  );

  const openPlace = findTownPlace(openId);

  return (
    <TownContext.Provider value={controls}>
      <div className="fixed inset-0 select-none overflow-hidden bg-[#cfe6ef]">
        <Canvas
          orthographic
          shadows
          flat
          dpr={[1, 2]}
          camera={{ position: [30, 30, 30], zoom: 30, near: 1, far: 400 }}
          onPointerMissed={() => setOpenId(null)}
        >
          <TownContext.Provider value={controls}>
            <Scene nearbyId={nearbyId} openId={openId} visited={visited} />
          </TownContext.Provider>
        </Canvas>
        <div className="pointer-events-none absolute inset-0 z-30">
          <Hud
            visited={visited}
            night={night}
            showHint={showHint && !openPlace}
            onToggleNight={() => setNight((value) => !value)}
            onGoTo={walkToPlace}
          />
          {openPlace && <PlacePanel place={openPlace} onClose={closePanel} />}
        </div>
      </div>
    </TownContext.Provider>
  );
}
