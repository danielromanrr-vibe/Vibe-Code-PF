import type { ReactNode } from 'react';
import type { AtlasGrammarPattern } from '../content/vhenyAtlas';

type VhenyPatternCardProps = {
  pattern: AtlasGrammarPattern;
};

function Diagram({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? 'vg-diagram vg-diagram--live vg-diagram--queue' : 'vg-diagram vg-diagram--live'}>
      {children}
      <p className="vg-sr">{label}</p>
    </div>
  );
}

function PlayHint() {
  return <p className="vg-playhint">Hover to play</p>;
}

function Progress() {
  return (
    <span className="vg-progress">
      <span className="vg-h vg-h--meter" />
    </span>
  );
}

const TICKET_SUBJECT =
  "Gia / BR / 50's 60's / VVS2 / FBrsGrsY / V strong / Nice / X / X / 30x30x30";

function SlotDiagram() {
  return (
    <Diagram
      label={`Hover builds a ticket from keybound choices. The finished subject is ${TICKET_SUBJECT}.`}
    >
      <div className="vg-loop vg-loop--ticket" aria-hidden>
        <div className="vg-ticket">
          <p className="vg-ticket__label">Subject</p>
          <p className="vg-ticket__line">
            <span className="vg-ticket__phase vg-h vg-h--t1">Gia</span>
            <span className="vg-ticket__phase vg-h vg-h--t2">Gia / BR / 50's 60's</span>
            <span className="vg-ticket__phase vg-h vg-h--t3">{TICKET_SUBJECT}</span>
          </p>
          <div className="vg-ticket__keys">
            <span className="vg-key vg-h vg-h--k1">
              <b>[1]</b> Gia
            </span>
            <span className="vg-key vg-h vg-h--k2">
              <b>[1]</b> BR
            </span>
            <span className="vg-key vg-h vg-h--k3">
              <b>[1]</b> 50's–60's
            </span>
            <span className="vg-key vg-h vg-h--k4">
              <b>[1]</b> VVS2
            </span>
          </div>
        </div>
        <PlayHint />
        <Progress />
      </div>
    </Diagram>
  );
}

