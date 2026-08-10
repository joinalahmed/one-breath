import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PlayerStats } from '../types';

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
    position: { x: 25, y: 30 },
    difficulty: 'easy',
  },
  {
    id: 'middle_bank',
    name: 'Middle Bank',
    emoji: '🌊',
    depth: 20,
    description: 'Moderate depth, good pearls',
    position: { x: 50, y: 35 },
    difficulty: 'medium',
  },
  {
    id: 'deep_trench',
    name: 'Deep Trench',
    emoji: '🌀',
    depth: 30,
    description: 'Rich rewards, dangerous depths',
    position: { x: 75, y: 50 },
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
    position: { x: 65, y: 55 },
    difficulty: 'medium',
  },
];

export const MapScreen: React.FC<MapScreenProps> = ({ stats, onSelectBank, onGoToVillage }) => {
  const [hoveredBank, setHoveredBank] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'from-emerald-500 to-emerald-600';
      case 'medium':
        return 'from-amber-500 to-amber-600';
      case 'hard':
        return 'from-red-500 to-red-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getDifficultyBorder = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'border-emerald-500/50';
      case 'medium':
        return 'border-amber-500/50';
      case 'hard':
        return 'border-red-500/50';
      default:
        return 'border-slate-500/50';
    }
  };

  return (
    <div className="h-full flex flex-col space-y-3 p-3">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-1"
      >
        <h1 className="text-2xl font-black text-cyan-400">SEASON MAP</h1>
        <p className="text-xs text-slate-400">Select a diving bank • Day {stats.totalDives + 1}</p>
      </motion.div>

      {/* INTERACTIVE MAP */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative flex-1 bg-gradient-to-b from-slate-800/40 via-slate-900/60 to-slate-950 border border-cyan-500/30 rounded-2xl p-4 overflow-hidden"
      >
        {/* Water wave background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="waves" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M0,10 Q5,5 10,10 T20,10" stroke="currentColor" fill="none" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#waves)" />
          </svg>
        </div>

        {/* Bank Locations */}
        <div className="relative h-full">
          {DIVING_BANKS.map((bank) => (
            <motion.button
              key={bank.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + Math.random() * 0.2 }}
              onMouseEnter={() => setHoveredBank(bank.id)}
              onMouseLeave={() => setHoveredBank(null)}
              onClick={() => onSelectBank(bank.id)}
              className={`absolute flex flex-col items-center cursor-pointer transition-all ${
                hoveredBank === bank.id ? 'scale-125 z-20' : 'scale-100 z-10'
              }`}
              style={{ left: `${bank.position.x}%`, top: `${bank.position.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              {/* Glow effect on hover */}
              {hoveredBank === bank.id && (
                <motion.div
                  layoutId="glow"
                  className="absolute inset-0 bg-cyan-500/30 rounded-full blur-lg"
                  style={{ width: '120px', height: '120px' }}
                />
              )}

              {/* Bank button */}
              <motion.div
                whileHover={{ y: -2 }}
                className={`relative z-10 w-16 h-16 rounded-full border-2 ${getDifficultyBorder(bank.difficulty)} bg-gradient-to-br ${getDifficultyColor(bank.difficulty)} shadow-lg flex items-center justify-center text-2xl`}
              >
                {bank.emoji}
              </motion.div>

              {/* Bank name - shows on hover */}
              {hoveredBank === bank.id && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 whitespace-nowrap"
                >
                  <div className="bg-slate-950/95 border border-slate-700 rounded-lg px-3 py-2 text-center backdrop-blur-sm shadow-lg">
                    <div className="text-xs font-black text-white">{bank.name}</div>
                    <div className="text-[10px] text-slate-300">{bank.description}</div>
                    <div className="text-[9px] text-cyan-400 font-mono mt-1">
                      Max Depth: {bank.depth}m
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* FOOTER STATS & ACTION */}
      <div className="flex items-center gap-2">
        {/* Quick Stats */}
        <div className="flex-1 flex gap-1">
          <div className="flex-1 bg-slate-800/60 border border-amber-500/30 rounded-lg px-2 py-1.5 text-center">
            <div className="text-[9px] font-black text-amber-300 uppercase">Pearls</div>
            <div className="text-sm font-black text-white">{stats.coins}</div>
          </div>
          <div className="flex-1 bg-slate-800/60 border border-emerald-500/30 rounded-lg px-2 py-1.5 text-center">
            <div className="text-[9px] font-black text-emerald-300 uppercase">Fish</div>
            <div className="text-sm font-black text-white">{stats.food}</div>
          </div>
        </div>

        {/* Home Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGoToVillage}
          className="px-3 py-1.5 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 border border-slate-600 rounded-lg text-xs font-black uppercase text-slate-200 transition-all"
          title="Return to village"
        >
          🏠 Home
        </motion.button>
      </div>
    </div>
  );
};
