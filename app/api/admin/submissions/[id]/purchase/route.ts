import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';
import Vehicle from '@/models/Vehicle';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await request.json();
    const {
      purchasePrice,
      sellingPrice,
      availableForRent,
      rentalPricePerDay,
      additionalNotes,
    } = body;

    // Validate required fields
    if (!purchasePrice || !sellingPrice) {
      return NextResponse.json(
        { error: 'Purchase price and selling price are required' },
        { status: 400 }
      );
    }

    if (purchasePrice <= 0 || sellingPrice <= 0) {
      return NextResponse.json(
        { error: 'Prices must be greater than 0' },
        { status: 400 }
      );
    }

    // Find the submission
    const submission = await Submission.findById(id);

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    if (submission.status === 'purchased') {
      return NextResponse.json(
        { error: 'This submission has already been purchased' },
        { status: 400 }
      );
    }

    // Map fuel type from Submission to Vehicle enum
    const fuelTypeMap: Record<string, 'petrol' | 'diesel' | 'electric' | 'cng'> = {
      'Petrol': 'petrol',
      'Diesel': 'diesel',
      'Electric': 'electric',
      'CNG': 'cng',
      'Hybrid': 'electric', // Map Hybrid to electric as fallback
    };

    const mappedFuelType = fuelTypeMap[submission.fuelType] || 'petrol';
    const mappedTransmission = submission.transmission.toLowerCase() as 'manual' | 'automatic';

    // Create vehicle from submission
    const vehicle = await Vehicle.create({
      title: `${submission.brand} ${submission.vehicleModel} ${submission.year}`,
      description: submission.description || `${submission.brand} ${submission.vehicleModel} ${submission.year} in excellent condition. ${submission.kilometers.toLocaleString('en-IN')} km driven. ${submission.fuelType} fuel, ${submission.transmission} transmission. ${submission.color || 'Standard'} color. ${submission.owners || 1} owner(s). Located in ${submission.city}, ${submission.state}.`,
      category: submission.category,
      brand: submission.brand,
      vehicleModel: submission.vehicleModel,
      year: submission.year,
      price: parseFloat(sellingPrice), // Set price to selling price
      purchasePrice: parseFloat(purchasePrice),
      sellingPrice: parseFloat(sellingPrice),
      images: submission.images,
      fuelType: mappedFuelType,
      transmission: mappedTransmission,
      kilometers: submission.kilometers,
      color: submission.color || '',
      owners: submission.owners || 1,
      location: {
        city: submission.city,
        state: submission.state,
      },
      status: 'for_sale',
      availableForRent: availableForRent || false,
      rentalPricePerDay: availableForRent ? parseFloat(rentalPricePerDay) || 0 : 0,
      isFeatured: false,
      views: 0,
      contacts: 0,
      adminNotes: additionalNotes || '',
      sourceSubmissionId: submission._id,
    });

    // Update submission status to purchased
    await Submission.findByIdAndUpdate(id, {
      status: 'purchased',
      adminNotes: `Purchased for ₹${parseFloat(purchasePrice).toLocaleString('en-IN')}. Listed for ₹${parseFloat(sellingPrice).toLocaleString('en-IN')}. ${additionalNotes || ''}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Vehicle purchased and added to inventory',
      vehicleId: vehicle._id.toString(),
      profit: parseFloat(sellingPrice) - parseFloat(purchasePrice),
    });
  } catch (error) {
    console.error('Error purchasing vehicle:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to purchase vehicle',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
