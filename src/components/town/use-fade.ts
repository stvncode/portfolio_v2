"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const FADE_MS = 220;
/** A beat in the dark, so the new room is drawn before the fade lifts. */
const HOLD_MS = 90;

/** Fades the screen to dark, makes a change, and fades back: for walking through doors. */
export function useFade() {
  const [dark, setDark] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      for (const timer of timers.current) window.clearTimeout(timer);
    },
    [],
  );

  const through = useCallback((change: () => void) => {
    setDark(true);
    timers.current.push(
      window.setTimeout(() => {
        change();
        timers.current.push(window.setTimeout(() => setDark(false), HOLD_MS));
      }, FADE_MS),
    );
  }, []);

  return { dark, through };
}
