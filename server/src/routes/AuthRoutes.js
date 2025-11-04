import express from "express";
import { signup, login, upsertUser } from "../controller/AuthController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/upsert", upsertUser); // optional for OAuth

export default router;
