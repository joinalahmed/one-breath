import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayerStats } from '../types';
import { DiveResultsSummary } from './DiveResultsSummary';

interface DivingBank {
  id: string;
  name: string;
  subtitle: string;
  art: string;
  depth: number;
  description: string;
  position: { x: number; y: number };
  difficulty: 'easy' | 'medium' | 'hard';
  /** Radial-gradient stops for the vignette interior */
  grad: [string, string];
  /** A dark trench pit instead of a sandy island */
  trench?: boolean;
  /** Render the name label above the disc (for markers near the bottom edge) */
  labelAbove?: boolean;
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

/** The village boat base — where the dotted dive routes set out from */
const VILLAGE = { x: 52, y: 11 };

const DIVING_BANKS: DivingBank[] = [
  {
    id: 'shallow_reef',
    name: 'Shallow Reef',
    subtitle: 'Coral & Reef Fish',
    art: '🐠',
    depth: 10,
    description: 'Safe waters, calm currents',
    position: { x: 28, y: 27 },
    difficulty: 'easy',
    grad: ['#7fe3e0', '#0b6b78'],
  },
  {
    id: 'middle_bank',
    name: 'Middle Bank',
    subtitle: 'Sunken Wrecks',
    art: '⚓',
    depth: 20,
    description: 'Moderate depth, good pearls',
    position: { x: 55, y: 43 },
    difficulty: 'medium',
    grad: ['#5f97cf', '#0b2d4a'],
  },
  {
    id: 'kelp_forest',
    name: 'Kelp Forest',
    subtitle: 'Seaweed Maze',
    art: '🌿',
    depth: 18,
    description: 'Maze of seaweed, hidden pearls',
    position: { x: 29, y: 64 },
    difficulty: 'medium',
    grad: ['#6fd08e', '#0b3b2a'],
  },
  {
    id: 'night_waters',
    name: 'Night Waters',
    subtitle: 'Bioluminescence',
    art: '✨',
    depth: 25,
    description: 'Eerie but abundant',
    position: { x: 70, y: 58 },
    difficulty: 'hard',
    grad: ['#6a5bd6', '#0a0a3a'],
  },
  {
    id: 'deep_trench',
    name: 'Deep Trench',
    subtitle: 'The Abyss',
    art: '🕳️',
    depth: 30,
    description: 'Rich rewards, dangerous depths',
    position: { x: 52, y: 82 },
    difficulty: 'hard',
    grad: ['#0d2a42', '#01040c'],
    trench: true,
    labelAbove: true,
  },
];

const depthColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'text-cyan-300';
    case 'medium':
      return 'text-slate-100';
    case 'hard':
      return 'text-rose-400';
    default:
      return 'text-cyan-300';
  }
};

