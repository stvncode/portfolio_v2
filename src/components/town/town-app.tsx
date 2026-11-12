"use client";

import { Canvas } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { findTownPlace } from "@/data/town";
import { EXIT_SPOT, TOWN_INTERIORS } from "@/data/town-interiors";
import { buildWalkGrid, findPath, type WalkGrid } from "@/lib/town/pathfinding";
import { type Area, areaFor, OUTSIDE } from "./areas";
import { Scene } from "./scene/scene";
import { type ClickMark, type PlayerState, TownContext, type TownControls, type WalkTarget } from "./town-context";
import { Finale } from "./ui/finale";
import { FoundToast } from "./ui/found-toast";
import { Hud } from "./ui/hud";
import { PlacePanel } from "./ui/place-panel";
import { Welcome } from "./ui/welcome";
import { useFade } from "./use-fade";
import { useTownKeys } from "./use-town-keys";
import { useTownProgress } from "./use-town-progress";
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
const CINEMA = "cinema";

function readHashPlace(): string | null {
  const id = window.location.hash.slice(1);
  return findTownPlace(id) ? id : null;
}

export default function TownApp() {
  const player = useRef<PlayerState>({ x: SPAWN[0], z: SPAWN[1], heading: Math.PI * 0.75, vx: 0, vz: 0 });
  const target = useRef<WalkTarget | null>(null);
  const keys = useRef(new Set<string>());
  const nightLevel = useRef(0);
  const clickMark = useRef<ClickMark | null>(null);
  const interactions = useRef(new Map<string, () => void>());
  const grids = useRef(new Map<string, WalkGrid>());

  const progress = useTownProgress();
  const fade = useFade();
  const [nearbyId, setNearbyId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [inside, setInside] = useState<string | null>(null);
  const [night, setNight] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [ready, setReady] = useState(false);
  // Shared links to a place skip the hello and go straight to it.
  const [welcome, setWelcome] = useState(() => readHashPlace() === null);

  const area = useMemo(() => areaFor(inside), [inside]);
  // The walking code reads this one: it flips the moment you go through a door.
  const areaNow = useRef<Area>(OUTSIDE);
  const insideRef = useRef(inside);
  insideRef.current = inside;

  /** Finds a way there, and drops the ripple where you'll end up. */
  const pathTo = useCallback((walkArea: Area, x: number, z: number) => {
    let grid = grids.current.get(walkArea.id);
    if (!grid) {
      const cell = walkArea === OUTSIDE ? GRID_CELL : INTERIOR_GRID_CELL;
      grid = buildWalkGrid(walkArea.bounds, walkArea.obstacles, PLAYER_RADIUS + GRID_CLEARANCE, cell);
      grids.current.set(walkArea.id, grid);
    }
    const path = findPath(grid, { x: player.current.x, z: player.current.z }, { x, z });
    const end = path[path.length - 1];
    if (end) clickMark.current = { x: end.x, z: end.z, at: performance.now() };
    return path;
  }, []);

  const { visit } = progress;
  const openPlace = useCallback(
    (id: string) => {
      setOpenId(id);
      visit(id);
      window.history.replaceState(null, "", `#${id}`);
    },
    [visit],
  );

  const closePanel = useCallback(() => {
    setOpenId(null);
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const { through } = fade;
  const enter = useCallback(
    (placeId: string) => {
      const layout = areaFor(placeId);
      if (!TOWN_INTERIORS[placeId] || layout === OUTSIDE) return;
      through(() => {
        target.current = null;
        clickMark.current = null;
        player.current.x = layout.spawn[0];
        player.current.z = layout.spawn[1];
        player.current.heading = FACING_CAMERA;
        areaNow.current = layout;
        setOpenId(null);
        setNearbyId(null);
        setInside(placeId);
      });
    },
    [through],
  );

  /** Puts you back at the building's door. Instant: wrap it in a fade where you can. */
  const stepOutside = useCallback(() => {
    const place = findTownPlace(insideRef.current);
    target.current = null;
    clickMark.current = null;
    if (place) {
      player.current.x = place.entrance[0];
      player.current.z = place.entrance[1];
      player.current.heading = FACING_CAMERA;
    }
    areaNow.current = OUTSIDE;
    setNearbyId(null);
    setInside(null);
  }, []);

  const leave = useCallback(() => through(stepOutside), [through, stepOutside]);

  const arrive = useCallback(
    (id: string) => {
      const interaction = interactions.current.get(id);
      if (interaction) {
        interaction();
        return;
      }
      if (insideRef.current) {
        if (id === EXIT_SPOT) leave();
        return;
      }
      if (findTownPlace(id)) openPlace(id);
    },
    [leave, openPlace],
  );

  const walkTo = useCallback(
    (x: number, z: number) => {
      target.current = { path: pathTo(areaNow.current, x, z), placeId: null };
      setShowHint(false);
      setOpenId(null);
    },
    [pathTo],
  );

  const walkToSpot = useCallback(
    (id: string) => {
      const spot = areaNow.current.spots.find((candidate) => candidate.id === id);
      if (!spot) return;
      setShowHint(false);
      if (Math.hypot(player.current.x - spot.x, player.current.z - spot.z) < ALREADY_THERE) {
        arrive(id);
        return;
      }
      setOpenId(null);
      target.current = { path: pathTo(areaNow.current, spot.x, spot.z), placeId: id };
    },
    [arrive, pathTo],
  );

  /** From the places list: works from anywhere, even indoors. */
  const walkToPlace = useCallback(
    (id: string) => {
      const place = findTownPlace(id);
      if (!place) return;
      if (insideRef.current) stepOutside();
      setShowHint(false);
      setOpenId(null);
      target.current = { path: pathTo(OUTSIDE, place.entrance[0], place.entrance[1]), placeId: id };
    },
    [stepOutside, pathTo],
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

  // The finale: once the last place is found, night falls and the film starts.
  useEffect(() => {
    if (progress.finaleDue) setNight(true);
  }, [progress.finaleDue]);

  const showFinale = progress.finaleDue && !openId && !inside;

  useTownKeys(keys, {
    onEscape: () => {
      if (welcome) setWelcome(false);
      else if (showFinale) progress.closeFinale();
      else if (openId) closePanel();
      else if (inside) leave();
    },
    onEnter: () => {
      if (welcome || showFinale || !nearbyId || openId) return;
      arrive(nearbyId);
    },
    onMove: () => setShowHint(false),
  });

  const controls = useMemo<TownControls>(
    () => ({
      player,
      target,
      keys,
      nightLevel,
      clickMark,
      areaNow,
      interactions,
      night,
      showtime: progress.complete,
      intro: welcome,
      panelOpen: openId !== null,
      area,
      walkTo,
      walkToSpot,
      setNearby: setNearbyId,
      arrive,
    }),
    [night, progress.complete, welcome, openId, area, walkTo, walkToSpot, arrive],
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
          onCreated={() => setReady(true)}
          onPointerMissed={() => setOpenId(null)}
        >
          <TownContext.Provider value={controls}>
            <Scene inside={inside} nearbyId={nearbyId} openId={openId} visited={progress.visited} />
          </TownContext.Provider>
        </Canvas>
        {/* A soft vignette, to draw the eye to the middle of the picture. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_58%,rgba(22,30,26,0.2)_100%)]"
        />
        <div className="pointer-events-none absolute inset-0 z-30">
          <Hud
            visited={progress.visited}
            night={night}
            showHint={showHint && !place && !welcome}
            insideName={interior?.name}
            onLeave={leave}
            onToggleNight={() => setNight((value) => !value)}
            onGoTo={walkToPlace}
            onReset={progress.reset}
          />
          {progress.found && !welcome && <FoundToast found={progress.found} />}
          {welcome && <Welcome found={progress.visited.size} onStart={() => setWelcome(false)} />}
          {place && (
            <PlacePanel place={place} onClose={closePanel} onEnter={place.enterable ? () => enter(place.id) : undefined} />
          )}
          {showFinale && (
            <Finale
              onCinema={() => {
                progress.closeFinale();
                walkToPlace(CINEMA);
              }}
              onClose={progress.closeFinale}
            />
          )}
        </div>
        {/* Fades for walking through doors, and for the first frame arriving. */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 z-40 bg-[#14110f] transition-opacity duration-200 ${fade.dark ? "opacity-100" : "opacity-0"}`}
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 z-40 bg-[#cfe6ef] transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
        />
      </div>
    </TownContext.Provider>
  );
}
