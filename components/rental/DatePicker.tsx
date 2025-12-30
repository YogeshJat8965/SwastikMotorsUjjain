'use client';

import { useState, useMemo } from 'react';

interface DatePickerProps {
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  minimumRentalDays?: number;
  maximumRentalDays?: number;
  onDateChange?: (startDate: Date | null, endDate: Date | null, totalPrice: number, days: number) => void;
}

export default function DatePicker({
  dailyRate,
  weeklyRate,
  monthlyRate,
  minimumRentalDays = 1,
  maximumRentalDays = 30,
  onDateChange,
}: DatePickerProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Get today's date in YYYY-MM-DD format
  const today = useMemo(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }, []);

  // Get max date (today + maximumRentalDays)
  const maxDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + maximumRentalDays + 90); // Allow booking up to 90 days in advance
    return date.toISOString().split('T')[0];
  }, [maximumRentalDays]);

  // Calculate minimum end date based on start date and minimum rental days
  const minEndDate = useMemo(() => {
    if (!startDate) return today;
    const date = new Date(startDate);
    date.setDate(date.getDate() + minimumRentalDays);
    return date.toISOString().split('T')[0];
  }, [startDate, minimumRentalDays, today]);

  // Calculate maximum end date based on start date and maximum rental days
  const maxEndDate = useMemo(() => {
    if (!startDate) return maxDate;
    const date = new Date(startDate);
    date.setDate(date.getDate() + maximumRentalDays);
    const maxAllowed = new Date(maxDate);
    return date > maxAllowed ? maxDate : date.toISOString().split('T')[0];
  }, [startDate, maximumRentalDays, maxDate]);

  // Calculate rental duration and total cost
  const { days, totalPrice, priceBreakdown } = useMemo(() => {
    if (!startDate || !endDate) {
      return { days: 0, totalPrice: 0, priceBreakdown: null };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let price = 0;
    let breakdown = null;

    // Calculate price based on duration
    if (diffDays >= 30) {
      // Monthly rate
      const months = Math.floor(diffDays / 30);
      const remainingDays = diffDays % 30;
      price = (months * monthlyRate) + (remainingDays * dailyRate);
      breakdown = {
        months,
        remainingDays,
        monthlyRate,
        dailyRate,
      };
    } else if (diffDays >= 7) {
      // Weekly rate
      const weeks = Math.floor(diffDays / 7);
      const remainingDays = diffDays % 7;
      price = (weeks * weeklyRate) + (remainingDays * dailyRate);
      breakdown = {
        weeks,
        remainingDays,
        weeklyRate,
        dailyRate,
      };
    } else {
      // Daily rate
      price = diffDays * dailyRate;
      breakdown = {
        days: diffDays,
        dailyRate,
      };
    }

    return { days: diffDays, totalPrice: price, priceBreakdown: breakdown };
  }, [startDate, endDate, dailyRate, weeklyRate, monthlyRate]);

  // Handle date changes
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    
    // Reset end date if it's before the new minimum
    if (endDate) {
      const minEnd = new Date(newStartDate);
      minEnd.setDate(minEnd.getDate() + minimumRentalDays);
      if (new Date(endDate) < minEnd) {
        setEndDate('');
        onDateChange?.(new Date(newStartDate), null, 0, 0);
      } else {
        onDateChange?.(new Date(newStartDate), new Date(endDate), totalPrice, days);
      }
    } else {
      onDateChange?.(new Date(newStartDate), null, 0, 0);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    
    if (startDate) {
      // Calculate here to get immediate values
      const start = new Date(startDate);
      const end = new Date(newEndDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let price = 0;
      if (diffDays >= 30) {
        const months = Math.floor(diffDays / 30);
        const remainingDays = diffDays % 30;
        price = (months * monthlyRate) + (remainingDays * dailyRate);
      } else if (diffDays >= 7) {
        const weeks = Math.floor(diffDays / 7);
        const remainingDays = diffDays % 7;
        price = (weeks * weeklyRate) + (remainingDays * dailyRate);
      } else {
        price = diffDays * dailyRate;
      }
      
      onDateChange?.(start, end, price, diffDays);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Select Rental Dates</h3>
      
      {/* Date Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={handleStartDateChange}
            min={today}
            max={maxDate}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={handleEndDateChange}
            min={minEndDate}
            max={maxEndDate}
            disabled={!startDate}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Rental Info */}
      {minimumRentalDays > 1 && (
        <div className="text-sm text-gray-600 mb-4">
          ℹ️ Minimum rental period: {minimumRentalDays} days
        </div>
      )}

      {/* Price Calculation */}
      {days > 0 && totalPrice > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Duration</span>
              <span className="font-semibold text-gray-900">{days} {days === 1 ? 'day' : 'days'}</span>
            </div>
            
            {/* Price Breakdown */}
            {priceBreakdown && (
              <div className="space-y-2 py-3 border-y border-gray-100">
                {'months' in priceBreakdown && priceBreakdown.months && priceBreakdown.months > 0 && (
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>{priceBreakdown.months} {priceBreakdown.months === 1 ? 'month' : 'months'} × ₹{monthlyRate.toLocaleString('en-IN')}</span>
                    <span>₹{(priceBreakdown.months * monthlyRate).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {'weeks' in priceBreakdown && priceBreakdown.weeks && priceBreakdown.weeks > 0 && (
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>{priceBreakdown.weeks} {priceBreakdown.weeks === 1 ? 'week' : 'weeks'} × ₹{weeklyRate.toLocaleString('en-IN')}</span>
                    <span>₹{(priceBreakdown.weeks * weeklyRate).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {priceBreakdown.remainingDays && priceBreakdown.remainingDays > 0 && (
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>{priceBreakdown.remainingDays} {priceBreakdown.remainingDays === 1 ? 'day' : 'days'} × ₹{dailyRate.toLocaleString('en-IN')}</span>
                    <span>₹{(priceBreakdown.remainingDays * dailyRate).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {'days' in priceBreakdown && !('weeks' in priceBreakdown) && !('months' in priceBreakdown) && (
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>{priceBreakdown.days} {priceBreakdown.days === 1 ? 'day' : 'days'} × ₹{dailyRate.toLocaleString('en-IN')}</span>
                    <span>₹{(priceBreakdown.days * dailyRate).toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-green-600">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Rate Information */}
      <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Pricing</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-600 mb-1">Daily</div>
            <div className="font-semibold text-gray-900">₹{dailyRate.toLocaleString('en-IN')}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-600 mb-1">Weekly</div>
            <div className="font-semibold text-gray-900">₹{weeklyRate.toLocaleString('en-IN')}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-600 mb-1">Monthly</div>
            <div className="font-semibold text-gray-900">₹{monthlyRate.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
