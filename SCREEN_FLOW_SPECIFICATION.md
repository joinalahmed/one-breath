# One Breath: Premium Mobile Screen Flow Specification

**Platform**: iOS-native premium  
**Device**: iPhone 14/15 (390×844, 19.5:9 aspect ratio)  
**Theme**: Dark ocean + cyan/blue accents  
**Status**: Design specification for image generation

---

## Design System Lock

### Color Palette
- **Base Dark**: #0f172a (navy/slate-950)
- **Surface Dark**: #1e293b (slate-800)
- **Accent Cyan**: #38bdf8 (sky-400)
- **Accent Blue**: #3b82f6 (blue-500)
- **Accent Indigo**: #4f46e5 (indigo-600)
- **Accent Emerald**: #10b981 (emerald-500)
- **Accent Amber**: #f59e0b (amber-500)
- **Text Primary**: #f1f5f9 (slate-100)
- **Text Secondary**: #cbd5e1 (slate-300)

### Typography
- **Headlines**: Modern grotesk (system SF Pro Display)
- **Body**: System SF Pro Text
- **Scale**: 28px headlines, 16px body, 12px labels
- **Weight**: 700 headlines, 600 accent, 400 body

### Spacing
- **Padding**: 16-24px gutters
- **Margin**: 32px section spacing
- **Corner Radius**: 16px cards, 12px buttons, 8px inputs

### Texture
- Subtle film grain overlay (1-2% opacity)
- Soft water-like noise in backgrounds
- No aggressive texture—supporting atmosphere only

### Device Frame
- iPhone mockup with visible black/dark bezels
- Clean 40-50px outer margin on all sides
- Soft drop shadow (blur: 20px, opacity: 0.4)
- Centered on canvas, balanced presentation

---

## Screen 1: SPLASH SCREEN

**Purpose**: Premium first impression, world-setting  
**Duration**: Auto-advance after 2-3 seconds or tap to continue

### Layout
```
┌─────────────────────────────┐
│                             │
│                             │  (Safe area top: 44px)
│        ONE BREATH           │
│       FREEDIVER HAVEN       │
│                             │
│    [subtle ocean wave]      │
│    [or animated diver]      │
│                             │
│                             │
│       ┌─────────────────┐   │
│       │  BEGIN JOURNEY  │   │  (Button: 44px height)
│       └─────────────────┘   │
│                             │  (Safe area bottom: 34px)
│                             │
└─────────────────────────────┘
```

