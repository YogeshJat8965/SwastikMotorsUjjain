'use client';

import { useState, useEffect } from 'react';
import { Calendar, Phone, MapPin, Clock, Filter, Search, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import BookingForm from './BookingForm';

interface Booking {
  _id: string;
  vehicle: {
    _id: string;
    title: string;
    images: string[];
    rentalPricePerDay: number;
  };
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickupLocation: string;
  createdAt: string;
}

export default function RentalBookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchBookings();
      } else {
        alert('Failed to update booking');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('An error occurred');
    }
  };

  const deleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchBookings();
      } else {
        alert('Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('An error occurred');
    }
  };

  const filteredBookings = bookings
    .filter(booking => {
      if (filter !== 'all' && booking.status !== filter) return false;
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          booking.customerName.toLowerCase().includes(search) ||
          booking.customerPhone.includes(search) ||
          booking.vehicle.title.toLowerCase().includes(search)
        );
      }
      return true;
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge color="yellow">⏳ Pending</Badge>;
      case 'confirmed':
        return <Badge color="green">✓ Confirmed</Badge>;
      case 'cancelled':
        return <Badge color="red">✗ Cancelled</Badge>;
      case 'completed':
        return <Badge color="blue">✓ Completed</Badge>;
      default:
        return <Badge color="gray">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusCounts = () => {
    return {
      all: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };
  };

  const counts = getStatusCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Rental Bookings</h1>
            <p className="text-gray-600">Manage all rental bookings</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowBookingForm(true)}
            icon={<Plus className="w-5 h-5" />}
          >
            Add Booking
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`p-4 rounded-xl border-2 transition-all ${
              filter === 'all'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-2xl font-bold text-gray-900">{counts.all}</div>
            <div className="text-sm text-gray-600">All Bookings</div>
          </button>

          <button
            onClick={() => setFilter('pending')}
            className={`p-4 rounded-xl border-2 transition-all ${
              filter === 'pending'
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-2xl font-bold text-orange-600">{counts.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </button>

          <button
            onClick={() => setFilter('confirmed')}
            className={`p-4 rounded-xl border-2 transition-all ${
              filter === 'confirmed'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-2xl font-bold text-green-600">{counts.confirmed}</div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </button>

          <button
            onClick={() => setFilter('completed')}
            className={`p-4 rounded-xl border-2 transition-all ${
              filter === 'completed'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-2xl font-bold text-blue-600">{counts.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </button>

          <button
            onClick={() => setFilter('cancelled')}
            className={`p-4 rounded-xl border-2 transition-all ${
              filter === 'cancelled'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-2xl font-bold text-red-600">{counts.cancelled}</div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search by customer name, phone, or vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-5 h-5 text-gray-400" />}
          />
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Bookings Found</h3>
            <p className="text-gray-600">
              {filter !== 'all' 
                ? `No ${filter} bookings available`
                : 'No rental bookings available yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Vehicle Image */}
                    <div className="flex-shrink-0">
                      <div className="w-full lg:w-48 h-32 bg-gray-100 rounded-xl overflow-hidden">
                        {booking.vehicle.images && booking.vehicle.images[0] ? (
                          <img
                            src={booking.vehicle.images[0]}
                            alt={booking.vehicle.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            🚗
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="flex-grow space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {booking.vehicle.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(booking.status)}
                            <span className="text-sm text-gray-500">
                              Booking ID: {booking._id.slice(-8).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Customer</p>
                          <p className="font-medium text-gray-900">{booking.customerName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <a
                              href={`tel:${booking.customerPhone}`}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              {booking.customerPhone}
                            </a>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-1">Rental Period</p>
                          <div className="flex items-center gap-2 text-gray-900">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">
                              {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {booking.totalDays} day{booking.totalDays > 1 ? 's' : ''}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-1">Pickup Location</p>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{booking.pickupLocation}</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                          <p className="text-2xl font-bold text-green-600">
                            ₹{booking.totalPrice.toLocaleString('en-IN')}
                          </p>
                          <p className="text-xs text-gray-500">
                            ₹{booking.vehicle.rentalPricePerDay}/day
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                        <a
                          href={`https://wa.me/${booking.customerPhone.replace(/\D/g, '')}?text=Hello ${booking.customerName}, regarding your booking for ${booking.vehicle.title}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          💬 WhatsApp
                        </a>

                        <a
                          href={`tel:${booking.customerPhone}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          📞 Call
                        </a>

                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Confirm
                            </button>
                            <button
                              onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Cancel
                            </button>
                          </>
                        )}

                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => updateBookingStatus(booking._id, 'completed')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark Completed
                          </button>
                        )}

                        <button
                          onClick={() => deleteBooking(booking._id)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Form Modal */}
        {showBookingForm && (
          <BookingForm
            onClose={() => setShowBookingForm(false)}
            onSuccess={fetchBookings}
          />
        )}
      </div>
    </div>
  );
}
