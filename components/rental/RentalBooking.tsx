'use client';

import { useState } from 'react';
import DatePicker from '@/components/rental/DatePicker';
import Button from '@/components/ui/Button';

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

  const handleDateChange = (start: Date | null, end: Date | null, price: number, duration: number) => {
    setStartDate(start);
    setEndDate(end);
    setTotalPrice(price);
    setDays(duration);
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

  return (
    <div className="space-y-6">
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
        <div>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
            <Button className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2 text-lg py-4">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              {startDate && endDate && days > 0 ? 'Book via WhatsApp' : 'Inquire on WhatsApp'}
            </Button>
          </a>
          {!(startDate && endDate) && (
            <p className="text-sm text-gray-600 mt-3 text-center">
              💡 Select dates above or chat directly for availability
            </p>
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
