import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

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
  isAscending = false,
  isDescending = false,
  isPanicAscent = false,
  drainRate = 0,
}) => {
  const safeAir = Math.max(0, Math.min(maxAir, air));
  const airRatio = safeAir / maxAir;
  const airPercent = Math.round(airRatio * 100);

  const isLowBreath = airRatio <= 0.3;
  const isCriticalBreath = airRatio <= 0.15;
  const isSubmerged = depth > 0.1;

  // Determine color scheme based on air ratio
  const getGradientClass = () => {
    if (airRatio > 0.5) {
      return 'from-emerald-400 via-teal-300 to-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.5)]';
    } else if (airRatio > 0.25) {
      return 'from-amber-400 via-yellow-300 to-orange-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]';
    } else {
      return 'from-rose-600 via-red-500 to-pink-500 shadow-[0_0_16px_rgba(239,68,68,0.8)]';
    }
  };

  const getStatusText = () => {
    if (!isSubmerged) return 'SURFACED • AIR FULL';
    if (isPanicAscent) return 'PANIC ASCENT!';
    if (isCriticalBreath) return 'CRITICAL BREATH!';
    if (isLowBreath) return 'LOW BREATH - ASCEND!';
    if (isAscending) return 'ASCENDING...';
    if (airRatio < 0.6) return 'DEPLETING...';
    return 'SUBMERGED • OK';
  };

  return (
    <div className="relative pointer-events-none select-none">
      {/* Outer Glow Container with Low Breath Warning Pulse */}
      <motion.div
        animate={
          isCriticalBreath
            ? { scale: [1, 1.05, 0.98, 1], filter: ['drop-shadow(0 0 8px rgba(239,68,68,0.8))', 'drop-shadow(0 0 20px rgba(239,68,68,1))', 'drop-shadow(0 0 8px rgba(239,68,68,0.8))'] }
            : isLowBreath
            ? { scale: [1, 1.03, 1], filter: ['drop-shadow(0 0 6px rgba(239,68,68,0.5))', 'drop-shadow(0 0 14px rgba(239,68,68,0.8))', 'drop-shadow(0 0 6px rgba(239,68,68,0.5))'] }
            : { scale: 1, filter: 'drop-shadow(0 0 0px rgba(0,0,0,0))' }
        }
        transition={
          isCriticalBreath
            ? { repeat: Infinity, duration: 0.4, ease: 'easeInOut' }
            : isLowBreath
            ? { repeat: Infinity, duration: 0.8, ease: 'easeInOut' }
            : { duration: 0.2 }
        }
        className={`relative overflow-hidden rounded-2xl p-2.5 backdrop-blur-md border-2 transition-colors duration-300 ${
          isLowBreath
            ? 'bg-rose-950/90 border-rose-500/90 text-rose-100 shadow-[0_0_25px_rgba(239,68,68,0.4)]'
            : 'bg-slate-950/90 border-cyan-500/50 text-slate-100 shadow-2xl'
        }`}
      >
        {/* Low Breath Warning Pulse Background Flash */}
        {isLowBreath && (
          <motion.div
            animate={{ opacity: [0.15, 0.45, 0.15] }}
            transition={{ repeat: Infinity, duration: isCriticalBreath ? 0.35 : 0.7 }}
            className="absolute inset-0 bg-gradient-to-r from-red-600/30 via-rose-500/20 to-red-600/30 pointer-events-none"
          />
        )}

        {/* Top Meta Row: Title, Percentage, Status Badge */}
        <div className="relative z-10 flex items-center justify-between mb-1.5 space-x-2">
          <div className="flex items-center space-x-1.5">
            {/* Lungs / Breath Icon with Breathing / Warning Pulse */}
            <motion.div
              animate={
                isLowBreath
                  ? { scale: [1, 1.3, 0.9, 1], rotate: [-4, 4, -4] }
                  : isSubmerged
                  ? { scale: [1, 1.1, 1] }
                  : { scale: 1 }
              }
              transition={{ repeat: Infinity, duration: isLowBreath ? 0.4 : 1.5 }}
              className={`w-6 h-6 rounded-lg flex items-center justify-center text-sm font-black shadow-md ${
                isLowBreath
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
              }`}
            >
              {isLowBreath ? '🫁' : '🤿'}
            </motion.div>

            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-wider uppercase text-cyan-200/90 flex items-center space-x-1">
                <span>BREATH GAUGE</span>
                {isSubmerged && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
                )}
              </span>
              <span className="text-[9px] font-mono text-slate-400 leading-tight">
                {getStatusText()}
              </span>
            </div>
          </div>

          {/* Digital Breath Value */}
          <div className="flex items-baseline space-x-1 font-mono">
            <span
              className={`text-base sm:text-lg font-black tracking-tight ${
                isLowBreath
                  ? 'text-rose-200 animate-pulse drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                  : 'text-white'
              }`}
            >
              {airPercent}%
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              ({safeAir}/{maxAir})
            </span>
          </div>
        </div>

        {/* Main Fluid Breath Bar Track */}
        <div className="relative z-10 w-full h-4 sm:h-5 bg-slate-900/90 rounded-full border border-slate-700/80 p-0.5 overflow-hidden shadow-inner flex items-center">
          {/* Fill Bar */}
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r transition-all duration-150 relative overflow-hidden ${getGradientClass()}`}
            style={{ width: `${airPercent}%` }}
          >
            {/* Fluid Animated Shimmer Effect */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12"
            />

            {/* Rising Breath Bubbles in Fill Bar */}
            {isSubmerged && airPercent > 5 && (
              <div className="absolute inset-0 flex items-center justify-around overflow-hidden opacity-70">
                <motion.span
                  animate={{ y: [4, -8], opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.9, delay: 0 }}
                  className="w-1 h-1 rounded-full bg-white inline-block"
                />
                <motion.span
                  animate={{ y: [4, -8], opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: 0.3 }}
                  className="w-1.5 h-1.5 rounded-full bg-white/80 inline-block"
                />
                <motion.span
                  animate={{ y: [4, -8], opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.7, delay: 0.5 }}
                  className="w-1 h-1 rounded-full bg-cyan-100 inline-block"
                />
              </div>
            )}
          </motion.div>

          {/* Segment Overlay Lines (25%, 50%, 75% Ticks) */}
          <div className="absolute inset-0 flex justify-between pointer-events-none px-0.5">
            {[25, 50, 75].map((pct) => (
              <div
                key={pct}
                className="absolute top-0 bottom-0 w-px bg-slate-950/60 shadow-sm"
                style={{ left: `${pct}%` }}
              />
            ))}
          </div>
        </div>

        {/* Subtext: Drain Rate Indicator when Submerged */}
        {isSubmerged && drainRate > 0 && (
          <div className="relative z-10 flex items-center justify-between mt-1 text-[9px] font-mono">
            <span className="text-slate-400">AIR CONSUMPTION:</span>
            <span
              className={`font-bold ${
                isLowBreath ? 'text-rose-300' : 'text-cyan-300'
              }`}
            >
              -{drainRate.toFixed(1)} AIR / SEC
            </span>
          </div>
        )}

        {/* Critical Warning Alert Banner when Breath is Low */}
        <AnimatePresence>
          {isLowBreath && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1.5 pt-1 border-t border-rose-500/40 flex items-center justify-center space-x-1 text-[10px] font-black uppercase text-rose-200 tracking-wider"
            >
              <span className="animate-ping">⚠️</span>
              <span className="animate-pulse">
                {isCriticalBreath
                  ? 'CRITICAL AIR — SURF NOW OR DROWN!'
                  : 'LOW BREATH — RELEASE TO ASCEND!'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
