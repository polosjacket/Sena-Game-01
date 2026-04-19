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
let level = 1;
let animationId;
let currentUpgradingPlayer = 0;
let heart = null;
let heartSpawnedInRound = false;
let totalLives = 3;


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
            shockwave: 0 // Number of shockwaves you can fire
        };

        this.activeShields = 0;
        this.shieldCooldown = 0;
        this.shockwaveCooldown = 0;

        // Laser mechanics
        this.laserCooldown = 0;
        this.lastShootPressTime = 0;
        this.shootWasDown = false;

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

        if ((keys[this.keys.left] || (this.id === 1 && touchState.left)) && this.x > 0) this.x -= this.upgrades.speed;
        if ((keys[this.keys.right] || (this.id === 1 && touchState.right)) && this.x < canvas.width - this.width) this.x += this.upgrades.speed;

        // Forward movement (Space)
        if (this.id === 1 && keys['Space'] && this.y > 50) {
            this.y -= this.upgrades.speed;
        } else if (this.y < canvas.height - 40) {
            this.y += 2; // Automatic drift back to baseline
        }

        // Shield Logic
        if (this.shieldCooldown > 0) this.shieldCooldown--;

        const isShieldDown = keys[this.keys.shield] || (this.id === 1 && touchState.shield);
        if (isShieldDown && this.upgrades.shield > 0 && this.shieldCooldown <= 0 && this.activeShields === 0) {
            this.activeShields = this.upgrades.shield;
            sfx.playPowerUp(); // Use an existing sound for activation
        }

        // Shockwave Logic
        if (this.shockwaveCooldown > 0) this.shockwaveCooldown--;

        const isShockwaveDown = keys[this.keys.shockwave] || (this.id === 1 && touchState.shockwave);
        if (isShockwaveDown && this.upgrades.shockwave > 0 && this.shockwaveCooldown <= 0) {
            playerShockwaves.push(new Shockwave(this.id, this.upgrades.shockwave));
            sfx.playExplosion(); 
            this.shockwaveCooldown = 300; // 5 seconds cooldown
        }

        if (this.laserCooldown > 0) this.laserCooldown--;

        const isShootDown = keys[this.keys.shoot] || (this.id === 1 && touchState.shoot);
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
        }

        if (this.cooldown > 0) this.cooldown--;

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
        this.width = widthOverride !== null ? widthOverride : (type === 'laser' ? 20 : 4);
        this.height = type === 'laser' ? canvas.height : 10;
        this.color = color;
        this.speed = speed;
        this.ownerId = ownerId;
        this.type = type;
        this.life = type === 'laser' ? 10 : 100; // Laser lasts 10 frames
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



    playerBullets = [];
    playerShockwaves = [];
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

    // Update & Draw Bullets
    playerBullets = playerBullets.filter(b => (b.type === 'laser' ? b.life > 0 : b.y > 0));
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
                const laserDmg = 15 + (player.upgrades.laserLvl - 1) * 2;
                boss.hp -= (b.type === 'laser' ? laserDmg / 10 : 10); // Nerfed laser damage to boss
                sfx.playHitSFX();
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
                // Damage invader
                inv.hp -= 1;
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

    animationId = requestAnimationFrame(gameLoop);
}

function showUpgradeScreen() {
    gameState = 'UPGRADING';
    sfx.playWinJingle();
    currentUpgradingPlayer = 0;
    
    const player = players[currentUpgradingPlayer];
    
    // Pick 2 random upgrades that are not at cap
    const allUpgrades = ['rapid', 'explosion', 'laser', 'freeze', 'speed', 'shield', 'shockwave'];
    const availableUpgrades = allUpgrades.filter(type => {
        if (type === 'rapid') return player.upgrades.rapid < 10;
        if (type === 'explosion') return player.upgrades.explosion < 1.0;
        if (type === 'laser') return player.upgrades.laserLvl < 10;
        if (type === 'freeze') return player.upgrades.freeze < 1.0;
        if (type === 'speed') return (player.upgrades.speed - PLAYER_SPEED) < 10;
        if (type === 'shield') return player.upgrades.shield < 10;
        if (type === 'shockwave') return player.upgrades.shockwave < 10;
        return true;
    });

    // Shuffle and pick 2
    const shuffled = availableUpgrades.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 2);

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

function updateUpgradeOverlay() {
    const player = players[currentUpgradingPlayer];
    document.getElementById('upgrade-title').textContent = `${player.name.toUpperCase()} UPGRADE`;
    
    // Update card levels
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const type = card.dataset.upgrade;
        let info = '';
        if (type === 'rapid') info = `LVL ${player.upgrades.rapid}/10`;
        else if (type === 'explosion') info = `${Math.round(player.upgrades.explosion * 100)}% CHANCE (LVL ${Math.round(player.upgrades.explosion * 10)}/10)`;
        else if (type === 'laser') info = `LVL ${player.upgrades.laserLvl}/10 (${Math.round(player.upgrades.laser * 100)}% CHANCE)`;
        else if (type === 'freeze') info = `${Math.round(player.upgrades.freeze * 100)}% CHANCE (LVL ${Math.round(player.upgrades.freeze * 10)}/10)`;
        else if (type === 'speed') info = `SPD ${Math.round(player.upgrades.speed)} (LVL ${Math.round(player.upgrades.speed - PLAYER_SPEED)}/10)`;
        else if (type === 'shield') info = `LVL ${player.upgrades.shield}/10`;
        else if (type === 'shockwave') info = `LVL ${player.upgrades.shockwave}/10`;
        
        const infoEl = card.querySelector('.level-info');
        if (infoEl) infoEl.textContent = info;
    });
}

function selectUpgrade(type) {
    console.log('Upgrading:', type, 'for player:', currentUpgradingPlayer);
    try { sfx.stopWinTheme(); } catch(e) {}
    
    const player = players[currentUpgradingPlayer];
    
    if (type === 'rapid' && player.upgrades.rapid < 10) {
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
    }

    if (playerMode === 2 && currentUpgradingPlayer === 0) {
        currentUpgradingPlayer = 1;
        updateUpgradeOverlay();
    } else {
        document.getElementById('upgrade-overlay').classList.remove('active');
        
        // Heal 1 heart upon completing the round
        if (totalLives < 3) {
            totalLives++;
            updateLivesUI();
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
    for (let i = 0; i < 3; i++) {
        const heart = document.createElement('span');
        heart.className = i < totalLives ? 'heart' : 'heart lost';
        heart.textContent = '❤️';
        container.appendChild(heart);
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
        endGame();
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
    restartBtn.textContent = 'RETRY FROM START';

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
    document.getElementById('mobile-controls').classList.remove('active');
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
            level = 1;
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
