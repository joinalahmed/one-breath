# One Breath: Next Phase Roadmap

**Status**: Phase 1 Complete (Core + Animations + UX Audit)  
**Next**: Phase 2 – Premium Polish & Engagement Features

---

## Phase 2: Premium Polish & Social Features (4-6 weeks)

### 1. Sound & Haptics Enhancement
**Priority**: High  
**Effort**: 3 days

- [ ] **Expand audio library**:
  - Zone transition fanfare (distinct per zone)
  - Rare creature discovery jingle (epic, celebratory)
  - Challenge completion chime (satisfying)
  - Shark warning alert (tense, building)
  - Struggle/panic ascent grunt sound
  
- [ ] **Haptic feedback system**:
  - Light tap on HUD button presses
  - Medium pulse on zone transitions
  - Heavy pulse on shark attack
  - Continuous vibration on low air warning (escalating intensity)
  - Haptic pop on challenge completion
  
- [ ] **Dynamic music**:
  - Shallow zone: calm, peaceful ocean ambience
  - Mid-depth: tension increases, pulse becomes faster
  - Deep zones: heart-pounding, urgent soundtrack
  - Victory theme on successful surface
  - Failure theme on shark/drown

**Files to create**:
- `src/audioExpanded.ts` — Extended audio manager with zone-based music
- `src/hapticsMap.ts` — Haptic intensity profiles per event

---

### 2. Leaderboard System
**Priority**: High  
**Effort**: 5 days

- [ ] **Global leaderboards**:
  - Best depth ever reached
  - Highest single dive score
  - Longest survival streak
  - Most rare creatures collected
  - Fastest surface time
  
- [ ] **Weekly/monthly competitive seasons**:
  - Reset stats weekly
  - Seasonal badges and rewards
  - Top 100 rankings with avatars
  - Friend-compare view
  
- [ ] **Backend integration**:
  - Sync player stats to server (Firebase or similar)
  - Real-time rank updates
  - Historical ranking tracking

**Files to create**:
- `src/components/LeaderboardModal.tsx` — Leaderboard UI
- `src/services/leaderboard.ts` — Sync + ranking logic
- `src/types/leaderboard.ts` — Type definitions

---

### 3. Cosmetic Customization
**Priority**: Medium  
**Effort**: 4 days

- [ ] **Diver customization**:
  - Wetsuit color options (5–10 unique colors/patterns)
  - Goggles style (3–5 variants)
  - Fin colors
  - Rope color
  - Stone design (ornate, minimalist, legendary)
  
- [ ] **Village cosmetics**:
  - Building themes (tropical, Nordic, Asian-inspired)
  - Decoration sets (flags, lights, gardens)
  - Dock upgrades
  - Campfire intensity/color
  
- [ ] **Profile customization**:
  - Avatar selection (8–12 options)
  - Title display (Novice Diver, Pearl Collector, Shark Tamer, Abyss Conqueror, etc.)
  - Personal bio/motto (50 chars)

**Files to create**:
- `src/components/CustomizationModal.tsx`
- `src/services/cosmetics.ts` — Cosmetic state management
- `src/types/cosmetics.ts`

---

### 4. Achievement & Badge System
**Priority**: Medium  
**Effort**: 3 days

- [ ] **24 achievements** across categories:
  - **Depth**: 10m, 20m, 30m, 40m, 50m, 60m reached
  - **Rarity**: Catch each rare creature type
  - **Survival**: 5-dive streak, 10-dive streak, 25-dive streak
  - **Mastery**: 1000 coins earned, 5000 coins earned, 10000 coins earned
  - **Special**: Perfect 3-dive run, rescue a failed dive, discover all creatures

- [ ] **Badge display**:
  - Profile page shows earned badges
  - Unlocked badges show date & stats
  - Locked badges show progress toward unlock
  - Badge rarity tiers (common, rare, epic, legendary)

**Files to create**:
- `src/components/AchievementsModal.tsx`
- `src/data/achievements.ts` — Achievement definitions
- `src/services/achievements.ts` — Progress tracking

---

### 5. Tutorial & Onboarding Polish
**Priority**: Medium  
**Effort**: 2 days

- [ ] **Contextual hints**:
  - First dive: Highlight stone mechanics (auto-pulsing)
  - First rare creature: Show modal with rarity explanation
  - First failed dive: Show rescue mechanic explanation
  - Challenge unlock: Explain daily reset timing
  
- [ ] **Interactive tutorials**:
  - Stone cutting tutorial (dry run before first real dive)
  - Sonar radar explanation (if player has upgrade)
  - Merchant trading walkthrough
  - Map exploration guide

