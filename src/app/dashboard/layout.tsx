import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Sidebar } from '@/components/dashboard/sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  const userInfo = {
    email: user.email || '',
    name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
    avatarUrl: user.user_metadata?.avatar_url || null,
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={userInfo} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
