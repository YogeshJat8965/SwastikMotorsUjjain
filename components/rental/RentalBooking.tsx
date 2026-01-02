'use client';

import { useState } from 'react';
import { MessageCircle, Calendar as CalendarIcon, User, Mail, Phone, MapPin } from 'lucide-react';
import DatePicker from '@/components/rental/DatePicker';
import Button from '@/components/ui/Button';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

interface Rental {
  _id: string;
  title: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  securityDeposit: number;
  minimumRentalDays: number;
  maximumRentalDays?: number;
  city: string;
  state: string;
}

interface RentalBookingProps {
  rental: Rental;
  isAvailable: boolean;
}

export default function RentalBooking({ rental, isAvailable }: RentalBookingProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [days, setDays] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');

  const handleDateChange = (start: Date | null, end: Date | null, price: number, duration: number) => {
    setStartDate(start);
    setEndDate(end);
    setTotalPrice(price);
    setDays(duration);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate || days === 0) {
      alert('Please select rental dates');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleId: rental._id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          totalDays: days,
          totalPrice: totalPrice + rental.securityDeposit,
          customerName,
          customerPhone,
          customerEmail,
          pickupLocation: pickupLocation || `${rental.city}, ${rental.state}`,
        }),
      });

      if (response.ok) {
        setBookingSuccess(true);
        setShowBookingForm(false);
        // Reset form
        setCustomerName('');
        setCustomerPhone('');
        setCustomerEmail('');
        setPickupLocation('');
      } else {
        alert('Failed to submit booking. Please try again or contact us on WhatsApp.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to submit booking. Please try again or contact us on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappNumber = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '918965900973';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const rentalUrl = `${baseUrl}/rentals/${rental._id}`;

  // Create WhatsApp message based on whether dates are selected
  const createWhatsAppMessage = () => {
    if (startDate && endDate && days > 0) {
      // Message with dates selected
      return encodeURIComponent(
        `Hi, I want to rent ${rental.title}\n\n` +
        `📍 Location: ${rental.city}, ${rental.state}\n` +
        `📅 Rental Period: ${startDate.toLocaleDateString('en-IN')} to ${endDate.toLocaleDateString('en-IN')}\n` +
        `⏱️ Duration: ${days} ${days === 1 ? 'day' : 'days'}\n` +
        `💰 Total Rental Cost: ₹${totalPrice.toLocaleString('en-IN')}\n` +
        `💵 Security Deposit: ₹${rental.securityDeposit.toLocaleString('en-IN')}\n` +
        `💳 Total Amount: ₹${(totalPrice + rental.securityDeposit).toLocaleString('en-IN')}\n\n` +
        `Link: ${rentalUrl}`
      );
    } else {
      // Message without dates - general inquiry
      return encodeURIComponent(
        `Hi, I'm interested in renting ${rental.title}\n\n` +
        `📍 Location: ${rental.city}, ${rental.state}\n` +
        `💰 Daily Rate: ₹${rental.dailyRate.toLocaleString('en-IN')}\n` +
        `💰 Weekly Rate: ₹${rental.weeklyRate.toLocaleString('en-IN')}\n` +
        `💰 Monthly Rate: ₹${rental.monthlyRate.toLocaleString('en-IN')}\n` +
        `💵 Security Deposit: ₹${rental.securityDeposit.toLocaleString('en-IN')}\n\n` +
        `Please share availability details.\n\n` +
        `Link: ${rentalUrl}`
      );
    }
  };

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${createWhatsAppMessage()}`;

  if (bookingSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="text-center">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-green-800 mb-2">Booking Request Sent!</h3>
          <p className="text-green-700 mb-4">
            Thank you for your booking request. Our team will contact you shortly to confirm your rental.
          </p>
          <p className="text-sm text-green-600">
            Check your email for confirmation details.
          </p>
          <Button 
            onClick={() => setBookingSuccess(false)}
            className="mt-4"
            variant="outline"
          >
            Make Another Booking
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {loading && <LoadingOverlay message="Submitting your booking..." />}
      {/* Pricing Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-1">Starting from</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-green-600">
              ₹{rental.dailyRate.toLocaleString('en-IN')}
            </span>
            <span className="text-gray-600">/day</span>
          </div>
        </div>

        <div className="space-y-2 py-4 border-y border-gray-200 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Weekly Rate</span>
            <span className="font-semibold">₹{rental.weeklyRate.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Monthly Rate</span>
            <span className="font-semibold">₹{rental.monthlyRate.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Security Deposit</span>
            <span className="font-semibold">₹{rental.securityDeposit.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {!isAvailable && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-medium">
              ⚠️ This vehicle is currently rented
            </p>
          </div>
        )}
      </div>

      {/* Date Picker */}
      {isAvailable && (
        <DatePicker
          dailyRate={rental.dailyRate}
          weeklyRate={rental.weeklyRate}
          monthlyRate={rental.monthlyRate}
          minimumRentalDays={rental.minimumRentalDays}
          maximumRentalDays={rental.maximumRentalDays}
          onDateChange={handleDateChange}
        />
      )}

      {/* WhatsApp Booking Button - Always Available */}
      {isAvailable ? (
        <div className="space-y-3">
          {/* Direct Booking Form Option */}
          {!showBookingForm ? (
            <>
              <Button 
                onClick={() => setShowBookingForm(true)}
                disabled={!startDate || !endDate || days === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-4"
                icon={<CalendarIcon className="w-5 h-5" />}
              >
                {startDate && endDate ? 'Book Now' : 'Select Dates to Book'}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-lg py-4" icon={<MessageCircle className="w-5 h-5" />}>
                  {startDate && endDate && days > 0 ? 'Book via WhatsApp' : 'Inquire on WhatsApp'}
                </Button>
              </a>
              {!(startDate && endDate) && (
                <p className="text-sm text-gray-600 mt-3 text-center">
                  💡 Select dates above or chat directly for availability
                </p>
              )}
            </>
          ) : (
            <>
              {/* Booking Form */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Complete Your Booking</h3>
                  <button 
                    onClick={() => setShowBookingForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                {/* Booking Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rental Period:</span>
                      <span className="font-semibold">
                        {startDate?.toLocaleDateString('en-IN')} - {endDate?.toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold">{days} {days === 1 ? 'day' : 'days'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rental Cost:</span>
                      <span className="font-semibold">₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Security Deposit:</span>
                      <span className="font-semibold">₹{rental.securityDeposit.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between border-t border-blue-300 pt-2 mt-2">
                      <span className="font-bold">Total Amount:</span>
                      <span className="font-bold text-green-600">
                        ₹{(totalPrice + rental.securityDeposit).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+91 XXXXX XXXXX"
                      pattern="[0-9+\s]+"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Pickup Location (Optional)
                    </label>
                    <input
                      type="text"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`${rental.city}, ${rental.state}`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Default: {rental.city}, {rental.state}
                    </p>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Button 
                      type="submit"
                      loading={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                    >
                      Confirm Booking Request
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      variant="outline"
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 text-center">
                    Our team will contact you to confirm your booking within 24 hours.
                  </p>
                </form>
              </div>
            </>
          )}
        </div>
      ) : (
        <div>
          <Button
            disabled
            className="w-full bg-gray-300 cursor-not-allowed text-gray-600 flex items-center justify-center gap-2 text-lg py-4"
          >
            Currently Rented
          </Button>
          <p className="text-sm text-gray-600 mt-3 text-center">
            This vehicle is currently unavailable
          </p>
        </div>
      )}
    </div>
  );
}
