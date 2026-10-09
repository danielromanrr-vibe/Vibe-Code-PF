import { Fragment, useEffect, useRef, useState } from 'react';
import { livePrototype, pipeline, showcase, systemInsights, transformation } from '../content/driver';
import { StationRsvpDiagram } from './DriverStationDiagrams';

const MAP_AID_PROTOTYPE = '/map-aid/prototype/index.html';

/** Quiet frame for a warehouse photo, or a window onto one Map-Aid scene. */
function DriverMediaSlot({
  label,
  aspect = 'screen',
  scene,
  active = true,
  reducedMotion = false,
}: {
  label: string;
  aspect?: 'screen' | 'photo' | 'square';
  scene?: string;
  active?: boolean;
  reducedMotion?: boolean;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const src = scene
    ? `${MAP_AID_PROTOTYPE}?scene=${scene}${reducedMotion ? '&still=1' : ''}`
    : undefined;

  useEffect(() => {
    if (!scene) return;
    frameRef.current?.contentWindow?.postMessage(
      { type: 'map-aid', action: active && !reducedMotion ? 'play' : 'pause' },
      window.location.origin,
    );
  }, [active, reducedMotion, scene]);

  return (
    <figure className={`driver-media-slot driver-media-slot--${aspect}`} data-scene={scene}>
      <div className="driver-media-slot__frame">
        {src ? (
          <iframe ref={frameRef} src={src} title={label} loading="lazy" />
        ) : (
          <span className="driver-media-slot__label">{label}</span>
        )}
      </div>
    </figure>
  );
}

/**
 * Square scenes of the Map-Aid prototype at /map-aid/prototype/?scene=
 * Order matches the phases in driver.md. The frame name is the object the square will show.
 */
const MAP_AID_FRAMES = [
  { scene: 'rsvp', label: 'RSVP meter' },
  { scene: 'disclosure', label: 'Cluster opening' },
  { scene: 'tiers', label: 'Proximity rings' },
  { scene: 'stack', label: 'Consequence card' },
  { scene: 'roster', label: 'Volunteer card' },
  { scene: 'manifest', label: 'Route sheet' },
] as const;

/** Two-line h2s break on desktop and wrap naturally on phones. */
function HeadingLines({ lines }: { lines: readonly string[] }) {
  return (
    <>
      {lines.map((line, index) => (
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
    </>
  );
}

/** Insight cards — eyebrow, H3, body, then a labeled research quote. */
export function DriverSystemInsights({ headingId }: { headingId: string }) {
  return (
    <div className="adopt-prose">
      <h2 id={headingId} className="adopt-context-heading mb-0 scroll-mt-6 text-balance">
        <HeadingLines lines={systemInsights.h2Lines} />
      </h2>

      <div className="driver-insight-grid">
        {systemInsights.cards.map((card) => (
          <article key={card.title} className="driver-insight-card">
            <div className="driver-insight-card__copy">
              {card.eyebrow ? (
                <p className="adopt-meta-label adopt-meta-label--bold">{card.eyebrow}</p>
              ) : null}
              <h3 className="adopt-alt-h3 driver-insight-card__title">{card.title}</h3>
              {card.body ? (
                <p className="adopt-body driver-insight-card__body mb-0 text-pretty">{card.body}</p>
              ) : null}
            </div>
            {card.quote ? (
              <footer className="driver-insight-card__cite">
                <p className="adopt-meta-label adopt-meta-label--bold">quote from research</p>
                <p className="adopt-body driver-insight-card__quote mb-0 text-pretty">“{card.quote}”</p>
              </footer>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}

/** Two-station cards. The week-axis timeline above them is gone. */
export function DriverDispatchPipeline({
  headingId,
  reducedMotion,
}: {
  headingId: string;
  reducedMotion: boolean;
}) {
  return (
    <div className="adopt-prose">
      <h2 id={headingId} className="adopt-context-heading mb-0 scroll-mt-6 text-balance">
        <HeadingLines lines={pipeline.h2Lines} />
      </h2>
      {pipeline.lede ? (
        <p className="adopt-body mb-0 text-pretty">{pipeline.lede}</p>
      ) : null}

      <div className="driver-pipeline">
        <div className="driver-pipeline__stations">
          {pipeline.stations.map((station, index) => (
            <Fragment key={station.label}>
              {index > 0 ? (
                <span className="driver-pipeline__stack-arrow" aria-hidden="true" />
              ) : null}
              <article className="driver-pipeline__station">
                {index === 0 ? (
                  <StationRsvpDiagram reducedMotion={reducedMotion} />
                ) : (
                  <figure className="driver-pipeline__station-photo">
                    <img
                      src="/map-aid/artifact-1.jpg"
                      alt="Color-coded warehouse loading slip on a clipboard, used at the dock to pack bags into a driver’s trunk."
                    />
                  </figure>
                )}
                <h3 className="adopt-alt-h3 driver-pipeline__station-title">{station.title}</h3>
                <p className="adopt-body mb-0 text-pretty">{station.body}</p>
              </article>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Full working Map-Aid desk — the wow beat after the two-station pipeline.
 * Loads App (no ?scene=), not the square object stage used in the lifecycle.
 */
export function DriverLivePrototype({ headingId }: { headingId: string }) {
  return (
    <div className="driver-live-prototype">
      <div className="adopt-prose">
        <h2 id={headingId} className="adopt-context-heading mb-0 scroll-mt-6 text-balance">
          <HeadingLines lines={livePrototype.h2Lines} />
        </h2>
        {livePrototype.lede ? (
          <p className="adopt-body mb-0 text-pretty text-ink/82">{livePrototype.lede}</p>
        ) : null}
      </div>

      <figure className="driver-live-prototype__stage">
        <iframe
          src={MAP_AID_PROTOTYPE}
          title={livePrototype.h2}
          loading="lazy"
          allow="fullscreen"
        />
      </figure>

      <p className="driver-live-prototype__open">
        <a href={MAP_AID_PROTOTYPE} target="_blank" rel="noreferrer">
          {livePrototype.openLabel}
        </a>
      </p>
    </div>
  );
}

export function DriverPrototypeShowcase({
  headingId,
  reducedMotion,
}: {
  headingId: string;
  reducedMotion: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState<string | null>(reducedMotion ? null : MAP_AID_FRAMES[0].scene);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;
    const rows = [...root.querySelectorAll<HTMLElement>('[data-scene]')];
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const scene = entry.target.getAttribute('data-scene');
          if (!scene) continue;
          if (entry.isIntersecting) visible.set(scene, entry.intersectionRatio);
          else visible.delete(scene);
        }
        const next = [...visible.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
        setActiveScene(next);
      },
      { root: root.closest('#driver-case-study-scroll'), threshold: [0.35, 0.6] },
    );
    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div className="adopt-prose">
      <h2 id={headingId} className="adopt-context-heading mb-0 scroll-mt-6 text-balance">
        <HeadingLines lines={showcase.h2Lines} />
      </h2>

      {showcase.lede ? (
        <p className="adopt-body mb-0 text-pretty text-ink/82">{showcase.lede}</p>
      ) : null}

      <div className="driver-lifecycle" ref={rootRef}>
        {showcase.phases.map((phase, index) => {
          const frame = MAP_AID_FRAMES[index];
          const number = String(index + 1).padStart(2, '0');
          return (
            <article key={phase.phase} className="driver-lifecycle__row" data-scene={frame?.scene}>
              <div className="driver-lifecycle__copy">
                <p className="adopt-meta-label driver-lifecycle__phase">
                  Phase {number}
                  <span aria-hidden="true"> · </span>
                  {phase.phase}
                </p>
                <h3 className="adopt-alt-h3 driver-lifecycle__title">{phase.title}</h3>
                {phase.body.map((paragraph) => (
                  <p key={paragraph} className="adopt-body mb-0 text-pretty text-ink/82">
                    {paragraph}
                  </p>
                ))}
                {phase.tokens.length > 0 ? (
                  <ul className="driver-lifecycle__tokens">
                    {phase.tokens.map((token) => (
                      <li key={token}>{token}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <DriverMediaSlot
                label={frame?.label ?? phase.title}
                aspect="square"
                scene={frame?.scene}
                active={frame?.scene === activeScene}
                reducedMotion={reducedMotion}
              />
            </article>
          );
        })}
      </div>
    </div>
  );
}

/** Before/after by operational dimension — a table on desktop, stacked cards on phones. */
export function DriverImpactTable({ headingId }: { headingId: string }) {
  return (
    <div className="adopt-prose">
      <h2 id={headingId} className="adopt-context-heading mb-0 scroll-mt-6 text-balance">
        <HeadingLines lines={transformation.h2Lines} />
      </h2>
      {transformation.lede ? (
        <p className="adopt-body mb-0 text-pretty text-ink/82">{transformation.lede}</p>
      ) : null}

      <table className="driver-impact-table">
        <thead>
          <tr>
            <th scope="col" className="adopt-meta-label">
              Operational dimension
            </th>
            <th scope="col" className="adopt-meta-label">
              Legacy process
            </th>
            <th scope="col" className="adopt-meta-label">
              Map-Aid system
            </th>
          </tr>
        </thead>
        <tbody>
          {transformation.rows.map((row) => (
            <tr key={row.dimension}>
              <th scope="row" className="adopt-meta-label driver-impact-table__dimension">
                {row.dimension}
              </th>
              <td data-label="Before" className="driver-impact-table__before">
                {row.before}
              </td>
              <td data-label="After" className="driver-impact-table__after">
                {row.after}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
