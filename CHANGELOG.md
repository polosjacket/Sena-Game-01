# Comprehensive Changelog: 8-Bit Space Invaders Duo

All notable changes to this project will be documented in this file. This project adheres to Semantic Versioning.

---

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
