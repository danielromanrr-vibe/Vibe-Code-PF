import {
  THINKING_THROUGH_DESIGN_FRAGMENTS,
  THINKING_THROUGH_DESIGN_LEDE,
  type ThinkingFragment,
  type ThinkingLedeSegment,
  type ThinkingRefAction,
} from '../content/thinkingThroughDesign';

export type ThinkingThroughDesignActions = {
  onOpenAdopt?: () => void;
  onOpenDriver?: () => void;
  onOpenAi?: () => void;
  onOpenTouchpoints?: () => void;
};

function runRefAction(action: ThinkingRefAction, handlers: ThinkingThroughDesignActions) {
  switch (action.type) {
    case 'open-adopt':
      handlers.onOpenAdopt?.();
      break;
    case 'open-driver':
      handlers.onOpenDriver?.();
      break;
    case 'open-ai':
      handlers.onOpenAi?.();
      break;
    case 'open-touchpoints':
      handlers.onOpenTouchpoints?.();
      break;
    default:
      break;
  }
}

function ThinkingRefLink({
  label,
  action,
  handlers,
}: {
  label: string;
  action: ThinkingRefAction;
  handlers: ThinkingThroughDesignActions;
}) {
  return (
    <button
      type="button"
      className="thinking-ref"
      onClick={() => runRefAction(action, handlers)}
    >
      {label}
    </button>
  );
}

function renderBody(segments: readonly ThinkingLedeSegment[], handlers: ThinkingThroughDesignActions) {
  return segments.map((segment, i) => {
    if (segment.kind === 'text') return <span key={i}>{segment.value}</span>;
    if (segment.kind === 'emphasis') {
      return (
        <span key={i} className="thinking-essay-emphasis">
          {segment.value}
        </span>
      );
    }
    return (
      <ThinkingRefLink key={i} label={segment.label} action={segment.action} handlers={handlers} />
    );
  });
}

function ThoughtFragment({
  fragment,
  handlers,
}: {
  fragment: ThinkingFragment;
  handlers: ThinkingThroughDesignActions;
}) {
  return (
    <article className="thinking-essay-fragment">
      <div className="thinking-essay-fragment__inner">
        <h3 className="thinking-essay-fragment__title">{fragment.title}</h3>
        <p className="thinking-essay-fragment__body">{renderBody(fragment.body, handlers)}</p>
      </div>
    </article>
  );
}

export default function ThinkingThroughDesignSection(handlers: ThinkingThroughDesignActions) {
  return (
    <div className="thinking-essay mx-auto w-full min-w-0 max-w-[1180px]">
      <header className="thinking-essay__head">
        <h2
          id="thinking-through-design-heading"
          className="thinking-essay__title mb-0 max-w-[22ch] text-balance leading-[1.06] text-ink/90"
        >
          Thinking through design
        </h2>
        <p className="thinking-essay__lede">{THINKING_THROUGH_DESIGN_LEDE}</p>
      </header>

      <div className="thinking-essay__fragments">
        {THINKING_THROUGH_DESIGN_FRAGMENTS.map((fragment) => (
          <ThoughtFragment key={fragment.id} fragment={fragment} handlers={handlers} />
        ))}
      </div>
    </div>
  );
}
