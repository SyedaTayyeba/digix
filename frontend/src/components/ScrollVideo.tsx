import { useEffect, useRef, useState } from 'react';
import { HERO_VIDEO_URL, HERO_POSTER_LOCAL_FALLBACK } from '../constants';

const DESKTOP_SMOOTHING = 0.35;
const MOBILE_SMOOTHING = 0.55;

const DESKTOP_SEEK_THRESHOLD = 0.025;
const MOBILE_SEEK_THRESHOLD = 0.08;

export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const animationFrameRef = useRef<number | null>(null);

  const scrollProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const lastSeekTimeRef = useRef(-1);

  const [videoReady, setVideoReady] = useState(false);

  const isMobileRef = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 768px)').matches
  );

  /*
   * --------------------------------------------------
   * VIDEO INITIALIZATION
   * --------------------------------------------------
   */
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    let mounted = true;

    const handleLoadedMetadata = () => {
      if (!mounted) return;

      /*
       * Start from first frame.
       */
      video.currentTime = 0;

      setVideoReady(true);

      /*
       * Try autoplay.
       *
       * Muted + playsInline allows autoplay on
       * most mobile browsers.
       */
      video
        .play()
        .then(() => {
          /*
           * We immediately pause because the video
           * timeline is controlled by scrolling.
           */
          video.pause();
        })
        .catch(() => {
          /*
           * Autoplay can be blocked.
           * This is okay because currentTime seeking
           * still works after metadata is loaded.
           */
        });
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

    /*
     * Explicitly request loading.
     */
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

  /*
   * --------------------------------------------------
   * SCROLL PROGRESS
   * --------------------------------------------------
   */
  useEffect(() => {
    const updateScrollProgress = () => {
      const maxScroll =
        document.documentElement.scrollHeight -
        window.innerHeight;

      if (maxScroll <= 0) {
        scrollProgressRef.current = 0;
        return;
      }

      scrollProgressRef.current = Math.min(
        1,
        Math.max(
          0,
          window.scrollY / maxScroll
        )
      );
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

  /*
   * --------------------------------------------------
   * SCROLL → VIDEO TIMELINE
   * --------------------------------------------------
   */
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

    const animate = () => {
      animationFrameRef.current =
        requestAnimationFrame(animate);

      /*
       * Don't seek until video metadata is ready.
       */
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

      /*
       * Smooth interpolation.
       */
      const next =
        Math.abs(difference) < 0.002
          ? target
          : current +
            difference * smoothing;

      currentProgressRef.current = next;

      /*
       * Keep a tiny margin at the end.
       * This prevents seeking exactly to duration.
       */
      const duration =
        Math.max(
          0,
          video.duration - 0.05
        );

      const targetTime =
        next * duration;

      /*
       * Don't perform unnecessary seeks.
       */
      if (
        lastSeekTimeRef.current >= 0 &&
        Math.abs(
          targetTime -
            lastSeekTimeRef.current
        ) < seekThreshold
      ) {
        return;
      }

      lastSeekTimeRef.current =
        targetTime;

      try {
        video.currentTime = targetTime;
      } catch {
        /*
         * Ignore temporary browser decoder
         * / seeking errors.
         */
      }
    };

    animationFrameRef.current =
      requestAnimationFrame(animate);

    return () => {
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
    <div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none">
      {/*
       * ------------------------------------------------
       * POSTER
       * ------------------------------------------------
       */}
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

      {/*
       * ------------------------------------------------
       * VIDEO
       * ------------------------------------------------
       */}
      <video
        ref={videoRef}
        src={HERO_VIDEO_URL}
        muted
        playsInline
        preload="auto"
        autoPlay
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
