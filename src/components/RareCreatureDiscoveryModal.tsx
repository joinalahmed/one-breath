import React, { useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { soundManager } from '../audioAndHaptics';

const CREATURE_GIFS: Record<string, string> = {
  crab: '/assets/crab.gif',
  seahorse: '/assets/fish-angelfish.gif',
  eel: '/assets/fish-betta.gif',
  angler: '/assets/shark.gif',
};

const CREATURE_EMOJIS: Record<string, string> = {
  octopus: '🐙',
  squid: '🦑',
  crab: '🦀',
  seahorse: '🐠',
  eel: '🐍',
  angler: '🐟',
};

interface RareCreatureDiscoveryModalProps {
  itemType: string;
  itemName: string;
  emoji: string;
  rarity: string;
  depth: number;
  value: number;
  onComplete: () => void;
}

function BurstParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 16 }, (_, i) => {
      const angle = (i / 16) * Math.PI * 2;
      return {
        id: i,
        x: Math.cos(angle) * 60,
        y: Math.sin(angle) * 60,
        size: 3 + (i % 3) * 2,
        color: ['#67e8f9', '#a78bfa', '#34d399', '#fbbf24', '#f472b6'][i % 5],
      };
    }), []);

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full left-1/2 top-1/2"
          style={{ width: p.size, height: p.size, backgroundColor: p.color, marginLeft: -p.size / 2, marginTop: -p.size / 2 }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </>
  );
}

export const RareCreatureDiscoveryModal: React.FC<RareCreatureDiscoveryModalProps> = ({
  itemType,
  itemName,
  rarity,
  depth,
  value,
  onComplete,
}) => {
  useEffect(() => {
    soundManager.playLevelUp();
    const timer = window.setTimeout(onComplete, 1500);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  const gifSrc = CREATURE_GIFS[itemType.toLowerCase()] || CREATURE_GIFS[itemType];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25 }}
      className="absolute top-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
    >
      <div className="relative bg-slate-900/60 backdrop-blur-sm border border-cyan-400/40 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-lg">
        <BurstParticles />
        {gifSrc ? (
          <motion.img
            src={gifSrc}
            alt={itemName}
            className="w-12 h-12 object-contain"
            animate={{ rotate: [-5, 5, -5], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
          />
        ) : (
          <motion.span
            className="text-4xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
          >
            {CREATURE_EMOJIS[itemType.toLowerCase()] || '🐠'}
          </motion.span>
        )}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">✨ {rarity} Discovery</div>
          <div className="text-sm font-black text-white">{itemName}</div>
          <div className="text-[9px] text-slate-400 font-mono">{depth}m · +{value} 💎</div>
          <div className="text-[8px] text-cyan-200/70 mt-0.5">📷 Added to Photo Library</div>
        </div>
      </div>
    </motion.div>
  );
};
