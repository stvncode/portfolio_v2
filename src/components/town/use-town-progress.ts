"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TOWN_PLACE_IDS } from "@/data/town";

const STORAGE_KEY = "town.visited";
/** How long the "new place" toast stays up. */
const TOAST_MS = 3200;

export interface FoundPlace {
  id: string;
  /** How many places are found, counting this one. */
  count: number;
}

function load(): Set<string> {
  try {
    const stored: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(stored)) return new Set();
    return new Set(stored.filter((id): id is string => typeof id === "string" && TOWN_PLACE_IDS.includes(id)));
  } catch {
    // Private windows and blocked storage: just start fresh.
    return new Set();
  }
}

function save(visited: Set<string>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(visited)));
  } catch {
    // Nothing to do: progress simply won't survive a reload.
  }
}

/** Which places you've found, remembered between visits. */
export function useTownProgress() {
  const [visited, setVisited] = useState<Set<string>>(load);
  const [found, setFound] = useState<FoundPlace | null>(null);
  /** True from the moment the last place is found until the finale card is closed. */
  const [finaleDue, setFinaleDue] = useState(false);
  const current = useRef(visited);

  const visit = useCallback((id: string) => {
    if (current.current.has(id)) return;
    const next = new Set(current.current).add(id);
    current.current = next;
    setVisited(next);
    save(next);
    setFound({ id, count: next.size });
    if (next.size === TOWN_PLACE_IDS.length) setFinaleDue(true);
  }, []);

  const reset = useCallback(() => {
    const empty = new Set<string>();
    current.current = empty;
    setVisited(empty);
    save(empty);
    setFound(null);
    setFinaleDue(false);
  }, []);

  useEffect(() => {
    if (!found) return;
    const timer = window.setTimeout(() => setFound(null), TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [found]);

  return {
    visited,
    found,
    finaleDue,
    complete: visited.size >= TOWN_PLACE_IDS.length,
    visit,
    reset,
    closeFinale: useCallback(() => setFinaleDue(false), []),
  };
}
