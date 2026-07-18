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

    playPowerUp() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
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

// Mobile Detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || ('ontouchstart' in window);
const touchState = { left: false, right: false, shoot: false, shield: false, shockwave: false };


// Game State
let gameState = 'SETUP';
let difficulty = 'low';
let playerMode = 2; // Default to 2 players
let players = [];
let invaders = [];
let boss = null;
let playerBullets = [];
let playerShockwaves = [];
let invaderBullets = [];
let drones = [];
let keepDrones = false;
let hWasDown = false;
let level = 1;
let swordSwingShown = false;
let animationId;
let currentUpgradingPlayer = 0;
let heart = null;
let heartSpawnedInRound = false;
let totalLives = 3;
let maxLives = 3;

// Socket.io initialization
const socket = io();

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
    if (fireworks.length > 300) return; // Performance cap
    sfx.playExplosion();
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#ff8000'];
    for (let i = 0; i < 15; i++) {
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
            laser: 0.1, // Enables laser ability (Double Tap)
            laserLvl: 1, // Damage multiplier for lasers
            freeze: 0, // Chance of freezing enemies in place
            speed: PLAYER_SPEED, // Ship movement speed
            shield: 0, // Number of attacks the shield can block
            shockwave: 0, // Number of shockwaves you can fire
            drone: 0, // Number of helper drones you can spawn
            sword_swing: 0 // Level of sword swing returning spinning sword
        };

        this.activeShields = 0;
        this.shieldCooldown = 0;
        this.shockwaveCooldown = 0;

        // Laser mechanics
        this.laserCooldown = 0;
        this.lastShootPressTime = 0;
        this.shootWasDown = false;
        this.xWasDown = false;
        this.iWasDown = false;

    }

    draw() {
        if (!this.alive) return;

        ctx.save();
        ctx.translate(this.x, this.y);

        // Draw shield ring if active
        if (this.activeShields > 0) {
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.width / 2, this.height / 2, 25 + (this.activeShields * 2), 0, Math.PI * 2);
            ctx.stroke();
            ctx.lineWidth = 1;
        }

        // Flash if invincible
        if (this.invincible > 0 && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        if (this.id === 1) {
            // Kirby (P1)
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
        } else if (this.id === 2 || this.id === 3) {
            // Mario (P2) or Luigi (P3)
            // Shoes
            ctx.fillStyle = this.id === 2 ? '#5d4037' : '#3e2723';
            ctx.fillRect(8, 35, 10, 5);
            ctx.fillRect(22, 35, 10, 5);
            // Overalls
            ctx.fillStyle = this.id === 2 ? '#0d47a1' : '#1b5e20';
            ctx.fillRect(10, 20, 20, 15);
            // Shirt/Arms
            ctx.fillStyle = this.id === 2 ? '#d32f2f' : '#2e7d32';
            ctx.fillRect(5, 22, 5, 8);
            ctx.fillRect(30, 22, 5, 8);
            ctx.fillRect(12, 18, 16, 5);
            // Head
            ctx.fillStyle = '#ffccbc';
            ctx.fillRect(12, 8, 16, 10);
            // Hat
            ctx.fillStyle = this.id === 2 ? '#d32f2f' : '#2e7d32';
            ctx.fillRect(10, 5, 20, 5);
            ctx.fillRect(12, 2, 16, 3);
            // Eyes/Mustache
            ctx.fillStyle = '#000';
            ctx.fillRect(20, 10, 2, 3);
            ctx.fillRect(18, 15, 8, 2);
        }
 else if (this.id === 4) {
            // Meta Knight
            ctx.fillStyle = '#1a237e'; // Body
            ctx.beginPath();
            ctx.arc(20, 25, 15, 0, Math.PI * 2);
            ctx.fill();
            // Mask
            ctx.fillStyle = '#9e9e9e';
            ctx.beginPath();
            ctx.arc(20, 25, 12, Math.PI, 0, true);
            ctx.fill();
            // Eyes (yellow)
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(14, 20, 4, 3);
            ctx.fillRect(22, 20, 4, 3);
            // Wings
            ctx.fillStyle = '#311b92';
            ctx.beginPath();
            ctx.moveTo(5, 15); ctx.lineTo(-10, 5); ctx.lineTo(-5, 30); ctx.fill();
            ctx.moveTo(35, 15); ctx.lineTo(50, 5); ctx.lineTo(45, 30); ctx.fill();
        }

        ctx.restore();
    }

    update() {
        if (!this.alive) return;
        
        if (this.invincible > 0) this.invincible--;

        const isLeft = keys[this.keys.left] || (this.id === 1 && playerMode === 1 && keys['ArrowLeft']) || (this.id === 1 && touchState.left);
        const isRight = keys[this.keys.right] || (this.id === 1 && playerMode === 1 && keys['ArrowRight']) || (this.id === 1 && touchState.right);

        if (isLeft && this.x > 0) this.x -= this.upgrades.speed;
        if (isRight && this.x < canvas.width - this.width) this.x += this.upgrades.speed;

        // Forward movement (Space)
        if (this.id === 1 && keys['Space'] && this.y > 50) {
            this.y -= this.upgrades.speed;
        } else if (this.y < canvas.height - 40) {
            this.y += 2; // Automatic drift back to baseline
        }

        // Drone spawn logic (Press X)
        if (this.id === 1 && keys['KeyX'] && !this.xWasDown) {
            this.xWasDown = true;
            this.spawnDrone();
        }
        if (this.id === 1 && !keys['KeyX']) {
            this.xWasDown = false;
        }

        // Sword Swing logic (Press I)
        const activeSwordsCount = playerBullets.filter(b => b.type === 'sword_swing' && b.ownerId === this.id).length;
        if (this.id === 1 && keys['KeyI'] && this.upgrades.sword_swing > 0 && !this.iWasDown && activeSwordsCount < this.upgrades.sword_swing) {
            this.iWasDown = true;
            const swordSpeed = -5; // Initial upward speed
            const sword = new Bullet(
                this.x + this.width / 2 - 15,
                this.y - 20,
                '#00ffff',
                swordSpeed,
                this.id,
                'sword_swing'
            );
            playerBullets.push(sword);
            sfx.playShootPlayer();
        }
        if (this.id === 1 && !keys['KeyI']) {
            this.iWasDown = false;
        }

        // Shield Logic
        if (this.shieldCooldown > 0) this.shieldCooldown--;

        const isShieldDown = keys[this.keys.shield] || (this.id === 1 && playerMode === 1 && keys['ArrowDown']) || (this.id === 1 && touchState.shield);
        if (isShieldDown && this.upgrades.shield > 0 && this.shieldCooldown <= 0 && this.activeShields === 0) {
            this.activeShields = this.upgrades.shield;
            sfx.playPowerUp(); // Use an existing sound for activation
        }

        // Shockwave Logic
        if (this.shockwaveCooldown > 0) this.shockwaveCooldown--;

        const isShockwaveDown = keys[this.keys.shockwave] || (this.id === 1 && playerMode === 1 && keys['Slash']) || (this.id === 1 && touchState.shockwave);
        if (isShockwaveDown && this.upgrades.shockwave > 0 && this.shockwaveCooldown <= 0) {
            playerShockwaves.push(new Shockwave(this.id, this.upgrades.shockwave));
            sfx.playExplosion(); 
            this.shockwaveCooldown = 300; // 5 seconds cooldown
        }

        if (this.laserCooldown > 0) this.laserCooldown--;

        const isShootDown = keys[this.keys.shoot] || (this.id === 1 && playerMode === 1 && keys['ArrowUp']) || (this.id === 1 && touchState.shoot);
        const shootPressedThisFrame = isShootDown && !this.shootWasDown;
        this.shootWasDown = isShootDown;

        if (shootPressedThisFrame) {
            const now = Date.now();
            if (now - this.lastShootPressTime < 300 && this.laserCooldown <= 0 && this.upgrades.laser > 0) {
                const laserWidth = 20 + (this.upgrades.laserLvl * 5);
                const b = new Bullet(this.x + this.width / 2 - (laserWidth / 2), 0, '#ffffff', 0, this.id, 'laser', laserWidth);
                playerBullets.push(b);
                sfx.playShootPlayer();
                this.laserCooldown = 120; // 2 second cooldown
                this.cooldown = 15; // Small delay before normal shots resume
                this.lastShootPressTime = 0;
                return;
            }
            this.lastShootPressTime = now;
        }

        if (isShootDown && this.cooldown <= 0) {
            const b = new Bullet(this.x + this.width / 2 - 2, this.y, this.color, -7, this.id, 'normal');
            playerBullets.push(b);
            sfx.playShootPlayer();
            this.cooldown = Math.max(1, 30 - (this.upgrades.rapid * 3));
            
            if (pvp.state === 'FIGHTING' && !this.isRemote) {
                pvp.socket.emit('shoot', {
                    roomId: pvp.roomId,
                    bullet: { x: this.x + this.width / 2 - 2, y: this.y, speed: -7 }
                });
            }
        }

        if (this.cooldown > 0) this.cooldown--;

    }

    spawnDrone() {
        if (!this.alive) return;
        const activeCount = drones.filter(d => d.ownerId === this.id && d.alive).length;
        if (activeCount < this.upgrades.drone) {
            drones.push(new Drone(this.id, this.x + this.width / 2 - 12, this.y - 20));
            sfx.playPowerUp();
        }
    }
}

class Shockwave {
    constructor(ownerId, level) {
        this.ownerId = ownerId;
        this.level = level;
        this.x = 0; // Starts at left
        this.y = 0;
        this.width = 20 + (level * 5); // Width scales with level
        this.height = canvas.height; // Full screen height
        this.speed = 10;
        this.color = '#ff9800'; // Orange/Yellow wave
    }

    draw() {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.7;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Add some glowing effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ffeb3b';
        ctx.fillRect(this.x + 5, this.y, this.width - 10, this.height);
        
        ctx.restore();
    }

    update() {
        this.x += this.speed;
    }
}

class Drone {
    constructor(ownerId, x, y) {
        this.ownerId = ownerId;
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.color = '#ff003c'; // Red helper color
        this.cooldown = 0;
        this.speed = 3;
        this.direction = Math.random() < 0.5 ? 1 : -1; // Random initial direction
        this.alive = true;
    }

    update() {
        if (!this.alive) return;

        // Scanning for incoming invader bullets to dodge
        let targetBullet = null;
        let minDistance = 9999;
        
        invaderBullets.forEach(b => {
            // Check if the bullet is heading down towards this drone
            const dy = this.y - b.y;
            const dx = Math.abs((b.x + b.width / 2) - (this.x + this.width / 2));
            if (dy > 0 && dy < 150 && dx < 70) {
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < minDistance) {
                    minDistance = dist;
                    targetBullet = b;
                }
            }
        });

        let currentSpeed = this.speed;
        if (targetBullet) {
            // DODGE IN PROGRESS!
            const bulletCenterX = targetBullet.x + targetBullet.width / 2;
            const droneCenterX = this.x + this.width / 2;
            
            // Steer away horizontally from the threat
            if (bulletCenterX < droneCenterX) {
                this.direction = 1; // Move right
            } else {
                this.direction = -1; // Move left
            }
            currentSpeed = this.speed * 2.0; // Double speed for emergency dodge!
        }

