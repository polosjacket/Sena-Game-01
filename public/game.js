/**
 * 8-Bit Space Invaders Duo - Game Logic
 */

// Sound Engine
/**
 * Procedural Sound Engine using Web Audio API.
 * Generates all game audio (BGM, SFX) without external assets.
 */
class SoundEffects {
    constructor() {
        this.ctx = null; // AudioContext initialized on user interaction
        this.bgmOsc = null; // Track BGM oscillator for stopping/starting
        this.winOscs = []; // Track win theme oscillators for stopping
    }

    init() {
        if (this.ctx) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.error('AudioContext not supported', e);
        }
    }

    playShootPlayer() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    playShootEnemy() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    }

    playExplosion() {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * 0.2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
        noise.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
    }

    playHitSFX() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    playWinJingle() {
        if (!this.ctx) return;
        // Kirby Win Theme (Simplified)
        const notes = [
            { f: 523.25, d: 0.1 }, // C5
            { f: 392.00, d: 0.1 }, // G4
            { f: 523.25, d: 0.1 }, // C5
            { f: 392.00, d: 0.1 }, // G4
            { f: 523.25, d: 0.05 }, // C5
            { f: 587.33, d: 0.05 }, // D5
            { f: 659.25, d: 0.05 }, // E5
            { f: 698.46, d: 0.05 }, // F5
            { f: 783.99, d: 0.2 }, // G5
            { f: 1046.50, d: 0.4 } // C6
        ];
        let time = this.ctx.currentTime;
        notes.forEach(n => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = n.f;
            gain.gain.setValueAtTime(0.05, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + n.d);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(time);
            osc.stop(time + n.d);
            time += n.d + 0.02;
        });
    }

    playLoseJingle() {
        if (!this.ctx) return;
        const notes = [392.00, 349.23, 311.13, 261.63]; // G4 F4 Eb4 C4
        notes.forEach((note, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.value = note;
            gain.gain.setValueAtTime(0.05, this.ctx.currentTime + i * 0.2);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.2 + 0.2);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + i * 0.2);
            osc.stop(this.ctx.currentTime + i * 0.2 + 0.2);
        });
    }

    playIntroBGM() {
        if (!this.ctx || this.bgmOsc) return;
        const tempo = 80;
        const beat = 60 / tempo;
        const melody = [261.63, 293.66, 311.13, 349.23]; // C D Eb F
        let i = 0;

        const nextNote = () => {
            if (gameState !== 'SETUP') {
                this.bgmOsc = null;
                return;
            }
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = melody[i % melody.length];
            gain.gain.value = 0.03;
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + beat * 0.8);
            i++;
            setTimeout(nextNote, beat * 1000);
        };
        this.bgmOsc = true;
        nextNote();
    }

    playBGM() {
        if (!this.ctx || this.bgmOsc) return;
        const tempo = 120;
        const beat = 60 / tempo;
        const melody = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63]; // C E G C G E
        let i = 0;

        const nextNote = () => {
            if (gameState !== 'PLAYING' && gameState !== 'WIN_ANIMATION' && gameState !== 'UPGRADING') {
                this.bgmOsc = null;
                return;
            }
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = melody[i % melody.length];
            gain.gain.value = 0.05;
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + beat * 0.5);
            i++;
            setTimeout(nextNote, beat * 500);
        };
        this.bgmOsc = true;
        nextNote();
    }
}

const sfx = new SoundEffects();

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 500;

// Game State
let gameState = 'SETUP';
let difficulty = 'low';
let playerMode = 2; // Default to 2 players
let players = [];
let invaders = [];
let boss = null;
let playerBullets = [];
let invaderBullets = [];
let level = 1;
let animationId;
let currentUpgradingPlayer = 0;
let heart = null;
let heartSpawnedInRound = false;

// Constants
const PLAYER_SPEED = 5;
const BULLET_SPEED = 7;
const INVADER_SIZE = 30;
const PLAYER_SIZE = 40;

// Fireworks logic
let fireworks = [];
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        };
        this.alpha = 1;
        this.friction = 0.95;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 3, 3);
        ctx.globalAlpha = 1;
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}

