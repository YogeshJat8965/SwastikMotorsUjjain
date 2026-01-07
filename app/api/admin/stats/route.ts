
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';
import Booking from '@/models/Booking';
import Submission from '@/models/Submission';

export async function GET() {
  try {
    await connectDB();

    // Count vehicles
    const totalVehicles = await Vehicle.countDocuments();
    const forSale = await Vehicle.countDocuments({ status: 'for_sale' });
    const sold = await Vehicle.countDocuments({ status: 'sold' });
    const availableForRent = await Vehicle.countDocuments({ availableForRent: true });

    // Count bookings
    const totalBookings = await Booking.countDocuments();
    const activeRentals = await Booking.countDocuments({ 
      status: { $in: ['pending', 'confirmed'] } 
    });
    const completedRentals = await Booking.countDocuments({ status: 'completed' });
    const cancelledRentals = await Booking.countDocuments({ status: 'cancelled' });

    // Count submissions
    const totalRequests = await Submission.countDocuments();
    const pendingRequests = await Submission.countDocuments({ status: 'pending' });
    const approvedRequests = await Submission.countDocuments({ status: 'approved' });
    const purchasedRequests = await Submission.countDocuments({ status: 'purchased' });

    // Calculate revenue
    const soldVehicles = await Vehicle.find({ status: 'sold' }).select('purchasePrice sellingPrice');
    const totalRevenue = soldVehicles.reduce((sum, v) => sum + (v.sellingPrice || 0), 0);
    const totalProfit = soldVehicles.reduce((sum, v) => 
      sum + ((v.sellingPrice || 0) - (v.purchasePrice || 0)), 0
    );

    // Calculate rental revenue from completed bookings
    const completedBookings = await Booking.find({ status: 'completed' }).select('totalPrice');
    const rentalRevenue = completedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    return NextResponse.json({
      vehicles: {
        total: totalVehicles,
        forSale,
        sold,
        availableForRent
      },
      bookings: {
        total: totalBookings,
        active: activeRentals,
        completed: completedRentals,
        cancelled: cancelledRentals
      },
      requests: {
        total: totalRequests,
        pending: pendingRequests,
        approved: approvedRequests,
        purchased: purchasedRequests
      },
      revenue: {
        totalSales: totalRevenue,
        profit: totalProfit,
        rentalRevenue,
        totalRevenue: totalRevenue + rentalRevenue
      },
      // Legacy format for backward compatibility
      totalVehicles,
      activeRentals,
      pendingRequests,
      totalRevenue: totalRevenue + rentalRevenue,
      totalProfit: totalProfit + rentalRevenue
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
