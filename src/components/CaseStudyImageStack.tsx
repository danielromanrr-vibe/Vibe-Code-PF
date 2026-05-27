/** Overlapping editorial image stack — homepage (3-up) or system overview (2-up, square). */
export type CaseStudyImageStackCard = {
  src: string;
  alt: string;
  frameClass: string;
  imageScale: number;
  imagePosition: string;
  baseZ: number;
};

export const HOMEPAGE_DRIVER_IMAGE_STACK: CaseStudyImageStackCard[] = [
  {
    src: '/adopt-a-school/Hero3_.jpg',
    alt: 'Community touchpoint showing the system in a real-world setting',
    frameClass: 'left-0 top-[6%] h-[84%] w-[70%]',
    imageScale: 1.1,
    imagePosition: '52% 42%',
    baseZ: 40,
  },
  {
    src: '/adopt-a-school/Hero2_Humanize-shot_IMG_9442.jpg',
    alt: 'On-site system interaction detail',
    frameClass: 'right-0 top-[8%] h-[52%] w-[30%]',
    imageScale: 1.12,
    imagePosition: '52% 30%',
    baseZ: 20,
  },
  {
    src: '/adopt-a-school/Hero1_Humanize-shot_IMG_9441.jpg',
    alt: 'People and environment connected through the participation system',
    frameClass: 'right-[2%] bottom-[4%] h-[30%] w-[34%]',
    imageScale: 1.1,
    imagePosition: '56% 34%',
    baseZ: 10,
  },
];

/** Two landscape artifacts — fills square column beside system diagram. */
export const SYSTEM_OVERVIEW_IMAGE_STACK: CaseStudyImageStackCard[] = [
  {
    src: '/adopt-a-school/Hero3_.jpg',
    alt: 'Warehouse operations and logistics floor.',
    frameClass: 'left-0 top-[2%] h-[76%] w-[94%]',
    imageScale: 1.08,
    imagePosition: '48% 40%',
    baseZ: 10,
  },
  {
    src: '/adopt-a-school/Hero2_Humanize-shot_IMG_9442.jpg',
    alt: 'Volunteer and coordinator interaction in the field.',
    frameClass: 'right-0 bottom-[2%] h-[50%] w-[62%]',
    imageScale: 1.1,
    imagePosition: '52% 36%',
    baseZ: 20,
  },
];

type CaseStudyImageStackProps = {
  cards?: CaseStudyImageStackCard[];
  className?: string;
  /** Homepage bleed on md+ (156% width). Off in contained two-column layouts. */
  bleed?: boolean;
  /** No outer border/background shell — photos only. */
  bare?: boolean;
  /** Match square system diagram height (1:1). */
  squareFrame?: boolean;
};

export default function CaseStudyImageStack({
  cards = HOMEPAGE_DRIVER_IMAGE_STACK,
  className = '',
  bleed = false,
  bare = false,
  squareFrame = false,
}: CaseStudyImageStackProps) {
  const bleedClass = bleed
    ? 'md:mx-0 md:ml-auto md:w-[156%] md:max-w-[1120px] md:origin-right'
    : 'mx-auto md:mx-0';

  const shellClass = bare
    ? `w-full min-w-0 ${bleedClass}`
    : `w-full min-w-0 overflow-hidden rounded-lg border border-ink/12 bg-white ${bleedClass}`;

  const stageClass = squareFrame
    ? 'relative aspect-square w-full overflow-hidden'
    : 'relative aspect-[16/10] w-full overflow-hidden md:aspect-[13/10]';

  const tileClass = bare
    ? 'absolute overflow-hidden rounded-lg shadow-[0_4px_18px_-8px_rgba(20,20,20,0.14)]'
    : 'absolute overflow-hidden rounded-lg border border-ink/12 bg-white';

  return (
    <div className={`${shellClass} ${className}`.trim()}>
      <div className={stageClass}>
        {cards.map((card) => (
          <article
            key={card.src}
            className={`${tileClass} ${card.frameClass}`}
            style={{ zIndex: card.baseZ }}
          >
            <img
              src={card.src}
              alt={card.alt}
              className="h-full w-full object-cover"
              style={{
                objectPosition: card.imagePosition,
                transform: `scale(${card.imageScale})`,
              }}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </article>
        ))}
      </div>
    </div>
  );
}
