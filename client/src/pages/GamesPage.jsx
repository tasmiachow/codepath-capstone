import React from "react";
import GameCard from "../components/GameCard";

const GamesPage = () => {
  // TODO: link up database to get game info
  return (
    <div className="GamesPage">
      <div className="container">
        <GameCard gameId={1} title="TEMP: License Plate Guesser" favorites={0} />
        <GameCard gameId={2} title="TEMP: Speed Math" favorites={1} />
        <GameCard gameId={3} title="TEMP: Memory Tiles" favorites={2} />
      </div>
    </div>
  );
};

export default GamesPage;
