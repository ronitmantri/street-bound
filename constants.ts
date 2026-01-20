export const CITY_SIZE = 15; // Number of blocks
export const BLOCK_SIZE = 60; // Size of one city block
export const ROAD_WIDTH = 14;

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GARAGE = 'GARAGE',
  GAME_OVER = 'GAME_OVER'
}

export enum WeatherType {
  SUNNY = 'SUNNY',
  RAIN = 'RAIN',
  FOG = 'FOG'
}

export const RIM_STYLES = ['Standard', 'Sport', 'Blade', 'Solid'];
export const SPOILER_TYPES = ['None', 'Lip', 'GT Wing'];
export const PAINT_COLORS = ['#3b82f6', '#ef4444', '#eab308', '#10b981', '#000000', '#ffffff', '#8b5cf6', '#ec4899'];

export interface CarStats {
  id: string;
  name: string;
  price: number;
  speed: number; // Max speed multiplier
  acceleration: number; // Force multiplier
  handling: number; // Steering speed
  color: string; // Default color
  width: number;
  length: number;
  height: number;
}

export const CARS: CarStats[] = [
  {
    id: 'starter',
    name: 'Compact Hatch',
    price: 0,
    speed: 60,
    acceleration: 15,
    handling: 0.6,
    color: '#3b82f6', // Blue
    width: 1.8,
    length: 3.5,
    height: 1.4
  },
  {
    id: 'sedan',
    name: 'Family Sedan',
    price: 2500,
    speed: 80,
    acceleration: 20,
    handling: 0.5,
    color: '#ef4444', // Red
    width: 2,
    length: 4.2,
    height: 1.45
  },
  {
    id: 'sport',
    name: 'Street Racer',
    price: 8000,
    speed: 120,
    acceleration: 35,
    handling: 0.8,
    color: '#eab308', // Yellow
    width: 2.1,
    length: 4.0,
    height: 1.2
  },
  {
    id: 'super',
    name: 'Velocita X',
    price: 25000,
    speed: 180,
    acceleration: 50,
    handling: 0.9,
    color: '#10b981', // Emerald
    width: 2.2,
    length: 4.4,
    height: 1.1
  }
];

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'RACE' | 'DELIVERY';
  reward: number;
  timeLimit: number;
  checkpoints: [number, number, number][];
}

export const MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'City Sprint',
    description: 'Race to the park downtown within the time limit.',
    type: 'RACE',
    reward: 500,
    timeLimit: 45,
    checkpoints: [
      [0, 2, -100], 
      [100, 2, -200], 
      [0, 2, -300]
    ]
  },
  {
    id: 'm2',
    title: 'High Speed Delivery',
    description: 'Deliver the package to the outskirts. Do not stop.',
    type: 'DELIVERY',
    reward: 1200,
    timeLimit: 60,
    checkpoints: [
      [-300, 2, 300]
    ]
  },
  {
    id: 'm3',
    title: 'Downtown Loop',
    description: 'A technical checkpoint race through the city center.',
    type: 'RACE',
    reward: 800,
    timeLimit: 90,
    checkpoints: [
      [100, 2, 100],
      [100, 2, -100],
      [-100, 2, -100],
      [-100, 2, 100],
      [0, 2, 0]
    ]
  }
];

export const BUILDING_COLORS = [
  '#64748b', // Slate 500
  '#71717a', // Zinc 500
  '#78716c', // Stone 500
  '#475569', // Slate 600
  '#52525b', // Zinc 600
];

export const SPEED_LIMIT = 60; // km/h roughly
export const POLICE_THRESHOLD = SPEED_LIMIT + 15;
export const WANTED_COOLDOWN = 10000; // ms