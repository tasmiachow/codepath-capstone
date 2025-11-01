import { pool } from '../config/database.js';

const getGames = async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM games;');
        res.status(200).json({ data: data.rows });
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

const getGame = async (req, res) => {
    try {
        const gameId = parseInt(req.params.game_id);

        if (isNaN()) {
            throw new Error('game_id must be a valid integer.');
        }

        const data = await pool.query(`
            SELECT * FROM GAMES
            WHERE game_id = $1;
        `, [gameId])
        res.status(200).json({ data: data.rows[0] });
    } catch (error) {
        res.status(409).json({ error: error.messages });
    }
};

export default { getGames, getGame };