import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Camera, Sparkles } from 'lucide-react';
import { soundManager } from '../audioAndHaptics';

interface RareCreatureDiscoveryModalProps {
  itemType: string;
  itemName: string;
  emoji: string;
  rarity: string;
  depth: number;
  value: number;
  onComplete: () => void;
}

export const RareCreatureDiscoveryModal: React.FC<RareCreatureDiscoveryModalProps> = ({
  itemType,
  itemName,
  rarity,
  depth,
  value,
  onComplete,
}) => {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    soundManager.playLevelUp();

    if (!reduceMotion) {
      confetti({
        particleCount: 34,
        spread: 48,
        scalar: 0.7,
        origin: { y: 0.45 },
        colors: ['#a5f3fc', '#67e8f9', '#a5b4fc'],
      });
    }

    const timer = window.setTimeout(onComplete, 3500);
    return () => window.clearTimeout(timer);
  }, [onComplete, reduceMotion]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/78 p-5 backdrop-blur-md select-none pointer-events-none"
      role="status"
      aria-live="polite"
    >
      <motion.section
        initial={reduceMotion ? false : { scale: 0.9, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="relative w-full max-w-sm overflow-hidden rounded-[20px] border border-indigo-200/30 bg-slate-950/95 p-5 shadow-[0_24px_70px_rgba(30,58,138,0.38)]"
      >
        <div className="ocean-grain" aria-hidden="true" />
        <header className="relative flex items-center justify-center gap-2 text-center text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
          <Sparkles size={17} strokeWidth={1.5} aria-hidden="true" />
          {rarity} discovery
        </header>

        <div className="relative my-5 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[16px] border border-cyan-100/15 bg-[radial-gradient(circle_at_50%_44%,rgba(99,102,241,0.26),rgba(2,8,23,0.15)_45%,rgba(2,8,23,0.9)_75%)]">
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -8, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative grid h-28 w-28 place-items-center rounded-full border border-cyan-200/20 bg-cyan-200/[0.07] text-5xl font-black text-cyan-100 shadow-[0_0_48px_rgba(34,211,238,0.12)]"
            aria-hidden="true"
          >
            {itemName.slice(0, 1).toUpperCase()}
          </motion.div>
          <span className="absolute bottom-3 text-xs font-medium tracking-[0.16em] text-cyan-100/60">{itemType}</span>
        </div>

        <h2 className="text-center text-3xl font-extrabold leading-tight tracking-tight text-slate-50">{itemName}</h2>

        <div className="mt-5 grid grid-cols-2 divide-x divide-cyan-100/10 border-y border-cyan-100/10 py-4 text-center">
          <div>
            <p className="text-xs text-slate-500">Depth</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-cyan-100">{depth} m</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Value</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-cyan-100">{value}</p>
          </div>
        </div>

        <p className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-300">
          <Camera size={18} className="text-cyan-200" strokeWidth={1.5} />
          Added to your Photo Library
        </p>
        <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Continuing dive</p>
      </motion.section>
    </motion.div>
  );
};
