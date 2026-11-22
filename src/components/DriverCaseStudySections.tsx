import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { renderInlineBold } from './HomeCaseStudyCopy';
import { livePrototype, pipeline, systemInsights, transformation } from '../content/driver';
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
    const frame = frameRef.current;
    if (!scene || !frame) return;
    const send = () => {
      frame.contentWindow?.postMessage(
        { type: 'map-aid', action: active && !reducedMotion ? 'play' : 'pause' },
        window.location.origin,
      );
    };
    send();
    frame.addEventListener('load', send);
    return () => frame.removeEventListener('load', send);
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
 * Squares for each pillar row, in driver.md order.
 * The scenes themselves stay as they are.
 */
const PILLAR_FRAMES = [
  [
    { scene: 'rsvp', label: 'Automated RSVP' },
    { scene: 'manifest', label: 'The route sheet' },
  ],
  [{ scene: 'volunteer', label: 'Add volunteer' }],
  [
    { scene: 'disclosure', label: 'Progressive disclosure' },
    { scene: 'tiers', label: 'Proximity tiers' },
    { scene: 'stack', label: 'An added stop' },
  ],
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

/** Curly opening quote is wider than it is tall. Zilla’s own “ is two straight slabs. */
const QUOTE_MARK_ASPECT = 373 / 282;

/** The mark takes the hairline’s place: as tall as the quote and the name, up to 30% of the row. */
function DriverInsightQuote({ quote }: { quote: string }) {
  const citeRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const cite = citeRef.current;
    const copy = cite?.querySelector<HTMLElement>('.driver-insight-card__cite-copy');
    if (!cite || !copy) return;

    let frame = 0;
    const fit = () => {
      const citeW = cite.clientWidth;
      if (citeW < 1) return;
      const maxMark = citeW * 0.3;
      let markW = Number.parseFloat(cite.style.gridTemplateColumns) || 0;
      for (let pass = 0; pass < 8; pass += 1) {
        cite.style.gridTemplateColumns = `${markW}px minmax(0, 1fr)`;
        const next = Math.min(copy.getBoundingClientRect().height * QUOTE_MARK_ASPECT, maxMark);
        if (Math.abs(next - markW) < 0.5) {
          markW = next;
          break;
        }
        markW = next;
      }
      const columns = `${markW}px minmax(0, 1fr)`;
      if (cite.style.gridTemplateColumns !== columns) cite.style.gridTemplateColumns = columns;
    };

    fit();
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    });
    observer.observe(copy);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      cite.style.gridTemplateColumns = '';
    };
  }, [quote]);

  return (
    <footer ref={citeRef} className="driver-insight-card__cite">
      <svg className="driver-insight-card__mark" viewBox="39 0 373 282" aria-hidden="true" focusable="false">
        <path d="M105 282 Q89 282 74 276 Q60 271 49 260 Q44 244 42 226 Q39 207 39 188 Q39 145 56 110 Q74 74 106 46 Q138 19 182 0 L197 34 Q163 53 141 70 Q119 88 107 110 Q95 131 89 160 L83 136 L118 156 Q145 163 158 178 Q170 193 170 216 Q170 244 153 263 Q136 282 105 282 Z M320 282 Q304 282 290 276 Q275 271 264 260 Q259 244 256 226 Q254 207 254 188 Q254 145 272 110 Q289 74 321 46 Q353 19 397 0 L412 34 Q378 53 356 70 Q334 88 322 110 Q310 131 304 160 L298 136 L333 156 Q360 163 372 178 Q385 193 385 216 Q385 244 368 263 Q351 282 320 282 Z" />
      </svg>
      <div className="driver-insight-card__cite-copy">
        <p className="adopt-body driver-insight-card__quote mb-0 text-pretty">
          <span className="sr-only">“</span>
          {quote}”
        </p>
        <p className="adopt-body driver-insight-card__quote-by mb-0">- volunteer coordinator Sam Hoyt</p>
      </div>
    </footer>
  );
}

