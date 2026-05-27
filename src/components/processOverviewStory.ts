import type {
  ProcessOverviewChapterId,
  ProcessOverviewMedia,
  ProcessOverviewStep,
  ProcessPresentationSlide,
  ProcessStoryBeat,
} from './AdoptProcessOverview';

export function buildStoryBeats(steps: ProcessOverviewStep[]): ProcessStoryBeat[] {
  const beats: ProcessStoryBeat[] = [];

  for (const step of steps) {
    beats.push({
      kind: 'text',
      chapterId: step.id,
      heading: step.label,
      body: step.description,
    });
    beats.push({
      kind: 'media',
      chapterId: step.id,
      media: step.primary,
      caption: step.primaryCaption,
      ariaLabel: step.primaryEyebrow ? `${step.primaryEyebrow}: ${step.primaryCaption}` : step.primaryCaption,
    });
    beats.push({
      kind: 'text',
      chapterId: step.id,
      heading: step.primaryEyebrow ?? step.label,
      body: step.primaryCaption,
    });

    for (const s of step.supporting) {
      beats.push({
        kind: 'media',
        chapterId: step.id,
        media: s.media,
        caption: s.caption,
        ariaLabel: s.eyebrow ? `${s.eyebrow}: ${s.caption}` : s.caption,
      });
      beats.push({
        kind: 'text',
        chapterId: step.id,
        heading: s.eyebrow ?? step.label,
        body: s.caption,
      });
    }
  }

  return beats;
}

export function beatsForChapter(
  beats: ProcessStoryBeat[],
  chapterId: ProcessOverviewChapterId,
): ProcessStoryBeat[] {
  return beats.filter((b) => b.chapterId === chapterId);
}

export function buildPresentationSlides(chapterBeats: ProcessStoryBeat[]): ProcessPresentationSlide[] {
  const slides: ProcessPresentationSlide[] = [];
  let i = 0;
  let mediaFirst = false;

  while (i < chapterBeats.length) {
    const a = chapterBeats[i];
    const b = chapterBeats[i + 1];

    if (a?.kind === 'text' && b?.kind === 'media') {
      slides.push({
        id: `${a.chapterId}-pair-${i}`,
        text: { heading: a.heading, body: a.body },
        media: { media: b.media, ariaLabel: b.ariaLabel, caption: b.caption },
        mediaFirst,
      });
      mediaFirst = !mediaFirst;
      i += 2;
      continue;
    }

    if (a?.kind === 'text') {
      slides.push({
        id: `${a.chapterId}-text-${i}`,
        text: { heading: a.heading, body: a.body },
        mediaFirst,
      });
      i += 1;
      continue;
    }

    if (a?.kind === 'media') {
      slides.push({
        id: `${a.chapterId}-media-${i}`,
        text: { heading: '', body: a.ariaLabel },
        media: { media: a.media, ariaLabel: a.ariaLabel, caption: a.caption },
        mediaFirst: true,
      });
      i += 1;
      continue;
    }

    i += 1;
  }

  return slides;
}

export type { ProcessOverviewMedia };
