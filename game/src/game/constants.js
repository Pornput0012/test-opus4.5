// Game constants
export const CANVAS_WIDTH = 1200;
export const CANVAS_HEIGHT = 600;
export const GRAVITY = 0.8;
export const PLAYER_SPEED = 5;
export const JUMP_FORCE = -15;
export const MAX_FALL_SPEED = 15;

// Player states
export const PLAYER_STATES = {
  IDLE: 'idle',
  RUNNING: 'running',
  JUMPING: 'jumping',
  FALLING: 'falling',
  ATTACKING: 'attacking',
  HURT: 'hurt',
  DEAD: 'dead'
};

// Weapon types
export const WEAPONS = {
  SWORD: {
    name: 'Sword',
    damage: 20,
    range: 60,
    attackSpeed: 500,
    color: '#silver'
  },
  AXE: {
    name: 'Battle Axe',
    damage: 35,
    range: 50,
    attackSpeed: 800,
    color: '#8B4513'
  },
  SPEAR: {
    name: 'Spear',
    damage: 25,
    range: 90,
    attackSpeed: 600,
    color: '#CD853F'
  },
  MAGIC_STAFF: {
    name: 'Magic Staff',
    damage: 45,
    range: 200,
    attackSpeed: 1000,
    color: '#9932CC'
  }
};

// Monster types
export const MONSTERS = {
  SLIME: {
    name: 'Slime',
    health: 30,
    damage: 10,
    speed: 2,
    width: 40,
    height: 30,
    color: '#32CD32',
    points: 50
  },
  GOBLIN: {
    name: 'Goblin',
    health: 50,
    damage: 15,
    speed: 3,
    width: 35,
    height: 50,
    color: '#228B22',
    points: 100
  },
  SKELETON: {
    name: 'Skeleton',
    health: 70,
    damage: 20,
    speed: 2.5,
    width: 35,
    height: 60,
    color: '#F5F5DC',
    points: 150
  },
  DEMON: {
    name: 'Demon',
    health: 150,
    damage: 35,
    speed: 4,
    width: 50,
    height: 70,
    color: '#8B0000',
    points: 300
  },
  DRAGON: {
    name: 'Dragon',
    health: 500,
    damage: 50,
    speed: 3,
    width: 100,
    height: 80,
    color: '#FF4500',
    points: 1000
  }
};

// Level themes
export const THEMES = {
  FOREST: {
    name: 'Enchanted Forest',
    background: 'linear-gradient(180deg, #1a472a 0%, #2d5a3d 50%, #1a3a2a 100%)',
    platformColor: '#4a3728',
    groundColor: '#3d2f1f'
  },
  CAVE: {
    name: 'Dark Cave',
    background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
    platformColor: '#4a4a6a',
    groundColor: '#2a2a4a'
  },
  CASTLE: {
    name: 'Haunted Castle',
    background: 'linear-gradient(180deg, #2c1810 0%, #4a2c2a 50%, #1a1010 100%)',
    platformColor: '#5a4a4a',
    groundColor: '#3a2a2a'
  },
  VOLCANO: {
    name: 'Volcanic Wasteland',
    background: 'linear-gradient(180deg, #4a1a1a 0%, #6a2a1a 50%, #2a0a0a 100%)',
    platformColor: '#3a3a3a',
    groundColor: '#2a1a1a'
  },
  SKY: {
    name: 'Sky Temple',
    background: 'linear-gradient(180deg, #87CEEB 0%, #4682B4 50%, #1E90FF 100%)',
    platformColor: '#F5F5DC',
    groundColor: '#DEB887'
  }
};
