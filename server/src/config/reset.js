// ...existing code...
import { pool } from "./database.js";
import "./dotenv.js";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import { dirname } from "path";

const SALT_ROUNDS = 10;

const createTables = async () => {
  const q = `
    DROP TABLE IF EXISTS favorites CASCADE;
    DROP TABLE IF EXISTS scores CASCADE;
    DROP TABLE IF EXISTS sessions CASCADE;
    DROP TABLE IF EXISTS games CASCADE;
    DROP TABLE IF EXISTS users CASCADE;

    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100),
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash TEXT,
      avatar_url TEXT,
      provider VARCHAR(100),
      provider_id TEXT,
      last_login TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE games (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(100) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE sessions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
      played_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE scores (
      id SERIAL PRIMARY KEY,
      session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
      score INTEGER NOT NULL,
      accuracy NUMERIC(5,2),
      duration_seconds NUMERIC(8,2),
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE favorites (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
      added_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (user_id, game_id)
    );
  `;

  await pool.query(q);
  console.log("✅ Tables (users,games,sessions,scores,favorites) created");
};

const seedData = async () => {
  // sample data
  const users = [
    { username: "demo", email: "demo@example.com", password: "password" },
    { username: "alice", email: "alice@example.com", password: "password" },
    { username: "bob", email: "bob@example.com", password: "password" },
  ];

  const games = [
    { slug: "license-plate", name: "License Plate Recall", category: "memory" },
    { slug: "quick-math", name: "Quick Math", category: "math" },
    { slug: "memory-tiles", name: "Memory Tiles", category: "memory" },
  ];

  try {
    const insertedUsers = [];
    for (const u of users) {
      const hash = await bcrypt.hash(u.password, SALT_ROUNDS);
      const res = await pool.query(
        `INSERT INTO users (username, email, password_hash, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, username, email`,
        [u.username, u.email, hash]
      );
      insertedUsers.push(res.rows[0]);
      console.log(`✅ user inserted: ${u.email}`);
    }

    const insertedGames = [];
    for (const g of games) {
      const res = await pool.query(
        `INSERT INTO games (slug, name, category) VALUES ($1, $2, $3) RETURNING id, slug`,
        [g.slug, g.name, g.category]
      );
      insertedGames.push(res.rows[0]);
      console.log(`✅ game inserted: ${g.name}`);
    }

    // create sessions & scores for demo user
    const demo = insertedUsers.find((x) => x.email === "demo@example.com");
    const memory = insertedGames.find((x) => x.slug === "memory-tiles");
    const math = insertedGames.find((x) => x.slug === "quick-math");

    const s1 = await pool.query(
      `INSERT INTO sessions (user_id, game_id, played_at) VALUES ($1, $2, NOW() - INTERVAL '2 days') RETURNING id`,
      [demo.id, memory.id]
    );
    await pool.query(
      `INSERT INTO scores (session_id, score, accuracy, duration_seconds) VALUES ($1, $2, $3, $4)`,
      [s1.rows[0].id, 85, 92.5, 30.2]
    );

    const s2 = await pool.query(
      `INSERT INTO sessions (user_id, game_id, played_at) VALUES ($1, $2, NOW() - INTERVAL '1 day') RETURNING id`,
      [demo.id, math.id]
    );
    await pool.query(
      `INSERT INTO scores (session_id, score, accuracy, duration_seconds) VALUES ($1, $2, $3, $4)`,
      [s2.rows[0].id, 72, 80.0, 45.0]
    );

    // favorite example
    await pool.query(
      `INSERT INTO favorites (user_id, game_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [demo.id, memory.id]
    );

    console.log("✅ Seed data inserted");
  } catch (err) {
    console.error("⚠️ Error seeding data:", err);
    throw err;
  }
};

const run = async () => {
  try {
    await createTables();
    await seedData();
    console.log("All done.");
  } catch (err) {
    console.error("Reset failed:", err);
  } finally {
    await pool.end();
    process.exit(0);
  }
};

// allow running as script: node reset.js
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  run();
}
// ...existing code...
