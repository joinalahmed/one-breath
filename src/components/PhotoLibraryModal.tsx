import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PhotoLibrary } from '../types';

interface PhotoLibraryModalProps {
  photoLibrary: PhotoLibrary;
  onClose: () => void;
}

const ITEM_INFO: Record<string, { emoji: string; name: string; description: string; rarity: string }> = {
  oyster: { emoji: '🐚', name: 'Pearl Oyster', description: 'A precious pearl-bearing shellfish found on the seabed', rarity: 'Common' },
  fish: { emoji: '🐟', name: 'Reef Fish', description: 'Colorful tropical fish in many varieties and sizes', rarity: 'Common' },
  seahorse: { emoji: '🐴', name: 'Seahorse', description: 'Mystical and graceful denizen of the reef', rarity: 'Rare' },
  crab: { emoji: '🦀', name: 'Hermit Crab', description: 'Swift scavenging crustacean that hides in shells', rarity: 'Rare' },
  eel: { emoji: '🐍', name: 'Electric Eel', description: 'Dangerous predatory fish that shocks with electricity', rarity: 'Rare' },
  octopus: { emoji: '🐙', name: 'Octopus', description: 'Intelligent eight-armed cephalopod master of disguise', rarity: 'Epic' },
  squid: { emoji: '🦑', name: 'Squid', description: 'Fast-moving deep sea hunter with remarkable intelligence', rarity: 'Epic' },
  angler: { emoji: '🦑', name: 'Anglerfish', description: 'Bioluminescent deep dweller with hypnotic lure', rarity: 'Legendary' },
};

export const PhotoLibraryModal: React.FC<PhotoLibraryModalProps> = ({ photoLibrary, onClose }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const discoveredItems = Object.entries(photoLibrary).sort(
    (a, b) => new Date(b[1].discoveredAt).getTime() - new Date(a[1].discoveredAt).getTime()
  );

  const selectedItem = selectedType ? photoLibrary[selectedType] : null;
  const selectedInfo = selectedType ? ITEM_INFO[selectedType] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md max-h-[90vh] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-2xl border border-cyan-500/30 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-cyan-500/20 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black text-cyan-300 uppercase tracking-wider">📷 Photo Library</h2>
            <p className="text-xs text-slate-400 mt-1">{discoveredItems.length} species discovered</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
          >
            ✕
          </motion.button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex gap-3 p-4">
          {/* Left: Gallery Grid */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-3 gap-2">
              {discoveredItems.map(([type, item]) => {
                const info = ITEM_INFO[type];
                const rarityColor =
                  item.count === 0
                    ? 'from-slate-700'
                    : item.count < 3
                    ? 'from-blue-700'
                    : item.count < 10
                    ? 'from-purple-700'
                    : 'from-amber-600';

                return (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedType(type)}
                    className={`aspect-square rounded-xl border-2 transition-all flex flex-col items-center justify-center p-2 cursor-pointer ${
                      selectedType === type
                        ? 'border-cyan-400 bg-gradient-to-br from-cyan-900/50 to-slate-900'
                        : 'border-slate-700/50 hover:border-slate-600 bg-gradient-to-br from-slate-800/30 to-slate-900'
                    }`}
                  >
                    <span className="text-2xl">{info?.emoji || '🐚'}</span>
                    <span className="text-[9px] font-bold text-slate-300 mt-1 line-clamp-1 text-center">{info?.name}</span>
                    <span className="text-[8px] text-slate-400 mt-0.5 font-mono">{item.count}x</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right: Details Panel */}
          <AnimatePresence mode="wait">
            {selectedItem && selectedInfo ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="w-48 flex-shrink-0 flex flex-col"
              >
                {/* Large Display */}
                <div className="aspect-square rounded-xl bg-gradient-to-br from-cyan-900/30 via-slate-900 to-slate-950 border border-cyan-400/40 flex items-center justify-center mb-3">
                  <span className="text-7xl">{selectedInfo.emoji}</span>
                </div>

                {/* Details */}
                <div className="space-y-2 flex-1">
                  <div>
                    <h3 className="text-sm font-black text-white">{selectedInfo.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{selectedInfo.description}</p>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Times Collected:</span>
                      <span className="font-bold text-cyan-300 font-mono">{selectedItem.count}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Max Depth:</span>
                      <span className="font-bold text-amber-300 font-mono">{selectedItem.maxDepthFound}m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Rarity:</span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[9px] ${
                          selectedInfo.rarity === 'Common'
                            ? 'bg-slate-700/60 text-slate-200'
                            : selectedInfo.rarity === 'Uncommon'
                            ? 'bg-green-700/60 text-green-200'
                            : selectedInfo.rarity === 'Rare'
                            ? 'bg-blue-700/60 text-blue-200'
                            : selectedInfo.rarity === 'Epic'
                            ? 'bg-purple-700/60 text-purple-200'
                            : 'bg-amber-700/60 text-amber-200'
                        }`}
                      >
                        {selectedInfo.rarity}
                      </span>
                    </div>
                  </div>

                  {/* Discovery Date */}
                  <div className="pt-2 border-t border-slate-700/50">
                    <p className="text-[10px] text-slate-500">
                      First discovered
                      <br />
                      {new Date(selectedItem.discoveredAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Unlock Badge */}
                {selectedItem.count >= 5 && (
                  <div className="mt-2 p-2 rounded-lg bg-amber-900/40 border border-amber-600/50 text-center">
                    <p className="text-[10px] font-bold text-amber-300">🏆 MASTERED</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-48 flex-shrink-0 flex items-center justify-center text-center"
              >
                <p className="text-xs text-slate-400">Select a species to view details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-3 border-t border-cyan-500/20 bg-slate-950/50">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <p className="text-slate-400">Common</p>
              <p className="font-bold text-slate-300">
                {discoveredItems.filter(([type]) => ['oyster', 'fish'].includes(type)).length}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Rare</p>
              <p className="font-bold text-blue-300">
                {discoveredItems.filter(([type]) => ['seahorse', 'crab', 'eel'].includes(type)).length}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Epic+</p>
              <p className="font-bold text-amber-300">
                {discoveredItems.filter(([type]) => ['octopus', 'squid', 'angler'].includes(type)).length}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
