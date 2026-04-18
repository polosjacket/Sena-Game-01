# Changelog - 8-Bit Space Invaders Duo

All notable changes and instructions implemented in this session:

### [1.0.0] - Upgrade System & Sequential Turns
- Added 3 upgrade cards after each round: **Rapid Fire** (up to Level 9), **Explosion** (10-50% area damage), and **Laser** (10-50% piercing beam).
- Implemented sequential upgrade turns: Player 1 chooses first, followed by Player 2.

### [1.0.1] - Game Logic & UI Fixes
- Fixed a bug where the game would freeze after selecting an upgrade.
- Dynamic player name input forms: Only shows fields for the selected number of players (1P vs 2P).

### [1.0.2] - Cooperative Respawn System
- Implemented independent death: If one player dies, the other can keep playing.
- Added a collectible **Heart** item that spawns randomly when a player is dead.
- The heart has a 10-second timer; if collected, the dead player respawns with **5 seconds of invincibility**.

### [1.0.3] - High Score Optimization
- Reduced the Top Scorer list to show only the **Top 3** entries.
- Synchronized both backend SQL queries and frontend rendering to enforce this limit.

### [1.0.4] - 8-Bit Audio Engine
- Added procedural 8-bit background music (cheerful and happy vibe).
- Distinct sound effects for Player shooting vs. Opponent shooting.
- Added explosive sound effects for fireworks celebrations.

### [1.0.5] - Expanded Sound Effects
- Added an **Intro Theme** that plays on the setup screen.
- Added **Win and Lose jingles** for round completion and game over.
- Added **Hit feedback sounds** for when invaders or bosses are struck.

### [1.0.6] - Kirby Victory Theme
- Updated the victory jingle to the classic **Kirby level-clear dance theme** using 8-bit square waves.

### [1.0.7] - Heart Balancing
- Moved the Heart respawn item to the **bottom of the screen** for easier accessibility during intense combat.

### [1.0.8] - Boss Fights
- Implemented **Boss Fights every 10 levels** (Levels 10, 20, 30, etc.).
- Boss health starts at **100 HP** and increases by 100 HP every 10 levels (max 1000 HP).
- Added a Boss Health Bar and unique movement/attack patterns.

### [1.0.10] - UI Robustness & Safety
- Implemented `DOMContentLoaded` wrapper to ensure DOM elements are ready before attaching listeners.
- Added `safeAddListener` pattern to prevent script crashes if specific UI elements are missing.
- Centralized UI initialization and improved z-index layering for all interactive buttons.
- Added global error reporting and audio initialization safety blocks.

### [1.0.11] - Critical Syntax Bug Fix
- Fixed an 'Illegal break statement' Syntax Error in `game.js` that was completely preventing the game script from running and causing all buttons to be unclickable.

### [1.0.12] - Heart Placement Refinement
- Adjusted the Heart spawn Y coordinate from 80 to 60 pixels from the bottom to ensure collision with players is possible.

### [1.0.13] - Overlay Reset Fix
- Fixed a bug where the Upgrade and Pause overlays could persist into a new mission. Explicitly hiding all overlays upon calling `startGame`.

### [1.0.14] - Continue Mission & Heart Logic Update
- Added 'CONTINUE MISSION' feature to resume gameplay after death without resetting level/score.
- Updated Heart spawn logic to appear whenever any player is dead, with an increased spawn frequency (1% per frame).
