import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { hoytToolTour } from '../content/driver';

const VIMEO_ORIGIN = 'https://player.vimeo.com';

function vimeoCommand(iframe: HTMLIFrameElement | null, method: string, value?: unknown) {
  if (!iframe?.contentWindow) return;
  iframe.contentWindow.postMessage(
    JSON.stringify(value === undefined ? { method } : { method, value }),
    VIMEO_ORIGIN,
  );
}

function formatStamp(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function chapterIndexAt(time: number) {
  const chapters = hoytToolTour.chapters;
  let index = 0;
  for (let i = 0; i < chapters.length; i += 1) {
    if (time + 0.35 >= chapters[i].at) index = i;
  }
  return index;
}

export default function DriverHoytToolTour() {
  const headingId = useId();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const readyRef = useRef(false);
  const pendingSeekRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const seekTo = useCallback((seconds: number) => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    setActiveIndex(chapterIndexAt(seconds));
    if (!readyRef.current) {
      pendingSeekRef.current = seconds;
      return;
    }
    vimeoCommand(iframe, 'setCurrentTime', seconds);
    vimeoCommand(iframe, 'play');
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== VIMEO_ORIGIN || event.source !== iframe.contentWindow) return;
      let data = event.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }
      if (!data || typeof data !== 'object') return;

      if (data.event === 'ready') {
        readyRef.current = true;
        vimeoCommand(iframe, 'addEventListener', 'timeupdate');
        vimeoCommand(iframe, 'addEventListener', 'playProgress');
        if (pendingSeekRef.current !== null) {
          const seconds = pendingSeekRef.current;
          pendingSeekRef.current = null;
          vimeoCommand(iframe, 'setCurrentTime', seconds);
          vimeoCommand(iframe, 'play');
        }
        return;
      }

      if (data.event === 'timeupdate' || data.event === 'playProgress') {
        const seconds = Number(data.data?.seconds);
        if (Number.isFinite(seconds)) setActiveIndex(chapterIndexAt(seconds));
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const params = new URLSearchParams({
    badge: '0',
    autopause: '0',
    autoplay: '0',
    title: '0',
    byline: '0',
    portrait: '0',
    api: '1',
    dnt: '1',
  });

  return (
    <section className="driver-hoyt-tour" aria-labelledby={headingId}>
      <div className="driver-hoyt-tour__intro">
        <p className="adopt-meta-label adopt-meta-label--bold">{hoytToolTour.eyebrow}</p>
        <h3 id={headingId} className="adopt-alt-h3 scroll-mt-6">
          {hoytToolTour.title}
        </h3>
        <p className="adopt-body mb-0 text-pretty text-ink/82">{hoytToolTour.lede}</p>
      </div>

      <div className="driver-hoyt-tour__stage">
        <ol className="driver-hoyt-tour__toc" aria-label="Video chapters">
          {hoytToolTour.chapters.map((chapter, index) => {
            const current = index === activeIndex;
            return (
              <li key={chapter.at}>
                <button
                  type="button"
                  className="driver-hoyt-tour__chapter"
                  aria-current={current ? 'true' : undefined}
                  onClick={() => seekTo(chapter.at)}
                >
                  <span className="driver-hoyt-tour__stamp">{formatStamp(chapter.at)}</span>
                  <span className="driver-hoyt-tour__copy">
                    <span className="driver-hoyt-tour__label">{chapter.label}</span>
                    <span className="driver-hoyt-tour__detail" aria-hidden={current ? undefined : true}>
                      <span className="driver-hoyt-tour__detail-inner">
                        <span className="driver-hoyt-tour__detail-text">{chapter.detail}</span>
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <figure className="driver-hoyt-tour__player">
          <iframe
            ref={iframeRef}
            src={`https://player.vimeo.com/video/${hoytToolTour.videoId}?${params.toString()}`}
            title={hoytToolTour.videoTitle}
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </figure>
      </div>
    </section>
  );
}
