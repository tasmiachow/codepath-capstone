import express from "express";
import { signup, login, upsertUser, me } from "../controller/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/upsert", upsertUser);
router.get("/me", requireAuth, me);

export default router;
