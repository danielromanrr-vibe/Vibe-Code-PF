import AdoptSystemDiagram from './AdoptSystemDiagram';
import systemDesignOverviewImg from '../assets/adopt/system-design-overview.png';

export const SYSTEM_DESIGN_OVERVIEW_LEDE =
  'The final solution connected physical activation, digital enrollment, warehouse operations, and volunteer support into one coordinated service ecosystem.';

const SYSTEM_OVERVIEW_PHOTO = {
  src: systemDesignOverviewImg,
  alt: 'Physical adoption object with QR entry beside the mobile enrollment onboarding flow—one service ecosystem.',
};

type Props = {
  headingId?: string;
};

export default function AdoptSystemDesignOverview({ headingId = 'adopt-page-system-diagram-heading' }: Props) {
  return (
    <div className="adopt-system-design-overview w-full min-w-0">
      <header className="adopt-system-design-overview__head mx-auto mb-8 flex w-full max-w-2xl flex-col items-center text-center md:mb-10 lg:mb-12">
        <h2
          id={headingId}
          className="adopt-context-heading mx-auto mb-2 max-w-[28ch] text-balance md:mb-2.5"
        >
          System design overview
        </h2>
        <p className="adopt-body mx-auto mb-0 max-w-[44ch] text-pretty text-ink/82">
          {SYSTEM_DESIGN_OVERVIEW_LEDE}
        </p>
      </header>

      <div className="adopt-system-design-overview__columns">
        <div className="adopt-system-design-overview__media-row">
          <figure className="adopt-system-design-overview__photo min-h-0 min-w-0">
            <div className="adopt-system-design-overview__square-cell adopt-system-design-overview__photo-frame overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-18px_rgba(20,20,20,0.12)]">
              <img
                src={SYSTEM_OVERVIEW_PHOTO.src}
                alt={SYSTEM_OVERVIEW_PHOTO.alt}
                className="h-full w-full object-cover object-center"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>
          </figure>

          <div className="adopt-system-design-overview__diagram-media min-h-0 min-w-0">
            <div className="adopt-system-design-overview__square-cell adopt-system-diagram-frame overflow-hidden rounded-2xl border border-ink/10 bg-[rgb(250,250,249)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-18px_rgba(20,20,20,0.12)]">
              <div className="absolute inset-0 p-2 sm:p-3">
                <AdoptSystemDiagram compact quietVisuals pointerInteractive={false} />
              </div>
            </div>
          </div>
        </div>

        <div className="adopt-system-design-overview__meta-row">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-ink/72">
            <span className="inline-flex items-center gap-2">
              <span className="legend-dot legend-dot--red" />
              Patrons or clients
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="legend-dot legend-dot--blue" />
              Volunteers
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="legend-dot legend-dot--green" />
              Ongoing support loop
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
