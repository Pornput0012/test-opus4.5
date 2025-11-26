import { CANVAS_WIDTH, CANVAS_HEIGHT, MONSTERS, WEAPONS, THEMES } from './constants';

// Level 1 - Forest (Easy)
const level1 = {
  id: 1,
  name: 'Enchanted Forest',
  theme: THEMES.FOREST,
  startPosition: { x: 50, y: 450 },
  exitPosition: { x: 1100, y: 150 },
  platforms: [
    // Ground
    { x: 0, y: 550, width: 400, height: 50 },
    { x: 500, y: 550, width: 400, height: 50 },
    { x: 1000, y: 550, width: 200, height: 50 },
    // Floating platforms
    { x: 150, y: 450, width: 100, height: 20 },
    { x: 350, y: 380, width: 120, height: 20 },
    { x: 550, y: 320, width: 100, height: 20 },
    { x: 750, y: 280, width: 150, height: 20 },
    { x: 1000, y: 200, width: 150, height: 20 },
  ],
  obstacles: [
    { x: 420, y: 520, width: 60, height: 30, type: 'spikes' },
    { x: 920, y: 520, width: 60, height: 30, type: 'spikes' },
  ],
  monsters: [
    { ...MONSTERS.SLIME, x: 200, y: 500, patrolStart: 100, patrolEnd: 350 },
    { ...MONSTERS.SLIME, x: 600, y: 500, patrolStart: 550, patrolEnd: 850 },
    { ...MONSTERS.GOBLIN, x: 800, y: 220, patrolStart: 750, patrolEnd: 900 },
  ],
  weapons: [
    { type: 'SWORD', x: 370, y: 340 },
  ],
  collectibles: [
    { type: 'health', x: 200, y: 420, value: 20 },
    { type: 'coin', x: 560, y: 280, value: 10 },
    { type: 'coin', x: 800, y: 240, value: 10 },
  ]
};

// Level 2 - Cave (Medium)
const level2 = {
  id: 2,
  name: 'Dark Cave',
  theme: THEMES.CAVE,
  startPosition: { x: 50, y: 450 },
  exitPosition: { x: 1100, y: 100 },
  platforms: [
    // Ground sections
    { x: 0, y: 550, width: 200, height: 50 },
    { x: 300, y: 550, width: 150, height: 50 },
    { x: 600, y: 550, width: 200, height: 50 },
    { x: 950, y: 550, width: 250, height: 50 },
    // Floating platforms
    { x: 100, y: 450, width: 80, height: 20 },
    { x: 250, y: 380, width: 100, height: 20 },
    { x: 450, y: 320, width: 80, height: 20 },
    { x: 350, y: 450, width: 80, height: 20 },
    { x: 550, y: 250, width: 100, height: 20 },
    { x: 700, y: 350, width: 80, height: 20 },
    { x: 850, y: 280, width: 120, height: 20 },
    { x: 1000, y: 180, width: 150, height: 20 },
  ],
  obstacles: [
    { x: 210, y: 520, width: 80, height: 30, type: 'spikes' },
    { x: 460, y: 520, width: 130, height: 30, type: 'spikes' },
    { x: 810, y: 520, width: 130, height: 30, type: 'spikes' },
  ],
  monsters: [
    { ...MONSTERS.SLIME, x: 80, y: 500, patrolStart: 20, patrolEnd: 180 },
    { ...MONSTERS.GOBLIN, x: 350, y: 500, patrolStart: 310, patrolEnd: 430 },
    { ...MONSTERS.SKELETON, x: 650, y: 490, patrolStart: 610, patrolEnd: 780 },
    { ...MONSTERS.GOBLIN, x: 900, y: 220, patrolStart: 860, patrolEnd: 970 },
  ],
  weapons: [
    { type: 'AXE', x: 560, y: 210 },
  ],
  collectibles: [
    { type: 'health', x: 270, y: 340, value: 25 },
    { type: 'coin', x: 460, y: 280, value: 15 },
    { type: 'coin', x: 710, y: 310, value: 15 },
    { type: 'health', x: 1050, y: 140, value: 30 },
  ]
};

