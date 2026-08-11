import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameConfig, PlayerStats, GamePhase, DiveTelemetryLog, DailyChallenge, PhotoLibrary } from './types';
import { loadSavedConfig } from './config';
import { getOrCreateSessionId, appendTelemetryLog, loadTelemetryLogs } from './telemetry';
import { INITIAL_BOTS } from './bots';
import { CanvasGame } from './components/CanvasGame';
import { SurfaceScreen } from './components/SurfaceScreen';
import { TuningOverlay } from './components/TuningOverlay';
import { TelemetryViewModal } from './components/TelemetryViewModal';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { DiveReportModal } from './components/DiveReportModal';
import { PhotoLibraryModal } from './components/PhotoLibraryModal';
import { ChallengeCompletionToast } from './components/ChallengeCompletionToast';
import { soundManager } from './audioAndHaptics';
import { preloadAssets } from './assetPreloader';

const STATS_STORAGE_KEY = 'one_breath_player_stats_v1';
const CHALLENGES_STORAGE_KEY = 'one_breath_daily_challenges_v1';
const ONBOARDING_STORAGE_KEY = 'one_breath_onboarding_completed_v1';
const PHOTO_LIBRARY_STORAGE_KEY = 'one_breath_photo_library_v1';

const DEFAULT_DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'pearl_collector',
    title: 'Pearl Collector',
    description: 'Gather 80 Pearls from deep sea shells',
    target: 80,
    current: 0,
    rewardCoins: 120,
    completed: false,
    claimed: false,
    icon: 'ðŸ’Ž',
  },
  {
    id: 'reef_fisherman',
    title: 'Reef Fisherman',
    description: 'Catch 5 Fish or Eels on your dives',
    target: 5,
    current: 0,
    rewardCoins: 100,
    completed: false,
    claimed: false,
    icon: 'ðŸŸ',
  },
  {
    id: 'trench_explorer',
    title: 'Trench Explorer',
    description: 'Reach a depth of at least 25 meters',
    target: 25,
    current: 0,
    rewardCoins: 150,
    completed: false,
    claimed: false,
    icon: 'ðŸŒŠ',
  },
  {
    id: 'safe_freediver',
    title: 'Master Freediver',
    description: 'Complete 3 dives and surface safely',
    target: 3,
    current: 0,
    rewardCoins: 110,
    completed: false,
    claimed: false,
    icon: 'ðŸ¤¿',
  },
  {
    id: 'abyssal_fauna',
    title: 'Rare Species Hunter',
    description: 'Catch 2 rare creatures (Seahorse, Crab, Eel, Octopus)',
    target: 2,
    current: 0,
    rewardCoins: 200,
    completed: false,
    claimed: false,
    icon: 'ðŸ™',
  },
];

/** The result payload emitted by CanvasGame at the end of a dive. */
type DiveResultPayload = {
  outcome: 'surfaced' | 'shark' | 'drowned';
  maxDepth: number;
  diveDuration: number;
  shellsCollected: number;
  fishCollected: number;
  shellsLost: number;
  coinsEarned: number;
  foodEarned: number;
  potentialCoins: number;
  potentialFood: number;
  stoneCutAtDepth: number | null;
  airAtSurfacing: number;
  rareCollected?: number;
  itemsCollected?: Array<{ type: string; count: number }>;
};

