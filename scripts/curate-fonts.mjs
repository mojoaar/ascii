import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const FONT_DIR = join(process.cwd(), 'data', 'fonts');
const OUT = join(FONT_DIR, 'fonts.json');

function parseHeader(content) {
  // Header: first line magic "flf2a$ ...", following lines are comments until the char code.
  const lines = content.split('\n');
  const comments = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^\d/.test(line)) break;
    if (line.trim()) comments.push(line.trim());
  }
  const blob = comments.join(' ');
  const author = (blob.match(/by ([A-Za-z0-9 .'\-&]+)/i) ?? [])[1] ?? 'Unknown';
  const copyright = (blob.match(/(\(c\)|copyright|©).{0,120}/i) ?? [])[0] ?? '';
  return { author: author.trim(), copyright: copyright.trim() };
}

const fonts = [];
for (const f of await readdir(FONT_DIR)) {
  if (!f.endsWith('.flf')) continue;
  const content = await readFile(join(FONT_DIR, f), 'utf8');
  const { author, copyright } = parseHeader(content);
  fonts.push({
    name: f.replace(/\.flf$/, ''),
    author,
    source: 'figlet font (bundled)',
    license: 'as declared in font header',
    copyright,
  });
}
fonts.sort((a, b) => a.name.localeCompare(b.name));
await writeFile(OUT, JSON.stringify(fonts, null, 2) + '\n');
console.log(`Wrote ${fonts.length} font entries to fonts.json`);
