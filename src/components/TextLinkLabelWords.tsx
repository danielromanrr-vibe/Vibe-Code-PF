type TextLinkLabelWordsProps = {
  label: string;
};

/**
 * Splits a text CTA label into hover-tracked word spans.
 */
export default function TextLinkLabelWords({ label }: TextLinkLabelWordsProps) {
  const words = label.trim().split(/\s+/).filter(Boolean);

  return (
    <span className="text-link-label">
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="text-link-word">
          {word}
        </span>
      ))}
    </span>
  );
}
