# Comprehensive Changelog: Zap the Thing!

All notable changes to this project will be documented in this file. This project adheres to Semantic Versioning.

---

## [1.0.40] - 2026-04-19
### "How to Play" Mission Briefing
- **Objective**: Improve onboarding for new players by providing an in-game guide for controls and mechanics.
- **Detailed Technical Changes**:
  - **UI/UX**:
    - Added a "HOW TO PLAY" button to the main setup screen.
    - Implemented a "Mission Briefing" overlay (modal) that details:
      - Movement controls for P1 (including Forward Thrust).
      - Double-tap weapon mechanics for Laser.
      - Game objectives (Survive, Co-op revival, Upgrades).
    - Designed a clean, scrollable layout for instructions within the game's premium aesthetic.

---


## [1.0.39] - 2026-04-19
### Manual Laser Trigger & Cooldown
- **Objective**: Transition the laser ability from a random chance to a deliberate, skill-based mechanic.
- **Detailed Technical Changes**:
  - **Weapon Logic**:
    - Replaced the random laser chance with a **Double-Tap Trigger**.
    - Players must now double-press the shoot key (`W` for P1, `Up Arrow` for P2) within 300ms to fire a laser.
    - Implemented a mandatory **2-second (120-frame) cooldown** specifically for the laser ability.
    - Normal shots continue to function via single-press or holding the key, independent of the laser cooldown.

---


## [1.0.38] - 2026-04-19
### Forward Movement Mechanic
- **Objective**: Introduce a new vertical movement layer to enhance dodging and offensive positioning.
- **Detailed Technical Changes**:
  - **Player Movement**:
    - Added "Forward Thrust" for Player 1 using the `Space` key.
    - Implemented an automatic drift-back system that slowly returns the player to the baseline when `Space` is released.
    - This allows for temporary vertical repositioning while maintaining the core horizontal focus of the game.

---


## [1.0.37] - 2026-04-19
### Laser Cooldown Optimization
- **Objective**: Improve gameplay fluidity by removing the excessive delay after firing a laser.
- **Detailed Technical Changes**:
  - **Weapon Logic**:
    - Removed the hardcoded 90-frame (1.5s) cooldown for lasers.
    - Synchronized laser cooldown with the normal shot formula (`Math.max(5, 30 - (rapid * 3))`), allowing it to scale with the **Rapid Fire** upgrade.

---


## [1.0.36] - 2026-04-19
### Boss Behavior Refinement
- **Objective**: Scale Boss difficulty and visual complexity more linearly with level progression.
- **Detailed Technical Changes**:
  - **Boss Logic**:
    - Refined finger count and slam attack scaling:
      - Level 10: 1 finger (1 slam area).
      - Level 20: 2 fingers (2 slam areas).
      - Level 30: 3 fingers (3 slam areas).
      - Level 40+: 4 fingers (4 slam areas).
    - Enabled Boss special attacks (Warning/Slam) starting from level 10 (previously level 20).
    - Updated Boss rendering to visually display the exact number of fingers corresponding to the attack power.

---


## [1.0.35] - 2026-04-19
### Mobile Support & Max 2 Players
- **Objective**: Expand platform support to mobile devices and optimize the game for a tighter, 2-player cooperative experience.
- **Detailed Technical Changes**:
  - **Player Limit**:
    - Reduced maximum players from 4 to 2 across all game screens and logic.
    - Simplified the setup screen by removing redundant 4P options and inputs.
  - **Mobile Support**:
    - Implemented a robust mobile detection engine (UA + Touch capabilities).
    - Restricted mobile gameplay to 1 Player mode for optimal performance and UX.
    - Added a mobile-specific note on the setup screen: "MOBILE: 1 PLAYER ONLY".
    - Introduced touch-based virtual controls for mobile:
      - Left-side touch zones for horizontal movement.
      - Right-side oversized button for shooting ("ZAP").
    - Enhanced responsive styling in `style.css` to handle smaller viewports and full-screen mobile layouts.

---


