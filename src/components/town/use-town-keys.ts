"use client";

import { type MutableRefObject, useEffect, useRef } from "react";

interface TownKeyHandlers {
  onEscape: () => void;
  onEnter: () => void;
  /** Any movement key went down. */
  onMove: () => void;
}

/** Tracks held keys for walking, and routes Escape and Enter. */
export function useTownKeys(keys: MutableRefObject<Set<string>>, handlers: TownKeyHandlers) {
  const latest = useRef(handlers);
  latest.current = handlers;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      if (key === "escape") {
        latest.current.onEscape();
        return;
      }
      if (key === "enter") {
        latest.current.onEnter();
        return;
      }
      if (key.startsWith("arrow")) event.preventDefault();
      keys.current.add(key);
      latest.current.onMove();
    }
    function handleKeyUp(event: KeyboardEvent) {
      keys.current.delete(event.key.toLowerCase());
    }
    function handleBlur() {
      keys.current.clear();
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [keys]);
}
