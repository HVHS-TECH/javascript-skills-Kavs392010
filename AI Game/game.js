// Angry Birds Game
// ================

const canvas = document.createElement('canvas');
canvas.id = 'gameCanvas';
canvas.width = 1000;
canvas.height = 600;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Styling
document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.display = 'flex';
document.body.style.justifyContent = 'center';
document.body.style.alignItems = 'center';
document.body.style.fontFamily = 'Arial, sans-serif';

// Game variables
let currentBirdIndex = 0;
let score = 0;
let level = 1;
let gameActive = true;
let gameOver = false;
let hits = 0;

// Level configurations
const levels = [
  {
    levelNum: 1,
    birdsAvailable: 5,
    enemies: [
      { x: 750, y: 300, health: 40 },
      { x: 850, y: 320, health: 50 }
    ],
    structures: [
      { x: 700, y: 350, w: 20, h: 80 },
      { x: 800, y: 350, w: 20, h: 80 },
      { x: 880, y: 350, w: 20, h: 80 }
    ]
  },
  {
    levelNum: 2,
    birdsAvailable: 6,
    enemies: [
      { x: 700, y: 280, health: 45 },
      { x: 800, y: 300, health: 50 },
      { x: 900, y: 290, health: 45 }
    ],
    structures: [
      { x: 680, y: 350, w: 30, h: 70 },
      { x: 750, y: 350, w: 20, h: 80 },
      { x: 820, y: 350, w: 20, h: 80 },
      { x: 890, y: 350, w: 30, h: 70 }
    ]
  },
  {
    levelNum: 3,
    birdsAvailable: 7,
    enemies: [
      { x: 650, y: 250, health: 55 },
      { x: 800, y: 280, health: 50 },
      { x: 900, y: 270, health: 60 },
      { x: 950, y: 320, health: 45 }
    ],
    structures: [
      { x: 620, y: 350, w: 20, h: 80 },
      { x: 700, y: 320, w: 40, h: 80 },
      { x: 800, y: 350, w: 20, h: 80 },
      { x: 880, y: 320, w: 40, h: 80 },
      { x: 950, y: 350, w: 20, h: 80 }
    ]
  },
  {
    levelNum: 4,
    birdsAvailable: 8,
    enemies: [
      { x: 700, y: 200, health: 60 },
      { x: 850, y: 220, health: 60 },
      { x: 950, y: 240, health: 55 },
      { x: 800, y: 300, health: 50 },
      { x: 900, y: 320, health: 50 }
    ],
    structures: [
      { x: 650, y: 300, w: 20, h: 80 },
      { x: 750, y: 300, w: 20, h: 80 },
      { x: 850, y: 300, w: 20, h: 80 },
      { x: 920, y: 300, w: 20, h: 80 }
    ]
  }
];

let currentLevelConfig = null;

// Physics
const gravity = 0.5;
const bounce = 0.7;

class Bird {
  constructor(x, y, birdData) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = 14;
    this.name = birdData.name;
    this.color = birdData.color;
    this.damage = birdData.damage;
    this.speed = birdData.speed;
    this.isLaunched = false;
    this.trail = [];
  }

  launch(angle, power) {
    this.vx = Math.cos(angle) * power * this.speed;
    this.vy = Math.sin(angle) * power * this.speed;
    this.isLaunched = true;
  }

  update() {
    if (!this.isLaunched) return;

    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;

    // Trail effect
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 20) this.trail.shift();

    // Boundary collision
    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.vx *= -bounce;
    }
    if (this.x + this.radius > canvas.width) {
      this.x = canvas.width - this.radius;
      this.vx *= -bounce;
    }
    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.vy *= -bounce;
    }
    if (this.y + this.radius > canvas.height - 80) {
      this.isLaunched = false;
      this.trail = [];
    }
  }

  draw() {
    // Trail with gradient
    this.trail.forEach((point, index) => {
      const alpha = (index / this.trail.length) * 0.4;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(point.x, point.y, this.radius * 0.7, 0, Math.PI * 2);
      ctx.fill();
    });

    // Bird body with gradient
    const gradient = ctx.createRadialGradient(this.x - 5, this.y - 5, 0, this.x, this.y, this.radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, this.color);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Eyes with shine
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(this.x - 6, this.y - 4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x + 6, this.y - 4, 5, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(this.x - 6, this.y - 4, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x + 6, this.y - 4, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Eye shine
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(this.x - 5, this.y - 5, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x + 7, this.y - 5, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Name label
    if (this.isLaunched) {
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
      ctx.fillText(this.name, this.x, this.y - this.radius - 12);
    }
  }
}

class Enemy {
  constructor(x, y, health = 40) {
    this.x = x;
    this.y = y;
    this.width = 35;
    this.height = 35;
    this.health = health;
    this.maxHealth = health;
  }

  takeDamage(damage) {
    this.health -= damage;
    return this.health <= 0;
  }

  draw() {
    // Enemy pig body
    ctx.fillStyle = '#2ecc71';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#27ae60';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Snout
    ctx.fillStyle = '#27ae60';
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2 - 3, this.y, 6, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(this.x - 7, this.y - 5, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x + 7, this.y - 5, 4, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(this.x - 7, this.y - 5, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x + 7, this.y - 5, 2, 0, Math.PI * 2);
    ctx.fill();

    // Health bar
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2 - 12, (this.health / this.maxHealth) * this.width, 6);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2 - 12, this.width, 6);
  }
}

class Structure {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.health = 60;
    this.maxHealth = 60;
  }

  takeDamage(damage) {
    this.health -= damage;
    return this.health <= 0;
  }

  draw() {
    // Wood with gradient
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    gradient.addColorStop(0, '#a0522d');
    gradient.addColorStop(1, '#654321');
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    // Wood texture lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < this.height; i += 10) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y + i);
      ctx.lineTo(this.x + this.width, this.y + i);
      ctx.stroke();
    }

    // Health bar
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(this.x, this.y - 10, (this.health / this.maxHealth) * this.width, 6);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y - 10, this.width, 6);
  }
}

