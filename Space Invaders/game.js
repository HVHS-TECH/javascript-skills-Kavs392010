// Space Invaders Game
// ===================

const canvas = document.createElement('canvas');
canvas.id = 'gameCanvas';
canvas.width = 1000;
canvas.height = 600;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Game variables
let score = 0;
let lives = 3;
let level = 1;
let gameOver = false;
let levelComplete = false;

// Physics
const gravity = 0.2;

// Player
class Player {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height - 60;
    this.width = 40;
    this.height = 40;
    this.speed = 6;
    this.bullets = [];
  }

  update(keys) {
    if (keys['ArrowLeft'] || keys['a']) {
      this.x -= this.speed;
    }
    if (keys['ArrowRight'] || keys['d']) {
      this.x += this.speed;
    }

    // Boundary check
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;

    // Update bullets
    this.bullets = this.bullets.filter(bullet => {
      bullet.y -= bullet.speed;
      return bullet.y > 0;
    });
  }

  shoot() {
    this.bullets.push({
      x: this.x + this.width / 2,
      y: this.y,
      width: 5,
      height: 15,
      speed: 8,
      color: '#FFD700'
    });
  }

  draw() {
    // Player spaceship body
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Player cockpit
    ctx.fillStyle = '#00AA00';
    ctx.fillRect(this.x + 15, this.y, 10, 15);

    // Player wings
    ctx.fillStyle = '#00DD00';
    ctx.fillRect(this.x, this.y + 20, 10, 15);
    ctx.fillRect(this.x + 30, this.y + 20, 10, 15);

    // Draw bullets
    this.bullets.forEach(bullet => {
      ctx.fillStyle = bullet.color;
      ctx.fillRect(bullet.x - bullet.width / 2, bullet.y, bullet.width, bullet.height);
    });
  }
}

// Enemy
class Enemy {
  constructor(x, y, type = 1) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.speed = 2 + level * 0.5;
    this.type = type;
    this.health = type === 1 ? 1 : 2;
    this.shootChance = 0.005;
    this.bullets = [];
  }

  update() {
    // Random shooting
    if (Math.random() < this.shootChance) {
      this.shoot();
    }

    // Update enemy bullets
    this.bullets = this.bullets.filter(bullet => {
      bullet.y += bullet.speed;
      return bullet.y < canvas.height;
    });
  }

  shoot() {
    this.bullets.push({
      x: this.x + this.width / 2,
      y: this.y + this.height,
      width: 4,
      height: 12,
      speed: 5,
      color: '#FF4444'
    });
  }

  draw() {
    if (this.type === 1) {
      // Regular enemy
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      
      ctx.fillStyle = '#FFFF00';
      ctx.beginPath();
      ctx.arc(this.x + 8, this.y + 8, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x + 22, this.y + 8, 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Boss enemy
      ctx.fillStyle = '#FF6600';
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFF00';
      ctx.beginPath();
      ctx.arc(this.x + 10, this.y + 10, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x + 20, this.y + 10, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw enemy bullets
    this.bullets.forEach(bullet => {
      ctx.fillStyle = bullet.color;
      ctx.fillRect(bullet.x - bullet.width / 2, bullet.y, bullet.width, bullet.height);
    });
  }

  takeDamage(damage) {
    this.health -= damage;
    return this.health <= 0;
  }
}

// Game state
const player = new Player();
let enemies = [];
let spacePressedOnce = false;

// Initialize level
function initLevel() {
  enemies = [];
  levelComplete = false;

  // Create enemy formation
  let enemyCount = 3 + level;
  let bossSpawn = level >= 3;

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < enemyCount; col++) {
      let type = (bossSpawn && row === 0 && col === Math.floor(enemyCount / 2)) ? 2 : 1;
      enemies.push(new Enemy(100 + col * 80, 50 + row * 60, type));
    }
  }
}

// Key tracking
const keys = {};
document.addEventListener('keydown', (e) => {
  keys[e.key] = true;

  if (e.key === ' ') {
    e.preventDefault();
    if (!spacePressedOnce) {
      spacePressedOnce = true;
      player.shoot();
    }
  }

  if (e.key.toLowerCase() === 'r') {
    if (gameOver) {
      restartGame();
    }
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
  if (e.key === ' ') {
    spacePressedOnce = false;
  }
});

// Collision detection
function checkCollisions() {
  // Check player bullets hitting enemies
  player.bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (bullet.x > enemy.x && bullet.x < enemy.x + enemy.width &&
          bullet.y > enemy.y && bullet.y < enemy.y + enemy.height) {
        if (enemy.takeDamage(1)) {
          enemies.splice(enemyIndex, 1);
          score += enemy.type === 1 ? 100 : 500;
        }
        player.bullets.splice(bulletIndex, 1);
      }
    });
  });

  // Check enemy bullets hitting player
  enemies.forEach(enemy => {
    enemy.bullets.forEach((bullet, bulletIndex) => {
      if (bullet.x > player.x && bullet.x < player.x + player.width &&
          bullet.y > player.y && bullet.y < player.y + player.height) {
        lives--;
        enemy.bullets.splice(bulletIndex, 1);
      }
    });
  });

  // Check if enemies reached bottom
  enemies.forEach(enemy => {
    if (enemy.y > canvas.height - 100) {
      lives = 0;
    }
  });
}

// Restart game
function restartGame() {
  score = 0;
  lives = 3;
  level = 1;
  gameOver = false;
  initLevel();
  gameLoop();
}

// Animation loop
function gameLoop() {
  // Background
  const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGradient.addColorStop(0, '#0a0a1a');
  bgGradient.addColorStop(1, '#1a0a2e');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw stars
  drawStars();

  // Update and draw player
  player.update(keys);
  player.draw();

  // Move enemies
  enemies.forEach((enemy, index) => {
    enemy.update();
    enemy.draw();

    // Simple left-right movement
    enemy.x += enemy.speed;
    if (enemy.x < 0 || enemy.x + enemy.width > canvas.width) {
      enemy.speed *= -1;
      enemy.y += 30;
    }
  });

  // Check collisions
  checkCollisions();

  // Draw UI
  ctx.fillStyle = '#00FF00';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`Score: ${score}`, 20, 30);
  ctx.fillText(`Lives: ${lives}`, 20, 60);
  ctx.fillText(`Level: ${level}`, 20, 90);

  // Level complete condition
  if (enemies.length === 0 && !levelComplete) {
    levelComplete = true;
    level++;
  }

  // Game Over - no lives
  if (lives <= 0) {
    gameOver = true;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FF0000';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
    ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 80);
    return;
  }

  // Level complete - advance
  if (levelComplete && enemies.length === 0) {
    if (level > 5) {
      // Victory
      gameOver = true;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 60px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🏆 YOU WIN! 🏆', canvas.width / 2, canvas.height / 2 - 40);
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
      ctx.fillText('Press R to Play Again', canvas.width / 2, canvas.height / 2 + 80);
      return;
    } else {
      // Next level
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00FF00';
      ctx.font = 'bold 50px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`LEVEL ${level} COMPLETE!`, canvas.width / 2, canvas.height / 2);
      ctx.font = 'bold 20px Arial';
      ctx.fillText('Starting next level...', canvas.width / 2, canvas.height / 2 + 50);

      setTimeout(() => {
        initLevel();
        gameLoop();
      }, 2000);
      return;
    }
  }

  requestAnimationFrame(gameLoop);
}

// Draw stars for atmosphere
function drawStars() {
  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < 50; i++) {
    const x = (i * 50 + Date.now() * 0.01) % canvas.width;
    const y = (i * 30 + i * i) % canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Start game
initLevel();
gameLoop();
