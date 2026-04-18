# 8-Bit Space Invaders Duo: Revenge

A polished, 2-player cooperative 8-bit Space Invaders clone built with modern web technologies. Face off against waves of invaders, battle massive bosses, and upgrade your ship to become the ultimate pilot!

![Space Invaders Duo](https://via.placeholder.com/800x400.png?text=8-Bit+Space+Invaders+Duo)

## 🚀 Features

- **Cooperative Multiplayer**: Play solo or with a friend in local co-op mode.
- **Procedural Sound Engine**: All audio (BGM and SFX) is generated procedurally using the Web Audio API—no external assets required!
- **Upgrade System**: Choose between **Rapid Fire**, **Explosive Rounds**, and **Laser Beams** after every round to customize your ship.
- **Epic Boss Fights**: Face a massive boss every 10 levels with scaling health and unique attack patterns.
- **Cooperative Respawn**: Collect hearts to revive your fallen teammate with invincibility.
- **Continue System**: Never lose your progress! Continue your mission from the current level after a Game Over.
- **High Score Tracking**: Persistent Top 3 leaderboard powered by SQLite.

## 🛠️ Technology Stack

- **Frontend**: HTML5 Canvas, Vanilla CSS3, Javascript (ES6+).
- **Backend**: Node.js, Express.
- **Database**: SQLite (`better-sqlite3`) for persistent high scores.
- **Audio**: Web Audio API (Square/Triangle/Sawtooth waves).

## 📥 Installation & Running

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/Sena-Game-01.git
   cd Sena-Game-01
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Play the game**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 Controls

### Player 1 (Kirby)
- **Move**: `A` / `D`
- **Shoot**: `SPACE`

### Player 2 (Mario)
- **Move**: `Left` / `Right Arrows`
- **Shoot**: `ENTER`

### Global
- **Pause**: `P`

## 📜 Changelog

See the [CHANGELOG.md](CHANGELOG.md) file for a detailed history of all updates and features implemented in this session.

## 📄 License

MIT License. Feel free to remix and build your own 8-bit adventures!
