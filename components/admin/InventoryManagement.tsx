'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Eye,
  Search,
  Filter,
  Home,
  Star,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Vehicle {
  _id: string;
  title: string;
  category: 'bike' | 'car';
  brand: string;
  vehicleModel: string;
  year: number;
  sellingPrice: number;
  purchasePrice: number;
  images: string[];
  fuelType: string;
  transmission: string;
  kilometers: number;
  location: {
    city: string;
    state: string;
  };
  status: 'for_sale' | 'sold' | 'rented' | 'draft';
  availableForRent: boolean;
  isFeatured: boolean;
  views: number;
  contacts: number;
  createdAt: string;
}

export default function InventoryManagement() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('latest');

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    filterAndSortVehicles();
  }, [searchQuery, statusFilter, sortBy, vehicles]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles?includeAll=true');
      const data = await response.json();
      setVehicles(data.vehicles || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
    }
  };

  const filterAndSortVehicles = () => {
    let filtered = [...vehicles];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((v) => v.status === statusFilter);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (v) =>
          (v.brand || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (v.vehicleModel || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (v.title || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'oldest':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case 'views':
          return (b.views || 0) - (a.views || 0);
        case 'profit':
          return ((b.sellingPrice || 0) - (b.purchasePrice || 0)) - ((a.sellingPrice || 0) - (a.purchasePrice || 0));
        default:
          return 0;
      }
    });

    setFilteredVehicles(filtered);
  };

  const deleteVehicle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;

    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchVehicles();
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchVehicles();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const toggleRental = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/vehicles/${id}/rental`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availableForRent: !currentStatus }),
      });

      if (response.ok) {
        fetchVehicles();
        alert(`Rental availability ${!currentStatus ? 'enabled' : 'disabled'}`);
      }
    } catch (error) {
      console.error('Error toggling rental:', error);
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/vehicles/${id}/featured`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !currentStatus }),
      });

      if (response.ok) {
        fetchVehicles();
        alert(`Featured status ${!currentStatus ? 'enabled' : 'disabled'}`);
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const calculateProfit = (sellingPrice: number, purchasePrice: number) => {
    return sellingPrice - purchasePrice;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      for_sale: { color: 'bg-green-100 text-green-700', label: '🟢 For Sale' },
      sold: { color: 'bg-blue-100 text-blue-700', label: '✅ Sold' },
      rented: { color: 'bg-purple-100 text-purple-700', label: '🏠 Rented' },
      draft: { color: 'bg-gray-100 text-gray-700', label: '📝 Draft' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.for_sale;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const filters = [
    { key: 'all', label: 'All', count: vehicles.length },
    { key: 'for_sale', label: 'For Sale', count: vehicles.filter((v) => v.status === 'for_sale').length },
    { key: 'sold', label: 'Sold', count: vehicles.filter((v) => v.status === 'sold').length },
    { key: 'draft', label: 'Draft', count: vehicles.filter((v) => v.status === 'draft').length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Inventory</h1>
                <p className="text-sm text-gray-600">{filteredVehicles.length} vehicles</p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => router.push('/admin/inventory/add')}
              icon={<Plus className="w-5 h-5" />}
            >
              Add Vehicle
            </Button>
          </div>

          {/* Search & Sort */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="Search by brand, model, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5 text-gray-400" />}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="views">Most Viewed</option>
              <option value="profit">Highest Profit</option>
            </select>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setStatusFilter(filter.key)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                  statusFilter === filter.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredVehicles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search' : 'Start adding vehicles to your inventory'}
            </p>
            <Button
              variant="primary"
              onClick={() => router.push('/admin/inventory/add')}
              icon={<Plus className="w-5 h-5" />}
            >
              Add Your First Vehicle
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => {
              const purchasePrice = vehicle.purchasePrice || 0;
              const sellingPrice = vehicle.sellingPrice || 0;
              const profit = calculateProfit(sellingPrice, purchasePrice);
              const profitPercentage = purchasePrice > 0 ? ((profit / purchasePrice) * 100).toFixed(1) : '0.0';

              return (
                <div
                  key={vehicle._id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200">
                    {vehicle.images?.[0] ? (
                      <img
                        src={vehicle.images[0]}
                        alt={vehicle.title || 'Vehicle'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-3 right-3">{getStatusBadge(vehicle.status || 'for_sale')}</div>
                    {vehicle.isFeatured && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          ⭐ Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                      {vehicle.brand || 'Unknown'} {vehicle.vehicleModel || 'Model'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {vehicle.year || 'N/A'} • {(vehicle.kilometers || 0).toLocaleString('en-IN')} km
                    </p>

                    {/* Pricing */}
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Bought For:</span>
                        <span className="font-medium">₹{purchasePrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Selling For:</span>
                        <span className="font-semibold text-blue-600">
                          ₹{sellingPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                        <span className="text-gray-600">Profit:</span>
                        <span className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ₹{profit.toLocaleString('en-IN')} ({profitPercentage}%)
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {vehicle.views || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {vehicle.contacts || 0}
                      </div>
                      {vehicle.availableForRent && (
                        <div className="flex items-center gap-1">
                          <Home className="w-4 h-4" />
                          Rental
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => router.push(`/admin/inventory/edit/${vehicle._id}`)}
                          className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => window.open(`/vehicle/${vehicle._id}`, '_blank')}
                          className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Preview
                        </button>
                        <button
                          onClick={() => deleteVehicle(vehicle._id)}
                          className="flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => toggleRental(vehicle._id, vehicle.availableForRent)}
                          className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                            vehicle.availableForRent
                              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Home className="w-4 h-4" />
                          {vehicle.availableForRent ? 'Rental ON' : 'Rental OFF'}
                        </button>
                        <button
                          onClick={() => toggleFeatured(vehicle._id, vehicle.isFeatured)}
                          className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                            vehicle.isFeatured
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Star className="w-4 h-4" />
                          {vehicle.isFeatured ? 'Featured' : 'Feature'}
                        </button>
                      </div>
                      {vehicle.status === 'for_sale' && (
                        <button
                          onClick={() => updateStatus(vehicle._id, 'sold')}
                          className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark as Sold
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
