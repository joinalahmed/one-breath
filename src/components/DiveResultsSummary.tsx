import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';

interface DiveResultsSummaryProps {
  outcome: 'surfaced' | 'shark' | 'drowned';
  maxDepth: number;
  diveDuration: number;
  coinsEarned: number;
  foodEarned: number;
  shellsCollected: number;
  rareCollected?: number;
}

export const DiveResultsSummary: React.FC<DiveResultsSummaryProps> = ({
  outcome,
  maxDepth,
  diveDuration,
  coinsEarned,
  foodEarned,
  shellsCollected,
  rareCollected = 0,
}) => {
  const isSuccess = outcome === 'surfaced';
  const efficiency = diveDuration > 0 ? Math.round((shellsCollected / diveDuration) * 10) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`rounded-lg border p-4 mb-4 ${
        isSuccess
          ? 'bg-emerald-950/50 border-emerald-500/40'
          : 'bg-rose-950/50 border-rose-500/40'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white">Dive Summary</h3>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          isSuccess
            ? 'bg-emerald-500/30 text-emerald-300'
            : 'bg-rose-500/30 text-rose-300'
        }`}>
          {isSuccess ? '✓ SURVIVED' : outcome === 'shark' ? '🦈 SHARK ATTACK' : '💀 DROWNED'}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Depth */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="bg-slate-800/40 rounded p-2 text-center"
        >
          <p className="text-[10px] text-slate-400 font-mono mb-0.5">Max Depth</p>
          <p className="text-base font-bold text-cyan-300">{maxDepth}m</p>
        </motion.div>

        {/* Duration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/40 rounded p-2 text-center"
        >
          <p className="text-[10px] text-slate-400 font-mono mb-0.5">Duration</p>
          <p className="text-base font-bold text-blue-300">{diveDuration.toFixed(1)}s</p>
        </motion.div>

        {/* Efficiency */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-slate-800/40 rounded p-2 text-center"
        >
          <p className="text-[10px] text-slate-400 font-mono mb-0.5">Efficiency</p>
          <p className="text-base font-bold text-amber-300 flex items-center justify-center gap-1">
            <TrendingUp size={12} />
            {efficiency}/10
          </p>
        </motion.div>

        {/* Items Collected */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/40 rounded p-2 text-center"
        >
          <p className="text-[10px] text-slate-400 font-mono mb-0.5">Items</p>
          <p className="text-base font-bold text-emerald-300">{shellsCollected}</p>
        </motion.div>
      </div>

      {/* Earnings breakdown */}
      <div className="space-y-1 text-sm">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="flex justify-between items-center text-slate-300"
        >
          <span className="flex items-center gap-1">
            💎 Pearls Earned:
            {rareCollected > 0 && (
              <span className="text-[10px] bg-purple-500/30 px-1.5 py-0.5 rounded text-purple-300 font-mono">
                +{rareCollected} rare
              </span>
            )}
          </span>
          <span className="font-mono font-bold text-yellow-300">+{coinsEarned}</span>
        </motion.div>

        {foodEarned > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-between items-center text-slate-300"
          >
            <span>🐟 Fish Caught:</span>
            <span className="font-mono font-bold text-emerald-300">+{foodEarned}</span>
          </motion.div>
        )}
      </div>

      {/* Tip or hint */}
      {!isSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-3 pt-3 border-t border-slate-700/50 text-[10px] text-slate-400 italic"
        >
          💡 Tip: {
            outcome === 'shark'
              ? 'Upgrade Shark Repellent to reduce danger zone, or time your dives to avoid the patrol pattern.'
              : 'Increase your lung capacity with upgrades to stay deeper longer.'
          }
        </motion.div>
      )}
    </motion.div>
  );
};
