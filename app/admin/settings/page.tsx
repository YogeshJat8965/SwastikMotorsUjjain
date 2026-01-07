
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import SettingsManagement from '@/components/admin/SettingsManagement';
import AdminLayout from '@/components/admin/AdminLayout';

export default async function AdminSettingsPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout>
      <SettingsManagement />
    </AdminLayout>
  );
}
