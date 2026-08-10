import React from 'react';

// Common style parameters: dark navy outline #1d2d50 or #1e2952
const OUTLINE_COLOR = '#1d2d50';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

// 1. SCUBA DIVER ICON
export const IconDiver: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Tank */}
    <rect x="22" y="48" width="16" height="30" rx="8" fill="#38bdf8" stroke={OUTLINE_COLOR} strokeWidth="4" />
    <rect x="25" y="58" width="10" height="4" fill="#facc15" />
    {/* Wetsuit Body */}
    <path
      d="M32 30 C 45 20, 65 30, 75 50 C 65 65, 50 68, 38 60 Z"
      fill="#2563eb"
      stroke={OUTLINE_COLOR}
      strokeWidth="4"
    />
    {/* Legs */}
    <path
      d="M68 48 L85 62 M62 56 L80 72"
      stroke="#1d4ed8"
      strokeWidth="8"
      strokeLinecap="round"
    />
    <path
      d="M68 48 L85 62 M62 56 L80 72"
      stroke={OUTLINE_COLOR}
      strokeWidth="11"
      strokeLinecap="round"
      style={{ mixBlendMode: 'overlay' }}
    />
    {/* Flippers */}
    <path
      d="M82 58 L98 62 L90 70 Z M78 68 L94 72 L86 80 Z"
      fill="#facc15"
      stroke={OUTLINE_COLOR}
      strokeWidth="3"
      strokeLinejoin="round"
    />
    {/* Head / Hood */}
    <circle cx="28" cy="28" r="14" fill="#1e2952" stroke={OUTLINE_COLOR} strokeWidth="3" />
    {/* Mask Frame & Glass */}
    <ellipse cx="20" cy="30" rx="7" ry="5" fill="#93c5fd" stroke="#facc15" strokeWidth="3" />
  </svg>
);

// 2. PEARL SHELL ICON
export const IconPearlShell: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Top Fan Shell */}
    <path
      d="M10 50 C 10 15, 90 15, 90 50 C 75 60, 25 60, 10 50 Z"
      fill="#facc15"
      stroke={OUTLINE_COLOR}
      strokeWidth="4"
    />
    {/* Radial Fan Lines */}
    <path
      d="M50 52 L18 28 M50 52 L34 18 M50 52 L50 14 M50 52 L66 18 M50 52 L82 28"
      stroke={OUTLINE_COLOR}
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    {/* Bottom Base Shell */}
    <path
      d="M12 56 C 25 80, 75 80, 88 56 C 75 92, 25 92, 12 56 Z"
      fill="#ea580c"
      stroke={OUTLINE_COLOR}
      strokeWidth="4"
    />
    {/* Shiny Pearl */}
    <circle cx="50" cy="54" r="16" fill="#7dd3fc" stroke={OUTLINE_COLOR} strokeWidth="3.5" />
    <circle cx="44" cy="48" r="4" fill="#ffffff" />
  </svg>
);

// 3. CLOWNFISH ICON
export const IconClownfish: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Tail Fin */}
    <path d="M25 50 L8 30 C 15 50, 15 50, 8 70 Z" fill="#f97316" stroke={OUTLINE_COLOR} strokeWidth="4" />
    {/* Body */}
    <ellipse cx="58" cy="50" rx="35" ry="24" fill="#f97316" stroke={OUTLINE_COLOR} strokeWidth="4" />
    {/* White Stripes */}
    <path
      d="M72 28 C 76 38, 76 62, 72 72 M52 26 C 56 38, 56 62, 52 74 M36 32 C 39 42, 39 58, 36 68"
      stroke="#ffffff"
      strokeWidth="8"
      strokeLinecap="round"
    />
    <path
      d="M72 28 C 76 38, 76 62, 72 72 M52 26 C 56 38, 56 62, 52 74 M36 32 C 39 42, 39 58, 36 68"
      stroke={OUTLINE_COLOR}
      strokeWidth="2"
      strokeDasharray="2 4"
    />
    {/* Eye */}
    <circle cx="78" cy="44" r="4.5" fill={OUTLINE_COLOR} />
    <circle cx="79.5" cy="42.5" r="1.5" fill="#ffffff" />
  </svg>
);

// 4. SEAHORSE ICON
export const IconSeahorse: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Back Fin */}
    <path d="M62 40 C 80 35, 80 55, 62 58 Z" fill="#a3e635" stroke={OUTLINE_COLOR} strokeWidth="3.5" />
    <path d="M62 44 L72 44 M62 49 L74 49 M62 54 L72 54" stroke={OUTLINE_COLOR} strokeWidth="2.5" />
    {/* Head, Body and Coiled Tail */}
    <path
      d="M32 28 C 20 25, 18 35, 30 35 C 45 35, 58 20, 58 10 C 45 8, 35 15, 32 28 M52 35 C 65 50, 55 75, 45 85 C 38 92, 28 85, 35 75 C 42 68, 50 78, 42 82"
      fill="#a3e635"
      stroke={OUTLINE_COLOR}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Segmented Belly */}
    <path
      d="M40 38 C 50 42, 52 58, 42 68 M38 45 L50 48 M38 53 L48 57 M36 60 L44 63"
      stroke={OUTLINE_COLOR}
      strokeWidth="3"
    />
    {/* Eye */}
    <circle cx="42" cy="18" r="4" fill={OUTLINE_COLOR} />
    <circle cx="43" cy="17" r="1" fill="#ffffff" />
  </svg>
);

