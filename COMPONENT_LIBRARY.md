# One Breath: Premium Component Library

**Purpose**: Establish a cohesive, reusable UI component system for consistent premium feel across all screens.

---

## 1. Design Tokens

### Color System
```json
{
  "base": {
    "navy": "#0f172a",
    "slate": {
      "950": "#0f172a",
      "900": "#0f172a",
      "800": "#1e293b",
      "700": "#334155"
    }
  },
  "accent": {
    "cyan": "#38bdf8",
    "blue": "#3b82f6",
    "indigo": "#4f46e5",
    "emerald": "#10b981",
    "amber": "#f59e0b",
    "rose": "#e11d48"
  },
  "semantic": {
    "success": "#10b981",
    "warning": "#f59e0b",
    "danger": "#e11d48",
    "info": "#38bdf8"
  }
}
```

### Typography Scale
```json
{
  "headline": {
    "xl": { "size": 40, "weight": 700, "lineHeight": 1.2 },
    "lg": { "size": 28, "weight": 700, "lineHeight": 1.3 },
    "md": { "size": 20, "weight": 700, "lineHeight": 1.4 }
  },
  "body": {
    "lg": { "size": 16, "weight": 400, "lineHeight": 1.5 },
    "md": { "size": 14, "weight": 400, "lineHeight": 1.6 },
    "sm": { "size": 12, "weight": 400, "lineHeight": 1.5 }
  },
  "label": {
    "lg": { "size": 12, "weight": 600, "lineHeight": 1.4 },
    "md": { "size": 11, "weight": 600, "lineHeight": 1.4 },
    "sm": { "size": 10, "weight": 600, "lineHeight": 1.3 }
  }
}
```

### Spacing Scale
```json
{
  "xs": 4,
  "sm": 8,
  "md": 16,
  "lg": 24,
  "xl": 32,
  "2xl": 48
}
```

### Border Radius
```json
{
  "sm": 8,
  "md": 12,
  "lg": 16,
  "xl": 20,
  "full": 999
}
```

### Shadows
```json
{
  "sm": "0 1px 2px rgba(0, 0, 0, 0.05)",
  "md": "0 4px 6px rgba(0, 0, 0, 0.1)",
  "lg": "0 10px 15px rgba(0, 0, 0, 0.1)",
  "xl": "0 20px 25px rgba(0, 0, 0, 0.15)",
  "glow": {
    "cyan": "0 0 20px rgba(56, 189, 248, 0.4)",
    "emerald": "0 0 20px rgba(16, 185, 129, 0.4)",
    "rose": "0 0 20px rgba(225, 29, 72, 0.4)"
  }
}
```

---

## 2. Component Specifications

### Button Component

**Variants**:
- Primary (full-width action button)
- Secondary (secondary action)
- Icon (small icon button)
- Ghost (minimal background)

**States**:
- Default
- Hover
- Active (pressed)
- Disabled
- Loading

**Example**:
```tsx
<Button 
  variant="primary" 
  size="lg" 
  color="cyan" 
  loading={false}
  onClick={handleClick}
>
  START DIVE
</Button>
```

**Specs**:
- Primary button: Full-width, 44px height, gradient bg (cyan → blue), dark text, spring animation on press
- Secondary button: Full-width, 40px height, slate bg, slate text, subtle hover
- Icon button: 32px × 32px, slate bg, centered icon, backdrop blur
- Ghost button: Transparent bg, colored text, minimal shadow

---

### Stat Pill Component

**Purpose**: Display key metrics (coins, depth, streak, etc.)

**Structure**:
```tsx
<StatPill 
  icon="💎" 
  label="Coins" 
  value={240} 
  color="amber"
/>
```

**Specs**:
- Background: Slate-900 with 60% opacity + backdrop blur
- Border: 1px slate-700
- Size: ~60px × 40px (or auto-width)
- Typography: 12px label (uppercase, slate-400), 14px value (colored)
- Radius: 8px
- Shadow: None (integrated into HUD bar)

---

### Glass HUD Bar Component

**Purpose**: Top bar on gameplay screen showing air/depth/multiplier

**Structure**:
```tsx
<GlassHUD>
  <HUDItem icon="🌊" label="Depth" value="24.5m" color="cyan" />
  <HUDAirGauge air={87} maxAir={100} />
  <HUDItem label="Multiplier" value="1.23x" color="emerald" />
</GlassHUD>
```

**Specs**:
- Background: Slate-900 with 60% opacity + backdrop blur
- Border: 1px slate-700
- Height: 48px
- Padding: 8px horizontal
- Radius: 12px
- Shadow: Soft drop shadow only
- Layout: Flexbox space-between, items centered vertically

