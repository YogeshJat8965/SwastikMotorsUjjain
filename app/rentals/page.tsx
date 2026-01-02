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

  // Filters with safe defaults
  const [category, setCategory] = useState<'all' | 'bike' | 'car'>(
    () => (searchParams?.get('category') as 'all' | 'bike' | 'car') || 'all'
  );
  const [transmission, setTransmission] = useState<'all' | 'manual' | 'automatic'>(
    () => (searchParams?.get('transmission') as 'all' | 'manual' | 'automatic') || 'all'
  );
  const [fuelType, setFuelType] = useState<string>(
    () => searchParams?.get('fuelType') || 'all'
  );
  const [sort, setSort] = useState(
    () => searchParams?.get('sort') || 'latest'
  );
  const [minPrice, setMinPrice] = useState(
    () => Number(searchParams?.get('minPrice')) || 0
  );
  const [maxPrice, setMaxPrice] = useState(
    () => Number(searchParams?.get('maxPrice')) || 10000
  );

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
      if (!response.ok) {
        throw new Error('Failed to fetch rentals');
      }
      
      const data: RentalResponse = await response.json();

      setRentals(Array.isArray(data.rentals) ? data.rentals : []);
      setTotalPages(data.pagination?.pages || 1);
      setTotal(data.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching rentals:', error);
      setRentals([]);
      setTotalPages(1);
      setTotal(0);
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
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 pb-16 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-6 md:py-8">
        
        {/* Header */}
        <div className="mb-5 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold text-gray-900 mb-2">
            Rent a Vehicle
          </h1>
          <p className="text-base text-gray-600">
            Choose from our collection of bikes and cars available for rent
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-5 md:mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by brand, model, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 md:py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base shadow-sm"
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
        <div className="flex flex-wrap items-center gap-2.5 md:gap-3 mb-5 md:mb-6">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm active:scale-95 transition-all"
          >
            <Filter className="w-5 h-5" />
            <span className="text-base font-semibold">Filters</span>
            {hasActiveFilters && (
              <Badge color="blue" className="ml-1 text-xs px-2 py-0.5">
                Active
              </Badge>
            )}
          </button>

          {/* Category Tabs */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setCategory('all')}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95 ${
                category === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setCategory('bike')}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95 ${
                category === 'bike'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              🏍️ Bikes
            </button>
            <button
              onClick={() => setCategory('car')}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95 ${
                category === 'car'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              🚗 Cars
            </button>
          </div>

          {/* Transmission Filter */}
          <select
            value={transmission}
            onChange={(e) => setTransmission(e.target.value as 'all' | 'manual' | 'automatic')}
            className="hidden md:block px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Transmission</option>
            <option value="manual">Manual</option>
            <option value="automatic">Automatic</option>
          </select>

          {/* Fuel Type Filter */}
          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            className="hidden md:block px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="hidden md:block px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ml-auto"
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
          <div className="md:hidden mb-5 p-5 bg-white rounded-2xl border-2 border-gray-200 shadow-lg space-y-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Filter Options</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Transmission */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Transmission
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTransmission('all')}
                  className={`py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
                    transmission === 'all'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 active:scale-95'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setTransmission('manual')}
                  className={`py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
                    transmission === 'manual'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 active:scale-95'
                  }`}
                >
                  Manual
                </button>
                <button
                  type="button"
                  onClick={() => setTransmission('automatic')}
                  className={`py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
                    transmission === 'automatic'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 active:scale-95'
                  }`}
                >
                  Auto
                </button>
              </div>
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Fuel Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['all', 'petrol', 'diesel', 'electric'].map((fuel) => (
                  <button
                    key={fuel}
                    type="button"
                    onClick={() => setFuelType(fuel)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-semibold transition-all capitalize ${
                      fuelType === fuel
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 active:scale-95'
                    }`}
                  >
                    {fuel === 'all' ? 'All Types' : fuel}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Sort By
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'latest', label: 'Latest' },
                  { value: 'price_low', label: 'Price Low' },
                  { value: 'price_high', label: 'Price High' },
                  { value: 'popular', label: 'Popular' }
                ].map((sortOption) => (
                  <button
                    key={sortOption.value}
                    type="button"
                    onClick={() => setSort(sortOption.value)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
                      sort === sortOption.value
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 active:scale-95'
                    }`}
                  >
                    {sortOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Rate Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Daily Rate Range
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  placeholder="Min"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-base font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-400 font-medium">-</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  placeholder="Max"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-base font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Apply Button */}
            <button
              type="button"
              onClick={() => setIsFilterOpen(false)}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl shadow-md active:scale-95 transition-all"
            >
              Apply Filters
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-5 md:mb-6">
          <p className="text-base md:text-sm font-semibold text-gray-700">
            {loading ? (
              'Loading...'
            ) : (
              <>
                Showing {rentals?.length || 0} of {total} vehicle{total !== 1 ? 's' : ''}
              </>
            )}
          </p>
        </div>

        {/* Rentals Grid */}
        {loading ? (
          <LoadingState message="Loading rental vehicles..." />
        ) : !rentals || rentals.length === 0 ? (
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
              {rentals && rentals.map((rental) => (
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
