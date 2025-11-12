import { pool } from "../config/database.js";

async function createUserGameStat(req, res) {
    try {
        const { userId, gameId, score, accuracy, timeTaken, datePlayed } = req.body;
        const results = await pool.query(`
            INSERT INTO user_game_stats
            (user_id, game_id, score, accuracy, time_taken, date_played)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *; 
        `, [userId, gameId, score, accuracy, timeTaken, datePlayed]);
        res.status(200).json({data: results.rows[0]});
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

export default { createUserGameStat };