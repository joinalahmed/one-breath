export interface DiverRankInfo {
  level: number;
  title: string;
  koreanTitle: string;
  badgeEmoji: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  minDepth: number;
  minCoins: number;
  description: string;
  perk: string;
}

export const DIVER_RANKS: DiverRankInfo[] = [
  {
    level: 1,
    title: 'Apprentice Diver',
    koreanTitle: '소군 (Subagun)',
    badgeEmoji: '🌊',
    color: 'text-cyan-400',
    bgGradient: 'from-cyan-900/60 to-blue-950/80',
    borderColor: 'border-cyan-500/50',
    minDepth: 0,
    minCoins: 0,
    description: 'Beginning your journey in the sunlit shallows.',
    perk: 'Standard basket & diving stone',
  },
  {
    level: 2,
    title: 'Reef Explorer',
    koreanTitle: '중군 (Junggun)',
    badgeEmoji: '🤿',
    color: 'text-emerald-400',
    bgGradient: 'from-emerald-900/60 to-teal-950/80',
    borderColor: 'border-emerald-500/50',
    minDepth: 15,
    minCoins: 40,
    description: 'Mastered shallow reef currents and harvesting medium oysters.',
    perk: '+10% Bonus value on reef harvests',
  },
  {
    level: 3,
    title: 'Deep Trench Hunter',
    koreanTitle: '상군 (Sanggun)',
    badgeEmoji: '💎',
    color: 'text-amber-400',
    bgGradient: 'from-amber-900/60 to-yellow-950/80',
    borderColor: 'border-amber-500/50',
    minDepth: 30,
    minCoins: 150,
    description: 'Brave the shark zone at 30m+ and harvest giant pearls.',
    perk: 'Unlocks Heavy Stone & Shark Repellent in Shop',
  },
  {
    level: 4,
    title: 'Abyss Master',
    koreanTitle: '대상군 (Dae-Sanggun)',
    badgeEmoji: '🔱',
    color: 'text-purple-400',
    bgGradient: 'from-purple-900/60 to-indigo-950/80',
    borderColor: 'border-purple-500/50',
    minDepth: 45,
    minCoins: 400,
    description: 'Elite diver navigating the dark midnight abyss.',
    perk: '+20% Speed on stone drop ascents',
  },
  {
    level: 5,
    title: 'Ocean Guardian',
    koreanTitle: '해녀 전설 (Haenyeo Legend)',
    badgeEmoji: '👑',
    color: 'text-rose-400',
    bgGradient: 'from-rose-900/60 to-amber-950/80',
    borderColor: 'border-rose-500/50',
    minDepth: 55,
    minCoins: 800,
    description: 'Legendary diver touching the 60m ocean floor trench bed.',
    perk: 'Triple multiplier bonus on 5x+ streaks',
  },
  {
    level: 6,
    title: 'Poseidon Celestial',
    koreanTitle: '바다의 신 (Sea Deity)',
    badgeEmoji: '⭐',
    color: 'text-yellow-300',
    bgGradient: 'from-yellow-600/60 via-amber-700/60 to-slate-950/90',
    borderColor: 'border-yellow-300',
    minDepth: 60,
    minCoins: 1500,
    description: 'Supreme ruler of the sea depth and ocean treasures.',
    perk: 'Ultimate Diver Crown & Eternal Glory',
  },
];

export function getPlayerRank(bestDepth: number, totalCoins: number): DiverRankInfo {
  let currentRank = DIVER_RANKS[0];
  for (const rank of DIVER_RANKS) {
    if (bestDepth >= rank.minDepth || totalCoins >= rank.minCoins) {
      currentRank = rank;
    }
  }
  return currentRank;
}

export function getNextRank(currentLevel: number): DiverRankInfo | null {
  return DIVER_RANKS.find((r) => r.level === currentLevel + 1) || null;
}
