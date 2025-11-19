import express from "express";
import UserGameStatsController from "../controllers/userGameStats.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/ping", (req, res) => res.json({ ok: true }));
router.get("/", requireAuth, UserGameStatsController.listUserGameStats);
router.post("/", requireAuth, UserGameStatsController.createUserGameStat);

export default router;
