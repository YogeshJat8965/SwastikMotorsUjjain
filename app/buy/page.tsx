'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Search, X } from 'lucide-react';
import FilterSidebar, { FilterValues } from '@/components/filters/FilterSidebar';
import VehicleCard from '@/components/ui/VehicleCard';
import Pagination from '@/components/ui/Pagination';
import LoadingState from '@/components/ui/LoadingState';
import Button from '@/components/ui/Button';

interface Vehicle {
  _id: string;
  category: 'bike' | 'car';
  brand: string;
  vehicleModel: string;
  year: number;
  sellingPrice: number;
  images: string[];
  fuelType: string;
  kilometers: number;
  location: {
    city: string;
    state: string;
  };
  featured?: boolean;
}

interface VehicleResponse {
  vehicles: Vehicle[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

function BrowsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Parse filters from URL
  const getFiltersFromURL = (): FilterValues => {
    const brandsParam = searchParams.get('brands');
    const brands = brandsParam ? brandsParam.split(',').filter(Boolean) : [];
    
    return {
      category: (searchParams.get('category') as 'all' | 'bike' | 'car') || 'all',
      minPrice: Number(searchParams.get('minPrice')) || 0,
      maxPrice: Number(searchParams.get('maxPrice')) || 1000000,
      brands: brands,
      year: searchParams.get('year') ? Number(searchParams.get('year')) : undefined,
      fuelType: searchParams.get('fuelType') || undefined,
      location: searchParams.get('location') || undefined,
    };
  };

  const [filters, setFilters] = useState<FilterValues>(getFiltersFromURL());
  const [sort, setSort] = useState(searchParams.get('sort') || 'latest');

  // Fetch vehicles
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('category', filters.category);
      params.set('minPrice', filters.minPrice.toString());
      params.set('maxPrice', filters.maxPrice.toString());
      if (filters.brands && filters.brands.length > 0) {
        params.set('brand', filters.brands.join(','));
      }
      if (filters.year) params.set('year', filters.year.toString());
      if (filters.fuelType) params.set('fuelType', filters.fuelType);
      if (filters.location) params.set('location', filters.location);
      if (searchQuery) params.set('search', searchQuery);
      params.set('sort', sort);
      params.set('page', currentPage.toString());
      params.set('limit', '20');

      const response = await fetch(`/api/vehicles?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }
      
      const data: VehicleResponse = await response.json();

      setVehicles(Array.isArray(data.vehicles) ? data.vehicles : []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setVehicles([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Update URL when filters change
  const updateURL = () => {
    const params = new URLSearchParams();
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.minPrice > 0) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice < 1000000) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.brands.length > 0) params.set('brands', filters.brands.join(','));
    if (filters.year) params.set('year', filters.year.toString());
    if (filters.fuelType) params.set('fuelType', filters.fuelType);
    if (filters.location) params.set('location', filters.location);
    if (searchQuery) params.set('search', searchQuery);
    if (sort !== 'latest') params.set('sort', sort);
    if (currentPage > 1) params.set('page', currentPage.toString());

    router.push(`/buy?${params.toString()}`, { scroll: false });
  };

  // Fetch vehicles when filters, sort, or page changes
  useEffect(() => {
    fetchVehicles();
    updateURL();
  }, [filters, sort, currentPage, searchQuery]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFilterCount = () => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.minPrice > 0 || filters.maxPrice < 1000000) count++;
    if (filters.brands && filters.brands.length > 0) count += filters.brands.length;
    if (filters.year) count++;
    if (filters.fuelType) count++;
    if (filters.location) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Browse Vehicles</h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by brand, model..."
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <Button type="submit" className="lg:hidden">
              Search
            </Button>
          </form>

          {/* Filter and Sort Row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Filter Button (Mobile) */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex-shrink-0"
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount() > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount()}
                </span>
              )}
            </button>

            {/* Results Count */}
            <p className="text-sm text-gray-600 flex-1 min-w-0">
              {loading ? 'Loading...' : `${total} ${total === 1 ? 'vehicle' : 'vehicles'} found`}
            </p>

            {/* Sort Dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-[140px] max-w-[180px]"
            >
              <option value="latest">Latest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar - handles both mobile and desktop */}
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />

          {/* Vehicle Grid */}
          <main className="flex-1">
            {loading ? (
              <LoadingState />
            ) : !vehicles || vehicles.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button
                  onClick={() => {
                    setFilters({
                      category: 'all',
                      minPrice: 0,
                      maxPrice: 1000000,
                      brands: [],
                      year: undefined,
                      fuelType: undefined,
                      location: undefined,
                    });
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  variant="outline"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles && vehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle._id}
                      id={vehicle._id}
                      title={`${vehicle.brand} ${vehicle.vehicleModel}`}
                      price={vehicle.sellingPrice}
                      image={vehicle.images?.[0] || (vehicle.category === 'bike' 
                        ? 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' 
                        : 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80')}
                      year={vehicle.year}
                      kilometers={vehicle.kilometers}
                      fuelType={vehicle.fuelType}
                      location={`${vehicle.location?.city || ''}, ${vehicle.location?.state || ''}`}
                      featured={vehicle.featured}
                      category={vehicle.category}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function BuyPageContent() {
  return (
    <Suspense fallback={<LoadingState />}>
      <BrowsePage />
    </Suspense>
  );
}

export default BuyPageContent;
