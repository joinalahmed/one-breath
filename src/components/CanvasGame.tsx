import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { GameConfig, DiverState, CollectibleItem, SharkState, UpgradesState, ItemSize } from '../types';
import { soundManager } from '../audioAndHaptics';
import { BubbleOverlay } from './BubbleOverlay';
import { RareCreatureDiscoveryModal } from './RareCreatureDiscoveryModal';
import { TutorialTip } from './TutorialTip';
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
  drawVectorShipAndCrewCanvas,
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
    /** Pearls/fish the basket WOULD have yielded if surfaced — used for the rescue offer on a failed dive. */
    potentialCoins: number;
    potentialFood: number;
    stoneCutAtDepth: number | null;
    airAtSurfacing: number;
    rareCollected?: number;
  }) => void;
  onOpenDebug: () => void;
  onExit?: () => void;
}

export const CanvasGame: React.FC<CanvasGameProps> = ({
  config,
  upgrades,
  streak,
  onDiveComplete,
  onOpenDebug,
  onExit,
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
    vx: config.WORLD_WIDTH / 2,
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
    minX: WALL_MARGIN_FRAC * config.WORLD_WIDTH,
    maxX: config.WORLD_WIDTH - WALL_MARGIN_FRAC * config.WORLD_WIDTH,
  });

  // Track collected item types for photo library
  const itemTypesCollectedRef = useRef<Map<string, number>>(new Map());

  // Track depth band announcements to avoid spam
  const announcedDepthBandsRef = useRef<Set<string>>(new Set());

  // Touch & Keyboard tracking
  const touchStartPosRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapTimeRef = useRef<number>(0);
  const keysPressedRef = useRef<Set<string>>(new Set());

  // Animated GIF sprites (live <img> elements sampled by the canvas each frame)
  const spritesRef = useRef<SpriteSet>({
    pearl: null,
    fishVariants: [null, null, null, null],
    shark: null,
    crab: null,
    seabedFloor: null,
    wallDecor: [null, null, null, null],
    wallTiles: [null, null, null, null, null],
    cliffLeft: null,
    cliffRight: null,
    oceanWalls: [null, null, null, null],
    oceanPlant: null,
    bgFish: [null, null],
  });

  // UI state overlays
  const [hudAir, setHudAir] = useState(() => config.AIR_MAX + lungLvl * 25);
  const [hudDepth, setHudDepth] = useState(0);
  const [hudMaxDepth, setHudMaxDepth] = useState(0);
  const [hudMultiplier, setHudMultiplier] = useState(1.0);
  const [hudBasket, setHudBasket] = useState<Array<{ type: 'shell' | 'fish'; value: number; size: ItemSize }>>([]);
  const [hudCarryingStone, setHudCarryingStone] = useState(true);
  const [grabProgress, setGrabProgress] = useState<{ targetId: string; progress: number } | null>(null);
  const [sonarDistance, setSonarDistance] = useState<number | null>(null);
  const [currentDepthBand, setCurrentDepthBand] = useState<string | null>(null);
  const [showZoneBanner, setShowZoneBanner] = useState(false);
  const [rareDiscovery, setRareDiscovery] = useState<{
    type: string;
    name: string;
    emoji: string;
    rarity: string;
    depth: number;
    value: number;
  } | null>(null);
  const discoveredRareRef = useRef<Set<string>>(new Set());
  const [showCutStoneTip, setShowCutStoneTip] = useState(false);
  const cutStoneTipShownRef = useRef(false);
  const depthReachedRef = useRef(0);

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

    // Keep every spawned item clear of the canyon walls so nothing hides behind
    // the ridges (crabs settle at the reef base just inside the wall).
    const spawnMargin = WALL_MARGIN_FRAC * config.WORLD_WIDTH + 0.3;
    for (const it of items) {
      it.x = Math.max(spawnMargin, Math.min(config.WORLD_WIDTH - spawnMargin, it.x));
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

      if (e.code === 'KeyG') {
        onOpenDebug();
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
  }, [handleCutStone, onOpenDebug]);

  // Set up animation loop
  useEffect(() => {
    initCollectibles();
    announcedBandsRef.current.clear();
    announcedDepthBandsRef.current.clear();
    itemTypesCollectedRef.current.clear();
    discoveredRareRef.current.clear();

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
      // They turn back at the canyon walls (WALL_MARGIN_FRAC of the world on each
      // side) instead of the raw world edge, so they never swim behind the ridges.
      const swimMargin = WALL_MARGIN_FRAC * config.WORLD_WIDTH;
      collectibles.forEach((item) => {
        if (['fish', 'seahorse', 'eel', 'squid', 'angler'].includes(item.type) && !item.isCollected && item.swimDirection && item.swimSpeed) {
          item.x += item.swimDirection * item.swimSpeed * dt;
          // Clamp at the walls and steer inward with a definite sign, so the
          // direction can't toggle every frame while lingering in the boundary zone
          // (which would mirror-flip the sprite each frame and look like spinning).
          if (item.x < swimMargin) {
            item.x = swimMargin;
            item.swimDirection = Math.abs(item.swimDirection) || 1;
          } else if (item.x > config.WORLD_WIDTH - swimMargin) {
            item.x = config.WORLD_WIDTH - swimMargin;
            item.swimDirection = -(Math.abs(item.swimDirection) || 1);
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
      const isSteering =
        keysPressedRef.current.has('ArrowLeft') ||
        keysPressedRef.current.has('KeyA') ||
        keysPressedRef.current.has('TouchLeft') ||
        keysPressedRef.current.has('ArrowRight') ||
        keysPressedRef.current.has('KeyD') ||
        keysPressedRef.current.has('TouchRight');

      if (keysPressedRef.current.has('ArrowLeft') || keysPressedRef.current.has('KeyA') || keysPressedRef.current.has('TouchLeft')) {
        diver.vx = Math.max(1.5, diver.vx - config.HORIZONTAL_SPEED * speedMult * dt * 3.5);
      }
      if (keysPressedRef.current.has('ArrowRight') || keysPressedRef.current.has('KeyD') || keysPressedRef.current.has('TouchRight')) {
        diver.vx = Math.min(config.WORLD_WIDTH - 1.5, diver.vx + config.HORIZONTAL_SPEED * speedMult * dt * 3.5);
      }

      // If at surface and not steering, align with expedition boat
      if (diver.y < 0.2 && !isSteering) {
        diver.vx = config.WORLD_WIDTH / 2;
      }

      // Horizontal lerp
      diver.x += (diver.vx - diver.x) * Math.min(1, dt * 10);
      // Keep the diver in the channel — allowed to nose close to the walls but not
      // swim fully behind the ridges (0.6 of the creature wall margin).
      const diverMargin = WALL_MARGIN_FRAC * config.WORLD_WIDTH * 0.6;
      diver.x = Math.max(diverMargin, Math.min(config.WORLD_WIDTH - diverMargin, diver.x));

      // Sonar Radar Proximity Check — extended range for earlier warning
      if (sonarLvl > 0 && diver.y > 5) {
        const radarRange = 15 + sonarLvl * 4; // Extended range for better warning
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
        depthReachedRef.current = diver.y;
        // Show cut stone tip when reaching ~15m depth (only once per dive)
        if (diver.y > 14 && !cutStoneTipShownRef.current && diver.carryingStone) {
          cutStoneTipShownRef.current = true;
          setShowCutStoneTip(true);
        }
      }

      // Depth band transitions for zone announcements
      let newBand: string | null = null;
      if (diver.y < 15) newBand = '0-15';
      else if (diver.y < 30) newBand = '15-30';
      else if (diver.y < 45) newBand = '30-45';
      else newBand = '45-60';

      if (newBand && newBand !== currentDepthBand) {
        if (!announcedDepthBandsRef.current.has(newBand)) {
          setCurrentDepthBand(newBand);
          setShowZoneBanner(true);
          announcedDepthBandsRef.current.add(newBand);
          setTimeout(() => setShowZoneBanner(false), 2500);
        }
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
                // Track item type for photo library
                const photoType = item.type === 'oyster' ? 'oyster' : item.type;
                itemTypesCollectedRef.current.set(
                  photoType,
                  (itemTypesCollectedRef.current.get(photoType) || 0) + 1
                );

                // Check for rare creature discovery
                const rareCreatures = ['seahorse', 'crab', 'eel', 'octopus', 'squid', 'angler'];
                if (rareCreatures.includes(item.type) && !discoveredRareRef.current.has(item.type)) {
                  discoveredRareRef.current.add(item.type);
                  const rareNames: Record<string, string> = {
                    seahorse: 'Seahorse',
                    crab: 'Hermit Crab',
                    eel: 'Electric Eel',
                    octopus: 'Giant Octopus',
                    squid: 'Bioluminescent Squid',
                    angler: 'Deepsea Anglerfish',
                  };
                  const rareEmojis: Record<string, string> = {
                    seahorse: '🐴',
                    crab: '🦀',
                    eel: '🐍',
                    octopus: '🐙',
                    squid: '🦑',
                    angler: '🦑',
                  };
                  const rareRarities: Record<string, string> = {
                    seahorse: 'Rare',
                    crab: 'Rare',
                    eel: 'Rare',
                    octopus: 'Epic',
                    squid: 'Epic',
                    angler: 'Legendary',
                  };
                  setRareDiscovery({
                    type: item.type,
                    name: rareNames[item.type],
                    emoji: rareEmojis[item.type],
                    rarity: rareRarities[item.type],
                    depth: Math.round(diver.y * 10) / 10,
                    value: item.value,
                  });
                }

                soundManager.playGrabConfirm(true);

                let textStr = `+${item.value} 💎`;
                let textCol = '#38bdf8';

                if (item.type === 'fish') {
                  const fishName = FISH_NAMES[pickVariant(item.id, FISH_NAMES.length)];
                  textStr = `+${item.value} 🐟 ${fishName}!`;
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
        // Full value the basket would yield if surfaced (used for rescue offer);
        // actual earnings are only banked on a safe surface.
        const fullCoins = Math.round(rawCoins * depthMult * streakMult * gogglesMult * charmMult);
        const coinsEarned = outcome === 'surfaced' ? fullCoins : 0;
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
          potentialCoins: fullCoins,
          potentialFood: fishCollected,
          stoneCutAtDepth: diver.stoneCutAtDepth,
          airAtSurfacing: Math.round(diver.air),
          rareCollected,
          itemsCollected: Array.from(itemTypesCollectedRef.current.entries()).map(([type, count]) => ({ type, count })),
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
        screenShakeRef.current.intensity,
        spritesRef.current,
        diverRef.current.invulnerableTimer > 1.2 && diverRef.current.isPanicAscent
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
    // Ignore if the event originated from a UI button
    const target = e.target as HTMLElement;
    if (target.closest('[data-hud]')) return;

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

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden bg-slate-900 flex flex-col justify-between"
      style={{ touchAction: 'none' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onTouchStart={handleTouchStart}
    >
      {/* 2D HTML5 Canvas for Render */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-none" />

      {/* Hidden animated GIF sprites — kept in the DOM so the browser advances
          their frames; the canvas samples the current frame each render. */}
      <div aria-hidden className="absolute pointer-events-none" style={{ width: 1, height: 1, left: 0, top: 0, opacity: 0, overflow: 'hidden' }}>
        <img src="/assets/cliff-redstar.png" alt="" ref={(el) => { spritesRef.current.cliffLeft = el; }} />
        <img src="/assets/cliff-purplestar.png" alt="" ref={(el) => { spritesRef.current.cliffRight = el; }} />
        <img src="/assets/ocean-wall-light.png" alt="" ref={(el) => { spritesRef.current.oceanWalls[0] = el; }} />
        <img src="/assets/ocean-wall-med.png" alt="" ref={(el) => { spritesRef.current.oceanWalls[1] = el; }} />
        <img src="/assets/ocean-wall-fixed.png" alt="" ref={(el) => { spritesRef.current.oceanWalls[2] = el; }} />
        <img src="/assets/ocean-wall-dark.png" alt="" ref={(el) => { spritesRef.current.oceanWalls[3] = el; }} />
        <img src="/assets/ocean-plant.png" alt="" ref={(el) => { spritesRef.current.oceanPlant = el; }} />
        <img src="/assets/greenfish.png" alt="" ref={(el) => { spritesRef.current.bgFish[0] = el; }} />
        <img src="/assets/bluefush-patcheye.png" alt="" ref={(el) => { spritesRef.current.bgFish[1] = el; }} />
        <img src="/assets/pearl.gif" alt="" ref={(el) => { spritesRef.current.pearl = el; }} />
        {/* Fish variants — order must match FISH_FACES_RIGHT */}
        <img src="/assets/fish-clownfish.gif" alt="" ref={(el) => { spritesRef.current.fishVariants[0] = el; }} />
        <img src="/assets/fish-pufferfish.gif" alt="" ref={(el) => { spritesRef.current.fishVariants[1] = el; }} />
        <img src="/assets/fish-betta.gif" alt="" ref={(el) => { spritesRef.current.fishVariants[2] = el; }} />
        <img src="/assets/fish-angelfish.gif" alt="" ref={(el) => { spritesRef.current.fishVariants[3] = el; }} />
        <img src="/assets/shark.gif" alt="" ref={(el) => { spritesRef.current.shark = el; }} />
        <img src="/assets/crab.gif" alt="" ref={(el) => { spritesRef.current.crab = el; }} />
        {/* Static reef/rock decorations for the canyon walls + seabed floor */}
        <img src="/assets/seabed-floor.png" alt="" ref={(el) => { spritesRef.current.seabedFloor = el; }} />
        <img src="/assets/coral-branching.png" alt="" ref={(el) => { spritesRef.current.wallDecor[0] = el; }} />
        <img src="/assets/coral-seafan.png" alt="" ref={(el) => { spritesRef.current.wallDecor[1] = el; }} />
        <img src="/assets/rock-seaweed.png" alt="" ref={(el) => { spritesRef.current.wallDecor[2] = el; }} />
        <img src="/assets/ridge-coral-shelf.png" alt="" ref={(el) => { spritesRef.current.wallDecor[3] = el; }} />
        {/* Stackable ridge tiles that build the canyon side walls (cap, straight, stepUp, stepDown, block) */}
        <img src="/assets/ridge-cap.png" alt="" ref={(el) => { spritesRef.current.wallTiles[0] = el; }} />
        <img src="/assets/ridge-straight.png" alt="" ref={(el) => { spritesRef.current.wallTiles[1] = el; }} />
        <img src="/assets/ridge-step-up.png" alt="" ref={(el) => { spritesRef.current.wallTiles[2] = el; }} />
        <img src="/assets/ridge-step-down.png" alt="" ref={(el) => { spritesRef.current.wallTiles[3] = el; }} />
        <img src="/assets/ridge-block.png" alt="" ref={(el) => { spritesRef.current.wallTiles[4] = el; }} />
      </div>

      {/* Mark Bowley Ambient Floating Bubble Effect */}
      <BubbleOverlay count={18} />

      {/* Village exit button — inside the game container but with z-[9999] and stopPropagation via native listener */}
      <div
        data-hud="true"
        className="absolute top-3 right-14 z-[9999]"
        style={{ touchAction: 'auto', pointerEvents: 'auto' }}
        ref={(el) => {
          if (el && !el.dataset.bound) {
            el.dataset.bound = 'true';
            el.addEventListener('pointerdown', (e) => e.stopPropagation(), true);
            el.addEventListener('pointerup', (e) => e.stopPropagation(), true);
            el.addEventListener('touchstart', (e) => e.stopPropagation(), true);
            el.addEventListener('click', (e) => { e.stopPropagation(); onExit?.(); }, true);
          }
        }}
      >
        <button
          className="px-3 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/50 flex items-center gap-1.5 cursor-pointer active:scale-90 transition-all shadow-lg"
          style={{ touchAction: 'auto', pointerEvents: 'auto' }}
        >
          <span className="text-sm">🏠</span>
          <span className="text-[10px] font-bold text-cyan-200">Village</span>
        </button>
      </div>

      {/* TOP HUD — collected items on the left */}
      <div
        className="relative z-10 w-full px-3 flex items-center pointer-events-none"
        style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900/60 border border-slate-700/50 rounded-full px-2.5 py-1">
            <img src="/assets/pearl.gif" alt="pearl" className="w-4 h-4" />
            <span className="text-[10px] font-black text-white font-mono">{hudBasket.filter(b => b.type === 'shell').length}</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-900/60 border border-slate-700/50 rounded-full px-2.5 py-1">
            <span className="text-xs">🐟</span>
            <span className="text-[10px] font-black text-white font-mono">{hudBasket.filter(b => b.type === 'fish').length}</span>
          </div>
          {hudBasket.some(b => !['shell', 'fish'].includes(b.type)) && (
            <div className="flex items-center gap-1 bg-slate-900/60 border border-slate-700/50 rounded-full px-2.5 py-1">
              <span className="text-xs">🦀</span>
              <span className="text-[10px] font-black text-amber-300 font-mono">{hudBasket.filter(b => !['shell', 'fish'].includes(b.type)).length}</span>
            </div>
          )}
          <div className="flex items-center gap-1 bg-slate-900/60 border border-slate-700/50 rounded-full px-2.5 py-1">
            <span className="text-xs">🧺</span>
            <span className="text-[10px] font-black text-emerald-300 font-mono">{hudBasket.length}/{capacity}</span>
          </div>
        </div>
      </div>

      {/* LEFT SIDE: Fixed depth scale — shows where the diver currently is */}
      <div className="absolute left-0 top-14 bottom-16 z-10 flex flex-col items-start pointer-events-none w-14">
        <div className="relative h-full w-full">
          {[5, 10, 15, 20, 30, 40, 50, 60].map((mark) => {
            const percent = (mark / config.MAX_DEPTH) * 100;
            const isActive = Math.abs(hudDepth - mark) < 3;
            return (
              <div
                key={mark}
                className="absolute left-0 flex items-center"
                style={{ top: `${percent}%` }}
              >
                <span className={`text-[9px] font-mono font-bold pl-1 ${isActive ? 'text-cyan-300' : 'text-slate-500'}`}>
                  {mark}m
                </span>
                <div className={`w-3 h-px ml-0.5 ${isActive ? 'bg-cyan-400' : 'bg-slate-600'}`} />
              </div>
            );
          })}
          {/* Current depth indicator arrow */}
          <motion.div
            className="absolute left-0 right-0 flex items-center"
            animate={{ top: `${(hudDepth / config.MAX_DEPTH) * 100}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          >
            <div className="w-full h-px bg-cyan-400/40" />
            <div className="absolute right-0 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[6px] border-r-cyan-400" />
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE: Vertical depth meter tube */}
      <div className="absolute right-3 top-16 bottom-24 z-10 flex flex-col items-center pointer-events-none">
        {/* Tube cap */}
        <div className="w-4 h-3 rounded-t-full border-2 border-slate-500 border-b-0 bg-slate-800/60" />
        {/* Tube body */}
        <div className="relative flex-1 w-4 border-2 border-slate-500 bg-slate-900/40 rounded-b-lg overflow-hidden">
          {/* Air fill (top to bottom, empties from top) */}
          <motion.div
            className={`absolute bottom-0 left-0 right-0 ${
              hudAir / maxAir <= 0.25
                ? 'bg-gradient-to-t from-red-600 to-orange-400'
                : hudAir / maxAir <= 0.5
                ? 'bg-gradient-to-t from-amber-500 to-yellow-300'
                : 'bg-gradient-to-t from-cyan-500 to-cyan-300'
            }`}
            animate={{ height: `${Math.min(100, (hudAir / maxAir) * 100)}%` }}
            transition={{ type: 'spring', stiffness: 50, damping: 15 }}
          />
        </div>
      </div>

      {/* CUT STONE TUTORIAL TIP */}
      <AnimatePresence>
        {showCutStoneTip && (
          <TutorialTip
            key="cut-stone-tip"
            title="Quick Tip!"
            description="Double-tap to cut your stone and ascend faster! Perfect for escaping sharks."
            icon="✂️"
            onDismiss={() => setShowCutStoneTip(false)}
          />
        )}
      </AnimatePresence>

      {/* RARE CREATURE DISCOVERY MODAL */}
      <AnimatePresence>
        {rareDiscovery && (
          <RareCreatureDiscoveryModal
            key={`rare-${rareDiscovery.type}`}
            itemType={rareDiscovery.type}
            itemName={rareDiscovery.name}
            emoji={rareDiscovery.emoji}
            rarity={rareDiscovery.rarity}
            depth={rareDiscovery.depth}
            value={rareDiscovery.value}
            onComplete={() => setRareDiscovery(null)}
          />
        )}
      </AnimatePresence>

      {/* DEPTH ZONE BANNER */}
      <AnimatePresence>
        {showZoneBanner && currentDepthBand && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute top-14 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          >
            <div className={`px-4 py-2 rounded-full font-black uppercase tracking-widest text-xs shadow-2xl backdrop-blur-md border-2 flex items-center space-x-2 ${
              currentDepthBand === '0-15'
                ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200'
                : currentDepthBand === '15-30'
                  ? 'bg-blue-950/90 border-blue-400 text-blue-200'
                  : currentDepthBand === '30-45'
                    ? 'bg-indigo-950/90 border-indigo-400 text-indigo-200'
                    : 'bg-violet-950/90 border-violet-400 text-violet-200'
            }`}>
              <span>🌊</span>
              <span>
                {currentDepthBand === '0-15' && 'SHALLOW REEF'}
                {currentDepthBand === '15-30' && 'MID REEF DROP'}
                {currentDepthBand === '30-45' && 'SHARK TRENCH'}
                {currentDepthBand === '45-60' && 'MIDNIGHT ABYSS'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SONAR RADAR PROXIMITY ALERT */}
      <AnimatePresence>
        {sonarDistance !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0, scale: [1, 1.04, 1] }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, scale: { repeat: Infinity, duration: 0.6 } }}
            className="absolute top-28 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
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
        {hudAir / maxAir <= 0.25 && hudAir > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: [1, 1.05, 1] }}
            exit={{ opacity: 0, y: -15, scale: 0.9 }}
            transition={{ duration: 0.3, scale: { repeat: Infinity, duration: 0.8 } }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          >
            <div className="bg-rose-950/90 border border-rose-500/80 text-rose-200 px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-2xl flex items-center space-x-1.5 backdrop-blur-sm">
              <span className="text-sm">⚠️</span>
              <span>LOW AIR ({Math.round((hudAir / maxAir) * 100)}%) — RELEASE TO ASCEND!</span>
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

      {/* CUT STONE BUTTON - Bottom right circular */}
      <AnimatePresence>
        {hudCarryingStone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute right-3 z-20 pointer-events-auto"
            style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
          >
            <motion.button
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              whileTap={{ scale: 0.85 }}
              onClick={(e) => {
                e.stopPropagation();
                handleCutStone();
              }}
              className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #164e63 0%, #0e7490 100%)',
                border: '3px solid #22d3ee',
                boxShadow: '0 4px 20px rgba(34,211,238,0.4)',
              }}
            >
              <span className="text-xl">✂️</span>
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

// Animated GIF sprites drawn onto the canvas (each is a live <img> whose
// current frame is sampled every render, so the GIF animates on the canvas).
interface SpriteSet {
  pearl: HTMLImageElement | null;
  // Multiple fish variants; each fish item is assigned one deterministically by id.
  fishVariants: (HTMLImageElement | null)[];
  shark: HTMLImageElement | null;
  crab: HTMLImageElement | null;
  // Static reef/rock decorations lining the canyon walls + the seabed floor art.
  seabedFloor: HTMLImageElement | null;
  wallDecor: (HTMLImageElement | null)[];
  // Stackable ridge tiles that build the canyon side walls, top to bottom:
  // [cap, straight, stepUp, stepDown, block].
  wallTiles: (HTMLImageElement | null)[];
  cliffLeft: HTMLImageElement | null;
  cliffRight: HTMLImageElement | null;
  oceanWalls: (HTMLImageElement | null)[];
  oceanPlant: HTMLImageElement | null;
  bgFish: (HTMLImageElement | null)[];
}

// Default facing of each fish variant art (true = the fish's head points right),
// indexed to match the order the <img> refs are registered below.
const FISH_FACES_RIGHT = [false, false, true, true]; // clownfish, pufferfish, betta, angelfish

// Display names for each fish variant — same order/index as the <img> refs and
// FISH_FACES_RIGHT, so pickVariant(id) selects a matching species name.
const FISH_NAMES = ['Clownfish', 'Pufferfish', 'Betta', 'Angelfish'];

// Canyon wall geometry, shared by the renderer and the movement/spawn logic so
// creatures stay aware of the walls.
//  - WALL_FRAC: fraction of the screen width each ridge occupies (visual box).
//  - WALL_MARGIN_FRAC: fraction of WORLD_WIDTH that swimming creatures, the diver,
//    and spawns keep clear of on each side (a touch inside the art so fish can
//    still nose up to the reef).
const WALL_FRAC = 0.08;
const WALL_MARGIN_FRAC = 0.06;

/** Stable 0..count-1 index derived from a string id (so a fish keeps its variant). */
function pickVariant(id: string, count: number): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return count > 0 ? Math.abs(h) % count : 0;
}

/** Draw a sprite centered at (cx, cy), scaled to fit within `box` (px) preserving aspect ratio.
 *  Returns false if the image is not ready yet (caller can fall back to a vector). */
function drawSprite(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  cx: number,
  cy: number,
  box: number,
  flipX: boolean,
  alpha = 1
): boolean {
  if (!img || !img.complete || !img.naturalWidth) return false;
  const scale = box / Math.max(img.naturalWidth, img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.save();
  if (alpha !== 1) ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  if (flipX) ctx.scale(-1, 1);
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.restore();
  return true;
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
  shakeIntensity: number,
  sprites: SpriteSet,
  isPanicAscent: boolean = false
) {
  const width = canvas.width;
  const height = canvas.height;

  const lungLvl = typeof upgrades.lungTraining === 'number' ? upgrades.lungTraining : upgrades.lungTraining ? 1 : 0;
  const goggleLvl = typeof upgrades.pearlGoggles === 'number' ? upgrades.pearlGoggles : upgrades.pearlGoggles ? 1 : 0;
  const lampLvl = typeof upgrades.bioluminescentLamp === 'number' ? upgrades.bioluminescentLamp : upgrades.bioluminescentLamp ? 1 : 0;
  const repellentLvl = typeof upgrades.sharkRepellent === 'number' ? upgrades.sharkRepellent : upgrades.sharkRepellent ? 1 : 0;
  const ropeLvl = typeof upgrades.betterRope === 'number' ? upgrades.betterRope : upgrades.betterRope ? 1 : 0;
  const stoneLvl = typeof upgrades.heavierStone === 'number' ? upgrades.heavierStone : upgrades.heavierStone ? 1 : 0;

  // Scale ratio: 1 meter = X pixels
  const metersToPx = height / 18; // Keep ~18 meters in vertical view

  // Camera tracking Y center on diver with lag.
  // Clamp the bottom so the seabed can't scroll past the lower edge — once the
  // diver nears the floor the view stops descending and the floor stays pinned
  // near the bottom (leaving ~2m of seabed visible below it) instead of riding up.
  const cameraCenterY = diver.y;
  const maxTopMeter = config.MAX_DEPTH - 16;
  const topMeterInView = Math.min(Math.max(-4.5, cameraCenterY - 6.5), maxTopMeter);

  ctx.clearRect(0, 0, width, height);

  ctx.save();
  // Panic Ascent Camera Zoom
  if (isPanicAscent) {
    ctx.translate(width / 2, height / 2);
    ctx.scale(1.06, 1.06);
    ctx.translate(-width / 2, -height / 2);
  }

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

  const wallWidth = width * WALL_FRAC;
  const now = Date.now();

  // 1. Ocean depth background — tiled images by depth zone with blended transitions
  const depthZones = [0, 15, 30, 45];
  const blendMeters = 3;
  const oceanWalls = sprites.oceanWalls;
  let bgDrawn = false;
  if (oceanWalls[0] && oceanWalls[0].naturalWidth > 0) {
    for (let z = 0; z < 4; z++) {
      const img = oceanWalls[z];
      if (!img || img.naturalWidth === 0) continue;
      const zoneStartM = depthZones[z];
      const zoneEndM = z < 3 ? depthZones[z + 1] + blendMeters : config.MAX_DEPTH;
      const zoneStartPx = toScreenY(zoneStartM);
      const zoneEndPx = toScreenY(zoneEndM);
      if (zoneEndPx < 0 || zoneStartPx > height) continue;
      const scale = width / img.naturalWidth;
      const scaledH = img.naturalHeight * scale;
      const clipTop = Math.max(0, zoneStartPx);
      const clipBot = Math.min(height, zoneEndPx);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, clipTop, width, clipBot - clipTop);
      ctx.clip();
      if (z > 0) {
        const fadeStartPx = toScreenY(depthZones[z]);
        const fadeEndPx = toScreenY(depthZones[z] + blendMeters);
        const grad = ctx.createLinearGradient(0, fadeStartPx, 0, fadeEndPx);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,1)');
        ctx.fillStyle = grad;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillRect(0, fadeStartPx, width, fadeEndPx - fadeStartPx);
        ctx.globalCompositeOperation = 'source-over';
      }
      const offsetY = zoneStartPx;
      const startTile = Math.floor((clipTop - offsetY) / scaledH);
      const endTile = Math.ceil((clipBot - offsetY) / scaledH);
      for (let t = startTile; t <= endTile; t++) {
        ctx.drawImage(img, 0, offsetY + t * scaledH, width, scaledH);
      }
      if (z > 0) {
        const fadeStartPx = toScreenY(depthZones[z]);
        const fadeEndPx = toScreenY(depthZones[z] + blendMeters);
        const fadeGrad = ctx.createLinearGradient(0, fadeStartPx, 0, fadeEndPx);
        fadeGrad.addColorStop(0, 'rgba(0,0,0,1)');
        fadeGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalCompositeOperation = 'destination-in';
        ctx.fillStyle = fadeGrad;
        ctx.fillRect(0, fadeStartPx, width, fadeEndPx - fadeStartPx);
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.restore();
    }
    bgDrawn = true;
  }
  if (!bgDrawn) {
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
  }

  // 1b. Scattered ocean plants throughout the level
  const plantImg = sprites.oceanPlant;
  if (plantImg && plantImg.naturalWidth > 0) {
    const plantCount = 25;
    const plantAspect = plantImg.naturalHeight / plantImg.naturalWidth;
    for (let i = 0; i < plantCount; i++) {
      const seed = i * 6131;
      const h1 = Math.abs(Math.sin(seed) * 10000) % 1;
      const h2 = Math.abs(Math.sin(seed + 1) * 10000) % 1;
      const h3 = Math.abs(Math.sin(seed + 2) * 10000) % 1;
      const h4 = Math.abs(Math.sin(seed + 3) * 10000) % 1;
      const plantDepth = h1 * config.MAX_DEPTH;
      const plantX = wallWidth + h2 * (width - wallWidth * 2 - 120);
      const plantScale = 1.2 + h3 * 1.3;
      const plantW = 120 * plantScale;
      const plantH = plantW * plantAspect;
      const sy = toScreenY(plantDepth);
      if (sy < -plantH || sy > height + plantH) continue;
      ctx.save();
      ctx.globalAlpha = 0.6 + h4 * 0.35;
      ctx.drawImage(plantImg, plantX, sy, plantW, plantH);
      ctx.restore();
    }
  }

  // 1c. Scattered decorative background fish
  const bgFishSprites = sprites.bgFish;
  if (bgFishSprites[0] && bgFishSprites[0].naturalWidth > 0) {
    const fishCount = 18;
    for (let i = 0; i < fishCount; i++) {
      const seed = i * 4729 + 331;
      const h1 = Math.abs(Math.sin(seed) * 10000) % 1;
      const h2 = Math.abs(Math.sin(seed + 1) * 10000) % 1;
      const h3 = Math.abs(Math.sin(seed + 2) * 10000) % 1;
      const h4 = Math.abs(Math.sin(seed + 3) * 10000) % 1;
      const h5 = Math.abs(Math.sin(seed + 4) * 10000) % 1;
      const fishIdx = h1 < 0.7 ? 0 : 1;
      const fishImg = bgFishSprites[fishIdx];
      if (!fishImg || fishImg.naturalWidth === 0) continue;
      const fishAspect = fishImg.naturalHeight / fishImg.naturalWidth;
      const fishDepth = h2 * config.MAX_DEPTH;
      const fishX = wallWidth + h3 * (width - wallWidth * 2 - 80);
      const fishScale = 0.6 + h4 * 0.7;
      const fishW = 70 * fishScale;
      const fishH = fishW * fishAspect;
      const sy = toScreenY(fishDepth);
      if (sy < -fishH || sy > height + fishH) continue;
      ctx.save();
      ctx.globalAlpha = 0.6 + h5 * 0.35;
      if (h5 > 0.5) {
        ctx.translate(fishX + fishW, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(fishImg, 0, sy, fishW, fishH);
      } else {
        ctx.drawImage(fishImg, fishX, sy, fishW, fishH);
      }
      ctx.restore();
    }
  }

  // 2. Cliff walls on Left (RedStar) & Right (PurpleStar) — varied sizes
  const cliffL = sprites.cliffLeft;
  const cliffR = sprites.cliffRight;
  for (let side = 0; side < 2; side++) {
    const isLeft = side === 0;
    const img = isLeft ? cliffL : cliffR;
    if (img && img.naturalWidth > 0) {
      const aspectRatio = img.naturalHeight / img.naturalWidth;
      const sizes = [0.5, 0.35, 0.25];
      const spacingM = 8;
      const startIdx = Math.floor(topMeterInView / spacingM) - 1;
      const endIdx = Math.ceil((topMeterInView + 20) / spacingM) + 1;
      ctx.save();
      for (let t = startIdx; t <= endIdx; t++) {
        const seed = t * 7919 + (isLeft ? 0 : 3571);
        const hash1 = Math.abs(Math.sin(seed) * 10000) % 1;
        const hash2 = Math.abs(Math.sin(seed + 1) * 10000) % 1;
        const hash3 = Math.abs(Math.sin(seed + 2) * 10000) % 1;
        const sizeIdx = Math.floor(hash1 * 3);
        const drawW = width * sizes[sizeIdx];
        const drawH = drawW * aspectRatio;
        const meterPos = t * spacingM + (hash2 - 0.5) * spacingM * 0.5;
        const dy = toScreenY(meterPos);
        const xJitter = hash3 * wallWidth * 0.4;
        if (isLeft) {
          ctx.drawImage(img, -drawW * 0.1 + xJitter, dy, drawW, drawH);
        } else {
          ctx.drawImage(img, width - drawW + drawW * 0.1 - xJitter, dy, drawW, drawH);
        }
      }
      ctx.restore();
    } else {
      const startM = Math.floor(topMeterInView);
      const endM = Math.ceil(topMeterInView + 19);
      ctx.save();
      for (let m = startM; m <= endM; m++) {
        const sy1 = toScreenY(m);
        const sy2 = toScreenY(m + 1);
        const col = getOceanColorAtDepth(m);
        const rockR = Math.max(10, Math.floor(col.r * 0.4));
        const rockG = Math.max(15, Math.floor(col.g * 0.4));
        const rockB = Math.max(25, Math.floor(col.b * 0.5));
        ctx.fillStyle = `rgb(${rockR}, ${rockG}, ${rockB})`;
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

  // 4. Volumetric God Rays near the surface — soft, drifting light shafts that
  // widen and fade with depth. Additive blending gives them a hazy underwater glow
  // rather than the old flat, hard-edged slabs.
  if (topMeterInView < 24) {
    const surfaceFade = Math.max(0, (24 - topMeterInView) / 24);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const rays = [
      { x: 0.16, w: 0.05, drift: 16, speed: 0.00055, a: 0.11, slant: 0.10 },
      { x: 0.32, w: 0.11, drift: 26, speed: 0.00038, a: 0.06, slant: 0.14 },
      { x: 0.5, w: 0.045, drift: 13, speed: 0.0008, a: 0.12, slant: 0.08 },
      { x: 0.67, w: 0.09, drift: 22, speed: 0.00048, a: 0.07, slant: 0.13 },
      { x: 0.85, w: 0.055, drift: 15, speed: 0.0007, a: 0.10, slant: 0.09 },
    ];
    for (const ray of rays) {
      const shift = Math.sin(now * ray.speed + ray.x * 11) * ray.drift;
      const topX = width * ray.x + shift;
      const halfTop = width * ray.w * 0.5;
      const halfBot = halfTop * 1.9; // rays fan out as they sink
      const botX = topX + width * ray.slant; // gentle slant toward one side
      const peak = ray.a * surfaceFade;
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, `rgba(190, 235, 255, ${peak})`);
      grad.addColorStop(0.45, `rgba(150, 215, 255, ${peak * 0.45})`);
      grad.addColorStop(1, 'rgba(140, 210, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(topX - halfTop, 0);
      ctx.lineTo(topX + halfTop, 0);
      ctx.lineTo(botX + halfBot, height);
      ctx.lineTo(botX - halfBot, height);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // 4b. Depth vignette — darken the frame edges to focus the dive channel and add
  // a sense of pressure/depth. Sits beneath the collectibles, so gameplay elements
  // stay crisp on top.
  {
    const vig = ctx.createRadialGradient(
      width / 2,
      height * 0.42,
      height * 0.22,
      width / 2,
      height * 0.5,
      height * 0.9
    );
    const depthShade = Math.min(0.5, 0.28 + (topMeterInView / config.MAX_DEPTH) * 0.35);
    vig.addColorStop(0, 'rgba(2, 6, 23, 0)');
    vig.addColorStop(1, `rgba(2, 6, 23, ${depthShade})`);
    ctx.save();
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // 5. Expedition Ship & Whole Crew at Surface
  const surfaceScreenY = toScreenY(0);
  const shipSx = toScreenX(config.WORLD_WIDTH / 2);
  const distToSharkY = Math.abs(diver.y - shark.y);

  if (surfaceScreenY >= -180 && surfaceScreenY <= height + 100) {
    const curMaxAir = config.AIR_MAX + lungLvl * 25;
    drawVectorShipAndCrewCanvas(
      ctx,
      shipSx,
      surfaceScreenY,
      width,
      {
        y: diver.y,
        airRatio: diver.air / curMaxAir,
        carryingStone: diver.carryingStone,
        basketCount: diver.basket.length,
        isAscending: diver.isAscending,
      },
      distToSharkY < 12 ? distToSharkY : null,
      now
    );
  }

  // Water Surface Wave
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

  // 6. Ambient Water Particles (Mark Bowley Glossy Rising & Swaying Bubbles)
  ctx.save();
  const particleCount = 35;
  for (let i = 0; i < particleCount; i++) {
    // Continuous upward rising world Y coordinate with time
    const speedMultiplier = 0.8 + (i % 5) * 0.3;
    const pWorldY = 62 - (((now * 0.0018 * speedMultiplier + i * 2.1) % 64));
    if (pWorldY < topMeterInView - 2 || pWorldY > topMeterInView + 20) continue;

    const pSy = toScreenY(pWorldY);
    // Side-to-side horizontal sway math matching Mark Bowley's sway keyframe
    const sway = Math.sin(now * 0.003 + i * 1.7) * 22;
    const baseSx = ((i * 41) % (width - wallWidth * 2 - 40)) + wallWidth + 20;
    const pSx = baseSx + sway;

    const bubbleRadius = 3 + (i % 4) * 2.5;

    if (pWorldY < 28) {
      // Shallows: Mark Bowley Glossy Glass Bubble with Radial Highlight & Outer Rim
      const bGrad = ctx.createRadialGradient(
        pSx - bubbleRadius * 0.3,
        pSy - bubbleRadius * 0.3,
        bubbleRadius * 0.1,
        pSx,
        pSy,
        bubbleRadius
      );
      bGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      bGrad.addColorStop(0.35, 'rgba(186, 230, 253, 0.6)');
      bGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.25)');
      bGrad.addColorStop(1, 'rgba(255, 255, 255, 0.8)');

      ctx.fillStyle = bGrad;
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.85)';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.arc(pSx, pSy, bubbleRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Top-left Specular Glare Dot
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(
        pSx - bubbleRadius * 0.35,
        pSy - bubbleRadius * 0.35,
        bubbleRadius * 0.3,
        0,
        Math.PI * 2
      );
      ctx.fill();
    } else if (pWorldY < 45) {
      // Mid-depth Marine Bubbles
      ctx.fillStyle = 'rgba(186, 230, 253, 0.5)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(pSx, pSy, bubbleRadius * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      // Deep Bioluminescent Spores / Bubbles
      const pulse = 0.4 + Math.sin(now * 0.005 + i) * 0.4;
      ctx.fillStyle = i % 2 === 0 ? `rgba(56, 189, 248, ${pulse})` : `rgba(192, 132, 252, ${pulse})`;
      ctx.beginPath();
      ctx.arc(pSx, pSy, bubbleRadius * 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // 7. Seabed Floor — pinned at MAX_DEPTH (the camera clamp keeps it near the bottom)
  const seabedSy = toScreenY(config.MAX_DEPTH);
  if (seabedSy <= height + 40) {
    ctx.save();
    // Fill everything below the floor line to the bottom of the screen with dark water/rock.
    const sandGrad = ctx.createLinearGradient(0, seabedSy, 0, height);
    sandGrad.addColorStop(0, '#0b2233');
    sandGrad.addColorStop(1, '#020617');
    ctx.fillStyle = sandGrad;
    ctx.fillRect(0, seabedSy - 2, width, height - seabedSy + 4);

    const floorImg = sprites.seabedFloor;
    if (floorImg && floorImg.complete && floorImg.naturalWidth) {
      // Stretch the seabed art across the full width; anchor its sand line near seabedSy
      // with the coral/plants rising above it.
      const floorH = width * (floorImg.naturalHeight / floorImg.naturalWidth);
      ctx.drawImage(floorImg, 0, seabedSy - floorH * 0.55, width, floorH);
    } else {
      // Vector fallback: sandy ridge line.
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, seabedSy);
      for (let x = 0; x <= width; x += 15) {
        const ridge = Math.sin(x * 0.08) * 6 + Math.cos(x * 0.03) * 4;
        ctx.lineTo(x, seabedSy + ridge);
      }
      ctx.stroke();
    }

    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'rgba(2,6,23,0.85)';
    ctx.lineWidth = 3;
    const floorLabel = `⚓ OCEAN FLOOR (${config.MAX_DEPTH}M) ⚓`;
    ctx.strokeText(floorLabel, width / 2, seabedSy + 16);
    ctx.fillText(floorLabel, width / 2, seabedSy + 16);
    ctx.restore();
  }

  // 4. Draw Collectibles (Pearl Shells, Clownfish, Seahorses, Crabs, Eels, Octopuses)
  collectibles.forEach((item) => {
    if (item.isCollected) return;

    const sy = toScreenY(item.y);
    if (sy < -40 || sy > height + 40) return; // Culling

    const sx = toScreenX(item.x);

    ctx.save();
    let sizePx = 38;
    if (item.size === 'medium') sizePx = 50;
    else if (item.size === 'large') sizePx = 64;
    else if (item.size === 'giant') sizePx = 80;

    if (item.type === 'oyster') {
      if (!drawSprite(ctx, sprites.pearl, sx, sy, sizePx * 1.6, false, item.isEmpty ? 0.55 : 1)) {
        drawVectorPearlShellCanvas(ctx, sx, sy, sizePx, item.value, item.isEmpty);
      }
    } else if (item.type === 'fish') {
      const facingRight = item.swimDirection ? item.swimDirection > 0 : true;
      const variants = sprites.fishVariants;
      const vi = pickVariant(item.id, variants.length);
      // Flip only when the desired facing differs from the art's default facing.
      const flipX = facingRight !== FISH_FACES_RIGHT[vi];
      if (!drawSprite(ctx, variants[vi], sx, sy, sizePx * 1.7, flipX)) {
        drawVectorClownfishCanvas(ctx, sx, sy, sizePx, facingRight);
      }
    } else if (item.type === 'seahorse') {
      drawVectorSeahorseCanvas(ctx, sx, sy, sizePx);
    } else if (item.type === 'crab') {
      if (!drawSprite(ctx, sprites.crab, sx, sy, sizePx * 1.6, false)) {
        drawVectorCrabCanvas(ctx, sx, sy, sizePx);
      }
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

    // Subtle Red Threat Proximity Aura
    ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
    ctx.beginPath();
    ctx.arc(0, 0, config.SHARK_RADIUS * metersToPx, 0, Math.PI * 2);
    ctx.fill();

    // Animated shark GIF (already translated to shark center & flipped for direction).
    // The gif faces right by default, matching the vector fallback's snout at +x.
    const sharkImg = sprites.shark;
    const sharkDrawn =
      !!sharkImg && sharkImg.complete && !!sharkImg.naturalWidth;
    if (sharkDrawn) {
      const box = 92;
      const scale = box / Math.max(sharkImg!.naturalWidth, sharkImg!.naturalHeight);
      const sw = sharkImg!.naturalWidth * scale;
      const sh = sharkImg!.naturalHeight * scale;
      ctx.drawImage(sharkImg!, -sw / 2, -sh / 2, sw, sh);
    }

    // Shark Counter-Shaded Torpedo Body (Slate Blue Top, Pale Silver Underbelly)
    // — vector fallback, only drawn until the GIF is ready.
    if (!sharkDrawn) {
    ctx.save();
    const sharkGrad = ctx.createLinearGradient(0, -18, 0, 18);
    sharkGrad.addColorStop(0, '#1e293b');
    sharkGrad.addColorStop(0.4, '#334155');
    sharkGrad.addColorStop(0.7, '#64748b');
    sharkGrad.addColorStop(1, '#f1f5f9');

    ctx.fillStyle = sharkGrad;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.2;

    ctx.beginPath();
    ctx.moveTo(34, 0); // Snout
    ctx.quadraticCurveTo(15, -16, -10, -12);
    ctx.quadraticCurveTo(-28, -6, -34, 0); // Tail base
    ctx.quadraticCurveTo(-20, 14, 10, 12);
    ctx.quadraticCurveTo(24, 10, 34, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Main Dorsal Fin
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(2, -12);
    ctx.quadraticCurveTo(8, -28, 16, -26);
    ctx.quadraticCurveTo(18, -10, 22, -8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Pectoral Fin
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(10, 4);
    ctx.lineTo(2, 22);
    ctx.lineTo(18, 10);
    ctx.closePath();
    ctx.fill();

    // Crescent Caudal Tail Fin
    const tailSway = Math.sin(now * 0.008) * 4;
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(-32, 0);
    ctx.lineTo(-48, -20 + tailSway);
    ctx.lineTo(-38, 0 + tailSway);
    ctx.lineTo(-48, 20 + tailSway);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Gill Slits
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    [10, 14, 18].forEach((gx) => {
      ctx.beginPath();
      ctx.moveTo(gx, -4);
      ctx.lineTo(gx - 1, 4);
      ctx.stroke();
    });

    // Menacing Predatory Eye
    ctx.fillStyle = '#0f172a';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(22, -4, 2.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    } // end vector-shark fallback
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

  // Rope connecting to ship winch at surface
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
  ctx.moveTo(shipSx, surfaceScreenY - 24); // Anchor to ship winch
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
