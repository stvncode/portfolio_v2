"use client";

import { ArrowUpRight, X } from "lucide-react";
import { TOWN_AREAS, type TownPlace } from "@/data/town";

interface PlacePanelProps {
  place: TownPlace;
  onClose: () => void;
}

/** The story of one place: a side panel on desktop, a bottom sheet on phones. */
export function PlacePanel({ place, onClose }: PlacePanelProps) {
  return (
    <aside
      aria-labelledby="town-place-title"
      className="pointer-events-auto absolute inset-x-3 bottom-3 max-h-[62dvh] overflow-y-auto rounded-2xl border border-black/10 bg-[#fbf8f1]/95 p-6 text-neutral-900 shadow-2xl backdrop-blur animate-in fade-in slide-in-from-bottom-4 sm:inset-x-auto sm:bottom-4 sm:right-4 sm:top-4 sm:max-h-none sm:w-[400px] sm:slide-in-from-right-4"
    >
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500">
          {TOWN_AREAS[place.area]}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-m-1 rounded-full p-1.5 text-neutral-500 transition hover:bg-black/5 hover:text-neutral-900"
        >
          <X className="size-4" />
        </button>
      </div>
      <h2 id="town-place-title" className="mt-2 text-3xl font-bold tracking-tight">
        {place.name}
      </h2>
      <p className="mt-2 border-l-2 border-amber-400 pl-3 text-sm text-neutral-600">{place.bubble}</p>
      <div className="mt-5 space-y-3 text-[15px] leading-relaxed text-neutral-800">
        {place.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {place.list && (
        <section className="mt-5">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500">
            {place.list.title}
          </h3>
          <ol className="mt-2 divide-y divide-black/5 rounded-xl border border-black/10 bg-white/70">
            {place.list.items.map((item, index) => (
              <li key={item} className="flex items-baseline gap-3 px-3 py-2 text-sm">
                <span className="w-4 shrink-0 text-right font-mono text-xs text-neutral-400">{index + 1}</span>
                {item}
              </li>
            ))}
          </ol>
        </section>
      )}
      {place.links && place.links.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {place.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm font-medium transition hover:bg-neutral-100"
            >
              {link.label}
              <ArrowUpRight className="size-3.5" />
            </a>
          ))}
        </div>
      )}
    </aside>
  );
}
