import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Rental from '@/models/Rental';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;

    // Increment view counter
    const rental = await Rental.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!rental) {
      return NextResponse.json(
        { error: 'Rental vehicle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, views: rental.views });
  } catch (error: any) {
    console.error('Error incrementing rental views:', error);
    return NextResponse.json(
      { error: 'Failed to increment views', details: error.message },
      { status: 500 }
    );
  }
}
