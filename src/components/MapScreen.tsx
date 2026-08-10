import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayerStats } from '../types';
import { DiveResultsSummary } from './DiveResultsSummary';

interface DivingBank {
  id: string;
  name: string;
  emoji: string;
  depth: number;
  description: string;
  position: { x: number; y: number };
  difficulty: 'easy' | 'medium' | 'hard';
}

interface MapScreenProps {
  stats: PlayerStats;
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
  onSelectBank: (bankId: string) => void;
  onGoToVillage: () => void;
}

const DIVING_BANKS: DivingBank[] = [
  {
    id: 'shallow_reef',
    name: 'Shallow Reef',
    emoji: '🪨',
    depth: 12,
    description: 'Safe waters, calm currents',
    position: { x: 25, y: 35 },
    difficulty: 'easy',
  },
  {
    id: 'middle_bank',
    name: 'Middle Bank',
    emoji: '🌊',
    depth: 20,
    description: 'Moderate depth, good pearls',
    position: { x: 60, y: 30 },
    difficulty: 'medium',
  },
  {
    id: 'deep_trench',
    name: 'Deep Trench',
    emoji: '🌀',
    depth: 30,
    description: 'Rich rewards, dangerous depths',
    position: { x: 75, y: 55 },
    difficulty: 'hard',
  },
  {
    id: 'night_waters',
    name: 'Night Waters',
    emoji: '🌙',
    depth: 25,
    description: 'Eerie but abundant',
    position: { x: 35, y: 65 },
    difficulty: 'hard',
  },
  {
    id: 'kelp_forest',
    name: 'Kelp Forest',
    emoji: '🌿',
    depth: 18,
    description: 'Maze of seaweed, hidden pearls',
    position: { x: 55, y: 60 },
    difficulty: 'medium',
  },
];

export const MapScreen: React.FC<MapScreenProps> = ({ stats, lastDiveResult, onSelectBank, onGoToVillage }) => {
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(!!lastDiveResult);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'border-emerald-500/70 bg-emerald-950/60';
      case 'medium':
        return 'border-amber-500/70 bg-amber-950/60';
      case 'hard':
        return 'border-red-500/70 bg-red-950/60';
      default:
        return 'border-slate-500/50 bg-slate-900/40';
    }
  };

  const getBankDepthMarker = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-emerald-400';
      case 'medium':
        return 'text-amber-400';
      case 'hard':
        return 'text-red-400';
      default:
        return 'text-cyan-400';
    }
  };

  return (
    <div className="relative w-full h-full text-slate-100 flex flex-col overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
      {/* DIVE RESULTS MODAL - Candy Crush style */}
      <AnimatePresence>
        {showResults && lastDiveResult && (
          <>
            {/* Dimmed Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setShowResults(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div className="pointer-events-auto w-11/12 max-w-sm">
                <motion.div
                  className="bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 rounded-3xl border-2 border-cyan-400/40 shadow-2xl p-6 space-y-4"
                  style={{
                    boxShadow: '0 0 40px rgba(34, 211, 238, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                  }}
                >
                  {/* Close Button - Top Right */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowResults(false)}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-700/60 hover:bg-slate-600 flex items-center justify-center text-slate-300 hover:text-white transition-all"
                  >
                    ✕
                  </motion.button>

                  {/* Results Content */}
                  <DiveResultsSummary
                    outcome={lastDiveResult.outcome}
                    maxDepth={lastDiveResult.maxDepth}
                    diveDuration={lastDiveResult.diveDuration}
                    coinsEarned={lastDiveResult.coinsEarned}
                    foodEarned={lastDiveResult.foodEarned}
                    shellsCollected={lastDiveResult.shellsCollected}
                    rareCollected={lastDiveResult.rareCollected}
                  />

                  {/* Continue Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowResults(false)}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-black uppercase tracking-wider rounded-xl shadow-lg transition-all"
                  >
                    Continue
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 px-3 py-4 space-y-2"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black text-cyan-400 uppercase tracking-wider">SELECT BANK</h1>
            <p className="text-xs text-slate-400 mt-1">Day {stats.totalDives + 1}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={onGoToVillage}
            className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 flex items-center justify-center text-base text-slate-200 transition-all cursor-pointer shadow"
            title="Return to village"
          >
            🏠
          </motion.button>
        </div>
      </motion.div>

      {/* CARD GRID */}
      <div className="relative flex-1 overflow-y-auto no-scrollbar px-2 pb-3">
        <div className="grid grid-cols-2 gap-3 auto-rows-max">
          {DIVING_BANKS.map((bank, idx) => (
            <motion.button
              key={bank.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedBank(bank.id);
                setTimeout(() => onSelectBank(bank.id), 300);
              }}
              className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer backdrop-blur-sm flex flex-col items-center justify-center space-y-2 h-32 ${getDifficultyColor(bank.difficulty)}`}
              style={{
                boxShadow: selectedBank === bank.id
                  ? 'inset 0 1px 0 rgba(255,255,255,0.2), 0 0 20px rgba(255,255,255,0.2)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              {/* Selected indicator */}
              {selectedBank === bank.id && (
                <motion.div
                  layoutId="selected"
                  className="absolute inset-0 rounded-2xl border-2 border-current opacity-100"
                  transition={{ type: 'spring', stiffness: 300 }}
                />
              )}

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center space-y-1 w-full">
                {/* Emoji */}
                <span className="text-3xl">{bank.emoji}</span>

                {/* Name */}
                <h3 className="text-xs font-black uppercase tracking-wider text-white text-center leading-tight">
                  {bank.name}
                </h3>

                {/* Depth */}
                <div className={`text-[10px] font-black font-mono ${getBankDepthMarker(bank.difficulty)}`}>
                  {bank.depth}m
                </div>

                {/* Difficulty indicator */}
                <div className="text-[9px] font-black text-slate-300 uppercase tracking-wide">
                  {bank.difficulty === 'easy' ? '★' : bank.difficulty === 'medium' ? '★★' : '★★★'}
                </div>
              </div>

              {/* Pulse effect on hover */}
              {selectedBank === bank.id && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-2xl border-2 border-current opacity-0"
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* SELECTION INFO */}
      <AnimatePresence>
        {selectedBank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative z-10 px-3 py-3 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent border-t border-slate-700/40"
          >
            {(() => {
              const bank = DIVING_BANKS.find(b => b.id === selectedBank);
              return bank ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-black tracking-wider">Selected Bank</p>
                      <p className="text-sm font-black text-white">{bank.name}</p>
                    </div>
                    <p className={`text-2xl font-black ${getBankDepthMarker(bank.difficulty)}`}>
                      {bank.depth}m
                    </p>
                  </div>
                  <p className="text-xs text-slate-300">{bank.description}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedBank(null);
                      onSelectBank(bank.id);
                    }}
                    className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-black uppercase tracking-wider rounded-lg transition-all"
                  >
                    DIVE NOW
                  </motion.button>
                </div>
              ) : null;
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
