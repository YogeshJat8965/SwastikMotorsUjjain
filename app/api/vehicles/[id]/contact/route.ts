
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { $inc: { contacts: 1 } },
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
      contacts: vehicle.contacts,
    });
  } catch (error) {
    console.error('Error incrementing contacts:', error);
    return NextResponse.json(
      { error: 'Failed to increment contacts' },
      { status: 500 }
    );
  }
}
