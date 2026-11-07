"use client";

import { ArrowLeft, Check, DoorOpen, Map as MapIcon, MapPin, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { TOWN_PLACES } from "@/data/town";
import { PLACE_ICONS } from "./place-style";

interface HudProps {
  visited: Set<string>;
  night: boolean;
  showHint: boolean;
  /** Set while you're inside a building. */
  insideName?: string;
  onLeave: () => void;
  onToggleNight: () => void;
  onGoTo: (id: string) => void;
}

const BUTTON =
  "inline-flex h-10 items-center gap-2 rounded-full bg-[#fffdf8]/95 px-3 text-sm font-medium text-neutral-800 shadow-[0_4px_14px_rgba(30,25,15,0.14)] ring-1 ring-black/5 backdrop-blur transition hover:bg-white";

/** Corner controls: back to the classic site, progress, places list, day and night. */
export function Hud({ visited, night, showHint, insideName, onLeave, onToggleNight, onGoTo }: HudProps) {
  const [listOpen, setListOpen] = useState(false);
  const total = TOWN_PLACES.length;
  const progress = Math.round((visited.size / total) * 100);

  return (
    <>
      <div className="pointer-events-auto absolute left-3 top-3 flex flex-wrap items-center gap-2 sm:left-4 sm:top-4">
        <Link href="/" className={BUTTON} aria-label="Back to steventravers.fr">
          <ArrowLeft className="size-4" />
          <span className="max-sm:hidden">steventravers.fr</span>
        </Link>
        <div className="relative">
          <button
            type="button"
            className={BUTTON}
            aria-expanded={listOpen}
            aria-controls="town-places"
            onClick={() => setListOpen((open) => !open)}
          >
            <MapIcon className="size-4" />
            <span className="tabular-nums">
              {visited.size}/{total}
            </span>
            <span className="max-sm:hidden">places</span>
            <span aria-hidden className="h-1.5 w-10 overflow-hidden rounded-full bg-neutral-200 max-sm:hidden">
              <span className="block h-full rounded-full bg-amber-400 transition-all" style={{ width: `${progress}%` }} />
            </span>
          </button>
          {listOpen && (
            <ul
              id="town-places"
              className="absolute left-0 top-12 w-64 overflow-hidden rounded-2xl bg-[#fffdf8]/95 py-1.5 shadow-xl ring-1 ring-black/5 backdrop-blur"
            >
              {TOWN_PLACES.map((place) => {
                const Icon = PLACE_ICONS[place.id] ?? MapPin;
                const seen = visited.has(place.id);
                return (
                  <li key={place.id}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-neutral-800 hover:bg-black/5"
                      onClick={() => {
                        setListOpen(false);
                        onGoTo(place.id);
                      }}
                    >
                      <Icon className="size-4 text-neutral-500" aria-hidden />
                      <span className="flex-1">{place.name}</span>
                      {seen ? (
                        <Check className="size-4 text-emerald-600" aria-label="visited" />
                      ) : (
                        <span aria-hidden className="size-2 rotate-45 rounded-[1px] bg-amber-400" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <button
          type="button"
          className={BUTTON}
          onClick={onToggleNight}
          aria-label={night ? "Switch to day" : "Switch to night"}
        >
          {night ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      </div>
      {insideName && (
        <div className="pointer-events-auto absolute left-3 top-16 flex items-center gap-1 rounded-full bg-[#fffdf8]/95 py-1 pl-4 pr-1 shadow-[0_4px_14px_rgba(30,25,15,0.14)] ring-1 ring-black/5 backdrop-blur sm:left-auto sm:right-4 sm:top-4">
          <span className="text-sm font-medium text-neutral-800">{insideName}</span>
          <button
            type="button"
            onClick={onLeave}
            className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-neutral-700"
          >
            <DoorOpen className="size-3.5" aria-hidden />
            Back outside
          </button>
        </div>
      )}
      {showHint && (
        <p className="pointer-events-none absolute bottom-5 left-1/2 w-max max-w-[90vw] -translate-x-1/2 rounded-full bg-neutral-900/80 px-4 py-2 text-center text-xs text-white shadow-lg">
          <span className="sm:hidden">Tap anywhere to walk · Tap a place to visit</span>
          <span className="max-sm:hidden">Click to walk · Arrow keys or WASD · Enter to visit</span>
        </p>
      )}
    </>
  );
}
