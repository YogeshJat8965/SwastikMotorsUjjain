export const runtime = "edge";

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import EditVehicleForm from '@/components/admin/EditVehicleForm';
import AdminLayout from '@/components/admin/AdminLayout';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditVehiclePage({ params }: PageProps) {
  const session = await getSession();
  
  if (!session) {
    redirect('/admin/login');
  }

  const { id } = await params;

  return (
    <AdminLayout>
      <EditVehicleForm vehicleId={id} />
    </AdminLayout>
  );
}
