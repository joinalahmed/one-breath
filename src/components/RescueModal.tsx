import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Shield, Zap } from 'lucide-react';

interface RescueModalProps {
  outcome: 'drowned' | 'shark';
  treasureValue: number;
  rescueCost: number;
  playerCoins: number;
  onRescue: () => void;
  onAcceptLoss: () => void;
}

export const RescueModal: React.FC<RescueModalProps> = ({
  outcome,
  treasureValue,
  rescueCost,
  playerCoins,
  onRescue,
  onAcceptLoss,
}) => {
  const canAffordRescue = playerCoins >= rescueCost;
  const isSafe = outcome === 'drowned';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-40"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className={`rounded-2xl p-6 border-2 max-w-xs ${
          isSafe
            ? 'bg-blue-950/90 border-blue-500/60'
            : 'bg-rose-950/90 border-rose-500/60'
        }`}
      >
        {/* Icon */}
        <motion.div
          animate={{ rotate: isSafe ? 0 : [0, -5, 5, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className={`text-5xl mb-4 text-center ${
            isSafe ? 'text-blue-300' : 'text-rose-300'
          }`}
        >
          {isSafe ? '💨' : '🦈'}
        </motion.div>

        {/* Title */}
        <h2 className="text-xl font-black text-white mb-2 text-center">
          {isSafe ? 'OUT OF AIR!' : 'SHARK ATTACK!'}
        </h2>

        {/* Description */}
        <p className={`text-sm mb-4 text-center ${
          isSafe ? 'text-blue-200' : 'text-rose-200'
        }`}>
          You lost your catch, but a passing merchant can help!
        </p>

        {/* Treasure info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 p-3 rounded-lg bg-slate-900/60 border border-slate-700 text-center"
        >
          <p className="text-xs text-slate-400 mb-1">Treasure Lost</p>
          <p className="text-lg font-black text-amber-300">💎 {treasureValue}</p>
        </motion.div>

        {/* Rescue option */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`mb-4 p-3 rounded-lg border-2 ${
            canAffordRescue
              ? isSafe
                ? 'bg-blue-900/40 border-blue-500/60'
                : 'bg-rose-900/40 border-rose-500/60'
              : 'bg-slate-900/40 border-slate-600/40 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {isSafe ? (
                <Shield size={16} className="text-blue-400" />
              ) : (
                <AlertTriangle size={16} className="text-rose-400" />
              )}
              <span className="text-xs font-bold text-slate-300 uppercase">Merchant Rescue</span>
            </div>
            <span className="text-[10px] px-2 py-1 rounded bg-slate-800 text-amber-300 font-bold">
              {rescueCost} 💎
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            Pay the merchant to recover your treasure
          </p>
        </motion.div>

        {/* Your coins info */}
        <div className="mb-4 text-xs text-center">
          <p className="text-slate-400 mb-1">Your Pearls</p>
          <p className={`font-black text-base ${
            canAffordRescue ? 'text-amber-300' : 'text-slate-500'
          }`}>
            {playerCoins} 💎
          </p>
          {!canAffordRescue && (
            <p className="text-rose-400 text-[9px] mt-1">
              Need {rescueCost - playerCoins} more pearls
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAcceptLoss}
            className="flex-1 px-3 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold text-xs transition-all"
          >
            Lose Treasure 😢
          </motion.button>

          <motion.button
            whileHover={canAffordRescue ? { scale: 1.05 } : {}}
            whileTap={canAffordRescue ? { scale: 0.95 } : {}}
            onClick={onRescue}
            disabled={!canAffordRescue}
            className={`flex-1 px-3 py-2.5 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              canAffordRescue
                ? isSafe
                  ? 'bg-blue-500 hover:bg-blue-400 text-white'
                  : 'bg-rose-500 hover:bg-rose-400 text-white'
                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
            }`}
          >
            {canAffordRescue ? (
              <>
                <Zap size={14} />
                Rescue
              </>
            ) : (
              'No Funds'
            )}
          </motion.button>
        </div>

        {/* Flavor text */}
        <p className="text-[9px] text-slate-500 text-center mt-3 italic">
          {isSafe
            ? '💭 "I can save your haul... for a price."'
            : '💭 "That shark nearly got me too... help me out?"'}
        </p>
      </motion.div>
    </motion.div>
  );
};
