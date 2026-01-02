'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Search, X } from 'lucide-react';
import RentalCard from '@/components/rental/RentalCard';
import Pagination from '@/components/ui/Pagination';
import LoadingState from '@/components/ui/LoadingState';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface Rental {
  _id: string;
  title: string;
  category: 'bike' | 'car';
  brand: string;
  vehicleModel: string;
  year: number;
  dailyRate: number;
  weeklyRate: number;
  images: string[];
  transmission: string;
  fuelType: string;
  seatingCapacity: number;
  city: string;
  status: 'available' | 'rented' | 'maintenance' | 'inactive';
  isFeatured: boolean;
  rating?: number;
}

interface RentalResponse {
  rentals: Rental[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

function RentalsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Filters
  const [category, setCategory] = useState<'all' | 'bike' | 'car'>(
    (searchParams.get('category') as 'all' | 'bike' | 'car') || 'all'
  );
  const [transmission, setTransmission] = useState<'all' | 'manual' | 'automatic'>(
    (searchParams.get('transmission') as 'all' | 'manual' | 'automatic') || 'all'
  );
  const [fuelType, setFuelType] = useState<string>(searchParams.get('fuelType') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'latest');
  const [minPrice, setMinPrice] = useState(Number(searchParams.get('minPrice')) || 0);
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('maxPrice')) || 10000);

  // Fetch rentals
  const fetchRentals = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('category', category);
      params.set('minPrice', minPrice.toString());
      params.set('maxPrice', maxPrice.toString());
      if (transmission !== 'all') params.set('transmission', transmission);
      if (fuelType !== 'all') params.set('fuelType', fuelType);
      if (searchQuery) params.set('search', searchQuery);
      params.set('sort', sort);
      params.set('page', currentPage.toString());
      params.set('limit', '20');

      const response = await fetch(`/api/rentals?${params.toString()}`);
      const data: RentalResponse = await response.json();

      setRentals(data.rentals);
      setTotalPages(data.pagination.pages);
      setTotal(data.pagination.total);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update URL when filters change
  const updateURL = () => {
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (transmission !== 'all') params.set('transmission', transmission);
    if (fuelType !== 'all') params.set('fuelType', fuelType);
    if (minPrice > 0) params.set('minPrice', minPrice.toString());
    if (maxPrice < 10000) params.set('maxPrice', maxPrice.toString());
    if (searchQuery) params.set('search', searchQuery);
    if (sort !== 'latest') params.set('sort', sort);
    if (currentPage > 1) params.set('page', currentPage.toString());

    const newURL = params.toString() ? `?${params.toString()}` : '/rentals';
    router.push(newURL, { scroll: false });
  };

  // Effects
  useEffect(() => {
    fetchRentals();
  }, [category, transmission, fuelType, sort, currentPage, searchQuery, minPrice, maxPrice]);

  useEffect(() => {
    updateURL();
  }, [category, transmission, fuelType, sort, currentPage, searchQuery, minPrice, maxPrice]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, transmission, fuelType, searchQuery, minPrice, maxPrice]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setCategory('all');
    setTransmission('all');
    setFuelType('all');
    setMinPrice(0);
    setMaxPrice(10000);
    setSearchQuery('');
    setSort('latest');
    setCurrentPage(1);
  };

  const hasActiveFilters = 
    category !== 'all' || 
    transmission !== 'all' || 
    fuelType !== 'all' || 
    minPrice > 0 || 
    maxPrice < 10000 || 
    searchQuery !== '';

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Rent a Vehicle
          </h1>
          <p className="text-gray-600">
            Choose from our collection of bikes and cars available for rent
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by brand, model, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 md:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>

        {/* Filters and Sort Row */}
        <div className="flex flex-wrap items-center gap-3 mb-6 overflow-x-hidden">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
            {hasActiveFilters && (
              <Badge color="blue" className="ml-1">
                Active
              </Badge>
            )}
          </button>

          {/* Category Tabs */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                category === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setCategory('bike')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                category === 'bike'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              🏍️ Bikes
            </button>
            <button
              onClick={() => setCategory('car')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                category === 'car'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              🚗 Cars
            </button>
          </div>

          {/* Transmission Filter */}
          <select
            value={transmission}
            onChange={(e) => setTransmission(e.target.value as 'all' | 'manual' | 'automatic')}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm min-w-[140px] max-w-[180px] focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Transmission</option>
            <option value="manual">Manual</option>
            <option value="automatic">Automatic</option>
          </select>

          {/* Fuel Type Filter */}
          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm min-w-[140px] max-w-[180px] focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Fuel Types</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
            <option value="cng">CNG</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm min-w-[140px] max-w-[180px] focus:ring-2 focus:ring-blue-500 ml-auto"
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters} className="flex items-center gap-2">
              <X className="w-4 h-4" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Mobile Filter Panel */}
        {isFilterOpen && (
          <div className="md:hidden mb-6 p-4 bg-white rounded-xl border border-gray-200 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Rate Range
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            {loading ? (
              'Loading...'
            ) : (
              <>
                Showing {rentals.length} of {total} vehicle{total !== 1 ? 's' : ''}
              </>
            )}
          </p>
        </div>

        {/* Rentals Grid */}
        {loading ? (
          <LoadingState message="Loading rental vehicles..." />
        ) : rentals.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No rentals found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search query
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters}>Clear All Filters</Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {rentals.map((rental) => (
                <RentalCard
                  key={rental._id}
                  id={rental._id}
                  title={rental.title}
                  dailyRate={rental.dailyRate}
                  weeklyRate={rental.weeklyRate}
                  image={rental.images?.[0] || (rental.category === 'bike' 
                    ? 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' 
                    : 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80')}
                  year={rental.year}
                  transmission={rental.transmission}
                  fuelType={rental.fuelType}
                  seatingCapacity={rental.seatingCapacity}
                  city={rental.city}
                  category={rental.category}
                  featured={rental.isFeatured}
                  status={rental.status}
                  rating={rental.rating}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function RentalsPageContent() {
  return (
    <Suspense fallback={<LoadingState />}>
      <RentalsPage />
    </Suspense>
  );
}

export default RentalsPageContent;