---

### Zone Banner Component

**Purpose**: Display depth zone transitions

**Structure**:
```tsx
<ZoneBanner 
  zone="SHARK TRENCH" 
  depth={30} 
  color="indigo"
/>
```

**Specs**:
- Size: 280px × 48px
- Position: Center-top (animates down from -60px)
- Animation: Slide-in 300ms spring, stays 2.5s, exits up 300ms
- Background: Gradient (zone-specific color)
- Border: 2px (matching zone color)
- Radius: 12px
- Shadow: Color-matched glow (blur 12px, opacity 0.3)
- Typography: 14px white text, 12px secondary text

---

### Rare Discovery Modal Component

**Purpose**: Celebrate rare creature catches

**Structure**:
```tsx
<RareDiscoveryModal
  emoji="🐙"
  name="Giant Octopus"
  rarity="EPIC"
  depth={38}
  value={85}
  onComplete={handleDismiss}
/>
```

**Specs**:
- Size: 300px × 380px
- Animation: Scale 0.5 → 1.0 (spring: stiffness 280, damping 20)
- Background: Gradient (rarity-dependent color)
- Border: 2px (rarity color)
- Radius: 20px
- Shadow: Color-matched glow (blur 20px, spread 4px, opacity 0.4)
- Content stagger: 50–100ms between elements

**Rarity Color Mapping**:
- Rare: Blue gradient + glow
- Epic: Purple gradient + glow
- Legendary: Amber gradient + glow

---

### Depth Zone Card Component

**Purpose**: Show zone info in onboarding flow

**Structure**:
```tsx
<ZoneCard
  depth="0-15m"
  name="Shallow Reef"
  rewards="Pearls: 2-5 💚"
  color="cyan"
/>
```

**Specs**:
- Size: 280px × 56px
- Background: Slate-700 with 50% opacity
- Border: 2px (zone color)
- Radius: 12px
- Typography: 14px zone name (bold, colored), 12px rewards (secondary)
- Spacing: 16px between cards
- Animation: Fade-in + scale (0.95 → 1.0), staggered 50ms

---

### Earnings Display Component

**Purpose**: Show dive result earnings

**Structure**:
```tsx
<EarningsDisplay
  coins={240}
  food={3}
  rareCount={1}
/>
```

**Specs**:
- Background: Emerald-950 with 40% opacity
- Border: 1px emerald-500
- Radius: 12px
- Padding: 12px
- Layout: Stacked rows, 8px between
- Typography: 12px label (slate-300), 14px value (colored)
- Icon size: 16px

---

### Progress Bar Component

**Purpose**: Air gauge, health, progress tracking

**Structure**:
```tsx
<ProgressBar
  value={87}
  max={100}
  color="cyan"
  showPercent={true}
/>
```

**Specs**:
- Size: 24px × 6px (typical)
- Background: Slate-700
- Fill: Gradient (color-dependent)
- Radius: 4px
- Animation: Smooth width transition (300ms)
- Color gradient:
  - > 50%: Cyan
  - 25–50%: Amber
  - < 25%: Rose

---

### Stat Grid Component

**Purpose**: Display 3-column metric grid (depth/time/items)

**Structure**:
```tsx
<StatGrid>
  <StatBox label="Max Depth" value="24m" color="cyan" />
  <StatBox label="Time" value="45.3s" color="blue" />
  <StatBox label="Items" value="8" color="emerald" />
</StatGrid>
```

**Specs**:
- Layout: 3 equal columns, 8px gap
- Each box: 80px × 70px
- Background: Slate-800 with 50% opacity
- Border: 1px slate-700
- Radius: 12px
- Typography: 10px label (slate-400), 16px value (colored, bold)

---

### Animation Library

**Spring Presets**:
```json
{
  "springy": { "type": "spring", "stiffness": 280, "damping": 20 },
  "bouncy": { "type": "spring", "stiffness": 350, "damping": 15 },
  "smooth": { "type": "spring", "stiffness": 200, "damping": 25 }
}
```

**Easing Presets**:
```json
{
  "easeOut": "cubic-bezier(0.23, 1, 0.32, 1)",
  "easeIn": "cubic-bezier(0.4, 0, 1, 1)",
  "easeInOut": "cubic-bezier(0.77, 0, 0.175, 1)"
}
```

**Common Transitions**:
- **Modal pop-in**: Scale 0.5→1.0 + opacity 0→1, spring(280,20), 300ms
- **Slide-in top**: Y -60px→0px + opacity 0→1, duration 300ms, easeOut
- **Fade**: Opacity 0→1, duration 200ms, easeOut
- **Pulse**: Scale 1→1.06, infinite, duration 1.5s, easeInOut

