import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Rental from '@/models/Rental';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;

    const rental = await Rental.findById(id)
      .select('-purchasePrice -maintenanceCost') // Don't send internal costs to frontend
      .lean();

    if (!rental) {
      return NextResponse.json(
        { error: 'Rental vehicle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(rental);
  } catch (error: any) {
    console.error('Error fetching rental:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rental', details: error.message },
      { status: 500 }
    );
  }
}
