
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';
import Booking from '@/models/Booking';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'month';

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    switch (range) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        startDate = new Date(0); // Beginning of time
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    // Fetch sold vehicles
    const soldVehicles = await Vehicle.find({
      status: 'sold',
      updatedAt: { $gte: startDate },
    });

    // Calculate total revenue and profit
    const totalRevenue = soldVehicles.reduce((sum, v) => sum + (v.sellingPrice || v.price || 0), 0);
    const totalProfit = soldVehicles.reduce((sum, v) => {
      const selling = v.sellingPrice || v.price || 0;
      const purchase = v.purchasePrice || 0;
      return sum + (selling - purchase);
    }, 0);
    const totalSales = soldVehicles.length;

    // Fetch rental bookings
    const completedBookings = await Booking.find({
      status: 'completed',
      createdAt: { $gte: startDate },
    }).lean();

    const rentalIncome = completedBookings.reduce((sum, b: any) => sum + (b.totalPrice || 0), 0);
    const totalRentals = completedBookings.length;

    // Monthly revenue breakdown
    const monthlyRevenue = [];
    const months = range === 'year' ? 12 : range === 'month' ? 4 : 7;
    
    for (let i = months - 1; i >= 0; i--) {
      const monthDate = new Date();
      if (range === 'year') {
        monthDate.setMonth(now.getMonth() - i);
      } else {
        monthDate.setDate(now.getDate() - (i * (range === 'week' ? 1 : 7)));
      }

      const monthStart = new Date(monthDate);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);

      const monthSales = soldVehicles.filter(v => {
        const updatedAt = new Date(v.updatedAt);
        return updatedAt >= monthStart && updatedAt < monthEnd;
      });

      const monthBookings = completedBookings.filter(b => {
        const createdAt = new Date((b as any).createdAt);
        return createdAt >= monthStart && createdAt < monthEnd;
      });

      const salesRevenue = monthSales.reduce((sum, v) => sum + (v.sellingPrice || v.price || 0), 0);
      const rentalRevenue = monthBookings.reduce((sum, b: any) => sum + (b.totalPrice || 0), 0);

      monthlyRevenue.push({
        month: monthDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
        amount: salesRevenue + rentalRevenue,
      });
    }

    // Top performing vehicles
    const vehicleSales = new Map();
    soldVehicles.forEach(vehicle => {
      const key = vehicle.title;
      if (!vehicleSales.has(key)) {
        vehicleSales.set(key, { title: key, sales: 0, revenue: 0 });
      }
      const data = vehicleSales.get(key);
      data.sales += 1;
      data.revenue += vehicle.sellingPrice || vehicle.price || 0;
    });

    const topVehicles = Array.from(vehicleSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Recent sales
    const recentSales = soldVehicles
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10)
      .map(v => ({
        title: v.title,
        date: v.updatedAt,
        profit: (v.sellingPrice || v.price || 0) - (v.purchasePrice || 0),
      }));

    return NextResponse.json({
      totalRevenue,
      totalProfit,
      totalSales,
      totalRentals,
      rentalIncome,
      monthlyRevenue,
      topVehicles,
      recentSales,
    });
  } catch (error: any) {
    console.error('Error generating report:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
