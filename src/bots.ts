import { BotDiver } from './types';

export const INITIAL_BOTS: BotDiver[] = [
  { id: 'bot_1', name: 'Amina', role: 'Elder Diver', avatarColor: '#f59e0b', bestDepth: 42.5, totalCoins: 480, currentStatus: 'resting in bulteok' },
  { id: 'bot_2', name: 'Rashid', role: 'Stone Cutter', avatarColor: '#ef4444', bestDepth: 38.0, totalCoins: 390, currentStatus: 'diving' },
  { id: 'bot_3', name: 'Fatima', role: 'Deep Diver', avatarColor: '#3b82f6', bestDepth: 51.2, totalCoins: 620, currentStatus: 'at surface' },
  { id: 'bot_4', name: 'Tariq', role: 'Shallow Fisher', avatarColor: '#10b981', bestDepth: 18.4, totalCoins: 210, currentStatus: 'diving' },
  { id: 'bot_5', name: 'Zahra', role: 'Rope Crew', avatarColor: '#8b5cf6', bestDepth: 29.0, totalCoins: 310, currentStatus: 'resting in bulteok' },
  { id: 'bot_6', name: 'Sultan', role: 'Pearl Finder', avatarColor: '#ec4899', bestDepth: 45.8, totalCoins: 510, currentStatus: 'at surface' },
  { id: 'bot_7', name: 'Maryam', role: 'Haenyeo Captain', avatarColor: '#14b8a6', bestDepth: 55.0, totalCoins: 780, currentStatus: 'at surface' },
  { id: 'bot_8', name: 'Khaled', role: 'Apprentice', avatarColor: '#f97316', bestDepth: 14.2, totalCoins: 120, currentStatus: 'diving' },
  { id: 'bot_9', name: 'Noura', role: 'Reef Scout', avatarColor: '#06b6d4', bestDepth: 33.1, totalCoins: 340, currentStatus: 'resting in bulteok' },
  { id: 'bot_10', name: 'Hassan', role: 'Veteran Diver', avatarColor: '#84cc16', bestDepth: 48.3, totalCoins: 590, currentStatus: 'diving' },
  { id: 'bot_11', name: 'Layla', role: 'Free Diver', avatarColor: '#eab308', bestDepth: 36.5, totalCoins: 410, currentStatus: 'at surface' },
  { id: 'bot_12', name: 'Bilal', role: 'Boat Crew', avatarColor: '#6366f1', bestDepth: 22.0, totalCoins: 230, currentStatus: 'resting in bulteok' },
  { id: 'bot_13', name: 'Salma', role: 'Deep Scout', avatarColor: '#d946ef', bestDepth: 49.0, totalCoins: 640, currentStatus: 'diving' },
  { id: 'bot_14', name: 'Omar', role: 'Shark Watcher', avatarColor: '#64748b', bestDepth: 31.5, totalCoins: 320, currentStatus: 'at surface' },
  { id: 'bot_15', name: 'Hind', role: 'Pearl Hunter', avatarColor: '#a855f7', bestDepth: 44.0, totalCoins: 500, currentStatus: 'at surface' },
  { id: 'bot_16', name: 'Zayd', role: 'Spear Fisher', avatarColor: '#22c55e', bestDepth: 16.8, totalCoins: 180, currentStatus: 'diving' },
  { id: 'bot_17', name: 'Asma', role: 'Sumbisori Whistler', avatarColor: '#38bdf8', bestDepth: 39.4, totalCoins: 430, currentStatus: 'resting in bulteok' },
  { id: 'bot_18', name: 'Faisal', role: 'Basket Weaver', avatarColor: '#fb923c', bestDepth: 27.5, totalCoins: 290, currentStatus: 'at surface' },
  { id: 'bot_19', name: 'Reem', role: 'Tide Reader', avatarColor: '#a3e635', bestDepth: 34.0, totalCoins: 370, currentStatus: 'diving' },
];

export function simulateBotActivity(bots: BotDiver[]): BotDiver[] {
  return bots.map((bot) => {
    // Random status shifts
    const roll = Math.random();
    if (roll < 0.25) {
      const statuses: Array<'diving' | 'at surface' | 'resting in bulteok'> = ['diving', 'at surface', 'resting in bulteok'];
      const nextStatus = statuses[Math.floor(Math.random() * statuses.length)];
      let recentHaul = bot.recentHaul;
      if (nextStatus === 'at surface' && bot.currentStatus === 'diving') {
        const pearls = Math.floor(Math.random() * 4);
        const fish = Math.floor(Math.random() * 3);
        const depth = Math.round((10 + Math.random() * (bot.bestDepth - 5)) * 10) / 10;
        recentHaul = `${pearls} pearls, ${fish} fish at ${depth}m`;
        bot.totalCoins += pearls * 8 + fish * 3;
      }
      return {
        ...bot,
        currentStatus: nextStatus,
        recentHaul,
      };
    }
    return bot;
  });
}
