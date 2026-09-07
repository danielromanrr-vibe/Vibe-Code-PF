import { TOUCHPOINTS_SCOPE_ITEMS } from '../content/touchpointsCaseStudy';
import { ScopeIconMark, ScopeRailRow } from './ScopeReadMorePlus';

export default function TouchpointsScopeRail() {
  return (
    <div className="adopt-scope-rail w-full min-w-0" aria-label="Scope — brand, product UI, and web">
      <div className="flex w-full min-w-0 flex-col gap-8 md:gap-10">
        {TOUCHPOINTS_SCOPE_ITEMS.map((item) => (
          <ScopeRailRow
            key={item.id}
            eyebrow={item.eyebrow}
            body={item.body}
            mark={
              <ScopeIconMark>
                <img
                  src={item.imageSrc}
                  alt=""
                  className="h-full w-full rounded-full object-cover object-center opacity-90"
                  loading="lazy"
                  decoding="async"
                />
              </ScopeIconMark>
            }
          />
        ))}
      </div>
    </div>
  );
}
