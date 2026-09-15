import type { VisualContextIntro as VisualContextIntroData } from '../content/visualDesign';

type VisualContextIntroProps = {
  intro: VisualContextIntroData;
  headingId: string;
};

/**
 * Single-column Context & Intro for visual work pages — editorial text on page gray,
 * centered on the same spine as titles and media (no floating card plate).
 */
export default function VisualContextIntro({ intro, headingId }: VisualContextIntroProps) {
  return (
    <div className="visual-context-intro">
      <h2 id={headingId} className="adopt-context-heading visual-context-intro__title scroll-mt-6 text-center">
        Context &amp; Intro
      </h2>

      <aside className="visual-context-intro__rail" aria-label="Project metadata">
        <dl className="adopt-meta visual-context-intro__fields">
          <div className="visual-context-intro__field">
            <dt className="adopt-meta-label">My role</dt>
            <dd className="adopt-body mb-0 max-w-measure">{intro.role}</dd>
          </div>

          <div className="visual-context-intro__field">
            <dt className="adopt-meta-label">Impact highlights</dt>
            <dd className="adopt-body mb-0 max-w-measure">
              <ul className="visual-context-intro__list visual-context-intro__impact">
                {intro.impactHighlights.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </dd>
          </div>

          <div className="visual-context-intro__field">
            <dt className="adopt-meta-label">Scope</dt>
            <dd className="adopt-body mb-0 max-w-measure">
              <ol className="visual-context-intro__list visual-context-intro__scope">
                {intro.scopeItems.map((item, index) => (
                  <li key={item}>
                    <span className="visual-context-intro__scope-index" aria-hidden>
                      {index + 1})
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </dd>
          </div>

          <div className="visual-context-intro__field">
            <dt className="adopt-meta-label">Skills</dt>
            <dd className="adopt-body mb-0 max-w-measure">{intro.skills}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
