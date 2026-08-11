// Preload all game assets (images, audio, video) on app startup

const ASSET_URLS = [
  // Video
  '/assets/village_boat_departure_3s_fast.mp4',

  // Audio
  '/assets/96459__123a4567__ambience_maltese_fishing_village_seafront_winter.wav',

  // GIFs
  '/assets/pearl.gif',
  '/assets/fish-clownfish.gif',
  '/assets/fish-pufferfish.gif',
  '/assets/fish-betta.gif',
  '/assets/fish-angelfish.gif',
  '/assets/shark.gif',
  '/assets/crab.gif',
  '/assets/middle_eastern_fishing_village_actual_walking.gif',

  // PNGs
  '/assets/seabed-floor.png',
  '/assets/coral-branching.png',
  '/assets/coral-seafan.png',
  '/assets/rock-seaweed.png',
  '/assets/pearl-clam.png',
  '/assets/bluefish.png',
  '/assets/bluefush-patcheye.png',
  '/assets/cliff-purplestar.png',
  '/assets/cliff-redstar.png',
  '/assets/greenfish.png',
  '/assets/ocean-plant.png',
  '/assets/ocean-wall-dark.png',
  '/assets/ocean-wall-fixed.png',
  '/assets/ocean-wall-light.png',
  '/assets/ocean-wall-med.png',
  '/assets/background.png',

  // Splash — static poster + animated loop (plays on every app load)
  '/assets/splash-screen.png',
  '/assets/the_ascent_splash_loop_3s.gif',

  // Map screen — animated theme loop
  '/assets/map_theme_animation_clean_3s_loop.gif',

  // Pearl Coast landing — animated village background
  '/assets/game-main-screen-bg.gif',

  // Pearl Coast landing — HUD + button assets (transparent PNGs)
  '/assets/pearl-coast-clean-buttons-v2/hud-level-ring.png',
  '/assets/pearl-coast-clean-buttons-v2/hud-pearl-counter.png',
  '/assets/pearl-coast-clean-buttons-v2/hud-fish-counter.png',
  '/assets/pearl-coast-clean-buttons-v2/hud-streak-counter.png',
  '/assets/pearl-coast-clean-buttons-v2/button-start-dive.png',
  '/assets/pearl-coast-clean-buttons-v2/button-gear.png',
  '/assets/pearl-coast-clean-buttons-v2/button-quests.png',
  '/assets/pearl-coast-clean-buttons-v2/button-photos.png',
  '/assets/pearl-coast-clean-buttons-v2/button-map.png',
  '/assets/pearl-coast-clean-buttons-v2/button-board.png',
  '/assets/pearl-coast-clean-buttons-v2/home-removebg-preview.png',
  '/assets/pearl-coast-clean-buttons-v2/setting-removebg-preview.png',
];

export const preloadAssets = async (): Promise<void> => {
  const promises = ASSET_URLS.map((url) => preloadAsset(url));
  await Promise.allSettled(promises);
};

const preloadAsset = (url: string): Promise<void> => {
  return new Promise((resolve) => {
    const ext = url.split('.').pop()?.toLowerCase() || '';

    if (ext === 'mp4') {
      // Preload video
      const video = document.createElement('video');
      video.src = url;
      video.onloadedmetadata = () => resolve();
      video.onerror = () => resolve(); // Don't fail on error
    } else if (ext === 'wav' || ext === 'mp3') {
      // Preload audio
      const audio = new Audio();
      audio.src = url;
      audio.onloadedmetadata = () => resolve();
      audio.onerror = () => resolve();
    } else {
      // Preload image (PNG, GIF, JPG)
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Don't fail on error
      img.src = url;
    }
  });
};
