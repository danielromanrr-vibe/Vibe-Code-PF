import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import AdoptSystemDiagram from './AdoptSystemDiagram';
import systemDesignOverviewImg from '../assets/adopt/system-design-overview.png';

type FlowScreen = { src: string; label: string };

const ONBOARDING_GROUP: FlowScreen[] = [
  { src: '/adopt-a-school/flow-00-popup.png',         label: 'Onboarding' },
  { src: '/adopt-a-school/flow-info-page.png',        label: 'Program info' },
  { src: '/adopt-a-school/flow-01-choose-school.png', label: 'Step 1 — Choose a school' },
];

const CONVERSION_GROUP: FlowScreen[] = [
  { src: '/adopt-a-school/flow-02-pledge-amount.png',  label: 'Step 2 — Pledge amount' },
  { src: '/adopt-a-school/flow-03-share-thoughts.png', label: 'Step 3 — Share thoughts' },
  { src: '/adopt-a-school/flow-04-checkout.png',       label: 'Step 4 — Checkout' },
];

export const SYSTEM_DESIGN_OVERVIEW_LEDE =
  'The final solution connected physical activation, digital enrollment, warehouse operations, and volunteer support into one coordinated service ecosystem.';

const SYSTEM_OVERVIEW_PHOTO = {
  src: systemDesignOverviewImg,
  alt: 'Physical adoption object with QR entry beside the mobile enrollment onboarding flow—one service ecosystem.',
};

const cardW = 'w-[min(38vw,148px)] sm:w-[min(30vw,164px)] md:w-[200px]';
const cardShell = `${cardW} shrink-0 overflow-hidden rounded-xl border border-ink/10 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(12,21,40,0.10)]`;

function FlowGroup({ label, screens }: { label: string; screens: FlowScreen[] }) {
  return (
    <div className="min-w-0">
      <p className="adopt-meta-label adopt-flow-group__label text-ink/55">{label}</p>
      <div className="flex items-start overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {screens.map((screen, i) => {
          const isPrimary = i === 0;
          return (
            <div key={screen.src} className="flex shrink-0 items-center">
              <motion.figure
                className="adopt-flow-group__figure flex shrink-0 flex-col"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2, ease: [0.22, 0.82, 0.24, 1] }}
              >
                <motion.div
                  className={cardShell}
                  animate={{ opacity: isPrimary ? 1 : 0.38 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.18 }}
                >
                  <img
                    src={screen.src}
                    alt={screen.label}
                    className="h-auto w-full block"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </motion.div>
                <figcaption
                  className={`adopt-meta-label text-center transition-colors duration-150 ${
                    isPrimary ? 'text-ink/65' : 'text-ink/38'
                  }`}
                >
                  {screen.label}
                </figcaption>
              </motion.figure>

              {i < screens.length - 1 && (
                <div className="mx-1.5 shrink-0 text-ink/20 sm:mx-2">
                  <ChevronRight size={14} strokeWidth={2} aria-hidden />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

type Props = {
  headingId?: string;
};

export default function AdoptSystemDesignOverview({ headingId = 'adopt-page-system-diagram-heading' }: Props) {
  return (
    <div className="adopt-system-design-overview w-full min-w-0">
      <header className="adopt-system-design-overview__head mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <h2
          id={headingId}
          className="adopt-context-heading mx-auto max-w-[28ch] text-balance"
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
            <div className="adopt-system-design-overview__square-cell adopt-system-design-overview__photo-frame overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-18px_rgba(12,21,40,0.12)]">
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
            <div className="adopt-system-design-overview__square-cell adopt-system-diagram-frame overflow-hidden rounded-2xl border border-ink/10 bg-[rgb(250,250,249)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-18px_rgba(12,21,40,0.12)]">
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

      {/* End-to-end flow */}
      <div className="adopt-system-design-overview__flow-block w-full min-w-0">
        <h3 className="adopt-context-heading text-center">End-to-end flow</h3>

        <div className="adopt-system-design-overview__flow-columns grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-ink/[0.08]">
          <div className="md:pr-10 lg:pr-14">
            <FlowGroup label="Onboarding" screens={ONBOARDING_GROUP} />
          </div>
          <div className="md:pl-10 lg:pl-14">
            <FlowGroup label="Conversion" screens={CONVERSION_GROUP} />
          </div>
        </div>
      </div>
    </div>
  );
}
