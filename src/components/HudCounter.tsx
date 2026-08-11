import React from 'react';

/**
 * A single Pearl Coast HUD counter: one of the transparent pill/ring PNG assets
 * (icon baked on the left) with a live number laid over its right portion.
 *
 * Used on the landing screen and the store chrome so currency/level readouts look
 * identical everywhere. Size in px via `height`; the number is placed as a % of
 * the asset's own width (`labelLeft`) so it lands in the empty area beside the icon.
 */

const HUD_ASSET = (name: string) => `/assets/pearl-coast-clean-buttons-v2/${name}.png`;

interface HudCounterProps {
  art: string;
  value: number | string;
  /** Rendered height of the asset, in px. */
  height?: number;
  /** Horizontal center of the number, as a % of the asset's width. */
  labelLeft?: number;
  /** Number color. */
  color?: string;
  /** Number font size, in px. */
  fontSize?: number;
  className?: string;
}

export const HudCounter: React.FC<HudCounterProps> = ({
  art,
  value,
  height = 38,
  labelLeft = 62,
  color = '#5b4326',
  fontSize = 15,
  className,
}) => (
  <div className={`relative inline-flex items-center shrink-0 ${className ?? ''}`} style={{ height }}>
    <img
      src={HUD_ASSET(art)}
      alt=""
      draggable={false}
      className="h-full w-auto pointer-events-none"
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
    />
    <span
      className="absolute -translate-x-1/2 -translate-y-1/2 font-black font-mono pointer-events-none"
      style={{
        left: `${labelLeft}%`,
        top: '48%',
        color,
        fontSize,
        lineHeight: 1,
        textShadow: '0 1px 1px rgba(255,255,255,0.5)',
        whiteSpace: 'nowrap',
      }}
    >
      {value}
    </span>
  </div>
);
