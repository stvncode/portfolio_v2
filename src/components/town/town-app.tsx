"use client";

import { Canvas } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { findTownPlace, TOWN_PLACES } from "@/data/town";
import { EXIT_SPOT, TOWN_INTERIORS } from "@/data/town-interiors";
import { buildWalkGrid, findPath, type WalkGrid } from "@/lib/town/pathfinding";
import { type Area, areaFor, OUTSIDE } from "./areas";
import { Scene } from "./scene/scene";
import { type PlayerState, TownContext, type TownControls, type WalkTarget } from "./town-context";
import { Hud } from "./ui/hud";
import { PlacePanel } from "./ui/place-panel";
import { useTownKeys } from "./use-town-keys";
import { Welcome } from "./ui/welcome";
import { PLAYER_RADIUS, SPAWN } from "./world-layout";

/** Already this close to a spot: act on it instead of walking. */
const ALREADY_THERE = 0.6;
/** Path grid resolution, in world units. */
const GRID_CELL = 0.5;
const INTERIOR_GRID_CELL = 0.25;
/** A little extra room so paths don't scrape walls. */
const GRID_CLEARANCE = 0.1;
/** Facing the camera, for when you step out of a door. */
const FACING_CAMERA = Math.PI / 4;

function readHashPlace(): string | null {
  const id = window.location.hash.slice(1);
  return findTownPlace(id) ? id : null;
}

export default function TownApp() {
  const player = useRef<PlayerState>({ x: SPAWN[0], z: SPAWN[1], heading: Math.PI * 0.75 });
  const target = useRef<WalkTarget | null>(null);
  const keys = useRef(new Set<string>());
  const nightLevel = useRef(0);
  const grids = useRef(new Map<string, WalkGrid>());

  const [nearbyId, setNearbyId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [inside, setInside] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(() => new Set());
  const [night, setNight] = useState(false);
  const [showtime, setShowtime] = useState(false);
  const [showHint, setShowHint] = useState(true);
  // Shared links to a place skip the hello and go straight to it.
  const [welcome, setWelcome] = useState(() => readHashPlace() === null);

  const area = useMemo(() => areaFor(inside), [inside]);
  const insideRef = useRef(inside);
  insideRef.current = inside;

  const pathTo = useCallback((walkArea: Area, x: number, z: number) => {
    let grid = grids.current.get(walkArea.id);
    if (!grid) {
      const cell = walkArea === OUTSIDE ? GRID_CELL : INTERIOR_GRID_CELL;
      grid = buildWalkGrid(walkArea.bounds, walkArea.obstacles, PLAYER_RADIUS + GRID_CLEARANCE, cell);
      grids.current.set(walkArea.id, grid);
    }
    return findPath(grid, { x: player.current.x, z: player.current.z }, { x, z });
  }, []);

  const openPlace = useCallback((id: string) => {
    setOpenId(id);
    setVisited((previous) => (previous.has(id) ? previous : new Set(previous).add(id)));
    window.history.replaceState(null, "", `#${id}`);
  }, []);

  const closePanel = useCallback(() => {
    setOpenId(null);
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const enter = useCallback((placeId: string) => {
    const layout = areaFor(placeId);
    if (!TOWN_INTERIORS[placeId] || layout === OUTSIDE) return;
    target.current = null;
    player.current.x = layout.spawn[0];
    player.current.z = layout.spawn[1];
    player.current.heading = FACING_CAMERA;
    setOpenId(null);
    setNearbyId(null);
    setInside(placeId);
  }, []);

  const leave = useCallback(() => {
    const place = findTownPlace(insideRef.current);
    target.current = null;
    if (place) {
      player.current.x = place.entrance[0];
      player.current.z = place.entrance[1];
      player.current.heading = FACING_CAMERA;
    }
    setNearbyId(null);
    setInside(null);
  }, []);

  const arrive = useCallback(
    (id: string) => {
      if (insideRef.current) {
        if (id === EXIT_SPOT) leave();
        return;
      }
      openPlace(id);
    },
    [leave, openPlace],
  );

  const walkTo = useCallback(
    (x: number, z: number) => {
      target.current = { path: pathTo(area, x, z), placeId: null };
      setShowHint(false);
      setOpenId(null);
    },
    [area, pathTo],
  );

  const walkToSpot = useCallback(
    (id: string) => {
      const spot = area.spots.find((candidate) => candidate.id === id);
      if (!spot) return;
      setShowHint(false);
      if (Math.hypot(player.current.x - spot.x, player.current.z - spot.z) < ALREADY_THERE) {
        arrive(id);
        return;
      }
      setOpenId(null);
      target.current = { path: pathTo(area, spot.x, spot.z), placeId: id };
    },
    [area, arrive, pathTo],
  );

  /** From the places list: works from anywhere, even indoors. */
  const walkToPlace = useCallback(
    (id: string) => {
      const place = findTownPlace(id);
      if (!place) return;
      if (insideRef.current) leave();
      setShowHint(false);
      setOpenId(null);
      target.current = { path: pathTo(OUTSIDE, place.entrance[0], place.entrance[1]), placeId: id };
    },
    [leave, pathTo],
  );

  // Arriving from a shared link: start at that place with it open.
  useEffect(() => {
    const id = readHashPlace();
    const place = findTownPlace(id);
    if (!id || !place) return;
    player.current.x = place.entrance[0];
    player.current.z = place.entrance[1];
    openPlace(id);
  }, [openPlace]);

  useTownKeys(keys, {
    onEscape: () => {
      if (welcome) setWelcome(false);
      else if (openId) closePanel();
      else if (inside) leave();
    },
    onEnter: () => {
      if (welcome || !nearbyId || openId) return;
      arrive(nearbyId);
    },
    onMove: () => setShowHint(false),
  });

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
      area,
      walkTo,
      walkToSpot,
      setNearby: setNearbyId,
      arrive,
    }),
    [night, showtime, openId, area, walkTo, walkToSpot, arrive],
  );

  const place = findTownPlace(openId);
  const interior = inside ? TOWN_INTERIORS[inside] : undefined;

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
            <Scene inside={inside} nearbyId={nearbyId} openId={openId} visited={visited} />
          </TownContext.Provider>
        </Canvas>
        <div className="pointer-events-none absolute inset-0 z-30">
          <Hud
            visited={visited}
            night={night}
            showHint={showHint && !place && !welcome}
            insideName={interior?.name}
            onLeave={leave}
            onToggleNight={() => setNight((value) => !value)}
            onGoTo={walkToPlace}
          />
          {welcome && <Welcome onStart={() => setWelcome(false)} />}
          {place && <PlacePanel place={place} onClose={closePanel} onEnter={place.enterable ? () => enter(place.id) : undefined} />}
        </div>
      </div>
    </TownContext.Provider>
  );
}
