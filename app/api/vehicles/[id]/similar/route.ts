
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;

    // Get the current vehicle to match similar ones
    const currentVehicle = await Vehicle.findById(id).lean();

    if (!currentVehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    // Find similar vehicles
    const minPrice = currentVehicle.sellingPrice * 0.8; // 20% lower
    const maxPrice = currentVehicle.sellingPrice * 1.2; // 20% higher

    const similarVehicles = await Vehicle.find({
      _id: { $ne: currentVehicle._id }, // Exclude current vehicle
      category: currentVehicle.category, // Same category
      status: 'for_sale', // Only for sale
      sellingPrice: { $gte: minPrice, $lte: maxPrice }, // Similar price range
    })
      .select('-purchasePrice')
      .limit(4)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ vehicles: similarVehicles }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching similar vehicles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch similar vehicles', message: error.message },
      { status: 500 }
    );
  }
}
