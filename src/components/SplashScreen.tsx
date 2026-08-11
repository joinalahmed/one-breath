import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ASSET_URLS } from '../assetPreloader';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isReady, setIsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const reduceMotion = useReducedMotion();

  // Preload ALL assets for smooth gameplay
  useEffect(() => {
    let isMounted = true;

    const preloadAsset = (url: string): Promise<void> => {
      return new Promise((resolve) => {
        const ext = url.split('.').pop()?.toLowerCase() || '';

        if (ext === 'mp4') {
          const video = document.createElement('video');
          video.src = url;
          video.onloadedmetadata = () => resolve();
          video.onerror = () => resolve();
        } else if (ext === 'wav' || ext === 'mp3') {
          const audio = new Audio();
          audio.src = url;
          audio.onloadedmetadata = () => resolve();
          audio.onerror = () => resolve();
        } else {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = url;
        }
      });
    };

    const preloadAllAssets = async () => {
      try {
        const total = ASSET_URLS.length;
        let completed = 0;

        // Load assets in parallel batches for better performance
        const batchSize = 10;
        for (let i = 0; i < total; i += batchSize) {
          if (!isMounted) return;

          const batch = ASSET_URLS.slice(i, i + batchSize);
          await Promise.all(
            batch.map((asset) =>
              preloadAsset(asset).then(() => {
                completed++;
                if (isMounted) {
                  setLoadProgress((completed / total) * 100);
                }
              })
            )
          );
        }

        // After all assets load, wait minimum splash duration
        if (isMounted) {
          const minSplashDuration = reduceMotion ? 500 : 4400;
          const remaining = Math.max(0, minSplashDuration - Date.now());
          await new Promise(resolve => setTimeout(resolve, remaining));
          setIsReady(true);
        }
      } catch {
        if (isMounted) setIsReady(true);
      }
    };

    const startTime = Date.now();
    preloadAllAssets();
    return () => { isMounted = false; };
  }, [reduceMotion]);

  useEffect(() => {
    if (!isReady) return;
    const timer = window.setTimeout(onComplete, reduceMotion ? 0 : 600);
    return () => window.clearTimeout(timer);
  }, [isReady, onComplete, reduceMotion]);

  return (
    <motion.section
      initial={{ opacity: 1 }}
      animate={{ opacity: isReady ? 0 : 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.6 }}
      className="absolute inset-0 z-50 min-h-[100dvh] overflow-hidden bg-[#04141f]"
      aria-label="One Breath loading screen"
      style={{
        backgroundImage: 'url(/assets/splash-screen.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Animated splash loop */}
      <img
        src="/assets/the_ascent_splash_loop_3s.gif"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />

      {/* Loading progress bar */}
      <div className="absolute bottom-8 left-0 right-0 px-8">
        <div className="h-1 w-full bg-slate-700/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '2%' }}
            animate={{ width: `${Math.min(loadProgress, 98)}%` }}
            transition={{ type: 'spring', damping: 25, stiffness: 50 }}
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg"
          />
        </div>
        <p className="text-center text-xs text-slate-300 mt-2 font-mono">
          Loading... {Math.round(Math.min(loadProgress, 100))}%
        </p>
      </div>
    </motion.section>
  );
};