// Level 3 - Castle (Hard)
const level3 = {
  id: 3,
  name: 'Haunted Castle',
  theme: THEMES.CASTLE,
  startPosition: { x: 50, y: 450 },
  exitPosition: { x: 1100, y: 50 },
  platforms: [
    // Ground with gaps
    { x: 0, y: 550, width: 150, height: 50 },
    { x: 250, y: 550, width: 100, height: 50 },
    { x: 450, y: 550, width: 150, height: 50 },
    { x: 700, y: 550, width: 100, height: 50 },
    { x: 900, y: 550, width: 300, height: 50 },
    // Complex floating platforms
    { x: 80, y: 450, width: 60, height: 20 },
    { x: 200, y: 380, width: 80, height: 20 },
    { x: 350, y: 320, width: 70, height: 20 },
    { x: 480, y: 400, width: 90, height: 20 },
    { x: 300, y: 250, width: 80, height: 20 },
    { x: 500, y: 200, width: 100, height: 20 },
    { x: 650, y: 300, width: 80, height: 20 },
    { x: 750, y: 200, width: 80, height: 20 },
    { x: 880, y: 150, width: 100, height: 20 },
    { x: 1050, y: 100, width: 100, height: 20 },
  ],
  obstacles: [
    { x: 160, y: 520, width: 80, height: 30, type: 'spikes' },
    { x: 360, y: 520, width: 80, height: 30, type: 'spikes' },
    { x: 610, y: 520, width: 80, height: 30, type: 'spikes' },
    { x: 810, y: 520, width: 80, height: 30, type: 'spikes' },
  ],
  monsters: [
    { ...MONSTERS.SKELETON, x: 100, y: 490, patrolStart: 20, patrolEnd: 130 },
    { ...MONSTERS.GOBLIN, x: 280, y: 500, patrolStart: 260, patrolEnd: 340 },
    { ...MONSTERS.SKELETON, x: 500, y: 490, patrolStart: 460, patrolEnd: 580 },
    { ...MONSTERS.DEMON, x: 950, y: 480, patrolStart: 910, patrolEnd: 1150 },
    { ...MONSTERS.GOBLIN, x: 520, y: 140, patrolStart: 500, patrolEnd: 580 },
  ],
  weapons: [
    { type: 'SPEAR', x: 320, y: 210 },
  ],
  collectibles: [
    { type: 'health', x: 490, y: 360, value: 30 },
    { type: 'coin', x: 660, y: 260, value: 20 },
    { type: 'health', x: 890, y: 110, value: 40 },
    { type: 'coin', x: 760, y: 160, value: 25 },
  ]
};