// Birds data with names and personalities
const birds = [
  { name: 'Red', color: '#e74c3c', damage: 30, speed: 8 },
  { name: 'Chuck', color: '#f1c40f', damage: 25, speed: 12 },
  { name: 'Bomb', color: '#000000', damage: 50, speed: 6 },
  { name: 'Terence', color: '#c0392b', damage: 60, speed: 4 },
  { name: 'Stella', color: '#f39c12', damage: 35, speed: 9 }
];

// Game state
let bird = null;
let launchPower = 0;
let launchAngle = -45 * Math.PI / 180;
let enemies = [];
let structures = [];

// Launcher
const launcherX = 100;
const launcherY = 450;
const launcherLength = 60;

// Initialize game
function initGame() {
  currentBirdIndex = 0;
  bird = null;
  gameOver = false;
  hits = 0;
  
  if (level > levels.length) {
    // Game completed - show victory
    showGameComplete();
    return;
  }
  
  currentLevelConfig = levels[level - 1];
  
  // Load enemies from level config
  enemies = currentLevelConfig.enemies.map(e => new Enemy(e.x, e.y, e.health));
  
  // Load structures from level config
  structures = currentLevelConfig.structures.map(s => new Structure(s.x, s.y, s.w, s.h));
}

function loadNextLevel() {
  level++;
  if (level > levels.length) {
    showGameComplete();
  } else {
    initGame();
  }
}

function showGameComplete() {
  gameOver = true;
  // This will be handled in the game loop
}

// Restart game function
function restartGame() {
  score = 0;
  level = 1;
  initGame();
  gameLoop();
}

// Input handling
let mouseDown = false;
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;

  if (!bird && Math.hypot(mouseX - launcherX, mouseY - launcherY) < 40) {
    mouseDown = true;
  }
});

document.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

document.addEventListener('mouseup', () => {
  if (mouseDown) {
    mouseDown = false;
    const dx = mouseX - launcherX;
    const dy = mouseY - launcherY;
    launchPower = Math.min(Math.hypot(dx, dy) / 30, 3);
    launchAngle = Math.atan2(dy, dx);

    bird = new Bird(launcherX, launcherY, birds[currentBirdIndex]);
    bird.launch(launchAngle, launchPower);
  }
});

// Collision detection
function checkCollisions() {
  if (!bird || !bird.isLaunched) return;

  // Enemy collisions
  enemies.forEach((enemy, index) => {
    if (Math.hypot(bird.x - enemy.x, bird.y - enemy.y) < bird.radius + enemy.width / 2) {
      if (enemy.takeDamage(bird.damage)) {
        enemies.splice(index, 1);
        score += 100;
        hits++;
      }
      bird.isLaunched = false;
    }
  });

  // Structure collisions
  structures.forEach((struct, index) => {
    if (bird.x > struct.x && bird.x < struct.x + struct.width &&
        bird.y > struct.y && bird.y < struct.y + struct.height) {
      if (struct.takeDamage(bird.damage)) {
        structures.splice(index, 1);
        score += 50;
        hits++;
      }
      bird.isLaunched = false;
    }
  });
}

