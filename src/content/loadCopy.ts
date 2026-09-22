/**
 * Parse a copy markdown file into nested objects.
 *
 *   # Page          ignored title
 *   ## block        object (dots nest: caseStudies.adopt)
 *   ### field       string, list, or paragraphs
 *   - item          list under the current field or block
 *   - [label](href) link item
 *   - k: v | k: v   keyed list item
 *
 * Consecutive lines join with a space. A blank line starts another paragraph
 * (the field becomes a string array).
 */

export type CopyValue = string | string[] | CopyRecord | CopyValue[];
export type CopyRecord = { [key: string]: CopyValue };

export function parseCopyMarkdown(raw: string): CopyRecord {
  const root: CopyRecord = {};
  let sectionPath = '';
  let fieldName = '';
  let buf: string[] = [];

  const flushField = () => {
    if (!sectionPath || !fieldName) return;
    setPath(root, `${sectionPath}.${fieldName}`, parseField(buf));
    fieldName = '';
    buf = [];
  };

  const flushSectionList = () => {
    if (!sectionPath || fieldName || buf.length === 0) return;
    setPath(root, sectionPath, parseField(buf));
    buf = [];
  };

  for (const line of raw.replace(/\r\n/g, '\n').split('\n')) {
    if (line.startsWith('# ') || line.startsWith('<!--')) continue;

    const section = line.match(/^##\s+(.+?)\s*$/);
    if (section) {
      flushField();
      flushSectionList();
      sectionPath = section[1]!.trim();
      fieldName = '';
      buf = [];
      continue;
    }

    const field = line.match(/^###\s+(.+?)\s*$/);
    if (field) {
      flushField();
      flushSectionList();
      fieldName = field[1]!.trim();
      buf = [];
      continue;
    }

    if (!sectionPath) continue;
    buf.push(line);
  }

  flushField();
  flushSectionList();
  return root;
}

export function text(value: CopyValue | undefined, fallback = ''): string {
  if (value == null) return fallback;
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
    return value.join('\n');
  }
  return fallback;
}

export function lines(value: CopyValue | undefined): string[] {
  if (value == null) return [];
  if (typeof value === 'string') return [value];
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const item of value) {
    if (typeof item === 'string') out.push(item);
  }
  return out;
}

export function record(value: CopyValue | undefined): CopyRecord {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  return {};
}

export function records(value: CopyValue | undefined): CopyRecord[] {
  const obj = record(value);
  return Object.keys(obj)
    .sort((a, b) => Number(a) - Number(b) || a.localeCompare(b))
    .map((key) => record(obj[key]));
}

export function linkItems(value: CopyValue | undefined): { label: string; href: string }[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      const label = text(item.label);
      const href = text(item.href);
      if (label && href) return [{ label, href }];
    }
    return [];
  });
}

export function keyedItems(value: CopyValue | undefined): CopyRecord[] {
  if (!Array.isArray(value)) return [];
  const out: CopyRecord[] = [];
  for (const item of value) {
    if (item && typeof item === 'object' && !Array.isArray(item)) out.push(item);
  }
  return out;
}

function parseField(buf: string[]): CopyValue {
  const trimmed = buf.join('\n').replace(/^\n+|\n+$/g, '');
  if (!trimmed) return '';

  const rawLines = trimmed.split('\n');
  const listLines = rawLines.filter((line) => line.trim().length > 0);
  if (listLines.length > 0 && listLines.every((line) => /^\s*-\s+/.test(line))) {
    return listLines.map((line) => parseListItem(line.replace(/^\s*-\s+/, '').trim()));
  }

  const paragraphs = trimmed
    .split(/\n{2,}/)
    .map((part) => part.split('\n').map((line) => line.trim()).filter(Boolean).join(' '))
    .filter(Boolean);

  if (paragraphs.length > 1) return paragraphs;
  return paragraphs[0] ?? '';
}

function parseListItem(text: string): CopyValue {
  const link = text.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (link) return { label: link[1]!, href: link[2]! };

  if (text.includes('|') && text.includes(':')) {
    const obj: CopyRecord = {};
    for (const part of text.split('|')) {
      const idx = part.indexOf(':');
      if (idx === -1) continue;
      obj[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
    }
    if (Object.keys(obj).length > 0) return obj;
  }

  return text;
}

export type CopyLink = { label: string; href: string };

export type CopyChunk = {
  heading: string;
  headingLines: string[];
  paras: string[];
  list: string[];
  links: CopyLink[];
};

export type CopySection = CopyChunk & {
  children: CopyChunk[];
};

export type CopyPage = {
  h1: string;
  h1Lines: string[];
  intro: string[];
  introList: string[];
  introLinks: CopyLink[];
  groups: string[][];
  sections: CopySection[];
};

function emptyChunk(heading = '', headingLines: string[] = []): CopyChunk {
  return { heading, headingLines, paras: [], list: [], links: [] };
}

function parseBodyParts(buf: string[]): Pick<CopyChunk, 'paras' | 'list' | 'links'> {
  const trimmed = buf.join('\n').replace(/^\n+|\n+$/g, '');
  if (!trimmed) return { paras: [], list: [], links: [] };

  const blocks = trimmed.split(/\n{2,}/);
  const paras: string[] = [];
  const list: string[] = [];
  const links: CopyLink[] = [];

  for (const block of blocks) {
    const rawLines = block
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    if (rawLines.length === 0) continue;

    if (rawLines.every((line) => /^\s*-\s+/.test(line))) {
      for (const line of rawLines) {
        const item = parseListItem(line.replace(/^\s*-\s+/, '').trim());
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          const label = text(item.label);
          const href = text(item.href);
          if (label && href) {
            links.push({ label, href });
            list.push(label);
            continue;
          }
        }
        if (typeof item === 'string') list.push(item);
      }
      continue;
    }

    const shortLines = rawLines.length > 1 && rawLines.every((line) => line.length <= 48);
    paras.push(shortLines ? rawLines.join('\n') : rawLines.join(' '));
  }

  return { paras, list, links };
}

