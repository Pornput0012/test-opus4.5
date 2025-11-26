import { useRef, useEffect, useCallback, useState } from 'react';
import { Player } from '../game/Player';
import { Monster } from '../game/Monster';
import { LEVELS, getLevelById } from '../game/levels';
import { CANVAS_WIDTH, CANVAS_HEIGHT, WEAPONS } from '../game/constants';

// Drawing utility functions (outside of component to avoid re-creation)
const drawTree = (ctx, x, y) => {
  ctx.fillStyle = '#4a3728';
  ctx.fillRect(x - 10, y, 20, 100);
  ctx.fillStyle = '#228B22';
  ctx.beginPath();
  ctx.moveTo(x, y - 80);
  ctx.lineTo(x - 40, y + 20);
  ctx.lineTo(x + 40, y + 20);
  ctx.fill();
};

const drawCloud = (ctx, x, y) => {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.arc(x + 25, y - 5, 25, 0, Math.PI * 2);
  ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
  ctx.fill();
};

const drawThemeDecorations = (ctx, theme, stalactiteHeights, cloudOffsets) => {
  ctx.globalAlpha = 0.3;
  
  if (theme.name === 'Enchanted Forest') {
    for (let i = 0; i < 5; i++) {
      drawTree(ctx, 100 + i * 250, 380);
    }
  } else if (theme.name === 'Dark Cave') {
    for (let i = 0; i < 10; i++) {
      ctx.fillStyle = '#4a4a6a';
      ctx.beginPath();
      ctx.moveTo(50 + i * 120, 0);
      ctx.lineTo(60 + i * 120, 50 + stalactiteHeights[i]);
      ctx.lineTo(70 + i * 120, 0);
      ctx.fill();
    }
  } else if (theme.name === 'Volcanic Wasteland') {
    ctx.fillStyle = '#FF4500';
    ctx.globalAlpha = 0.1;
    ctx.fillRect(0, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 100);
  } else if (theme.name === 'Sky Temple - Final Battle') {
    for (let i = 0; i < 8; i++) {
      drawCloud(ctx, 50 + i * 150, 50 + cloudOffsets[i]);
    }
  }
  
  ctx.globalAlpha = 1;
};

const drawBackground = (ctx, levelData, stalactiteHeights, cloudOffsets) => {
  if (!levelData) return;
  
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  const theme = levelData.theme;
  
  gradient.addColorStop(0, theme.background.includes('#1a472a') ? '#1a472a' : 
                         theme.background.includes('#1a1a2e') ? '#1a1a2e' :
                         theme.background.includes('#2c1810') ? '#2c1810' :
                         theme.background.includes('#4a1a1a') ? '#4a1a1a' : '#87CEEB');
  gradient.addColorStop(1, theme.groundColor);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawThemeDecorations(ctx, levelData.theme, stalactiteHeights, cloudOffsets);
};

const drawPlatforms = (ctx, platforms, levelData) => {
  if (!levelData) return;
  
  platforms.forEach(platform => {
    ctx.fillStyle = levelData.theme.platformColor;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    
    ctx.fillStyle = platform.height > 30 ? levelData.theme.groundColor : levelData.theme.platformColor;
    ctx.fillRect(platform.x, platform.y, platform.width, 5);
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
  });
};

