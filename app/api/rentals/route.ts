import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';

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

    // Build query - MUST have availableForRent = true
    const query: any = {
      availableForRent: true,
      status: 'for_sale', // Only show vehicles that are for sale (not sold)
      rentalPricePerDay: { $gte: minPrice, $lte: maxPrice },
    };

    // Category filter
    if (category !== 'all') {
      query.category = category;
    }

    // Search filter
    if (search) {
      query.$or = [
        { brand: { $regex: search, $options: 'i' } },
        { vehicleModel: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
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
        sortOptions = { rentalPricePerDay: 1 };
        break;
      case 'price_high':
        sortOptions = { rentalPricePerDay: -1 };
        break;
      case 'popular':
        sortOptions = { views: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const vehicles = await Vehicle.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .select('-purchasePrice') // Don't send purchase price to frontend
      .lean();

    // Transform vehicles to rentals format expected by frontend
    const rentals = vehicles.map(vehicle => ({
      _id: vehicle._id,
      title: vehicle.title,
      category: vehicle.category,
      brand: vehicle.brand,
      vehicleModel: vehicle.vehicleModel,
      year: vehicle.year,
      dailyRate: vehicle.rentalPricePerDay,
      weeklyRate: vehicle.rentalPricePerDay ? vehicle.rentalPricePerDay * 7 * 0.85 : 0, // 15% discount for weekly
      images: vehicle.images,
      transmission: vehicle.transmission,
      fuelType: vehicle.fuelType,
      seatingCapacity: vehicle.category === 'car' ? 5 : 2, // Default values
      city: vehicle.location?.city || '',
      status: 'available', // All rental vehicles are available
      isFeatured: vehicle.isFeatured,
      rating: 4.5, // Default rating
    }));

    // Get total count for pagination
    const total = await Vehicle.countDocuments(query);

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
      { 
        rentals: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 0,
          limit: 20,
        },
        error: 'Failed to fetch rentals',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
