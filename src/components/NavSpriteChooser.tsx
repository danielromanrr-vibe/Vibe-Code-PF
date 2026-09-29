import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { MANDALA_SPRITE_IDS, MANDALA_SPRITE_NAMES, type MandalaSpriteId } from '../lib/mandalaSprite';
import { useMandalaSprite } from '../hooks/useMandalaSprite';
import AboutSpriteMini from './about/AboutSpriteMini';

type NavSpriteChooserProps = {
  previewId: MandalaSpriteId | null;
  onPreview: (id: MandalaSpriteId | null) => void;
  onDismiss: () => void;
};

export default function NavSpriteChooser({ previewId, onPreview, onDismiss }: NavSpriteChooserProps) {
  const { spriteId, setSprite } = useMandalaSprite();
  const choices = MANDALA_SPRITE_IDS.filter((id) => id !== spriteId);
  const [announcement, setAnnouncement] = useState('');
  const groupRef = useRef<HTMLDivElement>(null);
  const committedRef = useRef(spriteId);
  const groupId = 'nav-sprite-chooser';
  const hintId = 'nav-sprite-chooser-hint';

  useEffect(() => {
    if (committedRef.current === spriteId) return;
    committedRef.current = spriteId;
    onPreview(null);
    setAnnouncement(`${MANDALA_SPRITE_NAMES[spriteId]} at home`);
  }, [onPreview, spriteId]);

  useEffect(() => {
    const active = document.activeElement;
    if (!(active instanceof HTMLElement)) return;
    if (!active.closest('[data-identity-slot]')) return;
    if (active.getAttribute('role') === 'radio') return;
    groupRef.current?.querySelector<HTMLButtonElement>('[role="radio"]')?.focus();
  }, []);

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      const trigger = document.querySelector<HTMLButtonElement>(`[aria-controls="${groupId}"]`);
      onPreview(null);
      onDismiss();
      trigger?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDismiss, onPreview]);

  const commit = (id: MandalaSpriteId) => {
    setSprite(id);
    onPreview(null);
    setAnnouncement(`${MANDALA_SPRITE_NAMES[id]} at home`);
  };

  const focusChoice = (index: number) => {
    const id = choices[index];
    if (!id) return;
    onPreview(id);
    const radios = groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    radios?.[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = previewId ? Math.max(0, choices.indexOf(previewId)) : 0;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      focusChoice((current + 1) % choices.length);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      focusChoice((current - 1 + choices.length) % choices.length);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusChoice(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusChoice(choices.length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const id = previewId ?? choices[current];
      if (id) commit(id);
    }
  };

  return (
    <div
      ref={groupRef}
      id={groupId}
      className="nav-sprite-chooser"
      role="radiogroup"
      aria-label="Choose a mandala"
      aria-orientation="vertical"
      aria-describedby={hintId}
      onKeyDown={onKeyDown}
      onMouseLeave={() => onPreview(null)}
    >
      {choices.map((id, index) => (
        <AboutSpriteMini
          key={index}
          id={id}
          size={22}
          hitSize={44}
          density="micro"
          role="radio"
          active={previewId === id}
          ariaChecked={previewId === id}
          tabIndex={previewId === id || (previewId == null && index === 0) ? 0 : -1}
          onPreview={onPreview}
          onSelect={() => commit(id)}
        />
      ))}
      <span id={hintId} className="sr-only">
        Arrow keys move between mandalas. Enter chooses one. Escape closes the list.
      </span>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </div>
  );
}
