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
