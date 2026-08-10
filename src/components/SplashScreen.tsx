import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(onComplete, 600);
      return () => clearTimeout(timer);
    }
  }, [isReady, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isReady ? 0 : 1 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center z-50 overflow-hidden"
    >
      {/* Animated waves background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-500/20 to-transparent"
        />
        <motion.div
          animate={{ y: [20, 0, 20] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-cyan-400/20 to-transparent"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center flex flex-col items-center justify-center gap-4">
        {/* Animated title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          <div className="text-7xl mb-2">🌊</div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            ONE
            <br />
            <span className="text-cyan-400">BREATH</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-slate-400 text-sm tracking-widest font-light"
        >
          FREEDIVER HAVEN
        </motion.p>

        {/* Loading bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 w-24 h-1 bg-slate-700 rounded-full overflow-hidden"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isReady ? '100%' : '60%' }}
            transition={{ duration: isReady ? 0.4 : 2, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-cyan-400 to-cyan-300 rounded-full"
          />
        </motion.div>

        {/* Animated icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex gap-8 mt-12 text-4xl"
        >
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            🤿
          </motion.div>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}>
            🐚
          </motion.div>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}>
            💎
          </motion.div>
        </motion.div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isReady ? 0 : 1 }}
          transition={{ delay: 1.5 }}
          className="text-slate-500 text-xs mt-8 font-light tracking-widest"
        >
          LOADING...
        </motion.p>
      </div>

      {/* Tap to continue hint (appears near end) */}
      {isReady && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-8 text-slate-400 text-xs"
        >
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            Tap to continue...
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};
