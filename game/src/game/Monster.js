export class Monster {
  constructor(config) {
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
    this.name = config.name;
    this.health = config.health;
    this.maxHealth = config.health;
    this.damage = config.damage;
    this.speed = config.speed;
    this.color = config.color;
    this.points = config.points;
    this.patrolStart = config.patrolStart;
    this.patrolEnd = config.patrolEnd;
    this.facingRight = true;
    this.velocityX = config.speed;
    this.velocityY = 0;
    this.isAlive = true;
    this.isHurt = false;
    this.hurtTimer = 0;
    this.attackCooldown = 0;
    this.state = 'patrol';
    this.detectionRange = 200;
    this.attackRange = 50;
    this.aggroTimer = 0;
    this.jumpCooldown = 0;
    this.originalY = config.y;
    this.gravity = 0.5;
    this.isGrounded = true;
  }

  update(player, platforms, deltaTime) {
    if (!this.isAlive) return;

    // Update timers
    if (this.hurtTimer > 0) {
      this.hurtTimer -= deltaTime;
      if (this.hurtTimer <= 0) {
        this.isHurt = false;
      }
    }

    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }

    if (this.jumpCooldown > 0) {
      this.jumpCooldown -= deltaTime;
    }

    // Apply gravity
    if (!this.isGrounded) {
      this.velocityY += this.gravity;
      if (this.velocityY > 10) {
        this.velocityY = 10;
      }
    }

    // Check player distance for AI behavior
    const distanceToPlayer = this.getDistanceToPlayer(player);
    const playerIsAbove = player.y + player.height < this.y;
    const playerInRange = distanceToPlayer < this.detectionRange;

    if (playerInRange && player.health > 0) {
      this.state = 'chase';
      this.aggroTimer = 3000;
    } else if (this.aggroTimer > 0) {
      this.aggroTimer -= deltaTime;
      if (this.aggroTimer <= 0) {
        this.state = 'patrol';
      }
    }

    // AI behavior
    switch (this.state) {
      case 'patrol':
        this.patrol();
        break;
      case 'chase':
        this.chase(player, playerIsAbove);
        break;
    }

    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Check platform collisions
    this.isGrounded = false;
    for (const platform of platforms) {
      if (this.checkCollision(platform)) {
        if (this.velocityY > 0 && 
            this.y + this.height - this.velocityY <= platform.y) {
          this.y = platform.y - this.height;
          this.velocityY = 0;
          this.isGrounded = true;
        }
      }
    }

    // Keep in bounds
    if (this.x < 0) this.x = 0;
    if (this.x > 1200 - this.width) this.x = 1200 - this.width;
  }

  patrol() {
    // Move back and forth between patrol points
    if (this.x <= this.patrolStart) {
      this.facingRight = true;
      this.velocityX = this.speed;
    } else if (this.x >= this.patrolEnd) {
      this.facingRight = false;
      this.velocityX = -this.speed;
    }
  }

  chase(player, playerIsAbove) {
    // Chase the player
    const dx = player.x + player.width / 2 - (this.x + this.width / 2);
    
    if (dx > 10) {
      this.velocityX = this.speed * 1.5;
      this.facingRight = true;
    } else if (dx < -10) {
      this.velocityX = -this.speed * 1.5;
      this.facingRight = false;
    } else {
      this.velocityX = 0;
    }

    // Jump if player is above and we're grounded
    if (playerIsAbove && this.isGrounded && this.jumpCooldown <= 0) {
      this.velocityY = -12;
      this.isGrounded = false;
      this.jumpCooldown = 1500;
    }
  }

  getDistanceToPlayer(player) {
    const dx = player.x + player.width / 2 - (this.x + this.width / 2);
    const dy = player.y + player.height / 2 - (this.y + this.height / 2);
    return Math.sqrt(dx * dx + dy * dy);
  }

  checkCollisionWithPlayer(player) {
    if (!this.isAlive) return false;
    
    return (
      this.x < player.x + player.width &&
      this.x + this.width > player.x &&
      this.y < player.y + player.height &&
      this.y + this.height > player.y
    );
  }

  checkCollision(rect) {
    return (
      this.x < rect.x + rect.width &&
      this.x + this.width > rect.x &&
      this.y < rect.y + rect.height &&
      this.y + this.height > rect.y
    );
  }

  takeDamage(amount) {
    if (!this.isAlive) return false;
    
    this.health -= amount;
    this.isHurt = true;
    this.hurtTimer = 200;
    
    // Knockback
    this.velocityX = this.facingRight ? -5 : 5;
    
    if (this.health <= 0) {
      this.health = 0;
      this.isAlive = false;
      return true; // Died
    }
    return false;
  }

  canAttack() {
    return this.isAlive && this.attackCooldown <= 0;
  }

  performAttack() {
    this.attackCooldown = 1000;
  }

  draw(ctx) {
    if (!this.isAlive) return;

    ctx.save();

    // Hurt flash effect
    if (this.isHurt) {
      ctx.globalAlpha = 0.7;
    }

    // Draw based on monster type
    switch (this.name) {
      case 'Slime':
        this.drawSlime(ctx);
        break;
      case 'Goblin':
        this.drawGoblin(ctx);
        break;
      case 'Skeleton':
        this.drawSkeleton(ctx);
        break;
      case 'Demon':
        this.drawDemon(ctx);
        break;
      case 'Dragon':
        this.drawDragon(ctx);
        break;
      default:
        this.drawDefault(ctx);
    }

    // Draw health bar
    this.drawHealthBar(ctx);

    ctx.restore();
  }

  drawSlime(ctx) {
    // Body
    ctx.fillStyle = this.isHurt ? '#FF6B6B' : this.color;
    ctx.beginPath();
    ctx.ellipse(
      this.x + this.width / 2,
      this.y + this.height / 2 + 5,
      this.width / 2,
      this.height / 2 - 3,
      0, 0, Math.PI * 2
    );
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#000';
    const eyeOffset = this.facingRight ? 5 : -5;
    ctx.beginPath();
    ctx.arc(this.x + 12 + eyeOffset, this.y + 12, 4, 0, Math.PI * 2);
    ctx.arc(this.x + 28 + eyeOffset, this.y + 12, 4, 0, Math.PI * 2);
    ctx.fill();

    // Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.ellipse(this.x + 15, this.y + 8, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawGoblin(ctx) {
    // Body
    ctx.fillStyle = this.isHurt ? '#FF6B6B' : this.color;
    ctx.fillRect(this.x + 5, this.y + 15, 25, 25);

    // Head
    ctx.fillStyle = this.isHurt ? '#FF9999' : '#90EE90';
    ctx.beginPath();
    ctx.arc(this.x + 17, this.y + 12, 12, 0, Math.PI * 2);
    ctx.fill();

    // Pointy ears
    ctx.fillStyle = this.isHurt ? '#FF9999' : '#90EE90';
    ctx.beginPath();
    ctx.moveTo(this.x + 5, this.y + 8);
    ctx.lineTo(this.x - 3, this.y - 5);
    ctx.lineTo(this.x + 10, this.y + 5);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(this.x + 30, this.y + 8);
    ctx.lineTo(this.x + 38, this.y - 5);
    ctx.lineTo(this.x + 25, this.y + 5);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#FF0000';
    const eyeOffset = this.facingRight ? 3 : -3;
    ctx.beginPath();
    ctx.arc(this.x + 12 + eyeOffset, this.y + 10, 3, 0, Math.PI * 2);
    ctx.arc(this.x + 22 + eyeOffset, this.y + 10, 3, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = this.isHurt ? '#FF6B6B' : '#2E8B57';
    ctx.fillRect(this.x + 8, this.y + 40, 8, 10);
    ctx.fillRect(this.x + 20, this.y + 40, 8, 10);
  }

  drawSkeleton(ctx) {
    // Skull
    ctx.fillStyle = this.isHurt ? '#FFCCCC' : this.color;
    ctx.beginPath();
    ctx.arc(this.x + 17, this.y + 15, 12, 0, Math.PI * 2);
    ctx.fill();

    // Eye sockets
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(this.x + 12, this.y + 13, 4, 0, Math.PI * 2);
    ctx.arc(this.x + 22, this.y + 13, 4, 0, Math.PI * 2);
    ctx.fill();

    // Jaw
    ctx.fillStyle = this.isHurt ? '#FFCCCC' : this.color;
    ctx.fillRect(this.x + 8, this.y + 22, 18, 8);

    // Ribcage
    ctx.strokeStyle = this.isHurt ? '#FFCCCC' : this.color;
    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(this.x + 10, this.y + 35 + i * 6);
      ctx.lineTo(this.x + 25, this.y + 35 + i * 6);
      ctx.stroke();
    }

    // Legs
    ctx.strokeStyle = this.isHurt ? '#FFCCCC' : this.color;
    ctx.beginPath();
    ctx.moveTo(this.x + 12, this.y + 50);
    ctx.lineTo(this.x + 12, this.y + 60);
    ctx.moveTo(this.x + 23, this.y + 50);
    ctx.lineTo(this.x + 23, this.y + 60);
    ctx.stroke();
  }

  drawDemon(ctx) {
    // Body
    ctx.fillStyle = this.isHurt ? '#FF3333' : this.color;
    ctx.fillRect(this.x + 8, this.y + 25, 34, 35);

    // Head
    ctx.beginPath();
    ctx.arc(this.x + 25, this.y + 20, 15, 0, Math.PI * 2);
    ctx.fill();

    // Horns
    ctx.fillStyle = '#2F2F2F';
    ctx.beginPath();
    ctx.moveTo(this.x + 12, this.y + 10);
    ctx.lineTo(this.x + 5, this.y - 10);
    ctx.lineTo(this.x + 18, this.y + 5);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(this.x + 38, this.y + 10);
    ctx.lineTo(this.x + 45, this.y - 10);
    ctx.lineTo(this.x + 32, this.y + 5);
    ctx.fill();

    // Glowing eyes
    ctx.fillStyle = '#FFFF00';
    const eyeOffset = this.facingRight ? 3 : -3;
    ctx.beginPath();
    ctx.arc(this.x + 18 + eyeOffset, this.y + 18, 4, 0, Math.PI * 2);
    ctx.arc(this.x + 32 + eyeOffset, this.y + 18, 4, 0, Math.PI * 2);
    ctx.fill();

    // Eye glow
    ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
    ctx.beginPath();
    ctx.arc(this.x + 18 + eyeOffset, this.y + 18, 8, 0, Math.PI * 2);
    ctx.arc(this.x + 32 + eyeOffset, this.y + 18, 8, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = this.isHurt ? '#FF3333' : '#660000';
    ctx.fillRect(this.x + 12, this.y + 60, 10, 10);
    ctx.fillRect(this.x + 28, this.y + 60, 10, 10);
  }

  drawDragon(ctx) {
    // Body
    ctx.fillStyle = this.isHurt ? '#FF6600' : this.color;
    ctx.beginPath();
    ctx.ellipse(this.x + 50, this.y + 50, 45, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = this.isHurt ? '#FF6600' : this.color;
    ctx.beginPath();
    const headX = this.facingRight ? this.x + 85 : this.x + 15;
    ctx.ellipse(headX, this.y + 30, 20, 15, this.facingRight ? 0.3 : -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Spines
    ctx.fillStyle = '#8B0000';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(this.x + 20 + i * 15, this.y + 25);
      ctx.lineTo(this.x + 25 + i * 15, this.y + 5);
      ctx.lineTo(this.x + 30 + i * 15, this.y + 25);
      ctx.fill();
    }

    // Wings
    ctx.fillStyle = 'rgba(255, 69, 0, 0.7)';
    ctx.beginPath();
    ctx.moveTo(this.x + 30, this.y + 30);
    ctx.lineTo(this.x + 10, this.y - 20);
    ctx.lineTo(this.x + 50, this.y + 20);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(this.x + 70, this.y + 30);
    ctx.lineTo(this.x + 90, this.y - 20);
    ctx.lineTo(this.x + 50, this.y + 20);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#FFFF00';
    const eyeX = this.facingRight ? this.x + 90 : this.x + 10;
    ctx.beginPath();
    ctx.arc(eyeX, this.y + 28, 5, 0, Math.PI * 2);
    ctx.fill();

    // Fire breath (when attacking)
    if (this.attackCooldown > 800) {
      ctx.fillStyle = 'rgba(255, 100, 0, 0.8)';
      const fireX = this.facingRight ? this.x + 100 : this.x - 50;
      ctx.beginPath();
      ctx.moveTo(fireX, this.y + 30);
      ctx.lineTo(this.facingRight ? fireX + 60 : fireX - 60, this.y + 20);
      ctx.lineTo(this.facingRight ? fireX + 60 : fireX - 60, this.y + 40);
      ctx.fill();
    }

    // Tail
    ctx.strokeStyle = this.isHurt ? '#FF6600' : this.color;
    ctx.lineWidth = 8;
    ctx.beginPath();
    const tailStartX = this.facingRight ? this.x + 5 : this.x + 95;
    ctx.moveTo(tailStartX, this.y + 50);
    ctx.quadraticCurveTo(
      this.facingRight ? tailStartX - 30 : tailStartX + 30,
      this.y + 70,
      this.facingRight ? tailStartX - 20 : tailStartX + 20,
      this.y + 40
    );
    ctx.stroke();

    // Legs
    ctx.fillStyle = this.isHurt ? '#FF6600' : '#B22222';
    ctx.fillRect(this.x + 25, this.y + 70, 15, 10);
    ctx.fillRect(this.x + 60, this.y + 70, 15, 10);
  }

  drawDefault(ctx) {
    ctx.fillStyle = this.isHurt ? '#FF6B6B' : this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  drawHealthBar(ctx) {
    const barWidth = this.width;
    const barHeight = 5;
    const barY = this.y - 10;

    // Background
    ctx.fillStyle = '#333';
    ctx.fillRect(this.x, barY, barWidth, barHeight);

    // Health
    const healthPercent = this.health / this.maxHealth;
    ctx.fillStyle = healthPercent > 0.5 ? '#2ecc71' : healthPercent > 0.25 ? '#f1c40f' : '#e74c3c';
    ctx.fillRect(this.x, barY, barWidth * healthPercent, barHeight);

    // Border
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, barY, barWidth, barHeight);
  }
}
