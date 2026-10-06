import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { SiteFooter } from './Footer';
import TopNavStrip, { type TopNavPage } from './TopNavStrip';
import AdoptCaseStudyParallax from './AdoptCaseStudyParallax';
import AdoptCaseStudySection from './AdoptCaseStudySection';
import { makeIntroBundle, makeIntroItem } from '../lib/editorialRevealMotion';
import { ATLAS_PRODUCT } from '../content/vhenyAtlas';
import { VHENY_WORK, type VhenyWorkKind } from '../content/vhenyDiamonds';
import { branding as vhenyBrandingCopy, product as vhenyProductCopy } from '../content/vheny';
import AtlasImpactSection from './AtlasImpactSection';
import AtlasVideoSections from './AtlasVideoSections';
import VhenyGrammarSection from './VhenyGrammarSection';
import PlayfulTitleField from './PlayfulTitleField';
import VhenyStartingPoint from './VhenyStartingPoint';
import VhenyPersonas from './VhenyPersonas';
import VhenyBenchmark from './VhenyBenchmark';

type VhenyWorkPageProps = {
  kind: VhenyWorkKind;
  reducedMotion: boolean;
  onHomeClick: () => void;
  onAboutClick: () => void;
  onVisualBrandingClick: () => void;
  onProductClick: () => void;
  onBack: () => void;
  backLabel: string;
};