function createFirework(x, y) {
    sfx.playExplosion();
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#ff8000'];
    for (let i = 0; i < 50; i++) {
        fireworks.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]));
    }
}

// Input Handling
const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

// Classes
/**
 * Player class managing ship state, movement, shooting, and upgrades.
 * Interaction: Interacts with Bullet (spawning) and Heart (revival).
 */
class Player {
    constructor(id, name, x, y, color, keys) {
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.color = color;
        this.keys = keys;
        this.alive = true;
        this.score = 0;
        this.cooldown = 0; // Frames until next shot
        this.invincible = 0; // Frames of invincibility
        
        // Dynamic stats modified by the Upgrade Screen
        this.upgrades = {
            rapid: 1, // Reduces fire cooldown (Level 1-9)
            explosion: 0.1, // Chance of area-of-effect damage
            laser: 0.1, // Chance of firing a piercing laser
            laserLvl: 1, // Damage multiplier for lasers
            freeze: 0 // Chance of freezing enemies in place
        };
    }

    draw() {
        if (!this.alive) return;

        ctx.save();
        ctx.translate(this.x, this.y);

        // Flash if invincible
        if (this.invincible > 0 && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        if (this.id === 1) { // KIRBY
            // Body
            ctx.fillStyle = '#ffafcc';
            ctx.beginPath();
            ctx.arc(20, 25, 15, 0, Math.PI * 2);
            ctx.fill();
            // Feet
            ctx.fillStyle = '#ff0054';
            ctx.fillRect(5, 35, 10, 5);
            ctx.fillRect(25, 35, 10, 5);
            // Eyes
            ctx.fillStyle = '#000';
            ctx.fillRect(15, 20, 3, 6);
            ctx.fillRect(22, 20, 3, 6);
            // Blush
            ctx.fillStyle = '#ff8fab';
            ctx.fillRect(10, 28, 4, 2);
            ctx.fillRect(26, 28, 4, 2);
        } else { // MARIO
            // Shoes
            ctx.fillStyle = '#5d4037';
            ctx.fillRect(8, 35, 10, 5);
            ctx.fillRect(22, 35, 10, 5);
            // Overalls
            ctx.fillStyle = '#0d47a1';
            ctx.fillRect(10, 20, 20, 15);
            // Shirt/Arms
            ctx.fillStyle = '#d32f2f';
            ctx.fillRect(5, 22, 5, 8);
            ctx.fillRect(30, 22, 5, 8);
            ctx.fillRect(12, 18, 16, 5);
            // Head
            ctx.fillStyle = '#ffccbc';
            ctx.fillRect(12, 8, 16, 10);
            // Hat
            ctx.fillStyle = '#d32f2f';
            ctx.fillRect(10, 5, 20, 5);
            ctx.fillRect(12, 2, 16, 3);
            // Eyes/Mustache
            ctx.fillStyle = '#000';
            ctx.fillRect(20, 10, 2, 3);
            ctx.fillRect(18, 15, 8, 2);
        }

        ctx.restore();
    }

    update() {
        if (!this.alive) return;
        
        if (this.invincible > 0) this.invincible--;

        if (keys[this.keys.left] && this.x > 0) this.x -= PLAYER_SPEED;
        if (keys[this.keys.right] && this.x < canvas.width - this.width) this.x += PLAYER_SPEED;
        if (keys[this.keys.up] && this.y > 0) this.y -= PLAYER_SPEED;
        if (keys[this.keys.down] && this.y < canvas.height - this.height) this.y += PLAYER_SPEED;

        if (keys[this.keys.shoot] && this.cooldown <= 0) {
            const isLaser = Math.random() < this.upgrades.laser;
            sfx.playShootPlayer();
            if (isLaser) {
                playerBullets.push(new Bullet(this.x + this.width / 2 - 10, 0, '#ffffff', 0, this.id, 'laser'));
            } else {
                playerBullets.push(new Bullet(this.x + this.width / 2 - 2, this.y, this.color, -BULLET_SPEED, this.id, 'normal'));
            }
            this.cooldown = Math.max(4, 20 - (this.upgrades.rapid - 1) * 2);
        }

        if (this.cooldown > 0) this.cooldown--;
    }
}

class Heart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.timer = 600; // 10 seconds at 60fps
    }

    draw() {
        ctx.fillStyle = '#ff0054';
        // Simple heart pixel art
        ctx.fillRect(this.x + 10, this.y, 10, 5);
        ctx.fillRect(this.x + 5, this.y + 5, 20, 5);
        ctx.fillRect(this.x, this.y + 10, 30, 10);
        ctx.fillRect(this.x + 5, this.y + 20, 20, 5);
        ctx.fillRect(this.x + 10, this.y + 25, 10, 5);
        
        // Draw timer bar
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x, this.y - 10, (this.timer / 600) * this.width, 3);
    }

    update() {
        this.timer--;
        return this.timer > 0;
    }
}