// Level 4 - Volcano (Very Hard)
const level4 = {
  id: 4,
  name: 'Volcanic Wasteland',
  theme: THEMES.VOLCANO,
  startPosition: { x: 50, y: 450 },
  exitPosition: { x: 1100, y: 80 },
  platforms: [
    // Minimal ground
    { x: 0, y: 550, width: 100, height: 50 },
    { x: 200, y: 550, width: 80, height: 50 },
    { x: 400, y: 550, width: 80, height: 50 },
    { x: 600, y: 550, width: 80, height: 50 },
    { x: 1050, y: 550, width: 150, height: 50 },
    // Small floating platforms
    { x: 70, y: 460, width: 50, height: 15 },
    { x: 180, y: 400, width: 60, height: 15 },
    { x: 300, y: 350, width: 50, height: 15 },
    { x: 400, y: 280, width: 60, height: 15 },
    { x: 250, y: 220, width: 50, height: 15 },
    { x: 350, y: 160, width: 70, height: 15 },
    { x: 500, y: 400, width: 50, height: 15 },
    { x: 620, y: 320, width: 60, height: 15 },
    { x: 750, y: 250, width: 50, height: 15 },
    { x: 880, y: 180, width: 60, height: 15 },
    { x: 1000, y: 130, width: 80, height: 15 },
  ],
  obstacles: [
    { x: 110, y: 520, width: 80, height: 30, type: 'lava' },
    { x: 290, y: 520, width: 100, height: 30, type: 'lava' },
    { x: 490, y: 520, width: 100, height: 30, type: 'lava' },
    { x: 690, y: 520, width: 350, height: 30, type: 'lava' },
  ],
  monsters: [
    { ...MONSTERS.SKELETON, x: 80, y: 490, patrolStart: 20, patrolEnd: 80 },
    { ...MONSTERS.DEMON, x: 220, y: 490, patrolStart: 210, patrolEnd: 270 },
    { ...MONSTERS.SKELETON, x: 420, y: 490, patrolStart: 410, patrolEnd: 470 },
    { ...MONSTERS.DEMON, x: 620, y: 490, patrolStart: 610, patrolEnd: 670 },
    { ...MONSTERS.DEMON, x: 1080, y: 480, patrolStart: 1060, patrolEnd: 1180 },
    { ...MONSTERS.SKELETON, x: 370, y: 100, patrolStart: 350, patrolEnd: 400 },
  ],
  weapons: [
    { type: 'MAGIC_STAFF', x: 260, y: 180 },
  ],
  collectibles: [
    { type: 'health', x: 410, y: 240, value: 40 },
    { type: 'coin', x: 630, y: 280, value: 30 },
    { type: 'health', x: 890, y: 140, value: 50 },
    { type: 'coin', x: 760, y: 210, value: 30 },
  ]
};

// Level 5 - Sky Temple (Boss Level)
const level5 = {
  id: 5,
  name: 'Sky Temple - Final Battle',
  theme: THEMES.SKY,
  startPosition: { x: 50, y: 400 },
  exitPosition: { x: 1100, y: 350 },
  platforms: [
    // Main battle arena
    { x: 0, y: 500, width: 300, height: 100 },
    { x: 400, y: 500, width: 400, height: 100 },
    { x: 900, y: 500, width: 300, height: 100 },
    // Upper platforms
    { x: 100, y: 380, width: 100, height: 20 },
    { x: 500, y: 350, width: 200, height: 20 },
    { x: 1000, y: 400, width: 120, height: 20 },
    // Top platforms
    { x: 300, y: 250, width: 100, height: 20 },
    { x: 550, y: 200, width: 100, height: 20 },
    { x: 800, y: 250, width: 100, height: 20 },
  ],
  obstacles: [
    { x: 310, y: 470, width: 80, height: 30, type: 'cloud' },
    { x: 810, y: 470, width: 80, height: 30, type: 'cloud' },
  ],
  monsters: [
    { ...MONSTERS.DEMON, x: 150, y: 430, patrolStart: 20, patrolEnd: 280 },
    { ...MONSTERS.DEMON, x: 550, y: 430, patrolStart: 420, patrolEnd: 780 },
    { ...MONSTERS.DRAGON, x: 550, y: 100, patrolStart: 400, patrolEnd: 700 }, // BOSS
    { ...MONSTERS.SKELETON, x: 320, y: 190, patrolStart: 300, patrolEnd: 380 },
    { ...MONSTERS.SKELETON, x: 820, y: 190, patrolStart: 800, patrolEnd: 880 },
  ],
  weapons: [],
  collectibles: [
    { type: 'health', x: 130, y: 340, value: 50 },
    { type: 'health', x: 570, y: 310, value: 50 },
    { type: 'health', x: 1030, y: 360, value: 50 },
    { type: 'coin', x: 570, y: 160, value: 100 },
  ]
};

export const LEVELS = [level1, level2, level3, level4, level5];

export const getLevelById = (id) => LEVELS.find(level => level.id === id) || level1;
