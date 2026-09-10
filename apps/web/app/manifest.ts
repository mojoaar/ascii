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
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
