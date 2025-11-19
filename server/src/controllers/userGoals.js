import { pool } from '../config/database.js';
import { buildUpdateQuery } from '../util.js';

const createUserGoal = async (req, res) => {
    try {
        // 1. GET USER ID FROM TOKEN (via requireAuth middleware)
        const user_id = req.user.id; 
        
        const { game_id, stat_name, stat_value } = req.body;

        // 2. VALIDATE
        if (!user_id) return res.status(401).json({ error: "Unauthorized" });
        if (typeof stat_name !== 'string' || stat_name.length > 20) throw new Error("Invalid stat_name");
        if (typeof stat_value !== 'number') throw new Error("Invalid stat_value");

        // 3. INSERT
        const data = await pool.query(`
            INSERT INTO user_goals (user_id, game_id, stat_name, stat_value)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [user_id, game_id, stat_name, stat_value]);

        // 4. RETURN DIRECT OBJECT (Matches Frontend)
        res.status(200).json(data.rows[0]); 

    } catch (error) {
        console.error("Create Goal Error:", error);
        if (error.code === '23505') {
            return res.status(409).json({ error: "Goal already exists" });
        }
        res.status(500).json({ error: error.message });
    }
}

const getUserGoals = async (req, res) => {
    try {
        const user_id = req.user.id; // Get ID from token

        const data = await pool.query(`
            SELECT * FROM user_goals
            WHERE user_id = $1
            ORDER BY goal_id ASC;
        `, [user_id]);
        
        // 5. RETURN DIRECT ARRAY (Matches Frontend)
        // Do not wrap in { data: ... } or the frontend .map() will fail
        res.status(200).json(data.rows); 
    } catch (error) {
        console.error("Get Goals Error:", error);
        res.status(500).json({ error: error.message });
    }
};

const updateUserGoal = async (req, res) => {
    try {
        const goalId = parseInt(req.params.goal_id);
        if (isNaN(goalId)) throw new Error("Invalid goal_id");

        // Note: You might want to add "user_id" to the WHERE clause 
        // to ensure users can only update their OWN goals.
        
        const { query, values } = buildUpdateQuery(req.body, 'user_goals', {
            goal_id: goalId
        }, ['game_id', 'stat_name', 'stat_value']);

        const data = await pool.query(query, values);
        res.status(200).json(data.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

const deleteUserGoal = async (req, res) => {
    try {
        const goalId = parseInt(req.params.goal_id);
        if (isNaN(goalId)) throw new Error("Invalid goal_id");

        // Ensure user owns the goal before deleting (Optional but recommended)
        const data = await pool.query(`
            DELETE FROM user_goals
            WHERE goal_id = $1
            RETURNING *;
        `, [goalId]);
        res.status(200).json(data.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

export default { createUserGoal, getUserGoals, updateUserGoal, deleteUserGoal };