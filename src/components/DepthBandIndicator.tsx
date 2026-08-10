import React from 'react';
import { motion } from 'motion/react';

interface DepthBandIndicatorProps {
  currentDepth: number;
  maxDepth: number;
  maxGameDepth?: number;
}

export const DepthBandIndicator: React.FC<DepthBandIndicatorProps> = ({
  currentDepth,
  maxDepth,
  maxGameDepth = 60,
}) => {
  const getDepthBand = (depth: number) => {
    if (depth < 15) return { name: 'Shallow', color: 'from-cyan-400 to-blue-400' };
    if (depth < 30) return { name: 'Mid Reef', color: 'from-blue-400 to-purple-400' };
    if (depth < 45) return { name: 'Deep Trench', color: 'from-purple-400 to-indigo-500' };
    return { name: 'Abyssal', color: 'from-indigo-500 to-slate-600' };
  };

  const band = getDepthBand(currentDepth);
  const depthPercent = (currentDepth / maxGameDepth) * 100;

  return (
    <div className="px-4 py-3 bg-slate-800/40 border-t border-b border-slate-700">
      {/* Depth zone label */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Depth Zone</span>
        <motion.span
          key={band.name}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`text-sm font-bold bg-gradient-to-r ${band.color} bg-clip-text text-transparent`}
        >
          {band.name}
        </motion.span>
      </div>

      {/* Depth meter with gradient bands */}
      <div className="relative h-8 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
        {/* Zone markers */}
        <div className="absolute inset-0 flex">
          {/* 0-15m (Cyan) */}
          <div className="w-1/4 bg-gradient-to-r from-transparent to-cyan-500/20" />
          {/* 15-30m (Blue) */}
          <div className="w-1/4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20" />
          {/* 30-45m (Purple) */}
          <div className="w-1/4 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
          {/* 45-60m (Indigo) */}
          <div className="w-1/4 bg-gradient-to-r from-purple-500/20 to-indigo-600/20" />
        </div>

        {/* Depth progression bar */}
        <motion.div
          className={`absolute left-0 top-0 h-full bg-gradient-to-r ${band.color} rounded-full`}
          animate={{ width: `${depthPercent}%` }}
          transition={{ type: 'spring', stiffness: 60 }}
        />

        {/* Current depth indicator */}
        <motion.div
          className="absolute top-0 h-full w-1 bg-white shadow-lg shadow-white/50"
          animate={{ left: `${depthPercent}%` }}
          transition={{ type: 'spring', stiffness: 60 }}
        />
      </div>

      {/* Depth numbers */}
      <div className="flex justify-between mt-1 text-xs text-slate-500 font-mono">
        <span>0m</span>
        <span>15m</span>
        <span>30m</span>
        <span>45m</span>
        <span>60m</span>
      </div>
    </div>
  );
};
