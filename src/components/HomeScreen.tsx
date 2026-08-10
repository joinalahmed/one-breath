import React from 'react';
import { motion } from 'motion/react';
import { PlayerStats } from '../types';

interface HomeScreenProps {
  stats: PlayerStats;
  onGoToVillage: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ stats, onGoToVillage }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-8 px-4">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-3"
      >
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 tracking-wider">
          ONE BREATH
        </h1>
        <p className="text-sm text-slate-300">
          Welcome back, Haenyeo diver
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-full max-w-xs space-y-2 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border border-slate-700/50 rounded-3xl p-6 shadow-xl"
      >
        {/* Level & Day */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-700/40">
          <div>
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider block">
              LEVEL
            </span>
            <span className="text-2xl font-black text-white">
              {Math.min(100, stats.totalDives + 1)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
              DAY
            </span>
            <span className="text-2xl font-black text-white">
              {stats.totalDives + 1}
            </span>
          </div>
        </div>

        {/* Streak */}
        {stats.streak > 0 && (
          <div className="flex items-center space-x-2 py-2 px-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl">
            <span className="text-lg">🔥</span>
            <div>
              <span className="text-[10px] font-black text-amber-300 uppercase">Streak</span>
              <span className="text-sm font-black text-amber-200 ml-1">{stats.streak}</span>
            </div>
          </div>
        )}

        {/* Currency Row */}
        <div className="flex space-x-2 pt-2">
          <div className="flex-1 bg-slate-950 border border-amber-500/40 rounded-xl p-2.5 text-center">
            <span className="text-xs text-amber-400 block">💎</span>
            <span className="text-sm font-black text-amber-300">{stats.coins}</span>
          </div>
          <div className="flex-1 bg-slate-950 border border-emerald-500/40 rounded-xl p-2.5 text-center">
            <span className="text-xs text-emerald-400 block">🐟</span>
            <span className="text-sm font-black text-emerald-300">{stats.food}</span>
          </div>
        </div>
      </motion.div>

      {/* Main Action Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onGoToVillage}
        className="w-full max-w-xs py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-black uppercase tracking-wider rounded-xl shadow-lg transition-all"
      >
        <span className="flex items-center justify-center space-x-2">
          <span className="text-lg">🏕️</span>
          <span>Go to Village</span>
        </span>
      </motion.button>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-xs text-slate-400 text-center max-w-xs"
      >
        Take a breath, prepare your gear, and dive deeper into the abyss.
      </motion.p>
    </div>
  );
};