### Visual Details
- **Background**: Deep gradient (navy #0f172a top → deep ocean blue #000d21 bottom)
- **Subtle texture**: Film grain, +1% opacity noise wash
- **Title "ONE BREATH"**: 
  - Font: SF Pro Display
  - Size: 40px, weight: 700
  - Color: Cyan #38bdf8
  - Letter spacing: Wide (0.04em)
  - Centered on screen
  
- **Subtitle "FREEDIVER HAVEN"**:
  - Size: 16px, weight: 600
  - Color: Slate-300 #cbd5e1
  - Below title, 8px gap
  - Centered
  
- **Central Visual** (16px below subtitle):
  - Stylized ocean waves or diver silhouette
  - Subtle animated effect implied (gentle up-down float)
  - Opacity 0.4, position: center-middle
  - Size: ~120×120px
  
- **Button "BEGIN JOURNEY"**:
  - Bottom safe area: 100px from bottom
  - Cyan gradient background (#38bdf8 to #0ea5e9)
  - Size: 320px wide × 44px tall
  - Corner radius: 12px
  - Font: 14px, weight: 700
  - Color: Dark #0f172a
  - Shadow: soft cyan glow (blur 12px, spread 2px, opacity 0.3)

### Animation Implied
- Gentle wave animation or diver float (spring physics, infinite loop)
- Title fade-in over 600ms on screen appear
- Button scale-in spring animation (stiffness: 200, damping: 15)

---

## Screen 2: ONBOARDING SCREEN 1 – "Hold Your Breath"

**Purpose**: Teach core mechanic (descend/ascend)  
**Flow**: Previous: Splash → Next: Onboarding Screen 2

### Layout
```
┌─────────────────────────────┐
│  ✕ (close, 16px from top)   │  (Status bar: 44px)
│                             │
│   HOLD YOUR BREATH 💨       │  (16px from top)
│                             │
│     [Breathing Visual]      │  (Large central visual)
│     (Diver expanding &      │
│      contracting)           │
│                             │
│  Hold [Space] to descend    │
│  with your weight stone.    │  (Copy, 14px, centered)
│  Release to float up.       │
│  Simple? 😊                 │
│                             │
│       ┌─────────────────┐   │
│       │  GOT IT, NEXT   │   │  (Button)
│       └─────────────────┘   │
│                             │  (Safe area bottom: 34px)
└─────────────────────────────┘
```

### Visual Details
- **Background**: Dark gradient with subtle ocean blue tint
- **Close button**: "✕" text, 16px, slate-400, top-left corner 16px inset
- **Header "HOLD YOUR BREATH 💨"**:
  - Size: 28px, weight: 700
  - Color: Cyan #38bdf8
  - Centered horizontally
  - 16px from safe area top
  
- **Central Visual** (breathing visualization):
  - Diver silhouette or chest outline
  - Shown as expanding circle (large) and contracting circle (small)
  - Illustrate "full breath" → "empty breath" cycle
  - Soft gradient fill (cyan to indigo)
  - Size: 180×180px, centered vertically
  - Opacity animation implied (0.6–1.0 pulse)
  
- **Copy Text**:
  - 14px, weight: 400
  - Color: Slate-300 #cbd5e1
  - Centered, 24px below visual
  - 3 lines max, 40-character width
  - "Hold [Space] to descend with your weight stone. Release to float up. Simple? 😊"
  
- **Next Button**:
  - Blue gradient (#3b82f6 to #1d4ed8)
  - Size: 320px × 44px
  - Corner radius: 12px
  - Text: "GOT IT, NEXT →" (14px, 700)
  - Bottom safe area: 100px from bottom

### Animation Implied
- Breathing visual pulses in/out (2.5s cycle, smooth easing)
- Opacity fades between 0.6–1.0 to show breath leaving
- Button spring pop-in on screen appear

---

## Screen 3: ONBOARDING SCREEN 2 – "Treasure Awaits"

**Purpose**: Show depth zones and reward progression  
**Flow**: Previous: Onboarding 1 → Next: Haven Hub

### Layout
```
┌─────────────────────────────┐
│                             │  (Safe area top: 44px)
│  TREASURE AWAITS 💎         │  (28px, bold cyan)
│  Deeper = Better Loot       │  (14px, slate-300)
│                             │
│  ┌─────────────────────┐    │
│  │ 0-15m  Shallow Reef │ 💚 │  Zone 1 (lightest)
│  │ Pearls: 2-5         │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │ 15-30m  Mid Reef    │ 💙 │  Zone 2
│  │ Pearls: 8-15        │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │ 30-45m Shark Trench │ 💜 │  Zone 3
│  │ Pearls: 25-80       │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │ 45-60m Deep Abyss   │ 💖 │  Zone 4 (darkest)
│  │ Pearls: 75-150 ⭐   │    │
│  └─────────────────────┘    │
│                             │
│       ┌─────────────────┐   │
│       │  READY TO DIVE  │   │  (Primary action button)
│       └─────────────────┘   │
│                             │  (Safe area bottom: 34px)
└─────────────────────────────┘
```

### Visual Details
- **Background**: Gradient dark blue to near-black (showing depth progression)
- **Header**:
  - "TREASURE AWAITS 💎" (28px, 700, cyan)
  - "Deeper = Better Loot" (14px, 400, slate-300)
  - Centered, 16px from top
  
- **Four Depth Zone Cards** (stacked vertically, each showing zone depth and rewards):
  1. **0-15m Zone** (Shallow Reef):
     - Background: Slate-700 #334155, border: cyan #38bdf8
     - Text: "0-15m Shallow Reef" (14px, 600, cyan)
     - Reward: "Pearls: 2-5 💚" (12px, emerald green)
     - Width: 280px, height: 56px
     - Corner radius: 12px
     - Spacing: 16px between cards
     
  2. **15-30m Zone** (Mid Reef):
     - Background: Slate-750 (slightly darker)
     - Border: blue #3b82f6
     - Text: "15-30m Mid Reef Drop" (14px, 600, blue)
     - Reward: "Pearls: 8-15 💙"
     
  3. **30-45m Zone** (Shark Trench):
     - Background: Slate-800 (darker still)
     - Border: indigo #4f46e5
     - Text: "30-45m Shark Trench" (14px, 600, indigo)
     - Reward: "Pearls: 25-80 💜"
     
  4. **45-60m Zone** (Deep Abyss):
     - Background: Slate-900 (darkest)
     - Border: rose/pink #e11d48
     - Text: "45-60m Deep Abyss" (14px, 600, pink)
     - Reward: "Pearls: 75-150+ ⭐ LEGENDARY" (12px, amber)
  
- **Button "READY TO DIVE"**:
  - Emerald gradient (#10b981 to #059669)
  - Size: 320px × 44px
  - Corner radius: 12px
  - Text: 14px, weight: 700, color: dark
  - Bottom safe area: 100px from bottom
  - Shadow: soft emerald glow

### Animation Implied
- Cards fade-in and scale-up staggered (50ms delay between each)
- Button spring pop-in with 300ms delay

---

## Screen 4: HAVEN VILLAGE HUB – "Main Surface"

**Purpose**: Home screen, upgrades, challenges, dive launch  
**Flow**: Previous: Onboarding 2 → Next: Dive HUD (on button tap)

### Layout
```
┌─────────────────────────────┐
│ Lvl:8  💎:240  🐟:12  🔥:3  │  (Stats row, 16px top)
│                             │
│   [VILLAGE ILLUSTRATION]    │
│   (Haven with buildings,    │  (Central visual, ~220px tall)
│    boats, fires, docks)     │
│                             │
│     Pearl Coast Haven       │  (Small caption)
│    Level 8 • 240 Pearls     │
│                             │
│   ┌─────────────────────┐   │
│   │                     │   │
│   │  🤿 START DIVE      │   │  (Primary action button)
│   │  [Large cyan btn]   │   │
│   │                     │   │
│   └─────────────────────┘   │
│                             │
│ [⚙️ Shop] [📋 Challenges]  │  (Secondary buttons)
│ [📸 Photos] [🗺️ Map]      │
│                             │  (Safe area bottom: 34px)
└─────────────────────────────┘
```

### Visual Details
- **Background**: Ocean gradient with subtle texture (dark blue to near-black)
- **Top Stat Pills** (glass effect, backdrop blur):
  - Layout: Horizontal row, 16px from safe area top, 16px horizontal inset
  - Count: 4 pills (Level, Coins, Food, Streak)
  - Size: ~60px × 40px each, 8px gap between
  - Background: Slate-900 with 60% opacity + backdrop blur
  - Border: 1px slate-700
  - Corner radius: 8px
  
  - **Level Pill**: "Lvl:8" (12px, 700, cyan)
  - **Coins Pill**: "💎:240" (12px, 700, amber)
  - **Food Pill**: "🐟:12" (12px, 700, emerald)
  - **Streak Pill**: "🔥:3" (12px, 700, orange) — only shows if streak > 0
  
- **Central Village Illustration** (vertical spacing: 16px below stats):
  - Large illustration (280×200px) showing a peaceful ocean village:
    - Docked boats, diver silhouettes, glowing buildings
    - Campfire with orange glow, buildings on stilts or platforms
    - Water reflection below
    - Soft gradient sky above
  - Or use stylized icon version if illustration not available
  - Rounded frame: 16px corner radius
  - Subtle drop shadow
  
- **Village Caption** (below illustration):
  - "Pearl Coast Haven" (14px, 600, cyan)
  - "Level 8 • 240 Pearls" (12px, 400, slate-400)
  - Centered, 8px gap
  
- **"START DIVE" Button** (primary action):
  - Cyan gradient (#38bdf8 to #0ea5e9)
  - Size: 300px × 56px (larger for prominent action)
  - Corner radius: 14px
  - Text: "🤿 START DIVE" (16px, 700, dark #0f172a)
  - Shadow: cyan glow + soft drop shadow
  - Top margin: 24px from village caption
  
- **Secondary Action Buttons** (2×2 grid):
  - Layout: Below START DIVE, 16px margin top
  - Each button: 140px × 44px (2 buttons per row)
  - Background: Slate-800 with 40% opacity
  - Border: 1px slate-700
  - Corner radius: 12px
  - Text: 12px, 600, cyan
  
  Buttons:
  1. "⚙️ Shop" — Left, top
  2. "📋 Challenges" — Right, top
  3. "📸 Photos" — Left, bottom
  4. "🗺️ Map" — Right, bottom

### Animation Implied
- Village illustration has subtle parallax/float animation (spring physics)
- Stats pills fade-in from top on screen appear
- "START DIVE" button has pulse/scale animation (infinite, 2s cycle)
- Secondary buttons fade-in staggered after main content

---

## Screen 5: DIVE GAMEPLAY HUD OVERLAY

**Purpose**: In-game interface during active dive  
**Context**: Overlaid on canvas-based 3D ocean scene

### Layout
```
┌─────────────────────────────┐
│ 🌊 24.5m │ 🌬️ [█████░░░] 87%│  (Top HUD bar: 16px top)
│ Multiplier: 1.23x           │  (secondary info)
│                             │
│                             │
│       [CANVAS GAME]         │  (Main 3D dive scene, interactive)
│      (Ocean background,     │
│       diver, creatures,     │
│       particles, sharks)    │
│                             │
│                             │
│ ┌─────────────────────────┐ │
│ │ ENTERING: SHARK TRENCH  │ │  (Zone banner, center-top when transitioning)
│ │ 30M DEPTH ZONE          │ │  (auto-hides after 2.5s)
│ └─────────────────────────┘ │
│                             │
│ 📡 SHARK SONAR: 12m DETECTED│ │  (Alert if shark near with sonarLvl>0)
│                             │
│             🧺 4/6          │  (Basket count, right side, 16px from right)
│                             │
│         ┌─────────────────┐ │
│         │  ✂️ CUT ROPE    │ │  (Bottom center: 24px from bottom)
│         │ (pulsing amber) │ │
│         └─────────────────┘ │
│                             │  (Safe area bottom: 34px)
│                             │
│ [🔊] [⚙️] — top right buttons│  (Mute & debug, 12px size, 16px from edges)
└─────────────────────────────┘
```

### Visual Details
- **Background**: Full-screen ocean blue canvas (rendered game scene)
- **Top HUD Bar** (glass effect, backdrop blur):
  - Position: 16px from safe area top
  - Layout: Horizontal, spread left-to-right
  - Background: Slate-900 with 60% opacity + backdrop blur
  - Border: 1px slate-700
  - Corner radius: 12px
  - Height: 48px
  - Padding: 8px horizontal
  
  - **Left Section - Depth**:
    - Icon: 🌊 (16px)
    - Text: "24.5m" (14px, 700, cyan) — updates real-time
    - Display: "🌊 24.5m"
  
  - **Center Section - Air Gauge**:
    - Icon: 🌬️ (wind, 16px)
    - Progress bar: 24px × 6px, background slate-700, fill cyan
    - Percent text: "87%" (12px, 600, cyan)
    - Display: "🌬️ [████░░░] 87%"
    - Color change: cyan → amber → red as air drops
  
  - **Right Section - Multiplier**:
    - Text: "Multiplier: 1.23x" (12px, 600, emerald)
    - Updates based on depth/streak
  
- **Zone Banner** (animates in when crossing depth threshold):
  - Position: Horizontal center, ~80px from top
  - Trigger: When player enters new depth zone (0-15m, 15-30m, 30-45m, 45-60m)
  - Animation: Slide down from top (300ms spring in), stays for 2.5s, then exits up
  
  - Size: 280px × 48px
  - Background: Gradient based on zone
    - 0-15m: Cyan gradient
    - 15-30m: Blue gradient
    - 30-45m: Indigo gradient
    - 45-60m: Violet/pink gradient
  - Border: 2px matching zone color
  - Corner radius: 12px
  - Text: "🌊 ENTERING: SHARK TRENCH" (14px, 700, white) + "30M DEPTH ZONE" (12px, 400)
  - Shadow: matching zone color glow
  
- **Sonar Alert** (conditional, only if sonarLvl > 0 and shark within range):
  - Position: Horizontal center, ~120px from top
  - Trigger: When shark within sonar range
  - Animation: Pulse scale (1.0–1.04) + opacity pulse
  
  - Size: 260px × 40px
  - Background: Purple-950 with 90% opacity
  - Border: 2px purple-400
  - Corner radius: 12px
  - Text: "📡 SHARK SONAR: 12m DETECTED!" (11px, 700, purple-200)
  - Icon: Pinging circle animation (pulse + scale)
  
- **Basket Count** (right side):
  - Position: Right edge, 16px inset from safe area, vertically centered
  - Size: 60px × 44px
  - Background: Slate-900 with 60% opacity + backdrop blur
  - Border: 1px slate-700
  - Corner radius: 8px
  - Icon: 🧺 (20px)
  - Count: "4/6" (12px, 700, emerald — green if room, red if full)
  - Display: Center-aligned
  
- **"CUT ROPE" Button** (bottom center):
  - Position: Horizontal center, 24px from safe area bottom
  - Only visible when carrying stone
  - Animation: Infinite pulse (scale 1.0–1.06, 1.5s cycle)
  
  - Size: 160px × 44px
  - Background: Amber gradient (#f59e0b to #fbbf24)
  - Border: 1px amber-400
  - Corner radius: 12px
  - Text: "✂️ CUT ROPE" (14px, 700, dark #0f172a)
  - Shadow: Amber glow + soft drop shadow
  - Hint text below: "[X]" (10px, slate-400)
  
- **Mute & Debug Buttons** (top right):
  - Position: Top right, 16px inset from safe area edges
  - Size: 32px × 32px each, 8px gap
  - Background: Slate-900 with 60% opacity + backdrop blur
  - Border: 1px slate-700
  - Corner radius: 8px
  - Icon size: 18px
  - Icons: 🔊 (mute toggle) and ⚙️ (debug settings)
  - Cursor: pointer

### Animation Implied
- Zone banner slides in from top (300ms spring), lingers 2.5s, exits top (300ms ease)
- Sonar alert pulses scale + opacity (infinite, 0.6s cycle)
- Cut rope button pulses scale + opacity (infinite, 1.5s cycle)
- Basket count text pulses red if at capacity
- All HUD elements maintain semi-transparency with backdrop blur for layered feel

---

## Screen 6: RARE CREATURE DISCOVERY MODAL

**Purpose**: Celebration when first discovering rare creature  
**Trigger**: After grabbing rare creature (seahorse, octopus, angler, etc.) for first time  
**Flow**: Appears as overlay, auto-dismisses after 3.5s

### Layout
```
┌─────────────────────────────┐
│                             │
│    ┌─────────────────────┐  │
│    │                     │  │
│    │        🐙           │  │  (Large emoji, 60px)
│    │  ⭐ EPIC DISCOVERY  │  │  (Badge, 12px amber)
│    │                     │  │
│    │  GIANT OCTOPUS      │  │  (Title, 20px cyan)
│    │                     │  │
│    │  Found at 38m depth │  │  (Stats, 12px slate)
│    │  Worth +85 💎       │  │
│    │                     │  │
│    │ Added to photo lib! │  │  (Message, 11px slate-400)
│    │                     │  │
│    └─────────────────────┘  │
│     [confetti animation]    │
│                             │
└─────────────────────────────┘
```

### Visual Details
- **Background Overlay**: Dark #0f172a with 85% opacity, backdrop blur
- **Modal Card** (spring pop-in animation):
  - Position: Centered on screen
  - Size: 300px × 380px
  - Background: Gradient (from accent color to dark)
    - For Epic rarity: Purple-600 → slate-900
  - Border: 2px purple-500
  - Corner radius: 20px
  - Shadow: Purple glow (blur 20px, spread 4px, opacity 0.4)
  - Padding: 24px
  - Vertical spacing: 16px between elements
  
- **Emoji** (top):
  - Size: 60px
  - Center-aligned
  - Slight drop shadow
  - Animation: Entrance scale (0.3 → 1.0, 300ms spring)
  
- **Rarity Badge**:
  - Text: "⭐ EPIC DISCOVERY" (12px, 700, amber #f59e0b)
  - Background: Slate-950 with 60% opacity
  - Padding: 4px 12px
  - Border radius: 6px
  - Center-aligned
  - Appears with 100ms delay from emoji
  
- **Title** (creature name):
  - Text: "Giant Octopus" (20px, 700, purple-100)
  - Center-aligned
  - Appears with 200ms delay
  
- **Stats Section**:
  - Layout: Centered text, 2 lines
  - "Found at 38m depth" (12px, 400, slate-300)
  - "Worth +85 💎" (12px, 600, emerald-300)
  - Appears with 300ms delay
  
- **Message**:
  - Text: "Added to your photo library!" (11px, 400, slate-400)
  - Center-aligned, italicized
  - Appears with 400ms delay
  
- **Confetti Animation** (surrounding modal):
  - Suggested: Light motion lines or falling particle effects
  - Colors: Matching accent (purple, amber, cyan)
  - Subtle, non-distracting
  - Opacity: 0.3–0.6

### Animation Implied
- **Entrance**: Modal scales from 0.5 → 1.0 (spring: stiffness 280, damping 20)
- **Content Stagger**: Each element (emoji → badge → title → stats → message) fades and scales in with 100ms stagger
- **Confetti**: Subtle particle burst or motion line animation during entrance
- **Sound**: Level-up chime + confetti crunch
- **Exit**: Modal scales to 0.8 + fades out (300ms ease) after 3.5s dwell time
- **Auto-dismiss**: Slides up and fades (300ms ease) or springs out with exit animation

---

## Screen 7: POST-DIVE REPORT MODAL

**Purpose**: Show dive result, earnings, and options (continue/retry/rescue)  
**Trigger**: On dive completion (success, shark attack, or drowned)  
**Flow**: Appears as modal, requires action to dismiss

### Layout (Success Case)

```
┌─────────────────────────────┐
│                             │
│    ┌─────────────────────┐  │
│    │                     │  │
│    │        ✓            │  │  (Success badge: green circle + checkmark)
│    │  SURFACED SAFELY    │  │  (Title: emerald)
│    │  You made it back   │  │  (Subtitle: small, slate)
│    │  with your haul.    │  │
│    │                     │  │
│    │ Depth  │ Time  │Items│  │  (Stats grid, 3 cols)
│    │  24m   │ 45.3s │ 8   │  │
│    │                     │  │
│    │ 💎 Pearls Earned    │  │  (Earnings section)
│    │ +240                │  │
│    │ 🐟 Fish Caught      │  │
│    │ +3                  │  │
│    │                     │  │
│    │  ┌───────────────┐  │  │
│    │  │  CONTINUE     │  │  │  (Primary button)
│    │  └───────────────┘  │  │
│    │  [DIVE AGAIN]       │  │  (Secondary button)
│    │                     │  │
│    └─────────────────────┘  │
│                             │
└─────────────────────────────┘
```

### Visual Details
- **Background Overlay**: Dark #0f172a with 85% opacity, backdrop blur
- **Modal Card** (spring pop-in):
  - Position: Centered
  - Size: 310px × 520px (adjusts if rescue section present)
  - Background: Gradient slate-800 → slate-900
  - Border: 2px emerald-500 (success, changes to rose-500 on failure)
  - Corner radius: 20px
  - Shadow: Emerald/rose glow matching result type
  - Padding: 20px
  
- **Header Section** (top 120px):
  - **Badge Circle** (72px × 72px):
    - Success: Emerald gradient, white checkmark ✓ (32px)
    - Failure (shark): Rose gradient, shark emoji 🦈 (40px)
    - Failure (drowned): Rose gradient, skull emoji 💀 (40px)
    - Center-aligned
  
  - **Title** (below badge, 8px gap):
    - Success: "SURFACED SAFELY" (18px, 700, emerald-300)
    - Failure: "SHARK ATTACK" or "OUT OF AIR" (18px, 700, rose-300)
    - Center-aligned
  
  - **Subtitle** (below title, 4px gap):
    - Success: "You made it back with your haul intact." (12px, 400, slate-400)
    - Failure: "A reef shark cut off your ascent — the basket spilled." (12px, 400, slate-400)
    - Center-aligned, max 2 lines
  
- **Stats Grid** (3 columns, equal width):
  - Position: Below header, 16px margin top
  - Each stat box: 80px × 70px
  - Background: Slate-800 with 50% opacity
  - Border: 1px slate-700
  - Corner radius: 12px
  - Spacing: 8px between boxes
  
  - **Max Depth**:
    - Label: "Max Depth" (10px, 600, slate-400)
    - Value: "24m" (16px, 700, cyan-300)
  
  - **Time**:
    - Label: "Time" (10px, 600, slate-400)
    - Value: "45.3s" (16px, 700, blue-300)
  
  - **Items**:
    - Label: "Items" (10px, 600, slate-400)
    - Value: "8" or "🦀+🐴+🦑" if showing rares (16px, 700, emerald-300)
  
- **Earnings Section** (success only):
  - Position: Below stats, 16px margin top
  - Background: Emerald-950 with 40% opacity
  - Border: 1px emerald-500
  - Corner radius: 12px
  - Padding: 12px
  
  - **Coins Earned**:
    - Text: "💎 Pearls Earned" (12px, 600, slate-300)
    - Value: "+240" (14px, 700, yellow-300)
  
  - **Food Earned** (if > 0):
    - Text: "🐟 Fish Caught" (12px, 600, slate-300)
    - Value: "+3" (14px, 700, emerald-300)
  
  - **Rare Creatures** (if caught):
    - Badge: "+2 rare" (10px, 700, purple-300, purple-950 bg)
  
- **Rescue Section** (failure only, if offered):
  - Position: Below stats, 16px margin top
  - Background: Amber-950 with 40% opacity
  - Border: 1px amber-500
  - Corner radius: 12px
  - Padding: 12px
  
  - Header: "🚤 Merchant Rescue" (10px, 700, amber-300)
  - Copy: "Pay 15 💎 to salvage your basket and keep the haul." (11px, 400, slate-300)
  
  - **Rescue Button** (inside section):
    - Size: Full width within section (~260px)
    - Height: 40px
    - Background: Amber gradient (#f59e0b to #fbbf24) if affordable
    - Background: Slate-700 with 50% opacity if not affordable
    - Corner radius: 8px
    - Text: "Rescue for 15 💎" or "Not enough pearls" (12px, 700)
    - Color: Dark if affordable, slate-500 if not
    - Animation (if affordable): Infinite pulse scale (1.0–1.06)
  
- **Action Buttons** (bottom):
  - Position: Below earnings/rescue section, 16px margin top
  - Spacing: 12px between buttons
  
  - **Primary Button** (full width, 44px):
    - Success: Cyan gradient, "CONTINUE" (14px, 700)
    - Failure: Emerald gradient, "RETRY DIVE" (14px, 700)
    - Corner radius: 12px
    - Shadow: Matching color glow
  
  - **Secondary Button** (full width, 40px):
    - Success: "🤿 DIVE AGAIN" (12px, 600, slate-300) on slate-800 bg
    - Failure: "RETURN TO VILLAGE" (12px, 600, slate-300) on slate-800 bg
    - Corner radius: 12px
    - Hover: Slate-700 opacity increase

### Variations
- **Failure (Shark Attack)**:
  - Badge color: Rose-600 to rose-800
  - Title color: Rose-300
  - Border: rose-500
  - No earnings section (all lost)
  - Streak reset note (if applicable): "Streak: 5x → reset" (11px, slate-400, line-through)
  - Treasure at risk display: "Treasure at Risk: 💎 150 · 🐟 2" (11px, amber-300)

- **Failure (Drowned)**:
  - Same as shark attack, but title: "OUT OF AIR"
  - Subtitle: "You ran out of air before reaching the surface — the basket spilled."

### Animation Implied
- **Entrance**: Modal scales from 0.85 → 1.0 (spring: stiffness 320, damping 26, 300ms)
- **Stagger**: Badge scales first, then title fades, then stats grid staggered, then buttons spring in
- **Rescue Button** (if present & affordable): Infinite pulse scale + glow
- **Success Sound**: Celebratory chime + confetti
- **Failure Sound**: Sad chime or shark sting
- **Exit**: Modal springs out or fades based on action taken

---

## Device Mockup Frame Specification

- **Device**: iPhone 14/15 (6.1-inch, 390×844px native resolution)
- **Frame Style**: Clean black bezel with visible home indicator
- **Frame Thickness**: ~8px visible border
- **Drop Shadow**: 
  - Blur: 20px
  - Spread: 4px
  - Opacity: 40%
  - Color: #000000
- **Canvas Padding**: 40-50px on all sides (evenly distributed)
- **Centering**: All device mockups centered horizontally on canvas
- **Alignment**: Top, bottom, left, right padding equal (±2px tolerance)
- **Background**: Canvas background (#0a0f1e or darker) contrasts with device
- **Consistency**: Same device scale and frame style across all 7 screens

---

## Multi-Screen Consistency Rules

✅ **Locked Design Bible**:
- Color palette consistent (slate/cyan/blue/indigo/emerald/amber)
- Typography system consistent (grotesk, 28/16/14/12px scale)
- Spacing system consistent (16/24/32px rhythm)
- Texture subtle but present (film grain + water noise)
- Border radius logic consistent (16px cards, 12px buttons, 8px inputs)
- Shadow language soft and controlled
- Device frame presentation uniform

✅ **Screen Variation** (without breaking cohesion):
- Composition varies (splash is centered, hub has left/center/bottom zones)
- Image placement varies (onboarding has centered visual, hub has left-aligned village)
- Content density varies (splash: minimal; hub: moderate; HUD: tight)
- Visual tempo varies (welcome is calm, gameplay is energetic, report is dense)
- But all screens feel like one product

✅ **Flow Logic**:
1. Splash → first impression, world-setting
2. Onboarding 1 → teach core mechanic (descend/ascend)
3. Onboarding 2 → show reward progression (depth zones)
4. Haven Hub → home screen, launch point, upgrades/challenges entry
5. Dive HUD → active gameplay, real-time mechanics
6. Rare Discovery → celebration moment (triggered mid-dive)
7. Post-Dive Report → outcome and next actions

---

## Image Generation Guidance

Each screen should be generated as:
- **Format**: Clean 1080×2340px PNG (3× scale for 390×844 device content)
- **Device Frame**: iPhone visible with clean bezel
- **Background**: Contrasting dark canvas color
- **Padding**: Balanced ~120-150px on all sides
- **Resolution**: 300 DPI equivalent for print-quality mockup
- **Color Space**: sRGB for screen consistency

All 7 screens should be generated with identical device scale and consistent outer margins to allow side-by-side or sequential presentation.

---

## Creative Direction Summary

**Vision**: Premium, art-directed mobile game interface combining:
- Dark ocean aesthetics with calming, trustworthy color palette
- Spring physics and smooth motion language throughout
- Thoughtful image usage (depth visualization, village illustration)
- Celebration moments (rare discoveries, zone transitions)
- Clean information hierarchy and readable typography
- Subtle texture and atmospheric depth
- Consistent, cohesive product experience across all screens
- Not a website in a phone frame, but a native mobile app feeling

**Result**: A premium mobile game UI concept that feels:
- Memorable
- Polished
- Art-directed
- Believable
- Premium
- Non-generic
- Celebration-oriented
- Clarity-focused

