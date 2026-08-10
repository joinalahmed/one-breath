import React from 'react';
import { motion } from 'motion/react';
import { ChevronUp, Lock } from 'lucide-react';

interface UpgradeCardProps {
  icon: string;
  title: string;
  currentDesc: string;
  nextDesc: string;
  cost: number;
  level: number;
  maxLevel: number;
  canAfford: boolean;
  isMaxed: boolean;
  onBuy: () => void;
  bgClass: string;
}

export const UpgradeCard: React.FC<UpgradeCardProps> = ({
  icon,
  title,
  currentDesc,
  nextDesc,
  cost,
  level,
  maxLevel,
  canAfford,
  isMaxed,
  onBuy,
  bgClass,
}) => {
  return (
    <motion.button
      onClick={onBuy}
      disabled={isMaxed || !canAfford}
      whileHover={!isMaxed && canAfford ? { scale: 1.03, y: -2 } : {}}
      whileTap={!isMaxed && canAfford ? { scale: 0.96 } : {}}
      className={`relative w-full rounded-lg p-4 border transition-all ${bgClass} ${
        isMaxed
          ? 'opacity-60 cursor-default border-slate-600/30'
          : !canAfford
            ? 'opacity-75 cursor-not-allowed border-slate-600/30'
            : 'hover:border-opacity-100 cursor-pointer'
      }`}
    >
      {/* LEVEL BADGE */}
      <div className="absolute top-2 right-2 px-2 py-1 bg-slate-900/70 rounded text-[10px] font-bold text-slate-300">
        Lvl {level}/{maxLevel}
      </div>

      {/* UPGRADE HEADER */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1 text-left">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">{title}</h3>
        </div>
      </div>

      {/* STAT CHANGES */}
      <div className="space-y-1.5 mb-3 text-left">
        {/* Current */}
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Current:</span>
          <span className="font-mono text-slate-300">{currentDesc}</span>
        </div>

        {/* Arrow and Next (if not maxed) */}
        {!isMaxed && (
          <>
            <div className="flex justify-center py-0.5">
              <ChevronUp size={12} className="text-amber-400" />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-amber-400 font-semibold">Next Level:</span>
              <span className="font-mono text-amber-300 font-semibold">{nextDesc}</span>
            </div>
          </>
        )}

        {/* Maxed out badge */}
        {isMaxed && (
          <div className="flex justify-center py-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              ✓ Fully Upgraded
            </span>
          </div>
        )}
      </div>

      {/* BUY BUTTON */}
      {!isMaxed && (
        <motion.div
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-bold uppercase tracking-wider ${
            canAfford
              ? 'bg-amber-500/90 text-slate-900 hover:bg-amber-400'
              : 'bg-slate-700/50 text-slate-400'
          }`}
        >
          {canAfford ? (
            <>
              <span>💎 {cost}</span>
            </>
          ) : (
            <>
              <Lock size={12} />
              <span>💎 {cost}</span>
            </>
          )}
        </motion.div>
      )}
    </motion.button>
  );
};
