import { motion } from 'motion/react';
import AdoptSystemDiagram from './AdoptSystemDiagram';
import type { ProcessOverviewMedia } from './AdoptProcessOverview';

export function ProcessSlideMediaFill({
  media,
  priority,
}: {
  media: ProcessOverviewMedia;
  priority?: boolean;
}) {
  if (media.type === 'diagram') {
    return (
      <motion.div
        layout
        className="absolute inset-0 min-h-0 overflow-hidden bg-[rgb(250,250,249)] p-1 md:p-2"
      >
        <AdoptSystemDiagram compact />
      </motion.div>
    );
  }
  if (media.type === 'embed') {
    const params = new URLSearchParams({
      badge: '0',
      autopause: '0',
      autoplay: '1',
      muted: '1',
      loop: media.loop === false ? '0' : '1',
      // Vimeo's own chrome competes with the card; keep the frame quiet like the local videos.
      title: '0',
      byline: '0',
      portrait: '0',
    });
    return (
      <iframe
        className="absolute inset-0 h-full w-full border-0"
        src={`https://player.vimeo.com/video/${media.videoId}?${params.toString()}`}
        title={media.title}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        loading="lazy"
      />
    );
  }
  if (media.type === 'video') {
    return (
      <video
        className="absolute inset-0 h-full w-full object-cover object-center"
        src={media.src}
        poster={media.poster}
        autoPlay
        muted
        loop
        playsInline
        aria-label={media.alt}
      />
    );
  }
  return (
    <img
      src={media.src}
      alt={media.alt}
      className="absolute inset-0 h-full w-full object-cover object-center"
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
    />
  );
}
