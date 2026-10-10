import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Eye, MessageSquare, Plus, Smartphone } from 'lucide-react';
import type { AdoptConstraintCard, AdoptConstraintSection } from '../content/adopt';
import { openAdoptProcessChapter } from './AdoptProcessOverview';

const MODEL_ICONS = {
  Motivation: Eye,
  Prompt: MessageSquare,
  Ability: Smartphone,
} as const;

function renderMarks(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|https?:\/\/\S+)/g);
  return parts.map((part, index) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={index}>{bold[1]}</strong>;
    const italic = part.match(/^\*([^*]+)\*$/);
    if (italic) return <i key={index}>{italic[1]}</i>;
    if (/^https?:\/\//.test(part)) {
      return (
        <a key={index} href={part} target="_blank" rel="noreferrer">
          {part}
        </a>
      );
    }
    return part;
  });
}

function modelItem(line: string) {
  const match = line.match(/^(Motivation|Prompt|Ability)\s*\|\s*(.+)$/);
  if (!match) return null;
  const label = match[1] as keyof typeof MODEL_ICONS;
  return { label, body: match[2]!, Icon: MODEL_ICONS[label] };
}

function eyebrowLabel(heading: string) {
  return heading.replace(/^the\s+/i, '');
}

function ModalSection({ section }: { section: AdoptConstraintSection }) {
  const model = section.heading.toLowerCase() === 'behavior model';
  const items = model ? section.body.map(modelItem).filter((item) => item !== null) : [];
  const prose = model ? section.body.filter((line) => !modelItem(line)) : section.body;
  const cite = prose.filter((paragraph) => paragraph.startsWith('Fogg,'));
  const lead = model ? prose.filter((paragraph) => !paragraph.startsWith('Fogg,')) : prose;

  return (
    <section className="adopt-constraint-modal__section">
      <p className="adopt-meta-label adopt-constraint-modal__label">{eyebrowLabel(section.heading)}</p>
      {lead.map((paragraph) => (
        <p key={paragraph} className="adopt-body mb-0 text-pretty">
          {renderMarks(paragraph)}
        </p>
      ))}
      {model && items.length > 0 ? (
        <ul className="adopt-constraint-modal__model">
          {items.map((item) => (
            <li key={item.label}>
              <item.Icon strokeWidth={1.75} aria-hidden />
              <div>
                <p className="adopt-meta-label adopt-constraint-modal__model-label">{item.label}</p>
                <p className="adopt-body mb-0">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
      {cite.map((paragraph) => (
        <p key={paragraph} className="adopt-body adopt-constraint-modal__cite mb-0 text-pretty">
          {renderMarks(paragraph)}
        </p>
      ))}
    </section>
  );
}

type AdoptConstraintBentoProps = {
  heading: string;
  headingId?: string;
  cards: readonly AdoptConstraintCard[];
  reducedMotion?: boolean;
};

export default function AdoptConstraintBento({
  heading,
  headingId = 'adopt-constraints-heading',
  cards,
  reducedMotion = false,
}: AdoptConstraintBentoProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const openCard = cards.find((card) => card.id === openId) ?? null;

  useEffect(() => {
    if (!openCard) return;
    const scroller = document.getElementById('adopt-case-study-scroll');
    const previous = scroller?.style.overflow ?? '';
    if (scroller) scroller.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenId(null);
        return;
      }
      if (event.key !== 'Tab') return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const nodes = [
        ...dialog.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])'),
      ].filter((node) => !node.hasAttribute('disabled'));
      if (nodes.length === 0) return;
      const first = nodes[0]!;
      const last = nodes[nodes.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      if (scroller) scroller.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
      if (restoreFocus.current) {
        document.getElementById(`adopt-constraint-plus-${openCard.id}`)?.focus();
      }
      restoreFocus.current = true;
    };
  }, [openCard]);

  function close() {
    setOpenId(null);
  }

  function onLearnMore(card: AdoptConstraintCard) {
    if (!card.learnMore) return;
    restoreFocus.current = false;
    setOpenId(null);
    openAdoptProcessChapter(card.learnMore.chapterId, card.learnMore.page);
  }

  return (
    <div className={`adopt-constraint-bento${reducedMotion ? ' is-still' : ''}`}>
      <h2 id={headingId} className="adopt-context-heading adopt-constraint-bento__title text-balance">
        {heading}
      </h2>
      <div className="adopt-constraint-bento__grid" role="list">
        {cards.map((card) => {
          const open = openId === card.id;
          return (
            <article
              key={card.id}
              role="listitem"
              className={`adopt-constraint-bento__card${open ? ' is-open' : ''}`}
            >
              <h3 className="adopt-alt-h3 adopt-constraint-bento__heading">{card.title}</h3>
              {card.supporting ? (
                <p className="adopt-body adopt-constraint-bento__supporting mb-0 text-pretty">
                  {card.supporting}
                </p>
              ) : null}
              <button
                id={`adopt-constraint-plus-${card.id}`}
                type="button"
                className="adopt-constraint-bento__plus"
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-label={open ? `Close ${card.title}` : `Read ${card.title}`}
                onClick={() => setOpenId(open ? null : card.id)}
              >
                <Plus size={18} strokeWidth={1.75} aria-hidden />
              </button>
            </article>
          );
        })}
      </div>
      {openCard
        ? createPortal(
            <div className="adopt-constraint-modal" role="presentation" onClick={close}>
              <div
                ref={dialogRef}
                className="adopt-constraint-modal__panel modal-scroll"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  ref={closeRef}
                  type="button"
                  className="adopt-meta-label adopt-constraint-modal__close"
                  onClick={close}
                >
                  Close
                </button>
                <h3 id={titleId} className="adopt-constraint-modal__title">
                  {openCard.title}
                </h3>
                {openCard.sections.map((section) => (
                  <ModalSection key={section.heading} section={section} />
                ))}
                {openCard.learnMore ? (
                  <button
                    type="button"
                    className="adopt-constraint-modal__more"
                    onClick={() => onLearnMore(openCard)}
                  >
                    Learn more
                  </button>
                ) : null}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
