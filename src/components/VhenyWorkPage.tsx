import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { SiteFooter } from './Footer';
import TopNavStrip, { type TopNavPage } from './TopNavStrip';
import AdoptCaseStudyParallax from './AdoptCaseStudyParallax';
import AdoptCaseStudySection from './AdoptCaseStudySection';
import CaseStudyOverviewStage from './CaseStudyOverviewStage';
import { ScopeIconMark, ScopeRailRow } from './ScopeReadMorePlus';
import { makeIntroBundle, makeIntroItem } from '../lib/editorialRevealMotion';
import { ATLAS_PRODUCT, ATLAS_SCOPE_ITEMS } from '../content/vhenyAtlas';
import { VHENY_METRICS, VHENY_WORK, vhenyScopeItems, type VhenyWorkKind } from '../content/vhenyDiamonds';
import AtlasVideoSections from './AtlasVideoSections';

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

const SCOPE_ICON_CLASS =
  'h-full w-full rounded-full object-cover object-center opacity-90';

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
  const work = kind === 'product' ? ATLAS_PRODUCT : VHENY_WORK.branding;
  const page: TopNavPage = kind === 'product' ? 'vheny-product' : 'vheny-branding';
  const headingId = `vheny-${kind}-heading`;
  const contextId = `vheny-${kind}-context`;
  const scrollRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [navSurface, setNavSurface] = useState<'default' | 'media'>('media');
  const [heroKey, setHeroKey] = useState(0);
  const scopeItems = kind === 'product' ? ATLAS_SCOPE_ITEMS : vhenyScopeItems(kind);
  const ledeParas = Array.isArray(work.lede) ? work.lede : [work.lede];

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
                      src={work.bannerSrc}
                      alt={work.bannerAlt}
                      className="h-full w-full object-cover object-center"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                </AdoptCaseStudyParallax>
              </motion.div>

              <motion.div
                className="flex flex-col items-center gap-2"
                variants={makeIntroItem(reducedMotion)}
              >
                {'eyebrow' in work && work.eyebrow ? (
                  <p className="adopt-meta-label mb-0">{work.eyebrow}</p>
                ) : null}
                <h1 id={headingId} className="mb-0 scroll-mt-6 text-balance text-center">
                  {work.title}
                </h1>
              </motion.div>
            </motion.section>

            <AdoptCaseStudySection
              act="context"
              scrollContainerRef={scrollRef}
              reducedMotion={reducedMotion}
              parallax="lead"
            >
              <CaseStudyOverviewStage
                scrollContainerRef={scrollRef}
                reducedMotion={reducedMotion}
                contextColumn={
                  <>
                    <h2 id={contextId} className="adopt-context-heading mb-1.5 scroll-mt-6 md:mb-2">
                      Context &amp; Intro
                    </h2>
                    {ledeParas.map((para) => (
                      <p key={para} className="adopt-intro-lede adopt-context-copy mb-0 text-pretty">
                        {para}
                      </p>
                    ))}
                    <aside className="adopt-meta-rail mt-7 md:mt-8" aria-label="Project metadata">
                      <dl className="adopt-meta">
                        {kind === 'product' ? (
                          <div>
                            <dt className="adopt-meta-label scroll-mt-4">Scope</dt>
                            <dd className="adopt-body mb-0 max-w-measure text-ink/65">{ATLAS_PRODUCT.scope}</dd>
                          </div>
                        ) : null}
                        <div>
                          <dt className="adopt-meta-label scroll-mt-4">Role</dt>
                          <dd className="adopt-body mb-0 max-w-measure">{work.role}</dd>
                        </div>
                        <div>
                          <dt className="adopt-meta-label scroll-mt-4">Client</dt>
                          <dd className="adopt-body mb-0 max-w-measure">{work.client}</dd>
                        </div>
                        <div>
                          <dt className="adopt-meta-label scroll-mt-4">Key insight</dt>
                          <dd className="adopt-body adopt-key-insight-lede mb-0 leading-[1.45] text-[var(--color-text-body-muted)] line-clamp-2">
                            {work.insight}
                          </dd>
                        </div>
                        <div>
                          <dt className="adopt-meta-label scroll-mt-4">Impact</dt>
                          <dd className="adopt-body mb-0 max-w-measure">
                            {work.impact.map((line) => (
                              <p key={line}>{line}</p>
                            ))}
                          </dd>
                        </div>
                      </dl>
                    </aside>
                  </>
                }
                scopeContent={
                  <div className="adopt-scope-rail w-full min-w-0" aria-label={`Scope — ${work.title}`}>
                    <div className="flex w-full min-w-0 flex-col gap-8 md:gap-10">
                      {scopeItems.map((item) => (
                        <ScopeRailRow
                          key={item.id}
                          eyebrow={item.eyebrow}
                          body={item.body}
                          mark={
                            <ScopeIconMark>
                              <img
                                src={item.imageSrc}
                                alt=""
                                className={SCOPE_ICON_CLASS}
                                loading="lazy"
                                decoding="async"
                              />
                            </ScopeIconMark>
                          }
                        />
                      ))}
                    </div>
                  </div>
                }
                metrics={VHENY_METRICS}
                metricsAriaLabel={work.metricsLabel}
              />
            </AdoptCaseStudySection>

            {kind === 'product' ? (
              <AdoptCaseStudySection
                act="atlas"
                scrollContainerRef={scrollRef}
                reducedMotion={reducedMotion}
                parallax={false}
                reveal={false}
              >
                <AtlasVideoSections />
              </AdoptCaseStudySection>
            ) : null}
          </div>
        </div>
      </main>
      <SiteFooter />
    </motion.div>
  );
}