        // Move horizontally alongside the player
        this.x += currentSpeed * this.direction;
        if (this.x < 20 || this.x > canvas.width - this.width - 20) {
            this.direction *= -1;
            // Bound inside canvas to prevent getting stuck
            if (this.x < 20) this.x = 20;
            if (this.x > canvas.width - this.width - 20) this.x = canvas.width - this.width - 20;
        }

        // Maintain height near the player baseline
        this.y = canvas.height - 60;

        // Automatically fire normal player bullets upwards at a steady interval
        if (this.cooldown <= 0) {
            const b = new Bullet(this.x + this.width / 2 - 2, this.y, this.color, -7, this.ownerId, 'normal');
            playerBullets.push(b);
            sfx.playShootPlayer();
            this.cooldown = 45; // Shoots every 45 frames (0.75s)
        }

        if (this.cooldown > 0) this.cooldown--;
    }

    draw() {
        if (!this.alive) return;

        ctx.save();
        ctx.translate(this.x, this.y);

        // Draw helper drone (Red spaceship saucer shape)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.width / 2, 0);
        ctx.lineTo(this.width, this.height * 0.7);
        ctx.lineTo(0, this.height * 0.7);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ff5c8a'; // Glowing light core
        ctx.fillRect(this.width * 0.2, this.height * 0.7, this.width * 0.6, this.height * 0.3);

        ctx.restore();
    }
}



class HomingSword {
    constructor(x, y, target) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 30;
        this.target = target;
        this.timer = 120; // 2 seconds at 60fps
        this.speed = 3;
        this.angle = Math.PI / 2; // Point down initially
        this.type = 'sword';
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        // Draw sword pointing towards angle
        ctx.rotate(this.angle - Math.PI / 2); 
        
        // Handle
        ctx.fillStyle = '#5c4033'; 
        ctx.fillRect(-2, -15, 4, 10);
        // Guard
        ctx.fillStyle = '#7f8c8d';
        ctx.fillRect(-8, -5, 16, 3);
        // Blade
        ctx.fillStyle = '#ecf0f1';
        ctx.beginPath();
        ctx.moveTo(-4, -2);
        ctx.lineTo(4, -2);
        ctx.lineTo(0, 15); // Tip
        ctx.fill();
        
        ctx.restore();
    }

    update() {
        if (this.timer > 0) {
            this.timer--;
            // Track target if alive
            if (this.target && this.target.alive) {
                const targetX = this.target.x + this.target.width / 2;
                const targetY = this.target.y + this.target.height / 2;
                const dx = targetX - (this.x + this.width / 2);
                const dy = targetY - (this.y + this.height / 2);
                this.angle = Math.atan2(dy, dx);
            }
            // Move along angle
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
        } else {
            // Drop straight down after 2 seconds
            this.y += this.speed * 1.5;
        }
    }
}

class Axe {
    constructor(x, y, targetY) {
        this.x = x;
        this.y = y;
        this.width = 25;
        this.height = 25;
        this.targetY = targetY;
        this.speed = 3.5;
        this.exploded = false;
        this.explosionTimer = 0;
        this.maxExplosionTime = 40;
        this.explosionRadius = 80;
        this.type = 'axe';
        this.finished = false;
    }

