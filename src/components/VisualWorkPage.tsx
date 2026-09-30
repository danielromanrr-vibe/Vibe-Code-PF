import { useEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SiteFooter } from './Footer';
import TopNavStrip from './TopNavStrip';
import AdoptCaseStudySection from './AdoptCaseStudySection';
import AdoptCaseStudyParallax from './AdoptCaseStudyParallax';
import VisualContextIntro from './VisualContextIntro';
import ProjectCarousel, { type ProjectCarouselSlide } from './ProjectCarousel';
import OwnershipSidebar, { type OwnershipEntry } from './OwnershipSidebar';
import { useActiveSection } from '../hooks/useActiveSection';
import { makeIntroBundle, makeIntroItem } from '../lib/editorialRevealMotion';
import {
  VISUAL_WORK,
  VISUAL_WORK_PATH_PREFIX,
  type VisualMediaItem,
  type VisualMediaRow,
  type VisualRoutedKind,
  type VisualVimeoEmbed,
  type VisualLearnMore,
  type VisualWorkSection,
  type VisualWorkSubsection,
} from '../content/visualDesign';

type VisualWorkPageProps = {
  kind: VisualRoutedKind;
  reducedMotion: boolean;
  onHomeClick: () => void;
  onAboutClick: () => void;
  onVisualBrandingClick: () => void;
  onProductClick: () => void;
  /** Optional parent callback — page always navigates to the visual landing URL. */
  onBackToVisual?: () => void;
};

