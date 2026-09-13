import { ATLAS_VIDEO_SECTIONS, type AtlasVimeoClip } from '../content/vhenyAtlas';

function AtlasVimeoFrame({ clip }: { clip: AtlasVimeoClip }) {
  const params = new URLSearchParams({
    badge: '0',
    autopause: '0',
    title: '0',
    byline: '0',
    portrait: '0',
  });
  if (clip.autoplayMutedLoop) {
    params.set('autoplay', '1');
    params.set('muted', '1');
    params.set('loop', '1');
  }

  return (
    <figure className="atlas-clip">
      <div
        className="atlas-clip__frame"
        style={{ aspectRatio: `100 / ${clip.paddingPct}` }}
      >
        <iframe
          src={`https://player.vimeo.com/video/${clip.id}?${params.toString()}`}
          title={clip.title}
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
        />
      </div>
      <figcaption className="atlas-clip__caption adopt-body mb-0">{clip.showcase}</figcaption>
    </figure>
  );
}

export default function AtlasVideoSections() {
  return (
    <>
      {ATLAS_VIDEO_SECTIONS.map((section) => (
        <section
          key={section.id}
          id={`atlas-${section.id}`}
          className="atlas-video-section"
          aria-labelledby={`atlas-${section.id}-heading`}
        >
          <h2 id={`atlas-${section.id}-heading`} className="mb-2 md:mb-2.5">
            {section.heading}
          </h2>
          <p className="adopt-body mb-0 max-w-measure">{section.body}</p>
          <div className="atlas-clip-stack">
            {section.clips.map((clip) => (
              <AtlasVimeoFrame key={clip.id} clip={clip} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
