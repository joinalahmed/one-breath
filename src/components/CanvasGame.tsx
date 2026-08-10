import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { GameConfig, DiverState, CollectibleItem, SharkState, UpgradesState, ItemSize } from '../types';
import { soundManager } from '../audioAndHaptics';
import { BreathGauge } from './BreathGauge';
import {
  drawVectorDiverCanvas,
  drawVectorPearlShellCanvas,
  drawVectorClownfishCanvas,
  drawVectorSeahorseCanvas,
  drawVectorCrabCanvas,
  drawVectorEelCanvas,
  drawVectorOctopusCanvas,
  drawVectorSquidCanvas,
  drawVectorAnglerCanvas,
  IconDiver,
  IconPearlShell,
  IconClownfish,
  IconSeahorse,
  IconCrab,
  IconEel,
  IconOctopus,
} from './SeaIcons';

interface CanvasGameProps {
  config: GameConfig;
  upgrades: UpgradesState;
  streak: number;
  onDiveComplete: (result: {
    outcome: 'surfaced' | 'shark' | 'drowned';
    maxDepth: number;
    diveDuration: number;
    shellsCollected: number;
    fishCollected: number;
    shellsLost: number;
    coinsEarned: number;
    foodEarned: number;
    stoneCutAtDepth: number | null;
    airAtSurfacing: number;
    rareCollected?: number;
  }) => void;
  onOpenDebug: () => void;
}

