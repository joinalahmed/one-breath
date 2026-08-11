import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayerStats, UpgradesState, BotDiver, DailyChallenge } from '../types';
import { simulateBotActivity } from '../bots';
import { soundManager } from '../audioAndHaptics';
import { getPlayerRank, getNextRank, DiverRankInfo } from '../ranks';
import { RankUpModal } from './AnimatedOverlayEffects';
import { HavenVillageScreen } from './HavenVillageScreen';
import { MapScreen } from './MapScreen';
import { PearlCoastHomeScreen } from './PearlCoastHomeScreen';
import { BubbleOverlay } from './BubbleOverlay';
import { UpgradeImpactInfo } from './UpgradeImpactInfo';
import { TopHud } from './TopHud';
import { BottomNav } from './BottomNav';

interface SurfaceScreenProps {
  stats: PlayerStats;
  bots: BotDiver[];
  dailyChallenges?: DailyChallenge[];
  onClaimChallengeReward?: (challengeId: string) => void;
  lastDiveResult: {
    outcome: 'surfaced' | 'shark' | 'drowned';
    maxDepth: number;
    coinsEarned: number;
    foodEarned: number;
    stoneCutAtDepth: number | null;
  } | null;
  onStartDive: () => void;
  onBuyUpgrade: (type: keyof UpgradesState, cost: number) => void;
  onTradeFishForPearls?: (fishCost: number, pearlsEarned: number) => void;
  onAddPearls?: (amount: number) => void;
  onOpenTelemetryModal: () => void;
  onOpenDebug: () => void;
  onOpenPhotoLibrary?: () => void;
  photoLibraryCount?: number;
}

const CAMPFIRE_TIPS = [
  { avatar: '👳‍♂️', name: 'Captain Maryam', text: 'The current at 30 meters pushes west. Watch out for patrolling reef sharks near deep trenches!' },
  { avatar: '🤿', name: 'Diver Rashid', text: 'Press X (or tap Cut Stone) when deep! Dropping your weight stone saves precious seconds ascending.' },
  { avatar: '🐚', name: 'Merchant Leila', text: 'Bring fresh fish back to the village daily to earn bonus pearl stipends and reputation.' },
  { avatar: '🦈', name: 'Elder Farhan', text: 'Sharks circle in fixed depth zones. Time your movement when they swim away!' }
];

