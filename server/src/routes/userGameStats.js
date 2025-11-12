import express from "express";
import UserGameStatsController from "../controllers/userGameStats.js";

const router = express.Router();

router.post("/", UserGameStatsController.createUserGameStat);

export default router;