import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayerStats } from '../types';
import { DiveResultsSummary } from './DiveResultsSummary';

interface DivingBank {
  id: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  locked: boolean;
  offsetX?: number;
  offsetY?: number;
  lockOffsetY?: number;
}

interface MapScreenProps {
  stats: PlayerStats;
  lastDiveResult?: {
    outcome: 'surfaced' | 'shark' | 'drowned';
    maxDepth: number;
    diveDuration: number;
    coinsEarned: number;
    foodEarned: number;
    shellsCollected: number;
    rareCollected: number;
    stoneCutAtDepth: number | null;
  } | null;
  onSelectBank: (bankId: string) => void;
  onGoToVillage: () => void;
}

const DIVING_BANKS: DivingBank[] = [
  { id: 'tartous', position: { x: 20, y: 16 }, width: 18, height: 12, locked: true, offsetX: -18, offsetY: -60, lockOffsetY: 12 },
  { id: 'hawwali', position: { x: 45, y: 35 }, width: 18, height: 12, locked: true, offsetX: 25, offsetY: -45 },
  { id: 'yanbu', position: { x: 18, y: 55 }, width: 22, height: 14, locked: false },
  { id: 'dubai', position: { x: 65, y: 50 }, width: 18, height: 12, locked: true, offsetX: 40, offsetY: -5 },
  { id: 'aden', position: { x: 43, y: 72 }, width: 18, height: 12, locked: true, offsetX: 26, offsetY: 19, lockOffsetY: -12 },
];

export const MapScreen: React.FC<MapScreenProps> = ({ stats, lastDiveResult, onSelectBank, onGoToVillage }) => {
  const [showResults, setShowResults] = useState(!!lastDiveResult);

  return (
    <div className="relative w-full h-full text-slate-100">
      {/* DIVE RESULTS MODAL */}
      <AnimatePresence>
        {showResults && lastDiveResult && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setShowResults(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div className="pointer-events-auto w-11/12 max-w-sm">
                <div
                  className="bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 rounded-3xl border-2 border-cyan-400/40 shadow-2xl p-6 space-y-4"
                  style={{ boxShadow: '0 0 40px rgba(34, 211, 238, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)' }}
                >
                  <button
                    onClick={() => setShowResults(false)}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-700/60 hover:bg-slate-600 flex items-center justify-center text-slate-300 hover:text-white transition-all"
                  >
                    X
                  </button>
                  <DiveResultsSummary
                    outcome={lastDiveResult.outcome}
                    maxDepth={lastDiveResult.maxDepth}
                    diveDuration={lastDiveResult.diveDuration}
                    coinsEarned={lastDiveResult.coinsEarned}
                    foodEarned={lastDiveResult.foodEarned}
                    shellsCollected={lastDiveResult.shellsCollected}
                    rareCollected={lastDiveResult.rareCollected}
                  />
                  <button
                    onClick={() => setShowResults(false)}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black uppercase tracking-wider rounded-xl shadow-lg"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Clickable areas over the image's existing buttons */}
      {DIVING_BANKS.map((bank) => (
        <motion.div
          key={bank.id}
          whileTap={bank.locked ? {} : { scale: 0.95 }}
          onClick={() => !bank.locked && onSelectBank(bank.id)}
          className={`absolute z-10 ${bank.locked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          style={{
            left: `${bank.position.x}%`,
            top: `${bank.position.y}%`,
            width: `${bank.width}%`,
            height: `${bank.height}%`,
            transform: `translate(${bank.offsetX || 0}px, ${bank.offsetY || 0}px)`,
          }}
        >
          {bank.locked && (
            <div className="absolute left-1/2 -translate-x-1/2 z-20" style={{ top: `${30 + (bank.lockOffsetY || 0)}px` }}>
              <motion.div
                animate={{ y: [0, -2, 0], rotate: [-3, 3, -3] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="flex items-center justify-center w-9 h-9 rounded-full"
                style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                }}
              >
                <span className="text-[16px]">🔒</span>
              </motion.div>
            </div>
          )}
          {!bank.locked && (
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full border-2 border-cyan-400/60 pointer-events-none"
              style={{ margin: 'auto', width: '40px', height: '40px', marginTop: '-23px', marginLeft: '14px' }}
            />
          )}
        </motion.div>
      ))}

      {/* Village clickable area — top center of map */}
      <motion.div
        whileTap={{ scale: 0.95 }}
        onClick={onGoToVillage}
        className="absolute cursor-pointer z-10"
        style={{ left: '35%', top: '2%', width: '20%', height: '6%' }}
      />
    </div>
  );
};
