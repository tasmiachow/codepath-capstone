import e from "express";
import GamesController from "../controllers/games.js";

const router = e.Router();

router.get('/', GamesController.getGames);
router.get('/:game_id', GamesController.getGame);

export default router;