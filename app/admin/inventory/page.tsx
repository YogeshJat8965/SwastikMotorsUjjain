export const runtime = "edge";

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import InventoryManagement from '@/components/admin/InventoryManagement';
import AdminLayout from '@/components/admin/AdminLayout';

export default async function AdminInventoryPage() {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout>
      <InventoryManagement />
    </AdminLayout>
  );
}
