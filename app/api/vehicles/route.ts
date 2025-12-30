import { NextRequest, NextResponse } from 'next/server';
import { getVehicles, getAvailableBrands, getAvailableLocations } from '@/lib/queries/vehicleQueries';

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
    };

    const result = await getVehicles(filters);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicles', message: error.message },
      { status: 500 }
    );
  }
}
