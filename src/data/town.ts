export type TownArea = "home" | "rennes" | "ohf" | "countryside";

export interface TownLink {
  label: string;
  href: string;
}

export interface TownList {
  title: string;
  items: string[];
}

export interface TownPlace {
  id: string;
  name: string;
  /** One line shown in the speech bubble when you walk up to it. */
  bubble: string;
  area: TownArea;
  /** Where the player stands to visit it, as world x and z. */
  entrance: [number, number];
  paragraphs: string[];
  list?: TownList;
  links?: TownLink[];
}

export const TOWN_AREAS: Record<TownArea, string> = {
  home: "Val d'Izé · Home",
  rennes: "Rennes · Place des Lices",
  ohf: "Open Home Foundation",
  countryside: "Around the village",
};

export const TOWN_PLACES: TownPlace[] = [
  {
    id: "longere",
    name: "La Longère",
    bubble: "Home: a long stone farmhouse in Val d'Izé. Mind the cats.",
    area: "home",
    entrance: [-6, 18.6],
    paragraphs: [
      "This is home, or it will be very soon: a longère, the long and narrow stone farmhouse you find all over the Breton countryside. Ours is in Val d'Izé, a village near Rennes.",
      "We're moving in soon, so for now it's mostly boxes. The inside gets done properly once we're settled.",
    ],
    list: {
      title: "Who lives here",
      items: [
        "Mathilde, my wife",
        "Malo, our son",
        "Plume, the black cat",
        "Ponyo, the Maine Coon (so beautiful)",
      ],
    },
  },
  {
    id: "penty",
    name: "The Penty",
    bubble: "The little stone outbuilding where the PC lives.",
    area: "home",
    entrance: [7, 18.4],
    paragraphs: [
      "Next to the house there's a penty, the Breton word for a small stone cottage. This one is the gaming room.",
      "That's where League of Legends happens.",
    ],
  },
  {
    id: "pitch",
    name: "The Pitch",
    bubble: "Football, but the players are rocket-powered cars.",
    area: "home",
    entrance: [-3, 26],
    paragraphs: [
      "Rocket League: football played with rocket-powered cars. It's one of my games, so it gets a field behind the house.",
    ],
  },
  {
    id: "petit-bar",
    name: "Le Petit Bar",
    bubble: "Place des Lices, Rennes. Where I met Mathilde.",
    area: "rennes",
    entrance: [-22, -3.2],
    paragraphs: [
      "I love going to bars, and this one matters more than any other. Le Petit Bar, on Place des Lices in Rennes, is where I met Mathilde, 8 years ago.",
      "In this town it also has a dartboard on the wall, because I love darts.",
    ],
  },
  {
    id: "kiosk",
    name: "The Kiosk",
    bubble: "Anime and manga. Frieren is number one.",
    area: "rennes",
    entrance: [-13.4, 1.6],
    paragraphs: ["I watch a lot of anime. Here's the shelf, in order."],
    list: {
      title: "My top anime",
      items: [
        "Frieren: Beyond Journey's End (number one, by far)",
        "Hunter x Hunter",
        "Solo Leveling",
        "Wistoria: Wand and Sword",
        "Hell's Paradise",
        "Death Note",
      ],
    },
  },
  {
    id: "cinema",
    name: "Open-Air Cinema",
    bubble: "A screen in a field. I've watched a lot of movies.",
    area: "countryside",
    entrance: [19, 4.5],
    paragraphs: [
      "I've watched a lot of movies, and a screen in a field felt right for the countryside.",
      "Visit every place in town and the evening show starts.",
    ],
    list: {
      title: "Six I love",
      items: [
        "Good Will Hunting",
        "What's Eating Gilbert Grape",
        "Requiem for a Dream",
        "Princess Mononoke",
        "The Big Lebowski",
        "Captain Fantastic",
      ],
    },
  },
  {
    id: "glade",
    name: "Brocéliande Glade",
    bubble: "A sword in a stone, a chest in the grass. Zelda first, always.",
    area: "countryside",
    entrance: [19, 20.5],
    paragraphs: [
      "Before Rocket League and League of Legends, there was Zelda. I'm a big, big Zelda fan.",
      "Brittany has its own legendary forest, Brocéliande, not far from Rennes. A sword in a stone in a quiet glade felt like the right way to bring the two together.",
    ],
  },
  {
    id: "home-assistant",
    name: "Home Assistant",
    bubble: "The Open Home Foundation, where my days go.",
    area: "ohf",
    entrance: [-1, -15.6],
    paragraphs: [
      "I'm a software engineer at the Open Home Foundation, building interfaces for its projects.",
      "Home Assistant is the big one: open-source home automation that puts local control and privacy first.",
    ],
    links: [
      { label: "Home Assistant", href: "https://www.home-assistant.io" },
      {
        label: "Open Home Foundation",
        href: "https://www.openhomefoundation.org",
      },
    ],
  },
  {
    id: "music-assistant",
    name: "Music Assistant Records",
    bubble: "Every music source, every speaker, one library.",
    area: "ohf",
    entrance: [8, -15.2],
    paragraphs: [
      "Music Assistant brings your streaming services and your own files into one library, and plays them on any speaker in the house.",
      "I work on its frontend, so this shop is close to my heart.",
    ],
    links: [{ label: "Music Assistant", href: "https://www.music-assistant.io" }],
  },
  {
    id: "esphome",
    name: "ESPHome Workshop",
    bubble: "Solder, flash, blink. I love electronics.",
    area: "ohf",
    entrance: [15.5, -14.6],
    paragraphs: [
      "I love electronics: boards, sensors, LEDs, and the moment something you built blinks for the first time.",
      "ESPHome turns a tiny microcontroller into a smart-home device from a few lines of YAML, which makes this the right workshop for it.",
    ],
    links: [{ label: "ESPHome", href: "https://esphome.io" }],
  },
  {
    id: "device-database",
    name: "Device Database",
    bubble: "Every device, labelled and on the shelf.",
    area: "ohf",
    entrance: [-10, -15.4],
    paragraphs: [
      "The Device Database is the Open Home Foundation's catalogue of smart-home devices. Another project I build the interface for.",
    ],
  },
];

export const TOWN_PLACE_IDS = TOWN_PLACES.map((place) => place.id);

export function findTownPlace(id: string | null): TownPlace | undefined {
  return TOWN_PLACES.find((place) => place.id === id);
}
