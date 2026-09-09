import { cookies } from 'next/headers';
import { isAdminEnabled, ADMIN_SESSION_COOKIE, verifyAdminSession } from '@/lib/admin-auth';
import SiteHeader from '@/components/ui/SiteHeader';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminPanel from '@/components/admin/AdminPanel';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!isAdminEnabled()) {
    return (
      <div className="shell">
        <SiteHeader />
        <main className="admin">
          <h1>Admin</h1>
          <p>Admin is disabled. Set the <code>ADMIN_TOKEN</code> environment variable to enable it.</p>
        </main>
      </div>
    );
  }
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
