# Zap the Thing!

A polished, 4-player cooperative 8-bit arcade shooter. Zap the things, battle massive bosses, and upgrade your heroes to become legendary!

**Live Demo**: [https://zap-the-thing.onrender.com/](https://zap-the-thing.onrender.com/)

![Zap the Thing! Gameplay](public/images/screenshot.png)

## 🚀 Features

- **1-2 Player Cooperative Multiplayer**: Play solo or with a friend (Mario or Kirby) in local co-op mode.
- **Mobile Support**: Fully playable on mobile devices with intuitive touch controls (1 Player only).
- **Procedural Sound Engine**: All audio (BGM and SFX) is generated procedurally using the Web Audio API—no external assets required!
- **Upgrade System**: Choose between **Rapid Fire**, **Explosive Rounds**, and **Laser Beams** after every round to customize your hero.
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
   git clone https://github.com/polosjacket/Sena-Game-01.git
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
   Open the URL displayed in your terminal (typically `http://localhost:3000`) in your browser.

## 🎮 Controls

### Desktop
#### Player 1 (Kirby)
- **Move**: `A/D` (Horizontal)
- **Forward Thrust**: `Space` (Hold to move up, release to drift back)
- **Shoot**: `W` (Double-tap for Laser Ability, 2s cooldown)



#### Player 2 (Mario)
- **Move**: `Left/Right Arrows` (Horizontal Only)
- **Shoot**: `Up Arrow`

### Mobile (1 Player Only)
- **Move**: Left/Right buttons on the left side of the screen.
- **Shoot**: Large "ZAP" button on the right side of the screen.



### Global
- **Pause**: `P`

## 📜 Changelog

See the [CHANGELOG.md](CHANGELOG.md) file for a detailed history of all updates and features implemented in this session.

## 📄 License

MIT License. Feel free to remix and build your own 8-bit adventures!