**Files to modify**:
- `src/components/TutorialTip.tsx` — Enhance with more varieties
- `src/components/OnboardingScreen.tsx` — Add screens 8–10

---

### 6. Performance Optimization
**Priority**: High  
**Effort**: 2 days

- [ ] **Canvas rendering**:
  - Implement object culling (don't render off-screen creatures)
  - Reduce particle count on low-end devices
  - GPU-accelerated transforms where possible
  - Memory pooling for bullets/particles
  
- [ ] **React optimization**:
  - Memoize expensive components (`React.memo`)
  - Split code for modals (lazy load)
  - Reduce HUD re-renders (use refs where safe)
  - Profile with React DevTools
  
- [ ] **Asset optimization**:
  - Compress sprite GIFs (reduce from 500KB to 100KB)
  - Pre-load critical assets on app start
  - Lazy-load upgrade descriptions
  - Compress audio files (MP3 @ 96kbps vs 128kbps)

**Files to modify**:
- `src/components/CanvasGame.tsx` — Object culling
- `src/App.tsx` — Code splitting
- `src/assetPreloader.ts` — Smarter preloading

---

### 7. Monetization (Optional Tier)
**Priority**: Low  
**Effort**: 5 days (if needed)

- [ ] **Battle pass system**:
  - Free tier (20 levels)
  - Premium tier (40 levels with cosmetics)
  - Weekly challenges that give pass XP
  - Cosmetics unlock per tier
  
- [ ] **Premium cosmetics shop**:
  - Weekly rotating cosmetics ($1–5 USD each)
  - Seasonal cosmetic bundles ($9–15 USD)
  - Battle pass ($9.99 USD for 50 days)
  
- [ ] **Ad-supported option**:
  - Watch video for 2x coins on a dive
  - Watch video to unlock chest (cosmetics)
  - Rewarded ads only (no interstitials)

**Files to create**:
- `src/services/iap.ts` — In-app purchase API
- `src/components/ShopModal.tsx` — Shop UI
- `src/services/ads.ts` — Ad integration

---

## Phase 2 Timeline

| Week | Tasks | Owner |
|------|-------|-------|
| 1 | Sound/Haptics + Tutorial Polish | Audio Designer + Tutorial Lead |
| 1–2 | Leaderboard backend + UI | Backend + Frontend |
| 2 | Achievements system | Feature Lead |
| 2–3 | Cosmetics customization | Design + Frontend |
| 3 | Performance optimization | DevOps + Performance Lead |
| 4 | Testing + Polish | QA + Product |

---

## Phase 3: Community & Long-Term (Weeks 6–12)

### Features
- [ ] Guild/clan system (co-op diving challenges)
- [ ] Async multiplayer (compete on leaderboards, see player ghosts)
- [ ] Community events (limited-time zones, special creatures)
- [ ] Player-generated content (custom challenges, dive replays)
- [ ] Social sharing (dive video clips, screenshots)
- [ ] Cross-platform play (mobile ↔ web)

### Platform Expansion
- [ ] **Web version** (same game in browser)
- [ ] **Tablet optimization** (iPad, Android tablets)
- [ ] **Apple Watch** mini-game (quick dive challenges)
- [ ] **Apple Vision Pro** (3D ocean exploration)
- [ ] **Nintendo Switch** port (local multiplayer co-op)

---

## Maintenance Roadmap

### Monthly Tasks
- [ ] Monitor crash reports (Firebase Crashlytics)
- [ ] Update creature/item balance (telemetry analysis)
- [ ] Fix reported bugs (prioritize critical first)
- [ ] Deploy hotfixes (within 24–48 hours of report)
- [ ] Performance profiling on real devices

### Quarterly Tasks
- [ ] Major feature release (see Phase 2/3 above)
- [ ] Content update (new creatures, zones, cosmetics)
- [ ] Engine upgrade (React, Motion, Vite updates)
- [ ] Security audit (dependency scan, API audit)
- [ ] Player survey & feedback analysis

### Annual Tasks
- [ ] Full redesign pass (if needed)
- [ ] Platform expansion (web, tablet, etc.)
- [ ] Business model review (monetization, pricing)
- [ ] Community summit (player events, competitions)

---

## Success Metrics (Phase 2)

✅ **Engagement**:
- DAU (Daily Active Users) +30%
- Session length +25% (from achievements + leaderboards)
- 7-day retention +20%

✅ **Quality**:
- Crash rate < 0.5%
- Average app store rating ≥ 4.7 stars
- Load time < 2 seconds

✅ **Player Satisfaction**:
- NPS (Net Promoter Score) ≥ 50
- Positive review % > 80%
- Feature satisfaction survey ≥ 8/10

---

## Budget Estimates

| Phase | Design | Dev | QA | Total |
|-------|--------|-----|----|----|
| Phase 1 (Done) | $2K | $8K | $1.5K | **$11.5K** |
| Phase 2 | $3K | $15K | $3K | **$21K** |
| Phase 3 | $5K | $25K | $5K | **$35K** |
| **Total** | **$10K** | **$48K** | **$9.5K** | **$67.5K** |

---

## Resource Requirements

### Team
- **Lead Designer**: 0.5 FTE (vision, leaderboards, cosmetics)
- **Senior Dev**: 1.0 FTE (performance, architecture)
- **Frontend Dev**: 1.0 FTE (new UI components, modals)
- **Audio Engineer**: 0.25 FTE (music, SFX)
- **QA Engineer**: 0.5 FTE (testing, crash hunting)

### Tools
- **Analytics**: Firebase Analytics (free tier)
- **Crash Reporting**: Firebase Crashlytics (free)
- **Audio**: FL Studio or equivalent (one-time license)
- **CDN**: AWS CloudFront for asset delivery (~$500/month)
- **Backend**: Firebase + custom API (~$300/month)

---

## Launch Readiness Checklist

### Code Quality
- [ ] 0 critical bugs
- [ ] TypeScript strict mode enabled
- [ ] Test coverage > 60%
- [ ] No console errors in production
- [ ] Memory leaks profiled & fixed
- [ ] Accessibility audit passed (WCAG 2.1 AA)

### Compliance
- [ ] Privacy policy finalized
- [ ] Terms of service reviewed
- [ ] GDPR compliance verified
- [ ] COPPA compliance (if targeting under 13)
- [ ] App Store submission guidelines met
- [ ] Rating appropriate (likely 12+ or Teen)

### Operations
- [ ] Deployment pipeline automated (CI/CD)
- [ ] Monitoring & alerting set up
- [ ] On-call rotation established
- [ ] Support email template created
- [ ] FAQ / Help center drafted

### Marketing
- [ ] App Store screenshots (8–10 variations)
- [ ] Promotional video (15–30 seconds)
- [ ] Press release drafted
- [ ] Press kit ready
- [ ] Social media accounts created (Twitter, TikTok, Instagram)
- [ ] Launch partners identified (streamers, press)

---

## Risk Mitigation

### Technical Risks
- **Risk**: Performance degrades with more creatures/cosmetics
  - **Mitigation**: Implement object pooling, profile early, cap cosmetic combinations
  
- **Risk**: Multiplayer sync issues cause disputes
  - **Mitigation**: Deterministic replay system, server-authoritative scoring, fraud detection
  
- **Risk**: Audio licensing issues
  - **Mitigation**: Commission original music, use royalty-free SFX from Epidemic Sound

### Business Risks
- **Risk**: Player churn after Phase 1 launch
  - **Mitigation**: Regular content drops (Phase 2), community engagement, leaderboards for retention
  
- **Risk**: Low monetization (if pursuing)
  - **Mitigation**: A/B test cosmetics pricing, offer battle pass optional, keep game fun without paying
  
- **Risk**: Negative reviews about ads (if using)
  - **Mitigation**: Ads are opt-in rewarded only, transparent about monetization

---

## Decision Gate (End of Phase 1)

Before proceeding to Phase 2, verify:

1. ✅ **Player feedback positive** (NPS > 40, reviews > 4.5 stars)
2. ✅ **Retention stable** (DAU not dropping Week 2–4)
3. ✅ **No major bugs** (crash rate < 1%)
4. ✅ **Server costs reasonable** (< $300/month)
5. ✅ **Team bandwidth available** (no burnout signals)
6. ✅ **Business case clear** (monetization strategy decided)

If all gates passed → **greenlight Phase 2**

---

## Long-Term Vision (12+ months)

**One Breath** evolves from a single-player arcade game into a **living, breathing ocean world** where:

- **Community thrives** through guilds, seasonal events, and player-driven stories
- **Creativity flourishes** with user-generated challenges and dive replays
- **Platforms expand** (web, tablet, console, VR/AR)
- **Monetization is optional** but generous (cosmetics, battle pass, no pay-to-win)
- **Culture remains chill** (no toxic competition, wholesome leaderboards, inclusive design)
- **Players return daily** because each dive feels like a new adventure

**Mission**: Make freediving feel epic, accessible, and joyful for millions.

