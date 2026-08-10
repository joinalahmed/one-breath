import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { soundManager } from '../audioAndHaptics';

interface RareCreatureDiscoveryModalProps {
  itemType: string;
  itemName: string;
  emoji: string;
  rarity: string;
  depth: number;
  value: number;
  onComplete: () => void;
}

const RARITY_CONFIG: Record<string, { bg: string; border: string; glow: string; color: string }> = {
  Rare: { bg: 'from-blue-600 to-blue-700', border: 'border-blue-400', glow: 'shadow-blue-500/50', color: 'text-blue-100' },
  Epic: { bg: 'from-purple-600 to-purple-700', border: 'border-purple-400', glow: 'shadow-purple-500/50', color: 'text-purple-100' },
  Legendary: { bg: 'from-amber-600 to-yellow-700', border: 'border-amber-400', glow: 'shadow-amber-500/50', color: 'text-amber-100' },
};

export const RareCreatureDiscoveryModal: React.FC<RareCreatureDiscoveryModalProps> = ({
  itemType,
  itemName,
  emoji,
  rarity,
  depth,
  value,
  onComplete,
}) => {
  const config = RARITY_CONFIG[rarity] || RARITY_CONFIG.Rare;

  useEffect(() => {
    soundManager.playLevelUp();
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.4 },
      colors: ['#38bdf8', '#a3e635', '#e11d48', '#fbbf24'],
    });

    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 select-none pointer-events-none"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 20, duration: 0.4 }}
        className={`relative w-full max-w-xs rounded-3xl border-2 ${config.border} bg-gradient-to-b ${config.bg} p-6 shadow-2xl text-center`}
        style={{ boxShadow: `0 0 60px ${config.glow.split('/')[1]}` }}
      >
        {/* Rare Discovery Badge */}
        <motion.div
          initial={{ scale: 0.3, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.1 }}
          className="mb-4"
        >
          <div className="text-7xl mb-2 drop-shadow-lg">{emoji}</div>
          <div className="inline-block px-3 py-1 bg-slate-950/60 rounded-full text-xs font-black uppercase tracking-widest text-amber-300 mb-3">
            ⭐ {rarity} Discovery
          </div>
        </motion.div>

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-2xl font-black uppercase tracking-tight ${config.color} mb-2`}
        >
          {itemName}
        </motion.h3>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-1 mb-4 text-sm"
        >
          <p className="text-slate-300">Found at <span className="font-bold text-cyan-300">{depth}m depth</span></p>
          <p className="text-slate-300">Worth <span className="font-bold text-emerald-300">+{value} 💎</span></p>
        </motion.div>

        {/* Unlock Message */}
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-slate-400 italic"
        >
          Added to your photo library!
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