// 5. CRAB ICON
export const IconCrab: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Legs */}
    <path
      d="M20 50 L8 42 M18 60 L6 58 M22 70 L10 74 M80 50 L92 42 M82 60 L94 58 M78 70 L90 74"
      stroke="#ef4444"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      d="M20 50 L8 42 M18 60 L6 58 M22 70 L10 74 M80 50 L92 42 M82 60 L94 58 M78 70 L90 74"
      stroke={OUTLINE_COLOR}
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Claws */}
    <path d="M30 36 L20 18 C 10 18, 12 34, 28 42 Z" fill="#ef4444" stroke={OUTLINE_COLOR} strokeWidth="3.5" />
    <path d="M70 36 L80 18 C 90 18, 88 34, 72 42 Z" fill="#ef4444" stroke={OUTLINE_COLOR} strokeWidth="3.5" />
    {/* Main Body */}
    <ellipse cx="50" cy="58" rx="30" ry="22" fill="#ef4444" stroke={OUTLINE_COLOR} strokeWidth="4" />
    {/* Eyestalks */}
    <line x1="40" y1="38" x2="40" y2="28" stroke={OUTLINE_COLOR} strokeWidth="3.5" />
    <line x1="60" y1="38" x2="60" y2="28" stroke={OUTLINE_COLOR} strokeWidth="3.5" />
    <circle cx="40" cy="26" r="4.5" fill="#fef08a" stroke={OUTLINE_COLOR} strokeWidth="2" />
    <circle cx="60" cy="26" r="4.5" fill="#fef08a" stroke={OUTLINE_COLOR} strokeWidth="2" />
    <circle cx="40" cy="26" r="1.5" fill={OUTLINE_COLOR} />
    <circle cx="60" cy="26" r="1.5" fill={OUTLINE_COLOR} />
  </svg>
);

// 6. EEL / MORAY ICON
export const IconEel: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Body ribbon shape */}
    <path
      d="M15 25 C 50 10, 85 25, 85 45 C 85 65, 15 55, 15 75 C 15 88, 50 92, 85 85"
      fill="none"
      stroke="#eab308"
      strokeWidth="16"
      strokeLinecap="round"
    />
    <path
      d="M15 25 C 50 10, 85 25, 85 45 C 85 65, 15 55, 15 75 C 15 88, 50 92, 85 85"
      fill="none"
      stroke={OUTLINE_COLOR}
      strokeWidth="20"
      strokeLinecap="round"
      style={{ mixBlendMode: 'destination-over' }}
    />
    {/* Back Fin Ribbon */}
    <path
      d="M15 20 C 50 5, 85 20, 85 40 C 85 60, 15 50, 15 70 C 15 83, 50 87, 85 80"
      fill="none"
      stroke="#f97316"
      strokeWidth="4"
    />
    {/* Head Eye */}
    <circle cx="80" cy="85" r="3" fill={OUTLINE_COLOR} />
  </svg>
);

// 7. OCTOPUS ICON
export const IconOctopus: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Tentacles */}
    <path
      d="M20 60 C 5 70, 5 90, 20 85 C 30 80, 25 65, 35 60 M35 60 C 25 75, 30 95, 42 88 C 50 82, 40 65, 48 60 M52 60 C 60 65, 50 82, 58 88 C 70 95, 75 75, 65 60 M65 60 C 75 65, 70 80, 80 85 C 95 90, 95 70, 80 60"
      stroke="#e11d48"
      strokeWidth="8"
      strokeLinecap="round"
    />
    <path
      d="M20 60 C 5 70, 5 90, 20 85 C 30 80, 25 65, 35 60 M35 60 C 25 75, 30 95, 42 88 C 50 82, 40 65, 48 60 M52 60 C 60 65, 50 82, 58 88 C 70 95, 75 75, 65 60 M65 60 C 75 65, 70 80, 80 85 C 95 90, 95 70, 80 60"
      stroke={OUTLINE_COLOR}
      strokeWidth="11"
      strokeLinecap="round"
      style={{ mixBlendMode: 'destination-over' }}
    />
    {/* Suction Cups */}
    <circle cx="14" cy="80" r="2.5" fill="#fef08a" />
    <circle cx="34" cy="82" r="2.5" fill="#fef08a" />
    <circle cx="64" cy="82" r="2.5" fill="#fef08a" />
    <circle cx="84" cy="80" r="2.5" fill="#fef08a" />
    {/* Main Head */}
    <ellipse cx="50" cy="38" rx="28" ry="24" fill="#e11d48" stroke={OUTLINE_COLOR} strokeWidth="4" />
    {/* Eyes */}
    <ellipse cx="40" cy="42" rx="5" ry="7" fill="#fef08a" stroke={OUTLINE_COLOR} strokeWidth="2" />
    <ellipse cx="60" cy="42" rx="5" ry="7" fill="#fef08a" stroke={OUTLINE_COLOR} strokeWidth="2" />
    <line x1="37" y1="42" x2="43" y2="42" stroke={OUTLINE_COLOR} strokeWidth="2" />
    <line x1="57" y1="42" x2="63" y2="42" stroke={OUTLINE_COLOR} strokeWidth="2" />
  </svg>
);

// =========================================================
// CANVAS VECTOR DRAWING UTILITIES FOR CANVASGAME.TSX
// =========================================================

