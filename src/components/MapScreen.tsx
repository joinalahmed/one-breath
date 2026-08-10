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
    <div className="relative w-full h-full text-slate-100 flex flex-col overflow-hidden">
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

      {/* MAP BACKGROUND - Gradient seabed effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-950 via-slate-900 to-slate-950">
        {/* Depth contour lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="depth-lines" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="100" y2="0" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#depth-lines)" />
          {/* Deeper areas - contours */}
          <ellipse cx="75" cy="65" rx="20" ry="15" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.3" />
          <ellipse cx="75" cy="65" rx="15" ry="10" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.3" />
        </svg>

        {/* Water shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-3 border-b border-cyan-500/20 bg-gradient-to-b from-slate-900/80 to-slate-950/40 backdrop-blur-sm"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-black text-cyan-400 uppercase tracking-wider">Season Map</h1>
            <p className="text-xs text-slate-400">Day {stats.totalDives + 1} — Select a diving bank</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGoToVillage}
            className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-base text-slate-200 active:scale-95 transition-all cursor-pointer shadow"
            title="Return to village"
          >
            🏠
          </motion.button>
        </div>
      </motion.div>

      {/* INTERACTIVE MAP */}
      <div className="relative flex-1 overflow-hidden">
        {/* Bank Location Markers */}
        {DIVING_BANKS.map((bank, idx) => (
          <motion.div
            key={bank.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + idx * 0.08 }}
            className="absolute"
            style={{ left: `${bank.position.x}%`, top: `${bank.position.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {/* Depth indicator line from marker to bottom */}
            {selectedBank === bank.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: '200px' }}
                transition={{ duration: 0.3 }}
                className={`absolute left-1/2 top-full w-0.5 ${
                  bank.difficulty === 'easy'
                    ? 'bg-gradient-to-b from-emerald-500/50 to-transparent'
                    : bank.difficulty === 'medium'
                      ? 'bg-gradient-to-b from-amber-500/50 to-transparent'
                      : 'bg-gradient-to-b from-red-500/50 to-transparent'
                } pointer-events-none`}
                style={{ transform: 'translateX(-50%)' }}
              />
            )}

            {/* Clickable marker button */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setSelectedBank(bank.id);
                setTimeout(() => onSelectBank(bank.id), 300);
              }}
              className={`relative w-20 h-20 rounded-full border-2 ${getDifficultyColor(bank.difficulty)} shadow-xl transition-all flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm`}
            >
              {/* Marker pin effect */}
              <motion.div
                animate={{ scale: selectedBank === bank.id ? 1.2 : 1, opacity: selectedBank === bank.id ? 1 : 0.6 }}
                className="absolute inset-0 rounded-full border-2 border-current opacity-50"
              />

              {/* Bank emoji/icon */}
              <div className="text-2xl z-10">{bank.emoji}</div>

              {/* Depth label */}
              <div className={`text-[9px] font-black ${getBankDepthMarker(bank.difficulty)} z-10`}>
                {bank.depth}m
              </div>
            </motion.button>

            {/* Info tooltip - shows below marker */}
            {selectedBank === bank.id && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-24 left-1/2 -translate-x-1/2 whitespace-nowrap z-20 pointer-events-none"
              >
                <div className="bg-slate-950/95 border-2 border-slate-700/60 rounded-lg px-3 py-2 text-center backdrop-blur-md shadow-xl">
                  <div className="text-xs font-black text-white uppercase tracking-wide">{bank.name}</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">{bank.description}</div>
                  <div className={`text-[9px] font-mono mt-1 ${getBankDepthMarker(bank.difficulty)}`}>
                    Max Depth: {bank.depth}m
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}

        {/* STATS OVERLAY (bottom right) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 right-4 z-20 space-y-2"
        >
          {/* Pearls */}
          <div
            className="border-2 border-amber-500/50 bg-amber-950/60 px-4 py-2 rounded-xl flex items-center space-x-2 shadow-lg backdrop-blur-sm"
            style={{
              boxShadow: 'inset 0 1px 0 rgba(255,200,100,0.2), 0 3px 6px rgba(0,0,0,0.7)',
            }}
          >
            <span className="text-amber-400 text-lg">💎</span>
            <div>
              <div className="text-[9px] font-black text-amber-300 uppercase">Pearls</div>
              <div className="text-sm font-black text-amber-100">{stats.coins}</div>
            </div>
          </div>

          {/* Fish */}
          <div
            className="border-2 border-emerald-500/50 bg-emerald-950/60 px-4 py-2 rounded-xl flex items-center space-x-2 shadow-lg backdrop-blur-sm"
            style={{
              boxShadow: 'inset 0 1px 0 rgba(100,255,150,0.2), 0 3px 6px rgba(0,0,0,0.7)',
            }}
          >
            <span className="text-emerald-400 text-lg">🐟</span>
            <div>
              <div className="text-[9px] font-black text-emerald-300 uppercase">Fish</div>
              <div className="text-sm font-black text-emerald-100">{stats.food}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
