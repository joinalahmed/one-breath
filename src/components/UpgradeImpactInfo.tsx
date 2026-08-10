import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';

interface UpgradeImpactInfoProps {
  upgradeKey: string;
  currentLevel: number;
  maxLevel: number;
}

export const UpgradeImpactInfo: React.FC<UpgradeImpactInfoProps> = ({
  upgradeKey,
  currentLevel,
  maxLevel,
}) => {
  const impacts: Record<string, { icon: string; impacts: string[] }> = {
    lungTraining: {
      icon: '🫁',
      impacts: [
        `+${currentLevel * 25} Max Air (Total: ${100 + currentLevel * 25})`,
        'Stay underwater 25% longer per level',
        'Reach deeper zones safely',
      ],
    },
    largerBasket: {
      icon: '🧺',
      impacts: [
        `+${currentLevel * 2} Inventory Slots (Total: ${6 + currentLevel * 2})`,
        'Carry more treasure per dive',
        'Complete hauls without dropping items',
      ],
    },
    fastFins: {
      icon: '🪸',
      impacts: [
        `+${currentLevel * 20}% Movement Speed`,
        'Escape sharks faster',
        'Collect items more quickly',
      ],
    },
    heavierStone: {
      icon: '🪨',
      impacts: [
        `+${(currentLevel * 1.2).toFixed(1)} m/s Descent Speed`,
        'Reach depth zones faster',
        'Outrun slower predators',
      ],
    },
    betterRope: {
      icon: '🪢',
      impacts: [
        `+${currentLevel * 20}% Ascent Speed`,
        'Escape to surface faster',
        'Save air during emergencies',
      ],
    },
    pearlGoggles: {
      icon: '🥽',
      impacts: [
        `+${currentLevel * 15}% Pearl Value`,
        'Every catch worth 15% more per level',
        'Big hauls get even bigger rewards',
      ],
    },
    sharkRepellent: {
      icon: '🦈',
      impacts: [
        `Reduces shark danger zone by ${currentLevel * 15}%`,
        'Can swim closer to shark safely',
        'More flexible dive planning',
      ],
    },
    moraySuit: {
      icon: '🐍',
      impacts: [
        `Eel shock protection level ${currentLevel}`,
        'Reduce damage from electric eels',
        'Safely explore eel habitats',
      ],
    },
    seahorseCharm: {
      icon: '🌊',
      impacts: [
        `+${currentLevel} Rare species spawn rate`,
        'More seahorses appear',
        'More rare creatures to catch',
      ],
    },
    octopusNet: {
      icon: '🐙',
      impacts: [
        `Octopus catch speed level ${currentLevel}`,
        'Catch giant octopuses faster',
        'Complete hauls with rares',
      ],
    },
    sonarRadar: {
      icon: '📡',
      impacts: [
        `Detection range +${currentLevel * 5}m`,
        'See threats coming earlier',
        'Avoid danger zones',
      ],
    },
    bioluminescentLamp: {
      icon: '💡',
      impacts: [
        `Glow radius +${currentLevel * 10}m`,
        'Illuminate dark depths',
        'Find hidden treasures',
      ],
    },
  };

  const info = impacts[upgradeKey];
  if (!info) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2 p-2 rounded-lg bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/40"
    >
      <div className="flex items-start gap-2">
        <span className="text-lg shrink-0 mt-0.5">{info.icon}</span>
        <div className="flex-1">
          <p className="text-xs font-bold text-cyan-300 mb-1 flex items-center gap-1">
            <TrendingUp size={12} />
            GAMEPLAY IMPACT (Level {currentLevel}/{maxLevel})
          </p>
          <ul className="space-y-0.5">
            {info.impacts.map((impact, i) => (
              <li key={i} className="text-[10px] text-slate-200">
                ✓ {impact}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};
