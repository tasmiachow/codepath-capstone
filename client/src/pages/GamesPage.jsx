import React from "react";
import GameCard from "../components/GameCard";

const GamesPage = () => {
  // TODO: link up database to get game info
  return (
    <div className="GamesPage">
      <div className="container">
        <GameCard gameId={1} title="TEMP: License Plate Guesser" favorites={0} />
      </div>
    </div>
  );
};

export default GamesPage;