class Invader {
    constructor(x, y, speed, hp) {
        this.x = x;
        this.y = y;
        this.width = INVADER_SIZE;
        this.height = INVADER_SIZE;
        this.speed = speed;
        this.maxHp = hp;
        this.hp = hp;
        this.alive = true;
        this.frozen = 0; // Frames
    }

    draw() {
        if (this.frozen > 0) ctx.fillStyle = '#caf0f8';
        else if (this.hp < this.maxHp) ctx.fillStyle = '#b79bed'; // Damaged color
        else ctx.fillStyle = '#cdb4db';
        
        // Simple 8-bit invader shape
        ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
        ctx.fillRect(this.x + 10, this.y + 2, 10, 5); // top
        ctx.fillRect(this.x + 2, this.y + 10, 5, 10); // sides
        ctx.fillRect(this.x + 23, this.y + 10, 5, 10);
    }

    update(direction) {
        if (this.frozen > 0) {
            this.frozen--;
            return;
        }
        this.x += this.speed * direction;
    }
}

/**
 * Boss Class: Advanced enemy that appears every 10 levels.
 * Features a multi-state attack machine (Slams, Sweeps, Lasers).
 * Interaction: Collision triggers endGame or damages player.
 */
class Boss {
    constructor(hp, level) {
        this.width = 100;
        this.height = 100;
        this.x = (canvas.width - this.width) / 2;
        this.y = 50;
        this.maxHp = hp;
        this.hp = hp;
        this.speed = 2;
        this.direction = 1;
        this.color = '#ff0054';
        this.level = level;
        this.attackTimer = 0;
        this.attackState = 'IDLE'; // IDLE, WARNING, SLAM, SIDE, LASER
        this.warningAreas = [];
        this.slamTimer = 0;
        this.sideDir = 0;
        this.laserX = -100;
    }

    draw() {
        // Draw Warning Areas
        this.warningAreas.forEach(area => {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.fillRect(area.x, 0, area.w, canvas.height);
        });

        if (this.attackState === 'LASER') {
            ctx.fillStyle = 'rgba(255, 0, 255, 0.8)';
            ctx.fillRect(this.x + this.width/2 - 20, this.y + this.height, 40, canvas.height);
        }

        ctx.fillStyle = this.color;
        // 8-bit Boss Face
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw Hands/Fingers if level >= 20
        if (this.level >= 20) {
            ctx.fillStyle = this.color;
            if (this.level >= 40) {
                // 4 Fingers
                ctx.fillRect(this.x - 50, this.y + 20, 15, 40);
                ctx.fillRect(this.x - 30, this.y + 20, 15, 40);
                ctx.fillRect(this.x + this.width + 15, this.y + 20, 15, 40);
                ctx.fillRect(this.x + this.width + 35, this.y + 20, 15, 40);
            } else if (this.level >= 30) {
                // 2 Fingers
                ctx.fillRect(this.x - 40, this.y + 20, 25, 40);
                ctx.fillRect(this.x + this.width + 15, this.y + 20, 25, 40);
            } else {
                // 1 Finger
                ctx.fillRect(this.x + this.width / 2 - 15, this.y - 50, 30, 40);
            }
        }

        // Eyes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 20, this.y + 20, 20, 20);
        ctx.fillRect(this.x + 60, this.y + 20, 20, 20);
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.x + 25, this.y + 25, 10, 10);
        ctx.fillRect(this.x + 65, this.y + 25, 10, 10);
        
