import React from "react";
import GameCard from "../components/GameCard";
import LicsensPlatePic from "../assets/LicensePlate.png";
import MemoryTilesPic from "../assets/MemoryTiles.png";
import QuickMathPic from "../assets/QuickMath.png";

const GamesPage = () => {
  // TODO: link up database to get game info
  return (
    <div className="min-h-[90vh] bg-gray-100">
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <GameCard
          gameId={1}
          title="License Plate Recall"
          image={LicsensPlatePic}
          favorites={0}
        />
        <GameCard
          gameId={2}
          title="Speed Math"
          image={QuickMathPic}
          favorites={0}
        />{" "}
        <GameCard
          gameId={3}
          title="Memory Tiles"
          image={MemoryTilesPic}
          favorites={0}
        />
      </div>
    </div>
  );
};

export default GamesPage;