export default function VhenyWorkPage({
  kind,
  reducedMotion,
  onHomeClick,
  onAboutClick,
  onVisualBrandingClick,
  onProductClick,
  onBack,
  backLabel,
}: VhenyWorkPageProps) {
  const pageCopy = kind === 'product' ? vhenyProductCopy : vhenyBrandingCopy;
  const media = kind === 'product' ? ATLAS_PRODUCT : VHENY_WORK.branding;
  const page: TopNavPage = kind === 'product' ? 'vheny-product' : 'vheny-branding';
  const headingId = `vheny-${kind}-heading`;
  const overviewId = `vheny-${kind}-overview`;
  const scopeId = `vheny-${kind}-scope`;
  const contextId = `vheny-${kind}-context`;
  const startingPointId = `vheny-${kind}-starting-point`;
  const personasId = `vheny-${kind}-personas`;
  const benchmarkId = `vheny-${kind}-benchmark`;
  const grammarId = `vheny-${kind}-grammar`;
  const impactId = `vheny-${kind}-impact`;
  const tensionId = `vheny-${kind}-tension`;
  const scrollRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [navSurface, setNavSurface] = useState<'default' | 'media'>('media');
  const [heroKey, setHeroKey] = useState(0);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    setNavSurface('media');
    setHeroKey((k) => k + 1);
    const scrollEl = scrollRef.current;
    const resetScroll = () => {
      if (scrollEl) scrollEl.scrollTop = 0;
    };
    resetScroll();
    requestAnimationFrame(() => {
      resetScroll();
      requestAnimationFrame(resetScroll);
    });
    const heroEl = heroRef.current;
    if (!scrollEl || !heroEl) return;

    const navThresholdPx = 52;
    const sync = () => {
      const { bottom } = heroEl.getBoundingClientRect();
      setNavSurface(bottom > navThresholdPx ? 'media' : 'default');
    };

    sync();
    scrollEl.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      scrollEl.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [kind]);

  return (
    <motion.div
      ref={scrollRef}
      id={`vheny-${kind}-scroll`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] flex flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain bg-bg"
      style={{ backgroundColor: '#F8F9FA' }}
    >
      <TopNavStrip
        page={page}
        mandalaAnchorId={`mandala-nav-vheny-${kind}`}
        onHomeClick={onHomeClick}
        onAboutClick={onAboutClick}
        onVisualBrandingClick={onVisualBrandingClick}
        onProductClick={onProductClick}
        backLabel={backLabel}
        onBack={onBack}
        surface={navSurface}
      />

      <main className="flex-1 pb-[200px]">
        <div className="adopt-case-study mx-auto w-full min-w-0 max-w-[min(100%,1180px)] px-5 pb-[3rem] pt-[calc(var(--site-header-height,2.75rem)+1.75rem)] sm:px-7 md:px-12 md:pb-[3.5rem] md:pt-[calc(var(--site-header-height,2.75rem)+2.25rem)] lg:px-14 lg:pt-[calc(var(--site-header-height,2.75rem)+2.75rem)]">
          <div className="adopt-case-study-acts">
            <motion.section
              key={heroKey}
              className="adopt-case-study-act adopt-case-study-act--hero min-w-0 scroll-mt-6"
              initial="hidden"
              animate="show"
              variants={makeIntroBundle(reducedMotion)}
            >
              <motion.div variants={makeIntroItem(reducedMotion)}>
                <AdoptCaseStudyParallax
                  scrollContainerRef={scrollRef}
                  reducedMotion={reducedMotion}
                  variant="lead"
                  className="adopt-case-study-act__parallax"
                >
                  <div
                    ref={heroRef}
                    className="adopt-case-study-hero-media w-full overflow-hidden rounded-2xl border border-ink/[0.09] shadow-[0_4px_32px_-8px_rgba(12,21,40,0.13)]"
                  >
                    <img
                      src={media.bannerSrc}
                      alt={media.bannerAlt}
                      className="h-full w-full object-cover object-center"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                </AdoptCaseStudyParallax>
              </motion.div>

              <motion.div variants={makeIntroItem(reducedMotion)}>
                <PlayfulTitleField
                  title={pageCopy.h1}
                  headingId={headingId}
                  className="mb-0 scroll-mt-6 text-left"
                  reducedMotion={reducedMotion}
                />
              </motion.div>
              <motion.p
                className="adopt-case-study-hero-lede adopt-body m-0 text-pretty"
                variants={makeIntroItem(reducedMotion)}
              >
                {pageCopy.lede}
              </motion.p>
            </motion.section>

            <AdoptCaseStudySection
              act="overview"
              scrollContainerRef={scrollRef}
              reducedMotion={reducedMotion}
              parallax="lead"
              aria-labelledby={overviewId}
            >
              <div className="adopt-overview">
                <h2 id={overviewId} className="adopt-context-heading scroll-mt-6">
                  {pageCopy.overview.h2}
                </h2>
                <dl className="adopt-overview__meta">
                  {pageCopy.overview.meta.map((field) => (
                    <div key={field.label}>
                      <dt className="adopt-meta-label">{field.label}</dt>
                      <dd className="adopt-body mb-0">{field.body}</dd>
                    </div>
                  ))}
                </dl>
                <div className="adopt-overview__cards">
                  <article>
                    <h3 className="adopt-meta-label">The Problem</h3>
                    <p className="adopt-body mb-0 text-pretty text-ink/88">{pageCopy.overview.problem}</p>
                  </article>
                  <article>
                    <h3 className="adopt-meta-label">The Solution</h3>
                    <p className="adopt-body mb-0 text-pretty text-ink/88">{pageCopy.overview.solution}</p>
                  </article>
                  <article>
                    <h3 className="adopt-meta-label">Key Impact</h3>
                    <p className="adopt-body mb-0 text-pretty text-ink/88">{pageCopy.overview.impact}</p>
                  </article>
                </div>
              </div>
            </AdoptCaseStudySection>

            {pageCopy.scope.body.length > 0 ? (
              <AdoptCaseStudySection
                act="scope"
                scrollContainerRef={scrollRef}
                reducedMotion={reducedMotion}
                parallax="lead"
                aria-labelledby={scopeId}
              >
                <div className="adopt-prose">
                  <h2 id={scopeId} className="adopt-context-heading scroll-mt-6">
                    {pageCopy.scope.h2}
                  </h2>
                  {pageCopy.scope.body.map((line) => (
                    <p key={line} className="adopt-body mb-0 text-pretty text-ink/82">
                      {line}
                    </p>
                  ))}
                </div>
              </AdoptCaseStudySection>
            ) : null}

            <AdoptCaseStudySection
              act="context"
              scrollContainerRef={scrollRef}
              reducedMotion={reducedMotion}
              parallax="lead"
              aria-labelledby={contextId}
            >
              <div className="adopt-prose">
                <h2 id={contextId} className="adopt-context-heading scroll-mt-6">
                  {pageCopy.context.h2}
                </h2>
                {pageCopy.context.body.map((line) => (
                  <p key={line} className="adopt-body mb-0 text-pretty text-ink/82">
                    {line}
                  </p>
                ))}
              </div>
              {pageCopy.startingPoint.body.length > 0 ||
              pageCopy.personas.people.length > 0 ||
              pageCopy.benchmark.body.length > 0 ||
              pageCopy.tension.body.length > 0 ? (
                <div className="vheny-context-subs">
                  {pageCopy.startingPoint.body.length > 0 ? (
                    <VhenyStartingPoint
                      headingId={startingPointId}
                      eyebrow={pageCopy.startingPoint.eyebrow}
                      title={pageCopy.startingPoint.h3}
                      body={pageCopy.startingPoint.body}
                      reducedMotion={reducedMotion}
                    />
                  ) : null}
                  {pageCopy.personas.people.length > 0 ? (
                    <VhenyPersonas
                      headingId={personasId}
                      eyebrow={pageCopy.personas.eyebrow}
                      title={pageCopy.personas.h3}
                      body={pageCopy.personas.body}
                      people={pageCopy.personas.people}
                    />
                  ) : null}
                  {pageCopy.benchmark.body.length > 0 ? (
                    <VhenyBenchmark
                      headingId={benchmarkId}
                      eyebrow={pageCopy.benchmark.eyebrow}
                      title={pageCopy.benchmark.h3}
                      body={pageCopy.benchmark.body}
                      legacy={pageCopy.benchmark.legacy}
                      vision={pageCopy.benchmark.vision}
                    />
                  ) : null}
                  {pageCopy.tension.body.length > 0 ? (
                    <div className="vheny-tension">
                      <h3 id={tensionId} className="adopt-alt-h3 m-0 scroll-mt-6 text-balance">
                        {pageCopy.tension.h3}
                      </h3>
                      {pageCopy.tension.body.map((line) => (
                        <p key={line} className="adopt-body mb-0 text-pretty text-ink/82">
                          {line}
                        </p>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </AdoptCaseStudySection>

            {kind === 'product' ? (
              <AdoptCaseStudySection
                act="grammar"
                scrollContainerRef={scrollRef}
                reducedMotion={reducedMotion}
                parallax="lead"
                aria-labelledby={grammarId}
              >
                <VhenyGrammarSection headingId={grammarId} />
              </AdoptCaseStudySection>
            ) : null}

            {kind === 'product' ? (
              <AdoptCaseStudySection
                act="atlas"
                scrollContainerRef={scrollRef}
                reducedMotion={reducedMotion}
                parallax={false}
                reveal={false}
              >
                <AtlasVideoSections reducedMotion={reducedMotion} />
              </AdoptCaseStudySection>
            ) : null}

            {kind === 'product' ? (
              <AdoptCaseStudySection
                act="impact"
                scrollContainerRef={scrollRef}
                reducedMotion={reducedMotion}
                parallax={false}
                reveal={false}
                aria-labelledby={impactId}
              >
                <AtlasImpactSection headingId={impactId} />
              </AdoptCaseStudySection>
            ) : null}
          </div>
        </div>
      </main>
      <SiteFooter />
    </motion.div>
  );
}
