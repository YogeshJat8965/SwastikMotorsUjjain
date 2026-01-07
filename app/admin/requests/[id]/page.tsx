export const runtime = "edge";

import AdminLayout from '@/components/admin/AdminLayout';
import SubmissionDetail from '@/components/admin/SubmissionDetail';

export default async function SubmissionDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  return (
    <AdminLayout>
      <SubmissionDetail submissionId={id} />
    </AdminLayout>
  );
}
