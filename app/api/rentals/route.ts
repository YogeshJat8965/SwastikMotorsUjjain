import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Rental from '@/models/Rental';

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const category = searchParams.get('category') || 'all';
    const search = searchParams.get('search') || '';
    const minPrice = parseInt(searchParams.get('minPrice') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '100000');
    const transmission = searchParams.get('transmission') || 'all';
    const fuelType = searchParams.get('fuelType') || 'all';
    const sort = searchParams.get('sort') || 'latest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const featured = searchParams.get('featured');

    // Build query
    const query: any = {
      status: { $in: ['available', 'rented'] }, // Show available and rented (to show popularity)
      dailyRate: { $gte: minPrice, $lte: maxPrice },
    };

    // Only show available for booking
    if (featured !== 'true') {
      query.status = 'available';
    }

    // Category filter
    if (category !== 'all') {
      query.category = category;
    }

    // Search filter
    if (search) {
      query.$or = [
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    // Transmission filter
    if (transmission !== 'all') {
      query.transmission = transmission;
    }

    // Fuel type filter
    if (fuelType !== 'all') {
      query.fuelType = fuelType;
    }

    // Featured filter
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Sorting
    let sortOptions: any = {};
    switch (sort) {
      case 'latest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'price_low':
        sortOptions = { dailyRate: 1 };
        break;
      case 'price_high':
        sortOptions = { dailyRate: -1 };
        break;
      case 'popular':
        sortOptions = { totalBookings: -1, views: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const rentals = await Rental.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .select('-purchasePrice -maintenanceCost') // Don't send internal costs to frontend
      .lean();

    // Get total count for pagination
    const total = await Rental.countDocuments(query);

    return NextResponse.json({
      rentals,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error: any) {
    console.error('Error fetching rentals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rentals', details: error.message },
      { status: 500 }
    );
  }
}
