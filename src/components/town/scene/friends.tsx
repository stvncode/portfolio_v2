"use client";

import { useEffect, useMemo, useState } from "react";
import { TOWN_FRIENDS, type TownFriend } from "@/data/town-friends";
import { Burst } from "../kit/burst";
import { Cat, PLUME, PONYO } from "../kit/cat";
import { Figure, MALO, MATHILDE, type Watcher } from "../kit/figure";
import { useInteraction } from "../town-context";
import { FRIEND_SPOTS } from "../world-layout";
import { Spot } from "./spot";

/** How long a friend's answer stays in the bubble. */
const REACTION_MS = 2600;

interface FriendModelProps {
  watch: Watcher;
  hello: number;
}

const MODELS: Record<string, { height: number; render: (props: FriendModelProps) => JSX.Element }> = {
  mathilde: { height: 1.8, render: ({ watch, hello }) => <Figure look={MATHILDE} watch={watch} wave={hello} /> },
  malo: { height: 1.1, render: ({ watch, hello }) => <Figure look={MALO} scale={0.6} watch={watch} wave={hello} hops /> },
  ponyo: { height: 1.3, render: ({ watch, hello }) => <Cat look={PONYO} scale={2.1} sitting watch={watch} petted={hello} /> },
  plume: { height: 1.05, render: ({ watch, hello }) => <Cat look={PLUME} scale={1.7} sitting watch={watch} petted={hello} /> },
};

interface FriendProps {
  friend: TownFriend;
  nearby: boolean;
  quiet: boolean;
}

function Friend({ friend, nearby, quiet }: FriendProps) {
  const spot = FRIEND_SPOTS[friend.id];
  const model = MODELS[friend.id];
  const [hello, setHello] = useState(0);
  const [reacting, setReacting] = useState(false);
  const watch = useMemo<Watcher>(() => ({ x: spot.at[0], z: spot.at[2], facing: spot.rotationY }), [spot]);

  useInteraction(friend.id, () => {
    setHello((count) => count + 1);
    setReacting(true);
  });

  useEffect(() => {
    if (!reacting) return;
    const timer = window.setTimeout(() => setReacting(false), REACTION_MS);
    return () => window.clearTimeout(timer);
  }, [reacting, hello]);

  const isCat = friend.kind === "cat";
  return (
    <Spot
      id={friend.id}
      position={spot.at}
      bubbleHeight={model.height + 0.7}
      title={friend.name}
      line={reacting ? friend.reaction : friend.line}
      keyHint={isCat ? "Press Enter or click to pet" : "Press Enter or click to say hi"}
      touchHint={isCat ? "Tap to pet" : "Tap to say hi"}
      nearby={nearby}
      quiet={quiet}
      marker="none"
    >
      <group rotation={[0, spot.rotationY, 0]}>{model.render({ watch, hello })}</group>
      <Burst trigger={hello} kind="hearts" position={[0, model.height, 0]} />
    </Spot>
  );
}

/** The family outside the house: say hi to Mathilde and Malo, pet the cats. */
export function Friends({ nearbyId, quiet }: { nearbyId: string | null; quiet: boolean }) {
  return (
    <>
      {TOWN_FRIENDS.map((friend) => (
        <Friend key={friend.id} friend={friend} nearby={nearbyId === friend.id} quiet={quiet} />
      ))}
    </>
  );
}
