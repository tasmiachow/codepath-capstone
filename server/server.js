import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./src/routes/AuthRoutes.js";
import gamesRoute from "./src/routes/games.js";
import userGameStatsRoutes from "./src/routes/userGameStats.js";

const app = express();
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.path}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/games", gamesRoute);
app.use("/api/user-game-stats", userGameStatsRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
