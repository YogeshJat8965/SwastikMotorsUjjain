import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await request.json();
    const { availableForRent, rentalPricePerDay } = body;

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      {
        availableForRent: availableForRent ?? false,
        rentalPricePerDay: availableForRent ? (rentalPricePerDay || 0) : 0,
      },
      { new: true }
    );

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      availableForRent: vehicle.availableForRent,
      rentalPricePerDay: vehicle.rentalPricePerDay,
    });
  } catch (error) {
    console.error('Error updating rental availability:', error);
    return NextResponse.json(
      { error: 'Failed to update rental availability' },
      { status: 500 }
    );
  }
}