---

## 3. Layout Patterns

### Safe Area Container
```tsx
<SafeAreaContainer>
  {/* Content respects iOS safe areas automatically */}
</SafeAreaContainer>
```

**Specs**:
- Padding-top: max(12px, safe-area-inset-top)
- Padding-bottom: max(12px, safe-area-inset-bottom)
- Padding-left/right: 16px

### Glass Container (Backdrop Blur)
```tsx
<GlassContainer opacity={0.6} blur={12}>
  {/* Semi-transparent blurred background */}
</GlassContainer>
```

**Specs**:
- Background: Slate-900 with opacity (60%)
- Backdrop filter: blur(12px)
- Border: 1px slate-700
- Radius: 12px

### Gradient Background
```tsx
<GradientBg from="#0f172a" to="#000d21">
  {/* Content */}
</GradientBg>
```

**Common Gradients**:
- **Ocean**: Navy → Deep blue (#0f172a → #000d21)
- **Depth**: Navy → Near-black (suggests depth)
- **Success**: Emerald → Teal
- **Danger**: Rose → Dark rose
- **Accent**: Cyan → Blue

---

## 4. Accessibility Standards

### Minimum Text Sizes
- Headlines: 28px minimum on-device
- Body: 14px minimum on-device
- Labels: 12px minimum on-device
- Never smaller than 10px

### Color Contrast
- Text on backgrounds: WCAG AA minimum (4.5:1 for normal text, 3:1 for large text)
- All buttons must be touch-accessible (minimum 44px × 44px)

### Motion
- Provide `prefers-reduced-motion` support:
  ```css
  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; }
  }
  ```

### Focus States
- All interactive elements must have visible focus indicator
- Focus ring: 2px, contrasting color, 4px offset

---

## 5. Implementation Guidelines

### CSS Class Naming
```
.btn-primary      /* Primary button */
.stat-pill        /* Stat display pill */
.glass-hud        /* Glass container HUD */
.zone-banner      /* Zone transition banner */
.modal-overlay    /* Modal background overlay */
.progress-bar     /* Progress indicator */
```

### React Component Structure
```tsx
// Component file: src/components/StatPill.tsx

interface StatPillProps {
  icon: string;
  label: string;
  value: string | number;
  color?: 'cyan' | 'amber' | 'emerald' | 'rose';
  size?: 'sm' | 'md' | 'lg';
}

export const StatPill: React.FC<StatPillProps> = ({
  icon,
  label,
  value,
  color = 'cyan',
  size = 'md'
}) => {
  return (
    <motion.div
      className={`stat-pill stat-pill--${color} stat-pill--${size}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <span className="stat-pill__icon">{icon}</span>
      <div className="stat-pill__content">
        <p className="stat-pill__label">{label}</p>
        <p className="stat-pill__value">{value}</p>
      </div>
    </motion.div>
  );
};
```

### Tailwind Configuration
```js
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        'ocean': {
          'navy': '#0f172a',
          'deep': '#000d21',
        },
        'accent': {
          'cyan': '#38bdf8',
          'emerald': '#10b981',
        },
      },
      spacing: {
        'gutter': '16px',
        'gutter-lg': '24px',
      },
      borderRadius: {
        'glass': '12px',
        'modal': '20px',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(56, 189, 248, 0.4)',
      },
    },
  },
};
```

---

## 6. Component Checklist

### Before Shipping Any Component
- [ ] Meets design spec exactly (colors, typography, spacing)
- [ ] Accessible (contrast, touch targets, focus states)
- [ ] Animations smooth and performant (60fps)
- [ ] Responsive on mobile (portrait + landscape)
- [ ] Responds to `prefers-reduced-motion`
- [ ] TypeScript types complete and strict
- [ ] Storybook story created
- [ ] Unit tests written (coverage > 80%)
- [ ] Plays well with other components
- [ ] Documentation in component file clear

---

## 7. Component Library Evolution

### Quarterly Additions
- **Q1**: Core buttons, pills, HUD, modals
- **Q2**: Cards, grids, forms, menus
- **Q3**: Advanced lists, carousels, time pickers
- **Q4**: Charts, custom controls, theme system

### Maintenance
- Audit design consistency monthly
- Test accessibility quarterly
- Profile performance monthly (60fps target)
- Gather feedback from designers/engineers

---

## Resources

- **Storybook Setup**: `npm run storybook` (after setup)
- **Design Tokens**: `src/tokens/design-system.json`
- **Component Catalog**: Storybook auto-generated from JSDoc
- **Accessibility Checklist**: `docs/accessibility.md`
- **Animation Guidelines**: `docs/animation-guide.md`

