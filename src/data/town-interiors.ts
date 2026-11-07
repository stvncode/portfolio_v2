export interface InteriorSpot {
  id: string;
  name: string;
  line: string;
}

export interface TownInterior {
  /** The place this is the inside of. */
  placeId: string;
  name: string;
  spots: InteriorSpot[];
}

export const EXIT_SPOT = "exit";

const EXIT: InteriorSpot = { id: EXIT_SPOT, name: "The door", line: "Back outside." };

export const TOWN_INTERIORS: Record<string, TownInterior> = {
  longere: {
    placeId: "longere",
    name: "Inside La Longère",
    spots: [
      EXIT,
      {
        id: "fireplace",
        name: "The fireplace",
        line: "Every longère has a big granite fireplace. This one is waiting for its first winter with us.",
      },
      {
        id: "table",
        name: "The kitchen table",
        line: "Where the days start and end, all of us around the same table.",
      },
      {
        id: "malo",
        name: "Malo's corner",
        line: "The tidiest it will ever be.",
      },
      {
        id: "cats",
        name: "The cat tower",
        line: "Plume and Ponyo pretend to share it.",
      },
      {
        id: "boxes",
        name: "Moving boxes",
        line: "Still unpacking. Some of these won't be opened until next year.",
      },
    ],
  },
  penty: {
    placeId: "penty",
    name: "Inside the Penty",
    spots: [
      EXIT,
      {
        id: "desk",
        name: "The desk",
        line: "Rocket League and League of Legends evenings start here.",
      },
      {
        id: "couch",
        name: "The couch",
        line: "For the games you play side by side, and for Zelda, always.",
      },
      {
        id: "shelf",
        name: "The shelf",
        line: "A few favourites, kept close.",
      },
    ],
  },
  "petit-bar": {
    placeId: "petit-bar",
    name: "Inside Le Petit Bar",
    spots: [
      EXIT,
      {
        id: "counter",
        name: "The counter",
        line: "Somewhere around here, eight years ago, I said hello to Mathilde.",
      },
      {
        id: "darts",
        name: "The dartboard",
        line: "One game? Loser buys the next round.",
      },
    ],
  },
};

export function findInteriorSpot(placeId: string, spotId: string): InteriorSpot | undefined {
  return TOWN_INTERIORS[placeId]?.spots.find((spot) => spot.id === spotId);
}
