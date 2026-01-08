
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';
import { requireAdmin } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;

    const vehicle = await Vehicle.findById(id)
      .select('-purchasePrice') // Don't send purchase price to frontend
      .lean();

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    // Don't show draft vehicles to public
    if (vehicle.status === 'draft') {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(vehicle, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicle', message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    await connectDB();
    
    const { id } = await params;
    const body = await request.json();

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      vehicle,
    });
  } catch (error: any) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to update vehicle', message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    await connectDB();
    
    const { id } = await params;

    const vehicle = await Vehicle.findByIdAndDelete(id);

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to delete vehicle', message: error.message },
      { status: 500 }
    );
  }
}