export const SurfaceScreen: React.FC<SurfaceScreenProps> = ({
  stats,
  bots,
  dailyChallenges = [],
  onClaimChallengeReward,
  lastDiveResult,
  onStartDive,
  onBuyUpgrade,
  onTradeFishForPearls,
  onAddPearls,
  onOpenTelemetryModal,
  onOpenDebug,
  onOpenPhotoLibrary,
  photoLibraryCount = 0,
}) => {
  const [activeScreen, setActiveScreen] = useState<'pearlcoast' | 'home' | 'haven' | 'shop' | 'leaderboard'>('pearlcoast');
  const [currentBots] = useState<BotDiver[]>(() => simulateBotActivity(bots));
  const [isMuted, setIsMuted] = useState(() => soundManager.getMuted());
  const [showSettings, setShowSettings] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [hoveredUpgrade, setHoveredUpgrade] = useState<string | null>(null);

  useEffect(() => {
    const startAudio = () => {
      soundManager.enableAudio();
      document.removeEventListener('click', startAudio);
      document.removeEventListener('touchstart', startAudio);
    };
    document.addEventListener('click', startAudio);
    document.addEventListener('touchstart', startAudio);
    return () => {
      document.removeEventListener('click', startAudio);
      document.removeEventListener('touchstart', startAudio);
    };
  }, []);

  useEffect(() => {
    if (activeScreen === 'haven') {
      soundManager.stopMapMusic();
      soundManager.startBgMusic();
    } else if (activeScreen === 'home') {
      soundManager.stopBgMusic();
      soundManager.startMapMusic();
    } else {
      soundManager.stopBgMusic();
      soundManager.stopMapMusic();
    }
    return () => {
      soundManager.stopBgMusic();
      soundManager.stopMapMusic();
    };
  }, [activeScreen]);

  // PWA Installation State
  const [pwaPrompt, setPwaPrompt] = useState<any>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState<boolean>(() => {
    return window.matchMedia('(display-mode: standalone)').matches;
  });

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPwaPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsPwaInstalled(true);
      setPwaPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallPWA = () => {
    if (pwaPrompt) {
      pwaPrompt.prompt();
      pwaPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setIsPwaInstalled(true);
        }
        setPwaPrompt(null);
      });
    } else {
      alert('To install One Breath as a PWA:\n\n• On iOS (Safari): Tap Share ➔ "Add to Home Screen"\n• On Android (Chrome): Tap ⋮ Menu ➔ "Install app" or "Add to Home screen"');
    }
  };

  // Rank & Animation State
  const currentRank = getPlayerRank(stats.bestDepth, stats.coins);
  const nextRank = getNextRank(currentRank.level);
  const [unlockedRankModal, setUnlockedRankModal] = useState<DiverRankInfo | null>(null);

  const prevRankLevelRef = useRef(currentRank.level);

  useEffect(() => {
    if (currentRank.level > prevRankLevelRef.current) {
      setUnlockedRankModal(currentRank);
      prevRankLevelRef.current = currentRank.level;
    }
  }, [currentRank]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'Enter')) {
        if (activeScreen === 'pearlcoast' || activeScreen === 'home' || activeScreen === 'haven') {
          e.preventDefault();
          onStartDive();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartDive, activeScreen]);

  const totalUpgradeLevels = Object.values(stats.upgrades).reduce(
    (acc: number, curr: any) => acc + (typeof curr === 'number' ? curr : curr ? 1 : 0),
    0
  );
  const ownedCount = Object.values(stats.upgrades).filter((val) =>
    typeof val === 'number' ? val > 0 : Boolean(val)
  ).length;
  const currentTip = CAMPFIRE_TIPS[tipIndex % CAMPFIRE_TIPS.length];

  // Helper cost calculator
  const getNextUpgradeCost = (baseCost: number, level: number) => {
    return Math.round(baseCost * Math.pow(1.4, level));
  };

  // List of 12 stackable upgrades
  const UPGRADE_ITEMS: Array<{
    key: keyof UpgradesState;
    baseCost: number;
    maxLevel: number;
    icon: string;
    bg: string;
    title: string;
    getDesc: (level: number) => { current: string; next: string };
  }> = [
    {
      key: 'lungTraining',
      baseCost: 120,
      maxLevel: 10,
      icon: '🫁',
      bg: 'bg-sky-950/80 border-sky-500/40',
      title: 'Deep Lung Capacity',
      getDesc: (lvl) => ({
        current: `${100 + lvl * 25} Air`,
        next: `${100 + (lvl + 1) * 25} Air`,
      }),
    },
    {
      key: 'largerBasket',
      baseCost: 150,
      maxLevel: 6,
      icon: '🧺',
      bg: 'bg-emerald-950/80 border-emerald-500/40',
      title: 'Expanded Mesh Basket',
      getDesc: (lvl) => ({
        current: `${6 + lvl * 2} Slots`,
        next: `${6 + (lvl + 1) * 2} Slots`,
      }),
    },
    {
      key: 'fastFins',
      baseCost: 160,
      maxLevel: 5,
      icon: '🪸',
      bg: 'bg-teal-950/80 border-teal-500/40',
      title: 'Hydrodynamic Fins',
      getDesc: (lvl) => ({
        current: `+${lvl * 20}% Speed`,
        next: `+${(lvl + 1) * 20}% Speed`,
      }),
    },
    {
      key: 'heavierStone',
      baseCost: 100,
      maxLevel: 5,
      icon: '🪨',
      bg: 'bg-amber-950/80 border-amber-500/40',
      title: 'Heavier Stone Weight',
      getDesc: (lvl) => ({
        current: `${(6.5 + lvl * 1.2).toFixed(1)} m/s`,
        next: `${(6.5 + (lvl + 1) * 1.2).toFixed(1)} m/s`,
      }),
    },
    {
      key: 'betterRope',
      baseCost: 180,
      maxLevel: 5,
      icon: '🪢',
      bg: 'bg-cyan-950/80 border-cyan-500/40',
      title: 'Braided Hemp Rope',
      getDesc: (lvl) => ({
        current: `+${lvl * 20}% Ascent`,
        next: `+${(lvl + 1) * 20}% Ascent`,
      }),
    },
    {
      key: 'pearlGoggles',
      baseCost: 200,
      maxLevel: 5,
      icon: '🥽',
      bg: 'bg-indigo-950/80 border-indigo-500/40',
      title: 'Polished Pearl Goggles',
      getDesc: (lvl) => ({
        current: `+${lvl * 15}% Pearls`,
        next: `+${(lvl + 1) * 15}% Pearls`,
      }),
    },
    {
      key: 'sharkRepellent',
      baseCost: 250,
      maxLevel: 4,
      icon: '🦈',
      bg: 'bg-rose-950/80 border-rose-500/40',
      title: 'Shark Repellent Spray',
      getDesc: (lvl) => ({
        current: `-${lvl * 15}% Danger`,
        next: `-${(lvl + 1) * 15}% Danger`,
      }),
    },
    {
      key: 'moraySuit',
      baseCost: 220,
      maxLevel: 4,
      icon: '⚡',
      bg: 'bg-yellow-950/80 border-yellow-500/40',
      title: 'Insulated Moray Wetsuit',
      getDesc: (lvl) => ({
        current: lvl === 0 ? 'No Shield' : `Lvl ${lvl} Shock Shield`,
        next: `Lvl ${lvl + 1} Shock Shield`,
      }),
    },
    {
      key: 'seahorseCharm',
      baseCost: 300,
      maxLevel: 5,
      icon: '🐴',
      bg: 'bg-lime-950/80 border-lime-500/40',
      title: 'Seahorse Luck Charm',
      getDesc: (lvl) => ({
        current: `+${lvl * 20}% Luck`,
        next: `+${(lvl + 1) * 20}% Luck`,
      }),
    },
    {
      key: 'octopusNet',
      baseCost: 240,
      maxLevel: 5,
      icon: '🐙',
      bg: 'bg-pink-950/80 border-pink-500/40',
      title: 'Octopus Harpoon Net',
      getDesc: (lvl) => ({
        current: `+${lvl * 20}% Catch`,
        next: `+${(lvl + 1) * 20}% Catch`,
      }),
    },
    {
      key: 'sonarRadar',
      baseCost: 350,
      maxLevel: 5,
      icon: '📡',
      bg: 'bg-purple-950/80 border-purple-500/40',
      title: 'Shark Sonar Radar',
      getDesc: (lvl) => ({
        current: lvl === 0 ? 'Off' : `${6 + lvl * 3}m Range`,
        next: `${6 + (lvl + 1) * 3}m Range`,
      }),
    },
    {
      key: 'bioluminescentLamp',
      baseCost: 280,
      maxLevel: 5,
      icon: '💡',
      bg: 'bg-cyan-950/80 border-cyan-500/40',
      title: 'Abyssal Lantern',
      getDesc: (lvl) => ({
        current: lvl === 0 ? 'Off' : `+${lvl * 40}px Glow`,
        next: `+${(lvl + 1) * 40}px Glow`,
      }),
    },
  ];

  const isPearl = activeScreen === 'pearlcoast';

  return (
    <div
      className={`relative w-full h-full max-w-lg mx-auto bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden select-none no-scrollbar ${
        isPearl ? '' : 'p-3 sm:p-4'
      }`}
      style={
        isPearl
          ? undefined
          : {
              paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
              paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
            }
      }
    >
      {/* Dynamic Background Atmosphere */}
      {isPearl ? null : activeScreen === 'haven' ? (
        <img
          src="/assets/middle_eastern_fishing_village_actual_walking.gif"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
          style={{ imageRendering: 'pixelated' }}
          draggable={false}
        />
      ) : activeScreen === 'home' ? (
        <img
          src="/assets/map_theme_animation_clean_3s_loop.gif"
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-sky-950 via-slate-950 to-slate-950 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-44 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.2),transparent_75%)] pointer-events-none" />
          <BubbleOverlay count={15} />
        </>
      )}
      {/* Dim overlay for readability on haven */}
      {activeScreen === 'haven' && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />
      )}

      {/* TOP HUD — no container box; icon controls + counters float over the
          screen background. Rendered on every hub screen (z-40 so it floats above
          the Pearl Coast landing overlay at z-30); never shown during a dive. */}
      <div className="relative z-40 w-full px-2 pt-[max(0.5rem,env(safe-area-inset-top))] mb-2 flex items-center gap-2">
        {/* Single line: home (back to the Pearl Coast landing) · HUD counters ·
            settings (audio lives inside the settings menu). The home button is
            hidden on the home screen itself; the level ring shows only there. */}
          {!isPearl && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveScreen('pearlcoast')}
            aria-label="Home"
            title="Home"
            className="w-9 h-9 shrink-0 cursor-pointer focus:outline-none"
          >
            <img
              src="/assets/pearl-coast-clean-buttons-v2/home-removebg-preview.png"
              alt="Home"
              draggable={false}
              className="w-full h-full object-contain pointer-events-none"
              style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))' }}
            />
          </motion.button>
          )}

          {/* HUD counters — fill the space between the home and settings icons. */}
          <TopHud stats={stats} height={28} showLevel={isPearl} className="flex-1 min-w-0" />

          {/* Settings (audio, install, records) */}
          <div className="relative shrink-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowSettings((v) => !v)}
              aria-label="Settings"
              title="Settings"
              className="w-9 h-9 cursor-pointer focus:outline-none"
            >
              <img
                src="/assets/pearl-coast-clean-buttons-v2/setting-removebg-preview.png"
                alt="Settings"
                draggable={false}
                className="w-full h-full object-contain pointer-events-none"
                style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))' }}
              />
            </motion.button>

            <AnimatePresence>
              {showSettings && (
                <>
                  {/* Click-away backdrop */}
                  <div className="fixed inset-0 z-30" onClick={() => setShowSettings(false)} />

                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 z-40 rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-900"
                  >
                    <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
                      Settings
                    </div>

                    {/* Audio Mute — toggles in place, keeps the menu open */}
                    <button
                      onClick={() => {
                        const nextMuted = !isMuted;
                        soundManager.setMuted(nextMuted);
                        setIsMuted(nextMuted);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <span className="text-sm">{isMuted ? '🔇' : '🔊'}</span>
                      <span>{isMuted ? 'Sound Off' : 'Sound On'}</span>
                    </button>

                    {/* Install App */}
                    <button
                      onClick={() => {
                        handleInstallPWA();
                        setShowSettings(false);
                      }}
                      disabled={isPwaInstalled}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors border-t border-slate-800 disabled:opacity-60 disabled:cursor-default cursor-pointer"
                    >
                      <span className="text-sm">📱</span>
                      <span>{isPwaInstalled ? 'App Installed ✓' : 'Install App'}</span>
                    </button>

                    {/* Records & Telemetry */}
                    <button
                      onClick={() => {
                        onOpenTelemetryModal();
                        setShowSettings(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors border-t border-slate-800 cursor-pointer"
                    >
                      <span className="text-sm">📊</span>
                      <span>Records &amp; Data</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
      </div>

      {/* PEARL COAST HOME — full-screen landing overlay with its own self-contained
          chrome (title, currency chips, START DIVE, bottom nav). Mounted/unmounted
          directly (no AnimatePresence exit) so it never lingers as an invisible
          click-blocking layer over the sub-screens. */}
      {isPearl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 z-30"
        >
          <PearlCoastHomeScreen
            stats={stats}
            onStartDive={onStartDive}
          />
        </motion.div>
      )}

      {/* DYNAMIC SCREEN CONTENT — fully unmounted on the Pearl Coast landing so the
          sub-screens never linger under the overlay. */}
      {!isPearl && (
      <div className={`relative z-10 flex-1 ${activeScreen === 'haven' || activeScreen === 'home' ? '' : 'overflow-y-auto'} no-scrollbar`}>
        <AnimatePresence mode="wait">
          {/* 0. MAP SCREEN */}
          {activeScreen === 'home' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <MapScreen
                stats={stats}
                lastDiveResult={lastDiveResult}
                onSelectBank={(bankId) => {
                  console.log('Selected bank:', bankId);
                  onStartDive();
                }}
                onGoToVillage={() => setActiveScreen('haven')}
              />
            </motion.div>
          )}

          {/* 1. HAVEN VILLAGE SCREEN */}
          {activeScreen === 'haven' && (
            <motion.div
              key="haven"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <HavenVillageScreen
                stats={stats}
                currentRank={currentRank}
                nextRank={nextRank}
                dailyChallenges={dailyChallenges}
                currentTip={currentTip}
                lastDiveResult={lastDiveResult}
                onClaimChallengeReward={onClaimChallengeReward}
                onTradeFishForPearls={onTradeFishForPearls}
                onAddPearls={onAddPearls}
                onNextTip={() => setTipIndex((prev) => prev + 1)}
                onOpenDebug={onOpenDebug}
                onStartDive={onStartDive}
              />
            </motion.div>
          )}

          {/* 2. SHOP DEDICATED SCREEN */}
          {activeScreen === 'shop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 no-scrollbar pb-4"
            >
              {/* STORE HEADER — HUD/balance now lives in the shared top bar. */}
              <div className="px-1">
                <h2 className="text-xl font-black text-amber-300 uppercase tracking-wide">Store</h2>
                <p className="text-[11px] text-slate-400">Upgrade your gear &amp; trade your catch</p>
              </div>

              {/* TRADE FISH */}
              <div className="space-y-2">
                <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-wider px-1 flex items-center gap-1.5">
                  <span className="text-emerald-400">⇄</span> Trade Fish for Pearls
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { f: 1, p: 15 },
                    { f: 3, p: 50 },
                  ].map((t) => {
                    const affordable = stats.food >= t.f;
                    return (
                      <button
                        key={t.f}
                        disabled={!affordable}
                        onClick={() => onTradeFishForPearls?.(t.f, t.p)}
                        className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                          affordable
                            ? 'scopely-card border-emerald-500/40 hover:border-emerald-400/70 active:scale-95 cursor-pointer'
                            : 'bg-slate-950/60 border-slate-800 opacity-60'
                        }`}
                      >
                        <div className="text-left">
                          <span className="text-xs font-black text-emerald-300 block">{t.f} Fish 🐟</span>
                          <span className="text-[10px] text-amber-300 font-mono font-bold">+{t.p} 💎</span>
                        </div>
                        <span className="text-lg text-amber-400">⇄</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PEARL PACKS */}
              <div className="space-y-2">
                <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-wider px-1 flex items-center gap-1.5">
                  <span>💎</span> Pearl Packs
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { amt: 50, label: 'Stipend', cls: 'btn-scopely-blue', text: 'text-white' },
                    { amt: 150, label: 'Bounty', cls: 'btn-scopely-gold', text: 'text-slate-950' },
                    { amt: 500, label: 'Grant', cls: 'btn-scopely-purple', text: 'text-white' },
                  ].map((pack) => (
                    <button
                      key={pack.amt}
                      onClick={() => onAddPearls?.(pack.amt)}
                      className={`${pack.cls} py-2.5 rounded-2xl text-center active:scale-95 transition-all cursor-pointer`}
                    >
                      <span className={`text-sm ${pack.text} font-black block font-mono`}>+{pack.amt}</span>
                      <span className={`text-[9px] ${pack.text} font-bold block uppercase opacity-80`}>{pack.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* DIVER GEAR & GAMEPLAY UPGRADES (STACKABLE MULTIPLE LEVELS) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🛡️</span> Diver Gear
                  </h3>
                  <span className="text-amber-300 font-mono text-[10px] font-bold bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                    {totalUpgradeLevels} LVLS
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {UPGRADE_ITEMS.map((item, idx) => {
                    const rawLvl = stats.upgrades[item.key];
                    const currentLevel = typeof rawLvl === 'number' ? rawLvl : rawLvl ? 1 : 0;
                    const isMax = currentLevel >= item.maxLevel;
                    const nextCost = getNextUpgradeCost(item.baseCost, currentLevel);
                    const canAfford = stats.coins >= nextCost && !isMax;
                    const desc = item.getDesc(currentLevel);

                    return (
                      <motion.div
                        key={item.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02, duration: 0.2 }}
                        onMouseEnter={() => setHoveredUpgrade(item.key)}
                        onMouseLeave={() => setHoveredUpgrade(null)}
                        className={`scopely-card border p-3 rounded-2xl transition-all ${
                          currentLevel > 0 ? 'border-amber-500/40' : 'border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-11 h-11 rounded-xl border flex items-center justify-center text-2xl shrink-0 ${item.bg}`}>
                            {item.icon}
                          </span>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-[13px] font-bold text-slate-100 leading-tight">{item.title}</h4>
                              <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/40 shrink-0">
                                {currentLevel}/{item.maxLevel}
                              </span>
                            </div>

                            {/* Level progress */}
                            <div className="mt-1.5 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all"
                                style={{ width: `${(currentLevel / item.maxLevel) * 100}%` }}
                              />
                            </div>

                            <p className="text-[10px] text-slate-300 mt-1 font-mono">
                              {isMax ? (
                                <span className="text-emerald-400 font-bold">Maxed · {desc.current}</span>
                              ) : (
                                <span>
                                  {desc.current} <span className="text-slate-500">➔</span>{' '}
                                  <strong className="text-emerald-400">{desc.next}</strong>
                                </span>
                              )}
                            </p>
                          </div>

                          <motion.button
                            whileTap={{ scale: 0.92 }}
                            disabled={isMax || !canAfford}
                            onClick={() => onBuyUpgrade(item.key, nextCost)}
                            className={`self-center px-3 py-2 rounded-xl text-xs font-black transition-all font-mono shrink-0 whitespace-nowrap ${
                              isMax
                                ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                                : canAfford
                                ? 'btn-scopely-gold text-slate-950 cursor-pointer'
                                : 'bg-slate-800/80 text-slate-500 border border-slate-700'
                            }`}
                          >
                            {isMax ? 'MAX' : `${nextCost} 💎`}
                          </motion.button>
                        </div>

                        {/* Show impact info when hovered */}
                        {hoveredUpgrade === item.key && (
                          <UpgradeImpactInfo
                            upgradeKey={item.key}
                            currentLevel={currentLevel}
                            maxLevel={item.maxLevel}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. LEADERBOARD DEDICATED SCREEN */}
          {activeScreen === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 no-scrollbar pb-4"
            >
              <div className="flex justify-between items-center px-1">
                <div>
                  <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">
                    ⛵ PEARL COAST LEADERBOARD
                  </h3>
                  <p className="text-[10px] text-slate-400">Live rankings of active village freedivers</p>
                </div>
                <span className="text-cyan-300 font-mono text-[10px] font-bold bg-cyan-950/80 px-2 py-1 rounded-lg border border-cyan-500/40">
                  20 ACTIVE DIVERS
                </span>
              </div>

              <div className="scopely-card border border-slate-800 rounded-2xl p-2 divide-y divide-slate-800/80 shadow-xl no-scrollbar">
                {/* Player Standing Highlight */}
                <div className="p-3 bg-gradient-to-r from-sky-900/90 to-slate-900 rounded-xl flex justify-between items-center text-xs my-1 border border-cyan-400 shadow-md">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-amber-300 font-black text-sm">👑 #1</span>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-black text-cyan-300 uppercase text-xs">YOU (Master Diver)</span>
                        <span className="text-[9px] bg-amber-400 text-slate-950 px-1 rounded font-bold font-mono">
                          L{currentRank.level}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-300 block font-mono">
                        Best Depth: {stats.bestDepth}m | Streak: {stats.streak}x
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-amber-300 font-mono text-sm block">{stats.coins} 💎</span>
                    <span className="text-[9px] text-emerald-400 font-bold uppercase">Active Diver</span>
                  </div>
                </div>

                {/* Competitor List */}
                {currentBots.map((bot, index) => (
                  <div key={bot.id} className="p-2.5 flex justify-between items-center text-xs hover:bg-slate-900/60 transition-colors rounded-lg">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-slate-400 text-xs font-mono font-bold w-6">#{index + 2}</span>
                      <span
                        className="w-3 h-3 rounded-full border border-slate-700 shadow-sm"
                        style={{ backgroundColor: bot.avatarColor }}
                      />
                      <div>
                        <span className="font-bold text-slate-200 text-xs">{bot.name}</span>
                        <span className="text-[10px] text-slate-400 block font-medium">{bot.role}</span>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-slate-300 text-xs block">{bot.totalCoins} 💎</span>
                      <span className="text-[9px] text-slate-400 block font-sans">{bot.currentStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      )}


      {/* OVERLAY ANIMATION MODALS */}
      <AnimatePresence>
        {unlockedRankModal && (
          <RankUpModal
            rank={unlockedRankModal}
            onClose={() => setUnlockedRankModal(null)}
          />
        )}
      </AnimatePresence>

      {/* BOTTOM NAVIGATION BAR — shared Pearl Coast button assets. Rendered on every
          hub screen (including the Pearl Coast landing) at z-40 so it floats above
          the landing overlay (z-30). Never appears during a dive, which is a
          separate app phase outside this surface hub. */}
      <BottomNav
        activeScreen={activeScreen}
        onNavigate={(screen) => setActiveScreen(screen)}
        onOpenPhotos={() => onOpenPhotoLibrary?.()}
        ownedCount={ownedCount}
        photoCount={photoLibraryCount}
      />
    </div>
  );
};
