# Entity Relationship Diagram (ERD)

## 🧩 Database Schema

### `users` Table

| Column        | Type     | Description             |
| ------------- | -------- | ----------------------- |
| user_id       | INT (PK) | Unique user identifier  |
| username      | VARCHAR  | Login name              |
| password_hash | VARCHAR  | Hashed password         |
| streak        | INT      | Consecutive active days |
| created_at    | DATE     | Date of registration    |
| last_login    | DATE     | Last login time         |

---

### `games` Table

| Column      | Type     | Description            |
| ----------- | -------- | ---------------------- |
| game_id     | INT (PK) | Unique game identifier |
| game_name   | VARCHAR  | e.g., "Memory Tiles"   |
| description | TEXT     | Game description       |

---

### `user_game_stats` Table

| Column           | Type                     | Description               |
| ---------------- | ------------------------ | ------------------------- |
| stat_id          | INT (PK)                 | Unique stat record        |
| user_id          | INT (FK → users.user_id) | Who played                |
| game_id          | INT (FK → games.game_id) | Which game                |
| score            | INT                      | Game score                |
| accuracy         | FLOAT                    | Correct answer percentage |
| time_taken       | FLOAT                    | Completion time           |
| date_played      | DATE                     | Date of play              |
| streak_continued | BOOLEAN                  | Used for streak logic     |

---

### `favorites` Table

| Column  | Type                     | Description            |
| ------- | ------------------------ | ---------------------- |
| fav_id  | INT (PK)                 | Unique favorite record |
| user_id | INT (FK → users.user_id) | Linked user            |
| game_id | INT (FK → games.game_id) | Linked game            |

                        |