function applyBody(target: CopyChunk, buf: string[]) {
  const parts = parseBodyParts(buf);
  target.paras = parts.paras;
  target.list = parts.list;
  target.links = parts.links;
}

/**
 * Page-shaped copy: headings and paragraphs are the words on screen.
 * `#` / `##` / `###` match h1 / h2 / h3. Lists and paragraphs are body.
 */
export function parseCopyPage(raw: string): CopyPage {
  const page: CopyPage = {
    h1: '',
    h1Lines: [],
    intro: [],
    introList: [],
    introLinks: [],
    groups: [],
    sections: [],
  };

  let section: CopySection | null = null;
  let child: CopyChunk | null = null;
  let buf: string[] = [];
  let h1Continue = false;
  let headingContinue: 'section' | 'child' | null = null;

  const flushBody = () => {
    if (child && section) applyBody(child, buf);
    else if (section) applyBody(section, buf);
    else {
      const parts = parseBodyParts(buf);
      page.intro = parts.paras;
      page.introList = parts.list;
      page.introLinks = parts.links;
    }
    buf = [];
  };

  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  let group: string[] = [];
  const flushGroup = () => {
    if (group.length > 0) page.groups.push(group);
    group = [];
  };

  for (const line of lines) {
    if (line.startsWith('<!--')) continue;

    const h1 = line.match(/^#\s+(.+?)\s*$/);
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    const h3 = line.match(/^###\s+(.+?)\s*$/);

    if (h1 || h2 || h3) {
      flushBody();
      flushGroup();
      h1Continue = false;
      headingContinue = null;
    }

    if (h1) {
      page.h1 = h1[1]!;
      page.h1Lines = [h1[1]!];
      h1Continue = true;
      continue;
    }

    if (h2) {
      section = { ...emptyChunk(h2[1]!, [h2[1]!]), children: [] };
      page.sections.push(section);
      child = null;
      headingContinue = 'section';
      continue;
    }

    if (h3) {
      if (!section) {
        section = { ...emptyChunk('', []), children: [] };
        page.sections.push(section);
      }
      child = emptyChunk(h3[1]!, [h3[1]!]);
      section.children.push(child);
      headingContinue = 'child';
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      if (h1Continue) h1Continue = false;
      headingContinue = null;
      flushGroup();
      buf.push('');
      continue;
    }

    if (h1Continue) {
      page.h1Lines.push(trimmed);
      page.h1 = page.h1Lines.join(' ');
      continue;
    }

    if (headingContinue === 'section' && section) {
      section.headingLines.push(trimmed);
      section.heading = section.headingLines.join(' ');
      continue;
    }

    if (headingContinue === 'child' && child) {
      child.headingLines.push(trimmed);
      child.heading = child.headingLines.join(' ');
      continue;
    }

    group.push(trimmed);
    buf.push(line);
  }

  flushBody();
  flushGroup();
  return page;
}

export function sectionAt(page: CopyPage, index: number): CopySection {
  return page.sections[index] ?? { ...emptyChunk(), children: [] };
}

export function childAt(section: CopySection, index: number): CopyChunk {
  return section.children[index] ?? emptyChunk();
}

export type RichTextPart = { text: string; href?: string };

/** Split a sentence that may contain `[label](href)` into text + link parts. */
export function parseInlineLinks(raw: string): RichTextPart[] {
  const parts: RichTextPart[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null = re.exec(raw);
  while (match) {
    if (match.index > last) parts.push({ text: raw.slice(last, match.index) });
    parts.push({ text: match[1]!, href: match[2]! });
    last = match.index + match[0].length;
    match = re.exec(raw);
  }
  if (last < raw.length) parts.push({ text: raw.slice(last) });
  return parts.filter((part) => part.text.length > 0);
}

function setPath(root: CopyRecord, path: string, value: CopyValue) {
  const parts = path.split('.');
  let cursor: CopyRecord = root;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const key = parts[i]!;
    const next = cursor[key];
    if (!next || typeof next !== 'object' || Array.isArray(next)) {
      cursor[key] = {};
    }
    cursor = cursor[key] as CopyRecord;
  }
  cursor[parts[parts.length - 1]!] = value;
}
