
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AddVehicleForm from '@/components/admin/AddVehicleForm';
import AdminLayout from '@/components/admin/AdminLayout';

export default async function AddVehiclePage() {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout>
      <AddVehicleForm />
    </AdminLayout>
  );
}
