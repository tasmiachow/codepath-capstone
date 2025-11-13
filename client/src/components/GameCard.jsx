import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function GameCard({ gameId, title, image, favorites }) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const onFavoritePress = () => {
    if (!isAuthenticated) {
      // send user to login if not authenticated
      navigate("/login");
      return;
    }

    try {
      // TODO: call backend to toggle favorite
      // await fetch(`/api/games/${gameId}/favorite`, { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }});
      console.log("toggle favorite for game", gameId);
    } catch (err) {
      console.error("favorite toggle error", err);
    }
  };

  return (
    <div className="card card-compact w-64 bg-base-100 shadow">
      <figure className="h-40 overflow-hidden">
        <img
          src={image}
          alt={`${title} cover`}
          className="w-full object-cover"
        />
      </figure>
      <div className="card-body bg-base-300 rounded-b">
        <h2 className="card-title text-lg">{title}</h2>

        <div className="card-actions justify-between items-center">
          <Link
            to={`/games/${gameId}`}
            state={{ gameId }}
            className="btn btn-primary btn-sm"
            aria-label={`Play ${title}`}
            role="button"
          >
            Play
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={onFavoritePress}
              className="btn btn-ghost btn-sm"
              aria-label={
                isAuthenticated ? "Toggle favorite" : "Login to favorite"
              }
              title={isAuthenticated ? "Toggle favorite" : "Login to favorite"}
            >
              {/* simple heart icon using emoji for now */}
              <span aria-hidden="true">❤️</span>
            </button>
            <span className="text-sm text-muted">{favorites}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameCard;
