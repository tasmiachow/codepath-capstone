import React from "react";
import GameCard from "../components/GameCard";

const GamesPage = () => {
  // TODO: link up database to get game info
  return (
    <div className="min-h-[90vh] bg-gray-100">
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <GameCard
          gameId={1}
          title="TEMP: License Plate Guesser"
          favorites={0}
        />
        <GameCard
          gameId={1}
          title="TEMP: License Plate Guesser"
          favorites={0}
        />{" "}
        <GameCard
          gameId={1}
          title="TEMP: License Plate Guesser"
          favorites={0}
        />
        <GameCard
          gameId={1}
          title="TEMP: License Plate Guesser"
          favorites={0}
        />{" "}
        <GameCard
          gameId={1}
          title="TEMP: License Plate Guesser"
          favorites={0}
        />{" "}
        <GameCard
          gameId={1}
          title="TEMP: License Plate Guesser"
          favorites={0}
        />{" "}
        <GameCard
          gameId={1}
          title="TEMP: License Plate Guesser"
          favorites={0}
        />{" "}
        <GameCard
          gameId={1}
          title="TEMP: License Plate Guesser"
          favorites={0}
        />
      </div>
    </div>
  );
};

export default GamesPage;