        // Health Bar
        const barWidth = 300;
        const barHeight = 15;
        const barX = (canvas.width - barWidth) / 2;
        const barY = 15;
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        ctx.fillStyle = '#ff0054';
        ctx.fillRect(barX, barY, (this.hp / this.maxHp) * barWidth, barHeight);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        ctx.lineWidth = 1;
    }

    update() {
        if (this.attackState === 'IDLE') {
            this.x += this.speed * this.direction;
            if (this.x + this.width > canvas.width || this.x < 0) {
                this.direction *= -1;
                this.y += 5;
            }
            this.attackTimer++;

            // Trigger attacks
            if (this.level >= 20 && this.attackTimer > 180) {
                if (this.level >= 100 && Math.random() < 0.3) {
                    this.attackState = 'LASER';
                    this.attackTimer = 0;
                } else if (this.level >= 70 && Math.random() < 0.3) {
                    this.attackState = 'SIDE';
                    this.sideDir = Math.random() < 0.5 ? -1 : 1;
                    this.attackTimer = 0;
                } else {
                    this.attackState = 'WARNING';
                    let numSlams = 1;
                    if (this.level >= 40) numSlams = 4;
                    else if (this.level >= 30) numSlams = 2;
                    
                    this.warningAreas = [];
                    for(let i=0; i<numSlams; i++) {
                        this.warningAreas.push({ x: Math.random() * (canvas.width - 80), w: 80 });
                    }
                    this.attackTimer = 0;
                }
            }
        } else if (this.attackState === 'WARNING') {
            this.slamTimer++;
            if (this.slamTimer > 60) {
                this.attackState = 'SLAM';
                this.slamTimer = 0;
                sfx.playExplosion();
            }
        } else if (this.attackState === 'SLAM') {
            this.slamTimer++;
            // Check collision with players in warning areas
            this.warningAreas.forEach(area => {
                players.forEach(p => {
                    if (p.alive && p.invincible <= 0 && p.x < area.x + area.w && p.x + p.width > area.x) {
                        p.alive = false;
                        if (players.every(pl => !pl.alive)) endGame();
                    }
                });
            });
            if (this.slamTimer > 20) {
                this.attackState = 'IDLE';
                this.warningAreas = [];
                this.slamTimer = 0;
            }
        } else if (this.attackState === 'SIDE') {
            this.x += this.speed * 4 * this.sideDir;
            if (this.x < -100 || this.x > canvas.width) {
                this.attackState = 'IDLE';
                this.x = (canvas.width - this.width) / 2;
                this.y = 50;
            }
            // Dangerous area: entire screen except one gap
            const safeX = canvas.width / 2 - 100;
            const safeW = 200;
            players.forEach(p => {
                if (p.alive && p.invincible <= 0 && (p.x < safeX || p.x + p.width > safeX + safeW)) {
                    p.alive = false;
                    if (players.every(pl => !pl.alive)) endGame();
                }
            });
        } else if (this.attackState === 'LASER') {
            this.slamTimer++;
            players.forEach(p => {
                if (p.alive && p.invincible <= 0 && p.x < this.x + this.width/2 + 20 && p.x + p.width > this.x + this.width/2 - 20) {
                    p.alive = false;
                    if (players.every(pl => !pl.alive)) endGame();
                }
            });
            if (this.slamTimer > 60) {
                this.attackState = 'IDLE';
                this.slamTimer = 0;
            }
        }

        if (Math.random() < 0.05) {
            invaderBullets.push(new Bullet(this.x + Math.random() * this.width, this.y + this.height, '#ff0054', 4));
        }

        if (this.y + this.height > canvas.height - 50) {
            endGame();
        }
    }
}

class Bullet {
    constructor(x, y, color, speed, ownerId = null, type = 'normal') {
        this.x = x;
        this.y = y;
        this.width = type === 'laser' ? 20 : 4;
        this.height = type === 'laser' ? canvas.height : 10;
        this.color = color;
        this.speed = speed;
        this.ownerId = ownerId;
        this.type = type;
        this.life = type === 'laser' ? 10 : 100; // Laser lasts 10 frames
    }

