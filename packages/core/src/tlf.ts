export interface ParsedTlf {
  hardblank: string;
  height: number;
  glyphs: Map<number, string[]>;
}

function runeWidth(s: string): number {
  let n = 0;
  for (const _ of s) n++;
  return n;
}

/** Parse a .tlf (TOIlet) or .flf (FIGlet) font file. Both formats share the
 *  same glyph storage; only the magic prefix differs. */
export function parseTlf(content: string): ParsedTlf {
  const lines = content.split('\n');
  if (lines.length === 0) throw new Error('empty font');
  const header = lines[0]!;
  if (header.length < 6 || (header.slice(0, 5) !== 'flf2a' && header.slice(0, 5) !== 'tlf2a')) {
    throw new Error('not a figlet/toilet font');
  }
  const hardblank = header[5]!;
  const toks = header.slice(6).trim().split(/\s+/).filter(Boolean);
  if (toks.length === 0) throw new Error('missing height');
  const height = parseInt(toks[0]!, 10);
  const commentLines = toks.length > 4 ? parseInt(toks[4]!, 10) : 0;

  const glyphs = new Map<number, string[]>();
  let idx = 1 + commentLines;
  for (let code = 32; code <= 126; code++) {
    const glyph: string[] = [];
    for (let row = 0; row < height; row++) {
      if (idx >= lines.length) {
        glyph.push('');
        idx++;
        continue;
      }
      const rawLine = lines[idx];
      if (rawLine === undefined) {
        glyph.push('');
        idx++;
        continue;
      }
      let line = rawLine.replace(/\r$/, '');
      idx++;
      if (line.length > 0 && line[line.length - 1] === '@') {
        line = line.slice(0, -1);
        if (line.length > 0 && line[line.length - 1] === '@') {
          line = line.slice(0, -1);
        }
      }
      glyph.push(line.replaceAll(hardblank, ' '));
    }
    glyphs.set(code, glyph);
  }
  return { hardblank, height, glyphs };
}

function glyphWidth(g: string[]): number {
  let w = 0;
  for (const row of g) {
    const rw = runeWidth(row);
    if (rw > w) w = rw;
  }
  return w;
}

function joinGlyphs(height: number, glyphs: string[][]): string {
  const out: string[] = new Array(height).fill('');
  for (const g of glyphs) {
    for (let i = 0; i < height; i++) {
      out[i] += g[i] ?? '';
    }
  }
  return out.join('\n');
}

/** Render text using a parsed .tlf font. When maxWidth > 0, breaks between whole
 * glyphs (a glyph is never split mid-column) using rune counts for width. */
export function renderTlf(font: ParsedTlf, text: string, maxWidth?: number): string {
  const selected: string[][] = [];
  for (const ch of text) {
    const g = font.glyphs.get(ch.codePointAt(0) ?? 0) ?? font.glyphs.get(63) ?? ['?'];
    selected.push(g);
  }

  if (!maxWidth || maxWidth <= 0) {
    return joinGlyphs(font.height, selected);
  }

  const lines: string[][][] = [];
  let cur: string[][] = [];
  let curW = 0;
  for (const g of selected) {
    const w = glyphWidth(g);
    if (cur.length > 0 && curW + w > maxWidth) {
      lines.push(cur);
      cur = [];
      curW = 0;
    }
    cur.push(g);
    curW += w;
  }
  if (cur.length > 0) lines.push(cur);

  return lines.map((ln) => joinGlyphs(font.height, ln)).join('\n');
}
