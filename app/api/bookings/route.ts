import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { requireAdmin } from '@/lib/auth';

// GET /api/bookings - Get all bookings (admin only)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const bookings = await Booking.find()
      .populate('vehicle', 'title images rentalPricePerDay')
      .sort({ createdAt: -1 });

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create new booking (public)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const data = await request.json();

    const booking = await Booking.create({
      vehicle: data.vehicleId,
      startDate: data.startDate,
      endDate: data.endDate,
      totalDays: data.totalDays,
      totalPrice: data.totalPrice,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      pickupLocation: data.pickupLocation,
      status: 'pending',
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