    draw() {
        ctx.fillStyle = this.color;
        if (this.type === 'laser') {
            ctx.globalAlpha = this.life / 10;
            ctx.fillRect(this.x, 0, this.width, canvas.height);
            ctx.globalAlpha = 1;
        } else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    update() {
        if (this.type === 'laser') {
            this.life--;
        } else {
            this.y += this.speed;
        }
    }
}

// Game Functions
function initInvaders() {
    invaders = [];
    let rows, cols, speed;

    if (difficulty === 'low') {
        rows = 3; cols = 6; speed = 1;
    } else if (difficulty === 'medium') {
        rows = 4; cols = 8; speed = 2;
    } else {
        rows = 5; cols = 10; speed = 3;
    }

    heart = null;
    heartSpawnedInRound = false;
    boss = null;

    if (level % 10 === 0) {
        const bossHp = 100 + (level / 10 - 1) * 50;
        boss = new Boss(bossHp, level);
        return;
    }

    const padding = 20;
    const startX = (canvas.width - (cols * (INVADER_SIZE + padding))) / 2;

    const invaderHp = 1 + Math.floor((level - 1) / 5);
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            invaders.push(new Invader(startX + c * (INVADER_SIZE + padding), 50 + r * (INVADER_SIZE + padding), speed, invaderHp));
        }
    }
}

