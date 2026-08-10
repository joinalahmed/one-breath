import React, { useMemo } from 'react';

interface BubbleOverlayProps {
  count?: number;
  className?: string;
}

interface BubbleConfig {
  id: number;
  size: number;
  left: number;
  riseDuration: number;
  swayDuration: number;
  delay: number;
}

export const BubbleOverlay: React.FC<BubbleOverlayProps> = ({
  count = 22,
  className = '',
}) => {
  const bubbles = useMemo<BubbleConfig[]>(() => {
    return Array.from({ length: count }).map((_, i) => {
      // Varied sizes from 12px up to 55px
      const size = 12 + Math.floor(Math.random() * 45);
      // Random X start position across screen percentage
      const left = Math.floor(Math.random() * 96);
      // Varied speed/duration for natural asynchronous rising
      const riseDuration = 7 + Math.random() * 12; // 7s to 19s
      const swayDuration = 3 + Math.random() * 4; // 3s to 7s
      const delay = -(Math.random() * riseDuration); // negative delay so they start pre-populated across screen

      return {
        id: i,
        size,
        left,
        riseDuration,
        swayDuration,
        delay,
      };
    });
  }, [count]);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="bowley-bubble"
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            left: `${b.left}%`,
            animationDuration: `${b.riseDuration}s, ${b.swayDuration}s`,
            animationDelay: `${b.delay}s, ${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
};
