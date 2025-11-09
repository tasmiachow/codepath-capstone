import { Link } from "react-router-dom";

function GameCard({ gameId, title, image, favorites }) {
    const onFavoritePress = () => {
        /* TODO */
    };

    return (
        <div className="GameCard">
            <img src={image} />
            <h2>{title}</h2>
            <div className="bottom-container">
                <Link to={`/games/${gameId}`} role="button">Play</Link>
                <button onClick={onFavoritePress}>
                    <img src="TODO:fav-icon" />
                    <span>{favorites}</span>
                </button>
            </div>
        </div>
    );
}

export default GameCard;