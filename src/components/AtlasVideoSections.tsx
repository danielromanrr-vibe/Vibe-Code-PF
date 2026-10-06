import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { ATLAS_WORKFLOWS, type AtlasWorkflowCategory, type AtlasWorkflowClip } from '../content/vhenyAtlas';

function filmSrc(id: string, play: boolean) {
  const params = new URLSearchParams({
    badge: '0',
    autopause: '0',
    title: '0',
    byline: '0',
    portrait: '0',
    muted: '1',
  });
  if (play) {
    params.set('autoplay', '1');
    params.set('loop', '1');
  }
  return `https://player.vimeo.com/video/${id}?${params}`;
}

function WorkflowFilm({
  clip,
  play,
  label,
  eager,
}: {
  clip: AtlasWorkflowClip;
  play: boolean;
  label: string;
  eager: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (play) {
      video.play().catch(() => {});
      return;
    }
    video.pause();
  }, [play]);

  if (clip.src) {
    return (
      <video ref={videoRef} src={clip.src} title={label} muted loop playsInline preload={eager ? 'auto' : 'metadata'} />
    );
  }

  return (
    <iframe
      src={filmSrc(clip.id, play)}
      title={label}
      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      loading={eager ? 'eager' : 'lazy'}
    />
  );
}

function WorkflowBand({
  category,
  reducedMotion,
}: {
  category: AtlasWorkflowCategory;
  reducedMotion: boolean;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canAdvance, setCanAdvance] = useState(true);
  const [activeId, setActiveId] = useState('');

  const sync = useCallback(() => {
    const rail = railRef.current;
    const slot = rail?.parentElement;
    if (!rail || !slot) return;
    const slotLeft = slot.getBoundingClientRect().left;
    slot.style.setProperty('--vheny-rail-left', `${Math.max(0, slotLeft)}px`);
    const remaining = rail.scrollWidth - rail.clientWidth - rail.scrollLeft;
    setCanAdvance(remaining > 8);

    const railRect = rail.getBoundingClientRect();
    const railOnScreen = railRect.bottom > 64 && railRect.top < window.innerHeight - 48;
    if (!railOnScreen) {
      setActiveId((current) => (current === '' ? current : ''));
      return;
    }

    let bestId = category.clips[0]?.id ?? '';
    let bestDist = Number.POSITIVE_INFINITY;
    rail.querySelectorAll<HTMLElement>('[data-clip-id]').forEach((el) => {
      const id = el.dataset.clipId;
      if (!id) return;
      const dist = Math.abs(el.getBoundingClientRect().left - railRect.left);
      if (dist < bestDist) {
        bestDist = dist;
        bestId = id;
      }
    });
    setActiveId((current) => (current === bestId ? current : bestId));
  }, [category.clips]);

  useLayoutEffect(() => {
    const rail = railRef.current;
    const slot = rail?.parentElement;
    if (!rail || !slot) return;
    sync();
    const scrollParent = rail.closest('[id$="-scroll"]');
    const observer = new ResizeObserver(sync);
    observer.observe(slot);
    rail.addEventListener('scroll', sync, { passive: true });
    scrollParent?.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      observer.disconnect();
      rail.removeEventListener('scroll', sync);
      scrollParent?.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  const advance = () => {
    const rail = railRef.current;
    if (!rail) return;
    const railLeft = rail.getBoundingClientRect().left;
    const next = [...rail.querySelectorAll<HTMLElement>('[data-clip-id]')].find(
      (el) => el.getBoundingClientRect().left - railLeft > 8,
    );
    if (!next) return;
    rail.scrollTo({
      left: rail.scrollLeft + (next.getBoundingClientRect().left - railLeft),
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <div className="vheny-starting-point atlas-workflows__band">
      <div className="vheny-starting-point__copy">
        <h3 className="adopt-alt-h3 m-0 scroll-mt-6 text-balance">{category.title}</h3>
        <p className="adopt-body mb-0 text-pretty text-ink/82">{category.description}</p>
      </div>
      <div className="vheny-starting-point__rail-slot">
        <div
          ref={railRef}
          className="vheny-starting-point__rail"
          tabIndex={0}
          role="region"
          aria-label={category.title}
        >
          {category.clips.map((clip, index) => (
            <figure
              key={clip.id}
              className="vheny-starting-point__card"
              data-clip-id={clip.id}
              style={{ ['--frame-ratio' as string]: clip.ratio }}
            >
              <div className="atlas-workflows__frame">
                <WorkflowFilm
                  clip={clip}
                  play={!reducedMotion && activeId === clip.id}
                  label={`${category.title}: ${clip.title}`}
                  eager={index === 0}
                />
              </div>
              <figcaption className="atlas-workflows__caption">{clip.title}</figcaption>
            </figure>
          ))}
          <div className="vheny-starting-point__end" aria-hidden />
        </div>
        {canAdvance ? (
          <button
            type="button"
            className="home-featured-carousel-hint vheny-starting-point__hint"
            aria-label={`See next film in ${category.title}`}
            onClick={advance}
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2.2} aria-hidden />
          </button>
        ) : null}
      </div>
    </div>
  );
}

type AtlasVideoSectionsProps = {
  reducedMotion: boolean;
};

export default function AtlasVideoSections({ reducedMotion }: AtlasVideoSectionsProps) {
  return (
    <div className="atlas-workflows">
      <header className="atlas-workflows__header">
        <p className="adopt-meta-label vheny-subsection__eyebrow">{ATLAS_WORKFLOWS.eyebrow}</p>
        <h2 className="adopt-context-heading scroll-mt-6">{ATLAS_WORKFLOWS.title}</h2>
        <p className="adopt-body mb-0 text-pretty text-ink/82">{ATLAS_WORKFLOWS.subhead}</p>
      </header>
      <div className="atlas-workflows__categories">
        {ATLAS_WORKFLOWS.categories.map((category) => (
          <WorkflowBand key={category.id} category={category} reducedMotion={reducedMotion} />
        ))}
      </div>
    </div>
  );
}
