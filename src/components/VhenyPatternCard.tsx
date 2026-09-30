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

function SlotFace({ name, token, step }: { name: string; token?: string; step: string }) {
  return (
    <span className={`vg-slots__item vg-h vg-h--slot-${step}`}>
      <span className="vg-slot">
        <span className="vg-ph">{name}</span>
        {token ? <span className="vg-tok vg-mono">{token}</span> : null}
      </span>
    </span>
  );
}

function SlotDiagram() {
  return (
    <Diagram label="Hover plays the slot sequence. Lab receives GIA, shape receives BR, carat receives 0.30–1.00, and the query compiles. Color stays open. The sequence then resets.">
      <div className="vg-loop vg-loop--slots" aria-hidden>
        <div className="vg-slots">
          <SlotFace name="Lab" token="GIA" step="lab" />
          <span className="vg-slots__arrow">→</span>
          <SlotFace name="Shape" token="BR" step="shape" />
          <span className="vg-slots__arrow">→</span>
          <SlotFace name="Carat" token="0.30–1.00" step="carat" />
          <span className="vg-slots__arrow">→</span>
          <SlotFace name="Color" step="color" />
        </div>
        <div className="vg-palettes">
          <div className="vg-palette vg-h vg-h--pal-lab">
            <span className="is-pick">GIA</span>
            <span>HRD</span>
            <span>IGI</span>
          </div>
          <div className="vg-palette vg-h vg-h--pal-shape">
            <span className="is-pick">BR</span>
            <span>OV</span>
            <span>PS</span>
          </div>
          <div className="vg-palette vg-h vg-h--pal-carat">
            <span className="is-pick">0.30–1.00</span>
            <span>1–2</span>
            <span>2–3</span>
          </div>
        </div>
        <div className="vg-status">
          <p className="vg-enter vg-h vg-h--enter">Press enter</p>
          <p className="vg-query vg-mono vg-h vg-h--query">GIA · BR · 0.30–1.00ct</p>
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
    <Diagram label="Hover opens the same Eye control on a contact and a parcel. The contact shows a note and tags. The parcel shows a sieve row with split and queue. The row below stays in place, then both close.">
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
          <EyeRow name="Parcels">
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
  return (
    <Diagram label="Hover cycles the same table through browse, adding to stock, and checkout. The header and row verbs change. The row stays in place.">
      <div className="vg-loop vg-loop--mode" aria-hidden>
        <div className="vg-mode">
          <p className="vg-modehead vg-h vg-h--head">
            <span className="vg-phase vg-phase--browse">Browse</span>
            <span className="vg-phase vg-phase--intake">Adding to stock</span>
            <span className="vg-phase vg-phase--checkout">Add items to checkout queue</span>
          </p>
          <div className="vg-row">
            <span className="vg-tick vg-h vg-h--tick" />
            <span className="vg-bar" />
            <span className="vg-cell vg-h vg-h--cell" />
            <span className="vg-verbstack">
              <span className="vg-verb vg-verb--view vg-h vg-h--view">View</span>
              <span className="vg-verb vg-verb--trade vg-h vg-h--trade">
                <span>Import</span>
                <span>Export</span>
              </span>
            </span>
          </div>
        </div>
        <PlayHint />
        <Progress />
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
