import e from "express";
import UserGoalsController from "../controllers/userGoals.js";

const router = e.Router();

router.post('/', UserGoalsController.createUserGoal);
router.get('/', UserGoalsController.getUserGoals);
router.patch('/:goal_id', UserGoalsController.updateUserGoal);
router.delete('/:goal_id', UserGoalsController.deleteUserGoal);

export default router;