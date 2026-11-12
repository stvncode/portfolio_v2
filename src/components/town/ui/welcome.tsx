"use client";

import { Footprints } from "lucide-react";
import { TOWN_PLACES } from "@/data/town";

interface WelcomeProps {
  /** Places found on an earlier visit. */
  found: number;
  onStart: () => void;
}

/** A short hello before you start walking. */
export function Welcome({ found, onStart }: WelcomeProps) {
  const returning = found > 0;
  return (
    <div className="pointer-events-auto absolute inset-0 grid place-items-center bg-[#1d2a20]/15 p-4 animate-in fade-in duration-500 lg:justify-items-start lg:pl-[6vw]">
      <section
        aria-labelledby="town-welcome-title"
        className="w-full max-w-md rounded-3xl bg-[#fffdf8] p-7 text-neutral-900 shadow-[0_24px_70px_rgba(30,25,15,0.3)] ring-1 ring-black/5 animate-in fade-in zoom-in-95"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-amber-700">Val d&apos;Izé, Brittany</p>
        <h2 id="town-welcome-title" className="mt-2 text-3xl font-bold tracking-tight">
          {returning ? "Welcome back." : "Hi, I'm Steven."}
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
          Welcome to my little village. It&apos;s made of the people and things I love: home, films, games, and the
          work I&apos;m proud to be part of. Walk around, step inside, take your time.
        </p>
        <ul className="mt-5 grid gap-1.5 text-sm text-neutral-600">
          <li className="max-sm:hidden">Click anywhere to walk, or use the arrow keys.</li>
          <li className="sm:hidden">Tap anywhere to walk.</li>
          <li>Walk up to a place to hear its story.</li>
          <li>
            {found >= TOWN_PLACES.length
              ? "You've found every place. The film is still showing."
              : returning
                ? `You've found ${found} of ${TOWN_PLACES.length} places so far.`
                : "Visit them all, and stay for the evening show."}
          </li>
        </ul>
        <button
          type="button"
          onClick={onStart}
          autoFocus
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          <Footprints className="size-4" aria-hidden />
          {returning ? "Keep exploring" : "Start exploring"}
        </button>
      </section>
    </div>
  );
}
