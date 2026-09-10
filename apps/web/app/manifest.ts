import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ASCII Generator',
    short_name: 'ASCII',
    description: 'Self-hosted FIGlet / ASCII art generator',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f1117',
    theme_color: '#11131a',
    orientation: 'portrait',
    icons: [
      {
        src: '/favicons/candidates/c1-terminal-a.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
