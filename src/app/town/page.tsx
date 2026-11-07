import type { Metadata } from "next";
import { TownLoader } from "@/components/town/town-loader";

export const metadata: Metadata = {
  title: "Town",
  description:
    "Walk around a little Breton village made of the things I love: home, family, films, anime, games and the Open Home Foundation.",
};

export default function TownPage() {
  return (
    <main>
      <h1 className="sr-only">Steven&apos;s town</h1>
      <TownLoader />
    </main>
  );
}
