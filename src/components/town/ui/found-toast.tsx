"use client";

import { MapPin, Sparkles } from "lucide-react";
import { findTownPlace, TOWN_PLACES } from "@/data/town";
import type { FoundPlace } from "../use-town-progress";
import { AREA_ACCENTS, PLACE_ICONS } from "./place-style";

/** A small cheer when you find a new place. */
export function FoundToast({ found }: { found: FoundPlace }) {
  const place = findTownPlace(found.id);
  if (!place) return null;
  const Icon = PLACE_ICONS[place.id] ?? MapPin;
  return (
    <div
      role="status"
      key={found.id}
      className="absolute left-1/2 top-16 flex w-max max-w-[90vw] -translate-x-1/2 items-center gap-3 rounded-full bg-[#fffdf8]/95 py-1.5 pl-1.5 pr-5 shadow-[0_10px_30px_rgba(30,25,15,0.22)] ring-1 ring-black/5 backdrop-blur animate-in fade-in slide-in-from-top-3 zoom-in-95 duration-300 sm:left-[calc((100%-416px)/2)]"
    >
      <span className={`grid size-9 place-items-center rounded-full ${AREA_ACCENTS[place.area]}`}>
        <Icon className="size-[18px]" aria-hidden />
      </span>
      <span className="text-left">
        <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-700">
          <Sparkles className="size-3" aria-hidden />
          New place · {found.count} of {TOWN_PLACES.length}
        </span>
        <span className="block text-sm font-semibold text-neutral-900">{place.name}</span>
      </span>
    </div>
  );
}
