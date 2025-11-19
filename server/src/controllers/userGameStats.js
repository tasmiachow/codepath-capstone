import { pool } from "../config/database.js";

export async function createUserGameStat(req, res) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  const { gameId, score, accuracy, timeTaken, datePlayed } = req.body;

  // convert milliseconds to seconds for duration_seconds column if provided
  const durationSeconds =
    typeof timeTaken === "number" ? Math.max(0, timeTaken / 1000) : null;

  const playedAt = datePlayed ? new Date(datePlayed) : new Date();

  try {
    await pool.query("BEGIN");

    // insert session
    const sessionRes = await pool.query(
      `INSERT INTO sessions (user_id, game_id, played_at)
       VALUES ($1, $2, $3)
       RETURNING id, user_id AS "userId", game_id AS "gameId", played_at AS "datePlayed"`,
      [userId, gameId ?? null, playedAt]
    );

    const sessionId = sessionRes.rows[0].id;

    // insert score row
    const scoreRes = await pool.query(
      `INSERT INTO scores (session_id, score, accuracy, duration_seconds)
       VALUES ($1, $2, $3, $4)
       RETURNING id, session_id AS "sessionId", score, accuracy, duration_seconds AS "durationSeconds", created_at`,
      [sessionId, score ?? null, accuracy ?? null, durationSeconds]
    );

    await pool.query("COMMIT");

    const result = {
      session: sessionRes.rows[0],
      score: scoreRes.rows[0],
    };

    return res.status(201).json(result);
  } catch (error) {
    await pool.query("ROLLBACK").catch(() => {});
    console.error("createUserGameStat error", error);
    return res.status(500).json({ error: "internal server error" });
  }
}

export async function listUserGameStats(req, res) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  try {
    const q = `
      SELECT
        s.id AS id,
        s.played_at AS "datePlayed",
        s.game_id AS "gameId",
        g.name AS "gameName",
        sc.score,
        sc.accuracy,
        sc.duration_seconds AS "durationSeconds",
        sc.created_at AS created_at
      FROM sessions s
      JOIN scores sc ON sc.session_id = s.id
      LEFT JOIN games g ON g.id = s.game_id
      WHERE s.user_id = $1
      ORDER BY s.played_at DESC
      LIMIT 200;
    `;
    const { rows } = await pool.query(q, [userId]);
    return res.json({ sessions: rows });
  } catch (error) {
    console.error("listUserGameStats error", error);
    return res.status(500).json({ error: "internal server error" });
  }
}

export default { createUserGameStat, listUserGameStats };
