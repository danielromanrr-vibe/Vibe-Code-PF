import { type RefObject } from 'react';
import AdoptFloatingIntroCard from './AdoptFloatingIntroCard';
import type { VisualContextIntro as VisualContextIntroData } from '../content/visualDesign';

type VisualContextIntroProps = {
  intro: VisualContextIntroData;
  headingId: string;
  scrollContainerRef: RefObject<HTMLElement | null>;
  reducedMotion?: boolean;
};

/**
 * Single-column Context & Intro for visual work pages.
 * Same floating-card chrome as case studies; one column instead of diptych.
 * Vertical rhythm uses proximity: label↔body tight, list peers closer, fields farther.
 */
export default function VisualContextIntro({
  intro,
  headingId,
  scrollContainerRef,
  reducedMotion = false,
}: VisualContextIntroProps) {
  return (
    <div className="adopt-intro-grid adopt-intro-stage adopt-intro-stage--solo visual-context-intro relative mb-0 mt-0 min-w-0 md:mt-1">
      <AdoptFloatingIntroCard scrollContainerRef={scrollContainerRef} reducedMotion={reducedMotion}>
        <div className="adopt-case-study-stage-shell flex min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-2xl">
          <div className="adopt-intro-col-left adopt-intro-col-left--solo min-h-0 min-w-0">
            <div className="adopt-intro-col-pad px-4 text-left sm:px-5 md:px-5 lg:px-6">
              <h2 id={headingId} className="adopt-context-heading visual-context-intro__title scroll-mt-6">
                Context &amp; Intro
              </h2>

              <aside className="adopt-meta-rail visual-context-intro__rail" aria-label="Project metadata">
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
          </div>
        </div>
      </AdoptFloatingIntroCard>
    </div>
  );
}
