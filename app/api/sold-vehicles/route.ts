
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SoldVehicle from '@/models/SoldVehicle';

// GET - Fetch sold vehicles for public display
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const featured = searchParams.get('featured') === 'true';

    await connectDB();

    const query: any = {};
    if (featured) {
      query.featured = true;
    }

    const soldVehicles = await SoldVehicle.find(query)
      .sort({ soldDate: -1 })
      .limit(limit)
      .select('-__v');

    return NextResponse.json({
      success: true,
      soldVehicles,
      count: soldVehicles.length,
    });
  } catch (error: any) {
    console.error('Error fetching sold vehicles:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sold vehicles' },
      { status: 500 }
    );
  }
}
