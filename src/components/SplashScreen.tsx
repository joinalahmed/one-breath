import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isReady, setIsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const reduceMotion = useReducedMotion();

  // Preload all assets and track progress
  useEffect(() => {
    let isMounted = true;

    const preloadAssets = async () => {
      try {
        // Critical assets needed before showing game
        const criticalAssets = [
          '/assets/splash-screen.png',
          '/assets/the_ascent_splash_loop_3s.gif',
          '/manifest.json',
        ];

        let completed = 0;
        for (const asset of criticalAssets) {
          if (!isMounted) return;

          try {
            await fetch(asset);
            completed++;
            setLoadProgress((completed / criticalAssets.length) * 100);
          } catch {
            // Asset failed but continue - don't block on preload errors
            completed++;
            setLoadProgress((completed / criticalAssets.length) * 100);
          }
        }

        // After critical assets, wait minimum splash duration
        if (isMounted) {
          await new Promise(resolve =>
            setTimeout(resolve, reduceMotion ? 0 : 4400)
          );
          setIsReady(true);
        }
      } catch {
        if (isMounted) setIsReady(true);
      }
    };

    preloadAssets();
    return () => { isMounted = false; };
  }, [reduceMotion]);

  useEffect(() => {
    if (!isReady) return;
    const timer = window.setTimeout(onComplete, reduceMotion ? 0 : 600);
    return () => window.clearTimeout(timer);
  }, [isReady, onComplete, reduceMotion]);

  return (
    <motion.section
      initial={{ opacity: 1 }}
      animate={{ opacity: isReady ? 0 : 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.6 }}
      className="absolute inset-0 z-50 min-h-[100dvh] overflow-hidden bg-[#04141f]"
      aria-label="One Breath loading screen"
      style={{
        backgroundImage: 'url(/assets/splash-screen.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Animated splash loop — full-bleed background, no chrome. The static
          splash-screen.png (section background) shows until the gif loads. */}
      <img
        src="/assets/the_ascent_splash_loop_3s.gif"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />

      {/* Loading progress bar */}
      <div className="absolute bottom-8 left-0 right-0 px-8">
        <div className="h-1 w-full bg-slate-700/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '5%' }}
            animate={{ width: `${Math.min(loadProgress, 95)}%` }}
            transition={{ type: 'spring', damping: 25, stiffness: 50 }}
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg"
          />
        </div>
        <p className="text-center text-xs text-slate-300 mt-2 font-mono">
          {Math.round(Math.min(loadProgress, 100))}%
        </p>
      </div>
    </motion.section>
  );
};
