import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';
import { soundManager } from '../audioAndHaptics';

interface DiveReportModalProps {
  outcome: 'surfaced' | 'shark' | 'drowned';
  maxDepth: number;
  diveDuration: number;
  shellsCollected: number;
  rareCollected: number;
  /** Earnings actually banked (non-zero only on a safe surface). */
  coinsEarned: number;
  foodEarned: number;
  /** Value the basket would have yielded if surfaced — the treasure at risk on a failed dive. */
  potentialCoins: number;
  potentialFood: number;
  previousStreak: number;
  /** Whether a merchant rescue is available for this failed dive. */
  rescueOffered: boolean;
  rescueCost: number;
  playerCoins: number;
  /** Pay the fee to salvage the haul (failure only). */
  onRescue: () => void;
  /** Accept the result as-is: continue (success) or let the haul go (failure). */
  onContinue: () => void;
  /** Bank the result and immediately start another dive. */
  onRetry: () => void;
}

const Stat: React.FC<{ label: string; value: React.ReactNode; color: string; delay: number }> = ({
  label,
  value,
  color,
  delay,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-slate-800/50 rounded-xl px-2 py-2 text-center"
  >
    <p className="text-[9px] uppercase tracking-wide text-slate-400 font-bold mb-0.5">{label}</p>
    <p className={`text-base font-black ${color}`}>{value}</p>
  </motion.div>
);

export const DiveReportModal: React.FC<DiveReportModalProps> = ({
  outcome,
  maxDepth,
  diveDuration,
  shellsCollected,
  rareCollected,
  coinsEarned,
  foodEarned,
  potentialCoins,
  potentialFood,
  previousStreak,
  rescueOffered,
  rescueCost,
  playerCoins,
  onRescue,
  onContinue,
  onRetry,
}) => {
  const isSuccess = outcome === 'surfaced';
  const isShark = outcome === 'shark';
  const canAffordRescue = playerCoins >= rescueCost;

  useEffect(() => {
    if (isSuccess) soundManager.playLevelUp();
    else soundManager.playSharkAttack();
  }, [isSuccess]);

  const accent = isSuccess ? 'emerald' : 'rose';
  const badge = isSuccess ? '✓' : isShark ? '🦈' : '💀';
  const title = isSuccess ? 'SURFACED SAFELY' : isShark ? 'SHARK ATTACK' : 'OUT OF AIR';
  const subtitle = isSuccess
    ? 'You made it back with your haul intact.'
    : isShark
      ? 'A reef shark cut off your ascent — the basket spilled.'
      : 'You ran out of air before reaching the surface — the basket spilled.';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none"
    >
      <motion.div
        initial={{ scale: 0.85, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className={`relative w-full max-w-sm rounded-3xl border-2 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 p-5 shadow-2xl ${
          isSuccess ? 'border-emerald-500/50' : 'border-rose-500/50'
        }`}
        style={{
          boxShadow: isSuccess
            ? '0 0 44px rgba(16,185,129,0.28), inset 0 1px 0 rgba(255,255,255,0.08)'
            : '0 0 44px rgba(244,63,94,0.28), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        {/* Header badge + title */}
        <div className="flex flex-col items-center text-center mb-4">
          <motion.div
            initial={{ scale: 0.7, rotate: isSuccess ? 0 : -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 14 }}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-2 shadow-xl ${
              isSuccess
                ? 'bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700'
                : 'bg-gradient-to-br from-amber-500 via-rose-600 to-rose-900'
            }`}
          >
            <div className="w-[54px] h-[54px] rounded-[14px] bg-slate-950 flex items-center justify-center">
              {badge}
            </div>
          </motion.div>
          <h2 className={`text-xl font-black uppercase tracking-tight ${isSuccess ? 'text-emerald-300' : 'text-rose-300'}`}>
            {title}
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5 max-w-[260px]">{subtitle}</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <Stat label="Max Depth" value={`${maxDepth}m`} color="text-cyan-300" delay={0.05} />
          <Stat label="Time" value={`${diveDuration.toFixed(1)}s`} color="text-blue-300" delay={0.1} />
          <Stat
            label="Items"
            value={
              <span className="flex items-center justify-center gap-1">
                <TrendingUp size={12} className="text-amber-300" />
                {shellsCollected}
              </span>
            }
            color="text-emerald-300"
            delay={0.15}
          />
        </div>

        {/* Earnings / loss summary */}
        {isSuccess ? (
          <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/30 p-3 space-y-1.5 mb-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-300 flex items-center gap-1">
                💎 Pearls Earned
                {rareCollected > 0 && (
                  <span className="text-[10px] bg-purple-500/30 px-1.5 py-0.5 rounded text-purple-300 font-mono">
                    +{rareCollected} rare
                  </span>
                )}
              </span>
              <span className="font-mono font-black text-yellow-300">+{coinsEarned}</span>
            </div>
            {foodEarned > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">🐟 Fish Caught</span>
                <span className="font-mono font-black text-emerald-300">+{foodEarned}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 space-y-1.5 mb-4 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-semibold">Streak</span>
              <span className="font-mono">
                <span className="text-slate-400 line-through font-bold">{previousStreak}x</span>
                <span className="text-rose-400 font-black ml-1">→ reset</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-semibold">Treasure at Risk</span>
              <span className="font-mono font-black text-amber-300">💎 {potentialCoins}{potentialFood > 0 ? ` · 🐟 ${potentialFood}` : ''}</span>
            </div>
          </div>
        )}

        {/* Inline merchant rescue (failure only) */}
        {!isSuccess && rescueOffered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-xl border-2 p-3 mb-3 ${
              canAffordRescue ? 'bg-amber-950/40 border-amber-500/50' : 'bg-slate-900/50 border-slate-700/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wide font-black text-amber-300">🚤 Merchant Rescue</span>
              <span className="text-[10px] text-slate-400">Your pearls: <span className={canAffordRescue ? 'text-amber-300 font-bold' : 'text-slate-500 font-bold'}>{playerCoins}</span></span>
            </div>
            <p className="text-[11px] text-slate-300 mb-2">Pay <span className="font-black text-amber-300">{rescueCost} 💎</span> to salvage your basket and keep the haul.</p>
            <motion.button
              animate={canAffordRescue ? { scale: [1, 1.06, 1] } : { scale: 1 }}
              transition={canAffordRescue ? { repeat: Infinity, duration: 1.2, ease: 'easeInOut' } : {}}
              whileHover={canAffordRescue ? { scale: 1.08 } : {}}
              whileTap={canAffordRescue ? { scale: 0.97 } : {}}
              onClick={canAffordRescue ? onRescue : undefined}
              disabled={!canAffordRescue}
              className={`w-full py-2.5 rounded-xl font-black text-sm uppercase tracking-wide transition-all ${
                canAffordRescue
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-lg cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              {canAffordRescue ? `Rescue for ${rescueCost} 💎` : 'Not enough pearls'}
            </motion.button>
          </motion.div>
        )}

        {/* Primary actions */}
        <div className="space-y-2">
          {isSuccess ? (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onContinue}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black text-sm uppercase tracking-wider shadow-lg cursor-pointer"
              >
                Continue
              </motion.button>
              <button
                onClick={onRetry}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                🤿 Dive Again
              </button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onRetry}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-sm uppercase tracking-wider shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                🤿 Retry Dive
              </motion.button>
              <button
                onClick={onContinue}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                {rescueOffered ? 'Let it go — Return to Village' : 'Return to Village'}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
