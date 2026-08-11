import React, { useEffect, useRef } from 'react';
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
  duration = 2000,
}) => {
  const dismissed = useRef(false);
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;
  const durationRef = useRef(duration);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!dismissed.current) {
        dismissed.current = true;
        onDismissRef.current();
      }
    }, durationRef.current);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDismiss = () => {
    if (!dismissed.current) {
      dismissed.current = true;
      onDismissRef.current();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 0.75, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40"
      data-hud="true"
      onClick={handleDismiss}
      onPointerDown={(e) => { e.stopPropagation(); handleDismiss(); }}
    >
      <div className="bg-slate-800/50 border border-cyan-400/30 rounded-2xl px-4 py-3 backdrop-blur-sm max-w-xs">
        <div className="flex items-start space-x-3">
          <span className="text-2xl shrink-0">{icon}</span>
          <div className="text-left">
            <p className="text-xs font-black text-cyan-300/80 uppercase tracking-tight mb-0.5">{title}</p>
            <p className="text-[11px] text-slate-300/80 leading-snug">{description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
