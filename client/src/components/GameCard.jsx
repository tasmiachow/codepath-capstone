import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

function GameCard({ gameId, title, image, favorites }) {
  const { isAuthenticated, user } = useAuth();

  const onFavoritePress = () => {
    /* TODO: Send request to database to toggle favorite on/off */
    // Verify logged-in
  };

  return (
    <div className="GameCard">
      <img src={image} />
      <h2>{title}</h2>
      <div className="bottom-container">
        <Link to={`/games/${gameId}`} role="button">Play</Link>
        {(isAuthenticated && (
          <button onClick={onFavoritePress}>
            <img src="TODO:fav-icon" />
            <span>{favorites}</span>
          </button>)
        )}
      </div>
    </div>
  );
}

export default GameCard;