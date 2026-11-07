"use client";

import { ArrowLeft, Map as MapIcon, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { TOWN_PLACES } from "@/data/town";

interface HudProps {
  visited: Set<string>;
  night: boolean;
  showHint: boolean;
  onToggleNight: () => void;
  onGoTo: (id: string) => void;
}

const BUTTON =
  "inline-flex h-10 items-center gap-2 rounded-full border border-black/10 bg-white/90 px-3 text-sm font-medium text-neutral-800 shadow-md backdrop-blur transition hover:bg-white";

/** Corner controls: back to the classic site, progress, places list, day and night. */
export function Hud({ visited, night, showHint, onToggleNight, onGoTo }: HudProps) {
  const [listOpen, setListOpen] = useState(false);
  const total = TOWN_PLACES.length;

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
          </button>
          {listOpen && (
            <ul
              id="town-places"
              className="absolute left-0 top-12 w-64 overflow-hidden rounded-2xl border border-black/10 bg-white/95 py-1 shadow-xl backdrop-blur"
            >
              {TOWN_PLACES.map((place) => (
                <li key={place.id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-neutral-800 hover:bg-neutral-100"
                    onClick={() => {
                      setListOpen(false);
                      onGoTo(place.id);
                    }}
                  >
                    <span
                      aria-hidden
                      className={`size-2 rotate-45 rounded-[1px] ${visited.has(place.id) ? "bg-emerald-500" : "bg-amber-400"}`}
                    />
                    {place.name}
                    {visited.has(place.id) && <span className="sr-only">(visited)</span>}
                  </button>
                </li>
              ))}
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
      {showHint && (
        <p className="pointer-events-none absolute bottom-5 left-1/2 w-max max-w-[90vw] -translate-x-1/2 rounded-full bg-neutral-900/80 px-4 py-2 text-center text-xs text-white shadow-lg">
          <span className="sm:hidden">Tap anywhere to walk · Tap a place to visit</span>
          <span className="max-sm:hidden">Click to walk · Arrow keys or WASD · Enter to visit</span>
        </p>
      )}
    </>
  );
}
