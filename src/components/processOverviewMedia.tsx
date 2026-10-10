import { useEffect, useRef, useState, type RefObject } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import AdoptSystemDiagram from './AdoptSystemDiagram';
import type { ProcessOverviewMedia } from './AdoptProcessOverview';

const VIMEO_ORIGIN = 'https://player.vimeo.com';

function vimeoCommand(iframe: HTMLIFrameElement | null, method: string, value?: unknown) {
  if (!iframe?.contentWindow) return;
  iframe.contentWindow.postMessage(
    JSON.stringify(value === undefined ? { method } : { method, value }),
    VIMEO_ORIGIN,
  );
}

function useCardHover(rootRef: RefObject<HTMLElement | null>) {
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const card = rootRef.current?.closest('.process-scroll-stage__card, .process-turning-point-card');
    if (!card) return;
    const enter = () => setHover(true);
    const leave = () => setHover(false);
    card.addEventListener('pointerenter', enter);
    card.addEventListener('pointerleave', leave);
    return () => {
      card.removeEventListener('pointerenter', enter);
      card.removeEventListener('pointerleave', leave);
    };
  }, [rootRef]);

  return hover;
}

function VideoProgress({ value }: { value: number }) {
  return (
    <span className="process-card-video__bar" aria-hidden>
      <span style={{ transform: `scaleX(${Math.min(1, Math.max(0, value))})` }} />
    </span>
  );
}

function CardFileVideo({
  media,
}: {
  media: Extract<ProcessOverviewMedia, { type: 'video' }>;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hover = useCardHover(rootRef);
  const reduced = useReducedMotion() ?? false;
  const [progress, setProgress] = useState(0);
  const playing = hover && !reduced;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!playing) {
      video.pause();
      return;
    }
    video.play().catch(() => {});
  }, [playing]);

  return (
    <div ref={rootRef} className="process-card-video" data-playing={playing ? 'true' : 'false'}>
      <video
        ref={videoRef}
        src={media.src}
        poster={media.poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={media.alt}
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          if (!video.duration) return;
          setProgress(video.currentTime / video.duration);
        }}
      />
      <VideoProgress value={progress} />
    </div>
  );
}

function CardVimeo({
  media,
}: {
  media: Extract<ProcessOverviewMedia, { type: 'embed' }>;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const readyRef = useRef(false);
  const wantPlay = useRef(false);
  const hover = useCardHover(rootRef);
  const reduced = useReducedMotion() ?? false;
  const [progress, setProgress] = useState(0);
  const playing = hover && !reduced;

  useEffect(() => {
    wantPlay.current = playing;
    const iframe = frameRef.current;
    if (!readyRef.current || !iframe) return;
    vimeoCommand(iframe, 'setVolume', 0);
    vimeoCommand(iframe, playing ? 'play' : 'pause');
  }, [playing]);

  useEffect(() => {
    const iframe = frameRef.current;
    if (!iframe) return;

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== VIMEO_ORIGIN || event.source !== iframe.contentWindow) return;
      let data = event.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }
      if (data?.event === 'ready') {
        readyRef.current = true;
        vimeoCommand(iframe, 'setVolume', 0);
        vimeoCommand(iframe, 'addEventListener', 'timeupdate');
        if (wantPlay.current) vimeoCommand(iframe, 'play');
        return;
      }
      if (data?.event === 'timeupdate' || data?.event === 'playProgress') {
        const raw = Number(data.data?.percent);
        if (!Number.isFinite(raw)) return;
        setProgress(raw > 1 ? raw / 100 : raw);
      }
    };

    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
      vimeoCommand(iframe, 'pause');
    };
  }, []);

  const params = new URLSearchParams({
    badge: '0',
    autopause: '0',
    autoplay: '0',
    muted: '1',
    loop: media.loop === false ? '0' : '1',
    title: '0',
    byline: '0',
    portrait: '0',
    controls: '0',
  });

  return (
    <div ref={rootRef} className="process-card-video" data-playing={playing ? 'true' : 'false'}>
      <iframe
        ref={frameRef}
        src={`${VIMEO_ORIGIN}/video/${media.videoId}?${params.toString()}`}
        title={media.title}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        loading="lazy"
      />
      <VideoProgress value={progress} />
    </div>
  );
}

const FRAMEWORK_LAYERS = [
  { label: 'Discovery', src: '/adopt-a-school/process/framework/discovery.svg' },
  { label: 'Conversion', src: '/adopt-a-school/process/framework/conversion.svg' },
  { label: 'Relationship', src: '/adopt-a-school/process/framework/relationship.svg' },
  { label: 'Visibility', src: '/adopt-a-school/process/framework/visibility.svg' },
  { label: 'Amplification', src: '/adopt-a-school/process/framework/amplification.svg' },
] as const;

function FrameworkLayers() {
  return (
    <div className="adopt-framework">
      <ol>
        {FRAMEWORK_LAYERS.map((layer, index) => (
          <li key={layer.label}>
            <span className="adopt-framework__mark">
              <img src={layer.src} alt="" />
            </span>
            <p>
              <span>{index + 1}</span>
              {layer.label}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ProcessSlideMediaFill({
  media,
  priority,
}: {
  media: ProcessOverviewMedia;
  priority?: boolean;
}) {
  if (media.type === 'framework') {
    return <FrameworkLayers />;
  }
  if (media.type === 'diagram') {
    return (
      <motion.div
        layout
        className="absolute inset-0 min-h-0 overflow-hidden bg-[rgb(250,250,249)] p-1 md:p-2"
      >
        <AdoptSystemDiagram compact />
      </motion.div>
    );
  }
  if (media.type === 'embed') {
    return <CardVimeo media={media} />;
  }
  if (media.type === 'video') {
    return <CardFileVideo media={media} />;
  }
  return (
    <img
      src={media.src}
      alt={media.alt}
      className="absolute inset-0 h-full w-full object-cover object-center"
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
    />
  );
}
