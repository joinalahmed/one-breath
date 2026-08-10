import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PhotoLibrary } from '../types';

interface PhotoLibraryModalProps {
  photoLibrary: PhotoLibrary;
  onClose: () => void;
}

const ITEM_INFO: Record<string, { emoji: string; name: string; scientificName: string; description: string; rarity: string; habitat: string; color: { bg: string; border: string; glow: string } }> = {
  oyster: {
    emoji: '🐚',
    name: 'Pearl Oyster',
    scientificName: 'Pinctada radiata',
    description: 'A precious pearl-bearing shellfish found anchored to rocks. Slowly filters nutrients from the water.',
    rarity: 'Common',
    habitat: '0-15m (Shallow Reef)',
    color: { bg: 'from-slate-600 to-slate-700', border: 'slate-500', glow: 'slate-400/40' },
  },
  fish: {
    emoji: '🐟',
    name: 'Reef Fish',
    scientificName: 'Pisces variatus',
    description: 'Colorful tropical fish in countless varieties. Schools dart between coral branches in search of plankton.',
    rarity: 'Common',
    habitat: '0-20m (Coral Garden)',
    color: { bg: 'from-cyan-500 to-blue-600', border: 'blue-400', glow: 'blue-300/40' },
  },
  seahorse: {
    emoji: '🐴',
    name: 'Seahorse',
    scientificName: 'Hippocampus reidi',
    description: 'Mystical and graceful denizen of the reef. Moves slowly while gripping seagrass with its prehensile tail.',
    rarity: 'Rare',
    habitat: '5-25m (Seagrass Beds)',
    color: { bg: 'from-green-500 to-emerald-600', border: 'emerald-400', glow: 'emerald-300/40' },
  },
  crab: {
    emoji: '🦀',
    name: 'Hermit Crab',
    scientificName: 'Pagurus longicarpus',
    description: 'Swift scavenging crustacean that hides in abandoned shells. Fearless hunter of the rocky seabed.',
    rarity: 'Rare',
    habitat: '10-30m (Rocky Shelves)',
    color: { bg: 'from-red-600 to-orange-600', border: 'orange-500', glow: 'orange-400/40' },
  },
  eel: {
    emoji: '🐍',
    name: 'Electric Eel',
    scientificName: 'Electrophorus electricus',
    description: 'Dangerous predatory fish that shocks with electricity. Hunts in darkness near deep crevices.',
    rarity: 'Rare',
    habitat: '20-40m (Deep Caves)',
    color: { bg: 'from-yellow-600 to-amber-700', border: 'yellow-500', glow: 'yellow-400/40' },
  },
  octopus: {
    emoji: '🐙',
    name: 'Octopus',
    scientificName: 'Octopus vulgaris',
    description: 'Intelligent eight-armed cephalopod master of disguise. Changes color to hunt prey and escape predators.',
    rarity: 'Epic',
    habitat: '15-45m (Deep Reef)',
    color: { bg: 'from-purple-600 to-indigo-700', border: 'purple-500', glow: 'purple-400/40' },
  },
  squid: {
    emoji: '🦑',
    name: 'Squid',
    scientificName: 'Teuthida giganteus',
    description: 'Fast-moving deep sea hunter with remarkable intelligence and tentacles lined with powerful suction cups.',
    rarity: 'Epic',
    habitat: '30-50m (Abyssal Zone)',
    color: { bg: 'from-violet-600 to-fuchsia-700', border: 'violet-500', glow: 'violet-400/40' },
  },
  angler: {
    emoji: '🦑',
    name: 'Anglerfish',
    scientificName: 'Melanocetus johnsonii',
    description: 'Bioluminescent deep dweller with hypnotic lure. Hunts in the pitch-black abyss where light is extinct.',
    rarity: 'Legendary',
    habitat: '50-60m (The Abyss)',
    color: { bg: 'from-indigo-700 to-slate-900', border: 'indigo-600', glow: 'indigo-500/40' },
  },
};

