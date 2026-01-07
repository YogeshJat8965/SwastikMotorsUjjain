
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

    // Increment view counter
    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, views: vehicle.views },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error incrementing view counter:', error);
    return NextResponse.json(
      { error: 'Failed to update views', message: error.message },
      { status: 500 }
    );
  }
}
