import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isReady, setIsReady] = useState(false);
  const reduceMotion = useReducedMotion();

  // Show the splash background for ~5s, then fade out and hand off.
  useEffect(() => {
    const timer = window.setTimeout(() => setIsReady(true), reduceMotion ? 0 : 4400);
    return () => window.clearTimeout(timer);
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
    </motion.section>
  );
};
