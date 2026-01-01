import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      vehicleId,
      customerName,
      customerPhone,
      customerEmail,
      startDate,
      endDate,
      totalDays,
      totalPrice,
      pickupLocation,
    } = body;

    // Validate required fields
    if (!vehicleId || !customerName || !customerPhone || !customerEmail || !startDate || !endDate || !pickupLocation) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Check for date conflicts - find bookings for same vehicle with overlapping dates
    const conflictingBookings = await Booking.find({
      vehicle: vehicleId,
      status: { $in: ['pending', 'confirmed'] }, // Only check active bookings
      $or: [
        // New booking starts during an existing booking
        {
          startDate: { $lte: start },
          endDate: { $gte: start },
        },
        // New booking ends during an existing booking
        {
          startDate: { $lte: end },
          endDate: { $gte: end },
        },
        // New booking completely contains an existing booking
        {
          startDate: { $gte: start },
          endDate: { $lte: end },
        },
      ],
    });

    if (conflictingBookings.length > 0) {
      return NextResponse.json(
        {
          error: 'This vehicle is already booked for the selected dates',
          conflicts: conflictingBookings.map(b => ({
            startDate: b.startDate,
            endDate: b.endDate,
          })),
        },
        { status: 409 }
      );
    }

    // Create booking
    const booking = await Booking.create({
      vehicle: vehicleId,
      customerName,
      customerPhone,
      customerEmail,
      customerWhatsapp: customerPhone, // Use phone as WhatsApp by default
      startDate: start,
      endDate: end,
      totalDays: totalDays || Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1,
      totalPrice,
      pickupLocation,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      bookingId: booking._id.toString(),
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