const drawObstacles = (ctx, obstacles) => {
  obstacles.forEach(obstacle => {
    if (obstacle.type === 'spikes') {
      ctx.fillStyle = '#808080';
      const spikeCount = Math.floor(obstacle.width / 15);
      for (let i = 0; i < spikeCount; i++) {
        ctx.beginPath();
        ctx.moveTo(obstacle.x + i * 15, obstacle.y + obstacle.height);
        ctx.lineTo(obstacle.x + i * 15 + 7.5, obstacle.y);
        ctx.lineTo(obstacle.x + i * 15 + 15, obstacle.y + obstacle.height);
        ctx.fill();
      }
    } else if (obstacle.type === 'lava') {
      const time = Date.now() / 200;
      ctx.fillStyle = '#FF4500';
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      
      ctx.fillStyle = '#FF6347';
      for (let i = 0; i < 5; i++) {
        const bubbleX = obstacle.x + (obstacle.width * (i / 5)) + Math.sin(time + i) * 5;
        const bubbleY = obstacle.y + 5 + Math.sin(time * 2 + i) * 5;
        ctx.beginPath();
        ctx.arc(bubbleX + 10, bubbleY + 10, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.fillStyle = 'rgba(255, 69, 0, 0.3)';
      ctx.fillRect(obstacle.x - 5, obstacle.y - 20, obstacle.width + 10, 25);
    } else if (obstacle.type === 'cloud') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.beginPath();
      ctx.ellipse(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, 
                 obstacle.width / 2, obstacle.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  });
};

const drawExit = (ctx, position) => {
  const time = Date.now() / 500;
  
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 3;
  
  ctx.fillStyle = `rgba(255, 215, 0, ${0.2 + Math.sin(time) * 0.1})`;
  ctx.beginPath();
  ctx.ellipse(position.x + 25, position.y + 35, 35, 45, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.strokeStyle = '#FFD700';
  ctx.beginPath();
  ctx.ellipse(position.x + 25, position.y + 35, 25, 35, 0, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.fillStyle = `rgba(138, 43, 226, ${0.5 + Math.sin(time * 2) * 0.2})`;
  ctx.beginPath();
  ctx.ellipse(position.x + 25, position.y + 35, 20, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#FFD700';
  for (let i = 0; i < 5; i++) {
    const angle = (time + i * (Math.PI * 2 / 5));
    const sparkleX = position.x + 25 + Math.cos(angle) * 30;
    const sparkleY = position.y + 35 + Math.sin(angle) * 40;
    ctx.beginPath();
    ctx.arc(sparkleX, sparkleY, 3, 0, Math.PI * 2);
    ctx.fill();
  }
};

const updateAndDrawWeapons = (ctx, player, weaponPickupsRef) => {
  const time = Date.now() / 300;
  
  weaponPickupsRef.current.forEach(weapon => {
    if (weapon.collected) return;
    
    const bobY = Math.sin(time + weapon.bobOffset) * 5;
    const weaponData = WEAPONS[weapon.type];
    
    const pickupRect = { x: weapon.x - 15, y: weapon.y - 15 + bobY, width: 30, height: 30 };
    if (player.checkCollision(pickupRect)) {
      if (player.addWeapon(weapon.type)) {
        weapon.collected = true;
        player.addScore(200);
      }
    }
    
    if (!weapon.collected) {
      ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(weapon.x, weapon.y + bobY, 25, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = weaponData.color === '#silver' ? '#C0C0C0' : weaponData.color;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.rect(weapon.x - 15, weapon.y - 5 + bobY, 30, 10);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#FFF';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(weaponData.name, weapon.x, weapon.y + 25 + bobY);
    }
  });
};

const updateAndDrawCollectibles = (ctx, player, collectiblesRef) => {
  const time = Date.now() / 300;
  
  collectiblesRef.current.forEach(item => {
    if (item.collected) return;
    
    const bobY = Math.sin(time + item.bobOffset) * 3;
    
    const pickupRect = { x: item.x - 10, y: item.y - 10 + bobY, width: 20, height: 20 };
    if (player.checkCollision(pickupRect)) {
      item.collected = true;
      if (item.type === 'health') {
        player.heal(item.value);
      } else if (item.type === 'coin') {
        player.addCoin(item.value);
        player.addScore(item.value);
      }
    }
    
    if (!item.collected) {
      if (item.type === 'health') {
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        const hx = item.x;
        const hy = item.y + bobY;
        ctx.moveTo(hx, hy + 5);
        ctx.bezierCurveTo(hx, hy, hx - 10, hy, hx - 10, hy + 7);
        ctx.bezierCurveTo(hx - 10, hy + 15, hx, hy + 20, hx, hy + 20);
        ctx.bezierCurveTo(hx, hy + 20, hx + 10, hy + 15, hx + 10, hy + 7);
        ctx.bezierCurveTo(hx + 10, hy, hx, hy, hx, hy + 5);
        ctx.fill();
      } else if (item.type === 'coin') {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(item.x, item.y + bobY, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#B8860B';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#B8860B';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('$', item.x, item.y + 4 + bobY);
      }
    }
  });
};

const drawUI = (ctx, monstersRef) => {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(10, CANVAS_HEIGHT - 40, 100, 30);
  ctx.fillStyle = '#FFF';
  ctx.font = '12px Arial';
  ctx.textAlign = 'left';
  
  const remainingMonsters = monstersRef.current.filter(m => m.isAlive).length;
  ctx.fillText(`Monsters: ${remainingMonsters}`, 15, CANVAS_HEIGHT - 20);
};

const useGameEngine = () => {
  const canvasRef = useRef(null);
  const playerRef = useRef(null);
  const monstersRef = useRef([]);
  const weaponPickupsRef = useRef([]);
  const collectiblesRef = useRef([]);
  const keysRef = useRef({
    left: false,
    right: false,
    jump: false,
    attack: false,
    dash: false,
    switchWeapon: false
  });
  const jumpPressedRef = useRef(false);
  const attackPressedRef = useRef(false);
  const switchWeaponPressedRef = useRef(false);
  const gameLoopRef = useRef(null);
  const lastTimeRef = useRef(0);
  const stalactiteHeightsRef = useRef([]);
  const cloudOffsetsRef = useRef([]);

  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameState, setGameState] = useState('menu');
  const [playerStats, setPlayerStats] = useState({
    health: 100,
    maxHealth: 100,
    score: 0,
    coins: 0,
    weapons: [],
    currentWeapon: null
  });
  const [levelData, setLevelData] = useState(null);

  // Update player stats for UI
  const updatePlayerStats = useCallback(() => {
    if (playerRef.current) {
      setPlayerStats({
        health: playerRef.current.health,
        maxHealth: playerRef.current.maxHealth,
        score: playerRef.current.score,
        coins: playerRef.current.coins,
        weapons: playerRef.current.weapons,
        currentWeapon: playerRef.current.currentWeapon
      });
    }
  }, []);

  // Initialize level
  const initLevel = useCallback((levelId) => {
    const level = getLevelById(levelId);
    setLevelData(level);

    // Generate random decoration offsets once per level
    stalactiteHeightsRef.current = Array(10).fill(0).map(() => Math.random() * 30);
    cloudOffsetsRef.current = Array(8).fill(0).map(() => Math.random() * 100);

    // Create player
    const player = new Player(level.startPosition.x, level.startPosition.y);
    
    // Keep weapons from previous level
    if (playerRef.current) {
      player.weapons = playerRef.current.weapons;
      player.currentWeapon = playerRef.current.currentWeapon;
      player.score = playerRef.current.score;
      player.coins = playerRef.current.coins;
    }
    
    playerRef.current = player;

    // Create monsters
    monstersRef.current = level.monsters.map(config => new Monster({ ...config }));

    // Create weapon pickups
    weaponPickupsRef.current = level.weapons.map(w => ({
      ...w,
      collected: false,
      bobOffset: Math.random() * Math.PI * 2
    }));

    // Create collectibles
    collectiblesRef.current = level.collectibles.map(c => ({
      ...c,
      collected: false,
      bobOffset: Math.random() * Math.PI * 2
    }));

    updatePlayerStats();
  }, [updatePlayerStats]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;

      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          keysRef.current.left = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          keysRef.current.right = true;
          break;
        case 'ArrowUp':
        case 'KeyW':
        case 'Space':
          if (!jumpPressedRef.current) {
            keysRef.current.jump = true;
            jumpPressedRef.current = true;
          }
          break;
        case 'KeyJ':
        case 'KeyZ':
          if (!attackPressedRef.current) {
            keysRef.current.attack = true;
            attackPressedRef.current = true;
          }
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keysRef.current.dash = true;
          break;
        case 'KeyQ':
          if (!switchWeaponPressedRef.current) {
            keysRef.current.switchWeapon = true;
            switchWeaponPressedRef.current = true;
          }
          break;
        case 'Escape':
          setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          keysRef.current.left = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          keysRef.current.right = false;
          break;
        case 'ArrowUp':
        case 'KeyW':
        case 'Space':
          keysRef.current.jump = false;
          jumpPressedRef.current = false;
          break;
        case 'KeyJ':
        case 'KeyZ':
          keysRef.current.attack = false;
          attackPressedRef.current = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keysRef.current.dash = false;
          break;
        case 'KeyQ':
          keysRef.current.switchWeapon = false;
          switchWeaponPressedRef.current = false;
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Effect to run game loop
  useEffect(() => {
    if (gameState !== 'playing' || !levelData) return;

    const runGameLoop = (timestamp) => {
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;

      const player = playerRef.current;
      const monsters = monstersRef.current;
      const platforms = levelData.platforms;

      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw background
      drawBackground(ctx, levelData, stalactiteHeightsRef.current, cloudOffsetsRef.current);

      // Draw platforms
      drawPlatforms(ctx, platforms, levelData);

      // Draw obstacles
      drawObstacles(ctx, levelData.obstacles);

      // Draw exit
      drawExit(ctx, levelData.exitPosition);

      // Update and draw collectibles
      updateAndDrawCollectibles(ctx, player, collectiblesRef);

      // Update and draw weapon pickups
      updateAndDrawWeapons(ctx, player, weaponPickupsRef);

      // Update player
      player.update(keysRef.current, platforms, deltaTime);

      // Handle jump
      if (keysRef.current.jump) {
        player.jump(keysRef.current);
        keysRef.current.jump = false;
      }

      // Handle attack
      if (keysRef.current.attack) {
        player.attack();
        keysRef.current.attack = false;
      }

      // Handle weapon switch
      if (keysRef.current.switchWeapon) {
        player.switchWeapon();
        keysRef.current.switchWeapon = false;
      }

      // Update and draw monsters
      for (const monster of monsters) {
        monster.update(player, platforms, deltaTime);
        monster.draw(ctx);

        // Check player attack hitting monster
        if (player.isAttacking && monster.isAlive) {
          const hitbox = player.getAttackHitbox();
          if (hitbox && monster.checkCollision(hitbox)) {
            const died = monster.takeDamage(player.currentWeapon?.damage || 10);
            if (died) {
              player.addScore(monster.points);
            }
          }
        }

        // Check monster hitting player
        if (monster.checkCollisionWithPlayer(player) && monster.canAttack()) {
          if (player.takeDamage(monster.damage)) {
            monster.performAttack();
          }
        }
      }

      // Draw player
      player.draw(ctx);

      // Check obstacle collisions
      for (const obstacle of levelData.obstacles) {
        if (player.checkCollision(obstacle)) {
          const damageAmount = obstacle.type === 'lava' ? 2 : 1;
          player.takeDamage(damageAmount);
        }
      }

      // Check if player fell off the map
      if (player.y > CANVAS_HEIGHT) {
        player.takeDamage(player.health);
      }

      // Check if player reached exit
      const exitRect = {
        x: levelData.exitPosition.x,
        y: levelData.exitPosition.y,
        width: 50,
        height: 70
      };
      
      if (player.checkCollision(exitRect)) {
        const allMonstersDefeated = monsters.every(m => !m.isAlive);
        if (allMonstersDefeated) {
          if (currentLevel >= LEVELS.length) {
            setGameState('victory');
          } else {
            setGameState('levelComplete');
          }
          return;
        }
      }

      // Check game over
      if (player.health <= 0) {
        setGameState('gameover');
        return;
      }

      // Update stats
      updatePlayerStats();

      // Keep player in bounds
      if (player.x < 0) player.x = 0;
      if (player.x > CANVAS_WIDTH - player.width) player.x = CANVAS_WIDTH - player.width;

      // Draw UI
      drawUI(ctx, monstersRef);

      gameLoopRef.current = requestAnimationFrame(runGameLoop);
    };

    lastTimeRef.current = performance.now();
    gameLoopRef.current = requestAnimationFrame(runGameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, levelData, currentLevel, updatePlayerStats]);

  // Start game
  const startGame = useCallback(() => {
    setCurrentLevel(1);
    initLevel(1);
    setGameState('playing');
  }, [initLevel]);

  // Continue to next level
  const nextLevel = useCallback(() => {
    const nextLevelId = currentLevel + 1;
    setCurrentLevel(nextLevelId);
    initLevel(nextLevelId);
    setGameState('playing');
  }, [currentLevel, initLevel]);

  // Restart game
  const restartGame = useCallback(() => {
    setCurrentLevel(1);
    playerRef.current = null;
    initLevel(1);
    setGameState('playing');
  }, [initLevel]);

  // Resume game
  const resumeGame = useCallback(() => {
    setGameState('playing');
  }, []);

  return {
    canvasRef,
    gameState,
    playerStats,
    currentLevel,
    levelData,
    startGame,
    restartGame,
    resumeGame,
    nextLevel,
    setGameState,
    totalLevels: LEVELS.length
  };
};

export default useGameEngine;
