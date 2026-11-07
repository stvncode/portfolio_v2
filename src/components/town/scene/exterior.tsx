"use client";

import { Cat, PLUME, PONYO } from "../kit/cat";
import { Figure, MALO, MATHILDE } from "../kit/figure";
import { Bench, Lamp } from "../kit/lamp";
import { OpenAirCinema } from "../places/cinema";
import { BroceliandeGlade, Pitch, Signpost, Well } from "../places/countryside";
import { Longere } from "../places/longere";
import { DeviceLibrary, EsphomeWorkshop, HomeAssistantHall, RecordShop } from "../places/ohf";
import { MovingBoxes, MovingVan, Penty, VegetableGarden } from "../places/penty";
import { Kiosk, MarketStall, Neighbour, PetitBar } from "../places/rennes";
import { useTown } from "../town-context";
import { findTownPlace } from "@/data/town";
import { Spot } from "./spot";
import { Ground } from "./ground";
import { GardenFence, Mailbox, VillageLife } from "./life";
import { Nature } from "./nature";

interface ExteriorProps {
  nearbyId: string | null;
  openId: string | null;
  visited: Set<string>;
}

const SIGNPOST_ARROWS = [
  { label: "Rennes", angle: Math.PI * 0.75 },
  { label: "Val d'Izé", angle: -Math.PI * 0.4 },
  { label: "Cinéma", angle: -Math.PI * 0.05 },
  { label: "OHF", angle: Math.PI * 0.45 },
];

/** The village: every place, the people, the paths and the fields. */
export function Exterior({ nearbyId, openId, visited }: ExteriorProps) {
  const town = useTown();

  function place(id: string) {
    const data = findTownPlace(id);
    return {
      id,
      title: data?.name ?? id,
      line: data?.bubble ?? "",
      keyHint: "Press Enter or click to visit",
      touchHint: "Tap to visit",
      nearby: nearbyId === id,
      quiet: openId !== null,
      marker: visited.has(id) ? ("visited" as const) : ("new" as const),
    };
  }

  return (
    <>
      <Ground onWalkTo={town.walkTo} />
      <Nature />

      {/* Home, Val d'Izé */}
      <Spot {...place("longere")} position={[-6, 0, 15]} bubbleHeight={7.8}>
        <Longere />
      </Spot>
      <Spot {...place("penty")} position={[7, 0, 15.4]} bubbleHeight={5.2}>
        <Penty />
      </Spot>
      <Spot {...place("pitch")} position={[-4, 0, 31.5]} bubbleHeight={3.2}>
        <Pitch />
      </Spot>
      <group position={[1.2, 0, 19.2]}>
        <MovingVan />
      </group>
      <group position={[-1.8, 0, 20.4]}>
        <MovingBoxes />
      </group>
      <group position={[-19, 0, 13.6]}>
        <VegetableGarden />
        <GardenFence width={5} depth={4.4} />
      </group>
      <group position={[-12.6, 0, 20.4]}>
        <Mailbox />
      </group>
      <VillageLife />
      <Figure look={MATHILDE} position={[-9.4, 0, 19.4]} rotation={[0, 0.5, 0]} />
      <Figure look={MALO} position={[-8.5, 0, 19.9]} rotation={[0, 0.2, 0]} scale={0.6} />
      <Cat look={PONYO} position={[-5.2, 0, 18.7]} rotation={[0, 0.6, 0]} scale={2.1} sitting />
      <Cat look={PLUME} position={[-15, 1.42, 12.4]} rotation={[0, Math.PI / 2, 0]} scale={1.7} />

      {/* Rennes, Place des Lices */}
      <Spot {...place("petit-bar")} position={[-22, 0, -7.5]} bubbleHeight={10.2}>
        <PetitBar />
      </Spot>
      <group position={[-27.6, 0, -7.8]}>
        <Neighbour plaster="#f3e3c3" timber="#2f5d8a" floors={2} shopColor="#8a3b32" shopName="Crêperie" />
      </group>
      <group position={[-16.4, 0, -7.8]}>
        <Neighbour plaster="#e9d3a8" timber="#7a2f2f" floors={3} shopColor="#3d5a80" shopName="Librairie" />
      </group>
      <Spot {...place("kiosk")} position={[-14, 0, -0.6]} bubbleHeight={4.6}>
        <Kiosk />
      </Spot>
      <group position={[-26.5, 0, -1.6]}>
        <MarketStall produce={["#e85d4f", "#f2c94c", "#7fb069"]} />
      </group>
      <group position={[-18.2, 0, -1.4]} rotation={[0, -0.15, 0]}>
        <MarketStall produce={["#f29b38", "#7d5ba6", "#e9dcc6"]} />
      </group>
      <Lamp position={[-24.5, 0, -3.6]} lit />
      <Lamp position={[-12.6, 0, -4.4]} lit />

      {/* Open Home Foundation */}
      <Spot {...place("device-database")} position={[-10, 0, -19.5]} bubbleHeight={6.4}>
        <DeviceLibrary />
      </Spot>
      <Spot {...place("home-assistant")} position={[-1, 0, -20]} bubbleHeight={8.2}>
        <HomeAssistantHall />
      </Spot>
      <Spot {...place("music-assistant")} position={[8, 0, -19]} bubbleHeight={5.6}>
        <RecordShop />
      </Spot>
      <Spot {...place("esphome")} position={[15.5, 0, -18.5]} bubbleHeight={5.4}>
        <EsphomeWorkshop />
      </Spot>
      <Lamp position={[-5.4, 0, -12.2]} lit />
      <Lamp position={[11.8, 0, -12.2]} lit />

      {/* Countryside */}
      <Spot {...place("cinema")} position={[21, 0, -1.6]} bubbleHeight={7.4}>
        <OpenAirCinema />
      </Spot>
      <Spot {...place("glade")} position={[20, 0, 19]} bubbleHeight={3.6}>
        <BroceliandeGlade />
      </Spot>

      {/* The village green */}
      <group position={[0, 0, 1]}>
        <Well />
      </group>
      <group position={[4, 0, 7.4]}>
        <Signpost arrows={SIGNPOST_ARROWS} />
      </group>
      <Bench position={[-2.6, 0, -0.6]} rotationY={0.4} />
      <Bench position={[2.8, 0, -0.8]} rotationY={-0.5} />
      <Lamp position={[-6, 0, 7]} />
      <Lamp position={[9, 0, 3]} />
      <Lamp position={[-0.4, 0, 18.4]} lit />
    </>
  );
}
