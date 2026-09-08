export const THEMES = ['terminal', 'catppuccin', 'dracula', 'nord', 'github', 'cyberpunk'] as const;
export type ThemeName = (typeof THEMES)[number];

export function isValidTheme(v: string): v is ThemeName {
  return (THEMES as readonly string[]).includes(v);
}

export function nextTheme(current: ThemeName): ThemeName {
  const i = THEMES.indexOf(current);
  return THEMES[(i + 1) % THEMES.length]!;
}
