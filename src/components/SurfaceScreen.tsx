import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayerStats, UpgradesState, BotDiver, DailyChallenge } from '../types';
import { simulateBotActivity } from '../bots';
import { soundManager } from '../audioAndHaptics';
import { getPlayerRank, getNextRank, DiverRankInfo } from '../ranks';
import { RankUpModal, StreakComboBanner, DefeatModal } from './AnimatedOverlayEffects';
import { HavenVillageScreen } from './HavenVillageScreen';
import { MapScreen } from './MapScreen';
import { BubbleOverlay } from './BubbleOverlay';
import { DiveResultsSummary } from './DiveResultsSummary';
import { UpgradeImpactInfo } from './UpgradeImpactInfo';

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
}) => {
  const [activeScreen, setActiveScreen] = useState<'home' | 'haven' | 'shop' | 'leaderboard'>('home');
  const [currentBots] = useState<BotDiver[]>(() => simulateBotActivity(bots));
  const [isMuted, setIsMuted] = useState(() => soundManager.getMuted());
  const [tipIndex, setTipIndex] = useState(0);
  const [hoveredUpgrade, setHoveredUpgrade] = useState<string | null>(null);

  useEffect(() => {
    const startMusic = () => {
      soundManager.startBgMusic();
      document.removeEventListener('click', startMusic);
      document.removeEventListener('touchstart', startMusic);
    };
    document.addEventListener('click', startMusic);
    document.addEventListener('touchstart', startMusic);
    return () => {
      document.removeEventListener('click', startMusic);
      document.removeEventListener('touchstart', startMusic);
    };
  }, []);

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
  const [showDefeatModal, setShowDefeatModal] = useState(false);
  const prevDiveResultRef = useRef<typeof lastDiveResult>(null);

  // Only show defeat modal ONCE when dive result changes to a failed outcome
  useEffect(() => {
    if (lastDiveResult && lastDiveResult !== prevDiveResultRef.current) {
      prevDiveResultRef.current = lastDiveResult;

      if (lastDiveResult.outcome !== 'surfaced') {
        setShowDefeatModal(true);
      } else {
        setShowDefeatModal(false);
      }
    }
  }, [lastDiveResult]);

  useEffect(() => {
    if (currentRank.level > prevRankLevelRef.current) {
      setUnlockedRankModal(currentRank);
      prevRankLevelRef.current = currentRank.level;
    }
  }, [currentRank]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'Enter')) {
        if (activeScreen === 'home') {
          e.preventDefault();
          onStartDive();
        } else if (activeScreen === 'haven') {
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

  return (
    <>
      {/* FLOATING SIDE BUTTONS */}
      {/* LEFT: LEADERBOARD */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed left-2 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2"
      >
        <motion.button
          whileHover={{ scale: 1.15, x: -6 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveScreen('leaderboard')}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg relative"
          style={{
            background: activeScreen === 'leaderboard'
              ? 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)'
              : 'linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%)',
            boxShadow: activeScreen === 'leaderboard'
              ? '0 8px 24px rgba(168, 85, 247, 0.6), inset 0 1px 0 rgba(255,255,255,0.2)'
              : '0 6px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
            border: `2px solid ${activeScreen === 'leaderboard' ? 'rgba(255,255,255,0.4)' : 'rgba(139,92,246,0.3)'}`,
          }}
          title="Leaderboard"
        >
          <span className="text-2xl">⛵</span>
        </motion.button>
        <span className="text-[9px] font-black text-purple-300 uppercase tracking-wider hidden group-hover:block">BOARD</span>
      </motion.div>

      {/* RIGHT: SHOP */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed right-2 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2"
      >
        <motion.button
          whileHover={{ scale: 1.15, x: 6 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveScreen('shop')}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg relative"
          style={{
            background: activeScreen === 'shop'
              ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
              : 'linear-gradient(135deg, #b45309 0%, #92400e 100%)',
            boxShadow: activeScreen === 'shop'
              ? '0 8px 24px rgba(251, 191, 36, 0.6), inset 0 1px 0 rgba(255,255,255,0.2)'
              : '0 6px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
            border: `2px solid ${activeScreen === 'shop' ? 'rgba(255,255,255,0.4)' : 'rgba(217,119,6,0.3)'}`,
          }}
          title="Shop"
        >
          <span className="text-2xl">⚓</span>
          {ownedCount < 12 && (
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-amber-300 to-amber-500 text-slate-950 text-[11px] font-black rounded-full flex items-center justify-center shadow-lg border border-amber-200"
            >
              {ownedCount}
            </motion.span>
          )}
        </motion.button>
        <span className="text-[9px] font-black text-amber-300 uppercase tracking-wider hidden group-hover:block">SHOP</span>
      </motion.div>

      <div className="relative w-full h-full max-w-lg mx-auto bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden select-none p-3 sm:p-4 no-scrollbar">
      {/* Dynamic Background Atmosphere */}
      {activeScreen === 'haven' ? (
        <img
          src="/assets/middle_eastern_fishing_village_actual_walking.gif"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
          style={{ imageRendering: 'pixelated' }}
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

      {/* TOP COMPACT HUD BAR */}
      <div className="relative z-10 w-full flex justify-between items-center bg-slate-900/80 border border-slate-800/60 p-2 rounded-2xl shadow-xl backdrop-blur-md mb-2">
        {/* Back Button - Show when not on map */}
        {activeScreen !== 'home' && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveScreen('home')}
            className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 flex items-center justify-center text-sm text-slate-200 transition-all cursor-pointer shadow mr-1"
            title="Back to Map"
          >
            ←
          </motion.button>
        )}

        {/* Level Badge */}
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center font-black text-slate-950 text-xs font-mono">
            LVL {Math.min(100, stats.totalDives + 1)}
          </div>
          <div>
            <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider block">
              DAY {stats.totalDives + 1}
            </span>
            <div className="w-16 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                style={{ width: `${Math.min(100, ((stats.totalDives % 5) + 1) * 20)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Currency Vault & Control Icons */}
        <div className="flex items-center space-x-1.5">
          {/* Pearls */}
          <div className="bg-slate-950 border border-amber-500/60 px-2 py-1 rounded-xl flex items-center space-x-1 shadow-inner">
            <span className="text-amber-400 text-xs">💎</span>
            <span className="text-xs font-black text-amber-300 font-mono">{stats.coins}</span>
            <button
              onClick={() => setActiveScreen('shop')}
              className="w-4 h-4 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black cursor-pointer ml-0.5"
              title="Get Pearls"
            >
              +
            </button>
          </div>

          {/* Fish */}
          <div className="bg-slate-950 border border-emerald-500/60 px-2 py-1 rounded-xl flex items-center space-x-1 shadow-inner">
            <span className="text-emerald-400 text-xs">🐟</span>
            <span className="text-xs font-black text-emerald-300 font-mono">{stats.food}</span>
          </div>

          {/* Audio Mute */}
          <button
            onClick={() => {
              const nextMuted = !isMuted;
              soundManager.setMuted(nextMuted);
              setIsMuted(nextMuted);
            }}
            className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-200 active:scale-95 transition-all cursor-pointer shadow"
            title="Toggle Audio"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          {/* Settings / Telemetry */}
          <button
            onClick={onOpenTelemetryModal}
            className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-200 active:scale-95 transition-all cursor-pointer shadow"
            title="Settings & Telemetry"
          >
            ⚙️
          </button>

          {/* PWA Install Button */}
          <button
            onClick={handleInstallPWA}
            className={`h-7 px-2 rounded-lg text-[10px] font-black font-mono border flex items-center space-x-1 active:scale-95 transition-all cursor-pointer shadow ${
              isPwaInstalled
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 border-amber-300 font-extrabold shadow-lg'
            }`}
            title={isPwaInstalled ? 'PWA App Installed & Offline Ready' : 'Install One Breath PWA App'}
          >
            <span>📱</span>
            <span>{isPwaInstalled ? 'PWA' : 'INSTALL'}</span>
          </button>
        </div>
      </div>

      {/* STREAK COMBO BANNER */}
      <AnimatePresence>
        {stats.streak > 1 && <StreakComboBanner streak={stats.streak} />}
      </AnimatePresence>

      {/* DYNAMIC SCREEN CONTENT */}
      <div className={`relative z-10 flex-1 ${activeScreen === 'haven' || activeScreen === 'home' ? '' : 'overflow-y-auto'} no-scrollbar my-1`}>
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
              {/* PEARL EXCHANGE VAULT */}
              <div className="scopely-card border border-amber-500/50 p-3 rounded-2xl space-y-2.5 shadow-xl">
                <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                  <div>
                    <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider">
                      💎 PEARL EXCHANGE & MERCHANT CONTRACTS
                    </h3>
                    <p className="text-[10px] text-slate-400">Trade caught sea fish for rare pearl currency</p>
                  </div>
                  <span className="text-xs font-mono font-black text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-500/40">
                    {stats.coins} 💎
                  </span>
                </div>

                {/* Fish Trade Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={stats.food < 1}
                    onClick={() => onTradeFishForPearls?.(1, 15)}
                    className={`p-2.5 rounded-xl border text-left flex justify-between items-center transition-all ${
                      stats.food >= 1
                        ? 'bg-emerald-950/60 border-emerald-500/50 hover:bg-emerald-900/80 cursor-pointer shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-600'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-emerald-300 block">Trade 1 Fish</span>
                      <span className="text-[10px] text-amber-300 font-mono">+15 Pearls</span>
                    </div>
                    <span className="text-sm font-bold text-amber-400">⇄</span>
                  </button>

                  <button
                    disabled={stats.food < 3}
                    onClick={() => onTradeFishForPearls?.(3, 50)}
                    className={`p-2.5 rounded-xl border text-left flex justify-between items-center transition-all ${
                      stats.food >= 3
                        ? 'bg-emerald-950/60 border-emerald-500/50 hover:bg-emerald-900/80 cursor-pointer shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-600'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-emerald-300 block">Trade 3 Fish</span>
                      <span className="text-[10px] text-amber-300 font-mono">+50 Pearls</span>
                    </div>
                    <span className="text-sm font-bold text-amber-400">⇄</span>
                  </button>
                </div>

                {/* Stipends */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    onClick={() => onAddPearls?.(50)}
                    className="btn-scopely-blue p-2 rounded-xl text-center active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    <span className="text-xs text-white font-black block font-mono">+50</span>
                    <span className="text-[9px] text-sky-100 font-bold block uppercase">Stipend</span>
                  </button>

                  <button
                    onClick={() => onAddPearls?.(150)}
                    className="btn-scopely-gold p-2 rounded-xl text-center active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    <span className="text-xs text-slate-950 font-black block font-mono">+150</span>
                    <span className="text-[9px] text-slate-900 font-bold block uppercase">Bounty</span>
                  </button>

                  <button
                    onClick={() => onAddPearls?.(500)}
                    className="btn-scopely-purple p-2 rounded-xl text-center active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    <span className="text-xs text-white font-black block font-mono">+500</span>
                    <span className="text-[9px] text-purple-100 font-bold block uppercase">Grant</span>
                  </button>
                </div>
              </div>

              {/* DIVER GEAR & GAMEPLAY UPGRADES (STACKABLE MULTIPLE LEVELS) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                    <span>🛡️ DIVER GEAR & MULTI-LEVEL UPGRADES</span>
                  </h3>
                  <span className="text-amber-300 font-mono text-xs font-bold bg-slate-950 px-2.5 py-0.5 rounded-md border border-slate-800">
                    {totalUpgradeLevels} LEVELS UNLOCKED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                        className={`scopely-card border p-2.5 rounded-2xl flex flex-col shadow-md transition-all ${
                          currentLevel > 0
                            ? 'border-amber-500/40 bg-slate-900/80'
                            : 'border-slate-800 bg-slate-950/60'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 flex-1 min-w-0 pr-1 mb-2">
                          <span className={`text-2xl p-1.5 rounded-xl border shrink-0 ${item.bg}`}>{item.icon}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-1.5">
                              <h4 className="text-xs font-bold text-slate-100 truncate">{item.title}</h4>
                              <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-950/90 px-1.5 py-0.2 rounded border border-amber-500/40 shrink-0">
                                LVL {currentLevel}/{item.maxLevel}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-300 leading-tight mt-0.5 font-mono truncate">
                              {isMax ? (
                                <span className="text-emerald-400 font-bold">MAX: {desc.current}</span>
                              ) : (
                                <span>
                                  {desc.current} ➔ <strong className="text-emerald-400">{desc.next}</strong>
                                </span>
                              )}
                            </p>
                          </div>

                          <motion.button
                            whileTap={{ scale: 0.92 }}
                            disabled={isMax || !canAfford}
                            onClick={() => onBuyUpgrade(item.key, nextCost)}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all font-mono shrink-0 whitespace-nowrap ${
                              isMax
                                ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                                : canAfford
                                ? 'btn-scopely-gold text-slate-950 cursor-pointer shadow-md animate-pulse'
                                : 'bg-slate-800/80 text-slate-500 border border-slate-700'
                            }`}
                          >
                            {isMax ? 'MAX ✅' : `${nextCost} 💎`}
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


      {/* OVERLAY ANIMATION MODALS */}
      <AnimatePresence>
        {unlockedRankModal && (
          <RankUpModal
            rank={unlockedRankModal}
            onClose={() => setUnlockedRankModal(null)}
          />
        )}

        {showDefeatModal && lastDiveResult && (
          <DefeatModal
            outcome={lastDiveResult.outcome}
            maxDepth={lastDiveResult.maxDepth}
            previousStreak={stats.streak}
            onRetry={() => {
              setShowDefeatModal(false);
              onStartDive();
            }}
            onReturnToVillage={() => {
              setShowDefeatModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
    </>
  );
};