// Animation loop
function gameLoop() {
  // Background with gradient
  const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGradient.addColorStop(0, '#87CEEB');
  bgGradient.addColorStop(1, '#E0F6FF');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Clouds
  drawClouds();

  // Draw ground with gradient
  const groundGradient = ctx.createLinearGradient(0, canvas.height - 80, 0, canvas.height);
  groundGradient.addColorStop(0, '#34a853');
  groundGradient.addColorStop(1, '#2d8c4f');
  ctx.fillStyle = groundGradient;
  ctx.fillRect(0, canvas.height - 80, canvas.width, 80);
  ctx.strokeStyle = '#1b5e20';
  ctx.lineWidth = 3;
  ctx.strokeRect(0, canvas.height - 80, canvas.width, 80);

  // Draw grass line
  ctx.strokeStyle = '#238c38';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - 80);
  ctx.lineTo(canvas.width, canvas.height - 80);
  ctx.stroke();

  // Draw launcher base
  ctx.fillStyle = '#654321';
  ctx.fillRect(70, canvas.height - 90, 60, 40);
  ctx.strokeStyle = '#3e2723';
  ctx.lineWidth = 2;
  ctx.strokeRect(70, canvas.height - 90, 60, 40);

  // Draw launcher string
  ctx.strokeStyle = '#8b7355';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(launcherX, launcherY);
  ctx.lineTo(
    launcherX + Math.cos(launchAngle) * launcherLength,
    launcherY + Math.sin(launchAngle) * launcherLength
  );
  ctx.stroke();

  // Draw launcher peg
  ctx.fillStyle = '#8b4513';
  ctx.beginPath();
  ctx.arc(launcherX, launcherY, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#5c2e0a';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw cursor circle on launcher
  if (!bird) {
    ctx.fillStyle = 'rgba(255, 200, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(launcherX, launcherY, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 200, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Update and draw bird
  if (bird) {
    bird.update();
    bird.draw();
    checkCollisions();
  }

  // Draw enemies
  enemies.forEach(enemy => enemy.draw());

  // Draw structures
  structures.forEach(struct => struct.draw());

  // Draw UI panel
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(10, 10, 300, 100);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, 300, 100);

  // Draw UI text with better styling
  ctx.fillStyle = '#000';
  ctx.font = 'bold 20px Arial';
  ctx.fillText(`Score: ${score}`, 20, 35);
  ctx.fillText(`Level: ${level}/${levels.length}`, 20, 60);
  ctx.fillText(`Hits: ${hits}`, 20, 85);
  
  // Birds remaining
  const birdsRemaining = currentLevelConfig.birdsAvailable - currentBirdIndex;
  ctx.font = 'bold 16px Arial';
  ctx.fillText(`Birds: ${birdsRemaining}/${currentLevelConfig.birdsAvailable}`, 20, 102);

  if (bird && birds[currentBirdIndex]) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(canvas.width - 250, 10, 240, 50);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(canvas.width - 250, 10, 240, 50);

    ctx.fillStyle = '#000';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(`Current: ${birds[currentBirdIndex].name}`, canvas.width - 240, 35);
  }

  // Win condition - level complete
  if (enemies.length === 0 && structures.length === 0 && !bird && !gameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 50px Arial';
    ctx.textAlign = 'center';
    ctx.textShadow = '3px 3px 8px rgba(0,0,0,0.8)';
    ctx.fillText('🎉 LEVEL COMPLETE! 🎉', canvas.width / 2, canvas.height / 2 - 60);
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Level ${level} Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    
    if (level < levels.length) {
      ctx.font = 'bold 20px Arial';
      ctx.fillText('Press SPACE or click Restart for next level', canvas.width / 2, canvas.height / 2 + 70);
    } else {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 40px Arial';
      ctx.fillText('🏆 YOU WIN! 🏆', canvas.width / 2, canvas.height / 2 - 20);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px Arial';
      ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 70);
    }
    gameOver = true;
  }

  // Lose condition
  if (!bird && bird !== null && currentBirdIndex >= currentLevelConfig.birdsAvailable - 1 && enemies.length > 0 && !gameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#e74c3c';
    ctx.font = 'bold 50px Arial';
    ctx.textAlign = 'center';
    ctx.textShadow = '3px 3px 8px rgba(0,0,0,0.8)';
    ctx.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2 - 30);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
    ctx.fillText('Click Restart button or Press R to try again', canvas.width / 2, canvas.height / 2 + 70);
    gameOver = true;
    return;
  }

  if (!gameOver) {
    if (!bird && bird !== null && currentBirdIndex < currentLevelConfig.birdsAvailable - 1) {
      currentBirdIndex++;
    }
    requestAnimationFrame(gameLoop);
  }
}

// Draw clouds for atmosphere
function drawClouds() {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  
  // Cloud 1
  ctx.beginPath();
  ctx.arc(150, 80, 40, 0, Math.PI * 2);
  ctx.arc(200, 70, 50, 0, Math.PI * 2);
  ctx.arc(250, 80, 40, 0, Math.PI * 2);
  ctx.fill();

  // Cloud 2
  ctx.beginPath();
  ctx.arc(700, 120, 35, 0, Math.PI * 2);
  ctx.arc(750, 110, 45, 0, Math.PI * 2);
  ctx.arc(800, 120, 35, 0, Math.PI * 2);
  ctx.fill();
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'r') {
    restartGame();
  }
  if (e.key === ' ') {
    e.preventDefault();
    if (gameOver && level <= levels.length) {
      if (level < levels.length) {
        loadNextLevel();
        gameLoop();
      } else {
        restartGame();
        gameLoop();
      }
    }
  }
});

// Start game
initGame();
gameLoop();
