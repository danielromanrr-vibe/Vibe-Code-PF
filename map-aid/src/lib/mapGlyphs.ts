import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AlertCircle, AlertTriangle, ChevronRight, GraduationCap, Package, ShieldAlert } from 'lucide-react';

const ICONS = {
  alertCircle: AlertCircle,
  alertTriangle: AlertTriangle,
  chevronRight: ChevronRight,
  graduationCap: GraduationCap,
  package: Package,
  shieldAlert: ShieldAlert,
} as const;

export type GlyphName = keyof typeof ICONS;

const cache = new Map<string, string>();

/** Leaflet divIcons need HTML strings; render the same lucide components the React UI uses. */
export function glyph(name: GlyphName, className: string): string {
  const key = `${name}|${className}`;
  let html = cache.get(key);
  if (!html) {
    html = renderToStaticMarkup(createElement(ICONS[name], { className, 'aria-hidden': true }));
    cache.set(key, html);
  }
  return html;
}
