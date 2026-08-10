import React from 'react';
import { motion } from 'motion/react';

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
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className={`rounded-lg p-3 border-2 w-64 ${
          isSafe
            ? 'bg-blue-950/95 border-blue-500/60'
            : 'bg-rose-950/95 border-rose-500/60'
        }`}
      >
        {/* Icon & Title */}
        <motion.div
          animate={{ rotate: isSafe ? 0 : [0, -5, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-center mb-2"
        >
          <div className={`text-3xl mb-1 ${
            isSafe ? 'text-blue-300' : 'text-rose-300'
          }`}>
            {isSafe ? '💨' : '🦈'}
          </div>
          <h2 className="text-sm font-black text-white">
            {isSafe ? 'OUT OF AIR!' : 'SHARK ATTACK!'}
          </h2>
        </motion.div>

        {/* Treasure value */}
        <div className="bg-slate-900/60 rounded p-2 mb-2 text-center border border-slate-700">
          <p className="text-[9px] text-slate-400 mb-0.5">Treasure Lost</p>
          <p className="text-base font-black text-amber-300">💎 {treasureValue}</p>
        </div>

        {/* Rescue offer */}
        <div className={`rounded p-2 mb-2 text-center border-2 ${
          canAffordRescue
            ? isSafe
              ? 'bg-blue-900/40 border-blue-500/40'
              : 'bg-rose-900/40 border-rose-500/40'
            : 'bg-slate-900/40 border-slate-600/40 opacity-60'
        }`}>
          <p className="text-[9px] text-slate-300 font-bold uppercase mb-1">Merchant Rescue</p>
          <p className="text-xs font-bold text-amber-300">Cost: {rescueCost} 💎</p>
        </div>

        {/* Your coins */}
        <div className="text-center mb-2 text-[9px]">
          <p className="text-slate-400">Your Pearls: <span className={`font-black ${canAffordRescue ? 'text-amber-300' : 'text-slate-500'}`}>{playerCoins}</span></p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAcceptLoss}
            className="flex-1 px-2 py-1.5 rounded text-xs font-bold bg-slate-700 hover:bg-slate-600 text-slate-100 transition-all"
          >
            Lose 😢
          </motion.button>

          <motion.button
            whileHover={canAffordRescue ? { scale: 1.05 } : {}}
            whileTap={canAffordRescue ? { scale: 0.95 } : {}}
            onClick={onRescue}
            disabled={!canAffordRescue}
            className={`flex-1 px-2 py-1.5 rounded text-xs font-bold transition-all ${
              canAffordRescue
                ? isSafe
                  ? 'bg-blue-500 hover:bg-blue-400 text-white'
                  : 'bg-rose-500 hover:bg-rose-400 text-white'
                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
            }`}
          >
            {canAffordRescue ? 'Rescue ⚡' : 'No $'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
