export const runtime = "edge";

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import RentalBookingsManagement from '@/components/admin/RentalBookingsManagement';
import AdminLayout from '@/components/admin/AdminLayout';

export default async function RentalBookingsPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout>
      <RentalBookingsManagement />
    </AdminLayout>
  );
}
