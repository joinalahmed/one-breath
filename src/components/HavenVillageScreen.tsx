import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PlayerStats, DailyChallenge } from '../types';
import { soundManager } from '../audioAndHaptics';
import { Waves } from 'lucide-react';

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
  onClaimChallengeReward?: (id: string) => void;
  onTradeFishForPearls?: (fishCost: number, pearlsEarned: number) => void;
  onAddPearls?: (amount: number) => void;
  onNextTip: () => void;
  onOpenDebug?: () => void;
  onStartDive?: () => void;
}

type BuildingKey = 'campfire' | 'smokehouse' | 'lighthouse' | 'council';

export const HavenVillageScreen: React.FC<HavenVillageScreenProps> = ({
  stats,
  currentRank,
  dailyChallenges,
  currentTip,
  lastDiveResult,
  onClaimChallengeReward,
  onTradeFishForPearls,
  onAddPearls,
  onNextTip,
  onOpenDebug,
  onStartDive,
}) => {
  const [villageLevels, setVillageLevels] = useState(() => {
    try {
      const saved = localStorage.getItem('freedive_village_levels');
      return saved ? JSON.parse(saved) : { campfire: 1, smokehouse: 1, lighthouse: 1 };
    } catch {
      return { campfire: 1, smokehouse: 1, lighthouse: 1 };
    }
  });

  const [selectedBuilding, setSelectedBuilding] = useState<BuildingKey | null>(null);
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
      setUpgradeToast(`Upgraded ${name} to Level ${villageLevels[building] + 1}!`);
      setTimeout(() => setUpgradeToast(null), 3000);
    } else {
      soundManager.playSharkSting();
    }
  };

  const totalVillageLevel = villageLevels.campfire + villageLevels.smokehouse + villageLevels.lighthouse;

  return (
    <div className="relative w-full h-full text-slate-100 flex flex-col">
      {/* Building hitboxes â€” each covers the actual building in the GIF */}
      {/* Layout: top-left=SMOKEHOUSE, top-right=LIGHTHOUSE, bottom-left=COUNCIL, bottom-right=BULTEOK */}

      {/* SMOKEHOUSE â€” top-left tall windtower building */}
      <motion.div
        whileTap={{ scale: 0.97 }}
        onClick={() => setSelectedBuilding(selectedBuilding === 'smokehouse' ? null : 'smokehouse')}
        className="absolute top-[3%] left-[2%] w-[46%] h-[32%] cursor-pointer z-10"
      >
        <span
          className={`absolute bottom-[138px] left-1/2 -translate-x-1/2 text-[9px] font-black px-3 py-1 whitespace-nowrap tracking-wide uppercase ${
            selectedBuilding === 'smokehouse'
              ? 'text-amber-100 border-amber-400/80'
              : 'text-amber-200/90 border-amber-700/60'
          }`}
          style={{
            background: 'linear-gradient(180deg, #0a1a3a 0%, #071428 60%, #040d1f 100%)',
            border: '2px solid rgba(212, 175, 55, 0.5)',
            borderRadius: '4px',
            boxShadow: 'inset 0 1px 0 rgba(255,200,100,0.2), 0 3px 6px rgba(0,0,0,0.7), 0 1px 0 #1a0f05',
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          }}
        >
          SMOKEHOUSE (Lv.{villageLevels.smokehouse})
        </span>
      </motion.div>

      {/* LIGHTHOUSE â€” top-right flat-roof building */}
      <motion.div
        whileTap={{ scale: 0.97 }}
        onClick={() => setSelectedBuilding(selectedBuilding === 'lighthouse' ? null : 'lighthouse')}
        className="absolute top-[8%] left-[50%] w-[48%] h-[28%] cursor-pointer z-10"
      >
        <span
          className={`absolute bottom-[83px] left-1/2 -translate-x-1/2 text-[9px] font-black px-3 py-1 whitespace-nowrap tracking-wide uppercase ${
            selectedBuilding === 'lighthouse'
              ? 'text-amber-100 border-amber-400/80'
              : 'text-amber-200/90 border-amber-700/60'
          }`}
          style={{
            background: 'linear-gradient(180deg, #0a1a3a 0%, #071428 60%, #040d1f 100%)',
            border: '2px solid rgba(212, 175, 55, 0.5)',
            borderRadius: '4px',
            boxShadow: 'inset 0 1px 0 rgba(255,200,100,0.2), 0 3px 6px rgba(0,0,0,0.7), 0 1px 0 #1a0f05',
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          }}
        >
          LIGHTHOUSE (Lv.{villageLevels.lighthouse})
        </span>
      </motion.div>

      {/* COUNCIL â€” bottom-left building with nets */}
      <motion.div
        whileTap={{ scale: 0.97 }}
        onClick={() => setSelectedBuilding(selectedBuilding === 'council' ? null : 'council')}
        className="absolute top-[52%] left-[2%] w-[46%] h-[30%] cursor-pointer z-10"
      >
        <span
          className={`absolute bottom-[218px] left-[calc(50%-20px)] -translate-x-1/2 text-[9px] font-black px-3 py-1 whitespace-nowrap tracking-wide uppercase ${
            selectedBuilding === 'council'
              ? 'text-amber-100 border-amber-400/80'
              : 'text-amber-200/90 border-amber-700/60'
          }`}
          style={{
            background: 'linear-gradient(180deg, #0a1a3a 0%, #071428 60%, #040d1f 100%)',
            border: '2px solid rgba(212, 175, 55, 0.5)',
            borderRadius: '4px',
            boxShadow: 'inset 0 1px 0 rgba(255,200,100,0.2), 0 3px 6px rgba(0,0,0,0.7), 0 1px 0 #1a0f05',
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          }}
        >
          COUNCIL
        </span>
      </motion.div>

      {/* BULTEOK â€” bottom-right thatched roof building */}
      <motion.div
        whileTap={{ scale: 0.97 }}
        onClick={() => setSelectedBuilding(selectedBuilding === 'campfire' ? null : 'campfire')}
        className="absolute top-[52%] left-[50%] w-[48%] h-[30%] cursor-pointer z-10"
      >
        <span
          className={`absolute bottom-[170px] left-1/2 -translate-x-1/2 text-[9px] font-black px-3 py-1 whitespace-nowrap tracking-wide uppercase ${
            selectedBuilding === 'campfire'
              ? 'text-amber-100 border-amber-400/80'
              : 'text-amber-200/90 border-amber-700/60'
          }`}
          style={{
            background: 'linear-gradient(180deg, #0a1a3a 0%, #071428 60%, #040d1f 100%)',
            border: '2px solid rgba(212, 175, 55, 0.5)',
            borderRadius: '4px',
            boxShadow: 'inset 0 1px 0 rgba(255,200,100,0.2), 0 3px 6px rgba(0,0,0,0.7), 0 1px 0 #1a0f05',
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          }}
        >
          BULTEOK (Lv.{villageLevels.campfire})
        </span>
      </motion.div>

      {/* UPGRADE NOTIFICATION TOAST.
          NOTE: intentionally NOT wrapped in <AnimatePresence>. This screen is
          itself an exiting child of the parent screen-switch <AnimatePresence
          mode="wait"> in SurfaceScreen; a nested AnimatePresence here deadlocks
          that parent's exit (the village screen never unmounts, so nav appears
          frozen). Enter animation is kept; it just disappears instantly. */}
      {upgradeToast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-2 left-2 right-2 z-30 p-2 rounded-xl border border-amber-500/60 bg-amber-950/90 backdrop-blur-md text-amber-200 text-xs font-bold font-mono text-center shadow-lg"
        >
          {upgradeToast}
        </motion.div>
      )}

      {/* BUILDING DETAIL PANEL â€” slides up from bottom over the village.
          NOTE: intentionally NOT wrapped in <AnimatePresence> — see the toast
          note above; a nested AnimatePresence deadlocks the parent screen-switch
          transition and freezes navigation out of the village. */}
      {selectedBuilding && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 left-0 right-0 z-30 max-h-[55%] overflow-y-auto no-scrollbar p-2"
          >
            {/* BULTEOK CAMPFIRE */}
            {selectedBuilding === 'campfire' && (
              <div className="border border-yellow-600/30 p-3 rounded-2xl space-y-2.5 shadow-xl bg-gradient-to-b from-[#0a1a3a]/95 to-[#040d1f]/95 backdrop-blur-lg">
                <div className="flex justify-between items-start border-b border-amber-900/60 pb-2">
                  <div>
                    <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                      <span>BULTEOK CAMPFIRE</span>
                      <span className="text-[9px] font-mono bg-amber-400 text-slate-950 px-1.5 rounded-md font-bold">
                        LVL {villageLevels.campfire}
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-400">Warm hearth where Haenyeo freedivers gather for sea intel</p>
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
                    UPGRADE ({villageLevels.campfire * 100} ðŸ’Ž)
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-start space-x-3 shadow-inner">
                  <span className="text-3xl shrink-0">{currentTip.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="text-amber-300 font-bold text-xs">{currentTip.name}</span>
                      <button
                        onClick={onNextTip}
                        className="text-[9px] text-cyan-300 hover:text-cyan-200 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800 cursor-pointer"
                      >
                        Next Intel
                      </button>
                    </div>
                    <p className="text-slate-200 text-[11px] leading-snug mt-1 font-medium italic">
                      "{currentTip.text}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SMOKEHOUSE */}
            {selectedBuilding === 'smokehouse' && (
              <div className="border border-yellow-600/30 p-3 rounded-2xl space-y-2.5 shadow-xl bg-gradient-to-b from-[#0a1a3a]/95 to-[#040d1f]/95 backdrop-blur-lg">
                <div className="flex justify-between items-start border-b border-emerald-900/60 pb-2">
                  <div>
                    <h3 className="text-xs font-black text-emerald-300 uppercase tracking-wider flex items-center space-x-1.5">
                      <span>FISH SMOKEHOUSE</span>
                      <span className="text-[9px] font-mono bg-emerald-400 text-slate-950 px-1.5 rounded-md font-bold">
                        LVL {villageLevels.smokehouse}
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-400">Trade surplus fish for rare pearls</p>
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
                    UPGRADE ({villageLevels.smokehouse * 120} ðŸ’Ž)
                  </button>
                </div>
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
                    <span className="text-sm font-bold text-amber-400">â‡„</span>
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
                    <span className="text-sm font-bold text-amber-400">â‡„</span>
                  </button>
                </div>
              </div>
            )}

            {/* LIGHTHOUSE */}
            {selectedBuilding === 'lighthouse' && (
              <div className="border border-yellow-600/30 p-3 rounded-2xl space-y-2.5 shadow-xl bg-gradient-to-b from-[#0a1a3a]/95 to-[#040d1f]/95 backdrop-blur-lg">
                <div className="flex justify-between items-start border-b border-cyan-900/60 pb-2">
                  <div>
                    <h3 className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center space-x-1.5">
                      <span>ABYSSAL BEACON LIGHTHOUSE</span>
                      <span className="text-[9px] font-mono bg-cyan-400 text-slate-950 px-1.5 rounded-md font-bold">
                        LVL {villageLevels.lighthouse}
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-400">Illuminates coastal waters & tracks diving records</p>
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
                    UPGRADE ({villageLevels.lighthouse * 150} ðŸ’Ž)
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

            {/* COUNCIL */}
            {selectedBuilding === 'council' && (
              <div className="border border-yellow-600/30 p-3 rounded-2xl space-y-2 shadow-xl bg-gradient-to-b from-[#0a1a3a]/95 to-[#040d1f]/95 backdrop-blur-lg">
                <div className="flex justify-between items-center border-b border-purple-900/60 pb-2">
                  <div>
                    <h3 className="text-xs font-black text-purple-300 uppercase tracking-wider">PEARL COUNCIL & DAILY QUESTS</h3>
                    <p className="text-[10px] text-slate-400">Complete village diving directives for pearl bounties</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/40 shrink-0">
                    {dailyChallenges.filter((c) => c.claimed).length}/{dailyChallenges.length} CLAIMED
                  </span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
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
                                +{ch.rewardCoins} ðŸ’Ž
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">{ch.description}</p>
                            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mt-1">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  ch.completed ? 'bg-gradient-to-r from-amber-400 to-emerald-400' : 'bg-cyan-500'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0">
                          {ch.claimed ? (
                            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-1 rounded-lg">
                              CLAIMED
                            </span>
                          ) : ch.completed ? (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.92 }}
                              onClick={() => onClaimChallengeReward?.(ch.id)}
                              className="btn-scopely-gold px-2.5 py-1 rounded-xl text-[10px] font-black font-mono text-slate-950 cursor-pointer shadow-lg animate-pulse"
                            >
                              CLAIM
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
          </motion.div>
      )}

    </div>
  );
};


