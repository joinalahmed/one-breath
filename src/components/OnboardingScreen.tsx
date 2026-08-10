import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Volume2, VolumeX, Waves } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const steps = [
    {
      title: 'Welcome to One Breath',
      subtitle: 'Freediver Haven',
      description: 'Descend into the deep, collect treasures, and return safely to the surface.',
      icon: '🤿',
      action: 'Start',
    },
    {
      title: 'Control Your Breath',
      description: 'You start with 100 air. Tap/Hold to swim down, release to ascend. Air drains faster the deeper you go.',
      icon: '💨',
      tips: ['Hold to descend with your weight stone', 'Release to float back up', 'Watch your air gauge!'],
    },
    {
      title: 'Collect Treasures',
      description: 'Oysters contain pearls 💎. Grab fish 🐟 for food. Each depth zone has rarer treasures worth more.',
      icon: '🐚',
      tips: ['Shallow (0-15m): Easy pearls', 'Deep (30-45m): Giant oysters!', 'Deepest (45-60m): Legendary hauls'],
    },
    {
      title: 'Drop Your Stone',
      description: 'Press X or tap "Cut Stone" when deep. Drop your weight stone to ascend faster and save precious air.',
      icon: '⚖️',
      tips: ['Perfect for panic situations', 'Costs you descending speed', 'Time it wisely!'],
    },
    {
      title: 'Beware the Shark',
      description: 'A shark patrols at 31 meters. Avoid its zone or you\'ll be devoured! It moves in predictable patterns.',
      icon: '🦈',
      tips: ['Circles at fixed depth', 'Watch for movement patterns', 'Time your dives carefully'],
    },
    {
      title: 'Upgrade Your Gear',
      description: 'Use pearls to buy upgrades: lung training, faster fins, larger basket, and more. Each upgrade stacks!',
      icon: '⚙️',
      tips: ['Lung Training = more air', 'Fast Fins = quicker movement', 'Larger Basket = carry more treasure'],
    },
    {
      title: 'Daily Challenges',
      description: 'Complete daily tasks for bonus pearls. Gather shells, catch fish, reach depths, and stay safe.',
      icon: '📋',
      tips: ['Pearl Collector: Gather pearls', 'Safe Freediver: Complete 3 safe dives', 'Trench Explorer: Reach 25m depth'],
    },
    {
      title: 'Ready to Dive?',
      description: 'You\'re all set! Remember: survive, collect, upgrade, and build your haven. Good luck, freediver!',
      icon: '🌊',
      action: 'Begin Adventure',
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
      className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 flex flex-col items-center justify-center z-50"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-10 left-10 text-6xl opacity-20"
        >
          🌊
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-20 right-10 text-5xl opacity-20"
        >
          🐚
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 py-8 text-center max-w-md">
        {/* Progress indicator */}
        <div className="mb-8 flex gap-1">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              className={`h-1 rounded-full transition-all ${
                i <= step ? 'bg-cyan-400' : 'bg-slate-700'
              }`}
              animate={{ width: i <= step ? 20 : 12 }}
            />
          ))}
        </div>

        {/* Icon */}
        <motion.div
          key={`icon-${step}`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-7xl mb-6"
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
            <h1 className="text-3xl font-bold text-white mb-2">{currentStep.title}</h1>
            {currentStep.subtitle && (
              <p className="text-cyan-300 text-lg font-light mb-6">{currentStep.subtitle}</p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Description */}
        <motion.p
          key={`desc-${step}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-slate-300 text-base leading-relaxed mb-8 max-w-xs"
        >
          {currentStep.description}
        </motion.p>

        {/* Tips list */}
        {currentStep.tips && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mb-8 w-full bg-slate-800/50 rounded-lg p-4 border border-slate-700"
          >
            {currentStep.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 mb-2 last:mb-0">
                <span className="text-cyan-400 mt-1">•</span>
                <p className="text-sm text-slate-300 text-left">{tip}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 w-full mt-auto pb-6">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 px-4 py-3 rounded-lg border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white transition-colors font-medium"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold flex items-center justify-center gap-2 transition-colors"
          >
            {currentStep.action || 'Next'}
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="text-slate-400 hover:text-slate-300 text-sm transition-colors"
        >
          {step === steps.length - 1 ? 'Skip' : 'Skip Tutorial'}
        </button>
      </div>

      {/* Sound toggle (top right) */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-6 right-6 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors z-20"
        aria-label="Toggle sound"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
    </motion.div>
  );
};
