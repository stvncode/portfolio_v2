"use client";

import { Footprints } from "lucide-react";

interface WelcomeProps {
  onStart: () => void;
}

/** A short hello before you start walking. */
export function Welcome({ onStart }: WelcomeProps) {
  return (
    <div className="pointer-events-auto absolute inset-0 grid place-items-center bg-[#1d2a20]/25 p-4 backdrop-blur-[2px] animate-in fade-in">
      <section
        aria-labelledby="town-welcome-title"
        className="w-full max-w-md rounded-3xl bg-[#fffdf8] p-7 text-neutral-900 shadow-[0_24px_70px_rgba(30,25,15,0.3)] ring-1 ring-black/5 animate-in fade-in zoom-in-95"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-amber-700">Val d&apos;Izé, Brittany</p>
        <h2 id="town-welcome-title" className="mt-2 text-3xl font-bold tracking-tight">
          Hi, I&apos;m Steven.
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
          Welcome to my little village. It&apos;s made of the people and things I love: home, films, games, and the
          work I&apos;m proud to be part of. Walk around, step inside, take your time.
        </p>
        <ul className="mt-5 grid gap-1.5 text-sm text-neutral-600">
          <li className="max-sm:hidden">Click anywhere to walk, or use the arrow keys.</li>
          <li className="sm:hidden">Tap anywhere to walk.</li>
          <li>Walk up to a place to hear its story.</li>
          <li>Visit them all, and stay for the evening show.</li>
        </ul>
        <button
          type="button"
          onClick={onStart}
          autoFocus
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          <Footprints className="size-4" aria-hidden />
          Start exploring
        </button>
      </section>
    </div>
  );
}
