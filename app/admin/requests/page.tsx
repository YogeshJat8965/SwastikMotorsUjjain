import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import RequestsManagement from '@/components/admin/RequestsManagement';
import AdminLayout from '@/components/admin/AdminLayout';

export default async function AdminRequestsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout>
      <RequestsManagement />
    </AdminLayout>
  );
}
