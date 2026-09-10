import type { MetadataRoute } from 'next';

const APP_URL = process.env.APP_URL ?? 'http://localhost:3000';
const now = new Date().toISOString();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${APP_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${APP_URL}/fonts`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${APP_URL}/docs`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];
}
