import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayerStats, DailyChallenge } from '../types';
import { soundManager } from '../audioAndHaptics';
import { DiveResultsSummary } from './DiveResultsSummary';

interface HavenVillageScreenProps {
  stats: PlayerStats;
  currentRank: {
    title: string;
    level: number;
    color: string;
    badgeEmoji: string;
    borderColor: string;
    bgGradient: string;
  };
  nextRank?: {
    title: string;
    minDepth: number;
    minCoins: number;
  };
  dailyChallenges: DailyChallenge[];
  currentTip: {
    name: string;
    text: string;
    avatar: string;
  };
  lastDiveResult?: {
    outcome: 'surfaced' | 'shark' | 'drowned';
    maxDepth: number;
    diveDuration: number;
    coinsEarned: number;
    foodEarned: number;
    shellsCollected: number;
    rareCollected: number;
    stoneCutAtDepth: number | null;
  } | null;
  onStartDive: () => void;
  onClaimChallengeReward?: (id: string) => void;
  onTradeFishForPearls?: (fishCost: number, pearlsEarned: number) => void;
  onAddPearls?: (amount: number) => void;
  onNextTip: () => void;
  onOpenDebug?: () => void;
}

export const HavenVillageScreen: React.FC<HavenVillageScreenProps> = ({
  stats,
  currentRank,
  nextRank,
  dailyChallenges,
  currentTip,
  lastDiveResult,
  onStartDive,
  onClaimChallengeReward,
  onTradeFishForPearls,
  onAddPearls,
  onNextTip,
  onOpenDebug,
}) => {
  // Village building upgrade levels stored locally
  const [villageLevels, setVillageLevels] = useState(() => {
    try {
      const saved = localStorage.getItem('freedive_village_levels');
      return saved ? JSON.parse(saved) : { campfire: 1, smokehouse: 1, lighthouse: 1 };
    } catch {
      return { campfire: 1, smokehouse: 1, lighthouse: 1 };
    }
  });

  const [activeBuildingTab, setActiveBuildingTab] = useState<'all' | 'campfire' | 'smokehouse' | 'lighthouse' | 'council'>('all');
  const [upgradeToast, setUpgradeToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('freedive_village_levels', JSON.stringify(villageLevels));
    } catch (e) {
      console.warn('Failed to save village levels', e);
    }
  }, [villageLevels]);

  const handleUpgradeBuilding = (building: 'campfire' | 'smokehouse' | 'lighthouse', cost: number, name: string) => {
    if (stats.coins >= cost) {
      if (onAddPearls) {
        onAddPearls(-cost);
      }
      setVillageLevels((prev: typeof villageLevels) => ({
        ...prev,
        [building]: prev[building] + 1,
      }));
      soundManager.playLevelUp();
      setUpgradeToast(`✨ Upgraded ${name} to Level ${villageLevels[building] + 1}!`);
      setTimeout(() => setUpgradeToast(null), 3000);
    } else {
      soundManager.playSharkSting();
    }
  };

  const totalVillageLevel = villageLevels.campfire + villageLevels.smokehouse + villageLevels.lighthouse;

  return (
    <div className="flex flex-col space-y-3 pb-6 text-slate-100">
      {/* DIVE RESULTS SUMMARY - Shows if there was a recent dive */}
      {lastDiveResult && (
        <DiveResultsSummary
          outcome={lastDiveResult.outcome}
          maxDepth={lastDiveResult.maxDepth}
          diveDuration={lastDiveResult.diveDuration}
          coinsEarned={lastDiveResult.coinsEarned}
          foodEarned={lastDiveResult.foodEarned}
          shellsCollected={lastDiveResult.shellsCollected}
          rareCollected={lastDiveResult.rareCollected}
        />
      )}

      {/* VILLAGE HERO BANNER */}
      <div className="relative rounded-3xl p-4 bg-gradient-to-b from-slate-900 via-sky-950 to-slate-950 border border-cyan-500/40 shadow-2xl overflow-hidden flex flex-col space-y-3">
        {/* Animated Background Atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(14,165,233,0.2),transparent_70%)] pointer-events-none" />
        <div className="absolute -top-10 right-4 w-32 h-32 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

        {/* Header Title & Tier */}
        <div className="flex justify-between items-start relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black tracking-widest uppercase text-cyan-300 bg-slate-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/40 flex items-center space-x-1 shadow">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                PEARL COAST HAVEN VILLAGE
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/90 border border-amber-500/50 px-2 py-0.5 rounded-full">
                🔥 {stats.streak}x STREAK
              </span>
            </div>
            <h1 className="text-lg font-black tracking-wide text-white mt-1 flex items-center space-x-2">
              <span>🏕️</span>
              <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-cyan-200 bg-clip-text text-transparent">
                Freediver Haven (Tier {totalVillageLevel})
              </span>
            </h1>
          </div>

          <button
            onClick={onOpenDebug}
            className="text-[10px] text-slate-400 hover:text-amber-300 underline font-mono cursor-pointer shrink-0"
          >
            Debug
          </button>
        </div>

        {/* Visual Village Illustration Strip */}
        <div className="relative h-28 rounded-2xl bg-slate-950/80 border border-slate-800/90 overflow-hidden flex items-center justify-around px-2 shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-950/40 via-transparent to-slate-950/80 pointer-events-none" />

          {/* Animated Village Buildings */}
          {/* Bulteok Campfire */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            onClick={() => setActiveBuildingTab('campfire')}
            className={`cursor-pointer flex flex-col items-center space-y-1 z-10 p-2 rounded-xl transition-all ${
              activeBuildingTab === 'campfire' ? 'bg-amber-950/60 border border-amber-500/60 shadow-lg' : ''
            }`}
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-3xl relative"
            >
              🏕️
              <span className="absolute -top-1 -right-1 text-[8px] bg-amber-400 text-slate-950 font-bold font-mono px-1 rounded-full">
                L{villageLevels.campfire}
              </span>
            </motion.div>
            <span className="text-[9px] font-black uppercase text-amber-300 tracking-wider">Bulteok</span>
          </motion.div>

          {/* Fish Smokehouse */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            onClick={() => setActiveBuildingTab('smokehouse')}
            className={`cursor-pointer flex flex-col items-center space-y-1 z-10 p-2 rounded-xl transition-all ${
              activeBuildingTab === 'smokehouse' ? 'bg-emerald-950/60 border border-emerald-500/60 shadow-lg' : ''
            }`}
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, delay: 0.3 }}
              className="text-3xl relative"
            >
              🐟
              <span className="absolute -top-1 -right-1 text-[8px] bg-emerald-400 text-slate-950 font-bold font-mono px-1 rounded-full">
                L{villageLevels.smokehouse}
              </span>
            </motion.div>
            <span className="text-[9px] font-black uppercase text-emerald-300 tracking-wider">Smokehouse</span>
          </motion.div>

          {/* Lighthouse */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            onClick={() => setActiveBuildingTab('lighthouse')}
            className={`cursor-pointer flex flex-col items-center space-y-1 z-10 p-2 rounded-xl transition-all ${
              activeBuildingTab === 'lighthouse' ? 'bg-cyan-950/60 border border-cyan-500/60 shadow-lg' : ''
            }`}
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: 0.6 }}
              className="text-3xl relative"
            >
              🏮
              <span className="absolute -top-1 -right-1 text-[8px] bg-cyan-400 text-slate-950 font-bold font-mono px-1 rounded-full">
                L{villageLevels.lighthouse}
              </span>
            </motion.div>
            <span className="text-[9px] font-black uppercase text-cyan-300 tracking-wider">Lighthouse</span>
          </motion.div>

          {/* Council Hall */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            onClick={() => setActiveBuildingTab('council')}
            className={`cursor-pointer flex flex-col items-center space-y-1 z-10 p-2 rounded-xl transition-all ${
              activeBuildingTab === 'council' ? 'bg-purple-950/60 border border-purple-500/60 shadow-lg' : ''
            }`}
          >
            <div className="text-3xl relative">
              🏛️
              <span className="absolute -top-1 -right-1 text-[8px] bg-purple-400 text-slate-950 font-bold font-mono px-1 rounded-full">
                🎯
              </span>
            </div>
            <span className="text-[9px] font-black uppercase text-purple-300 tracking-wider">Council</span>
          </motion.div>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono font-bold bg-slate-950/80 p-2 rounded-xl border border-slate-800">
          <div className="border-r border-slate-800">
            <span className="text-slate-400 text-[10px] block">RECORDS</span>
            <span className="text-cyan-300 text-sm">{stats.bestDepth}m</span>
          </div>
          <div className="border-r border-slate-800">
            <span className="text-slate-400 text-[10px] block">PANTRY</span>
            <span className="text-emerald-300 text-sm">{stats.food} 🐟</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">PEARL VAULT</span>
            <span className="text-amber-300 text-sm">{stats.coins} 💎</span>
          </div>
        </div>

        {/* MAIN PRIMARY DIVE LAUNCH PAD */}
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.6)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartDive}
          className="btn-scopely-green w-full py-3.5 px-6 rounded-2xl text-white font-black text-xl tracking-wider uppercase flex items-center justify-center space-x-3 transition-all cursor-pointer shadow-2xl relative z-10 border-2 border-emerald-300/40 mt-1"
        >
          <motion.span
            animate={{ rotate: [-12, 12, -12] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            className="text-3xl inline-block"
          >
            🤿
          </motion.span>
          <span>START DIVE NOW!</span>
          <span className="bg-emerald-950/70 text-emerald-100 px-2.5 py-0.5 rounded-lg text-xs font-mono border border-emerald-300/50 shadow-inner">
            [SPACE]
          </span>
        </motion.button>
      </div>

      {/* UPGRADE NOTIFICATION TOAST */}
      <AnimatePresence>
        {upgradeToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-2.5 rounded-xl border border-amber-500 bg-amber-950/90 text-amber-200 text-xs font-bold font-mono text-center shadow-lg"
          >
            {upgradeToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* BUILDING SELECTION FILTER TABS */}
      <div className="flex space-x-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[10px] font-black uppercase">
        <button
          onClick={() => setActiveBuildingTab('all')}
          className={`flex-1 py-1.5 rounded-lg cursor-pointer transition-all ${
            activeBuildingTab === 'all' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ALL BUILDINGS
        </button>
        <button
          onClick={() => setActiveBuildingTab('campfire')}
          className={`flex-1 py-1.5 rounded-lg cursor-pointer transition-all ${
            activeBuildingTab === 'campfire' ? 'bg-amber-950 text-amber-300 border border-amber-500/40 shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🏕️ CAMPFIRE
        </button>
        <button
          onClick={() => setActiveBuildingTab('smokehouse')}
          className={`flex-1 py-1.5 rounded-lg cursor-pointer transition-all ${
            activeBuildingTab === 'smokehouse' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🐟 SMOKEHOUSE
        </button>
        <button
          onClick={() => setActiveBuildingTab('lighthouse')}
          className={`flex-1 py-1.5 rounded-lg cursor-pointer transition-all ${
            activeBuildingTab === 'lighthouse' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🏮 LIGHTHOUSE
        </button>
      </div>

      {/* VILLAGE BUILDING DETAILS & INTERACTION CARDS */}
      <div className="space-y-3">
        {/* 1. BULTEOK CAMPFIRE & REST LODGE */}
        {(activeBuildingTab === 'all' || activeBuildingTab === 'campfire') && (
          <div className="scopely-card border border-amber-500/40 p-3 rounded-2xl space-y-2.5 shadow-xl bg-gradient-to-b from-slate-900/90 to-slate-950">
            <div className="flex justify-between items-start border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2.5">
                <span className="text-3xl p-1.5 bg-slate-950 rounded-xl border border-amber-500/40 shrink-0">🏕️</span>
                <div>
                  <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                    <span>BULTEOK CAMPFIRE & DIVER LODGE</span>
                    <span className="text-[9px] font-mono bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-md font-bold">
                      LVL {villageLevels.campfire}
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400">Warm hearth where Haenyeo freedivers gather for sea intel</p>
                </div>
              </div>

              <button
                disabled={stats.coins < villageLevels.campfire * 100}
                onClick={() => handleUpgradeBuilding('campfire', villageLevels.campfire * 100, 'Bulteok Fire Pit')}
                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black font-mono uppercase cursor-pointer border shadow transition-all shrink-0 ${
                  stats.coins >= villageLevels.campfire * 100
                    ? 'btn-scopely-gold text-slate-950 border-amber-400'
                    : 'bg-slate-950 text-slate-600 border-slate-800'
                }`}
              >
                UPGRADE ({villageLevels.campfire * 100} 💎)
              </button>
            </div>

            {/* CAMPFIRE INTEL SPEECH BUBBLE */}
            <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-start space-x-3 shadow-inner">
              <span className="text-3xl shrink-0">{currentTip.avatar}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-amber-300 font-bold text-xs">{currentTip.name}</span>
                  <button
                    onClick={onNextTip}
                    className="text-[9px] text-cyan-300 hover:text-cyan-200 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800 cursor-pointer"
                  >
                    Next Intel 💬
                  </button>
                </div>
                <p className="text-slate-200 text-[11px] leading-snug mt-1 font-medium italic">
                  "{currentTip.text}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. FISH SMOKEHOUSE & CURING RACKS */}
        {(activeBuildingTab === 'all' || activeBuildingTab === 'smokehouse') && (
          <div className="scopely-card border border-emerald-500/40 p-3 rounded-2xl space-y-2.5 shadow-xl bg-gradient-to-b from-slate-900/90 to-slate-950">
            <div className="flex justify-between items-start border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2.5">
                <span className="text-3xl p-1.5 bg-slate-950 rounded-xl border border-emerald-500/40 shrink-0">🐟</span>
                <div>
                  <h3 className="text-xs font-black text-emerald-300 uppercase tracking-wider flex items-center space-x-1.5">
                    <span>FISH SMOKEHOUSE & CURING RACKS</span>
                    <span className="text-[9px] font-mono bg-emerald-400 text-slate-950 px-1.5 py-0.2 rounded-md font-bold">
                      LVL {villageLevels.smokehouse}
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400">Trade surplus fish caught from dives for rare pearls</p>
                </div>
              </div>

              <button
                disabled={stats.coins < villageLevels.smokehouse * 120}
                onClick={() => handleUpgradeBuilding('smokehouse', villageLevels.smokehouse * 120, 'Fish Smokehouse')}
                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black font-mono uppercase cursor-pointer border shadow transition-all shrink-0 ${
                  stats.coins >= villageLevels.smokehouse * 120
                    ? 'btn-scopely-green text-white border-emerald-400'
                    : 'bg-slate-950 text-slate-600 border-slate-800'
                }`}
              >
                UPGRADE ({villageLevels.smokehouse * 120} 💎)
              </button>
            </div>

            {/* Fish Trade Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={stats.food < 1}
                onClick={() => onTradeFishForPearls?.(1, 15 + (villageLevels.smokehouse - 1) * 5)}
                className={`p-2.5 rounded-xl border text-left flex justify-between items-center transition-all ${
                  stats.food >= 1
                    ? 'bg-emerald-950/60 border-emerald-500/50 hover:bg-emerald-900/80 cursor-pointer shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-emerald-300 block">Trade 1 Fish</span>
                  <span className="text-[10px] text-amber-300 font-mono">
                    +{15 + (villageLevels.smokehouse - 1) * 5} Pearls
                  </span>
                </div>
                <span className="text-sm font-bold text-amber-400">⇄</span>
              </button>

              <button
                disabled={stats.food < 3}
                onClick={() => onTradeFishForPearls?.(3, 50 + (villageLevels.smokehouse - 1) * 15)}
                className={`p-2.5 rounded-xl border text-left flex justify-between items-center transition-all ${
                  stats.food >= 3
                    ? 'bg-emerald-950/60 border-emerald-500/50 hover:bg-emerald-900/80 cursor-pointer shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-emerald-300 block">Trade 3 Fish</span>
                  <span className="text-[10px] text-amber-300 font-mono">
                    +{50 + (villageLevels.smokehouse - 1) * 15} Pearls
                  </span>
                </div>
                <span className="text-sm font-bold text-amber-400">⇄</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. ABYSSAL BEACON LIGHTHOUSE */}
        {(activeBuildingTab === 'all' || activeBuildingTab === 'lighthouse') && (
          <div className="scopely-card border border-cyan-500/40 p-3 rounded-2xl space-y-2.5 shadow-xl bg-gradient-to-b from-slate-900/90 to-slate-950">
            <div className="flex justify-between items-start border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2.5">
                <span className="text-3xl p-1.5 bg-slate-950 rounded-xl border border-cyan-500/40 shrink-0">🏮</span>
                <div>
                  <h3 className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center space-x-1.5">
                    <span>ABYSSAL BEACON LIGHTHOUSE</span>
                    <span className="text-[9px] font-mono bg-cyan-400 text-slate-950 px-1.5 py-0.2 rounded-md font-bold">
                      LVL {villageLevels.lighthouse}
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400">Illuminates coastal waters and tracks record diving achievements</p>
                </div>
              </div>

              <button
                disabled={stats.coins < villageLevels.lighthouse * 150}
                onClick={() => handleUpgradeBuilding('lighthouse', villageLevels.lighthouse * 150, 'Beacon Lighthouse')}
                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black font-mono uppercase cursor-pointer border shadow transition-all shrink-0 ${
                  stats.coins >= villageLevels.lighthouse * 150
                    ? 'btn-scopely-blue text-white border-cyan-400'
                    : 'bg-slate-950 text-slate-600 border-slate-800'
                }`}
              >
                UPGRADE ({villageLevels.lighthouse * 150} 💎)
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Record Depth:</span>
                <span className="text-cyan-300 font-bold">{stats.bestDepth}m</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Rare Sea Luck:</span>
                <span className="text-amber-300 font-bold">+{villageLevels.lighthouse * 10}%</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. PEARL COUNCIL & DAILY CHALLENGES */}
        {(activeBuildingTab === 'all' || activeBuildingTab === 'council') && (
          <div className="scopely-card border border-purple-500/40 p-3 rounded-2xl space-y-2 shadow-xl bg-gradient-to-b from-slate-900/90 to-slate-950">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <div>
                <h3 className="text-xs font-black text-purple-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <span>🏛️ PEARL COUNCIL & DAILY QUESTS</span>
                </h3>
                <p className="text-[10px] text-slate-400">Complete village diving directives for pearl bounties</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/40 shrink-0">
                {dailyChallenges.filter((c) => c.claimed).length}/{dailyChallenges.length} CLAIMED
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar pr-0.5">
              {dailyChallenges.map((ch) => {
                const pct = Math.min(100, Math.round((ch.current / ch.target) * 100));

                return (
                  <div
                    key={ch.id}
                    className={`p-2 rounded-xl border flex items-center justify-between space-x-2 transition-all ${
                      ch.claimed
                        ? 'bg-slate-950/80 border-slate-800/80 opacity-75'
                        : ch.completed
                        ? 'bg-amber-950/40 border-amber-500/60 shadow-md'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                      <span className="text-2xl p-1 bg-slate-950 rounded-lg border border-slate-800 shrink-0">
                        {ch.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center pr-1">
                          <h4 className="text-[11px] font-bold text-slate-100 truncate">{ch.title}</h4>
                          <span className="text-[10px] font-mono font-bold text-amber-300 shrink-0 ml-1">
                            +{ch.rewardCoins} 💎
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{ch.description}</p>
                        {/* Progress bar */}
                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mt-1 flex items-center">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              ch.completed ? 'bg-gradient-to-r from-amber-400 to-emerald-400' : 'bg-cyan-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0">
                      {ch.claimed ? (
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-1 rounded-lg block">
                          CLAIMED ✅
                        </span>
                      ) : ch.completed ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => onClaimChallengeReward?.(ch.id)}
                          className="btn-scopely-gold px-2.5 py-1 rounded-xl text-[10px] font-black font-mono text-slate-950 cursor-pointer shadow-lg animate-pulse"
                        >
                          CLAIM 💎
                        </motion.button>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                          {ch.current}/{ch.target}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
