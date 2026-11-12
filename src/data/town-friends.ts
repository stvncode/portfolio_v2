export interface TownFriend {
  id: string;
  name: string;
  /** Shown when you walk up to them. */
  line: string;
  /** What they answer when you say hi. */
  reaction: string;
  kind: "person" | "cat";
}

/** The family: not places to tick off, just people (and cats) to say hello to. */
export const TOWN_FRIENDS: TownFriend[] = [
  {
    id: "mathilde",
    name: "Mathilde",
    line: "My wife. We met at Le Petit Bar eight years ago, and I still can't believe my luck.",
    reaction: "Hi! Welcome to the village.",
    kind: "person",
  },
  {
    id: "malo",
    name: "Malo",
    line: "Our son. He's the real boss around here.",
    reaction: "Coucou !",
    kind: "person",
  },
  {
    id: "ponyo",
    name: "Ponyo",
    line: "Our Maine Coon. So beautiful, and fully aware of it.",
    reaction: "Purrr…",
    kind: "cat",
  },
  {
    id: "plume",
    name: "Plume",
    line: "Our black cat. Every moving box belongs to Plume now.",
    reaction: "Mrrp.",
    kind: "cat",
  },
];

export function findTownFriend(id: string | null): TownFriend | undefined {
  return TOWN_FRIENDS.find((friend) => friend.id === id);
}
