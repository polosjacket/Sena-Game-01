const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const config = require('./config');

const app = express();


// Middleware
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const db = new Database(config.dbPath);

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

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// PVP Matchmaking
let waitingPlayer = null;
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_pvp', (data) => {
    if (waitingPlayer && waitingPlayer.id !== socket.id) {
      const opponent = waitingPlayer;
      waitingPlayer = null;
      
      const roomId = `room_${socket.id}_${opponent.id}`;
      socket.join(roomId);
      opponent.socket.join(roomId);
      
      io.to(roomId).emit('match_found', {
        roomId,
        players: [
          { id: socket.id, name: data.name, side: 'left' },
          { id: opponent.id, name: opponent.name, side: 'right' }
        ]
      });
    } else {
      waitingPlayer = { id: socket.id, name: data.name, socket: socket };
      socket.emit('waiting');
    }
  });

  socket.on('select_card', (data) => {
    socket.to(data.roomId).emit('opponent_selected', { card: data.card });
  });

  socket.on('update_state', (data) => {
    socket.to(data.roomId).emit('opponent_state', data.state);
  });

  socket.on('shoot', (data) => {
    socket.to(data.roomId).emit('opponent_shoot', data.bullet);
  });

  socket.on('hit', (data) => {
    socket.to(data.roomId).emit('opponent_hit', data);
  });

  socket.on('disconnect', () => {
    if (waitingPlayer && waitingPlayer.id === socket.id) {
      waitingPlayer = null;
    }
  });
});

if (require.main === module) {
  server.listen(config.port, () => {
    console.log(`Server running at http://${config.hostname}:${config.port}`);
  });
}


module.exports = app;

