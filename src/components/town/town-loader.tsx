"use client";

import dynamic from "next/dynamic";

function Loading() {
  return (
    <div className="fixed inset-0 grid place-items-center bg-[#cfe6ef] text-sm font-medium text-neutral-600">
      Walking to the village…
    </div>
  );
}

/** Three.js only runs in the browser, so the town skips server rendering. */
const TownApp = dynamic(() => import("./town-app"), { ssr: false, loading: Loading });

export function TownLoader() {
  return <TownApp />;
}
