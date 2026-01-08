'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, IndianRupee, ShoppingCart, Calendar, Download, BarChart3 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

interface ReportData {
  totalRevenue: number;
  totalProfit: number;
  totalSales: number;
  totalRentals: number;
  monthlyRevenue: { month: string; amount: number }[];
  topVehicles: { title: string; sales: number; revenue: number }[];
  recentSales: { title: string; date: string; profit: number }[];
  rentalIncome: number;
}

export default function ReportsManagement() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReportData | null>(null);
  const [dateRange, setDateRange] = useState('month'); // 'week', 'month', 'year'

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports?range=${dateRange}`);
      if (response.ok) {
        const reportData = await response.json();
        setData(reportData);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!data) return;

    const csvContent = [
      ['Metric', 'Value'],
      ['Total Revenue', `₹${data.totalRevenue}`],
      ['Total Profit', `₹${data.totalProfit}`],
      ['Total Sales', data.totalSales],
      ['Total Rentals', data.totalRentals],
      ['Rental Income', `₹${data.rentalIncome}`],
      [],
      ['Top Vehicles'],
      ['Vehicle', 'Sales', 'Revenue'],
      ...data.topVehicles.map(v => [v.title, v.sales, `₹${v.revenue}`]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `swastik-bikes-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600">Unable to load report data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
            <p className="text-gray-600">Track your business performance</p>
          </div>

          <div className="flex gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
              <option value="all">All Time</option>
            </select>

            <Button
              variant="primary"
              onClick={exportToCSV}
              icon={<Download className="w-5 h-5" />}
            >
              Export CSV
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <IndianRupee className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-6 h-6 opacity-60" />
            </div>
            <p className="text-blue-100 text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold">₹{data.totalRevenue.toLocaleString('en-IN')}</p>
          </div>

          {/* Total Profit */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <span className="text-sm opacity-60">Profit</span>
            </div>
            <p className="text-green-100 text-sm mb-1">Total Profit</p>
            <p className="text-3xl font-bold">₹{data.totalProfit.toLocaleString('en-IN')}</p>
            <p className="text-green-100 text-xs mt-2">
              {data.totalRevenue > 0 
                ? `${((data.totalProfit / data.totalRevenue) * 100).toFixed(1)}% margin`
                : '0% margin'}
            </p>
          </div>

          {/* Total Sales */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <ShoppingCart className="w-8 h-8 opacity-80" />
              <span className="text-sm opacity-60">Sales</span>
            </div>
            <p className="text-purple-100 text-sm mb-1">Total Sales</p>
            <p className="text-3xl font-bold">{data.totalSales}</p>
            <p className="text-purple-100 text-xs mt-2">Vehicles sold</p>
          </div>

          {/* Rental Income */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 opacity-80" />
              <span className="text-sm opacity-60">Rentals</span>
            </div>
            <p className="text-orange-100 text-sm mb-1">Rental Income</p>
            <p className="text-3xl font-bold">₹{data.rentalIncome.toLocaleString('en-IN')}</p>
            <p className="text-orange-100 text-xs mt-2">{data.totalRentals} bookings</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Revenue</h3>
            <div className="space-y-4">
              {data.monthlyRevenue.map((item, index) => {
                const maxRevenue = Math.max(...data.monthlyRevenue.map(m => m.amount));
                const percentage = maxRevenue > 0 ? (item.amount / maxRevenue) * 100 : 0;
                
                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">{item.month}</span>
                      <span className="font-bold text-blue-600">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Performing Vehicles */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Top Performing Vehicles</h3>
            <div className="space-y-4">
              {data.topVehicles.map((vehicle, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{vehicle.title}</p>
                      <p className="text-sm text-gray-600">{vehicle.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      ₹{vehicle.revenue.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>
              ))}

              {data.topVehicles.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No sales data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Sales</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Vehicle</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Profit</th>
                </tr>
              </thead>
              <tbody>
                {data.recentSales.map((sale, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{sale.title}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(sale.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 text-sm text-right">
                      <span className="font-bold text-green-600">
                        +₹{sale.profit.toLocaleString('en-IN')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {data.recentSales.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>No recent sales</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
