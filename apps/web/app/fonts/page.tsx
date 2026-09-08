import { listFonts } from '@ascii/core';
import { SiteHeader } from '@/components/ui/SiteHeader';
import { SiteFooter } from '@/components/ui/SiteFooter';
import FontCard from '@/components/fonts/FontCard';

export const dynamic = 'force-dynamic';

export default async function FontsPage() {
  const fonts = await listFonts();
  return (
    <div className="shell">
      <SiteHeader />
      <main className="fonts-page">
        <h1>Fonts</h1>
        <div className="font-grid">
          {fonts.map((f) => (
            <FontCard key={f.name} font={f} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
