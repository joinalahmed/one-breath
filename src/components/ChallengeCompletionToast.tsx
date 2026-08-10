import React, { useEffect } from 'react';
import { motion } from 'motion/react';

interface ChallengeCompletionToastProps {
  challengeTitle: string;
  rewardCoins: number;
  onDismiss: () => void;
}

export const ChallengeCompletionToast: React.FC<ChallengeCompletionToastProps> = ({
  challengeTitle,
  rewardCoins,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ scale: 0.8, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
    >
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 border-2 border-emerald-400 rounded-2xl px-6 py-3 shadow-2xl backdrop-blur-sm flex items-center space-x-3">
        <span className="text-2xl">✓</span>
        <div className="text-left">
          <p className="text-sm font-black text-emerald-50 uppercase tracking-tight">Challenge Complete!</p>
          <p className="text-xs text-emerald-100">{challengeTitle}</p>
        </div>
        <div className="text-right ml-4">
          <p className="text-lg font-black text-yellow-300">+{rewardCoins}</p>
          <p className="text-[10px] text-emerald-100 uppercase font-bold">💎</p>
        </div>
      </div>
    </motion.div>
  );
};
