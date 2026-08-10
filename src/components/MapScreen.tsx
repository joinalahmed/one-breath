import React from 'react';
import { motion } from 'motion/react';
import { PlayerStats } from '../types';

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

export const MapScreen: React.FC<MapScreenProps> = ({ onSelectBank, onGoToVillage }) => {
  return (
    <div className="relative w-full h-full text-slate-100">
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
