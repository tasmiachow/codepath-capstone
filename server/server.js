import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./src/routes/AuthRoutes.js";
import gamesRoute from "./src/routes/games.js"
import userGameStatsRoute from "./src/routes/userGameStats.js";
import userGoalsRoute from "./src/routes/userGoals.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use('/api/games', gamesRoute);
app.use('/api/user-game-stats', userGameStatsRoute);
app.use('/api/user-goals', userGoalsRoute);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
