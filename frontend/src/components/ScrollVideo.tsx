import { useEffect, useRef, useState } from 'react';
import { HERO_VIDEO_URL } from '../constants';

const MAX_FRAMES = 90;
const MIN_FRAMES = 24;
const FRAMES_PER_SECOND = 12;
const FRAME_CACHE_MAX_WIDTH = 960;
const LERP_FACTOR = 0.12;
const SEEK_DELTA_THRESHOLD = 0.04;
const MAX_DPR = 2;

/**
 * Fixed full-bleed background whose "playback" position is driven entirely
 * by scroll position, not by time. Three stacked layers, bottom to top:
 *
 *   1. poster <img>   — instant paint, fades out once we have real frames
 *   2. visible <video> — live decode, used until the frame cache is ready
 *   3. <canvas>        — draws cached frames once extraction finishes
 *
 * The frame cache exists because seeking a <video> element on every
 * scroll tick is janky (each seek is an async decode). Pre-extracting a
 * bounded number of frames as ImageBitmaps lets the canvas pick the
 * nearest one synchronously, which is what makes the scrub feel smooth.
 * Until that cache is ready, we fall back to directly seeking the video.
 */
export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenVideoRef = useRef<HTMLVideoElement | null>(null);

  const [posterVisible, setPosterVisible] = useState(true);
  const [videoHasFrame, setVideoHasFrame] = useState(false);
  const [frameCacheReady, setFrameCacheReady] = useState(false);

  const framesRef = useRef<ImageBitmap[]>([]);
  const smoothedProgressRef = useRef(0);
  const lastSeekTimeRef = useRef(0);
  const rafRef = useRef<number>();

  // --- Frame extraction (background task, runs once) ---------------------
  useEffect(() => {
    const visibleVideo = videoRef.current;
    if (!visibleVideo) return;

    let cancelled = false;

    async function extractFrames() {
      const offscreen = document.createElement('video');
      offscreen.src = HERO_VIDEO_URL;
      offscreen.muted = true;
      offscreen.playsInline = true;
      offscreen.preload = 'auto';
      offscreen.crossOrigin = 'anonymous';
      offscreenVideoRef.current = offscreen;

      await new Promise<void>((resolve) => {
        offscreen.addEventListener('loadeddata', () => resolve(), { once: true });
        offscreen.load();
      });
      if (cancelled) return;

      const duration = offscreen.duration || 0;
      if (!duration || !isFinite(duration)) return;

      const frameCount = Math.min(
        MAX_FRAMES,
        Math.max(MIN_FRAMES, Math.round(duration * FRAMES_PER_SECOND))
      );

      const scale = Math.min(1, FRAME_CACHE_MAX_WIDTH / offscreen.videoWidth);
      const frameWidth = Math.round(offscreen.videoWidth * scale);
      const frameHeight = Math.round(offscreen.videoHeight * scale);

      const captureCanvas = document.createElement('canvas');
      captureCanvas.width = frameWidth;
      captureCanvas.height = frameHeight;
      const captureCtx = captureCanvas.getContext('2d');
      if (!captureCtx) return;

      const frames: ImageBitmap[] = [];

      for (let i = 0; i < frameCount; i++) {
        if (cancelled) return;
        const time = (i / (frameCount - 1)) * Math.max(0, duration - 0.05);

        await new Promise<void>((resolve) => {
          const onSeeked = () => {
            offscreen.removeEventListener('seeked', onSeeked);
            resolve();
          };
          offscreen.addEventListener('seeked', onSeeked);
          offscreen.currentTime = time;
        });
        if (cancelled) return;

        captureCtx.drawImage(offscreen, 0, 0, frameWidth, frameHeight);
        const bitmap = await createImageBitmap(captureCanvas);
        frames.push(bitmap);
      }

      if (cancelled) return;
      framesRef.current = frames;
      setFrameCacheReady(true);
    }

    const onVisibleLoadedData = () => {
      setVideoHasFrame(true);
      // Small yield so the visible video's own first paint isn't starved
      // by immediately kicking off a second (offscreen) video decode.
      window.setTimeout(() => {
        if (!cancelled) extractFrames();
      }, 300);
    };

    visibleVideo.addEventListener('loadeddata', onVisibleLoadedData, { once: true });

    return () => {
      cancelled = true;
      visibleVideo.removeEventListener('loadeddata', onVisibleLoadedData);
    };
  }, []);

  // --- Scroll-driven draw loop --------------------------------------------
  useEffect(() => {
    function drawObjectCover(
      ctx: CanvasRenderingContext2D,
      source: CanvasImageSource,
      sourceW: number,
      sourceH: number,
      canvasW: number,
      canvasH: number
    ) {
      if (!sourceW || !sourceH) return;
      const scale = Math.max(canvasW / sourceW, canvasH / sourceH);
      const drawW = sourceW * scale;
      const drawH = sourceH * scale;
      const dx = (canvasW - drawW) / 2;
      const dy = (canvasH - drawH) / 2;
      ctx.drawImage(source, dx, dy, drawW, drawH);
    }

    function tick() {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      rafRef.current = requestAnimationFrame(tick);
      if (!canvas || !video) return;

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const target = scrollable > 0 ? window.scrollY / scrollable : 0;
      const clampedTarget = Math.min(1, Math.max(0, target));

      smoothedProgressRef.current +=
        (clampedTarget - smoothedProgressRef.current) * LERP_FACTOR;
      const smoothed = smoothedProgressRef.current;

      const frames = framesRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const displayW = canvas.clientWidth;
      const displayH = canvas.clientHeight;
      if (canvas.width !== displayW * dpr || canvas.height !== displayH * dpr) {
        canvas.width = displayW * dpr;
        canvas.height = displayH * dpr;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (frameCacheReady && frames.length > 0) {
        const index = Math.round(smoothed * (frames.length - 1));
        const frame = frames[Math.min(frames.length - 1, Math.max(0, index))];
        drawObjectCover(ctx, frame, frame.width, frame.height, canvas.width, canvas.height);
      } else if (video.duration && isFinite(video.duration)) {
        const targetTime = smoothed * Math.max(0, video.duration - 0.05);
        if (Math.abs(targetTime - lastSeekTimeRef.current) > SEEK_DELTA_THRESHOLD) {
          lastSeekTimeRef.current = targetTime;
          video.currentTime = targetTime;
        }
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [frameCacheReady]);

  useEffect(() => {
    if (videoHasFrame || frameCacheReady) {
      setPosterVisible(false);
    }
  }, [videoHasFrame, frameCacheReady]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#0a0a0a] pointer-events-none">
      <img
        src="/hero-poster.jpg"
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          posterVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onError={(e) => {
          // No local poster provided — the video/canvas layers cover this.
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
      />
      <video
        ref={videoRef}
        src={HERO_VIDEO_URL}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          videoHasFrame && !frameCacheReady ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
          frameCacheReady ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
