# Changelog: 8-Bit Space Invaders Duo

All notable changes to this project will be documented in this file. This project adheres to Semantic Versioning.

---

## [1.0.21] - 2026-04-18
### Boss Slam Difficulty Scaling
- **Feature**: Refined the progression of Boss special attacks to start earlier in the game.
- **Technical Detail**: 
  - Moved slam trigger condition from Level 50 down to Level 20.
  - Implemented dynamic `numSlams` logic based on level thresholds (1 slam @ Lvl 20, 2 slams @ Lvl 30, 4 slams @ Lvl 40+).
  - Updated `Boss.draw()` to visually render different "finger" configurations (1, 2, or 4 limbs) depending on the current boss level to provide visual feedback of increased danger.

## [1.0.20] - 2026-04-18
### Visual Excellence & Retro Polish
- **Feature**: Added a "Premium Arcade" aesthetic to the game.
- **Technical Detail**:
  - **CRT Effect**: Implemented a fixed `#crt-overlay` with a CSS linear-gradient pattern to simulate scanlines and RGB phosphors.
  - **Typography**: Integrated Google Fonts 'Press Start 2P' for authentic 8-bit text rendering.
  - **Animations**: Created a `@keyframes pulse` animation for titles and interactive elements to improve UI engagement.
  - **Style Refinement**: Updated the color palette to high-contrast neons (accent-blue, accent-pink, accent-gold) and set the canvas background to pure black for better sprite popping.

## [1.0.19] - 2026-04-18
### UI Interaction Fixes
- **Bug**: Fixed a critical issue where the "Quit" button stopped responding.
- **Technical Detail**: Restored the `quit-btn` event listener in `initUIListeners()` that was accidentally overwritten during a documentation update. Removed duplicate listener attachments for the `continue-btn`.

## [1.0.18] - 2026-04-18
### Code Documentation
- **Improvement**: Added comprehensive JSDoc-style comments throughout `game.js`.
- **Technical Detail**: Documented all major classes (`SoundEffects`, `Player`, `Invader`, `Boss`) and core engine functions. Added logic flow descriptions for the Collision Engine and State Machine to assist future development.

## [1.0.17] - 2026-04-18
### Scaling Enemy Health
- **Feature**: Implemented increasing difficulty for standard invader waves.
- **Technical Detail**: 
  - Added `hp` property to the `Invader` class.
  - Calculated starting HP using `1 + Math.floor((level - 1) / 5)`, resulting in a health bump every 5 levels.
  - Added a visual "damaged" state (`#b79bed`) when an invader's HP is below its maximum but above zero.

## [1.0.16] - 2026-04-18
### Boss Overhaul & Freeze Upgrade
- **Feature**: Added complex attack patterns to bosses and a new reward type.
- **Technical Detail**:
  - **Boss AI**: Implemented `attackState` machine for Bosses (IDLE, WARNING, SLAM, SIDE, LASER).
  - **Attack Patterns**: Added "Hand Slam" (instant death in warning zones), "Side Sweep" (screen-wide attack with one safe gap), and "Omega Laser" (central beam).
  - **Freeze Card**: Added a new `freeze` upgrade type. Hit enemies have a chance to enter a `frozen` state (120 frames), disabling their movement and color-shifting to light blue.

## [1.0.15] - 2026-04-18
### Laser Damage Scaling
- **Feature**: Upgraded the Laser to a tiered damage system.
- **Technical Detail**: 
  - Introduced `laserLvl` (Max 10). 
  - Damage calculation: `15 + (laserLvl - 1) * 2`. 
  - Laser upgrade now simultaneously increases damage and the chance of firing.

## [1.0.14] - 2026-04-18
### Continue System & Heart Logic
- **Feature**: Added "Continue" option and improved cooperative revival.
- **Technical Detail**:
  - **Continue**: Implemented `continueGame()` which revives all players with 300 frames of invincibility without resetting the score or level.
  - **Heart Spawn**: Modified `Heart` spawn conditions to check if *any* player is dead, regardless of mode. Increased random spawn chance to 1% per frame.

## [1.0.13] - 2026-04-18
### Overlay Management
- **Bug**: Fixed persisting overlays between game sessions.
- **Technical Detail**: Explicitly called `.classList.remove('active')` on both `upgrade-overlay` and `pause-overlay` within the `startGame()` function to ensure a clean state.

## [1.0.12] - 2026-04-18
### Heart Placement Refinement
- **Bug**: Fixed uncollectible hearts.
- **Technical Detail**: Adjusted the Heart spawn Y-coordinate from `height - 80` to `height - 60` to ensure overlap with the Player hitbox (positioned at `height - 40`).

## [1.0.11] - 2026-04-18
### Critical Syntax Fix
- **Bug**: Fixed "Illegal break statement" crash.
- **Technical Detail**: Replaced an illegal `break` statement inside a `forEach` loop with a `return` in the Boss collision logic. This fixed a SyntaxError that was preventing the entire script from loading in the browser.

## [1.0.0] - 2026-04-18
### Initial Release
- **Core Features**:
  - 2-Player Local Co-op with independent scoring.
  - Procedural SFX/BGM engine.
  - 3 Upgrade paths (Rapid Fire, Explosion, Laser).
  - Persistent SQLite High Score system.
