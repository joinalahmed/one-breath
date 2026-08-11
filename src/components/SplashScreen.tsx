import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronRight, Waves } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isReady, setIsReady] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(() => setIsReady(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);

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
      className="ocean-screen absolute inset-0 z-50 flex min-h-[100dvh] flex-col overflow-hidden text-slate-100"
      aria-label="One Breath loading screen"
    >
      <div className="ocean-caustics" aria-hidden="true" />
      <div className="ocean-grain" aria-hidden="true" />

      <div className="relative flex flex-1 flex-col items-center px-7 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(3.75rem,env(safe-area-inset-top))] text-center">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-[12vh]"
        >
          <h1 className="text-[clamp(2.5rem,12vw,4.25rem)] font-extrabold leading-none tracking-[0.14em] text-cyan-200 [text-shadow:0_2px_24px_rgba(34,211,238,0.2)]">ONE BREATH</h1>
          <p className="mt-4 text-sm font-semibold tracking-[0.34em] text-slate-300">FREEDIVER HAVEN</p>
        </motion.div>

        <div className="relative flex flex-1 items-center justify-center" aria-hidden="true">
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, 14, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
            className="relative flex h-48 w-32 items-center justify-center"
          >
            <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-cyan-200/70 via-cyan-300/20 to-transparent" />
            <div className="diver-mark">
              <span className="diver-mark__head" />
              <span className="diver-mark__body" />
              <span className="diver-mark__fins" />
            </div>
            <div className="absolute bottom-3 flex flex-col items-center gap-2 text-[10px] font-medium tabular-nums text-cyan-200/55">
              <span>10</span><span>20</span><span>30</span>
            </div>
          </motion.div>
        </div>

        <motion.button
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.55 }}
          whileTap={{ scale: 0.98, y: 1 }}
          onClick={onComplete}
          className="ocean-primary-button group w-full max-w-sm"
        >
          <Waves size={20} aria-hidden="true" />
          <span>Begin journey</span>
          <ChevronRight size={20} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </motion.button>

        <p className="mt-5 min-h-5 text-xs font-medium tracking-[0.2em] text-slate-400" aria-live="polite">
          {isReady ? 'READY' : 'PREPARING THE DIVE'}
        </p>
      </div>
    </motion.section>
  );
};
