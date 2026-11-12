import * as THREE from "three";

/** Daytime palette shared by every model, so the town reads as one place. */
export const PALETTE = {
  grass: "#93c06b",
  grassDark: "#7fb05c",
  field: "#c9c46d",
  fieldPlowed: "#a98a63",
  path: "#ddcda6",
  cobble: "#bcb1a2",
  granite: "#bab3a6",
  graniteDark: "#9d9588",
  slate: "#4b5564",
  slateDark: "#3d4552",
  timber: "#5b3b2b",
  plaster: "#f0e6d1",
  frame: "#f5f2ea",
  bretonBlue: "#3f73a3",
  hedge: "#5e8f46",
  leaf: "#6ea251",
  leafDark: "#4f7f3c",
  trunk: "#7a5a3d",
  wood: "#a0774f",
  woodDark: "#6e4f35",
  white: "#f7f7f4",
  ink: "#23272e",
  haBlue: "#18bcf2",
  skin: "#e9b996",
} as const;

const SOLID_LOOK = { flatShading: true, roughness: 0.92, metalness: 0 } as const;
const cache = new Map<string, THREE.MeshStandardMaterial>();
const solids = new WeakSet<THREE.Material>();

/** A flat-shaded matte material, shared per colour. */
export function solid(color: string): THREE.MeshStandardMaterial {
  let material = cache.get(color);
  if (!material) {
    material = new THREE.MeshStandardMaterial({ color, ...SOLID_LOOK });
    cache.set(color, material);
    solids.add(material);
  }
  return material;
}

/** True for materials made by `solid`: they differ only in colour. */
export function isSolid(material: THREE.Material): material is THREE.MeshStandardMaterial {
  return solids.has(material);
}

/** What batches of solid-coloured meshes are drawn with: the colour rides on each vertex. */
export const vertexSolid = new THREE.MeshStandardMaterial({ vertexColors: true, ...SOLID_LOOK });

const WINDOW_DAY = new THREE.Color("#a9c3d3");
const WINDOW_NIGHT = new THREE.Color("#3a3326");
const WINDOW_GLOW = 1.6;
const BULB_GLOW = 3;
const SCREEN_GLOW = 1.4;

/** Materials that light up when night falls. */
export const glow = {
  window: new THREE.MeshStandardMaterial({
    color: WINDOW_DAY.clone(),
    emissive: "#ffbf66",
    emissiveIntensity: 0,
    roughness: 0.35,
  }),
  bulb: new THREE.MeshStandardMaterial({
    color: "#fff6df",
    emissive: "#ffcf7a",
    emissiveIntensity: 0,
  }),
  screen: new THREE.MeshStandardMaterial({
    color: "#d8d6cf",
    emissive: "#ffffff",
    emissiveIntensity: 0,
  }),
};

/** Indoor lamps: always on. */
export const litBulb = new THREE.MeshStandardMaterial({
  color: "#fff6df",
  emissive: "#ffcf7a",
  emissiveIntensity: 1.6,
});

/** 0 is full day, 1 is full night. */
export function applyNightGlow(t: number) {
  glow.window.color.lerpColors(WINDOW_DAY, WINDOW_NIGHT, t);
  glow.window.emissiveIntensity = t * WINDOW_GLOW;
  glow.bulb.emissiveIntensity = t * BULB_GLOW;
  glow.screen.emissiveIntensity = t * SCREEN_GLOW;
}
