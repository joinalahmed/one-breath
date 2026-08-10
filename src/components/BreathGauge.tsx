import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, AlertTriangle } from 'lucide-react';

interface BreathGaugeProps {
  air: number;
  maxAir: number;
  depth: number;
  isAscending?: boolean;
  isDescending?: boolean;
  isPanicAscent?: boolean;
  drainRate?: number;
}

export const BreathGauge: React.FC<BreathGaugeProps> = ({
  air,
  maxAir,
  depth,
}) => {
  const safeAir = Math.max(0, Math.min(maxAir, air));
  const airRatio = safeAir / maxAir;
  const airPercent = Math.round(airRatio * 100);

  const isLowBreath = airRatio <= 0.3;
  const isCriticalBreath = airRatio <= 0.15;

  const getBarGradient = () => {
    if (airRatio > 0.5) return 'from-cyan-400 to-emerald-400';
    if (airRatio > 0.25) return 'from-amber-400 to-yellow-300';
    return 'from-rose-500 to-red-500';
  };

  return (
    <div className="relative pointer-events-none select-none">
      <div
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border shadow-xl transition-all duration-300 ${
          isLowBreath
            ? 'border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse'
            : 'border-slate-700/50'
        }`}
      >
        <Wind className={`w-3.5 h-3.5 shrink-0 ${isLowBreath ? 'text-rose-400' : 'text-cyan-400'}`} />

        {/* Progress Bar Track */}
        <div className="w-20 sm:w-28 h-2 bg-slate-950/80 rounded-full overflow-hidden border border-slate-700/40 shrink-0">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${getBarGradient()} transition-all duration-150`}
            style={{ width: `${airPercent}%` }}
          />
        </div>

        <span
          className={`text-xs font-black font-mono tracking-tight shrink-0 ${
            isLowBreath ? 'text-rose-400' : 'text-cyan-200'
          }`}
        >
          {airPercent}%
        </span>

        {isLowBreath && (
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce shrink-0" />
        )}
      </div>
    </div>
  );
};
