import { useState, useEffect } from 'react';
import { useAuth } from "../../AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";


const TileGame = ({gameId}) => {
  // --- STATE ---
  const { isAuthenticated, user } = useAuth();
  const [pattern, setPattern] = useState([]);      // The correct path (e.g., [0, 4, 8])
  const [userIndex, setUserIndex] = useState(0);   // Which step of the pattern the user is on
  const [gameState, setGameState] = useState('idle'); // 'idle', 'computerTurn', 'playerTurn', 'gameOver'
  const [activeTile, setActiveTile] = useState(null); // The ID of the tile currently lit up
  const [flashColor, setFlashColor] = useState('btn-primary'); // Color to flash (blue for normal, red for error)

  // --- HELPERS ---
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // --- GAME LOGIC: Computer's Turn ---
  useEffect(() => {
    if (gameState === 'computerTurn') {
      const runComputerTurn = async () => {
        // 1. Add new random tile (0-8) to pattern
        const nextTile = Math.floor(Math.random() * 9);
        const newPattern = [...pattern, nextTile];
        setPattern(newPattern);

        // 2. Play the sequence
        await delay(600); // Small pause before computer starts
        for (const tileId of newPattern) {
          setFlashColor('btn-primary'); // Ensure color is blue
          setActiveTile(tileId);        // Light it up
          await delay(400);             // Wait
          setActiveTile(null);          // Turn it off
          await delay(200);             // Gap between tiles
        }

        // 3. Handover to player
        setUserIndex(0); // Reset user tracking to the first step
        setGameState('playerTurn');
      };

      runComputerTurn();
    }
  }, [gameState]);

  useEffect(()=>{
   if(gameState === 'gameOver'){
      saveGameStats();
   }

  }, [gameState]);

  const saveGameStats = async()=>{
    if(!isAuthenticated) return;

  const roundsCompleted = Math.max(0, pattern.length - 1);
    const finalScore = roundsCompleted * 10;

    const payload = {
      gameId: gameId,
      score: finalScore,
      accuracy: null,  
      timeTaken: null, //  don't track time for this one
      datePlayed: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${API_BASE}/api/user-game-stats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        console.log("Memory Game stats saved:", json);
        window.dispatchEvent(new CustomEvent("user:stats:updated", { detail: json }));
      }
    } catch (err) {
      console.error("Error saving memory game stats:", err);
    }
  };

  // --- GAME LOGIC: Player's Turn ---
  const handleTileClick = async (clickedTileId) => {
    // Prevent clicking if not player's turn
    if (gameState !== 'playerTurn') return;

    // 1. Flash the tile the user just clicked (visual feedback)
    setActiveTile(clickedTileId);
    setTimeout(() => setActiveTile(null), 200);

    // 2. CHECK LOGIC: Did they click the correct tile for this step?
    const correctTileId = pattern[userIndex];

    if (clickedTileId === correctTileId) {
      // --- CORRECT ---
      const nextIndex = userIndex + 1;
      
      if (nextIndex === pattern.length) {
        // User finished the whole sequence! 
        setGameState('computerTurn'); // Trigger next round
      } else {
        // User got this one right, waiting for next click in sequence
        setUserIndex(nextIndex);
      }
    } else {
      // --- WRONG ---
      setFlashColor('btn-error'); // Switch flash color to Red
      setActiveTile(clickedTileId); // Light up the wrong tile red
      setGameState('gameOver');
    }
  };

  const startGame = () => {
    setPattern([]);
    setGameState('computerTurn');
    setFlashColor('btn-primary');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 gap-8">
      
      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Memory Grid</h1>
        <p className="text-lg">
          {gameState === 'gameOver' && <span className="text-error font-bold">Wrong Tile! Game Over.</span>}
          {gameState === 'playerTurn' && <span className="text-primary">Your Turn: Copy the pattern</span>}
          {gameState === 'computerTurn' && <span className="text-neutral-content">Watch the pattern...</span>}
          {gameState === 'idle' && "Press Start to play"}
        </p>
        <div className="badge badge-lg mt-2">Score: {pattern.length > 0 ? pattern.length - 1 : 0}</div>
      </div>

      {/* 3x3 GRID */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-base-100 rounded-box shadow-xl">
        {[...Array(9)].map((_, i) => (
          <button
            key={i}
            onClick={() => handleTileClick(i)}
            
            className={`
              btn btn-square btn-xl w-24 h-24 text-2xl
              transition-all duration-100
              ${activeTile === i ? flashColor : 'btn-neutral'}
              ${gameState !== 'playerTurn' ? 'pointer-events-none' : ''}
            `}
          >
          
          </button>
        ))}
      </div>

      {/* CONTROLS */}
      {(gameState === 'idle' || gameState === 'gameOver') && (
        <button className="btn btn-wide btn-primary" onClick={startGame}>
          {gameState === 'gameOver' ? 'Try Again' : 'Start Game'}
        </button>
      )}
    </div>
  );
};

export default TileGame;