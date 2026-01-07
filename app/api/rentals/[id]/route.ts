export const runtime = "edge";

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    console.log('Fetching rental with ID:', id);

    const vehicle = await Vehicle.findById(id)
      .select('-purchasePrice') // Don't send purchase price to frontend
      .lean();

    console.log('Vehicle found:', vehicle ? 'YES' : 'NO');

    if (!vehicle || !vehicle.availableForRent) {
      return NextResponse.json(
        { error: 'Rental vehicle not found' },
        { status: 404 }
      );
    }

    // Transform vehicle to rental format
    const rental = {
      _id: vehicle._id,
      title: vehicle.title,
      description: vehicle.description || `${vehicle.brand} ${vehicle.vehicleModel} ${vehicle.year} available for rent`,
      category: vehicle.category,
      brand: vehicle.brand,
      vehicleModel: vehicle.vehicleModel,
      year: vehicle.year,
      fuelType: vehicle.fuelType,
      transmission: vehicle.transmission,
      color: vehicle.color,
      city: vehicle.location?.city || '',
      state: vehicle.location?.state || '',
      dailyRate: vehicle.rentalPricePerDay || 0,
      weeklyRate: vehicle.rentalPricePerDay ? Math.round(vehicle.rentalPricePerDay * 7 * 0.85) : 0,
      monthlyRate: vehicle.rentalPricePerDay ? Math.round(vehicle.rentalPricePerDay * 30 * 0.70) : 0,
      securityDeposit: vehicle.rentalPricePerDay ? Math.round(vehicle.rentalPricePerDay * 5) : 5000,
      seatingCapacity: vehicle.category === 'car' ? 5 : 2,
      mileageLimit: 100,
      extraKmCharge: 5,
      features: [
        'Well Maintained',
        'Insurance Included',
        '24/7 Support',
        'Helmet/Safety Kit Included'
      ],
      status: 'available',
      minimumRentalDays: 1,
      maximumRentalDays: 30,
      rating: 4.5,
      totalBookings: 0,
      images: vehicle.images || [],
    };

    return NextResponse.json(rental);
  } catch (error: any) {
    console.error('Error fetching rental:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rental', details: error.message },
      { status: 500 }
    );
  }
}
