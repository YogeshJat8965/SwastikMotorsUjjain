import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SoldVehicle from '@/models/SoldVehicle';
import { validateAdminSession } from '@/lib/auth';

// DELETE - Delete a sold vehicle entry
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await validateAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const soldVehicle = await SoldVehicle.findByIdAndDelete(id);

    if (!soldVehicle) {
      return NextResponse.json(
        { error: 'Sold vehicle entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Sold vehicle entry deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting sold vehicle:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete sold vehicle entry' },
      { status: 500 }
    );
  }
}

// PUT - Update a sold vehicle entry
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await validateAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    await connectDB();

    const soldVehicle = await SoldVehicle.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!soldVehicle) {
      return NextResponse.json(
        { error: 'Sold vehicle entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      soldVehicle,
      message: 'Sold vehicle entry updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating sold vehicle:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update sold vehicle entry' },
      { status: 500 }
    );
  }
}