function startGame() {
    const p1Name = document.getElementById('player1-name').value || 'PILOT 1';
    const p2Name = document.getElementById('player2-name').value || 'PILOT 2';

    players = [];
    players.push(new Player(1, p1Name, canvas.width / 4, canvas.height - 40, '#bde0fe', { 
        left: 'KeyA', 
        right: 'KeyD', 
        up: 'KeyW', 
        down: 'KeyS', 
        shoot: 'Space' 
    }));
    
    if (playerMode === 2) {
        players.push(new Player(2, p2Name, 3 * canvas.width / 4, canvas.height - 40, '#ffafcc', { 
            left: 'ArrowLeft', 
            right: 'ArrowRight', 
            up: 'ArrowUp', 
            down: 'ArrowDown', 
            shoot: 'Enter' 
        }));
    }

    playerBullets = [];
    invaderBullets = [];
    level = 1;
    initInvaders();

    document.getElementById('setup-screen').classList.remove('active');
    document.getElementById('game-over-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    document.getElementById('upgrade-overlay').classList.remove('active');
    document.getElementById('pause-overlay').classList.remove('active');

    sfx.init();
    sfx.playBGM();
    gameState = 'PLAYING';
    gameLoop();
}

function continueGame() {
    players.forEach(p => {
        p.alive = true;
        p.invincible = 300; // 5 seconds
        p.cooldown = 0;
    });
    
    playerBullets = [];
    invaderBullets = [];
    heart = null;
    heartSpawnedInRound = false;
    
    document.getElementById('game-over-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    document.getElementById('pause-overlay').classList.remove('active');
    document.getElementById('upgrade-overlay').classList.remove('active');
    
    sfx.init();
    sfx.playBGM();
    gameState = 'PLAYING';
    gameLoop();
}

let invaderDirection = 1;
let invaderDrop = false;

/**
 * Main Game Loop (called via requestAnimationFrame).
 * Orchestrates: Movement -> Collision -> Drawing -> State Transitions.
 */
function gameLoop() {
    if (gameState === 'PAUSED' || gameState === 'UPGRADING') {
        animationId = requestAnimationFrame(gameLoop);
        // During UPGRADING, we still want to draw the background and fireworks
        if (gameState === 'UPGRADING') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Draw players and fireworks so it doesn't look dead
            players.forEach(p => p.draw());
            fireworks.forEach((p, index) => {
                if (p.alpha <= 0) {
                    fireworks.splice(index, 1);
                } else {
                    p.update();
                    p.draw();
                }
            });
        }
        return;
    }
    if (gameState !== 'PLAYING' && gameState !== 'WIN_ANIMATION') return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update & Draw Players
    players.forEach(p => {
        p.update();
        p.draw();
    });

    // Update HUD
    document.getElementById('p1-score').textContent = players[0].score;
    if (playerMode === 2) {
        document.getElementById('p2-score').parentElement.style.display = 'block';
        document.getElementById('p2-score').textContent = players[1].score;
    } else {
        document.getElementById('p2-score').parentElement.style.display = 'none';
    }
    document.getElementById('level-display').textContent = level;

    // Update & Draw Boss
    if (boss) {
        boss.update();
        boss.draw();
    }

    // Update & Draw Invaders
    let edgeReached = false;
    invaders.forEach(inv => {
        inv.update(invaderDirection);
        inv.draw();

        if (inv.x + inv.width > canvas.width || inv.x < 0) edgeReached = true;
        
        // Game Over condition: Invaders reach bottom
        if (inv.y + inv.height > canvas.height - 50) {
            endGame();
        }

        // Randomly shoot
        if (Math.random() < 0.001 * (difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1)) {
            sfx.playShootEnemy();
            invaderBullets.push(new Bullet(inv.x + inv.width / 2, inv.y + inv.height, '#cdb4db', 3));
        }
    });

    if (edgeReached) {
        invaderDirection *= -1;
        invaders.forEach(inv => inv.y += 20);
    }

    // Update & Draw Bullets
    playerBullets = playerBullets.filter(b => (b.type === 'laser' ? b.life > 0 : b.y > 0));
    /**
     * Bullet Collision Engine
     * Checks interactions between player/enemy bullets and targets.
     */
    playerBullets.forEach((b, bIdx) => {
        b.update();
        b.draw();

        // Check collision with invaders
        const player = players.find(p => p.id === b.ownerId);
        
        // Boss collision
        if (boss) {
            if (b.x < boss.x + boss.width && b.x + b.width > boss.x && b.y < boss.y + boss.height && b.y + b.height > boss.y) {
                if (b.type === 'normal') playerBullets.splice(bIdx, 1);
                const laserDmg = 15 + (player.upgrades.laserLvl - 1) * 2;
                boss.hp -= (b.type === 'laser' ? laserDmg : 10);
                sfx.playHitSFX();
                if (boss.hp <= 0) {
                    player.score += 1000;
                    boss = null;
                }
                if (b.type === 'normal') return;
            }
        }

        for (let i = invaders.length - 1; i >= 0; i--) {
            const inv = invaders[i];
            if (b.x < inv.x + inv.width && b.x + b.width > inv.x && b.y < inv.y + inv.height && b.y + b.height > inv.y) {
                // Damage invader
                inv.hp -= 1;
                sfx.playHitSFX();

                if (inv.hp <= 0) {
                    invaders.splice(i, 1);
                    player.score += 100;
                    
                    // Explosion check
                    if (Math.random() < player.upgrades.explosion) {
                        createFirework(inv.x + inv.width / 2, inv.y + inv.height / 2); // Visual effect
                        invaders = invaders.filter(otherInv => {
                            const dist = Math.hypot(otherInv.x - inv.x, otherInv.y - inv.y);
                            if (dist < 80 && otherInv !== inv) {
                                player.score += 50;
                                return false;
                            }
                            return true;
                        });
                    }

                    // Freeze check
                    if (Math.random() < player.upgrades.freeze) {
                        invaders.forEach(invToFreeze => {
                            if (Math.abs(invToFreeze.x - b.x) < 50) invToFreeze.frozen = 120;
                        });
                    }
                }

                // If it's a normal bullet, remove it
                if (b.type === 'normal') {
                    playerBullets.splice(bIdx, 1);
                    break;
                }
            }
        }
    });

    invaderBullets = invaderBullets.filter(b => b.y < canvas.height);
    invaderBullets.forEach((b, bIdx) => {
        b.update();
        b.draw();

        // Check collision with players
        players.forEach(p => {
            if (p.alive && p.invincible <= 0) {
                if (b.x < p.x + p.width && b.x + b.width > p.x && b.y < p.y + p.height && b.y + b.height > p.y) {
                    p.alive = false;
                    invaderBullets.splice(bIdx, 1);
                    
                    // Only end game if all players dead
                    if (players.every(pl => !pl.alive)) {
                        endGame();
                    }
                }
            }
        });
    });

    // Update & Draw Heart
    if (players.some(p => !p.alive) && !heart && !heartSpawnedInRound) {
        if (Math.random() < 0.01) { // Increased spawn chance
            heart = new Heart(Math.random() * (canvas.width - 30), canvas.height - 60);
        }
    }

    if (heart) {
        heart.draw();
        if (!heart.update()) {
            heart = null;
            heartSpawnedInRound = true; // Wait for next round
        } else {
            // Check collision with living players
            players.forEach(p => {
                if (p.alive && heart && p.x < heart.x + heart.width && p.x + p.width > heart.x && p.y < heart.y + heart.height && p.y + p.height > heart.y) {
                    const deadPlayer = players.find(pl => !pl.alive);
                    if (deadPlayer) {
                        deadPlayer.alive = true;
                        deadPlayer.invincible = 300; // 5 seconds
                        deadPlayer.x = p.x; // Spawn near teammate
                        deadPlayer.y = p.y;
                    }
                    heart = null;
                    heartSpawnedInRound = true;
                }
            });
        }
    }

    // Update & Draw Fireworks
    fireworks.forEach((p, index) => {
        if (p.alpha <= 0) {
            fireworks.splice(index, 1);
        } else {
            p.update();
            p.draw();
        }
    });

    // Check Win Condition (All Invaders + Boss defeated)
    if (invaders.length === 0 && !boss && gameState === 'PLAYING') {
        gameState = 'WIN_ANIMATION';
        // Create multiple fireworks
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                createFirework(Math.random() * canvas.width, Math.random() * canvas.height);
            }, i * 200);
        }
        
        setTimeout(() => {
            if (gameState === 'WIN_ANIMATION') {
                showUpgradeScreen();
            }
        }, 3000);
    }

    animationId = requestAnimationFrame(gameLoop);
}