// 1. Draw Vector Scuba Diver
export function drawVectorDiverCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  options: {
    isDescending: boolean;
    isAscending: boolean;
    carryingStone: boolean;
    isPanic: boolean;
    invulnerable: boolean;
    time: number;
  }
) {
  ctx.save();
  ctx.translate(x, y);

  if (options.invulnerable) {
    ctx.globalAlpha = 0.5 + Math.sin(options.time * 0.02) * 0.5;
  }

  // Tilt angle based on state
  let angle = 0;
  if (options.isDescending) angle = Math.PI / 5; // dipping down
  else if (options.isAscending || options.isPanic) angle = -Math.PI / 5; // reaching up

  ctx.rotate(angle);

  const halfW = width / 2;
  const halfH = height / 2;

  // Oxygen Tanks (Twin Silver / Cyan Metallic Cylinders)
  ctx.save();
  const tankGrad = ctx.createLinearGradient(-halfW * 0.5, -halfH * 0.6, -halfW * 0.1, halfH * 0.5);
  tankGrad.addColorStop(0, '#38bdf8');
  tankGrad.addColorStop(0.5, '#0284c7');
  tankGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = tankGrad;
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 1.5;

  // Tank 1
  ctx.beginPath();
  ctx.roundRect(-halfW * 0.45, -halfH * 0.6, halfW * 0.35, halfH * 1.1, 4);
  ctx.fill();
  ctx.stroke();

  // Tank 2
  ctx.beginPath();
  ctx.roundRect(-halfW * 0.25, -halfH * 0.6, halfW * 0.35, halfH * 1.1, 4);
  ctx.fill();
  ctx.stroke();

  // Tank Brass Harness Straps
  ctx.fillStyle = '#d97706';
  ctx.fillRect(-halfW * 0.45, -halfH * 0.2, halfW * 0.6, 2.5);
  ctx.fillRect(-halfW * 0.45, halfH * 0.2, halfW * 0.6, 2.5);
  ctx.restore();

  // Hydrodynamic Wetsuit Body (Deep Navy Slate)
  ctx.save();
  const suitGrad = ctx.createLinearGradient(-halfW * 0.4, -halfH * 0.5, halfW * 0.6, halfH * 0.6);
  suitGrad.addColorStop(0, '#1e293b');
  suitGrad.addColorStop(0.5, '#0f172a');
  suitGrad.addColorStop(1, '#020617');
  ctx.fillStyle = suitGrad;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.2;

  ctx.beginPath();
  ctx.ellipse(0, 0, halfW * 0.65, halfH * 0.75, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Chest Armor Plate Accent
  ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
  ctx.beginPath();
  ctx.ellipse(halfW * 0.1, 0, halfW * 0.35, halfH * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Helmet Hood
  ctx.save();
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(-halfW * 0.25, -halfH * 0.55, halfW * 0.38, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Glowing HUD Visor (Bioluminescent Cyan Glow)
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 10;
  const visorGrad = ctx.createLinearGradient(-halfW * 0.5, -halfH * 0.7, -halfW * 0.1, -halfH * 0.4);
  visorGrad.addColorStop(0, '#67e8f9');
  visorGrad.addColorStop(0.5, '#06b6d4');
  visorGrad.addColorStop(1, '#0891b2');
  ctx.fillStyle = visorGrad;
  ctx.strokeStyle = '#e0f2fe';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(-halfW * 0.4, -halfH * 0.55, halfW * 0.22, halfH * 0.18, -Math.PI * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Visor Glint
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(-halfW * 0.48, -halfH * 0.62, halfW * 0.08, halfH * 0.05, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Hydrodynamic Flippers (Animated Kick)
  ctx.save();
  const kick = Math.sin(options.time * 0.012) * 8;
  const flipperGrad = ctx.createLinearGradient(halfW * 0.4, halfH * 0.4, halfW * 1.2, halfH * 1.2);
  flipperGrad.addColorStop(0, '#0284c7');
  flipperGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = flipperGrad;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.2;

  // Flipper 1
  ctx.beginPath();
  ctx.moveTo(halfW * 0.4, halfH * 0.3);
  ctx.lineTo(halfW * 1.2, halfH * 0.6 + kick);
  ctx.lineTo(halfW * 0.85, halfH * 1.1 + kick);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Flipper 2
  ctx.beginPath();
  ctx.moveTo(halfW * 0.25, halfH * 0.4);
  ctx.lineTo(halfW * 1.0, halfH * 0.8 - kick);
  ctx.lineTo(halfW * 0.65, halfH * 1.3 - kick);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Carrying Stone Weight
  if (options.carryingStone) {
    ctx.save();
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 6;
    const stoneGrad = ctx.createRadialGradient(0, halfH * 0.7, 2, 0, halfH * 0.7, halfW * 0.35);
    stoneGrad.addColorStop(0, '#94a3b8');
    stoneGrad.addColorStop(0.7, '#475569');
    stoneGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = stoneGrad;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, halfH * 0.7, halfW * 0.32, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Braided tether line
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, halfH * 0.7);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

// 2. Draw Vector Pearl Shell
export function drawVectorPearlShellCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  sizePx: number,
  value: number,
  isEmpty: boolean
) {
  ctx.save();
  ctx.translate(x, y);

  const r = sizePx / 2;

  // Iridescent Top Shell Fan
  ctx.save();
  const shellGrad = ctx.createRadialGradient(0, 0, r * 0.1, 0, -r * 0.2, r);
  shellGrad.addColorStop(0, '#f8fafc');
  shellGrad.addColorStop(0.4, '#cbd5e1');
  shellGrad.addColorStop(0.8, '#64748b');
  shellGrad.addColorStop(1, '#1e293b');

  ctx.fillStyle = shellGrad;
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.arc(0, 0, r, Math.PI * 0.95, Math.PI * 2.05);
  ctx.fill();
  ctx.stroke();

  // Shell Rib Highlights
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1;
  [-0.6, -0.3, 0, 0.3, 0.6].forEach((ang) => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.sin(ang) * r, -Math.cos(ang) * r);
    ctx.stroke();
  });
  ctx.restore();

  // Base Scallop Shell (Dark Coral Slate)
  ctx.save();
  const baseGrad = ctx.createLinearGradient(-r, 0, r, r);
  baseGrad.addColorStop(0, '#9a3412');
  baseGrad.addColorStop(0.5, '#7c2d12');
  baseGrad.addColorStop(1, '#431407');
  ctx.fillStyle = baseGrad;
  ctx.strokeStyle = '#c2410c';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(0, r * 0.3, r, r * 0.45, 0, 0, Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Opalescent Luminous Pearl in Center
  if (!isEmpty) {
    ctx.save();
    const pearlR = r * 0.42;

    // Luminous Pearl Glow
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;

    const pearlGrad = ctx.createRadialGradient(
      -pearlR * 0.3,
      -pearlR * 0.3,
      pearlR * 0.05,
      0,
      0,
      pearlR
    );
    pearlGrad.addColorStop(0, '#ffffff');
    pearlGrad.addColorStop(0.3, '#f0f9ff');
    pearlGrad.addColorStop(0.7, '#bae6fd');
    pearlGrad.addColorStop(1, '#0284c7');

    ctx.fillStyle = pearlGrad;
    ctx.beginPath();
    ctx.arc(0, 0, pearlR, 0, Math.PI * 2);
    ctx.fill();

    // Specular Reflection
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-pearlR * 0.35, -pearlR * 0.35, pearlR * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

// 3. Draw Vector Clownfish
export function drawVectorClownfishCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  sizePx: number,
  facingRight: boolean
) {
  ctx.save();
  ctx.translate(x, y);
  if (!facingRight) ctx.scale(-1, 1);

  const rx = sizePx * 0.6;
  const ry = sizePx * 0.35;

  // Tail Fin (Translucent Coral Fin)
  ctx.save();
  const finGrad = ctx.createLinearGradient(-rx * 0.6, 0, -rx - ry, 0);
  finGrad.addColorStop(0, '#ea580c');
  finGrad.addColorStop(1, 'rgba(251, 146, 60, 0.6)');
  ctx.fillStyle = finGrad;
  ctx.strokeStyle = '#c2410c';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-rx * 0.6, 0);
  ctx.quadraticCurveTo(-rx * 0.9, -ry * 0.9, -rx - ry * 0.8, -ry * 0.8);
  ctx.quadraticCurveTo(-rx - ry * 0.5, 0, -rx - ry * 0.8, ry * 0.8);
  ctx.quadraticCurveTo(-rx * 0.9, ry * 0.9, -rx * 0.6, 0);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Torpedo Body (Coral Orange Gradient)
  ctx.save();
  const bodyGrad = ctx.createLinearGradient(0, -ry, 0, ry);
  bodyGrad.addColorStop(0, '#f97316');
  bodyGrad.addColorStop(0.6, '#ea580c');
  bodyGrad.addColorStop(1, '#9a3412');
  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = '#7c2d12';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Smooth Porcelain White Vertical Bands with subtle black borders
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#020617';
  ctx.lineWidth = 1;
  [rx * 0.28, -0.05 * rx, -rx * 0.42].forEach((sx) => {
    ctx.beginPath();
    ctx.ellipse(sx, 0, rx * 0.12, ry * 0.88, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  // Realistic Fish Eye
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(rx * 0.58, -ry * 0.2, ry * 0.22, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(rx * 0.62, -ry * 0.26, ry * 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

// 4. Draw Vector Seahorse
export function drawVectorSeahorseCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  sizePx: number
) {
  ctx.save();
  ctx.translate(x, y);

  const s = sizePx / 30;

  // Translucent Back Fin
  ctx.save();
  ctx.fillStyle = 'rgba(163, 230, 53, 0.6)';
  ctx.strokeStyle = '#84cc16';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(8 * s, 0, 6 * s, -Math.PI / 2, Math.PI / 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Plated Metallic Body & Crowned Head
  ctx.save();
  const horseGrad = ctx.createLinearGradient(-10 * s, -20 * s, 10 * s, 10 * s);
  horseGrad.addColorStop(0, '#facc15');
  horseGrad.addColorStop(0.5, '#eab308');
  horseGrad.addColorStop(1, '#854d0e');
  ctx.fillStyle = horseGrad;
  ctx.strokeStyle = '#713f12';
  ctx.lineWidth = 1.2;

  ctx.beginPath();
  ctx.moveTo(-8 * s, -12 * s);
  ctx.quadraticCurveTo(-14 * s, -8 * s, -4 * s, -8 * s);
  ctx.quadraticCurveTo(6 * s, -8 * s, 4 * s, -16 * s);
  ctx.quadraticCurveTo(-2 * s, -20 * s, -8 * s, -12 * s);
  ctx.fill();
  ctx.stroke();

  // Coiled Tail
  ctx.beginPath();
  ctx.arc(0, 8 * s, 6 * s, 0, Math.PI * 1.5);
  ctx.stroke();

  // Abdominal Armor Plates
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.ellipse(-2 * s, 0, 4.5 * s, 6.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Eye
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(-2 * s, -14 * s, 1.8 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

// 5. Draw Vector Crab
export function drawVectorCrabCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  sizePx: number
) {
  ctx.save();
  ctx.translate(x, y);

  const r = sizePx * 0.4;

  // Jointed Deepsea Crab Legs
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 2.2;
  [-0.3, 0, 0.3].forEach((ang) => {
    ctx.beginPath();
    ctx.moveTo(-r * 0.8, 0);
    ctx.lineTo(-r * 1.5, ang * r * 2.2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(r * 0.8, 0);
    ctx.lineTo(r * 1.5, ang * r * 2.2);
    ctx.stroke();
  });

  // Powerful Pincers
  ctx.save();
  const pincerGrad = ctx.createRadialGradient(-r * 1.2, -r * 0.8, 2, -r * 1.2, -r * 0.8, r * 0.5);
  pincerGrad.addColorStop(0, '#f87171');
  pincerGrad.addColorStop(0.7, '#dc2626');
  pincerGrad.addColorStop(1, '#7f1d1d');
  ctx.fillStyle = pincerGrad;
  ctx.strokeStyle = '#991b1b';
  ctx.lineWidth = 1.2;

  ctx.beginPath();
  ctx.arc(-r * 1.2, -r * 0.8, r * 0.48, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(r * 1.2, -r * 0.8, r * 0.48, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Carapace Shell (Textured Crimson)
  ctx.save();
  const shellGrad = ctx.createRadialGradient(0, -r * 0.2, 2, 0, 0, r);
  shellGrad.addColorStop(0, '#ef4444');
  shellGrad.addColorStop(0.6, '#b91c1c');
  shellGrad.addColorStop(1, '#450a0a');
  ctx.fillStyle = shellGrad;
  ctx.strokeStyle = '#7f1d1d';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.ellipse(0, 0, r, r * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Glossy Eyestalks
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(-r * 0.4, -r * 0.65, r * 0.16, 0, Math.PI * 2);
  ctx.arc(r * 0.4, -r * 0.65, r * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

// 6. Draw Vector Eel
export function drawVectorEelCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  sizePx: number,
  facingRight: boolean
) {
  ctx.save();
  ctx.translate(x, y);
  if (!facingRight) ctx.scale(-1, 1);

  const len = sizePx * 0.8;

  // Ribbon body with gradient stroke
  ctx.save();
  const eelGrad = ctx.createLinearGradient(-len, 0, len, 0);
  eelGrad.addColorStop(0, '#a16207');
  eelGrad.addColorStop(0.5, '#eab308');
  eelGrad.addColorStop(1, '#06b6d4');

  ctx.strokeStyle = eelGrad;
  ctx.lineWidth = sizePx * 0.32;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-len, 0);
  ctx.bezierCurveTo(-len * 0.5, -len * 0.4, 0, len * 0.4, len, 0);
  ctx.stroke();

  // Subtle dark outline
  ctx.strokeStyle = '#020617';
  ctx.lineWidth = sizePx * 0.32 + 2;
  ctx.globalCompositeOperation = 'destination-over';
  ctx.stroke();
  ctx.globalCompositeOperation = 'source-over';

  // Predatory Eye
  ctx.fillStyle = '#38bdf8';
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(len * 0.8, -2, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

// 7. Draw Vector Octopus
export function drawVectorOctopusCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  sizePx: number
) {
  ctx.save();
  ctx.translate(x, y);

  const r = sizePx * 0.45;

  // Tentacles with Suction Cups
  ctx.save();
  ctx.strokeStyle = '#be123c';
  ctx.lineWidth = r * 0.32;
  ctx.lineCap = 'round';

  [-0.8, -0.3, 0.3, 0.8].forEach((offset) => {
    ctx.beginPath();
    ctx.moveTo(offset * r, r * 0.4);
    ctx.quadraticCurveTo(offset * r * 1.5, r * 1.6, offset * r * 2, r * 1.2);
    ctx.stroke();
  });
  ctx.restore();

  // Bulbous Dome Head
  ctx.save();
  const octGrad = ctx.createRadialGradient(0, -r * 0.4, 2, 0, 0, r);
  octGrad.addColorStop(0, '#f43f5e');
  octGrad.addColorStop(0.6, '#be123c');
  octGrad.addColorStop(1, '#4c0519');
  ctx.fillStyle = octGrad;
  ctx.strokeStyle = '#881337';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.ellipse(0, -r * 0.2, r, r * 0.85, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Reflective Slit Eyes
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.ellipse(-r * 0.35, 0, r * 0.18, r * 0.25, 0, 0, Math.PI * 2);
  ctx.ellipse(r * 0.35, 0, r * 0.18, r * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-r * 0.45, -1, r * 0.2, 2);
  ctx.fillRect(r * 0.25, -1, r * 0.2, 2);
  ctx.restore();

  ctx.restore();
}

// 8. Draw Vector Bioluminescent Squid
export function drawVectorSquidCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  sizePx: number,
  facingRight: boolean = true
) {
  ctx.save();
  ctx.translate(x, y);
  if (!facingRight) ctx.scale(-1, 1);

  const r = sizePx * 0.45;

  // Bioluminescent Glow Aura
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 14;

  // Mantle (Torpedo body)
  const squidGrad = ctx.createLinearGradient(r * 1.2, 0, -r * 0.8, 0);
  squidGrad.addColorStop(0, '#38bdf8');
  squidGrad.addColorStop(0.5, '#0284c7');
  squidGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = squidGrad;
  ctx.strokeStyle = '#e0f2fe';
  ctx.lineWidth = 1.2;

  ctx.beginPath();
  ctx.moveTo(r * 1.2, 0);
  ctx.quadraticCurveTo(0, -r * 0.7, -r * 0.8, 0);
  ctx.quadraticCurveTo(0, r * 0.7, r * 1.2, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Translucent Fins at tip
  ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
  ctx.beginPath();
  ctx.moveTo(r * 1.2, 0);
  ctx.lineTo(r * 0.7, -r * 0.6);
  ctx.lineTo(r * 0.7, r * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Glowing Tentacles
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 2;
  [-0.4, -0.2, 0, 0.2, 0.4].forEach((off, i) => {
    ctx.beginPath();
    ctx.moveTo(-r * 0.8, off * r);
    ctx.quadraticCurveTo(-r * 1.3, (off + (i % 2 === 0 ? 0.2 : -0.2)) * r * 1.5, -r * 1.8, off * r * 0.8);
    ctx.stroke();
  });

  // Deepsea Eye
  ctx.fillStyle = '#c084fc';
  ctx.shadowColor = '#e9d5ff';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(-r * 0.2, -r * 0.1, r * 0.26, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(-r * 0.2, -r * 0.1, r * 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 9. Draw Vector Deepsea Anglerfish
export function drawVectorAnglerCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  sizePx: number,
  facingRight: boolean = true
) {
  ctx.save();
  ctx.translate(x, y);
  if (!facingRight) ctx.scale(-1, 1);

  const r = sizePx * 0.45;

  // Lure stalk & Glowing Esca (Lure)
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(r * 0.2, -r * 0.8);
  ctx.quadraticCurveTo(r * 0.8, -r * 1.4, r * 1.3, -r * 0.5);
  ctx.stroke();

  ctx.shadowColor = '#facc15';
  ctx.shadowBlur = 20;
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(r * 1.3, -r * 0.5, r * 0.28, 0, Math.PI * 2);
  ctx.fill();

  // Round Abyssal Dark Body
  ctx.shadowBlur = 0;
  const anglerGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, r);
  anglerGrad.addColorStop(0, '#312e81');
  anglerGrad.addColorStop(0.7, '#1e1b4b');
  anglerGrad.addColorStop(1, '#020617');
  ctx.fillStyle = anglerGrad;
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Wide Tooth Mouth with Sharp Fangs
  ctx.fillStyle = '#020617';
  ctx.beginPath();
  ctx.arc(r * 0.2, r * 0.1, r * 0.5, -Math.PI * 0.4, Math.PI * 0.4);
  ctx.closePath();
  ctx.fill();

  // Glassy Fangs
  ctx.fillStyle = '#f8fafc';
  [0.3, 0.5, 0.7].forEach((fx) => {
    ctx.beginPath();
    ctx.moveTo(r * fx, -r * 0.1);
    ctx.lineTo(r * (fx + 0.08), r * 0.2);
    ctx.lineTo(r * (fx - 0.08), r * 0.2);
    ctx.closePath();
    ctx.fill();
  });

  // Glowing Crimson Eye
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#f87171';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(r * 0.3, -r * 0.4, r * 0.16, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 10. DRAW EXPEDITION SHIP & WHOLE CREW AT SURFACE
export function drawVectorShipAndCrewCanvas(
  ctx: CanvasRenderingContext2D,
  shipX: number,
  surfaceY: number,
  canvasWidth: number,
  diverState: {
    y: number;
    airRatio: number;
    carryingStone: boolean;
    basketCount: number;
    isAscending?: boolean;
  },
  sharkDistance: number | null,
  time: number
) {
  // 1. SKY & SUN HORIZON ENVIRONMENT (above water line surfaceY)
  if (surfaceY > 0) {
    ctx.save();
    // Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, surfaceY);
    skyGrad.addColorStop(0, '#0284c7'); // Rich Sky Blue
    skyGrad.addColorStop(0.6, '#38bdf8'); // Cyan Horizon
    skyGrad.addColorStop(1, '#fef08a'); // Warm Sunset Glow
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvasWidth, surfaceY);

    // Glowing Sun
    const sunX = canvasWidth * 0.82;
    const sunY = Math.max(20, surfaceY - 55);
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, 32);
    sunGrad.addColorStop(0, '#ffffff');
    sunGrad.addColorStop(0.3, '#fef08a');
    sunGrad.addColorStop(1, 'rgba(251, 146, 60, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 32, 0, Math.PI * 2);
    ctx.fill();

    // Distant Reef Islands on Horizon
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(0, surfaceY);
    ctx.quadraticCurveTo(canvasWidth * 0.15, surfaceY - 14, canvasWidth * 0.3, surfaceY);
    ctx.quadraticCurveTo(canvasWidth * 0.7, surfaceY - 18, canvasWidth * 0.95, surfaceY);
    ctx.lineTo(canvasWidth, surfaceY);
    ctx.fill();

    // Seabirds flying in sky
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    [0, 1, 2].forEach((bIdx) => {
      const birdX = ((bIdx * 120 + time * 0.02) % (canvasWidth + 60)) - 30;
      const birdY = Math.max(15, surfaceY - 60 - bIdx * 18 + Math.sin(time * 0.003 + bIdx) * 6);
      ctx.beginPath();
      ctx.moveTo(birdX - 6, birdY + 3);
      ctx.quadraticCurveTo(birdX - 3, birdY - 3, birdX, birdY);
      ctx.quadraticCurveTo(birdX + 3, birdY - 3, birdX + 6, birdY + 3);
      ctx.stroke();
    });

    ctx.restore();
  }

  // 2. SHIP FLOATING ANIMATION
  ctx.save();
  const floatY = Math.sin(time * 0.002) * 3;
  const rollAngle = Math.sin(time * 0.0015) * 0.025;

  ctx.translate(shipX, surfaceY + floatY);
  ctx.rotate(rollAngle);

  // SHIP HULL (Mahogany Wood Vessel)
  // Waterline foam reflection
  ctx.fillStyle = 'rgba(224, 242, 254, 0.4)';
  ctx.beginPath();
  ctx.ellipse(0, 10, 135, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dark Mahogany Main Hull
  const hullGrad = ctx.createLinearGradient(0, -20, 0, 35);
  hullGrad.addColorStop(0, '#92400e');
  hullGrad.addColorStop(0.4, '#78350f');
  hullGrad.addColorStop(0.8, '#451a03');
  hullGrad.addColorStop(1, '#1e0a00');
  ctx.fillStyle = hullGrad;
  ctx.strokeStyle = '#1e0a00';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(-125, -15); // Stern
  ctx.quadraticCurveTo(-130, 15, -100, 30); // Stern curvature
  ctx.lineTo(90, 30); // Keel bottom
  ctx.quadraticCurveTo(125, 20, 135, -20); // Bow prow
  ctx.quadraticCurveTo(110, -10, -120, -10); // Deck contour
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Gold Trim Waterline Accent
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-118, 5);
  ctx.quadraticCurveTo(0, 12, 120, -2);
  ctx.stroke();

  // Copper Bow Anchor
  ctx.save();
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.arc(115, 8, 7, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // WOODEN DECK & RAILINGS
  ctx.fillStyle = '#b45309';
  ctx.fillRect(-115, -18, 230, 8); // Deck platform
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-115, -18, 230, 8);

  // Deck Railing Posts
  ctx.strokeStyle = '#451a03';
  ctx.lineWidth = 2;
  [-110, -75, -40, 0, 40, 75, 110].forEach((postX) => {
    ctx.beginPath();
    ctx.moveTo(postX, -18);
    ctx.lineTo(postX, -30);
    ctx.stroke();
  });
  // Top Handrail
  ctx.beginPath();
  ctx.moveTo(-112, -30);
  ctx.lineTo(112, -30);
  ctx.stroke();

  // DECK EQUIPMENT & CARGO STACKS
  // Baskets of Pearls & Shells
  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  ctx.arc(-95, -22, 9, Math.PI, 0); // Basket 1
  ctx.fill();
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(-95, -24, 4, 0, Math.PI * 2); // Pearl inside
  ctx.fill();

  // Iron Weight Stones Stack (Spare stone weights)
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.arc(-60, -22, 6, 0, Math.PI * 2);
  ctx.arc(-52, -22, 6, 0, Math.PI * 2);
  ctx.arc(-56, -28, 5, 0, Math.PI * 2);
  ctx.fill();

  // ROPE WINCH & PULLEY AT DECK CENTER
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-12, -32, 24, 14); // Winch frame
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-8, -28, 16, 10); // Golden rope spool

  // TALL SHIP MAST & RIGGING
  // Mast pole
  ctx.fillStyle = '#451a03';
  ctx.fillRect(35, -120, 7, 105);

  // Cross-Yard Arm
  ctx.fillRect(10, -85, 55, 4);

  // Rigging ropes
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.7)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(38, -120);
  ctx.lineTo(-110, -28);
  ctx.moveTo(38, -120);
  ctx.lineTo(110, -28);
  ctx.moveTo(38, -85);
  ctx.lineTo(-60, -28);
  ctx.moveTo(38, -85);
  ctx.lineTo(60, -28);
  ctx.stroke();

  // Crow's Nest Lookout
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.roundRect(28, -112, 22, 16, 3);
  ctx.fill();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Expedition Flag waving at Mast Peak
  const flagWasp = Math.sin(time * 0.005) * 5;
  ctx.fillStyle = '#0284c7'; // Cyan
  ctx.beginPath();
  ctx.moveTo(42, -120);
  ctx.lineTo(75 + flagWasp, -114 + flagWasp * 0.3);
  ctx.lineTo(42, -108);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 8px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('💎', 54 + flagWasp * 0.5, -112);

  // 3. THE WHOLE CREW MEMBERS ON DECK (5 Distinct Vector Crew)

  // CREW 1: Captain Maryam (At Bow, x = 95)
  ctx.save();
  ctx.translate(95, -30);
  // Body (Teal Coat)
  ctx.fillStyle = '#0f766e';
  ctx.fillRect(-6, 0, 12, 14);
  // Head
  ctx.fillStyle = '#7c2d12';
  ctx.beginPath();
  ctx.arc(0, -6, 5, 0, Math.PI * 2);
  ctx.fill();
  // Teal Headband
  ctx.fillStyle = '#14b8a6';
  ctx.fillRect(-5, -9, 10, 3);
  // Raised Spyglass
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(2, -6);
  ctx.lineTo(12, -10);
  ctx.stroke();
  ctx.restore();

  // CREW 2: Rope Master Zahra (At Winch, x = -10)
  ctx.save();
  ctx.translate(-10, -30);
  // Pulling or Crank posture
  const pullAnim = diverState.isAscending ? Math.sin(time * 0.01) * 3 : 0;
  // Body (Purple Vest)
  ctx.fillStyle = '#7e22ce';
  ctx.fillRect(-6, pullAnim, 12, 14);
  // Head
  ctx.fillStyle = '#7c2d12';
  ctx.beginPath();
  ctx.arc(0, -6 + pullAnim, 5, 0, Math.PI * 2);
  ctx.fill();
  // Purple Hairband
  ctx.fillStyle = '#c084fc';
  ctx.fillRect(-5, -9 + pullAnim, 10, 3);
  // Arms on Rope Winch
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, pullAnim);
  ctx.lineTo(6, 6);
  ctx.stroke();
  ctx.restore();

  // CREW 3: Stone Cutter Rashid (Beside Weight Stack, x = -55)
  ctx.save();
  ctx.translate(-55, -30);
  // Body (Red Shirt)
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(-6, 0, 12, 14);
  // Head
  ctx.fillStyle = '#7c2d12';
  ctx.beginPath();
  ctx.arc(0, -6, 5, 0, Math.PI * 2);
  ctx.fill();
  // Red Bandana
  ctx.fillStyle = '#f87171';
  ctx.fillRect(-5, -9, 10, 3);
  ctx.restore();

  // CREW 4: Sumbisori Whistler Asma (At Stern, x = -90)
  ctx.save();
  ctx.translate(-90, -30);
  // Body (Cyan Suit)
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-6, 0, 12, 14);
  // Head
  ctx.fillStyle = '#7c2d12';
  ctx.beginPath();
  ctx.arc(0, -6, 5, 0, Math.PI * 2);
  ctx.fill();
  // Whistle gesture hands to mouth
  ctx.fillStyle = '#e0f2fe';
  ctx.beginPath();
  ctx.arc(-3, -5, 2, 0, Math.PI * 2);
  ctx.fill();
  // Floating Sumbisori soundwaves
  if (Math.sin(time * 0.004) > 0) {
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('🎶', -12, -14);
  }
  ctx.restore();

  // CREW 5: Shark Watcher Omar (Up in Crow's Nest, x = 39, y = -112)
  ctx.save();
  ctx.translate(39, -112);
  // Body (Slate Shirt)
  ctx.fillStyle = '#475569';
  ctx.fillRect(-5, 0, 10, 12);
  // Head
  ctx.fillStyle = '#7c2d12';
  ctx.beginPath();
  ctx.arc(0, -5, 4.5, 0, Math.PI * 2);
  ctx.fill();
  // Binoculars or Warning Flag
  if (sharkDistance !== null && sharkDistance < 12) {
    // Wave Red Danger Flag!
    const flagSway = Math.sin(time * 0.01) * 6;
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(3, -4);
    ctx.lineTo(12 + flagSway, -12);
    ctx.stroke();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(12 + flagSway, -12);
    ctx.lineTo(2, -18);
    ctx.lineTo(12 + flagSway, -6);
    ctx.fill();
  } else {
    // Binoculars
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-3, -5, 6, 3);
  }
  ctx.restore();

  // CREW SPEECH BUBBLE OVER CAPTAIN / SHIP
  ctx.save();
  let speechText = '⚓ Ready for the dive!';
  let speechColor = '#38bdf8';

  if (diverState.y < 1) {
    speechText = '⚓ Deep breath! Descend into the abyss!';
    speechColor = '#38bdf8';
  } else if (diverState.airRatio < 0.25) {
    speechText = '⚠️ AIR LOW! ASCEND QUICKLY!';
    speechColor = '#f43f5e';
  } else if (sharkDistance !== null && sharkDistance < 12) {
    speechText = '🦈 SHARK PATROL SPOTTED BELOW!';
    speechColor = '#ef4444';
  } else if (diverState.isAscending) {
    speechText = '🤿 Pulling rope! Welcome back!';
    speechColor = '#facc15';
  } else if (diverState.carryingStone) {
    speechText = '⚡ Dropping fast with weight stone!';
    speechColor = '#a855f7';
  } else {
    speechText = `🌊 Diving at ${Math.round(diverState.y)}m! Haul: ${diverState.basketCount} items`;
    speechColor = '#34d399';
  }

  // Draw Speech Bubble
  ctx.translate(0, -68);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = speechColor;
  ctx.lineWidth = 1.5;
  ctx.font = 'bold 10px monospace';
  const textWidth = ctx.measureText(speechText).width;
  const bubbleW = textWidth + 16;
  const bubbleH = 20;

  ctx.beginPath();
  ctx.roundRect(-bubbleW / 2, -bubbleH / 2, bubbleW, bubbleH, 8);
  ctx.fill();
  ctx.stroke();

  // Pointer tail
  ctx.beginPath();
  ctx.moveTo(-4, bubbleH / 2);
  ctx.lineTo(0, bubbleH / 2 + 5);
  ctx.lineTo(4, bubbleH / 2);
  ctx.fill();

  // Bubble Text
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(speechText, 0, 0);

  ctx.restore();

  ctx.restore(); // Restore Ship Transform Matrix
}


