import React from 'react';
import { HudCounter } from './HudCounter';
import { PlayerStats } from '../types';

/**
 * The shared Pearl Coast HUD readout — level ring + pearl / fish / streak
 * counters, all built from the same transparent PNG assets used on the landing
 * screen. Rendered on every hub screen so the HUD looks identical everywhere;
 * it is NOT shown during a dive (gameplay lives outside the surface hub).
 */

interface TopHudProps {
  stats: PlayerStats;
  /** Rendered height of each counter asset, in px. */
  height?: number;
  /** Show the level ring. Only the home screen shows it; sub-screens hide it. */
  showLevel?: boolean;
  className?: string;
}

export const TopHud: React.FC<TopHudProps> = ({ stats, height = 34, showLevel = true, className }) => {
  const level = Math.min(100, stats.totalDives + 1);
  return (
    <div className={`flex items-center justify-between gap-2 w-full ${className ?? ''}`}>
      {showLevel && (
        <HudCounter art="hud-level-ring" value={level} height={height} labelLeft={50} color="#0f766e" fontSize={Math.round(height * 0.42)} />
      )}
      <HudCounter art="hud-pearl-counter" value={stats.coins} height={height} labelLeft={62} color="#5b4326" />
      <HudCounter art="hud-fish-counter" value={stats.food} height={height} labelLeft={63} color="#0e7490" />
      <HudCounter art="hud-streak-counter" value={stats.streak} height={height} labelLeft={64} color="#b45309" />
    </div>
  );
};
