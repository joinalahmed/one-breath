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
  '/assets/ridge-coral-shelf.png',
  '/assets/ridge-cap.png',
  '/assets/ridge-straight.png',
  '/assets/ridge-step-up.png',
  '/assets/ridge-step-down.png',
  '/assets/ridge-step-up-m.png',
  '/assets/ridge-step-down-m.png',
  '/assets/ridge-block.png',
  '/assets/ChatGPT Image Aug 10, 2026, 02_57_33 PM.png',
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