export const MapScreen: React.FC<MapScreenProps> = ({ stats, lastDiveResult, onSelectBank, onGoToVillage }) => {
  const [showResults, setShowResults] = useState(!!lastDiveResult);

  return (
    <div className="relative w-full h-full text-slate-100 flex flex-col overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
      {/* DIVE RESULTS MODAL - Candy Crush style */}
      <AnimatePresence>
        {showResults && lastDiveResult && (
          <>
            {/* Dimmed Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setShowResults(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div className="pointer-events-auto w-11/12 max-w-sm">
                <motion.div
                  className="bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 rounded-3xl border-2 border-cyan-400/40 shadow-2xl p-6 space-y-4"
                  style={{
                    boxShadow: '0 0 40px rgba(34, 211, 238, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                  }}
                >
                  {/* Close Button - Top Right */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowResults(false)}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-700/60 hover:bg-slate-600 flex items-center justify-center text-slate-300 hover:text-white transition-all"
                  >
                    ✕
                  </motion.button>

                  {/* Results Content */}
                  <DiveResultsSummary
                    outcome={lastDiveResult.outcome}
                    maxDepth={lastDiveResult.maxDepth}
                    diveDuration={lastDiveResult.diveDuration}
                    coinsEarned={lastDiveResult.coinsEarned}
                    foodEarned={lastDiveResult.foodEarned}
                    shellsCollected={lastDiveResult.shellsCollected}
                    rareCollected={lastDiveResult.rareCollected}
                  />

                  {/* Continue Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowResults(false)}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-black uppercase tracking-wider rounded-xl shadow-lg transition-all"
                  >
                    Continue
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 px-4 pb-2"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <div>
          <h1
            className="text-2xl font-black uppercase tracking-wide text-amber-300"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.5)' }}
          >
            Dive Banks Map
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Day {stats.totalDives + 1} · Tap a bank to dive</p>
        </div>
      </motion.div>

      {/* ILLUSTRATED OCEAN MAP */}
      <div
        className="relative flex-1 mx-3 mb-2 rounded-3xl overflow-hidden"
        style={{
          border: '2px solid rgba(201, 162, 74, 0.35)',
          boxShadow: 'inset 0 0 60px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.4)',
        }}
      >
        {/* Map artwork */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <radialGradient id="ocean" cx="50%" cy="30%" r="90%">
              <stop offset="0%" stopColor="#1c6b86" />
              <stop offset="55%" stopColor="#0d3a56" />
              <stop offset="100%" stopColor="#051d31" />
            </radialGradient>
            <linearGradient id="coast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c6b3f" />
              <stop offset="100%" stopColor="#4c3f22" />
            </linearGradient>
            <linearGradient id="greenland" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#84bd5e" />
              <stop offset="100%" stopColor="#4e7d38" />
            </linearGradient>
            <radialGradient id="sand" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#e9d7a0" />
              <stop offset="70%" stopColor="#cbb072" />
              <stop offset="100%" stopColor="#a8894e" />
            </radialGradient>
          </defs>

          {/* Open ocean */}
          <rect x="0" y="0" width="100" height="100" fill="url(#ocean)" />

          {/* Depth contour rings */}
          <g stroke="#7fd6e0" strokeWidth="0.25" fill="none" opacity="0.14">
            <ellipse cx="52" cy="55" rx="46" ry="42" />
            <ellipse cx="52" cy="55" rx="34" ry="30" />
            <ellipse cx="52" cy="55" rx="22" ry="19" />
          </g>

          {/* Coastlines: rocky right edge, top-right cape & southern shore */}
          <path
            d="M100 -4 L74 -4 C84 8 78 20 90 28 C82 40 92 52 86 64 C94 78 88 92 100 104 Z"
            fill="url(#coast)" stroke="#e6d59c" strokeWidth="0.8" strokeOpacity="0.4" strokeLinejoin="round"
          />
          <path
            d="M-4 104 L104 104 L104 92 C82 88 60 98 42 90 C28 84 10 94 -4 88 Z"
            fill="url(#coast)" stroke="#e6d59c" strokeWidth="0.8" strokeOpacity="0.4" strokeLinejoin="round"
          />
          <path
            d="M-4 -4 L16 -4 C14 8 6 10 -4 14 Z"
            fill="url(#coast)" stroke="#e6d59c" strokeWidth="0.8" strokeOpacity="0.4" strokeLinejoin="round"
          />

          {/* Village home island — the top headland the Village node sits on */}
          <ellipse cx="52" cy="9" rx="23" ry="13" fill="#5fc6cf" opacity="0.22" />
          <path
            d="M 29 -5 L 75 -5 Q 80 8 69 16 Q 61 22 52 21 Q 43 22 35 16 Q 24 8 29 -5 Z"
            fill="url(#greenland)" stroke="#e6d59c" strokeWidth="1.1" strokeOpacity="0.5" strokeLinejoin="round"
          />
          {/* Beach rim */}
          <path d="M 35 16 Q 43 22 52 21 Q 61 22 69 16 Q 62 19 52 19 Q 42 19 35 16 Z" fill="#e6d29a" opacity="0.75" />
          {/* Little grove */}
          <g fill="#2f5721" opacity="0.7">
            <circle cx="39" cy="6" r="1.4" />
            <circle cx="45" cy="3" r="1.4" />
            <circle cx="60" cy="4" r="1.4" />
            <circle cx="65" cy="8" r="1.3" />
          </g>

          {/* Sandbars beneath the island banks */}
          {DIVING_BANKS.filter((b) => !b.trench).map((b) => (
            <g key={`bar-${b.id}`}>
              <ellipse cx={b.position.x} cy={b.position.y + 1} rx="15" ry="10.5" fill="#5fc6cf" opacity="0.22" />
              <ellipse cx={b.position.x} cy={b.position.y + 1.5} rx="12" ry="8.5" fill="url(#sand)" />
            </g>
          ))}

          {/* Dotted dive routes from the surface to each bank */}
          <g stroke="#f3e6c0" strokeWidth="0.5" strokeDasharray="1.4 1.8" strokeLinecap="round" fill="none" opacity="0.55">
            {DIVING_BANKS.map((b) => (
              <path
                key={`route-${b.id}`}
                d={`M ${VILLAGE.x} ${VILLAGE.y} Q ${(VILLAGE.x + b.position.x) / 2 + 4} ${(VILLAGE.y + b.position.y) / 2} ${b.position.x} ${b.position.y}`}
              />
            ))}
          </g>
        </svg>

        {/* Decorative sea life */}
        <span className="absolute text-2xl opacity-70 pointer-events-none select-none" style={{ left: '82%', top: '16%' }}>🐢</span>
        <motion.span
          className="absolute text-lg pointer-events-none select-none"
          style={{ left: '80%', top: '40%' }}
          animate={{ y: [0, -4, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ⚪
        </motion.span>

        {/* THE VILLAGE (home base) node — tap to return to the village */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 240, damping: 17 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onGoToVillage}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer z-30"
          style={{ left: `${VILLAGE.x}%`, top: `${VILLAGE.y}%` }}
          title="Return to the village"
        >
          <div
            className="rounded-full p-[3px]"
            style={{
              background: 'linear-gradient(145deg, #f0d27a 0%, #c79a3e 45%, #7a561b 100%)',
              boxShadow: '0 5px 12px rgba(0,0,0,0.55)',
            }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-lg"
              style={{
                background: 'radial-gradient(circle at 35% 28%, #ffe0a3, #b5762c)',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.15)',
              }}
            >
              🏘️
            </div>
          </div>
          <div className="mt-1 px-1.5 py-0.5 rounded-md text-center leading-tight" style={{ background: 'rgba(2, 6, 23, 0.72)' }}>
            <p className="text-[10px] font-black uppercase tracking-wide text-amber-200">The Village</p>
            <p className="text-[8px] text-slate-300/90">Home Base</p>
          </div>
        </motion.button>

        {/* Bank vignette markers — tap to dive */}
        {DIVING_BANKS.map((bank, idx) => {
          const label = (
            <div className="px-1.5 py-0.5 rounded-md text-center whitespace-nowrap" style={{ background: 'rgba(2, 6, 23, 0.72)' }}>
              <div className="leading-tight">
                <span className="text-[10px] font-black uppercase tracking-wide text-white">{bank.name}</span>
                <span className={`ml-1 text-[10px] font-black font-mono ${depthColor(bank.difficulty)}`}>({bank.depth}m)</span>
              </div>
              <p className="text-[8px] text-slate-300/90 leading-tight">{bank.subtitle}</p>
            </div>
          );

          return (
            <motion.button
              key={bank.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + idx * 0.09, type: 'spring', stiffness: 240, damping: 17 }}
              whileHover={{ scale: 1.09 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onSelectBank(bank.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer z-30"
              style={{ left: `${bank.position.x}%`, top: `${bank.position.y}%` }}
              title={`Dive — ${bank.description}`}
            >
              {bank.labelAbove && <div className="mb-1">{label}</div>}

              {/* Brass-framed porthole vignette */}
              <div
                className="rounded-full p-[3px]"
                style={{
                  background: 'linear-gradient(145deg, #f0d27a 0%, #c79a3e 45%, #7a561b 100%)',
                  boxShadow: '0 5px 12px rgba(0,0,0,0.55)',
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden"
                  style={{
                    background: `radial-gradient(circle at 35% 28%, ${bank.grad[0]}, ${bank.grad[1]})`,
                    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.12)',
                  }}
                >
                  <span className="text-2xl leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">{bank.art}</span>
                </div>
              </div>

              {!bank.labelAbove && <div className="mt-1">{label}</div>}
            </motion.button>
          );
        })}

        {/* Compass rose */}
        <div className="absolute bottom-2 right-2 z-20 pointer-events-none opacity-90">
          <svg width="46" height="46" viewBox="0 0 46 46">
            <circle cx="23" cy="23" r="21" fill="rgba(2,6,23,0.55)" stroke="#c9a24a" strokeWidth="1.5" />
            <g fill="#e7c66a">
              <polygon points="23,4 26,23 23,42 20,23" />
              <polygon points="4,23 23,20 42,23 23,26" opacity="0.7" />
            </g>
            <polygon points="23,4 25,23 21,23" fill="#f4e9c7" />
            <circle cx="23" cy="23" r="2.5" fill="#7a561b" stroke="#e7c66a" strokeWidth="0.8" />
            <text x="23" y="12" fontSize="6" fontWeight="bold" fill="#f4e9c7" textAnchor="middle">N</text>
          </svg>
        </div>
      </div>
    </div>
  );
};
