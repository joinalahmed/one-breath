import React, { useEffect } from 'react';
import { motion } from 'motion/react';

interface TutorialTipProps {
  title: string;
  description: string;
  icon: string;
  onDismiss: () => void;
  duration?: number;
}

export const TutorialTip: React.FC<TutorialTipProps> = ({
  title,
  description,
  icon,
  onDismiss,
  duration = 4500,
}) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
    >
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 border-2 border-cyan-400/60 rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-sm max-w-xs">
        <div className="flex items-start space-x-3">
          <span className="text-2xl shrink-0">{icon}</span>
          <div className="text-left">
            <p className="text-xs font-black text-cyan-300 uppercase tracking-tight mb-0.5">{title}</p>
            <p className="text-[11px] text-slate-200 leading-snug">{description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
