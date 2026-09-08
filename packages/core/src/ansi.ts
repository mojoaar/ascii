export interface Palette {
  primary: [number, number, number];
  secondary?: [number, number, number];
}

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

function colorAt(p: Palette, t: number): string {
  const [r1, g1, b1] = p.primary;
  const s = p.secondary ?? p.primary;
  const r = lerp(r1, s[0], t);
  const g = lerp(g1, s[1], t);
  const b = lerp(b1, s[2], t);
  return `\x1b[38;2;${r};${g};${b}m`;
}

export function toAnsi(text: string, palette: Palette): string {
  const lines = text.split('\n');
  const n = lines.length;
  return lines
    .map((line, i) => `${colorAt(palette, n === 1 ? 0 : i / (n - 1))}${line}\x1b[0m`)
    .join('\n');
}
