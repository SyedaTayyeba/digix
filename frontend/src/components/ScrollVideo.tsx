import { useEffect, useRef, useState } from 'react';
import {
  HERO_VIDEO_URL,
  HERO_POSTER_LOCAL_FALLBACK,
} from '../constants';

const DESKTOP_SMOOTHING = 0.35;
const MOBILE_SMOOTHING = 0.4;

const DESKTOP_SEEK_THRESHOLD = 0.025;
const MOBILE_SEEK_THRESHOLD = 0.14;

const MOBILE_SEEK_INTERVAL = 70;

export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastMobileSeekRef = useRef(0);

  const scrollProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const lastSeekTimeRef = useRef(-1);

  const [videoReady, setVideoReady] = useState(false);

  const isMobileRef = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 768px)').matches
  );

  // Video initialization
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    let mounted = true;

    const handleLoadedMetadata = () => {
      if (!mounted) return;

      video.currentTime = 0;
      setVideoReady(true);
    };

    const handleCanPlay = () => {
      if (!mounted) return;

      setVideoReady(true);
    };

    const handleError = () => {
      if (!mounted) return;

      setVideoReady(false);
    };

    video.addEventListener(
      'loadedmetadata',
      handleLoadedMetadata
    );

    video.addEventListener(
      'canplay',
      handleCanPlay
    );

    video.addEventListener(
      'error',
      handleError
    );

    video.load();

    return () => {
      mounted = false;

      video.removeEventListener(
        'loadedmetadata',
        handleLoadedMetadata
      );

      video.removeEventListener(
        'canplay',
        handleCanPlay
      );

      video.removeEventListener(
        'error',
        handleError
      );
    };
  }, []);

  // Scroll progress
  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {
        const maxScroll =
          document.documentElement.scrollHeight -
          window.innerHeight;

        if (maxScroll <= 0) {
          scrollProgressRef.current = 0;
        } else {
          scrollProgressRef.current = Math.min(
            1,
            Math.max(
              0,
              window.scrollY / maxScroll
            )
          );
        }

        ticking = false;
      });
    };

    updateScrollProgress();

    window.addEventListener(
      'scroll',
      updateScrollProgress,
      { passive: true }
    );

    window.addEventListener(
      'resize',
      updateScrollProgress,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        'scroll',
        updateScrollProgress
      );

      window.removeEventListener(
        'resize',
        updateScrollProgress
      );
    };
  }, []);

  // Scroll → video
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const isMobile = isMobileRef.current;

    const smoothing = isMobile
      ? MOBILE_SMOOTHING
      : DESKTOP_SMOOTHING;

    const seekThreshold = isMobile
      ? MOBILE_SEEK_THRESHOLD
      : DESKTOP_SEEK_THRESHOLD;

    let running = true;

    const animate = (timestamp: number) => {
      if (!running) return;

      animationFrameRef.current =
        requestAnimationFrame(animate);

      if (
        !videoReady ||
        video.readyState < 2 ||
        !Number.isFinite(video.duration) ||
        video.duration <= 0
      ) {
        return;
      }

      const target =
        scrollProgressRef.current;

      const current =
        currentProgressRef.current;

      const difference =
        target - current;

      const next =
        Math.abs(difference) < 0.001
          ? target
          : current +
            difference * smoothing;

      currentProgressRef.current = next;

      const duration =
        Math.max(
          0,
          video.duration - 0.05
        );

      const targetTime =
        next * duration;

      // Mobile: limit expensive decoder seeks
      if (isMobile) {
        if (
          timestamp -
            lastMobileSeekRef.current <
          MOBILE_SEEK_INTERVAL
        ) {
          return;
        }

        lastMobileSeekRef.current =
          timestamp;
      }

      // Skip tiny timeline changes
      if (
        lastSeekTimeRef.current >= 0 &&
        Math.abs(
          targetTime -
            lastSeekTimeRef.current
        ) < seekThreshold
      ) {
        return;
      }

      // Never stack seeks
      if (video.seeking) {
        return;
      }

      lastSeekTimeRef.current =
        targetTime;

      try {
        video.currentTime = targetTime;
      } catch {
        // Ignore temporary decoder errors.
      }
    };

    animationFrameRef.current =
      requestAnimationFrame(animate);

    return () => {
      running = false;

      if (
        animationFrameRef.current !== null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );

        animationFrameRef.current = null;
      }
    };
  }, [videoReady]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-transparent pointer-events-none">
      <img
        src={HERO_POSTER_LOCAL_FALLBACK}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${
          videoReady
            ? 'opacity-0'
            : 'opacity-100'
        }`}
        onError={(event) => {
          event.currentTarget.style.display =
            'none';
        }}
      />

      <video
        ref={videoRef}
        src={HERO_VIDEO_URL}
        muted
        playsInline
        preload="metadata"
        controls={false}
        loop={false}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${
          videoReady
            ? 'opacity-100'
            : 'opacity-0'
        }`}
      />
    </div>
  );
}
