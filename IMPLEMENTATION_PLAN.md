# Screen Implementation Plan

**Status**: Implementation Starting  
**Target**: 7 Screens as per `SCREEN_FLOW_SPECIFICATION.md`

---

## Screen Checklist

### ✅ Screen 1: Splash Screen
- [x] Dark ocean gradient (navy → deep blue)
- [x] Centered title "ONE BREATH" in cyan
- [x] Subtitle "FREEDIVER HAVEN" in slate
- [x] Ocean wave/diver silhouette illustration
- [x] "BEGIN JOURNEY" button in cyan gradient
- [x] Subtle film grain texture
- [x] Auto-advance after 2.5 seconds
- [x] iPhone mockup framing

**Location**: `src/components/SplashScreen.tsx`  
**Status**: ✅ Complete

---

### 🔄 Screen 2: Onboarding 1 – "Hold Your Breath"
- [ ] "HOLD YOUR BREATH 💨" title in cyan (28px)
- [ ] Central breathing visualization (diver expanding/contracting circles)
- [ ] Cyan-to-indigo gradient circles
- [ ] Copy text: "Hold [Space] to descend... Release to float up."
- [ ] "GOT IT, NEXT →" button in blue gradient
- [ ] Generous spacing
- [ ] iPhone mockup

**Location**: `src/components/OnboardingScreen.tsx`  
**Status**: 🔄 In Progress

---

### 🔄 Screen 3: Onboarding 2 – "Treasure Awaits"
- [ ] "TREASURE AWAITS 💎" title in cyan
- [ ] "Deeper = Better Loot" subtitle
- [ ] Four stacked depth zone cards:
  - [ ] 0-15m "Shallow Reef" with cyan border
  - [ ] 15-30m "Mid Reef Drop" with blue border
  - [ ] 30-45m "Shark Trench" with indigo border
  - [ ] 45-60m "Deep Abyss" with rose border
- [ ] Cards 280x56px with slate gradient
- [ ] Staggered fade-in animation
- [ ] "READY TO DIVE" emerald button
- [ ] Dark gradient background suggesting depth

**Location**: `src/components/OnboardingScreen.tsx`  
**Status**: 🔄 To Update

---

### ⏳ Screen 4: Haven Village Hub
- [ ] Top stat pills (Lvl, Coins, Food, Streak) with glass effect
- [ ] Central village illustration (280x200px)
- [ ] Pearl Coast Haven caption in cyan
- [ ] Large cyan "🤿 START DIVE" button (300x56px)
- [ ] Secondary buttons grid (2x2):
  - [ ] ⚙️ Shop
  - [ ] 📋 Challenges
  - [ ] 📸 Photos
  - [ ] 🗺️ Map
- [ ] Dark ocean gradient background

**Location**: `src/components/SurfaceScreen.tsx`  
**Status**: ⏳ To Implement

---

### ⏳ Screen 5: Dive Gameplay HUD
- [ ] Full canvas game scene
- [ ] Top glass HUD bar with:
  - [ ] 🌊 Depth display (cyan)
  - [ ] Air gauge progress bar
  - [ ] Multiplier display (emerald)
- [ ] Center zone banner (300x48px) sliding down
- [ ] Right basket count pill (emerald)
- [ ] Bottom pulsing "✂️ CUT ROPE" button
- [ ] Top right mute + settings icons
- [ ] Optional sonar alert in center-top
- [ ] All HUD semi-transparent with glass effect

**Location**: `src/components/CanvasGame.tsx`  
**Status**: ⏳ To Enhance

---

### ✅ Screen 6: Rare Creature Discovery Modal
- [x] Modal overlay (300x380px) centered
- [x] Spring pop-in animation
- [x] Large emoji (60px)
- [x] Rarity badge "⭐ EPIC DISCOVERY"
- [x] Creature name in cyan
- [x] Stats (depth, value)
- [x] Message "Added to photo library!"
- [x] Purple-600 gradient border
- [x] Golden/purple glow shadow
- [x] Confetti animation suggested
- [x] Auto-dismiss after 3.5s

**Location**: `src/components/RareCreatureDiscoveryModal.tsx`  
**Status**: ✅ Complete

---

### ✅ Screen 7: Post-Dive Report
- [x] Modal overlay (310x520px) centered
- [x] Spring pop-in animation
- [x] Success badge (emerald checkmark)
- [x] Title "SURFACED SAFELY"
- [x] Subtitle text
- [x] Stats grid (3 columns: depth, time, items)
- [x] Earnings section (coins, food)
- [x] Primary/secondary buttons
- [x] Emerald border + glow
- [x] Dark background overlay

**Location**: `src/components/DiveReportModal.tsx`  
**Status**: ✅ Complete

