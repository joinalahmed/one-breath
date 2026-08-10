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
  count = 18,
  className = '',
}) => {
  const bubbles = useMemo<BubbleConfig[]>(() => {
    return Array.from({ length: count }).map((_, i) => {
      // Natural ambient bubble sizes from 8px to 28px
      const size = 8 + Math.floor(Math.random() * 20);
      // Random X start position across screen percentage
      const left = Math.floor(Math.random() * 94) + 3;
      // Varied speed/duration for natural asynchronous rising
      const riseDuration = 6 + Math.random() * 10;
      const swayDuration = 2.5 + Math.random() * 3.5;
      const delay = -(Math.random() * riseDuration);

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