## [1.0.34] - 2026-04-19
### Documentation Alignment
- **Objective**: Ensure documentation accurately reflects the new dynamic infrastructure settings.
- **Detailed Technical Changes**:
  - **Documentation**:
    - Updated `README.md` to refer to the dynamically generated console URL instead of a hardcoded `localhost` link, aligning with the recent configuration consolidation.

---


## [1.0.33] - 2026-04-19
### Configuration Consolidation & Smart Logging
- **Objective**: Centralize environment management and improve infrastructure transparency during startup.
- **Detailed Technical Changes**:
  - **Architecture**:
    - Introduced `config.js` as the single source of truth for all environment variables (`PORT`, `DB_PATH`, `NODE_ENV`).
    - Implemented getter logic for environment-aware properties like `isProduction` and `hostname`.
  - **Backend Integration**:
    - Refactored `server.js` to utilize the new centralized configuration, removing scattered `process.env` calls.
    - Enhanced startup logging to dynamically resolve and display the system hostname when running in production, while defaulting to `localhost` for development.

---


## [1.0.32] - 2026-04-19
### Configuration Alignment & Git Hygiene
- **Objective**: Optimize the project's version control configuration to exclude temporary and environment-specific files.
- **Detailed Technical Changes**:
  - **Git Configuration**:
    - Overhauled `.gitignore` to include patterns for Node.js logs, Playwright reports (`playwright-report/`), and test artifacts (`test-results/`).
    - Explicitly ignored all SQLite database files (`*.db`) to prevent accidental commits of local highscore data, while leaving room for future template inclusion.
    - Added standard ignores for macOS (`.DS_Store`) and common IDEs (`.vscode/`, `.idea/`).
    - Secured the project by adding environment file patterns (`.env`, `.env.test`).

---


## [1.0.31] - 2026-04-19
### Control Simplification & Horizontal Movement
- **Objective**: Streamline gameplay by restricting movement to the horizontal axis and re-mapping the shoot action to the "Up" keys.
- **Detailed Technical Changes**:
  - **Movement Engine**:
    - Removed vertical movement logic (`up`/`down`) in `Player.update()`.
    - Clamped player position strictly to the bottom row for classic arcade feel.
  - **Key Re-mapping**:
    - P1: `A/D` to Move, `W` to Shoot.
    - P2: `Left/Right` to Move, `Up` to Shoot.
    - P3: `J/L` to Move, `I` to Shoot.
    - P4: `F/H` to Move, `T` to Shoot.
  - **UI/UX**:
    - Updated the on-screen controls hint to reflect the new mappings.
  - **Documentation**:
    - Updated `README.md` with the new control scheme for all 4 players.

---


## [1.0.30] - 2026-04-19
### Automated Testing Suite & Backend Refactoring
- **Objective**: Implement a comprehensive testing framework for both backend API and frontend E2E scenarios to ensure stability.
- **Detailed Technical Changes**:
  - **Backend Testability**:
    - Refactored `server.js` to export the `app` object and support dynamic database paths via `process.env.DB_PATH`.
    - Implemented a test-specific SQLite database instance to prevent data corruption during CI/CD or local testing.
  - **API Integration Tests**:
    - Created `tests/server.test.js` using Jest and Supertest.
    - Verified `GET /api/scores` and `POST /api/scores` logic, including ordering and input validation.
  - **E2E Gameplay Tests**:
    - Integrated Playwright for browser-based automation.
    - Created `tests/game.spec.js` to verify mission launch, difficulty selection, and canvas rendering.
  - **CI/CD Readiness**:
    - Added `npm test` and `npm run test:e2e` scripts to `package.json`.
    - Configured Jest and Playwright to ignore each other's test files using pattern matching.

---


