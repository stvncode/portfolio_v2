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
  /** A closing line under the list. */
  outro?: string;
  links?: TownLink[];
  /** You can step inside this one. */
  enterable?: boolean;
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
    bubble: "Home, or almost. Come in, and mind the cats.",
    area: "home",
    entrance: [-6, 18.6],
    enterable: true,
    paragraphs: [
      "This is the house we're about to move into: an old stone longère in Val d'Izé, a small village near Rennes. Long, narrow, calm, and already full of plans.",
      "But a house is really about who's inside. Mathilde, Malo, Plume and Ponyo are waiting in there. Step in and say hi.",
    ],
  },
  {
    id: "penty",
    name: "The Penty",
    bubble: "The little stone cottage where I play video games.",
    area: "home",
    entrance: [7, 18.4],
    enterable: true,
    paragraphs: [
      "Next to most longères you'll find a penty, a tiny stone cottage. Ours is where I play video games: a chair, a screen, and the promise of just one more game.",
    ],
  },
  {
    id: "pitch",
    name: "The Pitch",
    bubble: "Football, but with rocket cars. Yes, really.",
    area: "home",
    entrance: [-3, 26],
    paragraphs: [
      "Rocket League is football played with rocket-powered cars. It makes no sense on paper, and it's one of the most joyful games I know.",
      "There's always room for one more car on the pitch.",
    ],
  },
  {
    id: "petit-bar",
    name: "Le Petit Bar",
    bubble: "Place des Lices, Rennes. Where my story with Mathilde began.",
    area: "rennes",
    entrance: [-22, -3.2],
    enterable: true,
    paragraphs: [
      "Eight years ago, in this little bar on Place des Lices, I met Mathilde. Everything good that came after started that evening.",
      "I still love a good bar, less for the noise than for the people, the conversations that run a bit too late, and a game of darts if anyone's up for it.",
    ],
  },
  {
    id: "kiosk",
    name: "The Kiosk",
    bubble: "Stories I keep coming back to.",
    area: "rennes",
    entrance: [-13.4, 1.6],
    paragraphs: [
      "Anime has a way of catching me off guard: a quiet scene about kindness, a goodbye, a long journey that changes someone. These are the stories that stayed with me.",
    ],
    list: {
      title: "On the shelf",
      items: [
        "Frieren: Beyond Journey's End",
        "Hunter x Hunter",
        "Solo Leveling",
        "Wistoria: Wand and Sword",
        "Hell's Paradise",
        "Death Note",
      ],
    },
    outro: "Got one I should watch next? I'm all ears.",
  },
  {
    id: "cinema",
    name: "Open-Air Cinema",
    bubble: "Films under the stars. Bring a blanket.",
    area: "countryside",
    entrance: [19, 4.5],
    paragraphs: [
      "Some films stay with you long after the credits. These six did, each in its own way: they're about people trying, failing, and caring for each other anyway.",
    ],
    list: {
      title: "Tonight's programme",
      items: [
        "Good Will Hunting",
        "What's Eating Gilbert Grape",
        "Requiem for a Dream",
        "Princess Mononoke",
        "The Big Lebowski",
        "Captain Fantastic",
      ],
    },
    outro: "Visit every place in the village and the evening show will start.",
  },
  {
    id: "glade",
    name: "Brocéliande Glade",
    bubble: "A sword in a stone, a chest in the grass.",
    area: "countryside",
    entrance: [19, 20.5],
    paragraphs: [
      "Long before any other game, there was Zelda. It's where I learned to love exploring: the quiet, the curiosity, the feeling that something good is waiting over the next hill.",
      "Brittany has its own legendary forest, Brocéliande, not far from here. It felt like the right home for a sword in a stone.",
    ],
  },
  {
    id: "home-assistant",
    name: "Home Assistant",
    bubble: "My work, and a community I'm proud to be part of.",
    area: "ohf",
    entrance: [-1, -15.6],
    paragraphs: [
      "I work at the Open Home Foundation, building interfaces for its open-source projects. Home Assistant is the heart of it: a smart home that runs locally, respects your privacy and belongs to you.",
      "What I love most is the community: so many people building it together, and being kind to each other while they do.",
    ],
    links: [
      { label: "Home Assistant", href: "https://www.home-assistant.io" },
      { label: "Open Home Foundation", href: "https://www.openhomefoundation.org" },
    ],
  },
  {
    id: "music-assistant",
    name: "Music Assistant Records",
    bubble: "All your music, every speaker, one place.",
    area: "ohf",
    entrance: [8, -15.2],
    paragraphs: [
      "Music Assistant brings your streaming services and your own collection together, and plays them on any speaker at home.",
      "I work on how it looks and feels, and I try to make every screen a little more welcoming than the last.",
    ],
    links: [{ label: "Music Assistant", href: "https://www.music-assistant.io" }],
  },
  {
    id: "esphome",
    name: "ESPHome Workshop",
    bubble: "Where little boards learn to talk to your home.",
    area: "ohf",
    entrance: [15.5, -14.6],
    paragraphs: [
      "I've always loved electronics: a few wires, a tiny board, and suddenly something you made blinks back at you.",
      "ESPHome makes that magic easy, turning a small microcontroller into a smart-home device with a few lines of configuration.",
    ],
    links: [{ label: "ESPHome", href: "https://esphome.io" }],
  },
  {
    id: "device-database",
    name: "Device Database",
    bubble: "Every device, carefully labelled.",
    area: "ohf",
    entrance: [-10, -15.4],
    paragraphs: [
      "Choosing smart-home devices shouldn't feel like a gamble. The Device Database is a shared catalogue of devices, built so the next person can choose with confidence. I help build its interface.",
    ],
  },
];

export const TOWN_PLACE_IDS = TOWN_PLACES.map((place) => place.id);

export function findTownPlace(id: string | null): TownPlace | undefined {
  return TOWN_PLACES.find((place) => place.id === id);
}
