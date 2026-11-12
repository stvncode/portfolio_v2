"use client";

import { ArrowUpRight, Clapperboard } from "lucide-react";
import { DATA } from "@/data/resume";

interface FinaleProps {
  onCinema: () => void;
  onClose: () => void;
}

const SAY_HI = [DATA.contact.social.GitHub, DATA.contact.social.LinkedIn, DATA.contact.social.X];

/** The thank-you once every place has been found. */
export function Finale({ onCinema, onClose }: FinaleProps) {
  return (
    <div className="pointer-events-auto absolute inset-0 grid place-items-center bg-[#0d1424]/35 p-4 backdrop-blur-[2px] animate-in fade-in duration-500">
      <section
        aria-labelledby="town-finale-title"
        className="w-full max-w-md rounded-3xl bg-[#fffdf8] p-7 text-neutral-900 shadow-[0_24px_70px_rgba(10,10,20,0.45)] ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-500"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-amber-700">You&apos;ve seen the whole village</p>
        <h2 id="town-finale-title" className="mt-2 text-3xl font-bold tracking-tight">
          Thank you for the walk.
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
          It means a lot that you took the time. Night is falling, the film is about to start at the open-air cinema,
          and there&apos;s a deckchair free if you&apos;d like to stay a little.
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">And if you feel like saying hi, I&apos;d love that.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {SAY_HI.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-sm font-medium ring-1 ring-black/10 transition hover:bg-neutral-50"
            >
              <social.icon className="size-3.5" aria-hidden />
              {social.name}
              <ArrowUpRight className="size-3.5 text-neutral-400" aria-hidden />
            </a>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onCinema}
            autoFocus
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
          >
            <Clapperboard className="size-4" aria-hidden />
            Take me to the film
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-neutral-700 ring-1 ring-black/10 transition hover:bg-neutral-50"
          >
            Keep wandering
          </button>
        </div>
      </section>
    </div>
  );
}