export const CanvasGame: React.FC<CanvasGameProps> = ({
  config,
  upgrades,
  streak,
  onDiveComplete,
  onOpenDebug,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const lungLvl = typeof upgrades.lungTraining === 'number' ? upgrades.lungTraining : upgrades.lungTraining ? 1 : 0;
  const basketLvl = typeof upgrades.largerBasket === 'number' ? upgrades.largerBasket : upgrades.largerBasket ? 1 : 0;
  const finsLvl = typeof upgrades.fastFins === 'number' ? upgrades.fastFins : upgrades.fastFins ? 1 : 0;
  const stoneLvl = typeof upgrades.heavierStone === 'number' ? upgrades.heavierStone : upgrades.heavierStone ? 1 : 0;
  const ropeLvl = typeof upgrades.betterRope === 'number' ? upgrades.betterRope : upgrades.betterRope ? 1 : 0;
  const goggleLvl = typeof upgrades.pearlGoggles === 'number' ? upgrades.pearlGoggles : upgrades.pearlGoggles ? 1 : 0;
  const repellentLvl = typeof upgrades.sharkRepellent === 'number' ? upgrades.sharkRepellent : upgrades.sharkRepellent ? 1 : 0;
  const morayLvl = typeof upgrades.moraySuit === 'number' ? upgrades.moraySuit : upgrades.moraySuit ? 1 : 0;
  const seahorseLvl = typeof upgrades.seahorseCharm === 'number' ? upgrades.seahorseCharm : upgrades.seahorseCharm ? 1 : 0;
  const netLvl = typeof upgrades.octopusNet === 'number' ? upgrades.octopusNet : upgrades.octopusNet ? 1 : 0;
  const sonarLvl = typeof upgrades.sonarRadar === 'number' ? upgrades.sonarRadar : upgrades.sonarRadar ? 1 : 0;
  const lampLvl = typeof upgrades.bioluminescentLamp === 'number' ? upgrades.bioluminescentLamp : upgrades.bioluminescentLamp ? 1 : 0;

  const maxAir = config.AIR_MAX + lungLvl * 25;
  const capacity = config.BASKET_CAPACITY + basketLvl * 2;

  // Diver state
  const diverRef = useRef<DiverState>({
    x: config.WORLD_WIDTH / 2,
    y: 0,
    vx: 0,
    vy: 0,
    air: maxAir,
    isDescending: false,
    isAscending: false,
    isPanicAscent: false,
    carryingStone: true,
    stoneCutAtDepth: null,
    maxDepthReached: 0,
    grabTargetId: null,
    grabHoldTimer: 0,
    invulnerableTimer: 0,
    basket: [],
  });

  // World objects
  const collectiblesRef = useRef<CollectibleItem[]>([]);
  const sharkRef = useRef<SharkState>({
    x: config.WORLD_WIDTH / 2,
    y: config.SHARK_DEPTH,
    direction: 1,
    speed: config.SHARK_SPEED,
    minX: 2,
    maxX: config.WORLD_WIDTH - 2,
  });

  // Touch & Keyboard tracking
  const touchStartPosRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapTimeRef = useRef<number>(0);
  const keysPressedRef = useRef<Set<string>>(new Set());

  // UI state overlays
  const [hudAir, setHudAir] = useState(() => config.AIR_MAX + lungLvl * 25);
  const [hudDepth, setHudDepth] = useState(0);
  const [hudMaxDepth, setHudMaxDepth] = useState(0);
  const [hudMultiplier, setHudMultiplier] = useState(1.0);
  const [hudBasket, setHudBasket] = useState<Array<{ type: 'shell' | 'fish'; value: number; size: ItemSize }>>([]);
  const [hudCarryingStone, setHudCarryingStone] = useState(true);
  const [grabProgress, setGrabProgress] = useState<{ targetId: string; progress: number } | null>(null);
  const [isMuted, setIsMuted] = useState(() => soundManager.getMuted());
  const [sonarDistance, setSonarDistance] = useState<number | null>(null);

  // Floating text popups & Juice effects
  const floatingTextsRef = useRef<Array<{
    id: string;
    x: number;
    y: number;
    text: string;
    color: string;
    fontSize: number;
    alpha: number;
    scale: number;
    life: number;
  }>>([]);
  const screenShakeRef = useRef({ intensity: 0 });
  const comboRef = useRef({ count: 0, lastTime: 0 });
  const announcedBandsRef = useRef<Set<string>>(new Set());

  const addFloatingText = useCallback((x: number, y: number, text: string, color = '#fef08a', fontSize = 15) => {
    floatingTextsRef.current.push({
      id: Math.random().toString(),
      x,
      y,
      text,
      color,
      fontSize,
      alpha: 1,
      scale: 1.35,
      life: 1.2,
    });
  }, []);

  // Initialize Collectibles with explicit Size Tiers (Small, Medium, Large, Giant)
  const initCollectibles = useCallback(() => {
    const items: CollectibleItem[] = [];
    let idCounter = 1;

    // Helper to generate items in depth bands with size notions
    const generateBandOysters = (
      minD: number,
      maxD: number,
      count: number,
      bandName: '0-15' | '15-30' | '30-45' | '45-60'
    ) => {
      for (let i = 0; i < count; i++) {
        const x = 2 + Math.random() * (config.WORLD_WIDTH - 4);
        const y = minD + 1 + Math.random() * (maxD - minD - 2);

        let size: ItemSize = 'small';
        let value = 3;
        let emptyProb = 0.35;

        if (bandName === '0-15') {
          const rand = Math.random();
          if (rand < 0.65) {
            size = 'small';
            value = Math.floor(2 + Math.random() * 4); // 2-5 pearls
          } else {
            size = 'medium';
            value = Math.floor(6 + Math.random() * 7); // 6-12 pearls
          }
          emptyProb = 0.35;
        } else if (bandName === '15-30') {
          const rand = Math.random();
          if (rand < 0.5) {
            size = 'medium';
            value = Math.floor(8 + Math.random() * 8); // 8-15 pearls
          } else {
            size = 'large';
            value = Math.floor(16 + Math.random() * 15); // 16-30 pearls
          }
          emptyProb = 0.25;
        } else if (bandName === '30-45') {
          const rand = Math.random();
          if (rand < 0.35) {
            size = 'medium';
            value = Math.floor(12 + Math.random() * 10);
          } else if (rand < 0.75) {
            size = 'large';
            value = Math.floor(25 + Math.random() * 20); // 25-45 pearls
          } else {
            size = 'giant';
            value = Math.floor(50 + Math.random() * 30); // 50-80 pearls!
          }
          emptyProb = 0.2;
        } else {
          // 45-60m (Deep Trench)
          const rand = Math.random();
          if (rand < 0.3) {
            size = 'large';
            value = Math.floor(35 + Math.random() * 25);
          } else {
            size = 'giant';
            value = Math.floor(75 + Math.random() * 55); // 75-130 pearls!
          }
          emptyProb = 0.15;
        }

        const isEmpty = Math.random() < emptyProb;

        items.push({
          id: `oyster_${idCounter++}`,
          type: 'oyster',
          x,
          y,
          depthBand: bandName,
          value: isEmpty ? 0 : value,
          size,
          isEmpty,
          isOpened: false,
          isCollected: false,
          grabProgress: 0,
        });
      }
    };

    // 0-15m: 12 oysters + 6 fish + 3 crabs
    generateBandOysters(0, 15, 12, '0-15');
    for (let f = 0; f < 6; f++) {
      const isMedium = Math.random() < 0.35;
      items.push({
        id: `fish_${idCounter++}`,
        type: 'fish',
        x: 2 + Math.random() * (config.WORLD_WIDTH - 4),
        y: 2 + Math.random() * 12,
        depthBand: '0-15',
        value: isMedium ? 2 : 1, // 1 or 2 Food
        size: isMedium ? 'medium' : 'small',
        isEmpty: false,
        isOpened: true,
        isCollected: false,
        grabProgress: 0,
        swimDirection: Math.random() < 0.5 ? 1 : -1,
        swimSpeed: 1.2 + Math.random() * 1.0,
      });
    }
    // Crabs on shallow rocks
    for (let c = 0; c < 3; c++) {
      const sideX = c % 2 === 0 ? 2.5 : config.WORLD_WIDTH - 2.5;
      items.push({
        id: `crab_${idCounter++}`,
        type: 'crab',
        x: sideX,
        y: 3 + Math.random() * 10,
        depthBand: '0-15',
        value: Math.floor(8 + Math.random() * 6),
        size: 'small',
        isEmpty: false,
        isOpened: true,
        isCollected: false,
        grabProgress: 0,
      });
    }

    // 15-30m: 10 oysters + 3 fish + 2 seahorses + 2 crabs
    generateBandOysters(15, 30, 10, '15-30');
    for (let f = 0; f < 3; f++) {
      const isGiant = Math.random() < 0.4;
      items.push({
        id: `fish_${idCounter++}`,
        type: 'fish',
        x: 2 + Math.random() * (config.WORLD_WIDTH - 4),
        y: 16 + Math.random() * 12,
        depthBand: '15-30',
        value: isGiant ? 3 : 2,
        size: isGiant ? 'giant' : 'medium',
        isEmpty: false,
        isOpened: true,
        isCollected: false,
        grabProgress: 0,
        swimDirection: Math.random() < 0.5 ? 1 : -1,
        swimSpeed: 1.5 + Math.random() * 1.2,
      });
    }
    // Seahorses (Extra if Seahorse Charm owned)
    const seahorseCount = upgrades.seahorseCharm ? 3 : 2;
    for (let s = 0; s < seahorseCount; s++) {
      items.push({
        id: `seahorse_${idCounter++}`,
        type: 'seahorse',
        x: 4 + Math.random() * (config.WORLD_WIDTH - 8),
        y: 18 + Math.random() * 10,
        depthBand: '15-30',
        value: Math.floor(20 + Math.random() * 15),
        size: 'medium',
        isEmpty: false,
        isOpened: true,
        isCollected: false,
        grabProgress: 0,
        swimDirection: Math.random() < 0.5 ? 1 : -1,
        swimSpeed: 0.6 + Math.random() * 0.4,
      });
    }

    // 30-45m (Midnight Trench): 7 oysters + 2 giant fish + 2 eels + 2 bioluminescent squids + 1 anglerfish
    generateBandOysters(30, 45, 7, '30-45');
    for (let f = 0; f < 2; f++) {
      items.push({
        id: `fish_${idCounter++}`,
        type: 'fish',
        x: 2 + Math.random() * (config.WORLD_WIDTH - 4),
        y: 31 + Math.random() * 12,
        depthBand: '30-45',
        value: 3,
        size: 'giant',
        isEmpty: false,
        isOpened: true,
        isCollected: false,
        grabProgress: 0,
        swimDirection: Math.random() < 0.5 ? 1 : -1,
        swimSpeed: 1.8 + Math.random() * 1.0,
      });
    }
    // Eels (Extra if Seahorse Charm owned)
    const eelCount = upgrades.seahorseCharm ? 3 : 2;
    for (let e = 0; e < eelCount; e++) {
      items.push({
        id: `eel_${idCounter++}`,
        type: 'eel',
        x: 3 + Math.random() * (config.WORLD_WIDTH - 6),
        y: 33 + Math.random() * 10,
        depthBand: '30-45',
        value: 3, // 3 Food
        size: 'large',
        isEmpty: false,
        isOpened: true,
        isCollected: false,
        grabProgress: 0,
        swimDirection: Math.random() < 0.5 ? 1 : -1,
        swimSpeed: 2.0 + Math.random() * 0.8,
      });
    }
    // Bioluminescent Squids (Midnight Zone)
    const squidCount = upgrades.seahorseCharm ? 3 : 2;
    for (let sq = 0; sq < squidCount; sq++) {
      items.push({
        id: `squid_${idCounter++}`,
        type: 'squid',
        x: 3 + Math.random() * (config.WORLD_WIDTH - 6),
        y: 34 + Math.random() * 10,
        depthBand: '30-45',
        value: Math.floor(45 + Math.random() * 35), // 45-80 pearls
        size: 'large',
        isEmpty: false,
        isOpened: true,
        isCollected: false,
        grabProgress: 0,
        swimDirection: Math.random() < 0.5 ? 1 : -1,
        swimSpeed: 2.4 + Math.random() * 1.2,
      });
    }
    // Deepsea Anglerfish (Midnight Zone)
    items.push({
      id: `angler_${idCounter++}`,
      type: 'angler',
      x: 4 + Math.random() * (config.WORLD_WIDTH - 8),
      y: 38 + Math.random() * 6,
      depthBand: '30-45',
      value: Math.floor(65 + Math.random() * 45), // 65-110 pearls
      size: 'giant',
      isEmpty: false,
      isOpened: true,
      isCollected: false,
      grabProgress: 0,
      swimDirection: Math.random() < 0.5 ? 1 : -1,
      swimSpeed: 1.0 + Math.random() * 0.6,
    });

    // 45-60m (Abyssal Trench): 5 oysters + 2 giant octopuses + 2 deepsea anglerfish + 2 squids
    generateBandOysters(45, 60, 5, '45-60');
    const octopusCount = upgrades.seahorseCharm ? 3 : 2;
    for (let o = 0; o < octopusCount; o++) {
      items.push({
        id: `octopus_${idCounter++}`,
        type: 'octopus',
        x: 4 + Math.random() * (config.WORLD_WIDTH - 8),
        y: 48 + Math.random() * 10,
        depthBand: '45-60',
        value: Math.floor(70 + Math.random() * 45), // 70-115 pearls!
        size: 'giant',
        isEmpty: false,
        isOpened: true,
        isCollected: false,
        grabProgress: 0,
      });
    }
    // Abyssal Anglerfish & Squids
    for (let a = 0; a < 2; a++) {
      items.push({
        id: `angler_${idCounter++}`,
        type: 'angler',
        x: 5 + Math.random() * (config.WORLD_WIDTH - 10),
        y: 47 + Math.random() * 11,
        depthBand: '45-60',
        value: Math.floor(90 + Math.random() * 60), // 90-150 pearls!
        size: 'giant',
        isEmpty: false,
        isOpened: true,
        isCollected: false,
        grabProgress: 0,
        swimDirection: Math.random() < 0.5 ? 1 : -1,
        swimSpeed: 1.2 + Math.random() * 0.8,
      });
    }
    for (let s = 0; s < 2; s++) {
      items.push({
        id: `squid_${idCounter++}`,
        type: 'squid',
        x: 3 + Math.random() * (config.WORLD_WIDTH - 6),
        y: 46 + Math.random() * 12,
        depthBand: '45-60',
        value: Math.floor(60 + Math.random() * 40),
        size: 'large',
        isEmpty: false,
        isOpened: true,
        isCollected: false,
        grabProgress: 0,
        swimDirection: Math.random() < 0.5 ? 1 : -1,
        swimSpeed: 2.8 + Math.random() * 1.0,
      });
    }

    collectiblesRef.current = items;
  }, [config.WORLD_WIDTH, upgrades.seahorseCharm]);

  // Cut stone function
  const handleCutStone = useCallback(() => {
    const diver = diverRef.current;
    if (diver.carryingStone && !diver.isPanicAscent && diver.y > 0.5) {
      diver.carryingStone = false;
      diver.stoneCutAtDepth = Math.round(diver.y * 10) / 10;
      setHudCarryingStone(false);
      soundManager.playStoneCut();
      addFloatingText(diver.x, diver.y, '✂️ STONE CUT! (+40% ASCENT SPEED)', '#38bdf8', 16);
      screenShakeRef.current.intensity = 8;
    }
  }, [addFloatingText]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'KeyS', 'KeyW', 'KeyA', 'KeyD', 'KeyX'].includes(e.code)) {
        e.preventDefault();
      }

      soundManager.enableAudio();

      if (e.code === 'KeyX' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        handleCutStone();
        return;
      }

      keysPressedRef.current.add(e.code);

      const diver = diverRef.current;
      if (['Space', 'ArrowDown', 'KeyS', 'KeyW'].includes(e.code)) {
        diver.isDescending = true;
        diver.isAscending = false;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current.delete(e.code);
      const diver = diverRef.current;

      const hasDescendKey = Array.from(keysPressedRef.current).some((k) =>
        ['Space', 'ArrowDown', 'KeyS', 'KeyW'].includes(k as string)
      );

      if (!hasDescendKey) {
        diver.isDescending = false;
        diver.isAscending = true;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleCutStone]);

  // Set up animation loop
  useEffect(() => {
    initCollectibles();
    announcedBandsRef.current.clear();

    let animFrameId: number;
    let lastTime = performance.now();
    let diveStartTime = performance.now();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simulation loop running at fixed 60Hz delta
    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05); // clamp dt
      lastTime = now;

      const diver = diverRef.current;
      const shark = sharkRef.current;
      const collectibles = collectiblesRef.current;

      // 1. Update Shark Patrol
      shark.x += shark.direction * shark.speed * dt;
      if (shark.x >= shark.maxX) {
        shark.x = shark.maxX;
        shark.direction = -1;
      } else if (shark.x <= shark.minX) {
        shark.x = shark.minX;
        shark.direction = 1;
      }

      // 2. Update Swimming Creatures (Fish, Seahorse, Eel, Squid, Angler)
      collectibles.forEach((item) => {
        if (['fish', 'seahorse', 'eel', 'squid', 'angler'].includes(item.type) && !item.isCollected && item.swimDirection && item.swimSpeed) {
          item.x += item.swimDirection * item.swimSpeed * dt;
          if (item.x < 2 || item.x > config.WORLD_WIDTH - 2) {
            item.swimDirection *= -1;
          }
        }
      });

      // 3. Air Drain Calculation
      if (diver.y > 0.1) {
        let drainRate = config.AIR_BASE_DRAIN * (1 + diver.y / config.DEPTH_DRAIN_DIVISOR);
        if (diver.isAscending || diver.isPanicAscent) {
          drainRate *= config.ASCENT_TAX;
        }
        diver.air = Math.max(0, diver.air - drainRate * dt);

        soundManager.updateHeartbeat(diver.air / config.AIR_MAX);

        // Zero air -> Immediate game over (Drowned)
        if (diver.air <= 0) {
          soundManager.playSharkSting();
          soundManager.triggerHaptic('basketLost');

          const duration = (now - diveStartTime) / 1000;
          onDiveComplete({
            outcome: 'drowned',
            maxDepth: Math.round(diver.maxDepthReached * 10) / 10,
            diveDuration: Math.round(duration * 10) / 10,
            shellsCollected: 0,
            fishCollected: 0,
            shellsLost: diver.basket.length,
            coinsEarned: 0,
            foodEarned: 0,
            stoneCutAtDepth: diver.stoneCutAtDepth,
            airAtSurfacing: 0,
            rareCollected: 0,
          });
          return; // Stop animation loop immediately
        }
      }

      // 4. Movement Speeds based on Upgrade Levels
      let targetVy = 0;
      const ascentRopeMultiplier = 1.0 + ropeLvl * 0.20;
      const finsSpeedMultiplier = 1.0 + finsLvl * 0.20;

      if (diver.isPanicAscent) {
        targetVy = -config.ASCENT_SPEED_STONE_CUT * ascentRopeMultiplier * (1 + finsLvl * 0.1);
      } else if (diver.isDescending) {
        if (diver.carryingStone) {
          const stoneSpeed = config.STONE_DESCENT_SPEED + stoneLvl * 1.2;
          targetVy = stoneSpeed;
        } else {
          targetVy = config.SWIM_DOWN_SPEED * finsSpeedMultiplier;
        }
      } else if (diver.isAscending) {
        if (diver.carryingStone) {
          targetVy = -config.ASCENT_SPEED_CARRYING_STONE * ascentRopeMultiplier;
        } else {
          targetVy = -config.ASCENT_SPEED_STONE_CUT * ascentRopeMultiplier * (1 + finsLvl * 0.1);
        }
      } else {
        // Floating slightly upwards at rest
        targetVy = -0.5;
      }

      // Smooth lerp velocity
      diver.vy += (targetVy - diver.vy) * Math.min(1, dt * 8);
      diver.y = Math.max(0, Math.min(config.MAX_DEPTH, diver.y + diver.vy * dt));

      // Keyboard & Touch continuous steering
      const speedMult = finsSpeedMultiplier;
      if (keysPressedRef.current.has('ArrowLeft') || keysPressedRef.current.has('KeyA') || keysPressedRef.current.has('TouchLeft')) {
        diver.vx = Math.max(1.5, diver.vx - config.HORIZONTAL_SPEED * speedMult * dt * 3.5);
      }
      if (keysPressedRef.current.has('ArrowRight') || keysPressedRef.current.has('KeyD') || keysPressedRef.current.has('TouchRight')) {
        diver.vx = Math.min(config.WORLD_WIDTH - 1.5, diver.vx + config.HORIZONTAL_SPEED * speedMult * dt * 3.5);
      }

      // Horizontal lerp
      diver.x += (diver.vx - diver.x) * Math.min(1, dt * 10);
      diver.x = Math.max(1.5, Math.min(config.WORLD_WIDTH - 1.5, diver.x));

      // Sonar Radar Proximity Check
      if (sonarLvl > 0 && diver.y > 5) {
        const radarRange = 6 + sonarLvl * 3;
        const dxS = shark.x - diver.x;
        const dyS = shark.y - diver.y;
        const sDist = Math.sqrt(dxS * dxS + dyS * dyS);
        if (sDist <= radarRange) {
          setSonarDistance(Math.round(sDist * 10) / 10);
        } else {
          setSonarDistance(null);
        }
      } else {
        setSonarDistance(null);
      }

      // Track max depth
      if (diver.y > diver.maxDepthReached) {
        diver.maxDepthReached = diver.y;
      }

      // 5. Automatic Grab Detection
      // Proximity check + hold still window
      const basketCap = config.BASKET_CAPACITY + basketLvl * 2;
      if (diver.basket.length < basketCap && !diver.isPanicAscent) {
        let nearestItem: CollectibleItem | null = null;
        let nearestDist = 2.5; // meters grab radius

        collectibles.forEach((item) => {
          if (!item.isCollected) {
            const dx = item.x - diver.x;
            const dy = item.y - diver.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < nearestDist) {
              nearestDist = dist;
              nearestItem = item;
            }
          }
        });

        if (nearestItem) {
          const item = nearestItem as CollectibleItem;
          // Diver is relatively stationary or in grab zone
          if (diver.grabTargetId === item.id) {
            const grabDuration = Math.max(0.12, config.GRAB_TIME / (1.0 + netLvl * 0.25));
            item.grabProgress = Math.min(1, item.grabProgress + dt / grabDuration);
            setGrabProgress({ targetId: item.id, progress: item.grabProgress });

            if (item.grabProgress >= 1.0) {
              // Grab complete!
              item.isCollected = true;
              item.isOpened = true;
              diver.grabTargetId = null;
              setGrabProgress(null);

              const nowTime = performance.now();
              if (nowTime - comboRef.current.lastTime < 2500) {
                comboRef.current.count += 1;
              } else {
                comboRef.current.count = 1;
              }
              comboRef.current.lastTime = nowTime;

              // Electric Eel Shock Mechanic with Moray Suit Protection
              if (item.type === 'eel') {
                if (morayLvl > 0) {
                  addFloatingText(item.x, item.y - 0.5, `🛡️ MORAY SUIT SHIELD (LVL ${morayLvl})!`, '#facc15', 14);
                } else {
                  soundManager.triggerHaptic('basketLost');
                  diver.air = Math.max(0, diver.air - 6);
                  screenShakeRef.current.intensity = 16;
                  addFloatingText(item.x, item.y - 0.5, '⚡ ELECTROCUTED! (-6 AIR)', '#ef4444', 15);
                }
              }

              if (item.isEmpty) {
                soundManager.playGrabConfirm(false);
                addFloatingText(item.x, item.y, 'EMPTY 🐚', '#94a3b8', 13);
              } else {
                const basketType = (item.type === 'oyster' ? 'shell' : item.type) as 'shell' | 'fish' | 'seahorse' | 'crab' | 'eel' | 'octopus';
                diver.basket.push({
                  type: basketType,
                  value: item.value,
                  size: item.size,
                });
                soundManager.playGrabConfirm(true);

                let textStr = `+${item.value} 💎`;
                let textCol = '#38bdf8';

                if (item.type === 'fish') {
                  textStr = `+${item.value} 🐟 Clownfish!`;
                  textCol = '#34d399';
                } else if (item.type === 'seahorse') {
                  textStr = `+${item.value} 💎 Seahorse!`;
                  textCol = '#a3e635';
                } else if (item.type === 'crab') {
                  textStr = `+${item.value} 💎 Crab!`;
                  textCol = '#ef4444';
                } else if (item.type === 'eel') {
                  textStr = `+${item.value} 🐟 Electric Eel!`;
                  textCol = '#facc15';
                } else if (item.type === 'octopus') {
                  textStr = `+${item.value} 💎 Giant Octopus!`;
                  textCol = '#e11d48';
                } else if (item.type === 'squid') {
                  textStr = `+${item.value} 💎 Bioluminescent Squid!`;
                  textCol = '#38bdf8';
                } else if (item.type === 'angler') {
                  textStr = `+${item.value} 💎 Deepsea Anglerfish!`;
                  textCol = '#facc15';
                } else if (item.size === 'giant') {
                  textStr = `+${item.value} 💎 Giant Pearl!`;
                  textCol = '#fef08a';
                }

                addFloatingText(item.x, item.y, textStr, textCol, item.size === 'giant' ? 18 : 15);

                if (comboRef.current.count > 1) {
                  addFloatingText(item.x, item.y - 0.7, `${comboRef.current.count}x COMBO! 🔥`, '#f59e0b', 16);
                }

                screenShakeRef.current.intensity = Math.min(12, screenShakeRef.current.intensity + 4);
              }
            }
          } else {
            // New grab target
            diver.grabTargetId = item.id;
            item.grabProgress = 0;
          }
        } else {
          diver.grabTargetId = null;
          setGrabProgress(null);
        }
      } else {
        diver.grabTargetId = null;
        setGrabProgress(null);
      }

      // 6. Shark Collision Detection
      const effectiveSharkRadius = Math.max(0.4, config.SHARK_RADIUS * (1.0 - repellentLvl * 0.15));
      if (diver.invulnerableTimer > 0) {
        diver.invulnerableTimer -= dt;
      } else if (!diver.isPanicAscent && diver.y > 0.5) {
        const dx = shark.x - diver.x;
        const dy = shark.y - diver.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < effectiveSharkRadius) {
          // Shark Hit!
          diver.basket = []; // Basket lost!
          diver.isPanicAscent = true;
          diver.invulnerableTimer = 1.5;
          soundManager.playSharkSting();
          addFloatingText(diver.x, diver.y, '💥 SHARK ATTACK! BASKET LOST!', '#ef4444', 18);
          screenShakeRef.current.intensity = 24;
        }
      }

      // 6.5 Update Floating Popups & Screen Shake Decay
      screenShakeRef.current.intensity *= 0.88;
      floatingTextsRef.current.forEach((ft) => {
        ft.y -= 1.2 * dt; // upward float
        ft.life -= dt;
        ft.alpha = Math.max(0, ft.life / 1.2);
        ft.scale = Math.max(1, ft.scale - dt * 0.8);
      });
      floatingTextsRef.current = floatingTextsRef.current.filter((ft) => ft.life > 0);

      // 7. Check Surfacing Resolution (Must have descended at least 0.5m or ran out of air)
      if (
        diver.y <= 0.05 &&
        (diver.maxDepthReached >= 0.5 || diver.air <= 0) &&
        (diver.isAscending || diver.isPanicAscent || diver.air <= 0)
      ) {
        soundManager.playSurfacingSplash();

        const duration = (now - diveStartTime) / 1000;
        let outcome: 'surfaced' | 'shark' | 'drowned' = 'surfaced';

        if (diver.air <= 0) {
          outcome = 'drowned';
        } else if (diver.basket.length === 0 && diver.isPanicAscent) {
          outcome = 'shark';
        }

        const shellsCollected = diver.basket.filter((b) => b.type !== 'fish' && b.type !== 'eel').length;
        const fishCollected = diver.basket
          .filter((b) => b.type === 'fish' || b.type === 'eel')
          .reduce((sum, b) => sum + b.value, 0);
        const rawCoins = diver.basket
          .filter((b) => b.type !== 'fish' && b.type !== 'eel')
          .reduce((sum, b) => sum + b.value, 0);

        const depthMult = 1 + diver.maxDepthReached / config.DEPTH_MULTIPLIER_DIVISOR;
        const streakMult = Math.min(3.0, 1 + streak * 0.25);
        const gogglesMult = 1.0 + goggleLvl * 0.15;
        const charmMult = 1.0 + seahorseLvl * 0.20;
        const coinsEarned = outcome === 'surfaced' ? Math.round(rawCoins * depthMult * streakMult * gogglesMult * charmMult) : 0;
        const foodEarned = outcome === 'surfaced' ? fishCollected : 0;

        if (outcome === 'surfaced') {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.3 },
          });
        }

        const rareCollected = diver.basket.filter((b) =>
          ['seahorse', 'crab', 'eel', 'octopus'].includes(b.type)
        ).length;

        onDiveComplete({
          outcome,
          maxDepth: Math.round(diver.maxDepthReached * 10) / 10,
          diveDuration: Math.round(duration * 10) / 10,
          shellsCollected,
          fishCollected,
          shellsLost: outcome !== 'surfaced' ? diver.basket.length : 0,
          coinsEarned,
          foodEarned,
          stoneCutAtDepth: diver.stoneCutAtDepth,
          airAtSurfacing: Math.round(diver.air),
          rareCollected,
        });
        return; // End loop
      }

      // 8. Update React HUD states
      setHudAir(Math.round(diver.air));
      setHudDepth(Math.round(diver.y * 10) / 10);
      setHudMaxDepth(Math.round(diver.maxDepthReached * 10) / 10);
      setHudMultiplier(Math.round((1 + diver.maxDepthReached / config.DEPTH_MULTIPLIER_DIVISOR) * 100) / 100);
      setHudBasket([...diver.basket]);

      // 9. Render Frame
      renderCanvas(
        ctx,
        canvas,
        config,
        diver,
        shark,
        collectibles,
        upgrades,
        floatingTextsRef.current,
        screenShakeRef.current.intensity
      );

      animFrameId = requestAnimationFrame(loop);
    };

    animFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [config, upgrades, streak, initCollectibles, onDiveComplete]);

  // Handle Resize for Canvas DPI
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap Dpr at 2 for performance

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle Input (Pointer events)
  const handlePointerDown = (e: React.PointerEvent) => {
    soundManager.enableAudio();

    // Check double tap for stone cut
    const now = Date.now();
    if (now - lastTapTimeRef.current < 300) {
      handleCutStone();
    }
    lastTapTimeRef.current = now;

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touchX = e.clientX - rect.left;
    const touchY = e.clientY - rect.top;

    touchStartPosRef.current = { x: touchX, y: touchY, time: now };

    const diver = diverRef.current;
    diver.isDescending = true;
    diver.isAscending = false;

    // Convert screen X to world X (0 to WORLD_WIDTH)
    diver.vx = (touchX / rect.width) * config.WORLD_WIDTH;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!diverRef.current.isDescending || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touchX = e.clientX - rect.left;
    diverRef.current.vx = (touchX / rect.width) * config.WORLD_WIDTH;
  };

  const handlePointerUp = () => {
    const diver = diverRef.current;
    diver.isDescending = false;
    diver.isAscending = true; // Release to ascend
  };

  // 3-finger tap for debug overlay
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length >= 3) {
      onOpenDebug();
    }
  };

  const currentDrainRate =
    hudDepth > 0.1
      ? config.AIR_BASE_DRAIN *
        (1 + hudDepth / config.DEPTH_DRAIN_DIVISOR) *
        (diverRef.current.isAscending || diverRef.current.isPanicAscent
          ? config.ASCENT_TAX
          : 1)
      : 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden bg-slate-900 touch-none flex flex-col justify-between"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onTouchStart={handleTouchStart}
    >
      {/* 2D HTML5 Canvas for Render */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* TOP BAND (12% Height) - Safe Area Compliant HUD */}
      <div className="relative z-10 w-full px-2 sm:px-4 pt-4 sm:pt-6 pb-2 flex justify-between items-start bg-gradient-to-b from-slate-950/95 via-slate-950/60 to-transparent pointer-events-none gap-2">
        {/* Top Left: Depth */}
        <div className="flex flex-col shrink-0">
          <span className="text-[10px] uppercase tracking-widest text-cyan-300 font-semibold">Depth</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">{hudDepth}</span>
            <span className="text-xs font-bold text-cyan-200">m</span>
          </div>
          <span className="text-[9px] text-slate-400 font-mono">Max: {hudMaxDepth}m</span>
        </div>

        {/* Top Center: Prominent BREATH GAUGE Widget */}
        <div className="flex-1 max-w-[210px] sm:max-w-xs mx-auto">
          <BreathGauge
            air={hudAir}
            maxAir={maxAir}
            depth={hudDepth}
            isAscending={diverRef.current.isAscending}
            isDescending={diverRef.current.isDescending}
            isPanicAscent={diverRef.current.isPanicAscent}
            drainRate={currentDrainRate}
          />
        </div>

        {/* Top Right: Combined High-Contrast Multiplier & Basket HUD */}
        <div className="flex flex-col items-end space-y-1.5 shrink-0">
          {/* Row 1: Multiplier & Basket Counters */}
          <div className="flex items-center space-x-1.5 pointer-events-auto">
            {/* Multiplier Badge */}
            <div className="bg-slate-950/95 border border-amber-400/80 px-2.5 py-1 rounded-xl flex items-center space-x-1 shadow-lg backdrop-blur-md">
              <span className="text-[9px] uppercase font-black text-amber-400 tracking-wider">MULT</span>
              <span className="text-xs sm:text-sm font-black text-amber-300 font-mono drop-shadow-[0_2px_8px_rgba(251,191,36,0.3)]">
                {hudMultiplier.toFixed(2)}x
              </span>
            </div>

            {/* High-Contrast Upper-Right Basket Pill */}
            <div className="bg-slate-950/95 border border-emerald-400/80 px-2.5 py-1 rounded-xl flex items-center space-x-1 shadow-lg backdrop-blur-md">
              <span className="text-xs">🧺</span>
              <span className="text-xs font-black font-mono text-emerald-300">
                {hudBasket.length}/{capacity}
              </span>
            </div>
          </div>

          {/* Row 2: Basket Item Slots (Size & Type Badges) */}
          <div className="flex items-center space-x-1 bg-slate-950/90 border border-slate-800 px-2 py-0.5 rounded-lg shadow-md backdrop-blur-md">
            {Array.from({ length: capacity }).map((_, idx) => {
              const item = hudBasket[idx];
              if (!item) {
                return (
                  <span
                    key={idx}
                    className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700/60 inline-block"
                  />
                );
              }
              return (
                <span
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-black font-mono shadow-sm ${
                    item.type === 'fish'
                      ? item.size === 'giant'
                        ? 'bg-amber-400 text-slate-950 ring-1 ring-amber-300 animate-pulse'
                        : 'bg-emerald-400 text-slate-950'
                      : item.size === 'giant'
                      ? 'bg-gradient-to-r from-amber-300 to-yellow-100 text-slate-950 ring-1 ring-amber-400 animate-bounce'
                      : item.size === 'large'
                      ? 'bg-purple-400 text-slate-950 font-black'
                      : item.size === 'medium'
                      ? 'bg-cyan-400 text-slate-950 font-bold'
                      : 'bg-slate-200 text-slate-900 font-bold'
                  }`}
                  title={`${item.size.toUpperCase()} ${item.type === 'fish' ? 'Fish' : 'Pearl'}`}
                >
                  {item.type === 'fish'
                    ? '🐟'
                    : item.type === 'eel'
                    ? '⚡'
                    : item.type === 'seahorse'
                    ? '🐴'
                    : item.type === 'crab'
                    ? '🦀'
                    : item.type === 'octopus'
                    ? '🐙'
                    : item.size === 'giant'
                    ? '👑'
                    : '🦪'}
                </span>
              );
            })}
          </div>

          {/* Row 3: Utility Controls */}
          <div className="flex items-center space-x-1.5 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const nextMuted = !isMuted;
                soundManager.setMuted(nextMuted);
                setIsMuted(nextMuted);
              }}
              className="w-6 h-6 rounded-full bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs flex items-center justify-center border border-slate-600/50 cursor-pointer shadow"
              title="Toggle Audio"
            >
              {isMuted ? '🔇' : '🔊'}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDebug();
              }}
              className="w-6 h-6 rounded-full bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-300 text-xs flex items-center justify-center border border-slate-600/50 cursor-pointer shadow"
              title="Debug Settings"
            >
              ⚙️
            </button>
          </div>
        </div>
      </div>

      {/* SONAR RADAR PROXIMITY ALERT */}
      <AnimatePresence>
        {sonarDistance !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0, scale: [1, 1.04, 1] }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, scale: { repeat: Infinity, duration: 0.6 } }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          >
            <div className="bg-purple-950/90 border-2 border-purple-400 text-purple-200 px-3.5 py-1 rounded-full text-[10px] font-black uppercase font-mono tracking-wider shadow-2xl flex items-center space-x-2 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
              <span>📡 SHARK SONAR: {sonarDistance}m DETECTED!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOW AIR WARNING OVERLAY */}
      <AnimatePresence>
        {hudAir <= 25 && hudAir > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: [1, 1.05, 1] }}
            exit={{ opacity: 0, y: -15, scale: 0.9 }}
            transition={{ duration: 0.3, scale: { repeat: Infinity, duration: 0.8 } }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          >
            <div className="bg-rose-950/90 border border-rose-500/80 text-rose-200 px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-2xl flex items-center space-x-1.5 backdrop-blur-sm">
              <span className="text-sm">⚠️</span>
              <span>LOW AIR ({hudAir}%) — RELEASE TO ASCEND!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SURFACE START PROMPT */}
      <AnimatePresence>
        {hudMaxDepth < 0.5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-15 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="bg-sky-950/90 border-2 border-cyan-400 text-cyan-200 px-6 py-3 rounded-full shadow-2xl flex items-center space-x-2 backdrop-blur-sm"
            >
              <span className="text-lg">👇</span>
              <span className="text-xs font-black uppercase tracking-wider">
                Hold [Space] or Touch Screen To Descend
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MID CONTROLS: Cut Stone Button Overlay */}
      <AnimatePresence>
        {hudCarryingStone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute right-4 bottom-24 z-20 pointer-events-auto"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={(e) => {
                e.stopPropagation();
                handleCutStone();
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl flex items-center space-x-1.5 border border-amber-300 transition-transform cursor-pointer"
            >
              <span>✂️ Cut Stone</span>
              <span className="bg-slate-950/20 px-1.5 py-0.5 rounded text-[10px] font-bold">[X]</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
};

// Helper to get smooth interpolated ocean color at any exact depth in meters
function getOceanColorAtDepth(yMeters: number): { r: number; g: number; b: number } {
  const depthStops = [
    { depth: 0, r: 56, g: 189, b: 248 }, // Bright Sunlit Azure (0m)
    { depth: 8, r: 2, g: 132, b: 199 }, // Ocean Blue Shallows (8m)
    { depth: 18, r: 3, g: 105, b: 161 }, // Reef Mid-Depth (18m)
    { depth: 30, r: 15, g: 23, b: 42 }, // Twilight Navy (30m)
    { depth: 42, r: 30, g: 27, b: 75 }, // Deep Indigo Trench (42m)
    { depth: 55, r: 9, g: 13, b: 22 }, // Midnight Abyss (55m)
    { depth: 65, r: 2, g: 6, b: 23 }, // Trench Floor Pitch (65m)
  ];

  if (yMeters <= depthStops[0].depth) return depthStops[0];
  if (yMeters >= depthStops[depthStops.length - 1].depth) return depthStops[depthStops.length - 1];

  for (let i = 0; i < depthStops.length - 1; i++) {
    const s1 = depthStops[i];
    const s2 = depthStops[i + 1];
    if (yMeters >= s1.depth && yMeters <= s2.depth) {
      const t = (yMeters - s1.depth) / (s2.depth - s1.depth);
      return {
        r: Math.round(s1.r + (s2.r - s1.r) * t),
        g: Math.round(s1.g + (s2.g - s1.g) * t),
        b: Math.round(s1.b + (s2.b - s1.b) * t),
      };
    }
  }
  return depthStops[0];
}

// Canvas Renderer Function
function renderCanvas(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  config: GameConfig,
  diver: DiverState,
  shark: SharkState,
  collectibles: CollectibleItem[],
  upgrades: UpgradesState,
  floatingTexts: Array<{
    id: string;
    x: number;
    y: number;
    text: string;
    color: string;
    fontSize: number;
    alpha: number;
    scale: number;
  }>,
  shakeIntensity: number
) {
  const width = canvas.width;
  const height = canvas.height;

  const goggleLvl = typeof upgrades.pearlGoggles === 'number' ? upgrades.pearlGoggles : upgrades.pearlGoggles ? 1 : 0;
  const lampLvl = typeof upgrades.bioluminescentLamp === 'number' ? upgrades.bioluminescentLamp : upgrades.bioluminescentLamp ? 1 : 0;
  const repellentLvl = typeof upgrades.sharkRepellent === 'number' ? upgrades.sharkRepellent : upgrades.sharkRepellent ? 1 : 0;
  const ropeLvl = typeof upgrades.betterRope === 'number' ? upgrades.betterRope : upgrades.betterRope ? 1 : 0;
  const stoneLvl = typeof upgrades.heavierStone === 'number' ? upgrades.heavierStone : upgrades.heavierStone ? 1 : 0;

  // Scale ratio: 1 meter = X pixels
  const metersToPx = height / 18; // Keep ~18 meters in vertical view

  // Camera tracking Y center on diver with lag
  const cameraCenterY = diver.y;
  const topMeterInView = Math.max(0, cameraCenterY - 8);

  ctx.clearRect(0, 0, width, height);

  ctx.save();
  // Screen Shake Transform
  if (shakeIntensity > 0.1) {
    const shakeX = (Math.random() - 0.5) * shakeIntensity;
    const shakeY = (Math.random() - 0.5) * shakeIntensity;
    ctx.translate(shakeX, shakeY);
  }

  // Helper for converting world Y (meters) to screen canvas Y (pixels)
  const toScreenY = (worldY: number) => {
    return (worldY - topMeterInView) * metersToPx;
  };

  // Helper for converting world X (meters) to screen canvas X (pixels)
  const toScreenX = (worldX: number) => {
    return (worldX / config.WORLD_WIDTH) * width;
  };

  // 1. Continuous Depth Background Gradient (Smooth Interpolation)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  const numStops = 8;
  for (let i = 0; i <= numStops; i++) {
    const ratio = i / numStops;
    const currentMeter = topMeterInView + ratio * 18;
    const col = getOceanColorAtDepth(currentMeter);
    bgGrad.addColorStop(ratio, `rgb(${col.r}, ${col.g}, ${col.b})`);
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Canyon / Trench Walls on Left & Right Margins for Depth Framing
  const wallWidth = width * 0.08;
  const now = Date.now();
  for (let side = 0; side < 2; side++) {
    const isLeft = side === 0;
    const baseX = isLeft ? 0 : width - wallWidth;
    
    // Draw rock segments every 2 meters in view
    const startM = Math.floor(topMeterInView);
    const endM = Math.ceil(topMeterInView + 19);

    ctx.save();
    for (let m = startM; m <= endM; m++) {
      const sy1 = toScreenY(m);
      const sy2 = toScreenY(m + 1);
      
      // Color based on depth m
      const col = getOceanColorAtDepth(m);
      const rockR = Math.max(10, Math.floor(col.r * 0.4));
      const rockG = Math.max(15, Math.floor(col.g * 0.4));
      const rockB = Math.max(25, Math.floor(col.b * 0.5));

      ctx.fillStyle = `rgb(${rockR}, ${rockG}, ${rockB})`;
      
      // Jagged contour offset
      const jitter = Math.sin(m * 12.3) * 6;
      const w = wallWidth + (isLeft ? jitter : -jitter);

      if (isLeft) {
        ctx.fillRect(0, sy1, Math.max(8, w), sy2 - sy1 + 1);
      } else {
        ctx.fillRect(width - Math.max(8, w), sy1, Math.max(8, w), sy2 - sy1 + 1);
      }
    }
    ctx.restore();
  }

  // 3. Depth Strata Gridlines & Depth Zone Markers (Every 5m & 10m)
  const firstGridM = Math.floor(topMeterInView / 5) * 5;
  const lastGridM = Math.ceil((topMeterInView + 18) / 5) * 5;

  for (let m = firstGridM; m <= lastGridM; m += 5) {
    if (m < 0 || m > config.MAX_DEPTH) continue;
    const sy = toScreenY(m);

    ctx.save();
    const isMajor = m % 10 === 0;
    ctx.strokeStyle = isMajor ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = isMajor ? 1.5 : 0.8;
    ctx.setLineDash(isMajor ? [8, 6] : [4, 4]);

    ctx.beginPath();
    ctx.moveTo(wallWidth + 4, sy);
    ctx.lineTo(width - wallWidth - 4, sy);
    ctx.stroke();

    // Depth label text
    ctx.fillStyle = isMajor ? '#38bdf8' : 'rgba(255, 255, 255, 0.4)';
    ctx.font = isMajor ? 'bold 10px monospace' : '9px monospace';
    ctx.textAlign = 'left';

    let zoneTag = '';
    if (m === 0) zoneTag = 'SURFACE';
    else if (m === 10) zoneTag = 'SHALLOW REEF';
    else if (m === 20) zoneTag = 'MID REEF DROP';
    else if (m === 30) zoneTag = 'SHARK TRENCH';
    else if (m === 40) zoneTag = 'TWILIGHT ZONE';
    else if (m === 50) zoneTag = 'MIDNIGHT ABYSS';
    else if (m === 60) zoneTag = 'TRENCH BED';

    const labelStr = isMajor ? `${m}m • ${zoneTag}` : `${m}m`;
    ctx.fillText(labelStr, wallWidth + 8, sy - 3);
    ctx.restore();
  }

  // 4. Sunbeams near Surface (0 - 18m Fade)
  if (topMeterInView < 18) {
    const beamAlpha = Math.max(0, (18 - topMeterInView) / 18) * 0.12;
    ctx.save();
    ctx.fillStyle = `rgba(255, 255, 255, ${beamAlpha})`;

    // Animated shifting light shafts
    const shift = Math.sin(now * 0.001) * 20;
    ctx.beginPath();
    ctx.moveTo(width * 0.15 + shift, 0);
    ctx.lineTo(width * 0.35 + shift, height);
    ctx.lineTo(width * 0.55 + shift, height);
    ctx.lineTo(width * 0.25 + shift, 0);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(width * 0.6 + shift, 0);
    ctx.lineTo(width * 0.8 + shift, height);
    ctx.lineTo(width * 0.95 + shift, height);
    ctx.lineTo(width * 0.7 + shift, 0);
    ctx.fill();
    ctx.restore();
  }

  // 5. Water Surface Wave
  const surfaceScreenY = toScreenY(0);
  if (surfaceScreenY >= -20 && surfaceScreenY <= height) {
    ctx.save();
    ctx.strokeStyle = 'rgba(125, 211, 252, 0.9)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, surfaceScreenY);
    for (let x = 0; x <= width; x += 20) {
      const wave = Math.sin((x + now * 0.003) * 0.05) * 4;
      ctx.lineTo(x, surfaceScreenY + wave);
    }
    ctx.stroke();

    ctx.fillStyle = '#e0f2fe';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('~~~ WATER SURFACE ~~~', width / 2, Math.max(16, surfaceScreenY - 8));
    ctx.restore();
  }

  // 6. Ambient Water Particles (Bubbles / Marine Snow / Bioluminescent Spores)
  ctx.save();
  const particleCount = 30;
  for (let i = 0; i < particleCount; i++) {
    // Deterministic particle positions drifting with time
    const pWorldY = ((i * 2 + (now * 0.001 * (1 + (i % 3)))) % 62);
    if (pWorldY < topMeterInView - 1 || pWorldY > topMeterInView + 19) continue;

    const pSy = toScreenY(pWorldY);
    const pSx = ((i * 37 + Math.sin(now * 0.002 + i) * 15) % (width - wallWidth * 2)) + wallWidth;

    if (pWorldY < 20) {
      // Air Bubbles in Shallows
      ctx.fillStyle = 'rgba(224, 242, 254, 0.6)';
      ctx.beginPath();
      ctx.arc(pSx, pSy, 1.5 + (i % 2), 0, Math.PI * 2);
      ctx.fill();
    } else if (pWorldY < 40) {
      // Marine Snow in Mid-Waters
      ctx.fillStyle = 'rgba(186, 230, 253, 0.4)';
      ctx.beginPath();
      ctx.arc(pSx, pSy, 1 + (i % 2) * 0.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Glowing Bioluminescent Spores in Deep Abyss
      const pulse = 0.3 + Math.sin(now * 0.004 + i) * 0.3;
      ctx.fillStyle = i % 2 === 0 ? `rgba(56, 189, 248, ${pulse})` : `rgba(192, 132, 252, ${pulse})`;
      ctx.beginPath();
      ctx.arc(pSx, pSy, 2 + (i % 2), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // 7. Seabed Floor at 60m
  const seabedSy = toScreenY(config.MAX_DEPTH);
  if (seabedSy >= -50 && seabedSy <= height + 200) {
    ctx.save();
    // Seabed Sandy/Rock Gradient
    const sandGrad = ctx.createLinearGradient(0, seabedSy, 0, seabedSy + 120);
    sandGrad.addColorStop(0, '#0284c7');
    sandGrad.addColorStop(0.2, '#1e293b');
    sandGrad.addColorStop(1, '#020617');
    ctx.fillStyle = sandGrad;
    ctx.fillRect(0, seabedSy, width, 200);

    // Seabed Ridge
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, seabedSy);
    for (let x = 0; x <= width; x += 15) {
      const ridge = Math.sin(x * 0.08) * 6 + Math.cos(x * 0.03) * 4;
      ctx.lineTo(x, seabedSy + ridge);
    }
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('⚓ OCEAN FLOOR (60M TRENCH) ⚓', width / 2, seabedSy + 24);
    ctx.restore();
  }

  // 4. Draw Collectibles (Pearl Shells, Clownfish, Seahorses, Crabs, Eels, Octopuses)
  collectibles.forEach((item) => {
    if (item.isCollected) return;

    const sy = toScreenY(item.y);
    if (sy < -40 || sy > height + 40) return; // Culling

    const sx = toScreenX(item.x);

    ctx.save();
    let sizePx = 28;
    if (item.size === 'medium') sizePx = 36;
    else if (item.size === 'large') sizePx = 46;
    else if (item.size === 'giant') sizePx = 58;

    if (item.type === 'oyster') {
      drawVectorPearlShellCanvas(ctx, sx, sy, sizePx, item.value, item.isEmpty);
    } else if (item.type === 'fish') {
      const facingRight = item.swimDirection ? item.swimDirection > 0 : true;
      drawVectorClownfishCanvas(ctx, sx, sy, sizePx, facingRight);
    } else if (item.type === 'seahorse') {
      drawVectorSeahorseCanvas(ctx, sx, sy, sizePx);
    } else if (item.type === 'crab') {
      drawVectorCrabCanvas(ctx, sx, sy, sizePx);
    } else if (item.type === 'eel') {
      const facingRight = item.swimDirection ? item.swimDirection > 0 : true;
      drawVectorEelCanvas(ctx, sx, sy, sizePx, facingRight);
    } else if (item.type === 'octopus') {
      drawVectorOctopusCanvas(ctx, sx, sy, sizePx);
    } else if (item.type === 'squid') {
      const facingRight = item.swimDirection ? item.swimDirection > 0 : true;
      drawVectorSquidCanvas(ctx, sx, sy, sizePx, facingRight);
    } else if (item.type === 'angler') {
      const facingRight = item.swimDirection ? item.swimDirection > 0 : true;
      drawVectorAnglerCanvas(ctx, sx, sy, sizePx, facingRight);
    }

    // Value badge above item
    ctx.fillStyle = item.size === 'giant' ? '#fef08a' : '#ffffff';
    ctx.font = item.size === 'giant' ? 'bold 11px sans-serif' : 'bold 9.5px sans-serif';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 2.5;

    let labelText = `${item.size[0].toUpperCase()} • +${item.value}💎`;
    if (item.type === 'fish' || item.type === 'eel') {
      labelText = `${item.size[0].toUpperCase()} • +${item.value}🐟`;
    } else if (item.size === 'giant') {
      labelText = `👑 GIANT • +${item.value}💎`;
    }

    ctx.strokeText(labelText, sx, sy - sizePx * 0.5 - 4);
    ctx.fillText(labelText, sx, sy - sizePx * 0.5 - 4);

    // Grab Progress Ring
    if (item.grabProgress > 0) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(sx, sy, sizePx * 0.65, -Math.PI / 2, -Math.PI / 2 + item.grabProgress * Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  });

  // 5. Draw Shark (At depth ~31m)
  const sharkSy = toScreenY(shark.y);
  if (sharkSy >= -60 && sharkSy <= height + 60) {
    const sharkSx = toScreenX(shark.x);

    ctx.save();
    ctx.translate(sharkSx, sharkSy);
    if (shark.direction < 0) ctx.scale(-1, 1);

    // Warning Aura
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.beginPath();
    ctx.arc(0, 0, config.SHARK_RADIUS * metersToPx, 0, Math.PI * 2);
    ctx.fill();

    // Shark Body
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.ellipse(0, 0, 28, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fin
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(2, -8);
    ctx.lineTo(12, -22);
    ctx.lineTo(20, -6);
    ctx.closePath();
    ctx.fill();

    // Tail
    ctx.beginPath();
    ctx.moveTo(-25, 0);
    ctx.lineTo(-40, -14);
    ctx.lineTo(-32, 0);
    ctx.lineTo(-40, 14);
    ctx.closePath();
    ctx.fill();

    // Eye
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(14, -3, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 6. Draw Diver & Rope
  const diverSx = toScreenX(diver.x);
  const diverSy = toScreenY(diver.y);

  // Diver Headlamp Glow / Ambient Light Cone in Deep Water (> 15m)
  if (diver.y > 15) {
    ctx.save();
    const lightRadius = 130 + goggleLvl * 20 + lampLvl * 40;
    const lightAlpha = Math.min(0.85, 0.45 + lampLvl * 0.08);
    
    const radGrad = ctx.createRadialGradient(
      diverSx,
      diverSy,
      10,
      diverSx,
      diverSy,
      lightRadius
    );

    if (lampLvl > 0) {
      radGrad.addColorStop(0, `rgba(56, 189, 248, ${lightAlpha * 0.95})`);
      radGrad.addColorStop(0.5, `rgba(168, 85, 247, ${lightAlpha * 0.6})`);
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      radGrad.addColorStop(0, `rgba(254, 240, 138, ${lightAlpha * 0.9})`);
      radGrad.addColorStop(0.4, `rgba(56, 189, 248, ${lightAlpha * 0.5})`);
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }

    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(diverSx, diverSy, lightRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Shark Repellent Green Protective Shield Ring
  if (repellentLvl > 0) {
    ctx.save();
    ctx.strokeStyle = `rgba(52, 211, 153, ${Math.min(0.9, 0.4 + repellentLvl * 0.15)})`;
    ctx.lineWidth = 1.5 + repellentLvl * 0.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(diverSx, diverSy, 24 + repellentLvl * 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Rope connecting to surface
  ctx.save();
  if (ropeLvl > 0) {
    ctx.strokeStyle = '#f59e0b'; // Braided hemp golden rope
    ctx.lineWidth = 2 + ropeLvl * 0.5;
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 2 + ropeLvl;
  } else {
    ctx.strokeStyle = 'rgba(253, 224, 71, 0.6)';
    ctx.lineWidth = 2;
  }
  ctx.beginPath();
  ctx.moveTo(diverSx, surfaceScreenY);
  ctx.lineTo(diverSx, diverSy);
  ctx.stroke();
  ctx.restore();

  // Weight Stone if carrying
  if (diver.carryingStone) {
    ctx.save();
    if (stoneLvl > 0) {
      ctx.fillStyle = '#0f172a'; // Heavy iron stone
      ctx.beginPath();
      ctx.arc(diverSx, diverSy + 16, 9 + stoneLvl, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24'; // Steel/gold reinforcement band
      ctx.lineWidth = 2 + stoneLvl * 0.5;
      ctx.stroke();
    } else {
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(diverSx, diverSy + 16, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.restore();
  }

  // Diver Vector Character
  drawVectorDiverCanvas(ctx, diverSx, diverSy, 46, 46, {
    isDescending: diver.isDescending,
    isAscending: diver.isAscending,
    carryingStone: diver.carryingStone,
    isPanic: diver.isPanicAscent,
    invulnerable: diver.invulnerableTimer > 0,
    time: Date.now(),
  });

  // In-World Diver Breath Gauge Ring (depletes visibly as player stays submerged)
  if (diver.y > 0.3) {
    ctx.save();
    const lungLvl = typeof upgrades.lungTraining === 'number' ? upgrades.lungTraining : upgrades.lungTraining ? 1 : 0;
    const maxAirCap = config.AIR_MAX + lungLvl * 25;
    const ringRadius = 28;
    const airRatio = Math.max(0, Math.min(1, diver.air / maxAirCap));
    const isLow = airRatio <= 0.3;

    // Track Ring
    ctx.strokeStyle = isLow ? 'rgba(239, 68, 68, 0.35)' : 'rgba(15, 23, 42, 0.55)';
    ctx.lineWidth = isLow ? 4 : 3;
    ctx.beginPath();
    ctx.arc(diverSx, diverSy, ringRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Depleting Arc (starts top at -PI/2)
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + airRatio * Math.PI * 2;

    if (airRatio > 0.5) {
      ctx.strokeStyle = '#38bdf8'; // Cyan
    } else if (airRatio > 0.25) {
      ctx.strokeStyle = '#facc15'; // Amber Yellow
    } else {
      const pulseAlpha = 0.75 + Math.sin(now * 0.012) * 0.25;
      ctx.strokeStyle = `rgba(244, 63, 94, ${pulseAlpha})`; // Warning Rose Red Pulse
      ctx.lineWidth = 4.5 + Math.sin(now * 0.012) * 1.5;
    }

    ctx.beginPath();
    ctx.arc(diverSx, diverSy, ringRadius, startAngle, endAngle);
    ctx.stroke();

    // Low breath warning bubbles floating up from diver
    if (isLow && Math.random() < 0.35) {
      ctx.fillStyle = 'rgba(244, 63, 94, 0.85)';
      ctx.beginPath();
      ctx.arc(
        diverSx + (Math.random() - 0.5) * 24,
        diverSy - ringRadius - Math.random() * 8,
        2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.restore();
  }

  // 7. Render Floating Popups (+15💎, +1 🐟, COMBO!)
  floatingTexts.forEach((ft) => {
    const fsx = toScreenX(ft.x);
    const fsy = toScreenY(ft.y);
    if (fsy < -50 || fsy > height + 50) return;

    ctx.save();
    ctx.translate(fsx, fsy);
    ctx.scale(ft.scale, ft.scale);
    ctx.globalAlpha = Math.max(0, ft.alpha);
    ctx.fillStyle = ft.color;
    ctx.font = `900 ${ft.fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 3;
    ctx.strokeText(ft.text, 0, 0);
    ctx.fillText(ft.text, 0, 0);
    ctx.restore();
  });

  // 8. Render Shark Proximity Warning Banner
  const distToSharkY = Math.abs(diver.y - shark.y);
  if (distToSharkY < 10 && !diver.isPanicAscent && diver.y > 5) {
    const isSharkAbove = shark.y < diver.y;
    ctx.save();
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.fillRect(0, 0, width, height); // Red danger vignette

    ctx.fillStyle = '#ef4444';
    ctx.font = '900 12px sans-serif';
    ctx.textAlign = 'center';
    const arrow = isSharkAbove ? '▲ SHARK PATROL ABOVE ▲' : '▼ SHARK PATROL BELOW ▼';
    const warnY = isSharkAbove ? 45 : height - 45;
    ctx.fillText(`⚠️ ${arrow} (${Math.round(distToSharkY)}m) ⚠️`, width / 2, warnY);
    ctx.restore();
  }

  // Restore root shake context
  ctx.restore();
}
