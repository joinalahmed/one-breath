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
    if (depth < 30) return { name: 'Mid', color: 'from-blue-400 to-purple-400' };
    if (depth < 45) return { name: 'Deep', color: 'from-purple-400 to-indigo-500' };
    return { name: 'Abyss', color: 'from-indigo-500 to-slate-600' };
  };

  const band = getDepthBand(currentDepth);
  const depthPercent = (currentDepth / maxGameDepth) * 100;

  return (
    <div className="absolute left-3 top-16 z-10 flex flex-col items-center gap-1.5 pointer-events-none">
      {/* Zone label */}
      <motion.div
        key={band.name}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`text-[9px] font-bold bg-gradient-to-r ${band.color} bg-clip-text text-transparent uppercase tracking-wider`}
      >
        {band.name}
      </motion.div>

      {/* Vertical depth bar */}
      <div className="relative h-40 w-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700 shadow-lg">
        {/* Zone bands */}
        <div className="absolute inset-0 flex flex-col">
          {/* 0-15m (Cyan) */}
          <div className="flex-1 bg-gradient-to-b from-transparent to-cyan-500/20" />
          {/* 15-30m (Blue) */}
          <div className="flex-1 bg-gradient-to-b from-cyan-500/20 to-blue-500/20" />
          {/* 30-45m (Purple) */}
          <div className="flex-1 bg-gradient-to-b from-blue-500/20 to-purple-500/20" />
          {/* 45-60m (Indigo) */}
          <div className="flex-1 bg-gradient-to-b from-purple-500/20 to-indigo-600/20" />
        </div>

        {/* Depth fill */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${band.color} rounded-full`}
          animate={{ height: `${depthPercent}%` }}
          transition={{ type: 'spring', stiffness: 60 }}
        />

        {/* Current depth marker */}
        <motion.div
          className="absolute left-1/2 w-2.5 h-0.5 bg-white rounded-full shadow-lg"
          style={{ transform: 'translateX(-50%)' }}
          animate={{ bottom: `${depthPercent}%` }}
          transition={{ type: 'spring', stiffness: 60 }}
        />
      </div>

      {/* Depth number */}
      <motion.div
        key={currentDepth}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs font-black text-cyan-300 font-mono"
      >
        {Math.round(currentDepth)}m
      </motion.div>
    </div>
  );
};
