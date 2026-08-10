export type GamePhase = 'SURFACE' | 'DIVING' | 'RESULTS' | 'TELEMETRY';

export type DiveOutcome = 'surfaced' | 'shark' | 'drowned';

export interface GameConfig {
  MAX_DEPTH: number; // meters (60)
  WORLD_WIDTH: number; // meters (30)
  AIR_MAX: number; // 100
  AIR_BASE_DRAIN: number; // 8.0 /s
  DEPTH_DRAIN_DIVISOR: number; // 40
  ASCENT_TAX: number; // 1.5
  SWIM_DOWN_SPEED: number; // 3.0 m/s
  STONE_DESCENT_SPEED: number; // 6.5 m/s
  HEAVY_STONE_DESCENT_SPEED: number; // 8.5 m/s
  ASCENT_SPEED: number; // 2.5 m/s
  ASCENT_SPEED_STONE_CUT: number; // 4.0 m/s
  ASCENT_SPEED_CARRYING_STONE: number; // 1.5 m/s
  HORIZONTAL_SPEED: number; // 4.0 m/s
  GRAB_TIME: number; // 0.4 s
  BASKET_CAPACITY: number; // 6 or 9
  DEPTH_MULTIPLIER_DIVISOR: number; // 20
  SHARK_SPEED: number; // 4.5 m/s
  SHARK_DEPTH: number; // 31 m
  SHARK_RANGE: number; // 3 m
  SHARK_RADIUS: number; // 1.6 m
  DAILY_FOOD_REQUIREMENT: number; // 3
}

export interface UpgradesState {
  heavierStone: number; // Level 0..N
  largerBasket: number; // Level 0..N
  betterRope: number; // Level 0..N
  lungTraining: number; // Level 0..N (Air capacity stacks: +25 Air per level)
  fastFins: number; // Level 0..N (Swim speed stacks: +20% per level)
  pearlGoggles: number; // Level 0..N (Pearl value stacks: +15% per level)
  sharkRepellent: number; // Level 0..N (Shark danger radius stacks)
  moraySuit: number; // Level 0..N (Eel shock protection level)
  seahorseCharm: number; // Level 0..N (Rare species spawn luck level)
  octopusNet: number; // Level 0..N (Catch speed level)
  sonarRadar: number; // Level 0..N (Radar detection range level)
  bioluminescentLamp: number; // Level 0..N (Lantern glow radius level)
}

export type ItemSize = 'small' | 'medium' | 'large' | 'giant';

export interface CollectibleItem {
  id: string;
  type: 'oyster' | 'fish' | 'seahorse' | 'crab' | 'eel' | 'octopus' | 'squid' | 'angler';
  x: number; // 0 to WORLD_WIDTH (meters)
  y: number; // 0 to MAX_DEPTH (meters)
  depthBand: '0-15' | '15-30' | '30-45' | '45-60';
  value: number;
  size: ItemSize;
  isEmpty: boolean;
  isOpened: boolean;
  isCollected: boolean;
  grabProgress: number; // 0 to 1
  swimDirection?: number; // for swimming movement
  swimSpeed?: number;
}

export interface SharkState {
  x: number;
  y: number;
  direction: 1 | -1; // 1 for right, -1 for left
  speed: number;
  minX: number;
  maxX: number;
}

export interface DiverState {
  x: number; // meters
  y: number; // meters depth
  vx: number;
  vy: number;
  air: number;
  isDescending: boolean;
  isAscending: boolean;
  isPanicAscent: boolean;
  carryingStone: boolean;
  stoneCutAtDepth: number | null;
  maxDepthReached: number;
  grabTargetId: string | null;
  grabHoldTimer: number; // seconds held still near target
  invulnerableTimer: number; // seconds remaining
  basket: Array<{ type: 'shell' | 'fish' | 'seahorse' | 'crab' | 'eel' | 'octopus' | 'squid' | 'angler'; value: number; size: ItemSize }>;
}

export interface DiveTelemetryLog {
  id: string;
  timestamp: string;
  sessionId: string;
  deviceClass: string;
  diveIndex: number;
  maxDepth: number;
  diveDuration: number;
  outcome: DiveOutcome;
  shellsCollected: number;
  fishCollected: number;
  shellsLost: number;
  scoreBanked: number;
  depthMultiplier: number;
  streakAtStart: number;
  stoneCutAtDepth: number | null;
  airAtSurfacing: number;
  backgroundedMidDive: boolean;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  rewardCoins: number;
  rewardType?: 'pearls' | 'fish';
  completed: boolean;
  claimed: boolean;
  icon: string;
}

export interface PlayerStats {
  coins: number; // Pearls / Money
  food: number; // Fish / Village food
  streak: number;
  totalDives: number;
  bestDepth: number;
  bestScore: number;
  upgrades: UpgradesState;
  dailyFoodRequirementMet: boolean;
}

export interface BotDiver {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  bestDepth: number;
  totalCoins: number;
  currentStatus: 'diving' | 'at surface' | 'resting in bulteok';
  recentHaul?: string;
}