## [1.0.29] - 2026-04-18
### Project Rebranding & Deployment Readiness
- **Objective**: Rebrand the project to "Zap the Thing!" and prepare for production deployment on Render.com.
- **Detailed Technical Changes**:
  - **Rebranding**: 
    - Updated `index.html` `<title>` and `<h1>` to "Zap the Thing!".
    - Updated `package.json` name to `zap-the-thing`.
    - Overhauled `README.md` and `CHANGELOG.md` titles.
  - **Deployment**:
    - Added `"start": "node server.js"` to `package.json` scripts.
    - Verified `server.js` dynamic port binding (`process.env.PORT || 3000`).
    - Documented live URL in `README.md`.
  - **Hero Documentation**: Updated README with character-specific controls for Kirby, Mario, Luigi, and Meta Knight.

## [1.0.28] - 2026-04-18
### Character Role Correction (P1 Kirby)
- **Objective**: Re-align character assignments so Kirby is P1 and Mario is P2.
- **Detailed Technical Changes**:
  - **Identity Swap**: Swapped default names and labels in `index.html` (P1: Kirby, P2: Mario).
  - **Drawing Logic**: Updated `Player.draw()` to associate `ID 1` with the pink round sprite (Kirby) and `ID 2` with the red plumber sprite (Mario).
  - **Weapon Mapping**: 
    - `ownerId 1` (Kirby) now triggers the Star projectile geometry.
    - `ownerId 2` and `3` (Mario/Luigi) trigger the Hammer projectile geometry.

## [1.0.27] - 2026-04-18
### 4-Player Local Co-op & Character Specific Weapons
- **Objective**: Expand the game to support 4 players simultaneously with distinct character identities and weaponry.
- **Detailed Technical Changes**:
  - **Player Roster**:
    - **P1 (Mario)**: WASD + Space. Custom sprite drawing. Shoots rotating Hammers.
    - **P2 (Kirby)**: Arrows + Enter. Custom arc-based drawing. Shoots spinning Stars.
    - **P3 (Luigi)**: IJKL + U. Green-variant Mario sprite. Shoots rotating Hammers.
    - **P4 (Meta Knight)**: TFGH + R. Masked/Winged sprite. Shoots Sword projectiles.
  - **Rendering Engine**:
    - Updated `Player.draw()` with multi-path logic for character-specific pixel art (using arc, rect, and paths).
    - Refactored `Bullet.draw()` to use `ownerId` to determine projectile geometry (rotating hammers, star points, sword blades).
  - **UI/UX**:
    - Added `4P` mode button to `index.html`.
    - Dynamic HUD scaling to show/hide P3 and P4 stats based on `playerMode`.
    - Updated control hints to display all 4 sets of mappings.

## [1.0.26] - 2026-04-18
### Laser Freeze & Performance Optimization
- **Objective**: Resolve game-breaking freezes occurring during intense laser fire and round transitions.
- **Detailed Technical Changes**:
  - **Memory Optimization**: Implemented a global cap on `fireworks` particles (clamped at 300). Reduced particle generation density per explosion from 50 to 15 to prevent CPU spiking during laser multi-hits.
  - **Logic Fix**: Restored `ownerId` assignment to laser bullets in `Player.update()`. This fixes an `undefined` reference crash in the collision engine when calculating laser damage levels.
  - **Robust Collision**: Refactored the Bullet-Invader collision loop to be 'Collection Safe'. Used a `Set` (`invadersToRemove`) to batch removals after iteration, preventing array modification errors during high-frequency laser overlaps.
  - **Audio Safety**: Added a `Math.max(500, ...)` clamp to the `winLoopTimeout` in `SoundEffects` to prevent recursive execution if the audio context clock fluctuates.

## [1.0.25] - 2026-04-18
### Boss 'Wall Dash' Attack Pattern
- **Objective**: Introduce a high-speed horizontal traversal attack to pressure player positioning.
- **Detailed Technical Changes**:
  - **Attack States**: Added `DASH_PREP` and `DASHING` states to the Boss AI.
  - **Execution Logic**: 
    - In `DASH_PREP`, the boss repositioned to `x = -width` or `x = canvas.width` and a random vertical coordinate between 100px and `canvas.height - 200px`.
    - In `DASHING`, horizontal velocity is set to `15 * dashDir` (approx. 900px/sec).
  - **Collision Engine**: Implemented an AABB check specifically during the `DASHING` state that flags any overlapping players as `alive = false`.
  - **State Reset**: Added boundary checks (`this.x > canvas.width` or `this.x < -this.width`) to trigger a return to the `IDLE` central state.

