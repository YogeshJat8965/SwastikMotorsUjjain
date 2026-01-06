'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import PriceRangeSlider from './PriceRangeSlider';
import Button from '../ui/Button';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: FilterValues) => void;
  initialFilters?: FilterValues;
}

export interface FilterValues {
  category: 'all' | 'bike' | 'car';
  minPrice: number;
  maxPrice: number;
  brands: string[];
  year?: number;
  fuelType?: string;
  location?: string;
}

const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'CNG'];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 15 }, (_, i) => CURRENT_YEAR - i);

// Common brands
const BIKE_BRANDS = ['Honda', 'Yamaha', 'Bajaj', 'TVS', 'Royal Enfield', 'KTM', 'Hero', 'Suzuki'];
const CAR_BRANDS = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota', 'Ford', 'Volkswagen'];

const LOCATIONS = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Pune',
  'Ahmedabad',
  'Chennai',
  'Kolkata',
  'Jaipur',
  'Hyderabad',
  'Surat',
];

export default function FilterSidebar({
  isOpen,
  onClose,
  onFilterChange,
  initialFilters,
}: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterValues>(() => {
    const defaults = {
      category: 'all' as 'all' | 'bike' | 'car',
      minPrice: 0,
      maxPrice: 1000000,
      brands: [],
      year: undefined,
      fuelType: undefined,
      location: undefined,
    };
    
    if (!initialFilters) return defaults;
    
    // Ensure brands is always an array
    return {
      ...defaults,
      ...initialFilters,
      brands: Array.isArray(initialFilters.brands) ? initialFilters.brands : [],
    };
  });

  const availableBrands = filters.category === 'bike' ? BIKE_BRANDS : 
                          filters.category === 'car' ? CAR_BRANDS : 
                          [...new Set([...BIKE_BRANDS, ...CAR_BRANDS])]; // Remove duplicates

  const handleCategoryChange = (category: 'all' | 'bike' | 'car') => {
    setFilters({ ...filters, category, brands: [] });
  };

  const handleBrandToggle = (brand: string) => {
    const currentBrands = Array.isArray(filters.brands) ? filters.brands : [];
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter((b) => b !== brand)
      : [...currentBrands, brand];
    setFilters({ ...filters, brands: newBrands });
  };

  const handlePriceChange = (min: number, max: number) => {
    setFilters({ ...filters, minPrice: min, maxPrice: max });
  };

  const handleApply = () => {
    onFilterChange(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterValues = {
      category: 'all',
      minPrice: 0,
      maxPrice: 1000000,
      brands: [],
      year: undefined,
      fuelType: undefined,
      location: undefined,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky lg:top-32 top-20 md:top-24 left-0 h-screen lg:h-auto w-80 bg-white shadow-xl lg:shadow-none z-40 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Category</h3>
            <div className="space-y-2">
              {(['all', 'bike', 'car'] as const).map((category) => (
                <label key={category} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === category}
                    onChange={() => handleCategoryChange(category)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {category === 'all' ? 'All Vehicles' : category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Price Range</h3>
            <PriceRangeSlider
              min={0}
              max={1000000}
              defaultMin={filters.minPrice}
              defaultMax={filters.maxPrice}
              step={10000}
              onChange={handlePriceChange}
            />
          </div>

          {/* Brands */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Brand</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableBrands.map((brand) => (
                <label key={brand} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Array.isArray(filters.brands) && filters.brands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Year */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Year</h3>
            <select
              value={filters.year || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  year: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Any Year</option>
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Fuel Type */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Fuel Type</h3>
            <div className="space-y-2">
              {FUEL_TYPES.map((fuel) => (
                <label key={fuel} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="fuel"
                    checked={filters.fuelType === fuel}
                    onChange={() =>
                      setFilters({
                        ...filters,
                        fuelType: filters.fuelType === fuel ? undefined : fuel,
                      })
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">{fuel}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Location</h3>
            <select
              value={filters.location || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  location: e.target.value || undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Any Location</option>
              {LOCATIONS.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={handleApply} className="w-full">
              Apply Filters
            </Button>
            <Button onClick={handleReset} variant="outline" className="w-full">
              Reset All
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
