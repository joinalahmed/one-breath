import React from 'react';
import { motion } from 'motion/react';
import { PlayerStats } from '../types';
import { soundManager } from '../audioAndHaptics';

interface PearlCoastHomeScreenProps {
  stats: PlayerStats;
  onStartDive: () => void;
}

/**
 * Full-bleed landing screen for the "Pearl Coast" redesign.
 *
 * The background is the animated village scene (game-main-screen-bg.gif). Every
 * piece of UI — the HUD counters and the buttons — is a separate transparent PNG
 * asset layered on top, NOT baked into the art. This lets us bind live numbers to
 * the HUD chips and attach real click handlers to the buttons.
 *
 * Layout strategy: the gif + all overlays live inside ONE box locked to the art's
 * native aspect ratio (ART_W / ART_H = 9:16). The box is sized to COVER the frame
 * (overflow hidden, centered), so on a taller/narrower frame only the art's left &
 * right margins ever crop — never the vertical bands where the HUD (top) and the
 * buttons (bottom) live. All overlay chrome is inset from the edges so it survives
 * that horizontal crop.
 *
 * The box is a `container-type: inline-size` query container, so asset sizes and
 * label font sizes are expressed in `cqw` and scale with the art on any device.
 */

const ART_W = 720;
const ART_H = 1280;

const asset = (name: string) => `/assets/pearl-coast-clean-buttons-v2/${name}.png`;

export const PearlCoastHomeScreen: React.FC<PearlCoastHomeScreenProps> = (props) => {
  const { onStartDive } = props;

  const withClick = (fn: () => void) => () => {
    soundManager.playConfirm();
    fn();
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-[#0b2f4a] flex items-center justify-center select-none"
      style={{ containerType: 'size' }}
    >
      {/* Art box: locked to the native art aspect and sized to COVER the frame, so
          overlays always track the scene and only the side margins ever crop. */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: `${ART_W} / ${ART_H}`,
          // Smallest box with the art aspect that still fills the frame both ways.
          width: `max(100cqw, calc(100cqh * ${ART_W} / ${ART_H}))`,
          containerType: 'inline-size',
        }}
      >
        {/* Animated village background */}
        <img
          src="/assets/game-main-screen-bg.gif"
          alt="Pearl Coast village"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />

        {/* Subtle top/bottom scrims so the HUD numbers and buttons stay legible
            over the brightest parts of the scene. */}
        <div
          className="absolute inset-x-0 top-0 h-[16%] pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(3,20,35,0.45), transparent)' }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[34%] pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(3,20,35,0.55), transparent)' }}
        />

        {/* The HUD (level ring + currency/streak counters) is the shared <TopHud>,
            rendered by SurfaceScreen over this landing so it's identical on every
            hub screen. */}

        {/* PRIMARY CTA — START DIVE */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={withClick(onStartDive)}
          aria-label="Start Dive"
          className="absolute z-10 left-1/2 -translate-x-1/2 cursor-pointer focus:outline-none"
          style={{ bottom: '17%', width: '64cqw' }}
        >
          <img
            src={asset('button-start-dive')}
            alt=""
            className="w-full h-auto pointer-events-none"
            draggable={false}
            style={{ filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.4))' }}
          />
        </motion.button>

        {/* Bottom navigation is the shared <BottomNav>, rendered by SurfaceScreen
            over this landing (and on every other hub screen) so it stays identical
            everywhere. */}
      </div>
    </div>
  );
};
