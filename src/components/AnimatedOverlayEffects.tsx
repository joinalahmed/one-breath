import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { DiverRankInfo } from '../ranks';
import { soundManager } from '../audioAndHaptics';

// -------------------------------------------------------------
// 1. RANK UP MODAL (Celebratory Level/Rank Promotion)
// -------------------------------------------------------------
interface RankUpModalProps {
  rank: DiverRankInfo;
  onClose: () => void;
}

export const RankUpModal: React.FC<RankUpModalProps> = ({ rank, onClose }) => {
  useEffect(() => {
    soundManager.playLevelUp();

    // Trigger celebratory confetti cannon burst
    const count = 200;
    const defaults = { origin: { y: 0.6 } };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#38bdf8', '#fbbf24'] });
    fire(0.2, { spread: 60, colors: ['#f43f5e', '#a855f7'] });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 overflow-hidden select-none"
    >
      {/* Sunburst Rays Background Animation */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
        className="absolute w-[600px] h-[600px] pointer-events-none opacity-20"
        style={{
          background:
            'conic-gradient(from 0deg, #fbbf24 0deg 15deg, transparent 15deg 30deg, #38bdf8 30deg 45deg, transparent 45deg 60deg, #a855f7 60deg 75deg, transparent 75deg 90deg, #f43f5e 90deg 105deg, transparent 105deg 120deg, #34d399 120deg 135deg, transparent 135deg 150deg)',
          borderRadius: '50%',
        }}
      />

      <motion.div
        initial={{ scale: 0.2, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.2, y: 50, opacity: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="relative z-10 max-w-sm w-full bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 text-center shadow-[0_0_50px_rgba(251,191,36,0.3)] flex flex-col items-center"
      >
        <div className="text-[10px] font-black tracking-widest text-amber-400 uppercase bg-amber-950/80 border border-amber-500/50 px-3 py-1 rounded-full mb-3">
          🏆 RANK PROMOTION UNLOCKED!
        </div>

        {/* 3D Badge Drop Bounce */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, -5, 5, 0],
            y: [0, -8, 0],
          }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700 p-1 shadow-2xl flex items-center justify-center my-3 relative"
        >
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-5xl shadow-inner">
            {rank.badgeEmoji}
          </div>
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute -inset-2 rounded-3xl border-2 border-amber-300/60 pointer-events-none"
          />
        </motion.div>

        <h2 className="text-2xl font-black text-white tracking-tight mt-1">{rank.title}</h2>
        <p className="text-xs font-bold text-amber-300 font-mono mt-0.5">{rank.koreanTitle}</p>

        <div className="my-4 w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-3 text-left space-y-2 text-xs">
          <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
            <span className="text-slate-400 font-semibold">Rank Tier:</span>
            <span className="font-mono font-black text-amber-400">LEVEL {rank.level}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
            <span className="text-slate-400 font-semibold">Requirement:</span>
            <span className="font-mono text-cyan-300">{rank.minDepth}m Depth or {rank.minCoins} 💎</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block mb-0.5">Unlocked Rank Perk:</span>
            <span className="font-bold text-emerald-300 flex items-center space-x-1">
              <span>✨</span>
              <span>{rank.perk}</span>
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(251,191,36,0.5)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            soundManager.playConfirm();
            onClose();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm tracking-wider uppercase shadow-xl cursor-pointer"
        >
          CLAIM RANK BADGE & CONTINUE!
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// -------------------------------------------------------------
// 2. CANDY CRUSH STREAK COMBO BANNER
// -------------------------------------------------------------
interface StreakComboBannerProps {
  streak: number;
  onDismiss?: () => void;
}

export const StreakComboBanner: React.FC<StreakComboBannerProps> = ({ streak, onDismiss }) => {
  if (streak <= 1) return null;

  let bannerTitle = 'TASTY STREAK! 🔥';
  let bannerSubtitle = `${streak}x DIVE MULTIPLIER ACTIVE!`;
  let bannerColor = 'from-amber-400 to-orange-500';

  if (streak >= 10) {
    bannerTitle = 'DIVING GODDESS! 👑⚡';
    bannerSubtitle = `INSANE ${streak}x PEARL MULTIPLIER!`;
    bannerColor = 'from-purple-400 via-pink-500 to-amber-400';
  } else if (streak >= 5) {
    bannerTitle = 'PEARL RUSH! 💎🔥';
    bannerSubtitle = `HUGE ${streak}x MULTIPLIER BOOST!`;
    bannerColor = 'from-amber-300 via-yellow-400 to-emerald-400';
  } else if (streak >= 3) {
    bannerTitle = 'DIVING FRENZY! ⚡';
    bannerSubtitle = `HOT ${streak}x STREAK COMBO!`;
    bannerColor = 'from-cyan-400 to-blue-500';
  }

  return (
    <motion.div
      initial={{ scale: 0, y: -30, rotate: -8 }}
      animate={{ scale: 1, y: 0, rotate: 0 }}
      exit={{ scale: 0, y: -20, opacity: 0 }}
      transition={{ type: 'spring', damping: 12, stiffness: 220 }}
      onClick={onDismiss}
      className="relative z-30 w-full mx-2 mb-2 p-0.5 rounded-2xl bg-gradient-to-r from-amber-400/40 via-rose-500/40 to-amber-400/40 shadow-[0_0_25px_rgba(251,191,36,0.2)] overflow-hidden cursor-pointer"
    >
      <div className="bg-slate-950/30 backdrop-blur-sm rounded-[14px] p-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <motion.div
            animate={{ scale: [1, 1.25, 1], rotate: [0, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bannerColor} p-0.5 flex items-center justify-center text-xl shadow-md`}
          >
            🔥
          </motion.div>
          <div>
            <div className="font-black text-xs uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400">
              {bannerTitle}
            </div>
            <div className="text-[10px] font-mono text-slate-300 font-bold">
              {bannerSubtitle}
            </div>
          </div>
        </div>

        <div className="bg-amber-950/80 border border-amber-500/60 px-2.5 py-1 rounded-xl text-center shadow-inner">
          <span className="text-[9px] uppercase font-bold text-amber-400 block tracking-widest">BOOST</span>
          <span className="text-sm font-black font-mono text-amber-300">{streak}x</span>
        </div>
      </div>
    </motion.div>
  );
};
