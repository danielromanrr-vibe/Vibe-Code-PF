import L from 'leaflet';
import type { School, TileSource } from '../types';
import type { SchoolStatus } from './status';
import { glyph } from './mapGlyphs';
import { shortSchoolName } from './volunteer';

export type MapTone = 'light' | 'dark';
export type PinLevel = 'compact' | 'detail';
export type Tier = 1 | 2 | 3;

export function toneFor(tileSource: TileSource): MapTone {
  return tileSource === 'dark' || tileSource === 'satellite' ? 'dark' : 'light';
}

export function glassClass(tone: MapTone): string {
  return tone === 'dark' ? 'glass-dark' : 'glass-light';
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

const iconCache = new Map<string, L.DivIcon>();

/**
 * Identical HTML must return the identical icon instance; otherwise
 * react-leaflet calls setIcon on every render and the entrance animation replays.
 */
export function cachedDivIcon(className: string, html: string, size: [number, number], anchor: [number, number]): L.DivIcon {
  const key = `${className}|${size}|${anchor}|${html}`;
  let icon = iconCache.get(key);
  if (!icon) {
    icon = L.divIcon({ className, html, iconSize: size, iconAnchor: anchor });
    iconCache.set(key, icon);
  }
  return icon;
}

type TileKind = 'covered' | 'gap' | 'standby' | 'at-risk' | 'warehouse';

function tileHtml(kind: TileKind, { large = false, pulse = false, tier = null as Tier | null, dot = '' } = {}): string {
  const size = large ? ' map-tile--lg' : '';
  const glyphSize = large ? 'w-4 h-4' : 'w-3.5 h-3.5';
  const dotHtml = dot ? `<span class="map-tile__dot ${dot}"></span>` : '';
  switch (kind) {
    case 'gap':
      return `<div class="map-tile map-tile--diamond${size} bg-red-600${pulse ? ' animate-pulse-red' : ''}">${glyph('shieldAlert', `${glyphSize} text-white`)}</div>`;
    case 'standby':
      return `<div class="map-tile map-tile--diamond${size} bg-[#0c1528]">${glyph('alertTriangle', `${glyphSize} text-slate-100`)}</div>`;
    case 'at-risk':
      return `<div class="map-tile${size} bg-amber-500">${glyph('alertCircle', `${glyphSize} text-white`)}${dotHtml}</div>`;
    case 'warehouse':
      return `<div class="map-tile map-tile--lg bg-[#0c1528]">${glyph('package', 'w-4 h-4 text-amber-400')}<span class="absolute -bottom-1.5 -right-1.5 h-4 px-1 rounded-full bg-white text-[#0c1528] text-[10.5px] leading-4 font-bold shadow-xs">HQ</span></div>`;
    default:
      return `<div class="map-tile${size} bg-[#0c1528]${tier ? ` map-tile--t${tier}` : ''}">${glyph('graduationCap', `${glyphSize} text-slate-100`)}${dotHtml}</div>`;
  }
}

export interface ClusterView {
  zone: string;
  totalCount: number;
  gapCount: number;
  displayCount: number;
  filterMode: 'all' | 'gaps' | 'covered';
}

export function buildClusterHtml(cluster: ClusterView, { isRSVPRequested, tone }: { isRSVPRequested: boolean; tone: MapTone }): string {
  const isGapsMode = cluster.filterMode === 'gaps';
  const isCoveredMode = cluster.filterMode === 'covered';
  const hasGaps = cluster.gapCount > 0;
  const dark = tone === 'dark';

  const kind: TileKind =
    isGapsMode || (hasGaps && isRSVPRequested) ? 'gap' : isCoveredMode || !hasGaps ? 'covered' : 'standby';

  const red = dark ? 'text-red-300' : 'text-red-600';
  const amber = dark ? 'text-amber-300' : 'text-amber-700';
  const green = dark ? 'text-emerald-300' : 'text-emerald-700';

  let count: string;
  let status: string;
  let statusColor: string;
  if (isGapsMode) {
    count = `${cluster.displayCount} ${cluster.displayCount === 1 ? 'gap' : 'gaps'}`;
    status = isRSVPRequested ? `${cluster.displayCount} open ${cluster.displayCount === 1 ? 'route' : 'routes'}` : 'Awaiting RSVPs';
    statusColor = red;
  } else if (isCoveredMode) {
    count = `${cluster.displayCount} covered`;
    status = 'All routes covered';
    statusColor = green;
  } else {
    count = `${cluster.totalCount} sites`;
    status = isRSVPRequested
      ? hasGaps
        ? `${cluster.gapCount} open ${cluster.gapCount === 1 ? 'route' : 'routes'}`
        : 'All routes covered'
      : `${cluster.totalCount} routes · Standby`;
    statusColor = hasGaps && isRSVPRequested ? red : hasGaps ? amber : green;
  }

  return `<div class="map-pin marker-enter">
    ${tileHtml(kind, { large: true, pulse: isRSVPRequested })}
    <div class="map-label map-label--tall ${glassClass(tone)}">
      <div class="flex flex-col gap-1 text-left">
        <div class="flex items-center gap-1.5">
          <span class="text-[12px] font-semibold tracking-[-0.02em]">${escapeHtml(cluster.zone)}</span>
          <span class="text-[11px] font-medium ${dark ? 'text-white/70' : 'text-[#141414]/65'}">· ${count}</span>
        </div>
        <span class="map-label__sub ${statusColor}">${status}</span>
      </div>
      <span class="map-chevron">${glyph('chevronRight', `w-3 h-3 ${dark ? 'text-white' : 'text-[#141414]/78'}`)}</span>
    </div>
  </div>`;
}

export interface SitePinOptions {
  level: PinLevel;
  tier: Tier | null;
  dist: number;
  tone: MapTone;
  index: number;
  isRSVPRequested: boolean;
  highlighted: boolean;
}

const STATUS_DOT: Record<SchoolStatus, string> = {
  covered: 'bg-emerald-500',
  'at-risk': 'bg-amber-500',
  gap: 'bg-red-500',
};

export function buildSitePinHtml(school: School, status: SchoolStatus, opts: SitePinOptions): string {
  const { level, tier, dist, tone, index, isRSVPRequested, highlighted } = opts;
  const kind: TileKind = status === 'gap' ? (isRSVPRequested ? 'gap' : 'standby') : status === 'at-risk' ? 'at-risk' : 'covered';
  const dotClass = status === 'gap' && !isRSVPRequested ? 'bg-slate-400' : STATUS_DOT[status];
  const tileDot = level === 'compact' && kind !== 'gap' && kind !== 'standby' ? dotClass : '';

  const tile = tileHtml(kind, { pulse: isRSVPRequested, tier, dot: tileDot });
  const label =
    level === 'detail'
      ? `<div class="map-label ${glassClass(tone)}">
          <span class="max-w-[120px] truncate">${escapeHtml(shortSchoolName(school.name))}</span>
          <span class="map-label__dot ${dotClass}"></span>
          ${tier ? `<span class="map-label__tier map-label__tier--${tier}">T${tier} · ${dist.toFixed(1)} mi</span>` : ''}
        </div>`
      : '';

  return `<div class="map-pin marker-enter${highlighted ? ' is-highlighted' : ''}" style="--i:${Math.min(index, 10)}">${tile}${label}</div>`;
}

export function buildWarehouseHtml(): string {
  return `<div class="map-pin marker-enter">${tileHtml('warehouse')}</div>`;
}
