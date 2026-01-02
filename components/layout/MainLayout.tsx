'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if current route is an admin page
  const isAdminPage = pathname?.startsWith('/admin');

  // For admin pages, render only the children (admin has its own layout)
  if (isAdminPage) {
    return <>{children}</>;
  }

  // For regular pages, render with navbar, footer, and bottom nav
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