/** One tension per row. Title, body, then the research quote. */
export function DriverSystemInsights({ headingId }: { headingId: string }) {
  return (
    <div className="adopt-prose">
      <h2 id={headingId} className="adopt-context-heading mb-0 scroll-mt-6 text-balance">
        <HeadingLines lines={systemInsights.h2Lines} />
      </h2>
      {systemInsights.lede ? (
        <p className="adopt-body mb-0 text-pretty">{systemInsights.lede}</p>
      ) : null}

      <div className="driver-insight-grid">
        {systemInsights.cards.map((card) => (
          <article key={card.title} className="driver-insight-card">
            <div className="driver-insight-card__copy">
              <h3 className="adopt-alt-h3 driver-insight-card__title">{card.title}</h3>
              {card.body ? (
                <p className="adopt-body driver-insight-card__body mb-0 text-pretty">{card.body}</p>
              ) : null}
            </div>
            {card.quote ? <DriverInsightQuote quote={card.quote} /> : null}
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
      <div className="driver-section-head">
        {pipeline.eyebrow ? (
          <p className="adopt-meta-label driver-title-eyebrow">{pipeline.eyebrow}</p>
        ) : null}
        <h2 id={headingId} className="adopt-context-heading mb-0 scroll-mt-6 text-balance">
          <HeadingLines lines={pipeline.h2Lines} />
        </h2>
      </div>
      {pipeline.intro ? (
        <p className="adopt-body mb-0 text-pretty">{pipeline.intro}</p>
      ) : null}
      {pipeline.confirmLead ? (
        <ul className="driver-pipeline__confirm">
          <li>
            {pipeline.confirmLead}
            {pipeline.confirmPoints.length > 0 ? (
              <ol>
                {pipeline.confirmPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ol>
            ) : null}
          </li>
        </ul>
      ) : null}
      {pipeline.close ? (
        <p className="adopt-body mb-0 text-pretty">{pipeline.close}</p>
      ) : null}

      <div className="driver-pipeline">
        <div className="driver-pipeline__stations">
          {pipeline.stations.map((station, index) => (
            <Fragment key={station.label}>
              {index > 0 ? (
                <span className="driver-pipeline__stack-arrow" aria-hidden="true" />
              ) : null}
              <article className="driver-pipeline__station">
                <div className="driver-pipeline__media">
                  {index === 0 ? (
                    <StationRsvpDiagram reducedMotion={reducedMotion} />
                  ) : (
                    <figure className="driver-pipeline__station-photo">
                      <img
                        src="/map-aid/artifact-1.jpg"
                        alt="Printed slip from the Monday to Thursday cycle, the sheet drivers use when they arrive."
                      />
                    </figure>
                  )}
                </div>
                {station.captions.length > 0 ? (
                  <div className="driver-pipeline__caption">
                    {station.captions.map((line) => (
                      <p key={line} className="adopt-body mb-0 text-pretty">{line}</p>
                    ))}
                  </div>
                ) : null}
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
export function DriverLivePrototype({
  headingId,
  reducedMotion,
}: {
  headingId: string;
  reducedMotion: boolean;
}) {
  const stageRef = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || live) return;
    const onWheel = (event: WheelEvent) => {
      const scroller = document.getElementById('driver-case-study-scroll');
      if (!scroller) return;
      event.preventDefault();
      const line = 16;
      const delta =
        event.deltaMode === 1
          ? event.deltaY * line
          : event.deltaMode === 2
            ? event.deltaY * scroller.clientHeight
            : event.deltaY;
      scroller.scrollTop += delta;
    };
    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [live]);

  useEffect(() => {
    if (!live) return;
    const onDown = (event: PointerEvent) => {
      const stage = stageRef.current;
      if (!stage || !(event.target instanceof Node) || stage.contains(event.target)) return;
      setLive(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [live]);

  return (
    <div className="driver-live-prototype">
      <div className="adopt-prose">
        <div className="driver-section-head">
          {livePrototype.eyebrow ? (
            <p className="adopt-meta-label driver-title-eyebrow">{livePrototype.eyebrow}</p>
          ) : null}
          <h2 id={headingId} className="adopt-context-heading mb-0 scroll-mt-6 text-balance">
            <HeadingLines lines={livePrototype.h2Lines} />
          </h2>
        </div>
      </div>

      <figure
        ref={stageRef}
        className={`driver-live-prototype__stage${live ? ' is-live' : ''}`}
        onPointerLeave={(event) => {
          if (event.pointerType === 'touch') return;
          setLive(false);
        }}
      >
        <iframe
          src={MAP_AID_PROTOTYPE}
          title={livePrototype.h2}
          loading="lazy"
          allow="fullscreen"
        />
        {live ? null : (
          <button type="button" className="driver-live-prototype__lock" onClick={() => setLive(true)}>
            <span className="adopt-meta-label">Click to explore the map</span>
          </button>
        )}
      </figure>

      <DriverPrototypeShowcase reducedMotion={reducedMotion} />
    </div>
  );
}

function DriverPrototypeShowcase({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visibleScenes, setVisibleScenes] = useState<ReadonlySet<string>>(() => new Set());

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
        const next = new Set(visible.keys());
        setVisibleScenes((current) => {
          if (current.size === next.size && [...next].every((scene) => current.has(scene))) return current;
          return next;
        });
      },
      { root: root.closest('#driver-case-study-scroll'), threshold: [0.2, 0.5] },
    );
    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div className="driver-components">
      <h3 id="driver-components-heading" className="adopt-alt-h3 driver-components__title">
        {livePrototype.componentsTitle}
      </h3>
      <div className="driver-lifecycle" ref={rootRef}>
        {livePrototype.pillars.map((pillar, index) => {
          const frames = PILLAR_FRAMES[index] ?? [];
          return (
            <article key={pillar.title} className="driver-lifecycle__row">
              <div className="driver-lifecycle__copy">
                <h4 className="driver-live-scope__title">{pillar.title}</h4>
                {pillar.points.length > 0 ? (
                  <ul className="driver-live-scope__points">
                    {pillar.points.map((point) => (
                      <li key={point}>{renderInlineBold(point)}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <div className="driver-lifecycle__frames">
                {frames.map((frame) => (
                  <DriverMediaSlot
                    key={frame.scene}
                    label={frame.label}
                    aspect="square"
                    scene={frame.scene}
                    active={visibleScenes.has(frame.scene)}
                    reducedMotion={reducedMotion}
                  />
                ))}
              </div>
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
