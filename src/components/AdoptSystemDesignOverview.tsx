import { useEffect, useRef, useState } from 'react';
import AdoptSystemDiagram from './AdoptSystemDiagram';
import systemDesignOverviewImg from '../assets/adopt/system-design-overview.png';
import { endToEnd as adoptEndToEnd, system as adoptSystem } from '../content/adopt';

export const SYSTEM_DESIGN_OVERVIEW_LEDE = adoptSystem.lede;

const VIMEO_ORIGIN = 'https://player.vimeo.com';

function vimeoCommand(iframe: HTMLIFrameElement | null, method: string, value?: unknown) {
  if (!iframe?.contentWindow) return;
  iframe.contentWindow.postMessage(
    JSON.stringify(value === undefined ? { method } : { method, value }),
    VIMEO_ORIGIN,
  );
}

function HoverPlayVimeo({
  id,
  title,
  caption,
  reducedMotion,
}: {
  id: string;
  title: string;
  caption: string;
  reducedMotion: boolean;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const readyRef = useRef(false);
  const wantPlayRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const params = new URLSearchParams({
    badge: '0',
    autopause: '0',
    autoplay: '0',
    title: '0',
    byline: '0',
    portrait: '0',
    controls: '0',
    muted: '1',
    loop: '1',
  });

  const sendPlay = () => {
    if (reducedMotion) return;
    const iframe = frameRef.current;
    vimeoCommand(iframe, 'setVolume', 0);
    vimeoCommand(iframe, 'play');
  };

  const play = () => {
    wantPlayRef.current = true;
    if (!reducedMotion) setPlaying(true);
    if (readyRef.current) sendPlay();
  };

  const pause = () => {
    wantPlayRef.current = false;
    setPlaying(false);
    vimeoCommand(frameRef.current, 'pause');
  };

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
      if (data?.event !== 'ready') return;
      readyRef.current = true;
      vimeoCommand(iframe, 'setVolume', 0);
      if (wantPlayRef.current) sendPlay();
    };

    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
      vimeoCommand(iframe, 'pause');
    };
  }, [reducedMotion]);

  return (
    <figure
      className={[
        'adopt-end-to-end-flow__clip',
        reducedMotion ? 'is-static' : '',
        playing ? 'is-playing' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className="adopt-end-to-end-flow__frame"
        onPointerEnter={play}
        onPointerLeave={pause}
      >
        <iframe
          ref={frameRef}
          src={`${VIMEO_ORIGIN}/video/${id}?${params.toString()}`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
        />
        <span className="adopt-end-to-end-flow__hover-hit" aria-hidden />
      </div>
      <figcaption className="adopt-meta-label adopt-end-to-end-flow__caption text-ink/65">{caption}</figcaption>
    </figure>
  );
}

const SYSTEM_OVERVIEW_PHOTO = {
  src: systemDesignOverviewImg,
  alt: 'Physical adoption object with QR entry beside the mobile enrollment onboarding flow—one service ecosystem.',
};

type OverviewProps = {
  headingId?: string;
};

export default function AdoptSystemDesignOverview({
  headingId = 'adopt-page-system-diagram-heading',
}: OverviewProps) {
  return (
    <div className="adopt-system-design-overview w-full min-w-0">
      <header className="adopt-system-design-overview__head mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <h2 id={headingId} className="adopt-context-heading mx-auto max-w-[28ch] text-balance">
          {adoptSystem.h2}
        </h2>
        <p className="adopt-body mx-auto mb-0 max-w-[44ch] text-pretty text-ink/82">
          {SYSTEM_DESIGN_OVERVIEW_LEDE}
        </p>
      </header>

      <div className="adopt-system-design-overview__columns">
        <div className="adopt-system-design-overview__media-row">
          <figure className="adopt-system-design-overview__photo min-h-0 min-w-0">
            <div className="adopt-system-design-overview__square-cell adopt-system-design-overview__photo-frame overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-18px_rgba(12,21,40,0.12)]">
              <img
                src={SYSTEM_OVERVIEW_PHOTO.src}
                alt={SYSTEM_OVERVIEW_PHOTO.alt}
                className="h-full w-full object-cover object-center"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>
          </figure>

          <div className="adopt-system-design-overview__diagram-media min-h-0 min-w-0">
            <div className="adopt-system-design-overview__square-cell adopt-system-diagram-frame overflow-hidden rounded-2xl border border-ink/10 bg-[rgb(250,250,249)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-18px_rgba(12,21,40,0.12)]">
              <div className="absolute inset-0 p-2 sm:p-3">
                <AdoptSystemDiagram compact quietVisuals pointerInteractive={false} />
              </div>
            </div>
          </div>
        </div>

        <div className="adopt-system-design-overview__meta-row">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[length:var(--text-body)] text-ink/72">
            <span className="inline-flex items-center gap-2">
              <span className="legend-dot legend-dot--red" />
              Patrons or clients
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="legend-dot legend-dot--blue" />
              Volunteers
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="legend-dot legend-dot--green" />
              Ongoing support loop
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

type FlowProps = {
  headingId?: string;
  reducedMotion?: boolean;
};

/** Own case-study act — portrait enrollment clips, play on hover. */
export function AdoptEndToEndFlow({
  headingId = 'adopt-end-to-end-flow-heading',
  reducedMotion = false,
}: FlowProps) {
  return (
    <div className="adopt-end-to-end-flow w-full min-w-0">
      <div className="adopt-end-to-end-flow__layout">
        <div className="adopt-end-to-end-flow__copy">
          <h2 id={headingId} className="adopt-context-heading">
            {adoptEndToEnd.h2}
          </h2>
          {adoptEndToEnd.body.map((paragraph) => (
            <p key={paragraph} className="adopt-body mb-0 max-w-measure text-pretty text-ink/82">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="adopt-end-to-end-flow__media editorial-bleed-trailing">
          <div className="adopt-end-to-end-flow__rail" role="list" aria-label="Enrollment flow clips">
            {adoptEndToEnd.clips.map((clip) => (
              <div key={clip.id} role="listitem">
                <HoverPlayVimeo
                  id={clip.id}
                  title={clip.title}
                  caption={clip.caption}
                  reducedMotion={reducedMotion}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