function showUpgradeScreen() {
    gameState = 'UPGRADING';
    sfx.playWinJingle();
    currentUpgradingPlayer = 0;
    
    // Show freeze card if level was a boss level
    if (level % 10 === 0) {
        document.getElementById('freeze-card').classList.remove('hidden');
    } else {
        document.getElementById('freeze-card').classList.add('hidden');
    }
    
    updateUpgradeOverlay();
    document.getElementById('upgrade-overlay').classList.add('active');
}

function updateUpgradeOverlay() {
    const player = players[currentUpgradingPlayer];
    document.getElementById('upgrade-title').textContent = `${player.name.toUpperCase()} UPGRADE`;
    
    // Update card levels
    const cards = document.querySelectorAll('.card');
    cards[0].querySelector('.level-info').textContent = `LVL ${player.upgrades.rapid}/9`;
    cards[1].querySelector('.level-info').textContent = `${Math.round(player.upgrades.explosion * 100)}% CHANCE`;
    cards[2].querySelector('.level-info').textContent = `LVL ${player.upgrades.laserLvl}/10 (${Math.round(player.upgrades.laser * 100)}% CHANCE)`;
    cards[3].querySelector('.level-info').textContent = `${Math.round(player.upgrades.freeze * 100)}% CHANCE`;
}

function selectUpgrade(type) {
    console.log('Upgrading:', type, 'for player:', currentUpgradingPlayer);
    try { sfx.stopWinTheme(); } catch(e) {}
    
    const player = players[currentUpgradingPlayer];
    
    if (type === 'rapid' && player.upgrades.rapid < 9) {
        player.upgrades.rapid++;
    } else if (type === 'explosion' && player.upgrades.explosion < 0.5) {
        player.upgrades.explosion += 0.1;
    } else if (type === 'laser' && player.upgrades.laserLvl < 10) {
        player.upgrades.laserLvl++;
        if (player.upgrades.laser < 0.5) player.upgrades.laser += 0.1;
    } else if (type === 'freeze' && player.upgrades.freeze < 0.5) {
        player.upgrades.freeze += 0.1;
    }

    if (playerMode === 2 && currentUpgradingPlayer === 0) {
        currentUpgradingPlayer = 1;
        updateUpgradeOverlay();
    } else {
        document.getElementById('upgrade-overlay').classList.remove('active');
        level++;
        initInvaders();
        gameState = 'PLAYING';
    }
}

