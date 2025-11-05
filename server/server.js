import express from "express";

// constants
const PORT = 3001;

// app
const app = express();

// routes
import gamesRoute from "./src/routes/games.js";

// link routes
app.use('/api/games', gamesRoute);

// start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
