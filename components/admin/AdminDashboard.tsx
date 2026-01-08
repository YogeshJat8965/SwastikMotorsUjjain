'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Car,
  Bell,
  IndianRupee,
  Plus,
  FileText,
  Calendar,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface DashboardStats {
  totalVehicles: number;
  newRequests: number;
  profitThisMonth: number;
  newBookings: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    newRequests: 0,
    profitThisMonth: 0,
    newBookings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch stats from API endpoints
      const [vehiclesRes, submissionsRes, bookingsRes] = await Promise.all([
        fetch('/api/vehicles'),
        fetch('/api/submissions'),
        fetch('/api/bookings'),
      ]);

      const vehiclesData = await vehiclesRes.json();
      const submissionsData = await submissionsRes.json();
      const bookingsData = await bookingsRes.json();

      // Calculate stats
      setStats({
        totalVehicles: vehiclesData.vehicles?.length || 0,
        newRequests: submissionsData.filter((s: any) => s.status === 'pending').length || 0,
        profitThisMonth: 0, // TODO: Calculate from sales data
        newBookings: Array.isArray(bookingsData) ? bookingsData.filter((b: any) => b.status === 'pending').length : 0,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Vehicles',
      value: stats.totalVehicles,
      icon: Car,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'New Requests',
      value: stats.newRequests,
      icon: Bell,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      badge: stats.newRequests > 0,
      onClick: () => router.push('/admin/requests'),
    },
    {
      title: 'Profit This Month',
      value: `₹${stats.profitThisMonth.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  const quickActions = [
    {
      title: 'Add New Vehicle',
      icon: Plus,
      color: 'bg-blue-600',
      onClick: () => router.push('/admin/inventory/add'),
    },
    {
      title: 'Review Requests',
      icon: FileText,
      color: 'bg-orange-600',
      badge: stats.newRequests,
      onClick: () => router.push('/admin/requests'),
    },
    {
      title: 'View Bookings',
      icon: Calendar,
      color: 'bg-purple-600',
      badge: stats.newBookings,
      onClick: () => router.push('/admin/rentals'),
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back! 👋</h2>
          <p className="text-gray-600">Here's what's happening with your business today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <div
              key={index}
              onClick={card.onClick}
              className={`${card.bgColor} rounded-2xl p-6 border border-gray-100 shadow-sm transition-all hover:shadow-md ${
                card.onClick ? 'cursor-pointer' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                {card.badge && (
                  <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-orange-600 shadow-sm">
                    {card.value}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">{card.title}</h3>
              <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`${action.color} text-white rounded-xl p-6 flex items-center justify-between hover:opacity-90 transition-opacity relative overflow-hidden group`}
              >
                <div className="flex items-center gap-4">
                  <action.icon className="w-8 h-8" />
                  <span className="font-semibold text-lg">{action.title}</span>
                </div>
                {action.badge && action.badge > 0 && (
                  <span className="absolute top-3 right-3 px-3 py-1 bg-white/20 rounded-full text-sm font-bold">
                    {action.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        </div>
    </div>
  );
}
