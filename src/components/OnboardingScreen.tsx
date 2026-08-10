import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Volume2, VolumeX } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Screen 2: Hold Your Breath - Breathing visualization
  const screen1 = {
    title: 'HOLD YOUR BREATH 💨',
    copy: 'Hold [Space] to descend with your weight stone. Release to float up. Simple? 😊',
    hasVisual: true,
    action: 'GOT IT, NEXT →',
  };

  // Screen 3: Treasure Awaits - Depth zones
  const screen2 = {
    title: 'TREASURE AWAITS 💎',
    subtitle: 'Deeper = Better Loot',
    zones: [
      { depth: '0-15m', name: 'Shallow Reef', reward: 'Pearls: 2-5 💚', color: 'cyan' },
      { depth: '15-30m', name: 'Mid Reef Drop', reward: 'Pearls: 8-15 💙', color: 'blue' },
      { depth: '30-45m', name: 'Shark Trench', reward: 'Pearls: 25-80 💜', color: 'indigo' },
      { depth: '45-60m', name: 'Deep Abyss', reward: 'Pearls: 75-150+ ⭐ LEGENDARY', color: 'rose' },
    ],
    action: 'READY TO DIVE',
  };

  const screens = [screen1, screen2];
  const currentScreen = screens[step];

  const handleNext = () => {
    if (step < screens.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 flex flex-col items-center justify-center z-50 overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating emojis */}
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-8 left-8 text-7xl opacity-20"
        >
          🌊
        </motion.div>
        <motion.div
          animate={{ y: [0, 30, 0], x: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-16 right-8 text-6xl opacity-20"
        >
          🐚
        </motion.div>
        <motion.div
          animate={{ x: [-20, 20, -20], rotate: [0, 360] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/3 right-16 text-5xl opacity-15"
        >
          💎
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between px-6 py-8 text-center max-w-md">
        {/* Safe area top spacer */}
        <div className="h-4" />

        <AnimatePresence mode="wait">
          {step === 0 ? (
            // SCREEN 1: Hold Your Breath
            <motion.div
              key="screen-1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center flex-1 gap-6 w-full"
            >
              <h1 className="text-headline-lg text-cyan-400 uppercase">Hold Your Breath 💨</h1>

              {/* Breathing visualization - expanding/contracting circles */}
              <motion.div className="flex gap-8 items-center justify-center my-8">
                <motion.div
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 opacity-60"
                />
                <motion.div
                  animate={{ scale: [1.4, 1, 1.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 opacity-40"
                />
              </motion.div>

              <p className="text-slate-300 text-base leading-relaxed max-w-xs font-medium">
                Hold [Space] to descend with your weight stone. Release to float up. Simple? 😊
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="mt-8 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-black text-sm uppercase tracking-wide shadow-ocean-md transition-all duration-200"
              >
                GOT IT, NEXT →
              </motion.button>
            </motion.div>
          ) : (
            // SCREEN 2: Treasure Awaits
            <motion.div
              key="screen-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center flex-1 gap-4 w-full"
            >
              <h1 className="text-headline-lg text-cyan-400 uppercase">Treasure Awaits 💎</h1>
              <p className="text-slate-400 text-sm mb-2">Deeper = Better Loot</p>

              {/* Depth zone cards */}
              <div className="w-full space-y-3 my-6">
                {screen2.zones.map((zone, idx) => {
                  const colorMap: Record<string, string> = {
                    cyan: 'border-cyan-400 text-cyan-200',
                    blue: 'border-blue-400 text-blue-200',
                    indigo: 'border-indigo-400 text-indigo-200',
                    rose: 'border-rose-400 text-rose-200',
                  };
                  const color = colorMap[zone.color];

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`border-2 ${color} rounded-xl px-4 py-3 bg-slate-700/30 backdrop-blur-sm`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-left">
                          <p className="font-bold text-sm">{zone.depth} {zone.name}</p>
                        </div>
                        <p className="text-sm font-semibold">{zone.reward}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="mt-8 px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-sm uppercase tracking-wide shadow-ocean-md glow-emerald transition-all duration-200"
              >
                READY TO DIVE
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom safe area spacer */}
        <div className="h-4" />
      </div>

      {/* Sound toggle (top right) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-6 right-6 p-3 rounded-lg bg-slate-800/60 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors z-20 backdrop-blur-sm"
        aria-label="Toggle sound"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </motion.button>
    </motion.div>
  );
};