export default function App() {
  const [config, setConfig] = useState<GameConfig>(loadSavedConfig);
  const [phase, setPhase] = useState<GamePhase>('SURFACE');

  // Onboarding/Splash State
  const [showSplash, setShowSplash] = useState(() => {
    return !localStorage.getItem(ONBOARDING_STORAGE_KEY);
  });
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem(ONBOARDING_STORAGE_KEY);
  });

  // Player Stats
  const [stats, setStats] = useState<PlayerStats>(() => {
    try {
      const raw = localStorage.getItem(STATS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const rawUpgrades = parsed.upgrades || {};
        const normalize = (val: any) => (typeof val === 'number' ? val : val ? 1 : 0);

        return {
          ...parsed,
          upgrades: {
            heavierStone: normalize(rawUpgrades.heavierStone),
            largerBasket: normalize(rawUpgrades.largerBasket),
            betterRope: normalize(rawUpgrades.betterRope),
            lungTraining: normalize(rawUpgrades.lungTraining),
            fastFins: normalize(rawUpgrades.fastFins),
            pearlGoggles: normalize(rawUpgrades.pearlGoggles),
            sharkRepellent: normalize(rawUpgrades.sharkRepellent),
            moraySuit: normalize(rawUpgrades.moraySuit),
            seahorseCharm: normalize(rawUpgrades.seahorseCharm),
            octopusNet: normalize(rawUpgrades.octopusNet),
            sonarRadar: normalize(rawUpgrades.sonarRadar),
            bioluminescentLamp: normalize(rawUpgrades.bioluminescentLamp),
          },
        };
      }
    } catch (e) {
      console.warn('Failed to load stats', e);
    }
    return {
      coins: 0,
      food: 0,
      streak: 0,
      totalDives: 0,
      bestDepth: 0,
      bestScore: 0,
      upgrades: {
        heavierStone: 0,
        largerBasket: 0,
        betterRope: 0,
        lungTraining: 0,
        fastFins: 0,
        pearlGoggles: 0,
        sharkRepellent: 0,
        moraySuit: 0,
        seahorseCharm: 0,
        octopusNet: 0,
        sonarRadar: 0,
        bioluminescentLamp: 0,
      },
      dailyFoodRequirementMet: false,
    };
  });

  // Daily Challenges State
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>(() => {
    try {
      const raw = localStorage.getItem(CHALLENGES_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to load daily challenges', e);
    }
    return DEFAULT_DAILY_CHALLENGES;
  });

  // Photo Library State
  const [photoLibrary, setPhotoLibrary] = useState<PhotoLibrary>(() => {
    try {
      const raw = localStorage.getItem(PHOTO_LIBRARY_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to load photo library', e);
    }
    return {};
  });

  const [lastDiveResult, setLastDiveResult] = useState<{
    outcome: 'surfaced' | 'shark' | 'drowned';
    maxDepth: number;
    diveDuration: number;
    coinsEarned: number;
    foodEarned: number;
    shellsCollected: number;
    rareCollected: number;
    stoneCutAtDepth: number | null;
  } | null>(null);

  // Overlays
  const [showTuningOverlay, setShowTuningOverlay] = useState(false);
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);
  const [showPhotoLibrary, setShowPhotoLibrary] = useState(false);
  const [completedChallenge, setCompletedChallenge] = useState<{
    title: string;
    rewardCoins: number;
  } | null>(null);

  // The single end-of-dive report (replaces the old rescue + defeat + summary popups).
  const [diveReport, setDiveReport] = useState<{
    result: DiveResultPayload;
    rescueOffered: boolean;
    rescueCost: number;
  } | null>(null);
  // Bumped on retry to force a fresh CanvasGame mount without leaving the dive view.
  const [diveKey, setDiveKey] = useState(0);

  // Save Stats & Challenges to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.warn('Failed to save stats', e);
    }
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(dailyChallenges));
    } catch (e) {
      console.warn('Failed to save daily challenges', e);
    }
  }, [dailyChallenges]);

  useEffect(() => {
    try {
      localStorage.setItem(PHOTO_LIBRARY_STORAGE_KEY, JSON.stringify(photoLibrary));
    } catch (e) {
      console.warn('Failed to save photo library', e);
    }
  }, [photoLibrary]);

  // Preload all assets on app mount
  useEffect(() => {
    preloadAssets().catch(() => {});
  }, []);

  // Handle Visibility Change (Backgrounding mid-dive requirement)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && phase === 'DIVING') {
        soundManager.restoreBgMusic();
        setPhase('SURFACE');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [phase]);

  // Onboarding handlers
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
  };

  // Preview the end-of-dive report (for debugging)
  const testRescueModal = () => {
    setDiveReport({
      result: {
        outcome: 'shark',
        maxDepth: 25,
        diveDuration: 15,
        shellsCollected: 5,
        fishCollected: 1,
        shellsLost: 2,
        coinsEarned: 0,
        foodEarned: 0,
        potentialCoins: 80,
        potentialFood: 1,
        stoneCutAtDepth: null,
        airAtSurfacing: 0,
        rareCollected: 0,
      },
      rescueOffered: true,
      rescueCost: 20,
    });
  };

  // Start Dive Handler â€” plays boat departure video then enters dive
  const handleStartDive = () => {
    soundManager.dimBgMusic();
    setPhase('DIVE_TRANSITION');
  };

  // Claim Daily Challenge Reward
  const handleClaimChallengeReward = (challengeId: string) => {
    setDailyChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === challengeId && ch.completed && !ch.claimed) {
          setStats((s) => ({
            ...s,
            coins: s.coins + ch.rewardCoins,
          }));
          soundManager.playCoinPickup();
          return { ...ch, claimed: true };
        }
        return ch;
      })
    );
  };

  // Buy Upgrade Handler
  const handleBuyUpgrade = (type: keyof typeof stats.upgrades, cost: number) => {
    setStats((prev) => {
      if (prev.coins >= cost) {
        const currentLevel = typeof prev.upgrades[type] === 'number'
          ? (prev.upgrades[type] as number)
          : (prev.upgrades[type] ? 1 : 0);

        soundManager.playLevelUp();
        return {
          ...prev,
          coins: prev.coins - cost,
          upgrades: {
            ...prev.upgrades,
            [type]: currentLevel + 1,
          },
        };
      }
      return prev;
    });
  };

  // Trade Fish for Pearls
  const handleTradeFishForPearls = (fishCost: number, pearlsEarned: number) => {
    if (stats.food >= fishCost) {
      setStats((prev) => ({
        ...prev,
        food: prev.food - fishCost,
        coins: prev.coins + pearlsEarned,
      }));
    }
  };

  // Add Pearls (Grant / Merchant Contract)
  const handleAddPearls = (amount: number) => {
    setStats((prev) => ({
      ...prev,
      coins: prev.coins + amount,
    }));
  };

  // Record discovered items in the photo library
  const recordDiscoveredItems = (itemsCollected: DiveResultPayload['shellsCollected'] | number, itemTypes: string[], maxDepth: number) => {
    setPhotoLibrary((prev) => {
      const updated = { ...prev };
      itemTypes.forEach((type) => {
        if (!updated[type]) {
          updated[type] = {
            type: type as any,
            discoveredAt: new Date().toISOString(),
            count: 1,
            maxDepthFound: maxDepth,
          };
        } else {
          updated[type] = {
            ...updated[type],
            count: updated[type].count + 1,
            maxDepthFound: Math.max(updated[type].maxDepthFound, maxDepth),
          };
        }
      });
      return updated;
    });
  };

  // Commit a finished dive to stats, challenges, telemetry, and lastDiveResult.
  // Phase/music transitions are handled by the caller (report actions below).
  const commitDiveResult = (result: DiveResultPayload) => {
    // Record discovered items if this was a successful dive
    if (result.outcome === 'surfaced' && result.itemsCollected) {
      const itemTypes = result.itemsCollected
        .filter((item) => item.count > 0)
        .flatMap((item) => Array(item.count).fill(item.type));
      if (itemTypes.length > 0) {
        recordDiscoveredItems(result.shellsCollected + result.fishCollected, itemTypes, result.maxDepth);
      }
    }

    // 1. Calculate new stats
    setStats((prev) => {
      const nextStreak = result.outcome === 'surfaced' ? prev.streak + 1 : 0;
      const newTotalCoins = prev.coins + result.coinsEarned;
      const newTotalFood = prev.food + result.foodEarned;

      return {
        ...prev,
        coins: newTotalCoins,
        food: newTotalFood,
        streak: nextStreak,
        totalDives: prev.totalDives + 1,
        bestDepth: Math.max(prev.bestDepth, result.maxDepth),
        bestScore: Math.max(prev.bestScore, result.coinsEarned),
      };
    });

    // 2. Progress Daily Challenges
    setDailyChallenges((prevChallenges) =>
      prevChallenges.map((ch) => {
        if (ch.completed) return ch;
        let newProgress = ch.current;

        if (ch.id === 'pearl_collector') {
          newProgress += result.coinsEarned;
        } else if (ch.id === 'reef_fisherman') {
          newProgress += result.foodEarned;
        } else if (ch.id === 'trench_explorer') {
          newProgress = Math.max(newProgress, result.maxDepth);
        } else if (ch.id === 'safe_freediver') {
          if (result.outcome === 'surfaced') newProgress += 1;
        } else if (ch.id === 'abyssal_fauna') {
          newProgress += result.rareCollected || 0;
        }

        const isNowCompleted = newProgress >= ch.target;
        if (isNowCompleted && !ch.completed) {
          setCompletedChallenge({ title: ch.title, rewardCoins: ch.rewardCoins });
        }
        return {
          ...ch,
          current: Math.min(newProgress, ch.target),
          completed: isNowCompleted,
        };
      })
    );

    setLastDiveResult({
      outcome: result.outcome,
      maxDepth: result.maxDepth,
      diveDuration: result.diveDuration,
      coinsEarned: result.coinsEarned,
      foodEarned: result.foodEarned,
      shellsCollected: result.shellsCollected,
      rareCollected: result.rareCollected || 0,
      stoneCutAtDepth: result.stoneCutAtDepth,
    });

    // 3. Log Telemetry
    const logs = loadTelemetryLogs();
    const logEntry: DiveTelemetryLog = {
      id: `dive_${Date.now()}`,
      timestamp: new Date().toISOString(),
      sessionId: getOrCreateSessionId(),
      deviceClass: window.innerWidth < 640 ? 'mobile' : 'desktop',
      diveIndex: logs.length + 1,
      maxDepth: result.maxDepth,
      diveDuration: result.diveDuration,
      outcome: result.outcome,
      shellsCollected: result.shellsCollected,
      fishCollected: result.fishCollected,
      shellsLost: result.shellsLost,
      scoreBanked: result.coinsEarned,
      depthMultiplier: 1 + result.maxDepth / config.DEPTH_MULTIPLIER_DIVISOR,
      streakAtStart: stats.streak,
      stoneCutAtDepth: result.stoneCutAtDepth,
      airAtSurfacing: result.airAtSurfacing,
      backgroundedMidDive: false,
    };
    appendTelemetryLog(logEntry);
  };

  // Dive Resolution Callback â€” open the single end-of-dive report (no stats are
  // committed until the player acts on it, so a rescue can restore the haul).
  const handleDiveComplete = useCallback(
    (result: DiveResultPayload) => {
      const failed = result.outcome !== 'surfaced';
      const treasure = result.potentialCoins || 0;
      // Offer a rescue only when there's a haul worth saving or a streak on the line.
      const rescueOffered = failed && (treasure >= 30 || stats.streak > 0);
      setDiveReport({
        result,
        rescueOffered,
        rescueCost: Math.max(1, Math.ceil(treasure * 0.25)),
      });
      // Phase stays 'DIVING' so the report overlays the frozen final frame.
    },
    [stats.streak]
  );

  // Accept the result as-is: keep earnings on success, forfeit the haul on failure.
  const settledResult = (r: DiveResultPayload): DiveResultPayload =>
    r.outcome === 'surfaced' ? r : { ...r, coinsEarned: 0, foodEarned: 0 };

  const handleReportContinue = () => {
    if (!diveReport) return;
    commitDiveResult(settledResult(diveReport.result));
    setDiveReport(null);
    soundManager.restoreBgMusic();
    setPhase('SURFACE');
  };

  const handleReportRetry = () => {
    if (!diveReport) return;
    commitDiveResult(settledResult(diveReport.result));
    setDiveReport(null);
    setDiveKey((k) => k + 1); // force a fresh CanvasGame mount
    soundManager.dimBgMusic();
    setPhase('DIVING');
  };

  const handleReportRescue = () => {
    if (!diveReport || stats.coins < diveReport.rescueCost) return;
    const { result, rescueCost } = diveReport;
    soundManager.playCoinPickup();
    // Pay the fee, then bank the full would-be haul.
    setStats((prev) => ({ ...prev, coins: prev.coins - rescueCost }));
    commitDiveResult({
      ...result,
      coinsEarned: result.potentialCoins || 0,
      foodEarned: result.potentialFood || 0,
    });
    setDiveReport(null);
    soundManager.restoreBgMusic();
    setPhase('SURFACE');
  };

  return (
    <div className="w-full min-h-[100dvh] bg-slate-950 flex items-center justify-center font-sans antialiased">
      {/* Mobile Portrait Device Frame Container (aspect ratio 9:19.5 with max constraints) */}
      <div className="relative h-[100dvh] w-full max-w-md bg-slate-900 shadow-2xl overflow-hidden md:h-[min(920px,100dvh)] md:rounded-[28px] border-0 md:border md:border-cyan-100/10 flex flex-col">
        {/* Splash Screen */}
        <AnimatePresence>
          {showSplash && <SplashScreen key="splash" onComplete={handleSplashComplete} />}
        </AnimatePresence>

        {/* Onboarding Screen */}
        <AnimatePresence>
          {showOnboarding && !showSplash && (
            <OnboardingScreen key="onboarding" onComplete={handleOnboardingComplete} />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!showOnboarding && !showSplash && phase === 'SURFACE' && (
            <motion.div
              key="surface"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04, filter: 'blur(4px)' }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="w-full h-full flex flex-col"
            >
              <SurfaceScreen
                stats={stats}
                bots={INITIAL_BOTS}
                dailyChallenges={dailyChallenges}
                onClaimChallengeReward={handleClaimChallengeReward}
                lastDiveResult={lastDiveResult}
                onStartDive={handleStartDive}
                onBuyUpgrade={handleBuyUpgrade}
                onTradeFishForPearls={handleTradeFishForPearls}
                onAddPearls={handleAddPearls}
                onOpenTelemetryModal={() => setShowTelemetryModal(true)}
                onOpenDebug={() => setShowTuningOverlay(true)}
                onOpenPhotoLibrary={() => setShowPhotoLibrary(true)}
                photoLibraryCount={Object.keys(photoLibrary).length}
              />
            </motion.div>
          )}
          {!showOnboarding && !showSplash && phase === 'DIVE_TRANSITION' && (
            <motion.div
              key="dive-transition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex items-center justify-center bg-black"
            >
              <video
                autoPlay
                muted
                playsInline
                onEnded={() => setPhase('DIVING')}
                onClick={() => setPhase('DIVING')}
                className="w-full h-full object-cover cursor-pointer"
                src="/assets/village_boat_departure_3s_fast.mp4"
              />
            </motion.div>
          )}
          {!showOnboarding && !showSplash && (phase === 'DIVING' || phase === 'RESULTS' || phase === 'TELEMETRY') && (
            <motion.div
              key="diving"
              initial={{ opacity: 0, scale: 1.06, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full h-full flex flex-col"
            >
              <CanvasGame
                key={diveKey}
                config={config}
                upgrades={stats.upgrades}
                streak={stats.streak}
                onDiveComplete={handleDiveComplete}
                onOpenDebug={() => setShowTuningOverlay(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* OVERLAYS */}
        <AnimatePresence>
          {/* Unified end-of-dive report â€” outcome, stats, and inline rescue offer */}
          {diveReport && (
            <DiveReportModal
              key="dive-report"
              outcome={diveReport.result.outcome}
              maxDepth={diveReport.result.maxDepth}
              diveDuration={diveReport.result.diveDuration}
              shellsCollected={diveReport.result.shellsCollected}
              rareCollected={diveReport.result.rareCollected || 0}
              coinsEarned={diveReport.result.coinsEarned}
              foodEarned={diveReport.result.foodEarned}
              potentialCoins={diveReport.result.potentialCoins || 0}
              potentialFood={diveReport.result.potentialFood || 0}
              previousStreak={stats.streak}
              rescueOffered={diveReport.rescueOffered}
              rescueCost={diveReport.rescueCost}
              playerCoins={stats.coins}
              onRescue={handleReportRescue}
              onContinue={handleReportContinue}
              onRetry={handleReportRetry}
            />
          )}

          {showTuningOverlay && (
            <TuningOverlay
              key="tuning-modal"
              config={config}
              onUpdateConfig={setConfig}
              onClose={() => setShowTuningOverlay(false)}
              onOpenTelemetryModal={() => setShowTelemetryModal(true)}
              onTestRescueModal={testRescueModal}
            />
          )}

          {showTelemetryModal && (
            <TelemetryViewModal
              key="telemetry-modal"
              onClose={() => setShowTelemetryModal(false)}
            />
          )}

          {showPhotoLibrary && (
            <PhotoLibraryModal
              key="photo-library"
              photoLibrary={photoLibrary}
              onClose={() => setShowPhotoLibrary(false)}
            />
          )}

          {completedChallenge && (
            <ChallengeCompletionToast
              key="challenge-toast"
              challengeTitle={completedChallenge.title}
              rewardCoins={completedChallenge.rewardCoins}
              onDismiss={() => setCompletedChallenge(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


