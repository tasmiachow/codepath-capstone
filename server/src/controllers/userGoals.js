import { pool } from '../config/database.js';
import { buildUpdateQuery } from '../util.js';

const createUserGoal = async (req, res) => {
    try {
        const { user_id, game_id, stat_name, stat_value } = req.body;

        const data = await pool.query(`
            INSERT INTO user_goals
            (user_id, game_id, stat_name, stat_value)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [user_id, game_id, stat_name, stat_value]);
        res.status(200).json({ data: data.rows[0] });
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

const getUserGoals = async (req, res) => {
    try {
        const { user_id } = req.body;

        const data = await pool.query(`
            SELECT * FROM user_goals
            WHERE user_id = $1
            ORDER BY goal_id ASC;
        `, [user_id]);
        res.status(200).json({ data: data.rows });
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

const updateUserGoal = async (req, res) => {
    try {
        const goalId = parseInt(req.params.goal_id);
        if (isNaN(goalId)) throw ("Invalid `goal_id`");

        const { query, values } = buildUpdateQuery(req.body, 'user_goals', {
            goal_id: goalId
        }, ['game_id', 'stat_name', 'stat_value']);

        const data = await pool.query(query, values);
        res.status(200).json({ data: data.rows[0] });
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

const deleteUserGoal = async (req, res) => {
    try {
        const goalId = parseInt(req.params.goal_id);
        if (isNaN(goalId)) throw ("Invalid `goal_id`");

        const data = await pool.query(`
            DELETE FROM user_goals
            WHERE goal_id = $1
            RETURNING *;
        `, [goalId]);
        res.status(200).json({ data: data.rows[0] });
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

export default { createUserGoal, getUserGoals, updateUserGoal, deleteUserGoal };