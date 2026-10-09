import { useEffect, useRef, useState } from 'react';
import AdoptSystemDiagram from './AdoptSystemDiagram';
import { endToEnd as adoptEndToEnd, strategic, system as adoptSystem } from '../content/adopt';

export const SYSTEM_DESIGN_OVERVIEW_LEDE = adoptSystem.lede;

const VIMEO_ORIGIN = 'https://player.vimeo.com';

function vimeoCommand(iframe: HTMLIFrameElement | null, method: string, value?: unknown) {
  if (!iframe?.contentWindow) return;
  iframe.contentWindow.postMessage(
    JSON.stringify(value === undefined ? { method } : { method, value }),
    VIMEO_ORIGIN,
  );
}

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px), (hover: none), (pointer: coarse)');
    const sync = () => setCoarse(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return coarse;
}

export function HoverPlayVimeo({
  id,
  title,
  caption,
  reducedMotion,
  aspect = 'portrait',
  active = false,
  onToggle,
  autoPlay = false,
  showCaption = true,
  loading = 'lazy',
  className = '',
}: {
  id: string;
  title: string;
  caption: string;
  reducedMotion: boolean;
  aspect?: 'portrait' | 'landscape';
  active?: boolean;
  onToggle?: () => void;
  /** Play muted on ready. Desktop hover no longer gates playback. */
  autoPlay?: boolean;
  showCaption?: boolean;
  loading?: 'lazy' | 'eager';
  className?: string;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const readyRef = useRef(false);
  const wantPlayRef = useRef(false);
  const [hovering, setHovering] = useState(false);
  const coarse = useCoarsePointer();
  const playing = reducedMotion ? false : coarse ? active : autoPlay || hovering;
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
    if (reducedMotion) return;
    wantPlayRef.current = true;
    setHovering(true);
    if (readyRef.current) sendPlay();
  };

  const pause = () => {
    wantPlayRef.current = false;
    setHovering(false);
    vimeoCommand(frameRef.current, 'pause');
  };

  useEffect(() => {
    if (!autoPlay || reducedMotion) return;
    wantPlayRef.current = true;
    if (readyRef.current) sendPlay();
  }, [autoPlay, reducedMotion]);

  useEffect(() => {
    if (!coarse) return;
    if (active && !reducedMotion) {
      wantPlayRef.current = true;
      if (readyRef.current) sendPlay();
      return;
    }
    wantPlayRef.current = false;
    vimeoCommand(frameRef.current, 'pause');
  }, [active, coarse, reducedMotion]);

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
        aspect === 'landscape' ? 'adopt-end-to-end-flow__clip--landscape' : '',
        reducedMotion ? 'is-static' : '',
        playing ? 'is-playing' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className="adopt-end-to-end-flow__frame"
        role={coarse ? 'button' : undefined}
        tabIndex={coarse ? 0 : undefined}
        aria-pressed={coarse ? playing : undefined}
        aria-label={coarse ? `${playing ? 'Pause' : 'Play'} ${caption}` : undefined}
        onPointerEnter={coarse || autoPlay ? undefined : play}
        onPointerLeave={coarse || autoPlay ? undefined : pause}
        onClick={coarse && !reducedMotion ? onToggle : undefined}
        onKeyDown={
          coarse && !reducedMotion
            ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onToggle?.();
                }
              }
            : undefined
        }
      >
        <iframe
          ref={frameRef}
          src={`${VIMEO_ORIGIN}/video/${id}?${params.toString()}`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          loading={loading}
        />
        <span className="adopt-end-to-end-flow__hover-hit" aria-hidden />
      </div>
      {showCaption ? (
        <figcaption className="adopt-meta-label adopt-end-to-end-flow__caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

const SYSTEM_OVERVIEW_PHOTO = {
  src: '/adopt-a-school/system-square-hero.jpg',
  alt: 'Phone showing the Adopt-a-School pledge step for John Stafford High School, resting on a laptop.',
};

const SYSTEM_PAIR_PHOTO = {
  src: '/adopt-a-school/system-design-overview.jpg',
  alt: 'Hand holding a phone to scan the SCAN ME QR tag on the red apple counter display.',
};

type OverviewProps = {
  headingId?: string;
};

export default function AdoptSystemDesignOverview({
  headingId = 'adopt-page-system-diagram-heading',
}: OverviewProps) {
  return (
    <div className="adopt-system-design-overview w-full min-w-0">
      <div className="adopt-system-design-overview__intro">
        <header className="adopt-system-design-overview__head adopt-prose">
          <h2 id={headingId} className="adopt-context-heading text-balance">
            {adoptSystem.h2Lines.map((line, index) => (
              <span key={line}>
                {index > 0 ? (
                  <>
                    {' '}
                    <br className="adopt-title-break" />
                  </>
                ) : null}
                {line}
              </span>
            ))}
          </h2>
          <p className="adopt-body mb-0 text-pretty text-ink/82">
            {SYSTEM_DESIGN_OVERVIEW_LEDE}
          </p>
          {adoptSystem.body.map((paragraph) => (
            <p key={paragraph} className="adopt-body mb-0 text-pretty text-ink/82">
              {paragraph}
            </p>
          ))}
        </header>
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
      </div>

      <div className="adopt-system-design-overview__columns">
        <div className="adopt-system-design-overview__media-row">
          <figure className="adopt-system-design-overview__photo min-h-0 min-w-0">
            <div className="adopt-system-design-overview__square-cell adopt-system-design-overview__photo-frame overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-18px_rgba(12,21,40,0.12)]">
              <img
                src={SYSTEM_PAIR_PHOTO.src}
                alt={SYSTEM_PAIR_PHOTO.alt}
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

      {adoptSystem.wins.cards.length > 0 ? (
        <div className="adopt-system-design-overview__wins">
          <h3 className="adopt-context-heading scroll-mt-6">{adoptSystem.wins.h3}</h3>
          <div className="adopt-overview__cards adopt-overview__cards--wins">
            {adoptSystem.wins.cards.map((card) => (
              <article key={card.eyebrow}>
                <p className="adopt-meta-label adopt-meta-label--bold">{card.eyebrow}</p>
                {card.body.split('\n\n').map((paragraph) => (
                  <p key={paragraph} className="adopt-body adopt-overview__card-copy mb-0 text-pretty">
                    {paragraph}
                  </p>
                ))}
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {strategic.principle.heading ? (
        <div className="adopt-system-design-overview__principle">
          <p className="adopt-meta-label adopt-meta-label--bold">{strategic.principle.eyebrow}</p>
          <h3 className="adopt-alt-h3 scroll-mt-6">{strategic.principle.heading}</h3>
          {strategic.principle.body.map((paragraph) => (
            <p key={paragraph} className="adopt-body mb-0 text-pretty text-ink/82">
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

type FlowProps = {
  headingId?: string;
  reducedMotion?: boolean;
};

/** Own case-study act — physical gateway, digital experience, then enrollment media. */
export function AdoptEndToEndFlow({
  headingId = 'adopt-end-to-end-flow-heading',
  reducedMotion = false,
}: FlowProps) {
  const [activeClip, setActiveClip] = useState<string | null>(null);
  const toggleClip = (id: string) => {
    setActiveClip((current) => (current === id ? null : id));
  };

  return (
    <div className="adopt-end-to-end-flow w-full min-w-0">
      <div className="adopt-end-to-end-flow__physical">
        <div className="adopt-end-to-end-flow__physical-copy">
          <h2 id={headingId} className="adopt-context-heading text-balance">
            {adoptEndToEnd.h2Lines.map((line, index) => (
              <span key={line}>
                {index > 0 ? (
                  <>
                    {' '}
                    <br className="adopt-title-break" />
                  </>
                ) : null}
                {line}
              </span>
            ))}
          </h2>
          {adoptEndToEnd.body.map((paragraph) => (
            <p key={paragraph} className="adopt-body adopt-end-to-end-flow__lede mb-0 text-pretty text-ink/82">
              {paragraph}
            </p>
          ))}
          <hr className="adopt-end-to-end-flow__rule" />
          <div className="adopt-end-to-end-flow__cards">
            <article>
              <p className="adopt-meta-label adopt-meta-label--bold">
                {adoptEndToEnd.physical.h3}
              </p>
              {adoptEndToEnd.physical.body.map((paragraph) => (
                <p key={paragraph} className="adopt-body adopt-overview__card-copy mb-0 text-pretty">
                  {paragraph}
                </p>
              ))}
            </article>
            <article>
              <p className="adopt-meta-label adopt-meta-label--bold">
                {adoptEndToEnd.digital.h3}
              </p>
              {adoptEndToEnd.digital.body.map((paragraph) => (
                <p key={paragraph} className="adopt-body adopt-overview__card-copy mb-0 text-pretty">
                  {paragraph}
                </p>
              ))}
            </article>
          </div>
        </div>
        <figure className="adopt-end-to-end-flow__physical-photo">
          <img
            src={adoptEndToEnd.physical.photo.src}
            alt={adoptEndToEnd.physical.photo.alt}
            className="h-full w-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
        </figure>
      </div>

      <div className="adopt-end-to-end-flow__digital">
        <div className="adopt-end-to-end-flow__banner adopt-end-to-end-flow__banner--celebrate adopt-case-study-hero-media overflow-hidden rounded-2xl">
          <img
            src={adoptEndToEnd.mockup.src}
            alt={adoptEndToEnd.mockup.alt}
            className="h-full w-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="adopt-end-to-end-flow__stage">
          <div className="adopt-end-to-end-flow__rail" role="list" aria-label="Enrollment flow clips">
            {adoptEndToEnd.clips.map((clip) => (
              <div key={clip.id} role="listitem">
                <HoverPlayVimeo
                  id={clip.id}
                  title={clip.title}
                  caption={clip.caption}
                  reducedMotion={reducedMotion}
                  active={activeClip === clip.id}
                  onToggle={() => toggleClip(clip.id)}
                />
              </div>
            ))}
          </div>
          <HoverPlayVimeo
            id={adoptEndToEnd.desktopClip.id}
            title={adoptEndToEnd.desktopClip.title}
            caption={adoptEndToEnd.desktopClip.caption}
            reducedMotion={reducedMotion}
            aspect="landscape"
            active={activeClip === adoptEndToEnd.desktopClip.id}
            onToggle={() => toggleClip(adoptEndToEnd.desktopClip.id)}
          />
        </div>
      </div>
    </div>
  );
}
