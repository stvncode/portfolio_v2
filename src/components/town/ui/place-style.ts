import {
  Beer,
  BookOpen,
  Clapperboard,
  Cpu,
  Disc3,
  Gamepad2,
  Home,
  Library,
  Lightbulb,
  type LucideIcon,
  Sword,
  Trophy,
} from "lucide-react";
import type { TownArea } from "@/data/town";

export const PLACE_ICONS: Record<string, LucideIcon> = {
  longere: Home,
  penty: Gamepad2,
  pitch: Trophy,
  "petit-bar": Beer,
  kiosk: BookOpen,
  cinema: Clapperboard,
  glade: Sword,
  "home-assistant": Lightbulb,
  "music-assistant": Disc3,
  esphome: Cpu,
  "device-database": Library,
};

/** Tailwind classes for each area's accent: icon tile background and text. */
export const AREA_ACCENTS: Record<TownArea, string> = {
  home: "bg-amber-100 text-amber-800",
  rennes: "bg-rose-100 text-rose-800",
  ohf: "bg-sky-100 text-sky-800",
  countryside: "bg-emerald-100 text-emerald-800",
};