    draw() {
        if (this.finished) return;

        if (this.exploded) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.explosionRadius * (this.explosionTimer / this.maxExplosionTime), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 100, 0, ${1 - this.explosionTimer / this.maxExplosionTime})`;
            ctx.fill();
            // Inner glow
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, (this.explosionRadius * 0.6) * (this.explosionTimer / this.maxExplosionTime), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 0, ${0.8 * (1 - this.explosionTimer / this.maxExplosionTime)})`;
            ctx.fill();
            ctx.restore();
            return;
        }

        // Draw Warning Area
        ctx.save();
        const alpha = 0.2 + Math.sin(Date.now() * 0.01) * 0.15;
        ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
        ctx.fillRect(this.x + this.width/2 - this.explosionRadius, this.targetY + this.height/2 - this.explosionRadius, this.explosionRadius * 2, this.explosionRadius * 2);
        ctx.strokeStyle = `rgba(255, 0, 0, ${alpha + 0.3})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 4]);
        ctx.strokeRect(this.x + this.width/2 - this.explosionRadius, this.targetY + this.height/2 - this.explosionRadius, this.explosionRadius * 2, this.explosionRadius * 2);
        ctx.restore();

        // Draw Axe
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(Date.now() * 0.015);
        
        // Blade
        ctx.fillStyle = '#bdc3c7';
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(18, -18);
        ctx.lineTo(18, 18);
        ctx.lineTo(0, 12);
        ctx.fill();
        
        // Handle
        ctx.fillStyle = '#795548';
        ctx.fillRect(-3, -8, 6, 25);
        
        ctx.restore();
    }

    update() {
        if (this.finished) return;

        if (this.exploded) {
            this.explosionTimer++;
            if (this.explosionTimer >= this.maxExplosionTime) {
                this.finished = true;
                this.y = 9999; // Move out of screen for safety filter
            }
            
            // Damage players in radius
            players.forEach(p => {
                if (p.alive && p.invincible <= 0) {
                    const dist = Math.hypot(p.x + p.width/2 - (this.x + this.width/2), p.y + p.height/2 - (this.y + this.height/2));
                    if (dist < this.explosionRadius) {
                        damagePlayer(p);
                    }
                }
            });
            return;
        }

        this.y += this.speed;
        if (this.y >= this.targetY) {
            this.exploded = true;
            sfx.playExplosion();
            createFirework(this.x + this.width / 2, this.y + this.height / 2);
        }
    }
}

class Invader {
    constructor(x, y, speed, hp, type = 'normal') {
        this.x = x;
        this.y = y;
        this.width = INVADER_SIZE;
        this.height = INVADER_SIZE;
        this.speed = speed;
        this.maxHp = hp;
        this.hp = hp;
        this.alive = true;
        this.frozen = 0; // Frames
        this.type = type;
    }

    draw() {
        if (this.frozen > 0) ctx.fillStyle = '#caf0f8';
        else if (this.type === 'swordsman') ctx.fillStyle = '#e67e22'; // Orange
        else if (this.type === 'axeman') ctx.fillStyle = '#95a5a6'; // Silver/Iron
        else if (this.hp < this.maxHp) ctx.fillStyle = '#b79bed'; // Damaged color
        else ctx.fillStyle = '#cdb4db'; // Normal color
        
        // Simple 8-bit invader shape
        ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
        ctx.fillRect(this.x + 10, this.y + 2, 10, 5); // top
        ctx.fillRect(this.x + 2, this.y + 10, 5, 10); // sides
        ctx.fillRect(this.x + 23, this.y + 10, 5, 10);

        if (this.type === 'swordsman') {
            ctx.fillStyle = '#ecf0f1';
            ctx.fillRect(this.x + 13, this.y + 10, 4, 15);
            ctx.fillStyle = '#7f8c8d';
            ctx.fillRect(this.x + 10, this.y + 10, 10, 3);
        } else if (this.type === 'axeman') {
            ctx.fillStyle = '#bdc3c7'; // Axe head
            ctx.fillRect(this.x + 15, this.y + 5, 8, 8);
            ctx.fillStyle = '#795548'; // Wood handle
            ctx.fillRect(this.x + 13, this.y + 13, 3, 10);
        }
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
        this.color = '#58cc02'; // Duolingo Green

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

        // Duolingo Owl Body (Rounded bird type)
        ctx.fillStyle = this.color;
        
        // Draw main body (rounded rectangle)
        ctx.beginPath();
        const radius = 40;
        ctx.roundRect(this.x, this.y, this.width, this.height, radius);
        ctx.fill();

        // Wings
        ctx.beginPath();
        ctx.ellipse(this.x - 10, this.y + 60, 20, 40, Math.PI/6, 0, Math.PI * 2);
        ctx.ellipse(this.x + this.width + 10, this.y + 60, 20, 40, -Math.PI/6, 0, Math.PI * 2);
        ctx.fill();

        // Ears (Tufts)
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y);
        ctx.lineTo(this.x + 30, this.y - 20);
        ctx.lineTo(this.x + 50, this.y);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(this.x + this.width - 10, this.y);
        ctx.lineTo(this.x + this.width - 30, this.y - 20);
        ctx.lineTo(this.x + this.width - 50, this.y);
        ctx.fill();
        
        // Beak
        ctx.fillStyle = '#ffc800';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2 - 15, this.y + 55);
        ctx.lineTo(this.x + this.width / 2 + 15, this.y + 55);
        ctx.lineTo(this.x + this.width / 2, this.y + 80);
        ctx.fill();

        // Eyes (Staring menacingly)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x + 30, this.y + 35, 18, 0, Math.PI * 2);
        ctx.arc(this.x + this.width - 30, this.y + 35, 18, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000000';
        // Angry pupils
        ctx.beginPath();
        ctx.arc(this.x + 30, this.y + 35, 8, 0, Math.PI * 2);
        ctx.arc(this.x + this.width - 30, this.y + 35, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw Knives (instead of fingers)
        if (this.level >= 10) {
            const drawKnife = (kx, ky) => {
                // Handle
                ctx.fillStyle = '#5c4033'; 
                ctx.fillRect(kx + 5, ky + 25, 10, 25);
                // Guard
                ctx.fillStyle = '#7f8c8d';
                ctx.fillRect(kx, ky + 25, 20, 5);
                // Blade
                ctx.fillStyle = '#ecf0f1';
                ctx.beginPath();
                ctx.moveTo(kx + 5, ky + 25);
                ctx.lineTo(kx + 15, ky + 25);
                ctx.lineTo(kx + 10, ky - 10); // Sharp point
                ctx.fill();
                // Blood detail on blade
                ctx.fillStyle = '#e74c3c';
                ctx.fillRect(kx + 10, ky, 2, 10);
            };

            // Left Knives
            if (this.level >= 10) drawKnife(this.x - 30, this.y + 20);
            if (this.level >= 30) drawKnife(this.x - 60, this.y + 20);
            // Right Knives
            if (this.level >= 20) drawKnife(this.x + this.width + 10, this.y + 20);
            if (this.level >= 40) drawKnife(this.x + this.width + 40, this.y + 20);
        }

        
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
            if (this.level >= 10 && this.attackTimer > 180) {
                const rand = Math.random();
                if (this.level >= 100 && rand < 0.2) {
                    this.attackState = 'LASER';
                    this.attackTimer = 0;
                } else if (this.level >= 70 && rand < 0.3) {
                    this.attackState = 'SIDE';
                    this.sideDir = Math.random() < 0.5 ? -1 : 1;
                    this.attackTimer = 0;
                } else if (this.level >= 20 && rand < 0.6) {
                    this.attackState = 'DASH_PREP';
                    this.dashDir = Math.random() < 0.5 ? 1 : -1;
                    // Move to start wall (off-screen)
                    this.x = this.dashDir === 1 ? -this.width : canvas.width;
                    this.y = 100 + Math.random() * (canvas.height - 300);
                    this.attackTimer = 0;
                } else {
                    this.attackState = 'WARNING';
                    const numSlams = Math.min(4, Math.floor(this.level / 10));
                    
                    this.warningAreas = [];
                    for(let i=0; i<numSlams; i++) {
                        this.warningAreas.push({ x: Math.random() * (canvas.width - 80), w: 80 });
                    }
                    this.attackTimer = 0;
                }
            }

        } else if (this.attackState === 'DASH_PREP') {
            this.attackTimer++;
            // 1 second warning
            if (this.attackTimer > 60) {
                this.attackState = 'DASHING';
                this.attackTimer = 0;
            }
        } else if (this.attackState === 'DASHING') {
            this.x += 15 * this.dashDir; // High speed dash
            
            // Collision with players
            players.forEach(p => {
                if (p.alive && p.invincible <= 0 && this.x < p.x + p.width && this.x + this.width > p.x && this.y < p.y + p.height && this.y + this.height > p.y) {
                    damagePlayer(p);
                }
            });

            if ((this.dashDir === 1 && this.x > canvas.width) || (this.dashDir === -1 && this.x < -this.width)) {
                this.attackState = 'IDLE';
                this.x = (canvas.width - this.width) / 2;
                this.y = 50;
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
                        damagePlayer(p);
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
                    damagePlayer(p);
                }
            });
        } else if (this.attackState === 'LASER') {
            this.slamTimer++;
            players.forEach(p => {
                if (p.alive && p.invincible <= 0 && p.x < this.x + this.width/2 + 20 && p.x + p.width > this.x + this.width/2 - 20) {
                    damagePlayer(p);
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
    constructor(x, y, color, speed, ownerId = null, type = 'normal', widthOverride = null) {
        this.x = x;
        this.y = y;
        this.ownerId = ownerId;
        this.type = type;

        const player = players.find(p => p.id === ownerId) || { upgrades: { sword_swing: 1 } };
        const swordLevel = player.upgrades.sword_swing || 1;

        this.width = widthOverride !== null ? widthOverride : (type === 'laser' ? 20 : (type === 'sword_swing' ? 24 + swordLevel * 4 : 4));
        this.height = type === 'laser' ? canvas.height : (type === 'sword_swing' ? 24 + swordLevel * 4 : 10);
        this.color = color;
        this.speed = speed;
        this.life = type === 'laser' ? 10 : (type === 'sword_swing' ? 400 : 100); // Sword swing has 400 frames of life max

        if (type === 'sword_swing') {
            this.state = 'FORWARD'; // 'FORWARD' or 'RETURNING'
            this.hitTargets = new Set();
            this.rotation = 0;
            this.speedY = speed;
        }
    }

    draw() {
        ctx.save();
        if (this.type === 'laser') {
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00f2ff';
            ctx.globalAlpha = this.life / 10;
            ctx.fillRect(this.x, 0, this.width, canvas.height);
            ctx.globalAlpha = 1;
        } else if (this.type === 'sword_swing') {
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.rotate(this.rotation);
            
            // Draw a beautiful spinning sword
            // Blade (silver/light blue shiny metallic with a glowing outline)
            ctx.fillStyle = '#e0f7fa';
            ctx.strokeStyle = '#00e5ff';
            ctx.lineWidth = 2;
            
            // Scale based on the sword size
            const scale = this.width / 28;
            ctx.scale(scale, scale);

            ctx.beginPath();
            ctx.moveTo(-4, -18);
            ctx.lineTo(4, -18);
            ctx.lineTo(6, 10);
            ctx.lineTo(-6, 10);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Guard
            ctx.fillStyle = '#ffb300';
            ctx.fillRect(-12, 10, 24, 4);
            
            // Handle
            ctx.fillStyle = '#5d4037';
            ctx.fillRect(-3, 14, 6, 10);
            
            // Pommel
            ctx.fillStyle = '#ffb300';
            ctx.beginPath();
            ctx.arc(0, 26, 4, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            if (this.ownerId === 1) {
                // STAR (Kirby)
                ctx.rotate(Date.now() * 0.005);
                ctx.fillStyle = '#ffeb3b';
                for(let i=0; i<5; i++) {
                    ctx.rotate(Math.PI * 2 / 5);
                    ctx.fillRect(0, -8, 2, 12);
                }
            } else if (this.ownerId === 2 || this.ownerId === 3) {
                // HAMMER (Mario/Luigi)
                ctx.rotate(Date.now() * 0.01);
                ctx.fillStyle = '#9e9e9e';
                ctx.fillRect(-6, -4, 12, 8);
                ctx.fillStyle = '#795548';
                ctx.fillRect(-1, 4, 2, 6);
            } else if (this.ownerId === 4) {
                // SWORD
                ctx.fillStyle = '#cfd8dc';
                ctx.fillRect(-2, -12, 4, 20);
                ctx.fillStyle = '#fbc02d';
                ctx.fillRect(-5, 8, 10, 2);
            } else {
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            }
        }
        ctx.restore();
    }


    update() {
        if (this.type === 'laser') {
            this.life--;
        } else if (this.type === 'sword_swing') {
            this.life--;
            this.rotation += 0.2;
            
            const player = players.find(p => p.id === this.ownerId) || players[0];
            if (this.state === 'FORWARD') {
                this.y += this.speedY;
                this.speedY += 0.15; // Slow down going up
                if (this.speedY >= 0 || this.y <= 20) {
                    this.state = 'RETURNING';
                    this.hitTargets.clear(); // Allow hitting targets again on the return trip
                }
            } else if (this.state === 'RETURNING') {
                if (!player || !player.alive) {
                    this.life = 0; // Destroy sword if player is dead/not found
                } else {
                    const targetX = player.x + player.width / 2 - this.width / 2;
                    const targetY = player.y + player.height / 2 - this.height / 2;
                    
                    const dx = targetX - this.x;
                    const dy = targetY - this.y;
                    const dist = Math.hypot(dx, dy);
                    
                    if (dist < 20) {
                        this.life = 0; // Caught by player!
                    } else {
                        const speed = 7;
                        this.x += (dx / dist) * speed;
                        this.y += (dy / dist) * speed;
                    }
                }
            }
        } else {
            this.y += this.speed;
        }
    }
}

class PVPManager {
    constructor() {
        this.socket = null;
        this.roomId = null;
        this.myId = null;
        this.opponent = null;
        this.active = false;
        this.state = 'IDLE'; // IDLE, WAITING, MATCHED, CARDS, FIGHTING, RESULTS
        this.myCard = null;
        this.opponentCard = null;
        this.score = { me: 0, opponent: 0 };
        this.round = 1;
        this.unlocked = localStorage.getItem('pvp_unlocked') === 'true';
        this.matchmakingTimeout = null;
    }

    init() {
        const btn = document.getElementById('pvp-unlock-btn');
        if (this.unlocked) {
            btn.classList.add('unlocked');
            btn.textContent = 'PVP';
        }

        btn.onclick = () => {
            if (!this.unlocked) {
                this.unlocked = true;
                localStorage.setItem('pvp_unlocked', 'true');
                btn.classList.add('unlocked');
                btn.textContent = 'PVP';
                sfx.playPowerUp();
                return;
            }
            this.startMatchmaking();
        };
    }

    startMatchmaking() {
        if (this.state !== 'IDLE') return;
        this.active = true;
        this.state = 'WAITING';
        this.score = { me: 0, opponent: 0 };
        this.round = 1;
        
        document.getElementById('pvp-overlay').classList.add('active');
        document.getElementById('pvp-status').textContent = getTranslation('pvp_matchmaking');
        document.getElementById('pvp-match-info').classList.add('hidden');
        document.getElementById('pvp-cards-container').classList.add('hidden');
        document.getElementById('pvp-score-board').classList.add('hidden');

        if (!this.socket) {
            this.socket = socket; // Use the global socket
            this.setupSocketListeners();
        }

        const name = players[0] ? players[0].name : (document.getElementById('player1-name').value || 'PILOT');
        this.socket.emit('join_pvp', { name });
    }

    setupSocketListeners() {
        this.socket.on('waiting', () => {
            document.getElementById('pvp-status').textContent = getTranslation('pvp_searching');
        });

        this.socket.on('match_found', (data) => {
            this.roomId = data.roomId;
            this.myId = this.socket.id;
            this.opponent = data.players.find(p => p.id !== this.myId);
            this.state = 'MATCHED';
            
            document.getElementById('pvp-status').textContent = getTranslation('pvp_match_found');
            document.getElementById('pvp-players-names').textContent = `${players[0] ? players[0].name : 'PILOT'} VS ${this.opponent.name}`;
            document.getElementById('pvp-match-info').classList.remove('hidden');

            setTimeout(() => this.showCardSelection(), 2000);
        });

        this.socket.on('opponent_selected', (data) => {
            this.opponentCard = data.card;
            if (this.myCard) this.startRound();
        });

        this.socket.on('opponent_state', (state) => {
            if (this.state === 'FIGHTING' && window.remotePlayer) {
                window.remotePlayer.x = state.x;
                window.remotePlayer.y = state.y;
            }
        });

        this.socket.on('opponent_shoot', (bullet) => {
            if (this.state === 'FIGHTING') {
                const b = new Bullet(bullet.x, bullet.y, '#ff006e', 5, 'opponent');
                invaderBullets.push(b);
                sfx.playShootEnemy();
            }
        });

        this.socket.on('opponent_hit', () => {
            this.winRound();
        });

        this.socket.on('disconnect', () => {
            if (this.state === 'FIGHTING') {
                this.endPVP('OPPONENT LEFT');
            }
        });
    }

    showCardSelection() {
        this.state = 'CARDS';
        this.myCard = null;
        this.opponentCard = null;
        
        document.getElementById('pvp-status').textContent = getTranslation('pvp_choose_card');
        const container = document.getElementById('pvp-cards-container');
        container.innerHTML = '';
        container.classList.remove('hidden');

        const pvpCards = [
            { id: 'tank', name: 'TANK', desc: '+2 LIVES', buff: { hp: 2 } },
            { id: 'scout', name: 'SCOUT', desc: '+50% SPEED', buff: { speed: 2 } },
            { id: 'glass', name: 'GLASS CANNON', desc: 'INSTANT SHOOT', buff: { rapid: 10 } }
        ];

        pvpCards.forEach(cardData => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `<h3>${getTranslation('card_' + cardData.id + '_name')}</h3><p>${getTranslation('card_' + cardData.id + '_desc')}</p>`;
            card.onclick = () => {
                this.myCard = cardData;
                this.socket.emit('select_card', { roomId: this.roomId, card: cardData });
                container.classList.add('hidden');
                document.getElementById('pvp-status').textContent = getTranslation('pvp_waiting_opponent');
                sfx.playPowerUp();
                if (this.opponentCard) this.startRound();
            };
            container.appendChild(card);
        });
    }

    startRound() {
        this.state = 'FIGHTING';
        document.getElementById('pvp-overlay').classList.remove('active');
        document.getElementById('pvp-score-board').classList.remove('hidden');
        this.updateScoreUI();

        totalLives = 3;
        maxLives = 3;

        // Initialize players for PVP
        if (players.length === 0) startGame();
        
        // My player is players[0]
        const myP = players[0];
        myP.x = canvas.width * 0.2;
        myP.y = canvas.height - 40;
        myP.alive = true;
        myP.invincible = 120;

        // Apply Card Buffs
        if (this.myCard.id === 'tank') {
            totalLives += 2;
            maxLives += 2;
        }
        if (this.myCard.id === 'scout') myP.upgrades.speed += 3;
        if (this.myCard.id === 'glass') myP.upgrades.rapid = 10;

        updateLivesUI();

        // Remote Player
        window.remotePlayer = new Player(2, this.opponent.name, canvas.width * 0.8, canvas.height - 40, '#ff006e', {});
        window.remotePlayer.isRemote = true;
        
        invaders = []; // Clear invaders for PVP
        boss = null;
        gameState = 'PLAYING';
    }

    updateScoreUI() {
        document.getElementById('pvp-score-p1').textContent = this.score.me;
        document.getElementById('pvp-score-p2').textContent = this.score.opponent;
        document.getElementById('pvp-current-round').textContent = this.round;
    }

    winRound() {
        this.score.me++;
        this.nextRound();
    }

    loseRound() {
        this.score.opponent++;
        this.nextRound();
    }

    nextRound() {
        if (this.score.me >= 5 || this.score.opponent >= 5) {
            this.endPVP(this.score.me >= 5 ? 'YOU WIN!' : 'YOU LOSE!');
            return;
        }
        this.round++;
        this.state = 'MATCHED';
        document.getElementById('pvp-overlay').classList.add('active');
        document.getElementById('pvp-status').textContent = `${getTranslation('pvp_round_label')} ${this.round}`;
        document.getElementById('pvp-score-board').classList.add('hidden');
        setTimeout(() => this.showCardSelection(), 2000);
    }

    endPVP(result) {
        this.state = 'IDLE';
        this.active = false;
        document.getElementById('pvp-overlay').classList.add('active');
        
        let translatedResult = result;
        if (result === 'OPPONENT LEFT') translatedResult = getTranslation('opponent_left');
        else if (result === 'YOU WIN!') translatedResult = getTranslation('you_win');
        else if (result === 'YOU LOSE!') translatedResult = getTranslation('you_lose');
        
        document.getElementById('pvp-status').textContent = translatedResult;
        document.getElementById('pvp-match-info').classList.add('hidden');
        document.getElementById('pvp-cards-container').classList.add('hidden');
        document.getElementById('pvp-score-board').classList.add('hidden');
        
        setTimeout(() => {
            document.getElementById('pvp-overlay').classList.remove('active');
            endGame();
        }, 3000);
    }
}

const pvp = new PVPManager();
pvp.init();

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
    
    let targetAxemen = 0;
    if (level > 5) {
        targetAxemen = Math.floor(Math.random() * 4) + 3; // 3, 4, 5, or 6
    }
    
    const totalInvaders = rows * cols;
    const indices = Array.from({length: totalInvaders}, (_, i) => i);
    const shuffledIndices = indices.sort(() => 0.5 - Math.random());
    const axemenIndices = new Set(shuffledIndices.slice(0, targetAxemen));

    let currentIndex = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let type = 'normal';
            
            if (axemenIndices.has(currentIndex)) {
                type = 'axeman';
            } else if (level >= 3 && Math.random() < Math.min(0.1 + (level * 0.02), 0.5)) {
                type = 'swordsman';
            }
            
            invaders.push(new Invader(startX + c * (INVADER_SIZE + padding), 50 + r * (INVADER_SIZE + padding), speed, invaderHp, type));
            currentIndex++;
        }
    }
}

function startGame() {
    const p1Name = document.getElementById('player1-name').value || 'PILOT 1';
    const p2Name = document.getElementById('player2-name').value || 'PILOT 2';

    players = [];
    players.push(new Player(1, p1Name, canvas.width * 0.2, canvas.height - 40, '#bde0fe', { 
        left: 'KeyA', right: 'KeyD', shoot: 'KeyW', shield: 'KeyS', shockwave: 'KeyJ'
    }));
    
    if (playerMode >= 2) {
        players.push(new Player(2, p2Name, canvas.width * 0.4, canvas.height - 40, '#ffafcc', { 
            left: 'ArrowLeft', right: 'ArrowRight', shoot: 'ArrowUp', shield: 'ArrowDown', shockwave: 'Slash'
        }));
    }

    if (isMobile) {
        document.getElementById('mobile-controls').classList.add('active');
    } else {
        document.getElementById('mobile-controls').classList.remove('active');
    }

    // Toggle states reset
    keepDrones = false;
    hWasDown = false;
    totalLives = 3;
    maxLives = 3;



    playerBullets = [];
    playerShockwaves = [];
    invaderBullets = [];
    drones = [];
    level = 1;
    swordSwingShown = false;
    initInvaders();
    updateLivesUI();

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
        
        if (pvp.state === 'FIGHTING') {
            // Send position to opponent
            pvp.socket.emit('update_state', {
                roomId: pvp.roomId,
                state: { x: p.x, y: p.y }
            });
            
            // Hook shooting in Player.update to emit 'shoot'
            // I'll modify Player class later
        }
    });

    // Keyboard check for H-key drone retention toggle
    if (keys['KeyH'] && !hWasDown) {
        hWasDown = true;
        keepDrones = !keepDrones;
        sfx.playPowerUp();
    }
    if (!keys['KeyH']) {
        hWasDown = false;
    }

    if (pvp.state === 'FIGHTING' && window.remotePlayer) {
        window.remotePlayer.draw();
    }

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
            if (inv.type === 'swordsman') {
                // Find a random alive player as target
                const alivePlayers = players.filter(p => p.alive);
                const target = alivePlayers.length > 0 ? alivePlayers[Math.floor(Math.random() * alivePlayers.length)] : players[0];
                invaderBullets.push(new HomingSword(inv.x + inv.width / 2, inv.y + inv.height, target));
            } else if (inv.type === 'axeman') {
                invaderBullets.push(new Axe(inv.x + inv.width / 2, inv.y + inv.height, 450));
            } else {
                invaderBullets.push(new Bullet(inv.x + inv.width / 2, inv.y + inv.height, '#cdb4db', 3));
            }
        }
    });

    if (edgeReached) {
        invaderDirection *= -1;
        invaders.forEach(inv => inv.y += 20);
    }

    // Update & Draw Drones
    drones = drones.filter(d => d.alive);
    drones.forEach(d => {
        d.update();
        d.draw();
    });

    // Update & Draw Bullets
    playerBullets = playerBullets.filter(b => {
        if (b.type === 'laser') return b.life > 0;
        if (b.type === 'sword_swing') return b.life > 0;
        return b.y > 0;
    });
    /**
     * Bullet Collision Engine
     * Checks interactions between player/enemy bullets and targets.
     */
    const invadersToRemove = new Set();
    playerBullets.forEach((b, bIdx) => {
        b.update();
        b.draw();

        const player = players.find(p => p.id === b.ownerId) || players[0];
        
        // Boss collision
        if (boss) {
            if (b.x < boss.x + boss.width && b.x + b.width > boss.x && b.y < boss.y + boss.height && b.y + b.height > boss.y) {
                if (b.type === 'normal') playerBullets.splice(bIdx, 1);
                
                if (b.type === 'sword_swing') {
                    if (!b.hitTargets.has(boss)) {
                        b.hitTargets.add(boss);
                        boss.hp -= (1 + (player.upgrades.sword_swing || 0)) * 2; // Sword swing scales and deals extra damage to boss
                        sfx.playHitSFX();
                    }
                } else {
                    const laserDmg = 15 + (player.upgrades.laserLvl - 1) * 2;
                    boss.hp -= (b.type === 'laser' ? laserDmg / 10 : 10); // Nerfed laser damage to boss
                    sfx.playHitSFX();
                }
                
                if (boss.hp <= 0) {
                    player.score += 1000;
                    boss = null;
                }
                if (b.type === 'normal') return;
            }
        }

        for (let i = 0; i < invaders.length; i++) {
            const inv = invaders[i];
            if (invadersToRemove.has(inv)) continue;

            if (b.x < inv.x + inv.width && b.x + b.width > inv.x && b.y < inv.y + inv.height && b.y + b.height > inv.y) {
                if (b.type === 'sword_swing') {
                    if (b.hitTargets.has(inv)) continue;
                    b.hitTargets.add(inv);
                }

                // Damage invader
                inv.hp -= (b.type === 'sword_swing' ? (1 + (player.upgrades.sword_swing || 0)) : 1);
                sfx.playHitSFX();

                if (inv.hp <= 0) {
                    invadersToRemove.add(inv);
                    player.score += 100;
                    
                    // Explosion check
                    if (Math.random() < player.upgrades.explosion) {
                        createFirework(inv.x + inv.width / 2, inv.y + inv.height / 2); // Visual effect
                        invaders.forEach(otherInv => {
                            if (invadersToRemove.has(otherInv)) return;
                            const dist = Math.hypot(otherInv.x - inv.x, otherInv.y - inv.y);
                            if (dist < 80 && otherInv !== inv) {
                                player.score += 50;
                                invadersToRemove.add(otherInv);
                            }
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

    // Cleanup defeated invaders
    if (invadersToRemove.size > 0) {
        invaders = invaders.filter(inv => !invadersToRemove.has(inv));
    }

    // Process Shockwaves
    playerShockwaves = playerShockwaves.filter(sw => sw.x < canvas.width / 4);
    playerShockwaves.forEach(sw => {
        sw.update();
        sw.draw();
        
        const player = players.find(p => p.id === sw.ownerId) || players[0];
        
        // Damage Boss
        if (boss && sw.x < boss.x + boss.width && sw.x + sw.width > boss.x) {
            boss.hp -= (1 + sw.level); 
            sfx.playHitSFX();
            if (boss.hp <= 0) {
                player.score += 1000;
                boss = null;
            }
        }
        
        // Destroy Invaders
        invaders.forEach((inv, i) => {
            if (!invadersToRemove.has(inv) && sw.x < inv.x + inv.width && sw.x + sw.width > inv.x) {
                inv.hp -= (1 + sw.level); // Adjusted damage
                sfx.playHitSFX();
                if (inv.hp <= 0) {
                    invadersToRemove.add(inv);
                    player.score += 100;
                    createFirework(inv.x + inv.width / 2, inv.y + inv.height / 2);
                }
            }
        });
    });

    if (invadersToRemove.size > 0) {
        invaders = invaders.filter(inv => !invadersToRemove.has(inv));
    }

    invaderBullets = invaderBullets.filter(b => b.y < canvas.height || (b.type === 'axe' && !b.finished));
    const invaderBulletsToRemove = new Set();
    invaderBullets.forEach((b) => {
        b.update();
        b.draw();

        // Check collision with players
        players.forEach(p => {
            if (p.alive && p.invincible <= 0) {
                if (b.x < p.x + p.width && b.x + b.width > p.x && b.y < p.y + p.height && b.y + b.height > p.y) {
                    if (b.type === 'axe') {
                        if (!b.exploded) {
                            damagePlayer(p);
                            b.exploded = true;
                            sfx.playExplosion();
                            createFirework(b.x + b.width / 2, b.y + b.height / 2);
                        }
                    } else {
                        damagePlayer(p);
                        invaderBulletsToRemove.add(b);
                    }
                }
            }
        });

        // Check collision with drones
        drones.forEach(d => {
            if (d.alive) {
                if (b.x < d.x + d.width && b.x + b.width > d.x && b.y < d.y + d.height && b.y + b.height > d.y) {
                    if (b.type === 'axe') {
                        if (!b.exploded) {
                            d.alive = false;
                            b.exploded = true;
                            sfx.playExplosion();
                            createFirework(b.x + b.width / 2, b.y + b.height / 2);
                        }
                    } else {
                        d.alive = false;
                        sfx.playExplosion();
                        createFirework(d.x + d.width / 2, d.y + d.height / 2);
                        invaderBulletsToRemove.add(b);
                    }
                }
            }
        });
    });
    if (invaderBulletsToRemove.size > 0) {
        invaderBullets = invaderBullets.filter(b => !invaderBulletsToRemove.has(b));
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

    // Render keepDrones HUD indicator on canvas
    if (keepDrones) {
        ctx.save();
        ctx.fillStyle = '#ff003c';
        ctx.font = 'bold 12px "Courier New", Courier, monospace';
        ctx.textAlign = 'right';
        const label = getTranslation('keep_drones_label');
        ctx.fillText(label, canvas.width - 20, canvas.height - 20);
        
        // Draw a small red glowing pulse circle next to the label
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ff003c';
        ctx.beginPath();
        const pulse = Math.abs(Math.sin(Date.now() / 200)) * 4 + 2;
        ctx.arc(canvas.width - 20 - ctx.measureText(label).width - 10, canvas.height - 24, pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    animationId = requestAnimationFrame(gameLoop);
}

function showUpgradeScreen() {
    gameState = 'UPGRADING';
    sfx.playWinJingle();
    currentUpgradingPlayer = 0;
    
    const player = players[currentUpgradingPlayer];
    
    // Pick 2 random upgrades that are not at cap
    const allUpgrades = ['rapid', 'explosion', 'laser', 'freeze', 'speed', 'shield', 'shockwave', 'drone', 'sword_swing'];
    const availableUpgrades = allUpgrades.filter(type => {
        if (type === 'rapid') return player.upgrades.rapid < 9;
        if (type === 'explosion') return player.upgrades.explosion < 1.0;
        if (type === 'laser') return player.upgrades.laserLvl < 10;
        if (type === 'freeze') return player.upgrades.freeze < 1.0;
        if (type === 'speed') return (player.upgrades.speed - PLAYER_SPEED) < 10;
        if (type === 'shield') return player.upgrades.shield < 10;
        if (type === 'shockwave') return player.upgrades.shockwave < 10;
        if (type === 'drone') return player.upgrades.drone < 10;
        if (type === 'sword_swing') return player.upgrades.sword_swing < 10;
        return true;
    });

    // Shuffle and pick 2
    let selected = [];
    if (level === 5 && !swordSwingShown && availableUpgrades.includes('sword_swing')) {
        const remaining = availableUpgrades.filter(type => type !== 'sword_swing');
        const shuffled = remaining.sort(() => 0.5 - Math.random());
        selected = ['sword_swing'].concat(shuffled.slice(0, 1));
    } else {
        const shuffled = availableUpgrades.sort(() => 0.5 - Math.random());
        selected = shuffled.slice(0, 2);
    }

    if (selected.includes('sword_swing')) {
        swordSwingShown = true;
    }

    if (selected.length === 0) {
        // No upgrades available for any player, skip to next round
        if (playerMode === 2 && currentUpgradingPlayer === 0) {
            currentUpgradingPlayer = 1;
            showUpgradeScreen();
            return;
        } else {
            document.getElementById('upgrade-overlay').classList.remove('active');
            level++;
            initInvaders();
            gameState = 'PLAYING';
            return;
        }
    }

    // Show only selected cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        if (selected.includes(card.dataset.upgrade)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
    
    updateUpgradeOverlay();
    document.getElementById('upgrade-overlay').classList.add('active');
}

function toRoman(num) {
    if (num === 0) return '0';
    const roman = {
        10: 'X', 9: 'IX', 8: 'VIII', 7: 'VII', 6: 'VI',
        5: 'V', 4: 'IV', 3: 'III', 2: 'II', 1: 'I'
    };
    return roman[num] || num;
}

function updateUpgradeOverlay() {
    const player = players[currentUpgradingPlayer];
    document.getElementById('upgrade-title').textContent = `${player.name.toUpperCase()} ${getTranslation('upgrade_suffix')}`;
    
    // Update card levels
    const cards = document.querySelectorAll('.card');
    const lvlWord = getTranslation('lvl_short');
    const chanceWord = getTranslation('chance_word');
    const spdWord = getTranslation('spd_short');
    
    cards.forEach(card => {
        const type = card.dataset.upgrade;
        let info = '';
        if (type === 'rapid') info = `${lvlWord} ${toRoman(player.upgrades.rapid)}/${toRoman(9)}`;
        else if (type === 'explosion') info = `${Math.round(player.upgrades.explosion * 100)}% ${chanceWord} (${lvlWord} ${toRoman(Math.round(player.upgrades.explosion * 10))}/${toRoman(10)})`;
        else if (type === 'laser') info = `${lvlWord} ${toRoman(player.upgrades.laserLvl)}/${toRoman(10)} (${Math.round(player.upgrades.laser * 100)}% ${chanceWord})`;
        else if (type === 'freeze') info = `${Math.round(player.upgrades.freeze * 100)}% ${chanceWord} (${lvlWord} ${toRoman(Math.round(player.upgrades.freeze * 10))}/${toRoman(10)})`;
        else if (type === 'speed') info = `${spdWord} ${Math.round(player.upgrades.speed)} (${lvlWord} ${toRoman(Math.round(player.upgrades.speed - PLAYER_SPEED))}/${toRoman(10)})`;
        else if (type === 'shield') info = `${lvlWord} ${toRoman(player.upgrades.shield)}/${toRoman(10)}`;
        else if (type === 'shockwave') info = `${lvlWord} ${toRoman(player.upgrades.shockwave)}/${toRoman(10)}`;
        else if (type === 'drone') info = `${lvlWord} ${toRoman(player.upgrades.drone)}/${toRoman(10)}`;
        else if (type === 'sword_swing') info = `${lvlWord} ${toRoman(player.upgrades.sword_swing)}/${toRoman(10)}`;
        
        const infoEl = card.querySelector('.level-info');
        if (infoEl) infoEl.textContent = info;
    });
}

function selectUpgrade(type) {
    console.log('Upgrading:', type, 'for player:', currentUpgradingPlayer);
    try { sfx.stopWinTheme(); } catch(e) {}
    
    const player = players[currentUpgradingPlayer];
    
    if (type === 'rapid' && player.upgrades.rapid < 9) {
        player.upgrades.rapid++;
    } else if (type === 'explosion' && player.upgrades.explosion < 1.0) {
        player.upgrades.explosion += 0.1;
    } else if (type === 'laser' && player.upgrades.laserLvl < 10) {
        player.upgrades.laserLvl++;
        player.upgrades.laser += 0.1;
    } else if (type === 'freeze' && player.upgrades.freeze < 1.0) {
        player.upgrades.freeze += 0.1;
    } else if (type === 'speed' && (player.upgrades.speed - PLAYER_SPEED) < 10) {
        player.upgrades.speed += 1;
    } else if (type === 'shield' && player.upgrades.shield < 10) {
        player.upgrades.shield += 1;
    } else if (type === 'shockwave' && player.upgrades.shockwave < 10) {
        player.upgrades.shockwave += 1;
    } else if (type === 'drone' && player.upgrades.drone < 10) {
        player.upgrades.drone += 1;
    } else if (type === 'sword_swing' && player.upgrades.sword_swing < 10) {
        player.upgrades.sword_swing += 1;
    }

    if (playerMode === 2 && currentUpgradingPlayer === 0) {
        currentUpgradingPlayer = 1;
        updateUpgradeOverlay();
    } else {
        document.getElementById('upgrade-overlay').classList.remove('active');
        
        // Heal 1 heart upon completing the round up to maxLives
        if (totalLives < maxLives) {
            totalLives++;
            updateLivesUI();
        }

        // Revive dead players since lives > 0 now
        players.forEach(p => {
            if (!p.alive) {
                p.alive = true;
                p.invincible = 120; // Give spawn protection
                p.x = p.id === 1 ? canvas.width * 0.2 : canvas.width * 0.4;
                p.y = canvas.height - 40;
            }
        });

        // Clear active drones at round completion if retention is inactive
        if (!keepDrones) {
            drones = [];
        }

        level++;
        initInvaders();
        gameState = 'PLAYING';
    }
}

function updateLivesUI() {
    const container = document.getElementById('lives-display');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < maxLives; i++) {
        const isFull = i < totalLives;
        const heartSVG = `
            <svg class="heart-svg ${isFull ? '' : 'lost'}" viewBox="0 0 8 8">
                <rect x="1" y="1" width="2" height="1"/>
                <rect x="5" y="1" width="2" height="1"/>
                <rect x="0" y="2" width="8" height="1"/>
                <rect x="0" y="3" width="8" height="1"/>
                <rect x="0" y="4" width="8" height="1"/>
                <rect x="1" y="5" width="6" height="1"/>
                <rect x="2" y="6" width="4" height="1"/>
                <rect x="3" y="7" width="2" height="1"/>
            </svg>
        `;
        container.insertAdjacentHTML('beforeend', heartSVG);
    }
}

function damagePlayer(p) {
    if (!p.alive || p.invincible > 0) return;
    
    // Shield blocks damage
    if (p.activeShields > 0) {
        p.activeShields--;
        p.invincible = 60; // 1 second of invincibility
        sfx.playExplosion(); // Or a specific shield hit sound if one existed
        if (p.activeShields <= 0) {
            p.shieldCooldown = 180; // 3 seconds cooldown
        }
        return;
    }

    totalLives--;
    updateLivesUI();
    
    if (totalLives <= 0) {
        p.alive = false;
        
        // Play explosion sound and show explosion effect on player death
        sfx.playExplosion();
        createFirework(p.x + p.width/2, p.y + p.height/2);
        
        if (pvp.state === 'FIGHTING') {
            pvp.socket.emit('hit', { roomId: pvp.roomId });
            pvp.loseRound();
        } else {
            // Check if any player is still alive
            const anyPlayerAlive = players.some(pl => pl.alive);
            if (!anyPlayerAlive) {
                endGame();
            }
        }
    } else {
        p.invincible = 120; // 2 seconds of invincibility
        sfx.playExplosion();
    }
}

function endGame() {
    gameState = 'GAME_OVER';
    cancelAnimationFrame(animationId);
    sfx.playLoseJingle();

    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('game-over-screen').classList.add('active');

    updateLivesUI();
    const restartBtn = document.getElementById('restart-btn');
    restartBtn.textContent = getTranslation('btn_retry_from_start');

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
            nameSpan.textContent = `${s.name} (${getTranslation('diff_' + s.difficulty) || s.difficulty})`;
            
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
        document.getElementById('pause-btn').textContent = getTranslation('btn_resume');
    } else if (gameState === 'PAUSED') {
        gameState = 'PLAYING';
        document.getElementById('pause-overlay').classList.remove('active');
        document.getElementById('pause-btn').textContent = getTranslation('btn_pause');
    }
}

function quitToMenu() {
    gameState = 'SETUP';
    cancelAnimationFrame(animationId);
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('pause-overlay').classList.remove('active');
    document.getElementById('setup-screen').classList.add('active');
    document.getElementById('mobile-controls').classList.remove('active');
    drones = [];
    keepDrones = false;
    hWasDown = false;
    totalLives = 3;
    maxLives = 3;
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
    
    // How to Play
    safeAddListener('how-to-btn', 'click', () => {
        document.getElementById('how-to-overlay').classList.add('active');
    });
    safeAddListener('close-how-to', 'click', () => {
        document.getElementById('how-to-overlay').classList.remove('active');
    });



    
    // Continue/Retry actions
    safeAddListener('restart-btn', 'click', () => {
        if (totalLives > 0) {
            // Re-deploy at current level
            document.getElementById('game-over-screen').classList.remove('active');
            initInvaders();
            gameState = 'PLAYING';
            sfx.playBGM();
        } else {
            // Full restart
            totalLives = 3;
            maxLives = 3;
            level = 1;
            swordSwingShown = false;
            document.getElementById('game-over-screen').classList.remove('active');
            document.getElementById('setup-screen').classList.add('active');
            loadScores();
        }
    });

    safeAddListener('quit-btn', 'click', quitToMenu);


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

    // Mobile Touch Listeners
    const addTouchEvents = (id, stateKey) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('touchstart', (e) => {
                e.preventDefault();
                touchState[stateKey] = true;
            });
            el.addEventListener('touchend', (e) => {
                e.preventDefault();
                touchState[stateKey] = false;
            });
            el.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                touchState[stateKey] = false;
            });
        }
    };
    addTouchEvents('touch-move-left', 'left');
    addTouchEvents('touch-move-right', 'right');
    addTouchEvents('touch-shoot', 'shoot');
    addTouchEvents('touch-shield', 'shield');
    addTouchEvents('touch-shockwave', 'shockwave');

    // Settings Overlay Listeners
    safeAddListener('settings-btn', 'click', () => {
        document.getElementById('settings-overlay').classList.add('active');
    });
    safeAddListener('close-settings', 'click', () => {
        document.getElementById('settings-overlay').classList.remove('active');
    });
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            applyLanguage(btn.dataset.lang);
        });
    });

    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            applyTheme(btn.dataset.theme);
        });
    });
}

function initPlayerMode() {
    const p2Input = document.getElementById('p2-input');
    const btn2p = document.getElementById('btn-2p');
    const mobileNote = document.getElementById('mobile-note');
    
    if (isMobile) {
        playerMode = 1;
        if (btn2p) btn2p.classList.add('hidden');
        if (mobileNote) mobileNote.classList.remove('hidden');
        // Force 1P button active
        document.querySelectorAll('.mode-btn').forEach(b => {
            b.classList.remove('active');
            if (b.dataset.players === "1") b.classList.add('active');
        });
    } else {
        if (btn2p) btn2p.classList.remove('hidden');
        if (mobileNote) mobileNote.classList.add('hidden');
    }

    if (p2Input) p2Input.classList.add('hidden');
    document.querySelectorAll('.p2-hud').forEach(h => h.classList.add('hidden'));

    if (playerMode === 2 && !isMobile) {
        if (p2Input) p2Input.classList.remove('hidden');
        document.querySelectorAll('.p2-hud').forEach(h => h.classList.remove('hidden'));
    }
}

// Localization and Theme State
let currentLanguage = 'en';
let currentTheme = 'blue';

const LOCALIZATION = {
    en: {
        title: "ZAP THE THING!",
        subtitle: "8-BIT REVENGE",
        players_label: "PLAYERS:",
        p1_name_label: "KIRBY (P1):",
        p2_name_label: "MARIO (P2):",
        difficulty_label: "DIFFICULTY:",
        diff_low: "LOW",
        diff_medium: "MEDIUM",
        diff_hard: "HARD",
        mobile_note: "MOBILE: 1 PLAYER ONLY",
        launch_mission: "LAUNCH MISSION",
        how_to_play: "HOW TO PLAY",
        settings: "SETTINGS",
        top_guns: "TOP GUNS",
        p1_score_label: "P1: ",
        p2_score_label: "P2: ",
        level_label: "LEVEL: ",
        btn_pause: "PAUSE",
        btn_resume: "RESUME",
        btn_quit: "QUIT",
        paused_title: "PAUSED",
        paused_desc: "PRESS 'P' OR CLICK TO RESUME",
        upgrade_title: "PLAYER 1 UPGRADE",
        upgrade_suffix: "UPGRADE",
        upgrade_rapid_title: "RAPID FIRE",
        upgrade_rapid_desc: "Reload faster",
        upgrade_explosion_title: "EXPLOSION",
        upgrade_explosion_desc: "Area damage chance",
        upgrade_laser_title: "LASER",
        upgrade_laser_desc: "Piercing beam chance",
        upgrade_thrust_title: "THRUST",
        upgrade_thrust_desc: "Increase movement speed",
        upgrade_shield_title: "FORCE FIELD",
        upgrade_shield_desc: "Press S/Down to block hits",
        upgrade_wave_title: "SHOCKWAVE",
        upgrade_wave_desc: "Press J/Slash to sweep screen",
        upgrade_freeze_title: "FREEZE",
        upgrade_freeze_desc: "Freeze enemy in front",
        pvp_matchmaking: "MATCHMAKING...",
        pvp_score: "SCORE",
        pvp_round: "ROUND",
        controls_hint: "P1: A/D+W | P2: ARROWS L/R+UP | P: PAUSE",
        btn_zap: "ZAP",
        btn_shield: "SHIELD",
        btn_wave: "WAVE",
        briefing_title: "MISSION BRIEFING",
        movement_title: "MOVEMENT",
        brief_movement_p1: "<strong>P1:</strong> A / D (Side) | SPACE (Thrust Forward)",
        brief_movement_p2: "<strong>P2:</strong> ← / → (Side)",
        brief_movement_note: "* Ships drift back to the baseline automatically.",
        abilities_title: "ABILITIES",
        brief_abilities_tap: "<strong>TAP:</strong> Normal Shot",
        brief_abilities_laser: "<strong>DOUBLE-TAP:</strong> Laser Beam (2s Cooldown)",
        brief_abilities_p1p2: "P1: W | P2: ↑",
        brief_abilities_shield: "<strong>SHIELD:</strong> Press S (P1) or Down (P2) if unlocked",
        brief_abilities_wave: "<strong>SHOCKWAVE:</strong> Press J (P1) or Slash (P2) to sweep screen",
        objectives_title: "OBJECTIVES",
        brief_objectives_survive: "<strong>SURVIVE:</strong> Clear waves to reach the Boss (Every 10 Levels).",
        brief_objectives_health: "<strong>HEALTH:</strong> You have 3 shared Hearts (❤️). Get hit, lose a heart. Lose all 3, Game Over.",
        brief_objectives_upgrade: "<strong>UPGRADE:</strong> Choose a power-up after every round.",
        back_to_base: "BACK TO BASE",
        settings_title: "SETTINGS",
        language_label: "LANGUAGE",
        theme_label: "BACKGROUND COLOR",
        theme_space_blue: "SPACE BLUE",
        theme_retro_black: "RETRO BLACK",
        theme_cyber_purple: "CYBER PURPLE",
        theme_matrix_green: "MATRIX GREEN",
        theme_crimson_red: "CRIMSON RED",
        final_stand: "FINAL STAND",
        btn_redeploy: "RE-DEPLOY",
        btn_retry_from_start: "RETRY FROM START",
        lvl_short: "LVL",
        chance_word: "CHANCE",
        spd_short: "SPD",
        pvp_searching: "SEARCHING FOR OPPONENT...",
        pvp_match_found: "MATCH FOUND!",
        pvp_choose_card: "CHOOSE YOUR CARD",
        pvp_waiting_opponent: "WAITING FOR OPPONENT...",
        pvp_round_label: "ROUND",
        opponent_left: "OPPONENT LEFT",
        you_win: "YOU WIN!",
        you_lose: "YOU LOSE!",
        card_tank_name: "TANK",
        card_tank_desc: "+2 LIVES",
        card_scout_name: "SCOUT",
        card_scout_desc: "+50% SPEED",
        card_glass_name: "GLASS CANNON",
        card_glass_desc: "INSTANT SHOOT",
        upgrade_drone_title: "HACKED DRONE",
        upgrade_drone_desc: "Press X to spawn helper drones",
        keep_drones_label: "DRONES LOCKED",
        upgrade_sword_swing_title: "SWORD SWING",
        upgrade_sword_swing_desc: "Press I to throw a returning spinning sword"
    },
    es: {
        title: "¡ZAPEA AL INVASOR!",
        subtitle: "VENGANZA 8-BIT",
        players_label: "JUGADORES:",
        p1_name_label: "KIRBY (P1):",
        p2_name_label: "MARIO (P2):",
        difficulty_label: "DIFICULTAD:",
        diff_low: "BAJA",
        diff_medium: "MEDIA",
        diff_hard: "ALTA",
        mobile_note: "MÓVIL: SOLO 1 JUGADOR",
        launch_mission: "INICIAR MISIÓN",
        how_to_play: "CÓMO JUGAR",
        settings: "AJUSTES",
        top_guns: "MEJORES PILOTOS",
        p1_score_label: "P1: ",
        p2_score_label: "P2: ",
        level_label: "NIVEL: ",
        btn_pause: "PAUSA",
        btn_resume: "REANUDAR",
        btn_quit: "SALIR",
        paused_title: "PAUSADO",
        paused_desc: "PRESIONA 'P' O HAZ CLIC PARA REANUDAR",
        upgrade_title: "MEJORA JUGADOR 1",
        upgrade_suffix: "MEJORA",
        upgrade_rapid_title: "FUEGO RÁPIDO",
        upgrade_rapid_desc: "Recarga más rápido",
        upgrade_explosion_title: "EXPLOSIÓN",
        upgrade_explosion_desc: "Probabilidad de daño de área",
        upgrade_laser_title: "LÁSER",
        upgrade_laser_desc: "Probabilidad de rayo perforador",
        upgrade_thrust_title: "PROPULSIÓN",
        upgrade_thrust_desc: "Aumenta velocidad de movimiento",
        upgrade_shield_title: "CAMPO DE FUERZA",
        upgrade_shield_desc: "Presiona S/Abajo para bloquear",
        upgrade_wave_title: "ONDA DE CHOQUE",
        upgrade_wave_desc: "Presiona J/Slash para limpiar pantalla",
        upgrade_freeze_title: "CONGELAR",
        upgrade_freeze_desc: "Congela al enemigo de enfrente",
        pvp_matchmaking: "BUSCANDO PARTIDA...",
        pvp_score: "SCORE",
        pvp_round: "RONDA",
        controls_hint: "P1: A/D+W | P2: FLECHAS L/R+UP | P: PAUSA",
        btn_zap: "ZAP",
        btn_shield: "ESCUDO",
        btn_wave: "ONDA",
        briefing_title: "INSTRUCCIONES",
        movement_title: "MOVIMIENTO",
        brief_movement_p1: "<strong>P1:</strong> A / D (Lados) | ESPACIO (Propulsar)",
        brief_movement_p2: "<strong>P2:</strong> ← / → (Lados)",
        brief_movement_note: "* Las naves retroceden automáticamente.",
        abilities_title: "HABILIDADES",
        brief_abilities_tap: "<strong>PULSACIÓN:</strong> Disparo Normal",
        brief_abilities_laser: "<strong>DOBLE PULSACIÓN:</strong> Rayo Láser (Recup. 2s)",
        brief_abilities_p1p2: "P1: W | P2: ↑",
        brief_abilities_shield: "<strong>ESCUDO:</strong> Presiona S (P1) o Abajo (P2) si está desbloqueado",
        brief_abilities_wave: "<strong>ONDA:</strong> Presiona J (P1) o Slash (P2) para barrer pantalla",
        objectives_title: "OBJETIVOS",
        brief_objectives_survive: "<strong>SOBREVIVE:</strong> Limpia oleadas para llegar al Jefe (Cada 10 niveles).",
        brief_objectives_health: "<strong>VIDA:</strong> 3 corazones compartidos (❤️). Si te golpean, pierdes uno. Cero corazones es Fin de Juego.",
        brief_objectives_upgrade: "<strong>MEJORA:</strong> Elige un potenciador después de cada ronda.",
        back_to_base: "VOLVER A LA BASE",
        settings_title: "AJUSTES",
        language_label: "IDIOMA",
        theme_label: "COLOR DE FONDO",
        theme_space_blue: "AZUL ESPACIAL",
        theme_retro_black: "NEGRO RETRO",
        theme_cyber_purple: "CYBERPUNK",
        theme_matrix_green: "VERDE MATRIX",
        theme_crimson_red: "CORAL ROJO",
        final_stand: "ÚLTIMO INTENTO",
        btn_redeploy: "REINICIAR",
        btn_retry_from_start: "REINTENTAR DEL INICIO",
        lvl_short: "NV",
        chance_word: "PROB.",
        spd_short: "VEL",
        pvp_searching: "BUSCANDO OPONENTE...",
        pvp_match_found: "¡PARTIDA ENCONTRADA!",
        pvp_choose_card: "ELIGE TU CARTA",
        pvp_waiting_opponent: "ESPERANDO AL OPONENTE...",
        pvp_round_label: "RONDA",
        opponent_left: "EL OPONENTE SE FUE",
        you_win: "¡TÚ GANAS!",
        you_lose: "¡TÚ PIERDES!",
        card_tank_name: "TANQUE",
        card_tank_desc: "+2 VIDAS",
        card_scout_name: "EXPLORADOR",
        card_scout_desc: "+50% VELOCIDAD",
        card_glass_name: "CAÑÓN CRISTAL",
        card_glass_desc: "DISPARO INSTANTÁNEO",
        upgrade_drone_title: "DRON HACKEADO",
        upgrade_drone_desc: "Presiona X para lanzar drones ayudantes",
        keep_drones_label: "DRONES BLOQUEADOS",
        upgrade_sword_swing_title: "ESPADA GIRATORIA",
        upgrade_sword_swing_desc: "Presiona I para lanzar una espada giratoria que regresa"
    },
    fr: {
        title: "ZAPPER LA CHOSE !",
        subtitle: "REVANCHE 8-BIT",
        players_label: "JOUEURS :",
        p1_name_label: "KIRBY (J1) :",
        p2_name_label: "MARIO (J2) :",
        difficulty_label: "DIFFICULTÉ :",
        diff_low: "FACILE",
        diff_medium: "MOYEN",
        diff_hard: "DIFFICILE",
        mobile_note: "MOBILE : 1 JOUEUR UNIQUEMENT",
        launch_mission: "LANCER MISSION",
        how_to_play: "COMMENT JOUER",
        settings: "PARAMÈTRES",
        top_guns: "MEILLEURS SCORES",
        p1_score_label: "J1 : ",
        p2_score_label: "J2 : ",
        level_label: "NIVEAU : ",
        btn_pause: "PAUSE",
        btn_resume: "REPRENDRE",
        btn_quit: "QUITTER",
        paused_title: "PAUSE",
        paused_desc: "APPUYEZ SUR 'P' OU CLIQUEZ POUR REPRENDRE",
        upgrade_title: "AMÉLIORATION JOUEUR 1",
        upgrade_suffix: "AMÉLIORATION",
        upgrade_rapid_title: "TIR RAPIDE",
        upgrade_rapid_desc: "Recharger plus vite",
        upgrade_explosion_title: "EXPLOSION",
        upgrade_explosion_desc: "Chance de dégâts de zone",
        upgrade_laser_title: "LASER",
        upgrade_laser_desc: "Chance de rayon perforant",
        upgrade_thrust_title: "POUSSÉE",
        upgrade_thrust_desc: "Augmenter la vitesse",
        upgrade_shield_title: "CHAMP DE FORCE",
        upgrade_shield_desc: "S/Bas pour bloquer les coups",
        upgrade_wave_title: "ONDE DE CHOC",
        upgrade_wave_desc: "J/Slash pour balayer l'écran",
        upgrade_freeze_title: "GELER",
        upgrade_freeze_desc: "Geler l'ennemi en face",
        pvp_matchmaking: "RECHERCHE DE PARTIE...",
        pvp_score: "SCORE",
        pvp_round: "MANCHE",
        controls_hint: "J1 : A/D+W | J2 : FLÈCHES L/R+HAUT | P : PAUSE",
        btn_zap: "ZAP",
        btn_shield: "BOUCLIER",
        btn_wave: "ONDE",
        briefing_title: "BRIEFING MISSION",
        movement_title: "MOUVEMENT",
        brief_movement_p1: "<strong>J1 :</strong> A / D (Côtés) | ESPACE (Propulsion)",
        brief_movement_p2: "<strong>J2 :</strong> ← / → (Côtés)",
        brief_movement_note: "* Les vaisseaux reviennent automatiquement.",
        abilities_title: "CAPACITÉS",
        brief_abilities_tap: "<strong>TAP :</strong> Tir Normal",
        brief_abilities_laser: "<strong>DOUBLE TAP :</strong> Rayon Laser (Recup. 2s)",
        brief_abilities_p1p2: "J1 : W | J2 : ↑",
        brief_abilities_shield: "<strong>BOUCLIER :</strong> Appuyez sur S (J1) ou Bas (J2) si déverrouillé",
        brief_abilities_wave: "<strong>ONDE :</strong> Appuyez sur J (J1) ou Slash (J2) pour nettoyer l'écran",
        objectives_title: "OBJECTIFS",
        brief_objectives_survive: "<strong>SURVIVRE :</strong> Éliminez les vagues pour atteindre le Boss (Tous les 10 niv.).",
        brief_objectives_health: "<strong>SANTÉ :</strong> 3 cœurs partagés (❤️). Touché, perdez un cœur. À 0, Game Over.",
        brief_objectives_upgrade: "<strong>AMÉLIORATION :</strong> Choisissez un bonus après chaque manche.",
        back_to_base: "RETOUR À LA BASE",
        settings_title: "PARAMÈTRES",
        language_label: "LANGUE",
        theme_label: "COULEUR DE FONDO",
        theme_space_blue: "BLEU SPATIAL",
        theme_retro_black: "NOIR RETRO",
        theme_cyber_purple: "CYBER VIOLET",
        theme_matrix_green: "VERT MATRIX",
        theme_crimson_red: "ROUGE CORAIL",
        final_stand: "COMBAT FINAL",
        btn_redeploy: "RE-DÉPLOYER",
        btn_retry_from_start: "RECOMMENCER DE ZÉRO",
        lvl_short: "NIV",
        chance_word: "CHANCE",
        spd_short: "VIT",
        pvp_searching: "RECHERCHE D'ADVERSAIRE...",
        pvp_match_found: "PARTIE TROUVÉE !",
        pvp_choose_card: "CHOISISSEZ VOTRE CARTE",
        pvp_waiting_opponent: "ATTENTE DE L'ADVERSAIRE...",
        pvp_round_label: "MANCHE",
        opponent_left: "L'ADVERSAIRE EST PARTI",
        you_win: "VOUS GAGNEZ !",
        you_lose: "VOUS AVEZ PERDU !",
        card_tank_name: "BLINDÉ",
        card_tank_desc: "+2 VIES",
        card_scout_name: "ÉCLAIREUR",
        card_scout_desc: "+50% VITESSE",
        card_glass_name: "CANON DE VERRE",
        card_glass_desc: "TIR INSTANTANÉ",
        upgrade_drone_title: "DRÔNE PIRATÉ",
        upgrade_drone_desc: "Appuyez sur X pour lancer des drônes",
        keep_drones_label: "DRÔNES RETENUS",
        upgrade_sword_swing_title: "COUP D'ÉPÉE",
        upgrade_sword_swing_desc: "Appuyez sur I pour lancer une épée tournante qui revient"
    },
    de: {
        title: "ZAP DAS DING!",
        subtitle: "8-BIT-RACHE",
        players_label: "SPIELER:",
        p1_name_label: "KIRBY (S1):",
        p2_name_label: "MARIO (S2):",
        difficulty_label: "SCHWIERIGKEIT:",
        diff_low: "LEICHT",
        diff_medium: "MITTEL",
        diff_hard: "SCHWER",
        mobile_note: "MOBIL: NUR 1 SPIELER",
        launch_mission: "MISSION STARTEN",
        how_to_play: "SPIELANLEITUNG",
        settings: "EINSTELLUNGEN",
        top_guns: "TOP-PILOTEN",
        p1_score_label: "S1: ",
        p2_score_label: "S2: ",
        level_label: "LEVEL: ",
        btn_pause: "PAUSE",
        btn_resume: "WEITER",
        btn_quit: "BEENDEN",
        paused_title: "PAUSIERT",
        paused_desc: "DRÜCKE 'P' ODER KLICKE ZUM FORTSETZEN",
        upgrade_title: "SPIELER 1 UPGRADE",
        upgrade_suffix: "UPGRADE",
        upgrade_rapid_title: "SCHNELLFEUER",
        upgrade_rapid_desc: "Schneller nachladen",
        upgrade_explosion_title: "EXPLOSION",
        upgrade_explosion_desc: "Chance auf Flächenschaden",
        upgrade_laser_title: "LASER",
        upgrade_laser_desc: "Chance auf durchdringenden Strahl",
        upgrade_thrust_title: "SCHUB",
        upgrade_thrust_desc: "Geschwindigkeit erhöhen",
        upgrade_shield_title: "KRAFTFELD",
        upgrade_shield_desc: "S/Runter zum Blocken",
        upgrade_wave_title: "SCHOCKWELLE",
        upgrade_wave_desc: "J/Schrägstrich zum Bildschirmfegen",
        upgrade_freeze_title: "EINFRIEREN",
        upgrade_freeze_desc: "Gegner vor dir einfrieren",
        pvp_matchmaking: "SPIELERSUCHE...",
        pvp_score: "STAND",
        pvp_round: "RUNDE",
        controls_hint: "S1: A/D+W | S2: PFEILE L/R+UP | P: PAUSE",
        btn_zap: "ZAP",
        btn_shield: "SCHILD",
        btn_wave: "WELLE",
        briefing_title: "EINWEISUNG",
        movement_title: "BEWEGUNG",
        brief_movement_p1: "<strong>S1:</strong> A / D (Seite) | LEERTASTE (Schub vorwärts)",
        brief_movement_p2: "<strong>S2:</strong> ← / → (Seite)",
        brief_movement_note: "* Schiffe driften automatisch zurück.",
        abilities_title: "FÄHIGKEITEN",
        brief_abilities_tap: "<strong>TIPPEN:</strong> Normaler Schuss",
        brief_abilities_laser: "<strong>DOPPELTIPPEN:</strong> Laserstrahl (2s Abklingzeit)",
        brief_abilities_p1p2: "S1: W | S2: ↑",
        brief_abilities_shield: "<strong>SCHILD:</strong> S (S1) oder Runter (S2) falls freigeschaltet",
        brief_abilities_wave: "<strong>WELLE:</strong> J (S1) oder Schrägstrich (S2) zum Fegen",
        objectives_title: "MISSIONSZIELE",
        brief_objectives_survive: "<strong>ÜBERLEBEN:</strong> Wellen abschließen für Boss (Alle 10 Levels).",
        brief_objectives_health: "<strong>LEBEN:</strong> 3 geteilte Herzen (❤️). Treffer kostet ein Herz. Bei 0: Game Over.",
        brief_objectives_upgrade: "<strong>UPGRADE:</strong> Wähle ein Power-up nach jeder Runde.",
        back_to_base: "ZURÜCK ZUR BASIS",
        settings_title: "EINSTELLUNGEN",
        language_label: "SPRACHE",
        theme_label: "HINTERGRUNDFARBE",
        theme_space_blue: "WELTRAUM BLAU",
        theme_retro_black: "RETRO SCHWARZ",
        theme_cyber_purple: "CYBER LILA",
        theme_matrix_green: "MATRIX GRÜN",
        theme_crimson_red: "CRIMSON ROT",
        final_stand: "LETZTER STAND",
        btn_redeploy: "NEUSTART",
        btn_retry_from_start: "VON ANFANG AN RETRY",
        lvl_short: "LVL",
        chance_word: "CHANCE",
        spd_short: "GES",
        pvp_searching: "GEGNERSUCHE...",
        pvp_match_found: "SPIEL GEFUNDEN!",
        pvp_choose_card: "WÄHLE DEINE KARTE",
        pvp_waiting_opponent: "WARTE AUF GEGNER...",
        pvp_round_label: "RUNDE",
        opponent_left: "GEGNER HAT VERLASSEN",
        you_win: "DU HAST GEWONNEN!",
        you_lose: "DU HAST VERLOREN!",
        card_tank_name: "PANZER",
        card_tank_desc: "+2 LEBEN",
        card_scout_name: "SPÄHER",
        card_scout_desc: "+50% SPEED",
        card_glass_name: "GLASKANONE",
        card_glass_desc: "SOFORTIGES SCHIESSEN",
        upgrade_drone_title: "GEHACKTE DROHNE",
        upgrade_drone_desc: "Drücke X um Helferdrohnen zu rufen",
        keep_drones_label: "DROHNEN GESICHERT",
        upgrade_sword_swing_title: "SCHWERTSCHWUNG",
        upgrade_sword_swing_desc: "Drücke I, um ein zurückkehrendes, rotierendes Schwert zu werfen"
    },
    ja: {
        title: "ザップ・ザ・シング！",
        subtitle: "8ビットのリベンジ",
        players_label: "プレイヤー数:",
        p1_name_label: "カービィ (P1):",
        p2_name_label: "マリオ (P2):",
        difficulty_label: "難易度:",
        diff_low: "イージー",
        diff_medium: "ノーマル",
        diff_hard: "ハード",
        mobile_note: "モバイル: 1プレイヤー専用",
        launch_mission: "ミッション開始",
        how_to_play: "遊び方",
        settings: "設定",
        top_guns: "トップガン",
        p1_score_label: "P1: ",
        p2_score_label: "P2: ",
        level_label: "レベル: ",
        btn_pause: "一時停止",
        btn_resume: "再開",
        btn_quit: "終了",
        paused_title: "一時停止中",
        paused_desc: "Pキーかクリックで再開",
        upgrade_title: "プレイヤー1のアップグレード",
        upgrade_suffix: "のアップグレード",
        upgrade_rapid_title: "連射スピード",
        upgrade_rapid_desc: "リロード速度アップ",
        upgrade_explosion_title: "エクスプロージョン",
        upgrade_explosion_desc: "範囲ダメージの確率発生",
        upgrade_laser_title: "レーザー",
        upgrade_laser_desc: "貫通ビーム of 確率発生",
        upgrade_thrust_title: "スラスト",
        upgrade_thrust_desc: "移動スピードアップ",
        upgrade_shield_title: "フォースフィールド",
        upgrade_shield_desc: "Sか↓キーで被弾をブロック",
        upgrade_wave_title: "ショックウェーブ",
        upgrade_wave_desc: "Jか/キーで敵を一掃",
        upgrade_freeze_title: "フリーズ",
        upgrade_freeze_desc: "目の前の敵をフリーズ",
        pvp_matchmaking: "マッチング中...",
        pvp_score: "スコア",
        pvp_round: "ラウンド",
        controls_hint: "P1: A/D+W | P2: 矢印キー L/R+UP | P: 一時停止",
        btn_zap: "ザップ",
        btn_shield: "シールド",
        btn_wave: "ウェーブ",
        briefing_title: "作戦説明",
        movement_title: "操作方法",
        brief_movement_p1: "<strong>P1:</strong> A / D (左右) | スペース (前進)",
        brief_movement_p2: "<strong>P2:</strong> ← / → (左右)",
        brief_movement_note: "* 自機は自動的に元の位置に戻ります。",
        abilities_title: "アビリティ",
        brief_abilities_tap: "<strong>短押し:</strong> 通常ショット",
        brief_abilities_laser: "<strong>ダブルクリック:</strong> 貫通レーザー (2秒冷却)",
        brief_abilities_p1p2: "P1: W | P2: ↑",
        brief_abilities_shield: "<strong>シールド:</strong> アンロック時 S (P1) / ↓ (P2)",
        brief_abilities_wave: "<strong>ショックウェーブ:</strong> J (P1) / / (P2) で敵を一掃",
        objectives_title: "目的",
        brief_objectives_survive: "<strong>生存:</strong> 敵を倒してボスを呼び出す (10レベルごと)。",
        brief_objectives_health: "<strong>ライフ:</strong> 3つの共有ライフ (❤️)。被弾でマイナス1、すべて失うとゲームオーバー。",
        brief_objectives_upgrade: "<strong>強化:</strong> ラウンドクリアごとにパワーアップを選択。",
        back_to_base: "ベースに戻る",
        settings_title: "設定",
        language_label: "言語",
        theme_label: "背景カラー",
        theme_space_blue: "スペースブルー",
        theme_retro_black: "レトロブラック",
        theme_cyber_purple: "サイバーパープル",
        theme_matrix_green: "マトリックスグリーン",
        theme_crimson_red: "クリムゾンレッド",
        final_stand: "ファイナルスタンド",
        btn_redeploy: "再出撃",
        btn_retry_from_start: "最初からリトライ",
        lvl_short: "LV",
        chance_word: "確率",
        spd_short: "速度",
        pvp_searching: "対戦相手を探しています...",
        pvp_match_found: "マッチング完了！",
        pvp_choose_card: "カードを選んでください",
        pvp_waiting_opponent: "対戦相手を待っています...",
        pvp_round_label: "ラウンド",
        opponent_left: "対戦相手が退出しました",
        you_win: "あなたの勝ち！",
        you_lose: "あなたの負け！",
        card_tank_name: "タンク",
        card_tank_desc: "+2 ライフ",
        card_scout_name: "スカウト",
        card_scout_desc: "+50% 速度",
        card_glass_name: "ガラスの砲身",
        card_glass_desc: "即時射撃",
        upgrade_drone_title: "ハッキングドローン",
        upgrade_drone_desc: "Xキーで赤いドローンを召喚",
        keep_drones_label: "ドローン固定",
        upgrade_sword_swing_title: "ソードスイング",
        upgrade_sword_swing_desc: "Iキーで戻ってくる回転する剣を投げる"
    }
};

function getTranslation(key) {
    return LOCALIZATION[currentLanguage]?.[key] || LOCALIZATION['en']?.[key] || key;
}

function applyLanguage(lang) {
    if (!LOCALIZATION[lang]) lang = 'en';
    currentLanguage = lang;
    localStorage.setItem('selected-lang', lang);

    document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.dataset.langKey;
        if (LOCALIZATION[lang][key]) {
            if (LOCALIZATION['en'][key].includes('<') || LOCALIZATION[lang][key].includes('<')) {
                el.innerHTML = LOCALIZATION[lang][key];
            } else {
                el.textContent = LOCALIZATION[lang][key];
            }
        }
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });

    updateDynamicTexts();
}

function applyTheme(themeName) {
    const themes = {
        'blue': {
            '--bg-color': '#0d1b2a',
            '--accent-blue': '#3a86ff',
            '--text-color': '#e0e1dd',
            '--deep-blue': '#0d1b2a',
            '--bg-card': '#1b263b',
            '--canvas-bg': '#000000',
            '--body-bg': '#000000'
        },
        'black': {
            '--bg-color': '#111111',
            '--accent-blue': '#ffffff',
            '--text-color': '#e0e1dd',
            '--deep-blue': '#111111',
            '--bg-card': '#222222',
            '--canvas-bg': '#000000',
            '--body-bg': '#000000'
        },
        'purple': {
            '--bg-color': '#240046',
            '--accent-blue': '#ff006e',
            '--text-color': '#ffbe0b',
            '--deep-blue': '#240046',
            '--bg-card': '#3c096c',
            '--canvas-bg': '#10002b',
            '--body-bg': '#0f021a'
        },
        'green': {
            '--bg-color': '#0d2611',
            '--accent-blue': '#00ff66',
            '--text-color': '#00ff66',
            '--deep-blue': '#0d2611',
            '--bg-card': '#1b4d22',
            '--canvas-bg': '#001102',
            '--body-bg': '#020d04'
        },
        'red': {
            '--bg-color': '#2d0a0d',
            '--accent-blue': '#ff003c',
            '--text-color': '#ffb3c1',
            '--deep-blue': '#2d0a0d',
            '--bg-card': '#4a151b',
            '--canvas-bg': '#180406',
            '--body-bg': '#140204'
        }
    };
    
    const theme = themes[themeName] || themes['blue'];
    currentTheme = themeName;
    localStorage.setItem('selected-theme', themeName);

    const root = document.documentElement;
    for (const [key, value] of Object.entries(theme)) {
        root.style.setProperty(key, value);
    }
    
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === themeName) {
            btn.classList.add('active');
        }
    });
}

function updateDynamicTexts() {
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
        pauseBtn.textContent = (gameState === 'PAUSED') ? getTranslation('btn_resume') : getTranslation('btn_pause');
    }
    
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.textContent = (totalLives > 0) ? getTranslation('btn_redeploy') : getTranslation('btn_retry_from_start');
    }

    if (gameState === 'UPGRADING' && players && players[currentUpgradingPlayer]) {
        updateUpgradeOverlay();
    }
}

// Initial Load
function initAll() {
    initUIListeners();
    initPlayerMode();
    loadScores();

    // Load saved settings
    const savedLang = localStorage.getItem('selected-lang') || 'en';
    const savedTheme = localStorage.getItem('selected-theme') || 'blue';
    applyLanguage(savedLang);
    applyTheme(savedTheme);

    console.log("Game UI initialized!");
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}

// Intro Sound & Audio Init
window.addEventListener('mousedown', () => {
    try {
        sfx.init();
        if (gameState === 'SETUP') sfx.playIntroBGM();
    } catch (e) {}
}, { once: true });