function endGame() {
    gameState = 'GAME_OVER';
    cancelAnimationFrame(animationId);
    sfx.playLoseJingle();

    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('game-over-screen').classList.add('active');

    document.getElementById('final-p1-name').textContent = players[0].name;
    document.getElementById('final-p1-score').textContent = players[0].score;
    saveScore(players[0].name, players[0].score);

    if (playerMode === 2) {
        document.getElementById('final-p2-name').parentElement.style.display = 'block';
        document.getElementById('final-p2-name').textContent = players[1].name;
        document.getElementById('final-p2-score').textContent = players[1].score;
        saveScore(players[1].name, players[1].score);
    } else {
        document.getElementById('final-p2-name').parentElement.style.display = 'none';
    }
}

async function saveScore(name, score) {
    try {
        await fetch('/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, score, difficulty })
        });
        loadScores();
    } catch (err) {
        console.error('Failed to save score:', err);
    }
}

async function loadScores() {
    try {
        const res = await fetch('/api/scores');
        const data = await res.json();
        const list = document.getElementById('score-list');
        list.innerHTML = '';
        data.slice(0, 3).forEach(s => {
            const li = document.createElement('li');
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = `${s.name} (${s.difficulty})`;
            
            const scoreSpan = document.createElement('span');
            scoreSpan.textContent = s.score;
            
            li.appendChild(nameSpan);
            li.appendChild(scoreSpan);
            list.appendChild(li);
        });
    } catch (err) {
        console.error('Failed to load scores:', err);
    }
}

function togglePause() {
    if (gameState === 'PLAYING') {
        gameState = 'PAUSED';
        document.getElementById('pause-overlay').classList.add('active');
        document.getElementById('pause-btn').textContent = 'RESUME';
    } else if (gameState === 'PAUSED') {
        gameState = 'PLAYING';
        document.getElementById('pause-overlay').classList.remove('active');
        document.getElementById('pause-btn').textContent = 'PAUSE';
    }
}

function quitToMenu() {
    gameState = 'SETUP';
    cancelAnimationFrame(animationId);
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('pause-overlay').classList.remove('active');
    document.getElementById('setup-screen').classList.add('active');
    loadScores();
}

// Safe Listener Attachment
function safeAddListener(id, event, callback) {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener(event, callback);
    } else {
        console.warn(`Could not find element with id: ${id}`);
    }
}

/**
 * UI Event Listeners Initialization
 * Connects HTML buttons to JS functions and manages responsiveness.
 */
function initUIListeners() {
    // Mission Start
    safeAddListener('start-btn', 'click', startGame);
    safeAddListener('pause-btn', 'click', togglePause);
    safeAddListener('quit-btn', 'click', quitToMenu);
    
    // Continue/Retry actions
    safeAddListener('continue-btn', 'click', continueGame);
    safeAddListener('restart-btn', 'click', () => {
        document.getElementById('game-over-screen').classList.remove('active');
        document.getElementById('setup-screen').classList.add('active');
        loadScores();
    });

    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            difficulty = btn.dataset.difficulty;
        });
    });

    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            playerMode = parseInt(btn.dataset.players);
            initPlayerMode();
        });
    });

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            console.log('Card clicked:', card.dataset.upgrade, 'Current State:', gameState);
            if (gameState === 'UPGRADING') selectUpgrade(card.dataset.upgrade);
        });
    });

    window.addEventListener('keydown', e => {
        if (e.code === 'KeyP') togglePause();
    });
}

function initPlayerMode() {
    const p2Input = document.getElementById('p2-input');
    if (p2Input) {
        if (playerMode === 1) {
            p2Input.classList.add('hidden');
        } else {
            p2Input.classList.remove('hidden');
        }
    }
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    initUIListeners();
    initPlayerMode();
    loadScores();
});

// Intro Sound & Audio Init
window.addEventListener('mousedown', () => {
    try {
        sfx.init();
        if (gameState === 'SETUP') sfx.playIntroBGM();
    } catch (e) {}
}, { once: true });
