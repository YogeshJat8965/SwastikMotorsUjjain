'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus, Calendar, Car, DollarSign, Star, CheckCircle, Users, Edit2, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Badge from '@/components/ui/Badge';
import ImageUpload from '@/components/forms/ImageUpload';

interface SoldVehicle {
  _id: string;
  vehicleName: string;
  vehicleType: 'bike' | 'car';
  customerName?: string;
  image: string;
  soldDate: string;
  testimonial?: string;
  price?: number;
  featured: boolean;
  createdAt: string;
}

export default function SoldVehiclesManagement() {
  const [soldVehicles, setSoldVehicles] = useState<SoldVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    vehicleName: '',
    vehicleType: 'bike' as 'bike' | 'car',
    customerName: '',
    image: '',
    soldDate: new Date().toISOString().split('T')[0],
    testimonial: '',
    price: '',
    featured: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSoldVehicles();
  }, []);

  const fetchSoldVehicles = async () => {
    try {
      const res = await fetch('/api/admin/sold-vehicles');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setSoldVehicles(data.soldVehicles || []);
    } catch (error) {
      console.error('Error fetching sold vehicles:', error);
      setError('Failed to load sold vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleName || !formData.image) {
      setError('Vehicle name and image are required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/admin/sold-vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseFloat(formData.price) : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create entry');
      }

      await fetchSoldVehicles();
      setShowForm(false);
      setFormData({
        vehicleName: '',
        vehicleType: 'bike',
        customerName: '',
        image: '',
        soldDate: new Date().toISOString().split('T')[0],
        testimonial: '',
        price: '',
        featured: false,
      });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this success story?')) return;

    try {
      const res = await fetch(`/api/admin/sold-vehicles/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete');
      }

      await fetchSoldVehicles();
      alert('Success story deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting sold vehicle:', error);
      alert(`Failed to delete: ${error.message}`);
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const res = await fetch(`/api/admin/sold-vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update');
      }

      await fetchSoldVehicles();
    } catch (error: any) {
      console.error('Error updating sold vehicle:', error);
      alert(`Failed to update: ${error.message}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading success stories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-3 rounded-xl shadow-lg">
                  <Users className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                Success Stories
              </h1>
              <p className="text-gray-600 mt-2 ml-1">
                Showcase your sold vehicles and happy customers
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              icon={<Plus className="w-5 h-5" />}
              onClick={() => setShowForm(!showForm)}
              className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all"
            >
              {showForm ? 'Cancel' : 'Add New Story'}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all hover:scale-105 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{soldVehicles.length}</p>
                <p className="text-sm text-gray-600 mt-1 font-medium">Total Sold</p>
              </div>
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-3 rounded-xl">
                <CheckCircle className="w-7 h-7 text-primary-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all hover:scale-105 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {soldVehicles.filter((v) => v.featured).length}
                </p>
                <p className="text-sm text-gray-600 mt-1 font-medium">Featured</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-3 rounded-xl">
                <Star className="w-7 h-7 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all hover:scale-105 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {soldVehicles.filter((v) => v.vehicleType === 'bike').length}
                </p>
                <p className="text-sm text-gray-600 mt-1 font-medium">Bikes</p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl">
                <span className="text-2xl">🏍️</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all hover:scale-105 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {soldVehicles.filter((v) => v.vehicleType === 'car').length}
                </p>
                <p className="text-sm text-gray-600 mt-1 font-medium">Cars</p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-xl">
                <span className="text-2xl">🚗</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Success Story</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
                <span className="font-medium">{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Input
                  label="Vehicle Name *"
                  value={formData.vehicleName}
                  onChange={(e) => setFormData({ ...formData, vehicleName: e.target.value })}
                  placeholder="e.g., Royal Enfield Classic 350"
                  required
                  className="text-base"
                />
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vehicle Type *
                  </label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleType: e.target.value as 'bike' | 'car' })
                    }
                    className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  >
                    <option value="bike">🏍️ Bike</option>
                    <option value="car">🚗 Car</option>
                  </select>
                </div>
                
                <Input
                  label="Customer Name"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Happy customer's name"
                  className="text-base"
                />
                
                <Input
                  label="Sold Date"
                  type="date"
                  value={formData.soldDate}
                  onChange={(e) => setFormData({ ...formData, soldDate: e.target.value })}
                  className="text-base"
                />
                
                <Input
                  label="Sale Price (₹)"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="145000"
                  className="text-base"
                />
                
                <div className="flex items-center gap-3 pt-8">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 text-primary-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                  />
                  <label htmlFor="featured" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Mark as Featured
                  </label>
                </div>
              </div>
              
              <Textarea
                label="Customer Testimonial"
                value={formData.testimonial}
                onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                placeholder="Great experience! Got my dream bike at an amazing price..."
                rows={4}
                className="text-base"
              />
              
              <ImageUpload
                label="Photo with Customer *"
                onImageUpload={(url) => setFormData({ ...formData, image: url })}
                currentImage={formData.image}
              />
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg"
                  disabled={submitting}
                  className="flex-1 shadow-lg hover:shadow-xl"
                >
                  {submitting ? 'Adding Story...' : '✨ Add Success Story'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Success Stories Grid */}
        {soldVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {soldVehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={vehicle.image}
                    alt={vehicle.vehicleName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    <Badge
                      color={vehicle.vehicleType === 'bike' ? 'blue' : 'green'}
                      className="text-sm font-semibold shadow-lg backdrop-blur-sm bg-white/90"
                    >
                      {vehicle.vehicleType === 'bike' ? '🏍️ Bike' : '🚗 Car'}
                    </Badge>
                    
                    {vehicle.featured && (
                      <Badge
                        color="yellow"
                        className="text-sm font-semibold flex items-center gap-1 shadow-lg backdrop-blur-sm bg-white/90"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-1">
                    {vehicle.vehicleName}
                  </h3>
                  
                  {vehicle.customerName && (
                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                      <Users className="w-4 h-4 text-primary-600" />
                      <span className="text-sm font-medium">{vehicle.customerName}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{formatDate(vehicle.soldDate)}</span>
                  </div>
                  
                  {vehicle.price && (
                    <div className="flex items-center gap-2 text-green-600 mb-3">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-base font-bold">₹{vehicle.price.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {vehicle.testimonial && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed italic">
                      "{vehicle.testimonial}"
                    </p>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <Button
                      variant={vehicle.featured ? "primary" : "outline"}
                      size="sm"
                      onClick={() => toggleFeatured(vehicle._id, vehicle.featured)}
                      className="flex-1 font-semibold"
                    >
                      <Star className={`w-4 h-4 ${vehicle.featured ? 'fill-current' : ''}`} />
                      {vehicle.featured ? 'Unfeature' : 'Feature'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(vehicle._id)}
                      className="font-semibold text-red-600 hover:bg-red-50 border-red-300 hover:border-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !showForm && (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center border-2 border-dashed border-gray-300">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">No Success Stories Yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Start showcasing your sold vehicles with happy customers to build trust and credibility
              </p>
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => setShowForm(true)}
                icon={<Plus className="w-5 h-5" />}
                className="shadow-lg hover:shadow-xl"
              >
                Add Your First Success Story
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
