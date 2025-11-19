import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext.jsx"; 

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

const KNOWN_GAMES = [
  { id: 1, name: "License Plate Recall" },
  { id: 2, name: "Speed Math" },
  { id: 3, name: "Memory Tiles" },
];

const UserGoals = () => {
  const { isAuthenticated } = useAuth();
  
  // --- STATE ---
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterGameId, setFilterGameId] = useState("ALL"); 
  
  // Form State
  const [statValue, setStatValue] = useState(""); // Maps to DB: stat_value
  const [statName, setStatName] = useState("");   // Maps to DB: stat_name
  const [selectedGameId, setSelectedGameId] = useState(KNOWN_GAMES[0].id); // Maps to DB: game_id
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // --- FETCH DATA ---
  useEffect(() => {
    if (isAuthenticated) {
      fetchGoals();
    }
  }, [isAuthenticated]);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/user-goals`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        const rawData = await res.json();
        
        // STRICT MAPPING: DB (snake_case) -> Frontend (camelCase)
        const formattedGoals = rawData.map(row => ({
            id: row.goal_id,          
            gameId: row.game_id,      
            statName: row.stat_name,   
            statValue: row.stat_value 
        }));
        setGoals(formattedGoals);
      }
    } catch (err) {
      console.error("Failed to fetch goals", err);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---

  const handleAddGoal = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      // STRICT PAYLOAD: Matches your CREATE TABLE schema exactly
      const payload = {
        game_id: Number(selectedGameId),
        stat_name: statName.trim(), 
        stat_value: Number(statValue)
      };

      const res = await fetch(`${API_BASE}/api/user-goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const rawGoal = await res.json();
        
        // Add new goal to list using same strict mapping
        const newGoal = {
            id: rawGoal.goal_id,
            gameId: rawGoal.game_id,
            statName: rawGoal.stat_name,
            statValue: rawGoal.stat_value
        };

        setGoals((prev) => [newGoal, ...prev]); 
        
        // Reset Form
        setStatName("");
        setStatValue("");
      } else if (res.status === 409) {
        setErrorMsg("You already have a goal with this name for this game.");
      } else {
        setErrorMsg("Error saving goal.");
      }
    } catch (err) {
      console.error("Error adding goal", err);
      setErrorMsg("Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (goalId) => {
    // Optimistic delete
    const prevGoals = [...goals];
    setGoals((prev) => prev.filter((g) => g.id !== goalId));

    try {
      const res = await fetch(`${API_BASE}/api/user-goals/${goalId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
    } catch (err) {
      // Revert on error
      setGoals(prevGoals);
      console.error("Error deleting goal", err);
    }
  };

  // --- FILTER LOGIC ---
  const filteredGoals = filterGameId === "ALL"
    ? goals
    : goals.filter((g) => Number(g.gameId) === Number(filterGameId));

  const getGameName = (id) => KNOWN_GAMES.find(g => g.id === id)?.name || "Unknown Game";

  if (!isAuthenticated) return <div className="p-10 text-center">Please log in to view goals.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Goals</h1>
        
        {/* FILTER DROPDOWN */}
        <div className="form-control w-full max-w-xs mt-4 md:mt-0">
          <label className="label">
            <span className="label-text">Filter by Game</span>
          </label>
          <select 
            className="select select-bordered"
            value={filterGameId}
            onChange={(e) => setFilterGameId(e.target.value)}
          >
            <option value="ALL">All Games</option>
            {KNOWN_GAMES.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* --- CREATE GOAL FORM --- */}
      <div className="card bg-base-200 shadow-xl mb-10">
        <div className="card-body">
          <h2 className="card-title text-lg opacity-75">Create Goal</h2>
          
          {errorMsg && <div className="alert alert-error text-sm mb-2">{errorMsg}</div>}

          <form onSubmit={handleAddGoal} className="flex flex-col md:flex-row gap-4 items-end">
            
            {/* Game Select */}
            <div className="form-control w-full md:w-1/4">
              <label className="label"><span className="label-text">Game</span></label>
              <select 
                className="select select-bordered w-full"
                value={selectedGameId}
                onChange={(e) => setSelectedGameId(e.target.value)}
              >
                {KNOWN_GAMES.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            {/* Stat Value (Target Score) */}
            <div className="form-control w-full md:w-1/4">
              <label className="label"><span className="label-text">Target Value</span></label>
              <input 
                type="number" 
                placeholder="e.g. 100" 
                className="input input-bordered w-full"
                value={statValue}
                onChange={(e) => setStatValue(e.target.value)}
                required
              />
            </div>

            {/* Stat Name (Constraint: VARCHAR(20)) */}
            <div className="form-control w-full md:w-2/4">
              <label className="label"><span className="label-text">Stat Name (Max 20)</span></label>
              <input 
                type="text" 
                placeholder="e.g. High Score" 
                className="input input-bordered w-full"
                value={statName}
                maxLength={20} 
                onChange={(e) => setStatName(e.target.value)}
                required
              />
            </div>

            {/* Submit */}
            <button 
              type="submit" 
              className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              Add
            </button>
          </form>
        </div>
      </div>

      {/* --- GOALS LIST --- */}
      {loading ? (
        <div className="flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>
      ) : filteredGoals.length === 0 ? (
        <div className="text-center py-10 bg-base-100 border-2 border-dashed border-base-300 rounded-box">
          <p className="opacity-50">No goals set for this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGoals.map((goal) => (
            <div key={goal.id} className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body flex-row items-center justify-between py-4 px-6">
                
                {/* Goal Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-ghost">
                      {getGameName(goal.gameId)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">
                    {goal.statValue}
                  </h3>
                  <p className="text-sm opacity-70 uppercase font-semibold tracking-wide">
                    {goal.statName}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleDelete(goal.id)}
                    className="btn btn-square btn-ghost btn-sm text-error hover:bg-error/10"
                    title="Delete Goal"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserGoals;