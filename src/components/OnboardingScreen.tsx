import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronRight, Gem, Hand, Volume2, VolumeX, Waves } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const ZONES = [
  { depth: '0-15 m', name: 'Shallow Reef', reward: '2-5 pearls', tone: 'zone-cyan' },
  { depth: '15-30 m', name: 'Reef Drop', reward: '8-15 pearls', tone: 'zone-blue' },
  { depth: '30-45 m', name: 'Shark Trench', reward: '25-80 pearls', tone: 'zone-indigo' },
  { depth: '45-60 m', name: 'Deep Abyss', reward: '75-150+ legendary', tone: 'zone-abyss' },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const reduceMotion = useReducedMotion();

  const next = () => {
    if (step === 0) setStep(1);
    else onComplete();
  };

  return (
    <section className="ocean-screen absolute inset-0 z-50 min-h-[100dvh] overflow-hidden text-slate-100">
      <div className="ocean-caustics" aria-hidden="true" />
      <div className="ocean-grain" aria-hidden="true" />

      <button
        type="button"
        onClick={() => setIsMuted((value) => !value)}
        className="ocean-icon-button absolute right-5 top-[max(1.25rem,env(safe-area-inset-top))] z-20"
        aria-label={isMuted ? 'Turn sound on' : 'Mute sound'}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      <div className="relative flex h-full min-h-[100dvh] flex-col px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(5rem,calc(env(safe-area-inset-top)+3.5rem))]">
        <AnimatePresence mode="wait" initial={false}>
          {step === 0 ? (
            <motion.div
              key="breath"
              initial={reduceMotion ? false : { opacity: 0, x: 22 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -22 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-1 flex-col"
            >
              <header>
                <h1 className="text-4xl font-extrabold leading-[0.95] tracking-tight text-cyan-100">Hold your breath</h1>
                <p className="mt-3 text-base text-slate-300">One gesture. Two directions.</p>
              </header>

              <div className="relative my-auto flex min-h-72 items-center justify-center" aria-hidden="true">
                <motion.div
                  animate={reduceMotion ? undefined : { scale: [0.9, 1.06, 0.9], opacity: [0.55, 0.95, 0.55] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="breath-orbit breath-orbit--outer"
                />
                <motion.div
                  animate={reduceMotion ? undefined : { scale: [1.06, 0.94, 1.06] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="breath-orbit breath-orbit--inner"
                />
                <Waves size={46} className="relative text-cyan-200" strokeWidth={1.35} />
              </div>

              <p className="mx-auto max-w-sm text-center text-lg leading-relaxed text-slate-200">
                Press and hold to descend with the stone. Release to rise.
              </p>

              <div className="my-6 grid grid-cols-2 divide-x divide-cyan-100/15 border-y border-cyan-100/10 py-4">
                <div className="flex flex-col items-center gap-2 text-center">
                  <Hand size={25} className="rotate-180 text-cyan-200" strokeWidth={1.5} />
                  <span className="text-xs font-bold tracking-[0.16em] text-cyan-100">HOLD</span>
                  <span className="text-xs text-slate-400">Descend</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <Hand size={25} className="text-cyan-200" strokeWidth={1.5} />
                  <span className="text-xs font-bold tracking-[0.16em] text-cyan-100">RELEASE</span>
                  <span className="text-xs text-slate-400">Ascend</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="treasure"
              initial={reduceMotion ? false : { opacity: 0, x: 22 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -22 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-1 flex-col"
            >
              <header>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[14px] border border-cyan-200/20 bg-cyan-200/10 text-cyan-100">
                  <Gem size={23} strokeWidth={1.5} />
                </div>
                <h1 className="text-4xl font-extrabold leading-[0.95] tracking-tight text-cyan-100">Treasure awaits</h1>
                <p className="mt-3 text-base text-slate-300">Deeper water. Rarer finds.</p>
              </header>

              <div className="relative my-7 flex-1 overflow-hidden rounded-[16px] border border-cyan-100/10 bg-slate-950/35">
                <div className="absolute bottom-0 left-5 top-0 w-px bg-gradient-to-b from-cyan-300 via-blue-400 to-indigo-400" aria-hidden="true" />
                {ZONES.map((zone, index) => (
                  <motion.div
                    key={zone.name}
                    initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.35 }}
                    className={`depth-zone ${zone.tone}`}
                  >
                    <span className="depth-zone__marker" aria-hidden="true" />
                    <div>
                      <p className="text-sm tabular-nums text-slate-300">{zone.depth}</p>
                      <h2 className="mt-1 text-lg font-bold text-slate-50">{zone.name}</h2>
                    </div>
                    <span className="max-w-28 text-right text-sm font-semibold">{zone.reward}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button whileTap={{ scale: 0.98, y: 1 }} onClick={next} className="ocean-primary-button w-full">
          <span>{step === 0 ? 'Got it, next' : 'Ready to dive'}</span>
          <ChevronRight size={20} aria-hidden="true" />
        </motion.button>
        <div className="mt-5 flex justify-center gap-2" aria-label={`Step ${step + 1} of 2`}>
          {[0, 1].map((index) => (
            <span key={index} className={`h-1 rounded-full transition-all ${step === index ? 'w-8 bg-cyan-200' : 'w-2 bg-slate-600'}`} />
          ))}
        </div>
      </div>
    </section>
  );
};
