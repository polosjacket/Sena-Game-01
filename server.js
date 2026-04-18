const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const dbPath = process.env.DB_PATH || 'highscores.db';
const db = new Database(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score INTEGER NOT NULL,
    difficulty TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// API Routes
app.get('/api/scores', (req, res) => {
  try {
    const scores = db.prepare('SELECT name, score, difficulty FROM scores ORDER BY score DESC LIMIT 3').all();
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/scores', (req, res) => {
  const { name, score, difficulty } = req.body;
  if (!name || score === undefined || !difficulty) {
    return res.status(400).json({ error: 'Missing name, score, or difficulty' });
  }

  try {
    const insert = db.prepare('INSERT INTO scores (name, score, difficulty) VALUES (?, ?, ?)');
    insert.run(name, score, difficulty);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = app;

