import { readdir, readFile, writeFile, mkdir, copyFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';

const FONT_DIR = join(process.cwd(), 'data', 'fonts');
const OUT = join(FONT_DIR, 'fonts.json');
const CLI_FONT_DIR = join(process.cwd(), 'apps', 'cli', 'fonts');

function parseHeader(content) {
  // Header: first line magic "flf2a$ ..." or "tlf2a$ ...", following lines are comments until the char code.
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

function sourceFor(ext) {
  return ext === '.tlf' ? 'TOIlet font (bundled)' : 'figlet font (bundled)';
}

const fonts = [];
for (const f of await readdir(FONT_DIR)) {
  const ext = f.endsWith('.tlf') ? '.tlf' : f.endsWith('.flf') ? '.flf' : undefined;
  if (!ext) continue;
  const content = await readFile(join(FONT_DIR, f), 'utf8');
  const { author, copyright } = parseHeader(content);
  fonts.push({
    name: f.replace(/\.flf$|\.tlf$/, ''),
    author,
    source: sourceFor(ext),
    license: 'as declared in font header',
    copyright,
    format: ext.slice(1),
  });
}
fonts.sort((a, b) => a.name.localeCompare(b.name));
await writeFile(OUT, JSON.stringify(fonts, null, 2) + '\n');
console.log(`Wrote ${fonts.length} font entries to fonts.json`);

// Go's //go:embed rejects file names containing `'`, `"`, `` ` ``, or `\`.
// Sanitize only the CLI copy so data/fonts and the web app keep original names.
function cliSafeName(name) {
  return name.replace(/['"`\\]/g, '_');
}

await mkdir(CLI_FONT_DIR, { recursive: true });

// apps/cli/fonts is a pure build artifact (gitignored). Remove any stale
// .flf / fonts.json left over from a previous run so removed or renamed fonts
// don't linger in the Go embed.
let removed = 0;
for (const f of await readdir(CLI_FONT_DIR)) {
  if (f.endsWith('.flf') || f === 'fonts.json') {
    await unlink(join(CLI_FONT_DIR, f));
    removed++;
  }
}

const cliFonts = await readdir(FONT_DIR);
let copied = 0;
for (const f of cliFonts) {
  if (f.endsWith('.flf') || f.endsWith('.tlf') || f === 'fonts.json') {
    await copyFile(join(FONT_DIR, f), join(CLI_FONT_DIR, cliSafeName(f)));
    copied++;
  }
}
console.log(`Copied ${copied} files to apps/cli/fonts/ (removed ${removed} stale)`);
