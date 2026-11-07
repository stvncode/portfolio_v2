"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { applyNightGlow } from "../kit/materials";
import { useTown } from "../town-context";

export const CAMERA_OFFSET = new THREE.Vector3(30, 30, 30);
/** On narrow screens, keep at least this share of the visible height across. */
const MIN_WIDTH_SHARE = 0.82;
const MIN_ZOOM = 0.4;
const MAX_ZOOM = 2.2;
const WHEEL_STEP = 0.1;
const FOLLOW = 4;
/** Width of the side panel plus its margin, in CSS pixels. */
const PANEL_PX = 416;
/** Below this width the panel is a bottom sheet instead. */
const SIDE_PANEL_MIN_WIDTH = 640;
/** The bottom sheet on phones covers up to this share of the screen height. */
const SHEET_SHARE = 0.62;
/** World directions of "right" and "down" on screen. */
const SCREEN_RIGHT = new THREE.Vector3(1, 0, -1).normalize();
const SCREEN_DOWN = new THREE.Vector3(1, 0, 1).normalize();

/** Orthographic follow camera with wheel zoom. */
export function CameraRig() {
  const town = useTown();
  const { camera, size, gl } = useThree();
  const focus = useRef(new THREE.Vector3(town.player.current.x, 0, town.player.current.z));
  const zoom = useRef(1);
  const areaId = useRef(town.area.id);

  useEffect(() => {
    const element = gl.domElement;
    function handleWheel(event: WheelEvent) {
      event.preventDefault();
      const factor = event.deltaY > 0 ? 1 - WHEEL_STEP : 1 + WHEEL_STEP;
      zoom.current = THREE.MathUtils.clamp(zoom.current * factor, MIN_ZOOM, MAX_ZOOM);
    }
    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
  }, [gl]);

  useFrame((_, delta) => {
    const player = town.player.current;
    const ortho = camera as THREE.OrthographicCamera;
    const look = new THREE.Vector3(player.x, 0, player.z);
    // With a panel open, look past it so you stay in the part of the screen still visible.
    if (town.panelOpen && size.width >= SIDE_PANEL_MIN_WIDTH) {
      look.addScaledVector(SCREEN_RIGHT, PANEL_PX / 2 / ortho.zoom);
    } else if (town.panelOpen) {
      look.addScaledVector(SCREEN_DOWN, (size.height * SHEET_SHARE) / 2 / ortho.zoom);
    }
    if (areaId.current !== town.area.id) {
      // Walked through a door: cut, don't pan across the map.
      areaId.current = town.area.id;
      focus.current.copy(look);
    } else {
      focus.current.lerp(look, 1 - Math.exp(-FOLLOW * Math.min(delta, 0.1)));
    }
    camera.position.copy(focus.current).add(CAMERA_OFFSET);
    camera.lookAt(focus.current);
    const visible = town.area.visibleHeight;
    const base = Math.min(size.height / visible, size.width / (visible * MIN_WIDTH_SHARE));
    const wantedZoom = base * zoom.current;
    if (Math.abs(ortho.zoom - wantedZoom) > 0.01) {
      ortho.zoom += (wantedZoom - ortho.zoom) * Math.min(1, delta * 8);
      ortho.updateProjectionMatrix();
    }
  });

  return null;
}

const DAY = {
  sky: new THREE.Color("#cfe6ef"),
  sun: new THREE.Color("#fff1d9"),
  sunIntensity: 2.4,
  hemiSky: new THREE.Color("#e8f3ff"),
  hemiGround: new THREE.Color("#8a9a6a"),
  hemiIntensity: 1.25,
};

const NIGHT = {
  sky: new THREE.Color("#1a2340"),
  sun: new THREE.Color("#8ea6ff"),
  sunIntensity: 0.45,
  hemiSky: new THREE.Color("#3a4a7a"),
  hemiGround: new THREE.Color("#1e2433"),
  hemiIntensity: 0.55,
};

const SUN_OFFSET = new THREE.Vector3(-14, 30, 18);
const SHADOW_EXTENT = 34;
const NIGHT_FADE = 1.2;
const FOG_NEAR = 70;
const FOG_FAR = 150;

/** Sun, sky and fog, eased between day and night. */
export function Lighting() {
  const town = useTown();
  const { scene } = useThree();
  const sun = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const sunTarget = useMemo(() => new THREE.Object3D(), []);
  const sky = useMemo(() => DAY.sky.clone(), []);
  const fog = useMemo(() => new THREE.Fog(DAY.sky.clone(), FOG_NEAR, FOG_FAR), []);

  useEffect(() => {
    scene.add(sunTarget);
    scene.background = sky;
    scene.fog = fog;
    if (sun.current) sun.current.target = sunTarget;
    return () => {
      scene.remove(sunTarget);
      scene.background = null;
      scene.fog = null;
    };
  }, [scene, sunTarget, sky, fog]);

  useFrame((_, delta) => {
    const goal = town.night ? 1 : 0;
    const level = town.nightLevel.current;
    const next =
      Math.abs(goal - level) < 0.001 ? goal : level + (goal - level) * Math.min(1, delta * NIGHT_FADE);
    town.nightLevel.current = next;
    applyNightGlow(next);

    sky.lerpColors(DAY.sky, NIGHT.sky, next);
    fog.color.copy(sky);

    const player = town.player.current;
    if (sun.current) {
      sun.current.color.lerpColors(DAY.sun, NIGHT.sun, next);
      sun.current.intensity = THREE.MathUtils.lerp(DAY.sunIntensity, NIGHT.sunIntensity, next);
      sun.current.position.set(player.x + SUN_OFFSET.x, SUN_OFFSET.y, player.z + SUN_OFFSET.z);
      sunTarget.position.set(player.x, 0, player.z);
    }
    if (hemi.current) {
      hemi.current.color.lerpColors(DAY.hemiSky, NIGHT.hemiSky, next);
      hemi.current.groundColor.lerpColors(DAY.hemiGround, NIGHT.hemiGround, next);
      hemi.current.intensity = THREE.MathUtils.lerp(DAY.hemiIntensity, NIGHT.hemiIntensity, next);
    }
  });

  return (
    <>
      <hemisphereLight ref={hemi} args={[DAY.hemiSky, DAY.hemiGround, DAY.hemiIntensity]} />
      <directionalLight
        ref={sun}
        intensity={DAY.sunIntensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-camera-left={-SHADOW_EXTENT}
        shadow-camera-right={SHADOW_EXTENT}
        shadow-camera-top={SHADOW_EXTENT}
        shadow-camera-bottom={-SHADOW_EXTENT}
        shadow-camera-near={1}
        shadow-camera-far={90}
      />
    </>
  );
}
