import React from 'react';
import { motion } from 'motion/react';

/**
 * The shared Pearl Coast bottom navigation — five transparent PNG button tiles
 * (Map · Village · Store · Photos · Leaderboard). Rendered on every hub screen
 * (the Pearl Coast landing and all sub-screens) so navigation is identical
 * everywhere; it is NOT shown during a dive, since gameplay lives outside the
 * surface hub entirely.
 */

export type HubScreen = 'pearlcoast' | 'home' | 'haven' | 'shop' | 'leaderboard';

const asset = (name: string) => `/assets/pearl-coast-clean-buttons-v2/${name}.png`;

interface BottomNavProps {
  activeScreen: HubScreen;
  onNavigate: (screen: HubScreen) => void;
  /** Owned-upgrade count → badge on the Store tile. */
  ownedCount?: number;
  /** Saved-photo count → badge on the Photos tile. */
  photoCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeScreen,
  onNavigate,
  ownedCount = 0,
  photoCount = 0,
}) => {
  const items: Array<{
    key: string;
    art: string;
    label: string;
    onClick: () => void;
    active: boolean;
    badge: number | null;
  }> = [
    { key: 'home', art: 'button-map', label: 'Map', onClick: () => onNavigate('home'), active: activeScreen === 'home', badge: null },
    // NOTE: the art files carry their own baked-in labels. button-quests.png is the
    // RANK (trophy) tile and button-board.png is the VILLAGE tile — so those two
    // pair with the leaderboard and haven screens respectively, despite the names.
    { key: 'leaderboard', art: 'button-quests', label: 'Rank', onClick: () => onNavigate('leaderboard'), active: activeScreen === 'leaderboard', badge: null },
    { key: 'shop', art: 'button-gear', label: 'Store', onClick: () => onNavigate('shop'), active: activeScreen === 'shop', badge: ownedCount },
    { key: 'photo', art: 'button-photos', label: 'Photos', onClick: () => onNavigate('photos'), active: activeScreen === 'photos', badge: photoCount },
    { key: 'haven', art: 'button-board', label: 'Village', onClick: () => onNavigate('haven'), active: activeScreen === 'haven', badge: null },
  ];

  return (
    <div className="relative z-40 shrink-0 py-2 px-2 mt-auto">
      <div className="flex gap-1.5 justify-center items-end">
        {items.map((item) => (
          <motion.button
            key={item.key}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={item.onClick}
            aria-label={item.label}
            className="relative flex-1 max-w-[70px] cursor-pointer focus:outline-none"
          >
            <img
              src={asset(item.art)}
              alt={item.label}
              draggable={false}
              // Square box + object-cover normalizes every tile to the same height:
              // the wide 1536×1024 tiles (Rank, Village) get their transparent
              // side-glow cropped so the tile art fills the square like the others.
              className="w-full aspect-square object-cover pointer-events-none transition-all duration-200"
              style={{
                filter: item.active
                  ? 'drop-shadow(0 5px 12px rgba(56,189,248,0.6)) saturate(1.05)'
                  : 'drop-shadow(0 2px 5px rgba(0,0,0,0.4)) saturate(0.9) brightness(0.92)',
                opacity: item.active ? 1 : 0.9,
                transform: item.active ? 'translateY(-4px)' : 'none',
              }}
            />
            {item.badge != null && item.badge > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 border border-white/80 text-slate-950 text-[10px] font-black font-mono flex items-center justify-center shadow-md">
                {item.badge}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
