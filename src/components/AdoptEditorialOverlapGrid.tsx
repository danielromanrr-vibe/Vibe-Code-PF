export type EditorialOverlapItem = {
  src: string;
  alt: string;
  videoSrc?: string;
};

export type EditorialOverlapBundle = {
  primary: EditorialOverlapItem;
  stackTop: EditorialOverlapItem;
  stackBottom: EditorialOverlapItem;
};

type Props = {
  data: EditorialOverlapBundle;
  /** Extra bottom padding when this grid sits above overlapping sections (legacy layout). */
  paddedBottom?: boolean;
};

/**
 * Primary + stacked pair — mobile stack, md+ overlap (matches adopt case study editorial strip).
 */
export default function AdoptEditorialOverlapGrid({ data, paddedBottom = false }: Props) {
  const pb = paddedBottom ? 'pb-[15rem]' : 'pb-0';

  return (
    <div className={`mx-auto w-full max-w-none min-w-0 ${pb}`}>
      <div className="flex flex-col gap-5 md:hidden">
        <figure className="group relative overflow-hidden rounded-2xl border border-ink/[0.08] bg-white shadow-sm">
          <div className="aspect-[4/3] w-full overflow-hidden">
            <img
              src={data.primary.src}
              alt={data.primary.alt}
              className="h-full w-full object-cover transition-transform duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              loading="eager"
              decoding="async"
            />
          </div>
          <figcaption className="adopt-body border-t border-ink/[0.06] px-4 py-3 text-left text-ink/78">
            {data.primary.alt}
          </figcaption>
        </figure>
        <div className="grid grid-cols-2 gap-3.5">
          {([data.stackTop, data.stackBottom] as const).map((item, i) => (
            <figure
              key={item.src}
              className="group relative overflow-hidden rounded-xl border border-ink/[0.08] bg-white shadow-sm"
            >
              <div className={`w-full overflow-hidden ${i === 0 ? 'aspect-[5/6]' : 'aspect-[5/4]'}`}>
                {'videoSrc' in item && item.videoSrc ? (
                  <video
                    className="h-full w-full origin-[70%_50%] scale-[1.14] object-cover object-[70%_center] transition-transform duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.22] motion-reduce:scale-100 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    src={item.videoSrc}
                    poster={item.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-label={item.alt}
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-cover transition-transform duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>
              <figcaption className="adopt-body border-t border-ink/[0.06] px-2.5 py-2 text-left text-[0.8125rem] leading-snug text-ink/76 sm:px-3 sm:py-2.5 sm:text-[length:var(--text-body)]">
                {item.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="relative mx-auto hidden h-[clamp(260px,36vw,420px)] w-full min-w-0 max-w-[min(100%,1040px)] lg:h-[clamp(276px,34vw,432px)] md:block">
        <figure className="adopt-editorial-overlap-primary group absolute inset-y-[1%] left-0 z-[1] w-[65.5%] max-w-none overflow-hidden rounded-[1.15rem] border border-ink/[0.08] bg-white shadow-sm lg:w-[64.5%]">
          <img
            src={data.primary.src}
            alt={data.primary.alt}
            className="h-full w-full object-cover object-[54%_44%] transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            loading="eager"
            decoding="async"
          />
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-ink/55 via-ink/20 to-transparent px-4 pb-3 pt-10 text-left">
            <p className="adopt-body mb-0 max-w-[min(100%,42ch)] text-[0.875rem] leading-snug text-white drop-shadow-sm md:text-[length:var(--text-body)]">
              {data.primary.alt}
            </p>
          </figcaption>
        </figure>
        <div className="adopt-editorial-overlap-stack absolute top-1/2 right-0 z-[2] flex h-[96%] w-[40%] min-h-0 min-w-[168px] -translate-y-1/2 flex-col justify-center gap-3.5 pl-3 md:gap-4.5 md:pl-3.5 lg:gap-5 lg:pl-4">
          <figure className="group flex w-[126%] max-w-none shrink-0 justify-end self-end -translate-x-[8%] overflow-visible md:-translate-x-[9%] lg:-translate-x-[10%] lg:w-[128%] rotate-[-0.2deg] motion-reduce:rotate-0">
            <div className="flex w-full max-w-[min(100%,272px)] flex-col overflow-hidden rounded-[0.9rem] border border-ink/[0.08] bg-white shadow-sm transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 lg:max-w-[min(100%,296px)]">
              <div className="aspect-[5/6] w-full overflow-hidden">
                {data.stackTop.videoSrc ? (
                  <video
                    className="h-full w-full origin-[70%_50%] scale-[1.14] object-cover object-[70%_center] transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.22] motion-reduce:scale-100 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    src={data.stackTop.videoSrc}
                    poster={data.stackTop.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-label={data.stackTop.alt}
                  />
                ) : (
                  <img
                    src={data.stackTop.src}
                    alt={data.stackTop.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>
              <figcaption className="adopt-body border-t border-ink/[0.06] px-2.5 py-2 text-left text-[0.75rem] leading-snug text-ink/78 md:px-3 md:py-2.5 md:text-[0.8125rem]">
                {data.stackTop.alt}
              </figcaption>
            </div>
          </figure>
          <figure className="group flex w-[110%] max-w-none shrink-0 justify-start self-start translate-x-[1%] overflow-visible md:translate-x-[2%] lg:translate-x-[2.5%] rotate-[0.22deg] motion-reduce:rotate-0">
            <div className="flex w-full max-w-[min(100%,288px)] flex-col overflow-hidden rounded-[0.9rem] border border-ink/[0.08] bg-white shadow-sm transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 lg:max-w-[min(100%,308px)]">
              <div className="aspect-[11/9] w-full overflow-hidden">
                <img
                  src={data.stackBottom.src}
                  alt={data.stackBottom.alt}
                  className="h-full w-full object-cover object-[52%_46%] transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="adopt-body border-t border-ink/[0.06] px-2.5 py-2 text-left text-[0.75rem] leading-snug text-ink/78 md:px-3 md:py-2.5 md:text-[0.8125rem]">
                {data.stackBottom.alt}
              </figcaption>
            </div>
          </figure>
        </div>
      </div>
    </div>
  );
}
