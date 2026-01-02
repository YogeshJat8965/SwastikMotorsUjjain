import connectDB from '../mongodb';
import Vehicle from '@/models/Vehicle';

export interface VehicleFilters {
  category?: 'bike' | 'car' | 'all';
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  year?: number;
  fuelType?: string;
  location?: string;
  search?: string;
  sort?: 'latest' | 'price-low' | 'price-high' | 'views';
  page?: number;
  limit?: number;
  availableForRent?: boolean;
  includeAll?: boolean;
}

export interface VehicleQueryResult {
  vehicles: any[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export async function getVehicles(filters: VehicleFilters = {}): Promise<VehicleQueryResult> {
  await connectDB();

  const {
    category = 'all',
    minPrice = 0,
    maxPrice = 10000000,
    brand,
    year,
    fuelType,
    location,
    search,
    sort = 'latest',
    page = 1,
    limit = 20,
    availableForRent,
    includeAll,
  } = filters;

  // Build query
  const query: any = {};
  
  // Only filter by status if includeAll is not true (for admin)
  if (!includeAll) {
    query.status = 'for_sale'; // Only show vehicles that are for sale
  }

  // Category filter
  if (category && category !== 'all') {
    query.category = category;
  }

  // Available for rent filter
  if (availableForRent !== undefined) {
    query.availableForRent = availableForRent;
    console.log('Applied availableForRent filter:', availableForRent);
  }

  // Price range
  query.sellingPrice = {
    $gte: minPrice,
    $lte: maxPrice,
  };

  // Brand filter
  if (brand) {
    query.brand = { $regex: new RegExp(brand, 'i') };
  }

  // Year filter
  if (year) {
    query.year = year;
  }

  // Fuel type filter
  if (fuelType) {
    query.fuelType = fuelType;
  }

  // Location filter
  if (location) {
    query.city = { $regex: new RegExp(location, 'i') };
  }

  // Search filter (searches in brand, model, description)
  if (search) {
    query.$or = [
      { brand: { $regex: new RegExp(search, 'i') } },
      { model: { $regex: new RegExp(search, 'i') } },
      { description: { $regex: new RegExp(search, 'i') } },
    ];
  }

  // Build sort
  let sortQuery: any = {};
  switch (sort) {
    case 'latest':
      sortQuery = { createdAt: -1 };
      break;
    case 'price-low':
      sortQuery = { sellingPrice: 1 };
      break;
    case 'price-high':
      sortQuery = { sellingPrice: -1 };
      break;
    case 'views':
      sortQuery = { views: -1 };
      break;
    default:
      sortQuery = { createdAt: -1 };
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  console.log('Final MongoDB query:', JSON.stringify(query, null, 2));

  // Execute query
  const [vehicles, total] = await Promise.all([
    Vehicle.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .select('-purchasePrice') // Don't send purchase price to frontend
      .lean(),
    Vehicle.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    vehicles,
    total,
    page,
    totalPages,
    hasMore: page < totalPages,
  };
}

export async function getAvailableBrands(category?: 'bike' | 'car'): Promise<string[]> {
  await connectDB();

  const query: any = { status: 'for_sale' };
  if (category) {
    query.category = category;
  }

  const brands = await Vehicle.distinct('brand', query);
  return (brands as string[]).sort();
}

export async function getAvailableLocations(): Promise<string[]> {
  await connectDB();

  const locations = await Vehicle.distinct('city', { status: 'for_sale' });
  return (locations as string[]).sort();
}

export async function getAvailableYears(): Promise<number[]> {
  await connectDB();

  const years = await Vehicle.distinct('year', { status: 'for_sale' });
  return years.sort((a, b) => b - a); // Newest first
}
