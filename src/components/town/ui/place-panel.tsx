"use client";

import { ArrowUpRight, DoorOpen, MapPin, X } from "lucide-react";
import { TOWN_AREAS, type TownPlace } from "@/data/town";
import { AREA_ACCENTS, PLACE_ICONS } from "./place-style";

interface PlacePanelProps {
  place: TownPlace;
  onClose: () => void;
  /** Set when the place has an inside you can visit. */
  onEnter?: () => void;
}

/** The story of one place: a side panel on desktop, a bottom sheet on phones. */
export function PlacePanel({ place, onClose, onEnter }: PlacePanelProps) {
  const Icon = PLACE_ICONS[place.id] ?? MapPin;
  return (
    <aside
      aria-labelledby="town-place-title"
      className="pointer-events-auto absolute inset-x-3 bottom-3 max-h-[62dvh] overflow-y-auto rounded-3xl bg-[#fffdf8]/95 p-6 text-neutral-900 shadow-[0_20px_60px_rgba(30,25,15,0.25)] ring-1 ring-black/5 backdrop-blur animate-in fade-in slide-in-from-bottom-4 sm:inset-x-auto sm:bottom-4 sm:right-4 sm:top-4 sm:max-h-none sm:w-[400px] sm:slide-in-from-right-4"
    >
      <div className="flex items-center gap-3">
        <span className={`grid size-10 shrink-0 place-items-center rounded-2xl ${AREA_ACCENTS[place.area]}`}>
          <Icon className="size-5" aria-hidden />
        </span>
        <p className="flex-1 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500">
          {TOWN_AREAS[place.area]}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-full p-2 text-neutral-500 transition hover:bg-black/5 hover:text-neutral-900"
        >
          <X className="size-4" />
        </button>
      </div>
      <h2 id="town-place-title" className="mt-4 text-[28px] font-bold leading-tight tracking-tight">
        {place.name}
      </h2>
      <p className="mt-1.5 text-[15px] italic text-neutral-500">{place.bubble}</p>
      <div className="mt-5 space-y-3 text-[15px] leading-relaxed text-neutral-700">
        {place.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {place.list && (
        <section className="mt-5">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500">{place.list.title}</h3>
          <ol className="mt-2 divide-y divide-black/5 overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
            {place.list.items.map((item, index) => (
              <li key={item} className="flex items-baseline gap-3 px-4 py-2.5 text-sm">
                <span className="w-4 shrink-0 text-right font-mono text-xs text-neutral-400">{index + 1}</span>
                {item}
              </li>
            ))}
          </ol>
        </section>
      )}
      {place.outro && <p className="mt-4 text-sm text-neutral-500">{place.outro}</p>}
      {(onEnter || (place.links && place.links.length > 0)) && (
        <div className="mt-6 flex flex-wrap gap-2">
          {onEnter && (
            <button
              type="button"
              onClick={onEnter}
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-700"
            >
              <DoorOpen className="size-4" aria-hidden />
              Step inside
            </button>
          )}
          {place.links?.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-white px-3.5 py-2 text-sm font-medium ring-1 ring-black/10 transition hover:bg-neutral-50"
            >
              {link.label}
              <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
          ))}
        </div>
      )}
    </aside>
  );
}
