import { GRAVITY, PLAYER_SPEED, JUMP_FORCE, MAX_FALL_SPEED, PLAYER_STATES, WEAPONS } from './constants';

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 60;
    this.velocityX = 0;
    this.velocityY = 0;
    this.health = 100;
    this.maxHealth = 100;
    this.state = PLAYER_STATES.IDLE;
    this.facingRight = true;
    this.isGrounded = false;
    this.isAttacking = false;
    this.attackCooldown = 0;
    this.invincible = false;
    this.invincibleTimer = 0;
    this.weapons = [];
    this.currentWeapon = null;
    this.score = 0;
    this.coins = 0;
    this.jumpsRemaining = 2; // Double jump
    this.maxJumps = 2;
    this.canDash = true;
    this.dashCooldown = 0;
    this.isDashing = false;
    this.dashTimer = 0;
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.health = this.maxHealth;
    this.state = PLAYER_STATES.IDLE;
    this.isGrounded = false;
    this.isAttacking = false;
    this.attackCooldown = 0;
    this.invincible = false;
    this.invincibleTimer = 0;
    this.jumpsRemaining = this.maxJumps;
  }

  update(keys, platforms, deltaTime) {
    // Handle invincibility frames
    if (this.invincible) {
      this.invincibleTimer -= deltaTime;
      if (this.invincibleTimer <= 0) {
        this.invincible = false;
      }
    }

    // Handle attack cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }

    // Handle dash cooldown
    if (this.dashCooldown > 0) {
      this.dashCooldown -= deltaTime;
      if (this.dashCooldown <= 0) {
        this.canDash = true;
      }
    }

    // Handle dashing
    if (this.isDashing) {
      this.dashTimer -= deltaTime;
      if (this.dashTimer <= 0) {
        this.isDashing = false;
      }
    }

    // Movement
    if (!this.isDashing) {
      this.velocityX = 0;
      
      if (keys.left) {
        this.velocityX = -PLAYER_SPEED;
        this.facingRight = false;
      }
      if (keys.right) {
        this.velocityX = PLAYER_SPEED;
        this.facingRight = true;
      }

      // Dash
      if (keys.dash && this.canDash && !this.isDashing) {
        this.isDashing = true;
        this.dashTimer = 150;
        this.canDash = false;
        this.dashCooldown = 1000;
        this.velocityX = this.facingRight ? PLAYER_SPEED * 4 : -PLAYER_SPEED * 4;
        this.invincible = true;
        this.invincibleTimer = 150;
      }
    }

    // Apply gravity
    if (!this.isGrounded) {
      this.velocityY += GRAVITY;
      if (this.velocityY > MAX_FALL_SPEED) {
        this.velocityY = MAX_FALL_SPEED;
      }
    }

    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Check platform collisions
    this.isGrounded = false;
    for (const platform of platforms) {
      if (this.checkCollision(platform)) {
        // Landing on top of platform
        if (this.velocityY > 0 && 
            this.y + this.height - this.velocityY <= platform.y) {
          this.y = platform.y - this.height;
          this.velocityY = 0;
          this.isGrounded = true;
          this.jumpsRemaining = this.maxJumps;
        }
        // Hitting bottom of platform
        else if (this.velocityY < 0 &&
                 this.y - this.velocityY >= platform.y + platform.height) {
          this.y = platform.y + platform.height;
          this.velocityY = 0;
        }
        // Side collision
        else {
          if (this.velocityX > 0) {
            this.x = platform.x - this.width;
          } else if (this.velocityX < 0) {
            this.x = platform.x + platform.width;
          }
        }
      }
    }

    // Update state
    this.updateState();
  }

  jump(keys) {
    if (keys.jump && this.jumpsRemaining > 0) {
      this.velocityY = JUMP_FORCE;
      this.isGrounded = false;
      this.jumpsRemaining--;
      return true;
    }
    return false;
  }

  attack() {
    if (this.attackCooldown <= 0 && this.currentWeapon) {
      this.isAttacking = true;
      this.attackCooldown = this.currentWeapon.attackSpeed;
      setTimeout(() => {
        this.isAttacking = false;
      }, 200);
      return true;
    }
    return false;
  }

  getAttackHitbox() {
    if (!this.currentWeapon || !this.isAttacking) return null;
    
    const weapon = this.currentWeapon;
    const hitbox = {
      x: this.facingRight ? this.x + this.width : this.x - weapon.range,
      y: this.y + 10,
      width: weapon.range,
      height: this.height - 20
    };
    return hitbox;
  }

  takeDamage(amount) {
    if (this.invincible) return false;
    
    this.health -= amount;
    this.invincible = true;
    this.invincibleTimer = 1000;
    
    if (this.health <= 0) {
      this.health = 0;
      this.state = PLAYER_STATES.DEAD;
    }
    return true;
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  addWeapon(weaponType) {
    const weapon = WEAPONS[weaponType];
    if (weapon && !this.weapons.find(w => w.name === weapon.name)) {
      this.weapons.push({ ...weapon, type: weaponType });
      if (!this.currentWeapon) {
        this.currentWeapon = this.weapons[0];
      }
      return true;
    }
    return false;
  }

  switchWeapon() {
    if (this.weapons.length <= 1) return;
    const currentIndex = this.weapons.indexOf(this.currentWeapon);
    const nextIndex = (currentIndex + 1) % this.weapons.length;
    this.currentWeapon = this.weapons[nextIndex];
  }

  addScore(points) {
    this.score += points;
  }

  addCoin(value) {
    this.coins += value;
  }

  checkCollision(rect) {
    return (
      this.x < rect.x + rect.width &&
      this.x + this.width > rect.x &&
      this.y < rect.y + rect.height &&
      this.y + this.height > rect.y
    );
  }

  updateState() {
    if (this.health <= 0) {
      this.state = PLAYER_STATES.DEAD;
    } else if (this.isAttacking) {
      this.state = PLAYER_STATES.ATTACKING;
    } else if (!this.isGrounded) {
      this.state = this.velocityY < 0 ? PLAYER_STATES.JUMPING : PLAYER_STATES.FALLING;
    } else if (this.velocityX !== 0) {
      this.state = PLAYER_STATES.RUNNING;
    } else {
      this.state = PLAYER_STATES.IDLE;
    }
  }

  draw(ctx) {
    // Blink when invincible
    if (this.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
      return;
    }

    ctx.save();
    
    // Draw player body
    const bodyColor = this.isDashing ? '#00FFFF' : '#3498db';
    ctx.fillStyle = bodyColor;
    ctx.fillRect(this.x + 5, this.y + 15, 30, 35);
    
    // Draw head
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(this.x + 20, this.y + 12, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw eyes
    ctx.fillStyle = '#000';
    const eyeOffset = this.facingRight ? 3 : -3;
    ctx.beginPath();
    ctx.arc(this.x + 18 + eyeOffset, this.y + 10, 2, 0, Math.PI * 2);
    ctx.arc(this.x + 24 + eyeOffset, this.y + 10, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw legs
    ctx.fillStyle = '#2980b9';
    ctx.fillRect(this.x + 8, this.y + 50, 10, 10);
    ctx.fillRect(this.x + 22, this.y + 50, 10, 10);
    
    // Draw weapon if equipped
    if (this.currentWeapon) {
      this.drawWeapon(ctx);
    }
    
    // Draw attack effect
    if (this.isAttacking && this.currentWeapon) {
      this.drawAttackEffect(ctx);
    }
    
    ctx.restore();
  }

  drawWeapon(ctx) {
    const weapon = this.currentWeapon;
    ctx.strokeStyle = weapon.color;
    ctx.lineWidth = 4;
    
    const weaponX = this.facingRight ? this.x + 35 : this.x + 5;
    const weaponAngle = this.isAttacking ? (this.facingRight ? 0.5 : -0.5) : 0;
    
    ctx.save();
    ctx.translate(weaponX, this.y + 30);
    ctx.rotate(weaponAngle);
    
    if (weapon.type === 'MAGIC_STAFF') {
      // Draw magic staff
      ctx.strokeStyle = '#8B4513';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.facingRight ? 25 : -25, -15);
      ctx.stroke();
      
      // Magic orb
      ctx.fillStyle = '#9932CC';
      ctx.beginPath();
      ctx.arc(this.facingRight ? 28 : -28, -18, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Glow effect
      ctx.fillStyle = 'rgba(153, 50, 204, 0.3)';
      ctx.beginPath();
      ctx.arc(this.facingRight ? 28 : -28, -18, 12, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Draw melee weapon
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.facingRight ? 30 : -30, -10);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  drawAttackEffect(ctx) {
    const hitbox = this.getAttackHitbox();
    if (!hitbox) return;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
    
    // Draw slash effect for melee or projectile for magic
    if (this.currentWeapon.type === 'MAGIC_STAFF') {
      ctx.fillStyle = '#9932CC';
      for (let i = 0; i < 5; i++) {
        const x = hitbox.x + Math.random() * hitbox.width;
        const y = hitbox.y + Math.random() * hitbox.height;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}
