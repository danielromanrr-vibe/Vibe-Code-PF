import { useEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import AdoptSystemDiagram from './AdoptSystemDiagram';
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
  playback = 'hover',
  onProgress,
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
  /** `auto` plays on its own. `still` stays on the first frame. */
  playback?: 'hover' | 'auto' | 'still';
  onProgress?: (value: number) => void;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const readyRef = useRef(false);
  const wantPlayRef = useRef(false);
  const [hovering, setHovering] = useState(false);
  const [progress, setProgress] = useState(0);
  const coarse = useCoarsePointer();
  const still = playback === 'still';
  const playsOnReady = playback === 'auto' || autoPlay;
  const playing = still || reducedMotion ? false : playsOnReady || (coarse ? active : hovering);
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
    if (!playsOnReady || reducedMotion || still) return;
    wantPlayRef.current = true;
    if (readyRef.current) sendPlay();
  }, [playsOnReady, reducedMotion, still]);

  useEffect(() => {
    if (!coarse || playsOnReady || still) return;
    if (active && !reducedMotion) {
      wantPlayRef.current = true;
      if (readyRef.current) sendPlay();
      return;
    }
    wantPlayRef.current = false;
    vimeoCommand(frameRef.current, 'pause');
  }, [active, coarse, playsOnReady, reducedMotion, still]);

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
      if (data?.event !== 'ready') {
        if (aspect !== 'portrait' && !onProgress) return;
        if (data?.event !== 'timeupdate' && data?.event !== 'playProgress') return;
        const raw = Number(data.data?.percent);
        if (!Number.isFinite(raw)) return;
        const value = raw > 1 ? raw / 100 : raw;
        setProgress(value);
        onProgress?.(value);
        return;
      }
      readyRef.current = true;
      vimeoCommand(iframe, 'setVolume', 0);
      if (aspect === 'portrait' || onProgress) vimeoCommand(iframe, 'addEventListener', 'timeupdate');
      if (wantPlayRef.current) sendPlay();
    };

    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
      vimeoCommand(iframe, 'pause');
    };
  }, [aspect, onProgress, reducedMotion]);

  return (
    <figure
      className={[
        'adopt-end-to-end-flow__clip',
        aspect === 'landscape' ? 'adopt-end-to-end-flow__clip--landscape' : '',
        reducedMotion ? 'is-static' : '',
        still ? 'is-dimmed' : '',
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
        onPointerEnter={coarse || playsOnReady || still ? undefined : play}
        onPointerLeave={coarse || playsOnReady || still ? undefined : pause}
        onClick={coarse && !reducedMotion && !still ? onToggle : undefined}
        onKeyDown={
          coarse && !reducedMotion && !still
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
      {aspect === 'portrait' && playing ? (
        <div
          className="adopt-phone-flows__bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          aria-label={`${caption} progress`}
        >
          <span style={{ transform: `scaleX(${Math.min(1, Math.max(0, progress))})` }} />
        </div>
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
          <p className="adopt-system-design-overview__lede adopt-body mb-0 text-pretty text-ink/82">
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
                <ul className="adopt-overview__card-points">
                  {card.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
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
        <div className="adopt-phone-flows">
          <h3 className="adopt-alt-h3">User flows from onboarding to commitment</h3>
          <div className="adopt-end-to-end-flow__rail" role="list" aria-label="Enrollment flow clips">
            {adoptEndToEnd.clips.map((clip, index) => (
              <div key={clip.id} role="listitem">
                <HoverPlayVimeo
                  id={clip.id}
                  title={clip.title}
                  caption={clip.caption}
                  reducedMotion={reducedMotion}
                  playback={index === 0 ? 'auto' : 'still'}
                  active={activeClip === clip.id}
                  onToggle={() => toggleClip(clip.id)}
                />
              </div>
            ))}
          </div>
        </div>
          {adoptEndToEnd.signup.h3 ? (
            <section className="adopt-signup-flow" aria-labelledby="adopt-signup-flow-heading">
              <div className="adopt-signup-flow__intro">
                <h3 id="adopt-signup-flow-heading" className="adopt-alt-h3">
                  {adoptEndToEnd.signup.h3}
                </h3>
                {adoptEndToEnd.signup.close ? (
                  <p className="adopt-body adopt-signup-flow__close mb-0 text-pretty text-ink/82">
                    {adoptEndToEnd.signup.close}
                  </p>
                ) : null}
              </div>
              {adoptEndToEnd.signup.rows.map((row) => (
                <div key={row.label} className="adopt-signup-flow__row">
                  <p className="adopt-meta-label adopt-meta-label--bold">{row.label}</p>
                  <ol className="adopt-signup-flow__steps">
                    {row.steps.map((step, index) => (
                      <li key={step}>
                        {index > 0 ? (
                          <ChevronRight className="adopt-signup-flow__arrow" strokeWidth={2} aria-hidden />
                        ) : null}
                        <span className="adopt-signup-flow__step">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </section>
          ) : null}
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
