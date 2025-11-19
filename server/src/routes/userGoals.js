import e from "express";
import UserGoalsController from "../controllers/userGoals.js";
import { requireAuth } from "../middleware/auth.js"; // Ensure this path matches your file structure

const router = e.Router();

// INJECT MIDDLEWARE HERE vvv
router.post('/', requireAuth, UserGoalsController.createUserGoal);
router.get('/', requireAuth, UserGoalsController.getUserGoals);
router.patch('/:goal_id', requireAuth, UserGoalsController.updateUserGoal);
router.delete('/:goal_id', requireAuth, UserGoalsController.deleteUserGoal);

export default router;