export const PhotoLibraryModal: React.FC<PhotoLibraryModalProps> = ({ photoLibrary, onClose }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [hoveredType, setHoveredType] = useState<string | null>(null);

  const discoveredItems = Object.entries(photoLibrary).sort(
    (a, b) => new Date(b[1].discoveredAt).getTime() - new Date(a[1].discoveredAt).getTime()
  );

  const selectedItem = selectedType ? photoLibrary[selectedType] : null;
  const selectedInfo = selectedType ? ITEM_INFO[selectedType] : null;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'from-slate-600 to-slate-700 text-slate-100';
      case 'Rare': return 'from-blue-600 to-blue-700 text-blue-100';
      case 'Epic': return 'from-purple-600 to-purple-700 text-purple-100';
      case 'Legendary': return 'from-amber-600 to-amber-700 text-amber-100';
      default: return 'from-slate-600 to-slate-700 text-slate-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, rotateX: -20 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        exit={{ scale: 0.85, opacity: 0, rotateX: -20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[95vh] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-3xl border border-cyan-500/20 shadow-2xl flex flex-col overflow-hidden"
        style={{
          boxShadow: '0 25px 50px rgba(0, 188, 212, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-cyan-500/20 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="flex justify-between items-start mb-4">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 uppercase tracking-widest"
              >
                📷 Species Compendium
              </motion.h2>
              <p className="text-sm text-slate-400 mt-2">Your underwater discoveries • {discoveredItems.length} species catalogued</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all"
            >
              ✕
            </motion.button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex gap-6 p-6">
          {/* Left: 3D Card Grid */}
          <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
            <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <AnimatePresence>
                {discoveredItems.map(([type, item]) => {
                  const info = ITEM_INFO[type];
                  const isSelected = selectedType === type;
                  const isHovered = hoveredType === type;

                  return (
                    <motion.div
                      key={type}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05, rotateZ: -2 }}
                      onHoverStart={() => setHoveredType(type)}
                      onHoverEnd={() => setHoveredType(null)}
                      onClick={() => setSelectedType(type)}
                      className={`cursor-pointer relative group transition-all duration-300 ${isSelected ? 'z-10' : 'z-0'}`}
                      style={{
                        perspective: '1000px',
                      }}
                    >
                      {/* Card Container */}
                      <motion.div
                        animate={{
                          rotateY: isHovered ? 5 : 0,
                          rotateX: isHovered ? -5 : 0,
                        }}
                        className={`relative w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                          isSelected
                            ? `border-cyan-400 ${info.color.border}`
                            : 'border-slate-700/50 hover:border-slate-600'
                        }`}
                        style={{
                          boxShadow: isSelected
                            ? `0 0 30px rgba(34, 211, 238, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)`
                            : isHovered
                            ? '0 15px 35px rgba(0, 0, 0, 0.5)'
                            : '0 5px 15px rgba(0, 0, 0, 0.3)',
                          background: `linear-gradient(135deg, ${info.color.bg})`,
                        }}
                      >
                        {/* Creature Emoji - Large */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                          <span className="text-8xl">{info.emoji}</span>
                        </div>

                        {/* Content Overlay */}
                        <div className="relative h-full flex flex-col justify-between p-3 bg-gradient-to-t from-slate-900/95 via-transparent to-transparent">
                          {/* Top: Rarity Badge */}
                          <div className="flex justify-between items-start">
                            <div />
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={`text-[10px] font-black px-2 py-1 rounded-lg bg-gradient-to-r ${getRarityColor(info.rarity)} backdrop-blur-sm`}
                            >
                              {info.rarity}
                            </motion.span>
                          </div>

                          {/* Bottom: Name and Count */}
                          <div>
                            <h3 className="text-sm font-black text-white leading-tight mb-1">{info.name}</h3>
                            <div className="flex justify-between items-end">
                              <span className="text-2xl">{info.emoji}</span>
                              <motion.span
                                animate={{ scale: isHovered ? 1.2 : 1 }}
                                className="text-xs font-bold text-cyan-300 bg-cyan-900/60 px-2 py-1 rounded-lg backdrop-blur"
                              >
                                ×{item.count}
                              </motion.span>
                            </div>
                          </div>
                        </div>

                        {/* Shine Effect on Hover */}
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 0.2, x: 100 }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: 'linear-gradient(90deg, transparent, white, transparent)',
                            }}
                          />
                        )}
                      </motion.div>

                      {/* Mastery Badge */}
                      {item.count >= 5 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-black text-sm shadow-lg z-20"
                        >
                          ★
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right: Large Detail Card */}
          <AnimatePresence mode="wait">
            {selectedItem && selectedInfo ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="w-72 flex-shrink-0 flex flex-col"
              >
                {/* Large Immersive Card */}
                <motion.div
                  animate={{
                    rotateY: selectedType ? 0 : 90,
                  }}
                  className="relative w-full h-80 rounded-3xl overflow-hidden mb-4 group"
                  style={{
                    background: `linear-gradient(135deg, ${selectedInfo.color.bg})`,
                    boxShadow: `0 25px 50px rgba(0, 0, 0, 0.4), 0 0 40px ${selectedInfo.color.glow}`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Background Creature */}
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 2, -2, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 flex items-center justify-center opacity-30"
                  >
                    <span className="text-9xl">{selectedInfo.emoji}</span>
                  </motion.div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                  {/* Stats Overlay */}
                  <div className="relative h-full flex flex-col justify-end p-5">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-2"
                    >
                      <h2 className="text-2xl font-black text-white">{selectedInfo.name}</h2>
                      <p className="text-xs text-slate-300 italic">{selectedInfo.scientificName}</p>
                      <div className="flex gap-2 pt-2">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full bg-gradient-to-r ${getRarityColor(selectedInfo.rarity)}`}>
                          {selectedInfo.rarity}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Info Panel */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex-1 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-4 border border-slate-700/50 backdrop-blur-sm space-y-4 overflow-y-auto no-scrollbar"
                >
                  {/* Description */}
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About</p>
                    <p className="text-sm text-slate-200 leading-relaxed">{selectedInfo.description}</p>
                  </div>

                  {/* Habitat */}
                  <div className="pt-2 border-t border-slate-700/50">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Habitat</p>
                    <p className="text-sm text-cyan-300 font-mono">{selectedInfo.habitat}</p>
                  </div>

                  {/* Stats */}
                  <div className="pt-2 border-t border-slate-700/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Times Collected</span>
                      <motion.span
                        key={selectedItem.count}
                        animate={{ scale: [1, 1.2, 1] }}
                        className="text-lg font-black text-cyan-300"
                      >
                        {selectedItem.count}
                      </motion.span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Max Depth</span>
                      <span className="text-lg font-black text-amber-300">{selectedItem.maxDepthFound}m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">First Found</span>
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(selectedItem.discoveredAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Mastery */}
                  {selectedItem.count >= 5 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-2 border-t border-slate-700/50"
                    >
                      <div className="p-3 rounded-xl bg-gradient-to-r from-amber-900/40 to-amber-800/40 border border-amber-600/50 text-center">
                        <p className="text-xs font-black text-amber-300 uppercase tracking-wider">★ MASTERED ★</p>
                        <p className="text-[10px] text-amber-200 mt-1">Expert knowledge of this species</p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-72 flex-shrink-0 flex items-center justify-center"
              >
                <div className="text-center">
                  <span className="text-6xl mb-3 block">🔍</span>
                  <p className="text-sm text-slate-400">Select a species to view its detailed profile</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-cyan-500/20 bg-gradient-to-t from-slate-950 to-slate-900/50">
          <div className="grid grid-cols-4 gap-3 text-center text-xs">
            <motion.div whileHover={{ scale: 1.05 }} className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors">
              <p className="text-slate-400 font-bold text-[10px]">TOTAL</p>
              <p className="text-lg font-black text-slate-300">{discoveredItems.length}</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors">
              <p className="text-slate-400 font-bold text-[10px]">COMMON</p>
              <p className="text-lg font-black text-slate-300">
                {discoveredItems.filter(([type]) => ['oyster', 'fish'].includes(type)).length}
              </p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors">
              <p className="text-slate-400 font-bold text-[10px]">RARE</p>
              <p className="text-lg font-black text-blue-300">
                {discoveredItems.filter(([type]) => ['seahorse', 'crab', 'eel'].includes(type)).length}
              </p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors">
              <p className="text-slate-400 font-bold text-[10px]">EPIC+</p>
              <p className="text-lg font-black text-purple-300">
                {discoveredItems.filter(([type]) => ['octopus', 'squid', 'angler'].includes(type)).length}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