---

## Implementation Strategy

### Phase 1: Onboarding Polish (2 screens)
Update existing onboarding to match spec exactly:
- Simplify to 2 focused screens (Hold Your Breath + Treasure Awaits)
- Replace existing 8-screen flow with concise 2-screen sequence
- Add breathing visualization
- Add depth zone cards with proper styling

**Time**: 2–3 hours  
**Files**: `OnboardingScreen.tsx`

### Phase 2: Haven Hub Enhancement (1 screen)
Refactor SurfaceScreen to exactly match spec:
- Stat pills at top with glass effect
- Central village illustration
- 4 secondary action buttons in grid
- Proper spacing and layout

**Time**: 1–2 hours  
**Files**: `SurfaceScreen.tsx`

### Phase 3: Gameplay HUD Polish (1 screen)
Enhance CanvasGame HUD:
- Verify glass HUD bar styling
- Ensure zone banner appears correctly
- Check sonar alert positioning
- Verify all elements semi-transparent

**Time**: 1 hour  
**Files**: `CanvasGame.tsx`

### Phase 4: Design System Validation (All screens)
- Verify all colors match palette exactly
- Check typography scale (28px headlines, 14px body, 12px labels)
- Validate spacing/margins
- Ensure all animations match spec (spring, duration, easing)
- Test on actual mobile device

**Time**: 2 hours

---

## Implementation Checklist

### Code Quality
- [ ] 0 TypeScript errors
- [ ] All components properly typed
- [ ] All animations smooth (60 FPS target)
- [ ] Responsive on mobile
- [ ] Safe areas respected
- [ ] No console warnings

### Design Compliance
- [ ] All colors from palette (#0f172a, #38bdf8, etc.)
- [ ] Text sizes match spec (40px splash title, 28px headlines, etc.)
- [ ] Spacing matches rhythm (16px base, 24–32px sections)
- [ ] Border radius consistent (16px cards, 12px buttons, 20px modals)
- [ ] Shadows soft and controlled

### Animation Compliance
- [ ] Spring animations (stiffness 280, damping 20)
- [ ] Durations 200–400ms
- [ ] Easing ease-out preferred
- [ ] All reduced-motion support

### Device Framing
- [ ] iPhone mockup consistent across all screens
- [ ] 40–50px outer margins balanced on all sides
- [ ] Device frame visible but not overpowering
- [ ] Content remains hero (not frame)

---

## Git Workflow

### Before Starting
```bash
git checkout main
git pull origin main
npm run lint  # Verify no errors
npm run dev   # Start dev server
```

### During Implementation
- Create feature branch: `git checkout -b feat/screen-implementation`
- Commit per screen: `git commit -m "feat: implement Screen X - description"`
- Test each screen in browser at http://localhost:3007

### After Completion
```bash
git add .
git commit -m "feat: complete all 7 screens per specification"
npm run lint  # Final check
git push origin feat/screen-implementation
# Create PR
```

---

## Testing Checklist

### Manual Testing
- [ ] Splash screen appears, auto-advances
- [ ] Onboarding screens clear, readable text
- [ ] Haven hub loads with stats
- [ ] Dive HUD displays correctly
- [ ] Rare discovery modal pops in smoothly
- [ ] Post-dive report shows data correctly
- [ ] All buttons clickable and responsive
- [ ] Animations smooth (no jank)
- [ ] Text readable on small screen
- [ ] Safe areas respected (notch, home indicator)

### Performance Testing
- [ ] Load time < 2 seconds
- [ ] 60 FPS maintained
- [ ] No memory leaks (Chrome DevTools)
- [ ] No console errors
- [ ] No TypeScript errors

### Mobile Testing
- [ ] iPhone SE (small screen)
- [ ] iPhone 14 (normal)
- [ ] iPad (if needed)
- [ ] Landscape orientation
- [ ] Portrait orientation

---

## Acceptance Criteria

✅ **All 7 screens implemented**  
✅ **Design spec compliance 100%**  
✅ **0 TypeScript errors**  
✅ **60 FPS performance**  
✅ **All animations working**  
✅ **Mobile responsive**  
✅ **Accessible (WCAG AA)**  
✅ **All buttons functional**  

---

## Next Steps (After Implementation)

1. **Code Review**: Verify against spec
2. **Performance Profile**: Chrome DevTools
3. **Device Testing**: Real mobile device
4. **Accessibility Audit**: WAVE or Axe
5. **Design Review**: Compare mockups
6. **Production Build**: `npm run build`
7. **PR & Merge**: To main branch

---

**Expected Timeline**: 6–8 hours for full implementation  
**Status**: Ready to Start

