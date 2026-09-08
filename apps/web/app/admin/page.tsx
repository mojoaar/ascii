import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { isAdminEnabled, ADMIN_SESSION_COOKIE, verifyAdminSession } from '@/lib/admin-auth';
import SiteHeader from '@/components/ui/SiteHeader';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminPanel from '@/components/admin/AdminPanel';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!isAdminEnabled()) notFound();
  const cookie = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value ?? null;
  const authed = verifyAdminSession(cookie);

  return (
    <div className="shell">
      <SiteHeader />
      <main className="admin">
        <h1>Admin</h1>
        {authed ? <AdminPanel /> : <AdminLogin />}
      </main>
    </div>
  );
}
