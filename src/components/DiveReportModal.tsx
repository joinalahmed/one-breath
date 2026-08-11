import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { AlertTriangle, Fish, Gem, RotateCcw, ShieldCheck, Waves } from 'lucide-react';
import { soundManager } from '../audioAndHaptics';

interface DiveReportModalProps {
  outcome: 'surfaced' | 'shark' | 'drowned';
  maxDepth: number;
  diveDuration: number;
  shellsCollected: number;
  rareCollected: number;
  coinsEarned: number;
  foodEarned: number;
  potentialCoins: number;
  potentialFood: number;
  previousStreak: number;
  rescueOffered: boolean;
  rescueCost: number;
  playerCoins: number;
  onRescue: () => void;
  onContinue: () => void;
  onRetry: () => void;
}

export const DiveReportModal: React.FC<DiveReportModalProps> = ({
  outcome,
  maxDepth,
  diveDuration,
  shellsCollected,
  rareCollected,
  coinsEarned,
  foodEarned,
  potentialCoins,
  potentialFood,
  previousStreak,
  rescueOffered,
  rescueCost,
  playerCoins,
  onRescue,
  onContinue,
  onRetry,
}) => {
  const isSuccess = outcome === 'surfaced';
  const isShark = outcome === 'shark';
  const canAffordRescue = playerCoins >= rescueCost;
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (isSuccess) soundManager.playLevelUp();
    else soundManager.playSharkAttack();
  }, [isSuccess]);

  const title = isSuccess ? 'Surfaced safely' : isShark ? 'Shark attack' : 'Out of air';
  const subtitle = isSuccess
    ? 'A clean dive. Everything comes home.'
    : isShark
      ? 'A reef shark cut off the ascent. The basket spilled.'
      : 'The surface was too far. The basket spilled.';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end bg-slate-950/75 backdrop-blur-sm select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dive-report-title"
    >
      <motion.section
        initial={reduceMotion ? false : { y: '100%' }}
        animate={{ y: 0 }}
        exit={reduceMotion ? undefined : { y: '100%' }}
        transition={{ type: 'spring', stiffness: 290, damping: 30 }}
        className={`relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[20px] border-x border-t bg-slate-950/95 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6 shadow-[0_-18px_60px_rgba(2,8,23,0.55)] ${
          isSuccess ? 'border-emerald-300/35' : 'border-rose-300/35'
        }`}
      >
        <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-slate-700" aria-hidden="true" />

        <header className="text-center">
          <div className={`mx-auto mb-4 grid h-14 w-14 place-items-center rounded-[16px] border ${
            isSuccess
              ? 'border-emerald-200/25 bg-emerald-300/10 text-emerald-200'
              : 'border-rose-200/25 bg-rose-300/10 text-rose-200'
          }`}>
            {isSuccess ? <ShieldCheck size={28} strokeWidth={1.5} /> : <AlertTriangle size={28} strokeWidth={1.5} />}
          </div>
          <h2 id="dive-report-title" className={`text-3xl font-extrabold tracking-tight ${isSuccess ? 'text-emerald-100' : 'text-rose-100'}`}>
            {title}
          </h2>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-400">{subtitle}</p>
        </header>

        <div className="my-6 grid grid-cols-[1.35fr_1fr] items-end gap-5">
          <div>
            <p className="text-sm font-medium text-slate-400">Maximum depth</p>
            <p className="mt-1 text-6xl font-extrabold leading-none tracking-tight tabular-nums text-cyan-100">
              {maxDepth}<span className="ml-1 text-2xl text-cyan-300">m</span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 border-l border-cyan-100/10 pl-5">
            <div>
              <p className="text-xs text-slate-500">Time</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-slate-100">{diveDuration.toFixed(1)}s</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Items</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-slate-100">{shellsCollected}</p>
            </div>
          </div>
        </div>

        {isSuccess ? (
          <div className="border-y border-cyan-100/10 py-2">
            <div className="flex items-center justify-between py-3">
              <span className="flex items-center gap-3 text-sm text-slate-300"><Gem size={20} className="text-cyan-200" />Pearls earned</span>
              <strong className="text-xl tabular-nums text-cyan-100">+{coinsEarned}</strong>
            </div>
            {foodEarned > 0 && (
              <div className="flex items-center justify-between py-3">
                <span className="flex items-center gap-3 text-sm text-slate-300"><Fish size={20} className="text-cyan-200" />Fuel recovered</span>
                <strong className="text-xl tabular-nums text-cyan-100">+{foodEarned}</strong>
              </div>
            )}
            {rareCollected > 0 && (
              <p className="pb-3 text-center text-sm font-medium text-emerald-200">
                {rareCollected} rare {rareCollected === 1 ? 'creature' : 'creatures'} photographed
              </p>
            )}
          </div>
        ) : (
          <div className="border-y border-rose-200/10 py-2">
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-slate-400">Streak lost</span>
              <strong className="tabular-nums text-rose-200">{previousStreak} dives</strong>
            </div>
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-slate-400">Treasure at risk</span>
              <strong className="tabular-nums text-amber-200">{potentialCoins} pearls{potentialFood > 0 ? `, ${potentialFood} fuel` : ''}</strong>
            </div>
          </div>
        )}

        {!isSuccess && rescueOffered && (
          <div className="my-4 rounded-[16px] border border-amber-200/20 bg-amber-200/[0.06] p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-amber-100">Merchant rescue</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">Recover the basket and protect the haul.</p>
              </div>
              <span className="shrink-0 text-sm tabular-nums text-slate-300">{playerCoins} owned</span>
            </div>
            <button
              type="button"
              onClick={onRescue}
              disabled={!canAffordRescue}
              className="mt-4 min-h-12 w-full rounded-[14px] border border-amber-100/30 bg-amber-300 text-sm font-extrabold uppercase tracking-[0.08em] text-slate-950 transition active:translate-y-px disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-500"
            >
              {canAffordRescue ? `Rescue for ${rescueCost} pearls` : 'Not enough pearls'}
            </button>
          </div>
        )}

        <div className="mt-5 space-y-3">
          <motion.button
            whileTap={{ scale: 0.98, y: 1 }}
            onClick={isSuccess ? onRetry : onRetry}
            className="ocean-primary-button w-full"
          >
            {isSuccess ? <Waves size={20} /> : <RotateCcw size={20} />}
            <span>{isSuccess ? 'Dive again' : 'Retry dive'}</span>
          </motion.button>
          <button
            type="button"
            onClick={onContinue}
            className="min-h-12 w-full rounded-[14px] border border-slate-700 bg-slate-900 text-sm font-bold text-slate-200 transition hover:bg-slate-800 active:translate-y-px"
          >
            {isSuccess ? 'Back to Haven' : rescueOffered ? 'Let it go. Return to Haven' : 'Return to Haven'}
          </button>
        </div>
      </motion.section>
    </motion.div>
  );
};
