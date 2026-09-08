import SiteHeader from '@/components/ui/SiteHeader';
import { SiteFooter } from '@/components/ui/SiteFooter';
import Generator from '@/components/gen/Generator';

export default function Home() {
  return (
    <div className="shell">
      <SiteHeader />
      <Generator />
      <SiteFooter />
    </div>
  );
}
