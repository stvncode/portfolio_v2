"use client";

import { useState } from "react";
import { Box } from "../kit/shapes";
import { useInteraction } from "../town-context";

/** Radii of the board's rings, matching the model in `places/rennes.tsx`. */
const BULL = 0.03;
const OUTER_BULL = 0.06;
const TRIPLE: [number, number] = [0.14, 0.18];
const DOUBLE: [number, number] = [0.26, 0.3];
/** How scattered the throws are: most land well inside the board. */
const SPREAD = 0.15;
const DARTS_PER_ROUND = 3;
/** The numbers around a dartboard, clockwise from the top. */
const SECTORS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
const FLIGHTS = ["#e85d4f", "#f2c94c", "#4f8fe8"];

export interface Dart {
  /** Where it landed on the board's face: across and up from the bull. */
  across: number;
  up: number;
  points: number;
  call: string;
}

function gaussian() {
  // Box-Muller: two uniform numbers into one bell-curved one.
  return Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());
}

function throwDart(): Dart {
  const across = gaussian() * SPREAD;
  const up = gaussian() * SPREAD;
  const distance = Math.hypot(across, up);
  const turn = (Math.atan2(across, up) + Math.PI * 2 + Math.PI / 20) % (Math.PI * 2);
  const number = SECTORS[Math.floor(turn / (Math.PI / 10)) % SECTORS.length];
  if (distance < BULL) return { across, up, points: 50, call: "Bullseye!" };
  if (distance < OUTER_BULL) return { across, up, points: 25, call: "Outer bull, 25" };
  if (distance > DOUBLE[1]) return { across, up, points: 0, call: "Off the board" };
  if (distance >= DOUBLE[0]) return { across, up, points: number * 2, call: `Double ${number}` };
  if (distance >= TRIPLE[0] && distance < TRIPLE[1]) return { across, up, points: number * 3, call: `Triple ${number}` };
  return { across, up, points: number, call: `${number}` };
}

function verdict(total: number) {
  if (total >= 100) return "Next round's on me.";
  if (total >= 50) return "Not bad at all.";
  return "The board moved, I saw it.";
}

/** Three darts a round at Le Petit Bar's board. Returns what to draw and what to say. */
export function useDarts(spotId: string) {
  const [darts, setDarts] = useState<Dart[]>([]);

  useInteraction(spotId, () => {
    setDarts((current) => (current.length >= DARTS_PER_ROUND ? [throwDart()] : [...current, throwDart()]));
  });

  const total = darts.reduce((sum, dart) => sum + dart.points, 0);
  const last = darts[darts.length - 1];
  const left = DARTS_PER_ROUND - darts.length;
  let line = "One game? Loser buys the next round.";
  if (last && left > 0) line = `${last.call}. ${left} to go.`;
  if (last && left === 0) line = `${last.call}. That's ${total}. ${verdict(total)}`;

  return {
    darts,
    line,
    keyHint: left === 0 ? "Press Enter or click to play again" : "Press Enter or click to throw",
    touchHint: left === 0 ? "Tap to play again" : "Tap to throw",
  };
}

/** The darts stuck in a board that faces +x, centred on the bull. */
export function ThrownDarts({ darts }: { darts: Dart[] }) {
  return (
    <>
      {darts.map((dart, index) => (
        <group key={`${index}:${dart.across}`} position={[0.1, dart.up, -dart.across]} rotation={[0, 0, (index - 1) * 0.12]}>
          <Box position={[0.07, 0, 0]} size={[0.2, 0.018, 0.018]} color="#d9d9d9" />
          <Box position={[0.2, 0, 0]} size={[0.1, 0.08, 0.012]} color={FLIGHTS[index % FLIGHTS.length]} />
          <Box position={[0.2, 0, 0]} size={[0.1, 0.012, 0.08]} color={FLIGHTS[index % FLIGHTS.length]} />
        </group>
      ))}
    </>
  );
}
