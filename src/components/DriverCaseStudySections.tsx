import { useState } from 'react';
import { HoverPlayVimeo } from './AdoptSystemDesignOverview';
import { pipeline, prototypeDisplay, showcase, systemInsights, transformation } from '../content/driver';

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

/** Context → Insight → System shift, one card per insight, plus the coordinator's own words. */
export function DriverSystemInsights({ headingId }: { headingId: string }) {
  return (
    <div className="adopt-prose">
      <h2 id={headingId} className="adopt-context-heading mb-0 scroll-mt-6 text-balance">
        <HeadingLines lines={systemInsights.h2Lines} />
      </h2>

      <div className="driver-insight-grid">
        {systemInsights.cards.map((card) => (
          <article key={card.h3} className="driver-insight-card">
            <h3 className="adopt-alt-h3 driver-insight-card__title">
              <HeadingLines lines={card.h3Lines.length ? card.h3Lines : [card.h3]} />
            </h3>
            <dl className="driver-insight-card__rows">
              {card.rows.map((row) => (
                <div key={row.label}>
                  <dt className="adopt-meta-label">{row.label}</dt>
                  <dd className="adopt-body mb-0 text-pretty text-ink/82">{row.body}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>

      {systemInsights.quotes.items.length > 0 ? (
        <div className="driver-coordinator-quotes">
          <p className="adopt-meta-label driver-coordinator-quotes__label">
            {systemInsights.quotes.h3}
          </p>
          <div className="adopt-key-learnings-grid w-full">
            {systemInsights.quotes.items.map((quote) => (
              <div key={quote.label}>
                <p className="adopt-meta-label text-ink/55">{quote.label}</p>
                <p className="adopt-body mb-0 leading-[1.5] text-ink/72">“{quote.body}”</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** "Wednesday 12:00 PM" sits on its own line so Risk Horizon reads as the hinge. */
function HorizonLabel({ text }: { text: string }) {
  const split = text.match(/^(.*?12:00\s*PM)\s+(.+)$/i);
  if (!split) return <>{text}</>;
  return (
    <>
      <span className="driver-pipeline__horizon-time">{split[1]}</span>
      <span className="driver-pipeline__horizon-name">{split[2]}</span>
    </>
  );
}

/**
 * Week axis above the two stations. Monday–Wednesday and Thursday–Friday
 * bookend the track; Wednesday noon is the marker, not a third column.
 */
export function DriverDispatchPipeline({
  headingId,
  reducedMotion,
}: {
  headingId: string;
  reducedMotion: boolean;
}) {
  const [early, late] = pipeline.stations;

  return (
    <div className="adopt-prose">
      <h2 id={headingId} className="adopt-context-heading mb-0 scroll-mt-6 text-balance">
        <HeadingLines lines={pipeline.h2Lines} />
      </h2>
      {pipeline.lede ? (
        <p className="adopt-body mb-0 text-pretty text-ink/82">{pipeline.lede}</p>
      ) : null}

      <div className="driver-pipeline">
        <div className={`driver-pipeline__axis${reducedMotion ? ' is-still' : ''}`}>
          <div className="driver-pipeline__axis-days">
            {early?.window ? (
              <p className="adopt-meta-label driver-pipeline__axis-range">{early.window}</p>
            ) : null}
            {late?.window ? (
              <p className="adopt-meta-label driver-pipeline__axis-range driver-pipeline__axis-range--end">
                {late.window}
              </p>
            ) : null}
          </div>
          <div className="driver-pipeline__track" aria-hidden="true">
            <span className="driver-pipeline__track-line" />
            <span className="driver-pipeline__track-fill" />
            <span className="driver-pipeline__track-cap driver-pipeline__track-cap--start" />
            <span className="driver-pipeline__track-cap driver-pipeline__track-cap--end" />
            <span className="driver-pipeline__track-marker" />
            <span className="driver-pipeline__track-playhead" />
          </div>
          {pipeline.handoff ? (
            <p className="adopt-meta-label driver-pipeline__horizon">
              <HorizonLabel text={pipeline.handoff} />
            </p>
          ) : null}
        </div>

        <div className="driver-pipeline__stations">
          {pipeline.stations.map((station) => (
            <article key={station.label} className="driver-pipeline__station">
              <p className="adopt-meta-label mb-0">{station.label}</p>
              <h3 className="adopt-alt-h3 driver-pipeline__station-title">{station.title}</h3>
              <p className="adopt-body mb-0 text-pretty text-ink/82">{station.body}</p>
            </article>
          ))}
        </div>
      </div>
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
  // Touch taps toggle playback, so only one capture runs at a time.
  const [activeClip, setActiveClip] = useState<string | null>(
    reducedMotion ? null : prototypeDisplay.id,
  );

  return (
    <div className="adopt-prose">
      <h2 id={headingId} className="adopt-context-heading mb-0 scroll-mt-6 text-balance">
        <HeadingLines lines={showcase.h2Lines} />
      </h2>

      <div className="driver-prototype-display">
        <HoverPlayVimeo
          id={prototypeDisplay.id}
          title={prototypeDisplay.title}
          caption={prototypeDisplay.caption}
          aspect="landscape"
          reducedMotion={reducedMotion}
          autoPlay={!reducedMotion}
          active={activeClip === prototypeDisplay.id}
          onToggle={() =>
            setActiveClip((current) => (current === prototypeDisplay.id ? null : prototypeDisplay.id))
          }
          showCaption={false}
          loading="eager"
          className="driver-prototype-display__player"
        />
      </div>

      <div className="driver-showcase-grid driver-showcase-grid--three">
        {showcase.features.map((feature) => (
          <article key={feature.h3} className="driver-showcase-feature">
            <p className="adopt-meta-label driver-showcase-feature__title">{feature.h3}</p>
            <p className="adopt-body mb-0 text-pretty text-ink/82">{feature.body}</p>
          </article>
        ))}
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
              <th scope="row" className="driver-impact-table__dimension">
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