export default function VisualWorkPage({
  kind,
  reducedMotion,
  onHomeClick,
  onAboutClick,
  onVisualBrandingClick,
  onProductClick,
  onBackToVisual,
}: VisualWorkPageProps) {
  const work = VISUAL_WORK[kind];
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [heroKey, setHeroKey] = useState(0);
  const titleId = `visual-work-${kind}-title`;
  const contextId = `visual-work-${kind}-context`;
  const gallery = work.gallery ?? [];
  const sections = work.sections ?? [];
  const ownershipEntries: OwnershipEntry[] = sections.flatMap((section, index) => {
    const subs = section.subsections ?? [];
    const entries: OwnershipEntry[] = [];
    if (section.ownership) {
      entries.push({ id: `visual-own-${index}`, ...section.ownership });
    }
    subs.forEach((sub, subIndex) => {
      if (sub.ownership) {
        entries.push({ id: `visual-own-${index}-${subIndex}`, ...sub.ownership });
      }
    });
    return entries;
  });
  const showOwnership = ownershipEntries.length > 0;
  const activeOwnershipId = useActiveSection(scrollRef, showOwnership);

  const backToVisualLanding = () => {
    onBackToVisual?.();
    if (window.location.pathname !== VISUAL_WORK_PATH_PREFIX) {
      navigate(VISUAL_WORK_PATH_PREFIX);
    }
  };

  useEffect(() => {
    setHeroKey((k) => k + 1);
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const hash = location.hash.replace(/^#/, '');
    let ignoreScroll = false;
    let cancelled = false;

    const align = () => {
      if (cancelled) return;
      const target = hash ? scrollEl.querySelector(`#${CSS.escape(hash)}`) : null;
      ignoreScroll = true;
      if (target instanceof HTMLElement) {
        const nav = scrollEl.querySelector('.top-nav-strip');
        const navHeight = nav instanceof HTMLElement ? nav.getBoundingClientRect().height : 44;
        const rootRect = scrollEl.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const top = scrollEl.scrollTop + (targetRect.top - rootRect.top) - navHeight - 16;
        scrollEl.scrollTop = Math.max(0, top);
      } else {
        scrollEl.scrollTop = 0;
      }
      requestAnimationFrame(() => {
        ignoreScroll = false;
      });
    };

    const onScroll = () => {
      if (!ignoreScroll) cancelled = true;
    };

    align();
    scrollEl.addEventListener('scroll', onScroll, { passive: true });
    const frame = requestAnimationFrame(() => {
      align();
      requestAnimationFrame(align);
    });
    const timers = hash ? [180, 500, 1100].map((ms) => window.setTimeout(align, ms)) : [];

    return () => {
      cancelAnimationFrame(frame);
      timers.forEach((id) => window.clearTimeout(id));
      scrollEl.removeEventListener('scroll', onScroll);
    };
  }, [kind, location.hash]);

  return (
    <motion.div
      ref={scrollRef}
      id="visual-work-scroll"
      className="fixed inset-0 z-[200] flex flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain bg-bg"
      style={{ backgroundColor: '#F8F9FA' }}
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reducedMotion ? undefined : { opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <TopNavStrip
        page="visual-work"
        crumbLabel={work.navLabel}
        backLabel="Visual design"
        onBack={backToVisualLanding}
        mandalaAnchorId={`mandala-nav-visual-${kind}`}
        onHomeClick={onHomeClick}
        onAboutClick={onAboutClick}
        onVisualBrandingClick={onVisualBrandingClick}
        onProductClick={onProductClick}
        surface="default"
      />

      <main
        className={showOwnership ? 'visual-work-owned flex-1 pb-[200px]' : 'flex-1 pb-[200px]'}
        aria-labelledby={titleId}
      >
        {showOwnership ? (
          <OwnershipSidebar entries={ownershipEntries} activeId={activeOwnershipId} />
        ) : null}
        <div className="adopt-case-study visual-work-page visual-work-page__lead mx-auto w-full min-w-0 max-w-[min(100%,1180px)] px-5 sm:px-7 md:px-12 lg:px-14">
          <div className="adopt-case-study-acts">
            <motion.section
              key={heroKey}
              className="adopt-case-study-act adopt-case-study-act--hero min-w-0 scroll-mt-6"
              initial="hidden"
              animate="show"
              variants={makeIntroBundle(reducedMotion)}
            >
              <motion.div
                className="flex flex-col items-center gap-2"
                variants={makeIntroItem(reducedMotion)}
              >
                {kind === 'dbs' ? null : <p className="adopt-meta-label mb-0">{work.client}</p>}
                <h1 id={titleId} className="visual-work-page__title mb-0 scroll-mt-6 text-balance text-center">
                  {work.titleLines ? (
                    <>
                      <span className="block">{work.titleLines[0]}</span>
                      <span className="block">{work.titleLines[1]}</span>
                    </>
                  ) : (
                    work.title
                  )}
                </h1>
              </motion.div>
            </motion.section>
          </div>
        </div>

        {work.bannerSrc ? (
          <motion.div
            key={`banner-${heroKey}`}
            className="visual-work-banner-wrap mx-auto w-full min-w-0 max-w-[min(100%,1180px)] px-5 sm:px-7 md:px-12 lg:px-14"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <AdoptCaseStudyParallax
              scrollContainerRef={scrollRef}
              reducedMotion={reducedMotion}
              variant="lead"
              className="adopt-case-study-act__parallax"
            >
              <div className="visual-work-banner">
                <img
                  src={work.bannerSrc}
                  alt={work.bannerAlt ?? ''}
                  className="visual-work-banner__img"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </AdoptCaseStudyParallax>
          </motion.div>
        ) : null}

        <div className="adopt-case-study visual-work-page visual-work-page__body mx-auto w-full min-w-0 max-w-[min(100%,1180px)] px-5 pb-[3rem] sm:px-7 md:px-12 md:pb-[3.5rem] lg:px-14">
          <div className="adopt-case-study-acts">
            <AdoptCaseStudySection
              act="context"
              scrollContainerRef={scrollRef}
              reducedMotion={reducedMotion}
              parallax="lead"
              showSeparator={Boolean(work.bannerSrc)}
            >
              <VisualContextIntro
                intro={work.intro}
                headingId={contextId}
                scrollContainerRef={scrollRef}
                reducedMotion={reducedMotion}
              />
            </AdoptCaseStudySection>

            {gallery.length > 0 ? (
              <AdoptCaseStudySection
                act="visual-gallery"
                scrollContainerRef={scrollRef}
                reducedMotion={reducedMotion}
                parallax="body"
                aria-label={`${work.title} gallery`}
              >
                <VisualMediaStack items={gallery} />
              </AdoptCaseStudySection>
            ) : null}

            {sections.map((section, index) => (
              <VisualNarrativeSection
                key={`${section.heading}-${index}`}
                section={section}
                index={index}
                scrollContainerRef={scrollRef}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </motion.div>
  );
}

function embedsToCarouselSlides(embeds: readonly VisualVimeoEmbed[]): ProjectCarouselSlide[] {
  return embeds.map((embed) => ({
    vimeoId: embed.id,
    vimeoHash: embed.hash,
    alt: embed.title,
    caption: embed.title,
  }));
}

function mediaToCarouselSlides(items: readonly VisualMediaItem[]): ProjectCarouselSlide[] {
  return items.map((item) => ({
    image: item.src,
    alt: item.alt,
    caption: item.label,
    objectFit: 'contain',
    aspectRatio: item.aspectRatio,
  }));
}

function VisualMediaRows({ rows }: { rows: readonly VisualMediaRow[] }) {
  return (
    <div className="visual-work-media-rows visual-work-composition">
      {rows.map((row, rowIndex) => (
        <ul
          key={`row-${rowIndex}`}
          className={[
            'visual-work-media-row',
            row.items.length === 1 ? 'visual-work-media-row--span' : '',
            row.flex.some((n) => n !== row.flex[0]) ? 'visual-work-media-row--mixed' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{
            ['--visual-row-cols' as string]: row.flex.map((n) => `${n}fr`).join(' '),
          }}
        >
          {row.items.map((item) => (
            <li
              key={item.src}
              className={
                item.focus
                  ? 'visual-work-media__item visual-work-media__item--focus'
                  : 'visual-work-media__item'
              }
              style={item.focus ? { aspectRatio: item.focus } : undefined}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="visual-work-media__img"
                style={item.maxWidth ? { maxWidth: item.maxWidth } : undefined}
                loading="lazy"
                decoding="async"
              />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

function VisualImageCarousel({
  items,
  projectKey,
  ariaLabel,
  reducedMotion,
}: {
  items: readonly VisualMediaItem[];
  projectKey: string;
  ariaLabel: string;
  reducedMotion: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <div className="visual-work-embed-carousel visual-work-carousel">
      <ProjectCarousel
        projectKey={projectKey}
        slides={mediaToCarouselSlides(items)}
        ariaLabel={ariaLabel}
        reducedMotion={reducedMotion}
        layout="featuredFixed"
        fullWidthSlides
        surface="plain"
        autoplay={false}
      />
    </div>
  );
}

function VisualLearnMore({ notes, title }: { notes: VisualLearnMore; title: string }) {
  const label = notes.label ?? 'Learn more';
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const scroller = document.getElementById('visual-work-scroll');
    const previous = scroller?.style.overflow ?? '';
    if (scroller) scroller.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      if (scroller) scroller.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="visual-work-learn-more"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        {label}
      </button>
      {open
        ? createPortal(
            <div className="visual-notes-modal" role="presentation" onClick={() => setOpen(false)}>
              <div
                className="visual-notes-modal__panel"
                role="dialog"
                aria-modal="true"
                aria-label={notes.label ?? title}
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  ref={closeRef}
                  type="button"
                  className="visual-work-learn-more visual-notes-modal__close"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
                <div className="visual-notes-modal__pages">
                  {notes.images.map((image) => (
                    <img key={image.src} src={image.src} alt={image.alt} />
                  ))}
                  {notes.link ? (
                    <Link className="visual-notes-modal__link" to={notes.link.href}>
                      {notes.link.label}
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function VisualSubsectionBlock({
  subsection,
  sectionIndex,
  subIndex,
  reducedMotion,
  nested = false,
}: {
  subsection: VisualWorkSubsection;
  sectionIndex: number;
  subIndex: number;
  reducedMotion: boolean;
  nested?: boolean;
}) {
  const headingId = nested
    ? `visual-section-${sectionIndex}-sub-${subIndex}-nested`
    : `visual-section-${sectionIndex}-sub-${subIndex}`;
  const heading = subsection.heading?.trim();
  const media = subsection.media ?? [];
  const rows = subsection.mediaRows ?? [];
  const carousel = subsection.carousel ?? [];
  const nestedSubs = subsection.subsections ?? [];
  const body = subsection.body?.trim();
  const layout = subsection.mediaLayout ?? (rows.length > 0 ? 'rows' : 'stack');
  const HeadingTag = nested ? 'h4' : 'h3';

  return (
    <div className="visual-work-subsection" {...(heading ? { 'aria-labelledby': headingId } : {})}>
      {heading ? (
        <HeadingTag
          id={headingId}
          className="adopt-alt-h3 visual-work-subsection__title scroll-mt-6 text-balance"
          {...(subsection.ownership ? { 'data-ownership-id': `visual-own-${sectionIndex}-${subIndex}` } : {})}
        >
          {heading}
        </HeadingTag>
      ) : null}
      {subsection.lead ? (
        <img
          src={subsection.lead.src}
          alt={subsection.lead.alt}
          className="visual-work-media__img"
          loading="lazy"
          decoding="async"
        />
      ) : null}
      {body ? <p className="adopt-body visual-work-section__body mb-0 max-w-measure text-pretty">{body}</p> : null}
      {media.length > 0 ? (
        <VisualMediaStack items={media} layout={layout === 'grid' && rows.length === 0 ? 'grid' : 'stack'} />
      ) : null}
      {rows.length > 0 ? <VisualMediaRows rows={rows} /> : null}
      {carousel.length > 0 ? (
        <VisualImageCarousel
          items={carousel}
          projectKey={`visual-carousel-${sectionIndex}-${subIndex}${nested ? '-n' : ''}`}
          ariaLabel={`${heading ?? 'Gallery'}`}
          reducedMotion={reducedMotion}
        />
      ) : null}
      {subsection.learnMore ? <VisualLearnMore notes={subsection.learnMore} title={heading ?? 'Notes'} /> : null}
      {nestedSubs.length > 0 ? (
        <div className="visual-work-subsections visual-work-subsections--nested">
          {nestedSubs.map((sub, nestedIndex) => (
            <VisualSubsectionBlock
              key={`${sub.heading ?? 'group'}-${nestedIndex}`}
              subsection={sub}
              sectionIndex={sectionIndex}
              subIndex={subIndex * 10 + nestedIndex}
              reducedMotion={reducedMotion}
              nested
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function VisualNarrativeSection({
  section,
  index,
  scrollContainerRef,
  reducedMotion,
}: {
  section: VisualWorkSection;
  index: number;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  reducedMotion: boolean;
}) {
  const headingId = section.id ?? `visual-section-${index}`;
  const media = section.media ?? [];
  const rows = section.mediaRows ?? [];
  const captioned = section.captionedMedia ?? [];
  const embeds = section.embeds ?? [];
  const carousel = section.carousel ?? [];
  const subsections = section.subsections ?? [];
  const body = section.body?.trim();
  const layout = section.mediaLayout ?? (rows.length > 0 ? 'rows' : 'stack');

  return (
    <AdoptCaseStudySection
      act="visual-narrative"
      scrollContainerRef={scrollContainerRef}
      reducedMotion={reducedMotion}
      parallax="body"
      aria-labelledby={headingId}
    >
      <div className="visual-work-section">
        <h2
          id={headingId}
          className="adopt-context-heading visual-work-section__title scroll-mt-6 text-balance whitespace-pre-line"
          {...(section.ownership ? { 'data-ownership-id': `visual-own-${index}` } : {})}
        >
          {section.heading}
        </h2>

        {body ? <p className="adopt-body visual-work-section__body mb-0 max-w-measure text-pretty">{body}</p> : null}

        {media.length > 0 ? (
          <VisualMediaStack items={media} layout={layout === 'grid' && rows.length === 0 ? 'grid' : 'stack'} />
        ) : null}

        {section.learnMore ? <VisualLearnMore notes={section.learnMore} title={section.heading} /> : null}

        {layout === 'rows' && rows.length > 0 ? <VisualMediaRows rows={rows} /> : null}

        {carousel.length > 0 ? (
          <VisualImageCarousel
            items={carousel}
            projectKey={`visual-carousel-${index}`}
            ariaLabel={`${section.heading} gallery`}
            reducedMotion={reducedMotion}
          />
        ) : null}

        {embeds.length > 0 ? (
          <div className="visual-work-embed-carousel visual-work-carousel">
            <ProjectCarousel
              projectKey={`visual-embeds-${index}`}
              slides={embedsToCarouselSlides(embeds)}
              ariaLabel={`${section.heading} videos`}
              reducedMotion={reducedMotion}
              layout="featuredFixed"
              fullWidthSlides
              surface="plain"
              autoplay={false}
            />
          </div>
        ) : null}

        {subsections.length > 0 ? (
          <div className="visual-work-subsections">
            {subsections.map((sub, subIndex) => (
              <VisualSubsectionBlock
                key={`${sub.heading ?? 'block'}-${subIndex}`}
                subsection={sub}
                sectionIndex={index}
                subIndex={subIndex}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        ) : null}

        {captioned.length > 0 ? (
          <div className="visual-work-captioned">
            {captioned.map((block) => (
              <div key={block.caption} className="visual-work-captioned__block">
                <p className="adopt-meta-label visual-work-captioned__caption mb-0">{block.caption}</p>
                {block.media ? (
                  <img
                    src={block.media.src}
                    alt={block.media.alt}
                    className="visual-work-media__img visual-work-media__img--captioned"
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </AdoptCaseStudySection>
  );
}

function VisualMediaStack({
  items,
  layout = 'stack',
  framed = false,
}: {
  items: readonly VisualMediaItem[];
  layout?: 'stack' | 'grid';
  /** Editorial radius/border — hero gallery only. */
  framed?: boolean;
}) {
  const gridCountClass =
    layout === 'grid'
      ? items.length <= 2
        ? 'visual-work-media--grid-2'
        : items.length === 3
          ? 'visual-work-media--grid-3'
          : items.length === 4
            ? 'visual-work-media--grid-4'
            : 'visual-work-media--grid-multi'
      : '';

  const className = [
    'visual-work-media',
    layout === 'grid' ? 'visual-work-media--grid' : '',
    gridCountClass,
    framed ? 'visual-work-media--framed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <ul className={className}>
      {items.map((item) => (
        <li
          key={item.src}
          className="visual-work-media__item"
          style={item.maxWidth ? { width: '100%' } : undefined}
        >
          <img
            src={item.src}
            alt={item.alt}
            className="visual-work-media__img"
            style={item.maxWidth ? { width: '100%', maxWidth: item.maxWidth } : undefined}
            loading="lazy"
            decoding="async"
          />
        </li>
      ))}
    </ul>
  );
}
