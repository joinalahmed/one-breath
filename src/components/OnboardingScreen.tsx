import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Volume2, VolumeX } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const steps = [
    {
      title: 'Welcome, Freediver! 🤿',
      subtitle: 'Join the Pearl Coast Haven',
      description: 'You\'re about to descend into the ocean\'s mysteries. Collect treasures, upgrade your gear, and build your village.',
      icon: '🌊',
      action: 'Begin',
      animation: 'bounce',
    },
    {
      title: 'Hold Your Breath 💨',
      description: 'You start with 100 air. Hold [Space] or tap to swim DOWN with your weight stone. Release to float UP. Simple, right?',
      icon: '💨',
      tips: [
        '⬇️ HOLDING DOWN = Descend with stone (fast!)',
        '⬆️ RELEASING = Float up (slower, but saves air)',
        '⚠️ Air drains FASTER the DEEPER you go!',
      ],
      warning: 'Run out of air = 💀 DROWNED',
    },
    {
      title: 'Treasure Everywhere 💎',
      description: 'Oysters hide pearls worth more the deeper you find them! Grab fish 🐟 for food. Different depth zones = different loot.',
      icon: '🐚',
      tips: [
        '0-15m: Easy pearls (2-5) 💚',
        '15-30m: Medium pearls (8-15) 💙',
        '30-45m: Giant pearls (50-80) 💜',
        '45-60m: LEGENDARY hauls (75-130) 🌟',
      ],
    },
    {
      title: 'The Magic X Button ⚖️',
      description: 'Grabbed too much treasure? Press X (Cut Stone) to DROP your weight stone. You\'ll zoom back up, but lose descending power!',
      icon: '✂️',
      tips: [
        '✅ Use it to escape sharks!',
        '✅ Use it when panicking (no air left)',
        '⚠️ Perfect timing = victory',
        '❌ Bad timing = missed treasure',
      ],
    },
    {
      title: 'Beware! 🦈 Shark Alert',
      description: 'A hungry shark patrols at 31m depth. It moves in patterns. Watch where it\'s swimming—time your dives carefully!',
      icon: '🦈',
      tips: [
        '🚫 Get too close = DEVOURED',
        '📍 Fixed depth zone (around 31m)',
        '🔄 Predictable movement = exploitable',
        '💡 Upgrade Shark Repellent to reduce danger',
      ],
      warning: 'Shark attack = 💀 GAME OVER',
    },
    {
      title: 'Level Up Your Gear ⚙️',
      description: 'Spend pearls on upgrades! Each upgrade stacks and gets more expensive. More lungs? Faster fins? Bigger basket? It\'s up to you!',
      icon: '⚙️',
      tips: [
        '🫁 Lung Training: Stay deep longer',
        '🪸 Fast Fins: Move quicker (escape sharks!)',
        '🧺 Larger Basket: Carry more treasure',
        '🥽 Pearl Goggles: Spot more valuable items',
      ],
    },
    {
      title: 'Daily Quests 📋',
      description: 'Complete daily challenges for bonus pearls! Pearl Collector, Safe Diver, Rare Species Hunter—there\'s always something to do.',
      icon: '⭐',
      tips: [
        '💎 Pearl Collector: Gather lots of pearls',
        '🤿 Safe Freediver: Survive multiple dives',
        '🌊 Trench Explorer: Reach 25m depth',
        '🐙 Rare Hunter: Catch special creatures',
      ],
    },
    {
      title: 'Ready to Dive? 🏁',
      description: 'You\'ve got the basics. Now jump in! Fail, learn, upgrade, repeat. Build your haven and become a legendary freediver!',
      icon: '🎉',
      action: 'Dive Now!',
      animation: 'dance',
    },
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
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
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 py-8 text-center max-w-md">
        {/* Progress indicator */}
        <div className="mb-8 flex gap-1">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i <= step ? 'bg-gradient-to-r from-cyan-400 to-blue-400' : 'bg-slate-700'
              }`}
              animate={{ width: i <= step ? 24 : 14 }}
            />
          ))}
        </div>

        {/* Icon with animation */}
        <motion.div
          key={`icon-${step}`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: 1,
            rotate: 0,
            ...(currentStep.animation === 'bounce' && {
              y: [0, -10, 0],
            }),
            ...(currentStep.animation === 'dance' && {
              rotate: [0, 5, -5, 5, -5, 0],
            }),
          }}
          transition={{
            type: 'spring',
            stiffness: 200,
            ...(currentStep.animation && { duration: 0.8 }),
          }}
          className="text-7xl mb-6 inline-block"
        >
          {currentStep.icon}
        </motion.div>

        {/* Title and subtitle */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`title-${step}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-black text-white mb-2">{currentStep.title}</h1>
            {currentStep.subtitle && (
              <p className="text-cyan-300 text-lg font-light mb-6">{currentStep.subtitle}</p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Description with emoji reactions */}
        <motion.p
          key={`desc-${step}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-slate-300 text-base leading-relaxed mb-6 max-w-xs font-medium"
        >
          {currentStep.description}
        </motion.p>

        {/* Tips list with visual markers */}
        {currentStep.tips && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mb-6 w-full bg-slate-800/60 rounded-lg p-4 border border-slate-600 backdrop-blur-sm"
          >
            {currentStep.tips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2.5 mb-2 last:mb-0"
              >
                <span className="text-sm mt-0.5 flex-shrink-0">{tip.substring(0, 3)}</span>
                <p className="text-sm text-slate-200 text-left font-medium">{tip.substring(3).trim()}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Warning if present */}
        {currentStep.warning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6 px-4 py-2.5 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-300 font-bold text-sm"
          >
            {currentStep.warning}
          </motion.div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 w-full mt-auto pb-6">
          {step > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(step - 1)}
              className="flex-1 px-4 py-3 rounded-lg border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white transition-colors font-bold"
            >
              ← Back
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            {currentStep.action || 'Next'}
            <ChevronRight size={18} />
          </motion.button>
        </div>

        {/* Skip button with urgency */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSkip}
          className="text-slate-400 hover:text-slate-200 text-xs transition-colors font-semibold"
        >
          {step === steps.length - 1 ? 'Jump In' : 'Skip Tutorial'}
        </motion.button>
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
