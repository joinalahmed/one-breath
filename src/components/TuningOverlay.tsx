import React from 'react';
import { motion } from 'motion/react';
import { GameConfig } from '../types';
import { saveConfig } from '../config';
import { loadTelemetryLogs, analyzeTelemetryLogs, clearTelemetryLogs } from '../telemetry';

interface TuningOverlayProps {
  config: GameConfig;
  onUpdateConfig: (newConfig: GameConfig) => void;
  onClose: () => void;
  onOpenTelemetryModal: () => void;
  onTestRescueModal?: () => void;
}

export const TuningOverlay: React.FC<TuningOverlayProps> = ({
  config,
  onUpdateConfig,
  onClose,
  onOpenTelemetryModal,
  onTestRescueModal,
}) => {
  const handleChange = (key: keyof GameConfig, val: number) => {
    const updated = { ...config, [key]: val };
    onUpdateConfig(updated);
    saveConfig(updated);
  };

  const logs = loadTelemetryLogs();
  const analysis = analyzeTelemetryLogs(logs);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-4 text-slate-100 overflow-y-auto flex flex-col justify-between select-none"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="max-w-md mx-auto w-full"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-black text-amber-400 flex items-center space-x-2">
              <span>⚙️ Live Tuning Overlay</span>
            </h2>
            <p className="text-xs text-slate-400">Playtest Tuning & Physics Control</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Real-time Telemetry Summary Badge */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-5 text-xs grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Total Dives</span>
            <span className="font-extrabold text-white text-base">{analysis.totalDives}</span>
          </div>
          <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Median Depth</span>
            <span className="font-extrabold text-cyan-400 text-base">{analysis.medianMaxDepth}m</span>
          </div>
          <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Drowned %</span>
            <span
              className={`font-extrabold text-base ${
                analysis.drownedPercentage >= 15 && analysis.drownedPercentage <= 25
                  ? 'text-emerald-400'
                  : 'text-amber-400'
              }`}
            >
              {analysis.drownedPercentage}%
            </span>
          </div>
        </div>

        {/* Live Sliders */}
        <div className="space-y-4 text-xs">
          {/* ASCENT_TAX */}
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex justify-between font-bold">
              <span className="text-amber-300">Ascent Tax (ASCENT_TAX)</span>
              <span className="text-white">{config.ASCENT_TAX.toFixed(2)}x</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Multiplier for air drain rate while ascending. Primary risk tuning.
            </p>
            <input
              type="range"
              min="1.0"
              max="3.0"
              step="0.05"
              value={config.ASCENT_TAX}
              onChange={(e) => handleChange('ASCENT_TAX', parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          {/* AIR_BASE_DRAIN */}
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex justify-between font-bold">
              <span className="text-cyan-300">Base Air Drain (AIR_BASE_DRAIN)</span>
              <span className="text-white">{config.AIR_BASE_DRAIN.toFixed(1)} /s</span>
            </div>
            <p className="text-[10px] text-slate-400">Air consumed per second at surface depth.</p>
            <input
              type="range"
              min="4.0"
              max="16.0"
              step="0.5"
              value={config.AIR_BASE_DRAIN}
              onChange={(e) => handleChange('AIR_BASE_DRAIN', parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          {/* DEPTH_DRAIN_DIVISOR */}
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex justify-between font-bold">
              <span className="text-indigo-300">Depth Drain Divisor</span>
              <span className="text-white">{config.DEPTH_DRAIN_DIVISOR}</span>
            </div>
            <p className="text-[10px] text-slate-400">Higher value lowers depth air penalty.</p>
            <input
              type="range"
              min="20"
              max="80"
              step="2"
              value={config.DEPTH_DRAIN_DIVISOR}
              onChange={(e) => handleChange('DEPTH_DRAIN_DIVISOR', parseInt(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          {/* SHARK_SPEED */}
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex justify-between font-bold">
              <span className="text-rose-300">Shark Patrol Speed</span>
              <span className="text-white">{config.SHARK_SPEED.toFixed(1)} m/s</span>
            </div>
            <p className="text-[10px] text-slate-400">Patrol speed of shark at ~31m depth.</p>
            <input
              type="range"
              min="2.0"
              max="8.0"
              step="0.2"
              value={config.SHARK_SPEED}
              onChange={(e) => handleChange('SHARK_SPEED', parseFloat(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          {/* DEPTH_MULTIPLIER_DIVISOR */}
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex justify-between font-bold">
              <span className="text-emerald-300">Depth Multiplier Divisor</span>
              <span className="text-white">{config.DEPTH_MULTIPLIER_DIVISOR}</span>
            </div>
            <p className="text-[10px] text-slate-400">Multiplier = 1 + maxDepth / Divisor.</p>
            <input
              type="range"
              min="10"
              max="40"
              step="1"
              value={config.DEPTH_MULTIPLIER_DIVISOR}
              onChange={(e) => handleChange('DEPTH_MULTIPLIER_DIVISOR', parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col space-y-2">
          <button
            onClick={() => {
              onOpenTelemetryModal();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-xs text-white shadow"
          >
            📊 Open Detailed Telemetry Dashboard
          </button>
          <button
            onClick={() => {
              onTestRescueModal?.();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white shadow"
          >
            🧪 Test Rescue Modal
          </button>
          <button
            onClick={() => {
              if (confirm('Clear all local telemetry logs?')) {
                clearTelemetryLogs();
                onClose();
              }
            }}
            className="w-full py-2 bg-slate-800 hover:bg-rose-950 text-rose-300 rounded-xl text-xs font-semibold"
          >
            🗑️ Clear Telemetry Data
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
