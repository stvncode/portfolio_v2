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
import { ClickablePlace } from "./clickable-place";
import { Ground } from "./ground";
import { Nature } from "./nature";
import { Player } from "./player";
import { CameraRig, Lighting } from "./rig";

interface SceneProps {
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

export function Scene({ nearbyId, openId, visited }: SceneProps) {
  const town = useTown();

  function place(id: string) {
    return { id, nearby: nearbyId === id, quiet: openId !== null, visited: visited.has(id) };
  }

  return (
    <>
      <Lighting />
      <CameraRig />
      <Ground onWalkTo={town.walkTo} />
      <Nature />
      <Player />

      {/* Home, Val d'Izé */}
      <ClickablePlace {...place("longere")} position={[-6, 0, 15]} bubbleHeight={7.8}>
        <Longere />
      </ClickablePlace>
      <ClickablePlace {...place("penty")} position={[7, 0, 15.4]} bubbleHeight={5.2}>
        <Penty />
      </ClickablePlace>
      <ClickablePlace {...place("pitch")} position={[-4, 0, 31.5]} bubbleHeight={3.2}>
        <Pitch />
      </ClickablePlace>
      <group position={[1.2, 0, 19.2]}>
        <MovingVan />
      </group>
      <group position={[-1.8, 0, 20.4]}>
        <MovingBoxes />
      </group>
      <group position={[-19, 0, 13.6]}>
        <VegetableGarden />
      </group>
      <Figure look={MATHILDE} position={[-9.4, 0, 19.4]} rotation={[0, 0.5, 0]} />
      <Figure look={MALO} position={[-8.5, 0, 19.9]} rotation={[0, 0.2, 0]} scale={0.6} />
      <Cat look={PONYO} position={[-5.2, 0, 18.7]} rotation={[0, 0.6, 0]} scale={2.1} sitting />
      <Cat look={PLUME} position={[-15, 1.42, 12.4]} rotation={[0, Math.PI / 2, 0]} scale={1.7} />

      {/* Rennes, Place des Lices */}
      <ClickablePlace {...place("petit-bar")} position={[-22, 0, -7.5]} bubbleHeight={10.2}>
        <PetitBar />
      </ClickablePlace>
      <group position={[-27.6, 0, -7.8]}>
        <Neighbour plaster="#f3e3c3" timber="#2f5d8a" floors={2} shopColor="#8a3b32" shopName="Crêperie" />
      </group>
      <group position={[-16.4, 0, -7.8]}>
        <Neighbour plaster="#e9d3a8" timber="#7a2f2f" floors={3} shopColor="#3d5a80" shopName="Librairie" />
      </group>
      <ClickablePlace {...place("kiosk")} position={[-14, 0, -0.6]} bubbleHeight={4.6}>
        <Kiosk />
      </ClickablePlace>
      <group position={[-26.5, 0, -1.6]}>
        <MarketStall produce={["#e85d4f", "#f2c94c", "#7fb069"]} />
      </group>
      <group position={[-18.2, 0, -1.4]} rotation={[0, -0.15, 0]}>
        <MarketStall produce={["#f29b38", "#7d5ba6", "#e9dcc6"]} />
      </group>
      <Lamp position={[-24.5, 0, -3.6]} lit />
      <Lamp position={[-12.6, 0, -4.4]} lit />

      {/* Open Home Foundation */}
      <ClickablePlace {...place("device-database")} position={[-10, 0, -19.5]} bubbleHeight={6.4}>
        <DeviceLibrary />
      </ClickablePlace>
      <ClickablePlace {...place("home-assistant")} position={[-1, 0, -20]} bubbleHeight={8.2}>
        <HomeAssistantHall />
      </ClickablePlace>
      <ClickablePlace {...place("music-assistant")} position={[8, 0, -19]} bubbleHeight={5.6}>
        <RecordShop />
      </ClickablePlace>
      <ClickablePlace {...place("esphome")} position={[15.5, 0, -18.5]} bubbleHeight={5.4}>
        <EsphomeWorkshop />
      </ClickablePlace>
      <Lamp position={[-5.4, 0, -12.2]} lit />
      <Lamp position={[11.8, 0, -12.2]} lit />

      {/* Countryside */}
      <ClickablePlace {...place("cinema")} position={[21, 0, -1.6]} bubbleHeight={7.4}>
        <OpenAirCinema />
      </ClickablePlace>
      <ClickablePlace {...place("glade")} position={[20, 0, 19]} bubbleHeight={3.6}>
        <BroceliandeGlade />
      </ClickablePlace>

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