## [1.0.24] - 2026-04-18
### 4-Way Pilot Movement
- **Objective**: Enhance player mobility by allowing vertical movement in addition to horizontal strafing.
- **Detailed Technical Changes**:
  - **Class Update**: Modified `Player.update()` to include checks for `this.keys.up` and `this.keys.down`.
  - **Boundary Clamping**: Implemented vertical clamping (`this.y > 0` and `this.y < canvas.height - this.height`) to prevent players from leaving the play area.
  - **Control Mapping**: 
    - **P1**: Re-mapped to WASD + Space.
    - **P2**: Re-mapped to Arrow Keys + Enter.
  - **Physics**: Utilized existing `PLAYER_SPEED` constant for consistent movement velocity across all 4 axes.

## [1.0.23] - 2026-04-18
### Upgrade Screen Interaction Fixes
- **Objective**: Resolve issues preventing players from selecting upgrades after a round victory.
- **Detailed Technical Changes**:
  - **Loop Management**: Removed redundant `gameLoop()` call in `selectUpgrade`. Since the loop already runs in the background (waiting for `gameState` to change from `UPGRADING` to `PLAYING`), this prevents multiple parallel animation frames from stacking.
  - **UI Interaction**: Added `pointer-events: all !important` to the `.card` CSS class to override any potential transparency or overlay blocks from the CRT filter.
  - **Robustness**: Wrapped `sfx.stopWinTheme()` in a try/catch block to ensure that audio state issues do not block the execution of the upgrade logic.
  - **Diagnostics**: Added `console.log` telemetry to track card clicks and active player indices during the upgrade phase.

## [1.0.22] - 2026-04-18
### Kirby Win Theme Implementation
- **Objective**: Replace the generic win jingle with an upbeat theme inspired by Kirby and the Forgotten Land.
- **Detailed Technical Changes**:
  - **Melody Engine**: Rewrote `playWinJingle` to use a scheduled sequence of square-wave oscillators. It now plays a multi-note melody (C5, Bb4, B4, C5 sequence).
  - **Audio Lifecycle**: Added `this.winOscs` array to the `SoundEffects` class to track and stop active melody notes.
  - **Looping Logic**: Implemented `winLoopTimeout` to re-trigger the jingle every ~1.5 seconds while in the `UPGRADING` state.
  - **Cleanup**: Integrated `sfx.stopWinTheme()` into the `selectUpgrade` function to immediately terminate the victory music when the next round is initialized.

## [1.0.21] - 2026-04-18
### Boss Slam Difficulty Scaling & Multi-Limb Evolution
- **Objective**: Refine Boss difficulty curve to engage players earlier (Level 20+) and provide visual growth feedback.
- **Detailed Technical Changes**:
  - **Logic Shift**: Modified `Boss.update()` attack trigger. Lowered `this.level >= 50` threshold to `this.level >= 20`.
  - **Attack Complexity**: Implemented a conditional branching system for `numSlams`:
    - `Level 20-29`: `numSlams = 1`
    - `Level 30-39`: `numSlams = 2`
    - `Level 40+`: `numSlams = 4`
  - **Visual System**: Overhauled `Boss.draw()` to include a multi-limb rendering engine. 
    - At Level 20: Renders a single top-mounted "finger" using `ctx.fillRect(this.x + this.width / 2 - 15, this.y - 50, 30, 40)`.
    - At Level 30: Renders two side-mounted hands using `ctx.fillRect` with offsets of -40 and +15 from the boss body.
    - At Level 40+: Renders four distinct fingers (two per side) using precise pixel offsets (-50, -30, +15, +35).
  - **Hitbox Balancing**: Reduced warning area width (`w`) from 100 to 80 pixels in the `WARNING` state to account for the increased number of simultaneous attacks.

