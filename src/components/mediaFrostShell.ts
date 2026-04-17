/**
 * Shared frosted shell for {@link ExpandMediaButton} (+/−) and {@link TokenButton}.
 * Keep this baseline clean and accessible; decorative hover layers are opt-in at component level.
 * Do not add `relative` here: {@link ExpandMediaButton} uses `absolute` for corner placement.
 */
export const mediaFrostShellClassName =
  'isolate shrink-0 border border-white/50 bg-gradient-to-br from-white/38 via-white/22 to-white/[0.12] shadow-[0_1px_4px_rgba(0,0,0,0.034),inset_0_1px_0_rgba(255,255,255,0.46),inset_0_-1px_0_rgba(20,20,20,0.032)] backdrop-blur-xl backdrop-saturate-150 transition-[box-shadow,border-color,background-image,transform] hover:border-white/72 hover:from-white/46 hover:via-white/28 hover:to-white/[0.15] hover:shadow-[0_2px_7px_rgba(0,0,0,0.042),inset_0_1px_0_rgba(255,255,255,0.52)] active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--expand-media-icon)] focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

export const mediaFrostIconTextClassName =
  'text-[color:var(--expand-media-icon)] [text-shadow:0_1px_1px_rgba(255,255,255,0.72)] hover:text-[color:var(--expand-media-icon-hover)]';
