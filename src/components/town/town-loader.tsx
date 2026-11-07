"use client";

import dynamic from "next/dynamic";

function Loading() {
  return (
    <div className="fixed inset-0 grid place-items-center bg-[#cfe6ef]">
      <div className="flex flex-col items-center gap-3 text-neutral-600">
        <span aria-hidden className="flex gap-1.5">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="size-2 animate-bounce rounded-full bg-neutral-500" style={{ animationDelay: `${dot * 150}ms` }} />
          ))}
        </span>
        <p className="text-sm font-medium">Walking to the village…</p>
      </div>
    </div>
  );
}

/** Three.js only runs in the browser, so the town skips server rendering. */
const TownApp = dynamic(() => import("./town-app"), { ssr: false, loading: Loading });

export function TownLoader() {
  return <TownApp />;
}