## [1.0.20] - 2026-04-18
### Visual Excellence, CRT Simulation & Press Start UI
- **Objective**: Implement a premium, unified retro aesthetic inspired by 80s CRT arcade monitors.
- **Detailed Technical Changes**:
  - **CRT Overlay Implementation**: Added a full-screen `div` with `id="crt-overlay"` positioned `fixed`. 
    - Utilized a complex `linear-gradient` background with a `50%` transparency split to simulate horizontal scanlines.
    - Added a second 90-degree gradient with subtle RGB offsets (`rgba(255, 0, 0, 0.06)`, etc.) to simulate phosphor sub-pixels.
    - Set `pointer-events: none` to ensure the overlay doesn't block UI interaction.
  - **Typography Engine**: Integrated Google Fonts API. Updated `:root` CSS variable `--font-main` to `'Press Start 2P', cursive`.
  - **Color Palette Overhaul**: Standardized UI colors using HSL-tailored variables: `--accent-blue (#3a86ff)`, `--accent-pink (#ff006e)`, and `--accent-gold (#ffbe0b)`.
  - **Animations**: Defined a `@keyframes pulse` CSS animation targeting the `h1` and `.pulse` utility class, fluctuating opacity between `1` and `0.5` every 1.5 seconds.
  - **Interaction Design**: Added `button:active { transform: scale(0.95); }` for tactile click feedback.

## [1.0.19] - 2026-04-18
### UI Listener Restoration & Redundancy Cleanup
- **Objective**: Restore the "Quit" button functionality and optimize event attachment.
- **Detailed Technical Changes**:
  - **Function Restoration**: Re-inserted `safeAddListener('quit-btn', 'click', quitToMenu)` into the `initUIListeners()` function scope.
  - **Handler Optimization**: Identified and removed a duplicate `safeAddListener('continue-btn', 'click', continueGame)` call that was causing double-triggering of the revival logic.
  - **Encapsulation**: Verified that `quitToMenu()` correctly calls `cancelAnimationFrame(animationId)` to prevent memory leaks and background processing after returning to the setup screen.

## [1.0.18] - 2026-04-18
### Global Code Documentation & Architecture Mapping
- **Objective**: Provide clear technical documentation for future maintenance and scalability.
- **Detailed Technical Changes**:
  - **Class Documentation**: Added JSDoc blocks to `SoundEffects`, `Player`, `Invader`, and `Boss` classes, explicitly defining their properties and external dependencies.
  - **Engine Documentation**: Documented the `gameLoop()` function, mapping out the execution order: HUD Update -> Boss Processing -> Invader Logic -> Bullet Collision Engine -> HUD Refresh.
  - **Interaction Comments**: Added inline documentation to the Collision Engine (`playerBullets.forEach`) explaining how damage is calculated across different bullet types.

## [1.0.17] - 2026-04-18
### Multi-Hit Enemy HP & Damage Feedback
- **Objective**: Increase gameplay depth by requiring multiple hits for enemies at higher levels.
- **Detailed Technical Changes**:
  - **HP Architecture**: Updated `Invader` constructor to accept a `hp` parameter.
  - **Scaling Formula**: Implemented `1 + Math.floor((level - 1) / 5)` inside `initInvaders()` to determine the HP of the entire wave based on the current level.
  - **Collision Logic**: Refactored the bullet collision loop. Replaced `invaders.splice(i, 1)` with `inv.hp -= 1`. The removal of the invader object is now gated behind an `if (inv.hp <= 0)` check.
  - **Visual Feedback State**: Updated `Invader.draw()` to check `if (this.hp < this.maxHp)`. If true, the `ctx.fillStyle` switches from the default pink to a "bruised" purple (`#b79bed`).

