export const runtime = "edge";

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import ReportsManagement from '@/components/admin/ReportsManagement';
import AdminLayout from '@/components/admin/AdminLayout';

export default async function AdminReportsPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout>
      <ReportsManagement />
    </AdminLayout>
  );
}
