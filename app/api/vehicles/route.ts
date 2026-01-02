import { NextRequest, NextResponse } from 'next/server';
import { getVehicles, getAvailableBrands, getAvailableLocations } from '@/lib/queries/vehicleQueries';
import connectDB from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const filters = {
      category: searchParams.get('category') as 'bike' | 'car' | 'all' || 'all',
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      brand: searchParams.get('brand') || undefined,
      year: searchParams.get('year') ? Number(searchParams.get('year')) : undefined,
      fuelType: searchParams.get('fuelType') || undefined,
      location: searchParams.get('location') || undefined,
      search: searchParams.get('search') || undefined,
      sort: searchParams.get('sort') as 'latest' | 'price-low' | 'price-high' | 'views' || 'latest',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
      availableForRent: searchParams.get('availableForRent') === 'true' ? true : undefined,
      includeAll: searchParams.get('includeAll') === 'true' ? true : undefined,
    };

    const result = await getVehicles(filters);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { 
        vehicles: [],
        total: 0,
        page: 1,
        totalPages: 0,
        hasMore: false,
        error: 'Failed to fetch vehicles', 
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// POST /api/vehicles - Create new vehicle (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    await requireAdmin();

    await connectDB();

    const data = await request.json();

    // Normalize enum values to lowercase
    const normalizedFuelType = data.fuelType?.toLowerCase() as 'petrol' | 'diesel' | 'electric' | 'cng';
    const normalizedTransmission = data.transmission?.toLowerCase() as 'manual' | 'automatic';

    const vehicle = await Vehicle.create({
      category: data.category,
      brand: data.brand,
      vehicleModel: data.vehicleModel,
      year: data.year,
      color: data.color,
      title: data.title,
      price: data.price,
      images: data.images || [],
      kilometers: data.kilometers,
      fuelType: normalizedFuelType,
      transmission: normalizedTransmission,
      description: data.description || '',
      location: data.location,
      purchasePrice: data.purchasePrice || 0,
      sellingPrice: data.sellingPrice || data.price,
      status: data.status || 'for_sale',
      isFeatured: data.isFeatured || false,
      availableForRent: data.availableForRent || false,
      rentalPricePerDay: data.rentalPricePerDay || 0,
      views: 0,
      contacts: 0,
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error: any) {
    console.error('Error creating vehicle:', error);
    
    // Log detailed error information
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: Object.keys(error.errors).map(key => ({
            field: key,
            message: error.errors[key].message
          }))
        },
        { status: 400 }
      );
    }
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to create vehicle',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