## [1.0.16] - 2026-04-18
### Advanced Boss AI & Freeze Upgrade Mechanic
- **Objective**: Introduce high-tier boss mechanics and a reward-based upgrade path.
- **Detailed Technical Changes**:
  - **Boss Attack State Machine**: Implemented `this.attackState` (IDLE, WARNING, SLAM, SIDE, LASER) with associated timers.
  - **Slam Logic**: Level 50+ boss populates `this.warningAreas` with random X-coordinates. After a 60-frame delay (`slamTimer`), it triggers a collision check against player hitboxes in those zones.
  - **Side Sweep Pattern**: Level 70+ boss moves rapidly to screen edges (`sideDir`) while a static safe zone is defined at `canvas.width / 2 - 100`. Players outside this safe zone are flagged as `alive = false`.
  - **Omega Laser**: Level 100+ attack that creates a constant damage zone in the center 40 pixels of the screen.
  - **Freeze Mechanism**: Added `freeze` to `Player.upgrades`. On hit, it sets `inv.frozen = 120`. Modified `Invader.update()` to return early if `frozen > 0`.

## [1.0.15] - 2026-04-18
### Laser Damage Progression (15-33 DMG)
- **Objective**: Balance endgame boss encounters by allowing laser damage to scale.
- **Detailed Technical Changes**:
  - **Damage Formula**: Implemented `15 + (player.upgrades.laserLvl - 1) * 2`. 
  - **Upgrade Integration**: Updated `selectUpgrade('laser')` to increment `laserLvl` (clamped at 10) while also increasing firing chance (clamped at 0.5).
  - **UI Hook**: Modified `updateUpgradeOverlay()` to show both chance percentage and raw damage level on the upgrade card.

## [1.0.14] - 2026-04-18
### Continue System & Cooperative Heart Logic
- **Objective**: Reduce player frustration and enhance 2-player synergy.
- **Detailed Technical Changes**:
  - **Continue Logic**: `continueGame()` resets `players[i].alive = true`, sets `invincible = 300`, and restarts the `gameLoop()`. It explicitly bypasses the `level = 1` reset found in `startGame()`.
  - **Heart Mechanics**: Decoupled `Heart` spawn from `playerMode === 2`. It now checks `players.some(p => !p.alive)` globally. Spawn probability increased to `0.01` (approx. 1 spawn per 1.6 seconds of play).

## [1.0.13] - 2026-04-18
### Overlay State Sanitization
- **Objective**: Ensure a consistent game start regardless of previous session state.
- **Detailed Technical Changes**:
  - **Clean Start Implementation**: Added `.classList.remove('active')` calls for all overlay IDs (`setup-screen`, `game-over-screen`, `game-screen`, `upgrade-overlay`, `pause-overlay`) inside the `startGame()` trigger.

## [1.0.12] - 2026-04-18
### Hitbox Overlap & Heart Y-Correction
- **Objective**: Fix a regression where hearts spawned out of player reach.
- **Detailed Technical Changes**:
  - **Coordinate Correction**: Changed `Heart` spawn Y from `canvas.height - 80` to `canvas.height - 60`. 
  - **Alignment Logic**: Since the player ship is 40px tall at the bottom, and the heart is 30px tall, this change creates a 10px overlap zone, ensuring the collision detection in `gameLoop` triggers reliably.

## [1.0.11] - 2026-04-18
### Critical Syntax Error Resolution
- **Objective**: Restore game functionality after a script-breaking syntax error.
- **Detailed Technical Changes**:
  - **Syntax Fix**: Identified an illegal `break` statement inside an anonymous function callback within a `forEach` loop in the bullet collision section.
  - **Correction**: Replaced `break` with `return`, effectively switching from an illegal loop-break to a legal function-exit, allowing the JS engine to parse the file successfully.

## [1.0.0] - 2026-04-18
### Initial Core Release
- **Detailed Technical Changes**:
  - **Procedural Audio**: Implemented `SoundEffects` using `OscillatorNode` and `GainNode`. Square waves for player shots, Sawtooth for enemies.
  - **Persistence**: Integrated `better-sqlite3` on the backend with `/api/scores` endpoints for POSTing and GETing the top 3 scores.
  - **Collision**: Implemented AABB (Axis-Aligned Bounding Box) collision detection for bullets and entities.
