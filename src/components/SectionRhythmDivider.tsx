/**
 * 160px vertical rhythm between major sections: 80px + rule + 80px
 * (straight stroke, full width of parent column; border-ink/10 like homepage hr).
 */
export default function SectionRhythmDivider() {
  return (
    <div className="flex min-h-[160px] w-full items-center justify-center" aria-hidden>
      <div className="w-full border-0 border-t border-ink/10" />
    </div>
  );
}
