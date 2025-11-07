import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export const requireAuth = async (req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const { rows } = await pool.query(
      "SELECT id, username, email, avatar_url FROM users WHERE id = $1 LIMIT 1",
      [payload.id]
    );
    if (!rows[0]) return res.status(401).json({ error: "Invalid token" });
    req.user = rows[0];
    next();
  } catch (err) {
    console.error("auth verify error", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};
export default requireAuth;
