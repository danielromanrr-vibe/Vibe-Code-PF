import { TOUCHPOINTS_SCOPE_ITEMS } from '../content/touchpointsCaseStudy';

const stripEyebrowClass = 'adopt-prototype-strip-eyebrow';
const scopeBlockGapClass = 'gap-8 md:gap-10';
const scopeMoleculeRow = 'flex flex-row items-center gap-3 sm:gap-4';

function ScopeImageTile({ src }: { src: string }) {
  return (
    <div
      className="scope-icon-learn-more scope-icon-learn-more--tall pointer-events-none shrink-0"
      aria-hidden="true"
    >
      <span className="scope-icon-learn-more__mark">
        <span className="flex h-[3.25rem] w-[3.25rem] items-center justify-center overflow-hidden rounded-full border border-ink/[0.13] bg-white p-1 sm:h-[3.75rem] sm:w-[3.75rem] sm:p-1.5">
          <img
            src={src}
            alt=""
            className="h-full w-full rounded-full object-cover object-center opacity-90"
            loading="lazy"
            decoding="async"
          />
        </span>
      </span>
    </div>
  );
}

export default function TouchpointsScopeRail() {
  return (
    <div className="adopt-scope-rail w-full min-w-0" aria-label="Scope — brand, product UI, and web">
      <div className={`flex w-full min-w-0 flex-col ${scopeBlockGapClass}`}>
        {TOUCHPOINTS_SCOPE_ITEMS.map((item) => (
          <div key={item.id} className={scopeMoleculeRow}>
            <ScopeImageTile src={item.imageSrc} />
            <div className="min-w-0 flex-1">
              <p className={`${stripEyebrowClass} mb-2`}>{item.eyebrow}</p>
              <p className="adopt-body adopt-prototype-strip-copy mb-0 max-w-none leading-[1.45] text-ink/72">
                {item.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