function EyeRow({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  return (
    <div className="vg-module">
      <p className="vg-kicker">{name}</p>
      <div className="vg-row">
        <span className="vg-bar" />
        <span className="vg-eye vg-h vg-h--eye">Eye</span>
      </div>
      <div className="vg-reveal vg-h vg-h--reveal">
        <div>{children}</div>
      </div>
      <div className="vg-row">
        <span className="vg-bar" />
      </div>
    </div>
  );
}

function RevealDiagram() {
  return (
    <Diagram label="Hover opens the same Eye control on a contact and on stock. The contact shows a note and tags. Stock shows a sieve row with split and queue. The row below stays in place, then both close.">
      <div className="vg-loop vg-loop--reveal" aria-hidden>
        <div className="vg-pair">
          <EyeRow name="Contacts">
            <div className="vg-nested">
              <span className="vg-note">Note</span>
              <span className="vg-actions">
                <span>Gold</span>
                <span>Gem</span>
                <span>Manuf</span>
              </span>
            </div>
          </EyeRow>
          <EyeRow name="Stock">
            <div className="vg-nested">
              <span className="vg-bar is-short" />
              <span className="vg-actions">
                <span>Split ct</span>
                <span>Add to queue</span>
              </span>
            </div>
          </EyeRow>
        </div>
        <PlayHint />
        <Progress />
      </div>
    </Diagram>
  );
}

function ModeDiagram() {
  const filters = ['Lab', 'Shp', 'Carat', 'Clarity', 'Color', 'Fluo'];
  return (
    <Diagram label="Stock sheet. Diamond singles is selected. Diamond parcels, Lab singles, and Lab parcels are not. Filters underneath are Lab, shape, carat, clarity, color, and fluorescence. The rows stay still.">
      <div className="vg-stock" aria-hidden>
        <div className="vg-stock__top">
          <span className="vg-stock__toggles">
            <i />
            <i />
          </span>
          <span className="vg-stock__name">Stock</span>
          <span className="vg-stock__tabs">
            <span className="is-on">Diamond singles</span>
            <span>Diamond parcels</span>
            <span>Lab singles</span>
            <span>Lab parcels</span>
          </span>
        </div>
        <div className="vg-stock__filters">
          {filters.map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>
        <div className="vg-stock__rows">
          {Array.from({ length: 4 }, (_, row) => (
            <span key={row} className="vg-stock__row">
              <i />
              <b />
              <b />
              <b />
              <b />
            </span>
          ))}
        </div>
      </div>
    </Diagram>
  );
}

const SCHEMAS = [
  { id: 'bk', label: 'Invoices' },
  { id: 'st', label: 'Parcels' },
  { id: 'ac', label: 'Ledger' },
] as const;

function ProjectionDiagram() {
  return (
    <Diagram label="Hover cycles bookkeeping, stock, and accounting. Contact 01, Alpha Diamonds, stays selected.">
      <div className="vg-loop vg-loop--bind" aria-hidden>
        <div className="vg-bind">
          <div className="vg-bind__list">
            <span className="vg-bar" />
            <span className="vg-anchor">
              <span className="vg-bar is-selected" />
              <span className="vg-mono vg-anchor__name">01 · Alpha</span>
            </span>
            <span className="vg-bar" />
          </div>
          <div className="vg-bind__panel">
            <div className="vg-tabs">
              <span className="vg-tab vg-h vg-h--tab-bk">Bookkeeping</span>
              <span className="vg-tab vg-h vg-h--tab-st">Stock</span>
              <span className="vg-tab vg-h vg-h--tab-ac">Accounting</span>
            </div>
            <div className="vg-schemas">
              {SCHEMAS.map((item) => (
                <div key={item.id} className={`vg-schema vg-h vg-h--schema-${item.id}`}>
                  <span className="vg-mono">{item.label}</span>
                  <span className="vg-bar vg-bar--schema" />
                  <span className="vg-bar vg-bar--schema is-second" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <PlayHint />
        <Progress />
      </div>
    </Diagram>
  );
}

function QueueDiagram() {
  return (
    <Diagram
      wide
      label="Hover queues the sieve row. The parent outgoing line, the header count, and the checkout document update together, hold, then reset."
    >
      <div className="vg-loop vg-loop--queue" aria-hidden>
        <div className="vg-queue-stage">
          <p className="vg-kicker vg-countline">
            <span className="vg-h vg-h--count-idle">Queue · 0</span>
            <span className="vg-h vg-h--count-live vg-mono">Queue · 1 item</span>
          </p>
          <div className="vg-nodes">
            <span className="vg-nodes__item">
              <span className="vg-node vg-h vg-h--sieve">
                <span>Sieve</span>
                <strong className="vg-swap">
                  <span className="vg-h vg-h--add">Add</span>
                  <span className="vg-h vg-h--added">Added</span>
                </strong>
              </span>
            </span>
            <span className="vg-slots__arrow">→</span>
            <span className="vg-nodes__item">
              <span className="vg-node vg-h vg-h--parent">
                <span>Parent</span>
                <strong className="vg-swap">
                  <span className="vg-h vg-h--dash">—</span>
                  <span className="vg-h vg-h--out vg-mono">40 ct</span>
                </strong>
              </span>
            </span>
            <span className="vg-slots__arrow">→</span>
            <span className="vg-nodes__item">
              <span className="vg-node vg-h vg-h--badge">
                <span>Count</span>
                <strong className="vg-swap">
                  <span className="vg-h vg-h--zero">0</span>
                  <span className="vg-h vg-h--one vg-mono">1</span>
                </strong>
              </span>
            </span>
          </div>
          <span className="vg-action vg-h vg-h--qbtn">
            <span className="vg-h vg-h--addlabel">+ Add to queue</span>
            <span className="vg-h vg-h--addedlabel">Added</span>
          </span>
        </div>
        <div className="vg-doc vg-h vg-h--doc">
          <p className="vg-kicker">Checkout</p>
          <strong>Alpha</strong>
          <span className="vg-bar" />
          <span className="vg-bar is-short" />
          <span className="vg-doc__commit">Finish & add to BK</span>
        </div>
        <PlayHint />
        <Progress />
      </div>
    </Diagram>
  );
}

const DIAGRAMS = {
  slots: SlotDiagram,
  reveal: RevealDiagram,
  mode: ModeDiagram,
  projection: ProjectionDiagram,
  queue: QueueDiagram,
} as const;

export default function VhenyPatternCard({ pattern }: VhenyPatternCardProps) {
  const DiagramForPattern = DIAGRAMS[pattern.id];
  return (
    <article className="vheny-grammar-card">
      <div className="vheny-grammar-card__copy">
        <h3 className="adopt-alt-h3 vheny-grammar-card__title">{pattern.title}</h3>
        <p className="adopt-meta-label vheny-grammar-card__subtitle">{pattern.subtitle}</p>
        <p className="adopt-body vheny-grammar-card__rule mb-0 text-pretty">{pattern.rule}</p>
        {pattern.payloads ? (
          <ul className="vheny-grammar-card__payloads">
            {pattern.payloads.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
                {item.body}
              </li>
            ))}
          </ul>
        ) : null}
        <p className="vheny-grammar-card__benefit">
          <span>Impact</span>
          {pattern.benefit}
        </p>
      </div>
      <div className="vheny-grammar-card__stage">
        <DiagramForPattern />
      </div>
    </article>
  );
}
