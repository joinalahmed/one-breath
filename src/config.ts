import { GameConfig } from './types';

export const DEFAULT_CONFIG: GameConfig = {
  MAX_DEPTH: 60,
  WORLD_WIDTH: 30,
  AIR_MAX: 100,
  AIR_BASE_DRAIN: 8.0,
  DEPTH_DRAIN_DIVISOR: 40,
  ASCENT_TAX: 1.5,
  SWIM_DOWN_SPEED: 3.0,
  STONE_DESCENT_SPEED: 6.5,
  HEAVY_STONE_DESCENT_SPEED: 8.5,
  ASCENT_SPEED: 2.5,
  ASCENT_SPEED_STONE_CUT: 4.0,
  ASCENT_SPEED_CARRYING_STONE: 1.5,
  HORIZONTAL_SPEED: 4.0,
  GRAB_TIME: 0.4,
  BASKET_CAPACITY: 6,
  DEPTH_MULTIPLIER_DIVISOR: 20,
  SHARK_SPEED: 4.5,
  SHARK_DEPTH: 31,
  SHARK_RANGE: 3,
  SHARK_RADIUS: 1.6,
  DAILY_FOOD_REQUIREMENT: 3,
};

const STORAGE_KEY_CONFIG = 'one_breath_config_v1';

export function loadSavedConfig(): GameConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to load saved config from localStorage', e);
  }
  return { ...DEFAULT_CONFIG };
}

export function saveConfig(config: GameConfig) {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.warn('Failed to save config to localStorage', e);
  }
}
