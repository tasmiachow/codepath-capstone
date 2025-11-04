import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const SALT_ROUNDS = 10;

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email and password required" });
  try {
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const q = `
      INSERT INTO users (username, email, password_hash, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id, username, email;
    `;
    const { rows } = await pool.query(q, [username || null, email, hashed]);
    const user = rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(201).json({ token, user });
  } catch (err) {
    console.error("signup error:", err);
    if (err.code === "23505")
      return res.status(409).json({ error: "Email already in use" });
    return res.status(500).json({ error: "internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email and password required" });
  try {
    const q = `
      SELECT id, username, email, password_hash
      FROM users
      WHERE email = $1
      LIMIT 1;
    `;
    const { rows } = await pool.query(q, [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: "invalid credentials" });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "invalid credentials" });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    await pool.query(`UPDATE users SET last_login = NOW() WHERE id = $1`, [
      user.id,
    ]);
    return res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const upsertUser = async (req, res) => {
  const { email, username, avatar_url, provider, provider_id } = req.body;
  if (!email) return res.status(400).json({ error: "email required" });
  try {
    const q = `
      INSERT INTO users (email, username, avatar_url, provider, provider_id, last_login)
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (email) DO UPDATE
      SET username = COALESCE(EXCLUDED.username, users.username),
          avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
          provider = COALESCE(EXCLUDED.provider, users.provider),
          provider_id = COALESCE(EXCLUDED.provider_id, users.provider_id),
          last_login = NOW()
      RETURNING id, username, email, avatar_url;
    `;
    const { rows } = await pool.query(q, [
      email,
      username || null,
      avatar_url || null,
      provider || null,
      provider_id || null,
    ]);
    const user = rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({ token, user });
  } catch (err) {
    console.error("upsert error:", err);
    return res.status(500).json({ error: "internal server error" });
  }
};
