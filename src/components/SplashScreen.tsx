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
      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.02\' /%3E%3C/svg%3E")' }}
    >
      {/* Ocean wave visualization */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <motion.div
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/3 left-0 w-full h-48 bg-gradient-to-b from-cyan-400 to-transparent blur-3xl"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center flex flex-col items-center justify-center gap-6">
        {/* Animated title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 15 }}
          className="flex flex-col items-center"
        >
          <h1 className="text-display-lg text-cyan-400 uppercase">
            ONE BREATH
          </h1>
          <p className="text-label text-slate-400 mt-3 tracking-widest">
            FREEDIVER HAVEN
          </p>
        </motion.div>

        {/* Diver silhouette or wave illustration (120x120px) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-9xl mt-8"
        >
          🌊
        </motion.div>

        {/* BEGIN JOURNEY Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="mt-16 px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-ocean-lg glow-cyan transition-all"
        >
          Begin Journey
        </motion.button>

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
