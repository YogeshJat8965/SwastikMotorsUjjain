'use client';

import { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface Vehicle {
  _id: string;
  title: string;
  brand: string;
  vehicleModel: string;
  year: number;
  rentalPricePerDay: number;
}

interface BookingFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookingForm({ onClose, onSuccess }: BookingFormProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    startDate: '',
    endDate: '',
    pickupLocation: '',
  });
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [dailyRate, setDailyRate] = useState(0);

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [formData.startDate, formData.endDate, dailyRate]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles?availableForRent=true');
      const data = await response.json();
      setVehicles(data.vehicles || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const calculateTotal = () => {
    if (formData.startDate && formData.endDate && dailyRate > 0) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
      setTotalDays(diffDays);
      setTotalPrice(diffDays * dailyRate);
    } else {
      setTotalDays(0);
      setTotalPrice(0);
    }
  };

  const handleVehicleChange = (vehicleId: string) => {
    setFormData({ ...formData, vehicleId });
    const vehicle = vehicles.find(v => v._id === vehicleId);
    if (vehicle) {
      setDailyRate(vehicle.rentalPricePerDay || 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vehicleId) {
      alert('Please select a vehicle');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      alert('Please select both start and end dates');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert('End date must be after start date');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalDays,
          totalPrice,
        }),
      });

      if (response.ok) {
        alert('✅ Booking created successfully!');
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to create booking'}`);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Create Booking</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Vehicle Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Vehicle *
            </label>
            <select
              value={formData.vehicleId}
              onChange={(e) => handleVehicleChange(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a vehicle --</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle._id} value={vehicle._id}>
                  {vehicle.brand} {vehicle.vehicleModel} {vehicle.year} - ₹
                  {vehicle.rentalPricePerDay}/day
                </option>
              ))}
            </select>
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Customer Name *"
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="Enter customer name"
              required
            />
            <Input
              label="Phone Number *"
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              placeholder="10-digit phone number"
              pattern="[0-9]{10}"
              required
            />
          </div>

          <Input
            label="Email *"
            type="email"
            value={formData.customerEmail}
            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
            placeholder="customer@example.com"
            required
          />

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date *"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
              icon={<Calendar className="w-5 h-5 text-gray-400" />}
            />
            <Input
              label="End Date *"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              min={formData.startDate || new Date().toISOString().split('T')[0]}
              required
              icon={<Calendar className="w-5 h-5 text-gray-400" />}
            />
          </div>

          <Input
            label="Pickup Location *"
            type="text"
            value={formData.pickupLocation}
            onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
            placeholder="Enter pickup location"
            required
          />

          {/* Pricing Summary */}
          {totalDays > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Rate:</span>
                  <span className="font-medium">₹{dailyRate.toLocaleString('en-IN')}/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Days:</span>
                  <span className="font-medium">{totalDays} days</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-blue-300">
                  <span className="font-semibold text-gray-900">Total Price:</span>
                  <span className="font-bold text-blue-700 text-lg">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || totalDays === 0}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
