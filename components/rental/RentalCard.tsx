import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Settings, Fuel, Users, MapPin, Star, Bike, Car as CarIcon } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface RentalCardProps {
  id: string;
  title: string;
  dailyRate: number;
  weeklyRate: number;
  image: string;
  year: number;
  transmission: string;
  fuelType: string;
  seatingCapacity: number;
  city: string;
  category: 'bike' | 'car';
  featured?: boolean;
  status?: 'available' | 'rented' | 'maintenance' | 'inactive';
  rating?: number;
}

export default function RentalCard({
  id,
  title,
  dailyRate,
  weeklyRate,
  image,
  year,
  transmission,
  fuelType,
  seatingCapacity,
  city,
  category,
  featured = false,
  status = 'available',
  rating,
}: RentalCardProps) {
  const router = useRouter();
  const isAvailable = status === 'available';
  const [imageError, setImageError] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleCardClick = () => {
    setIsNavigating(true);
    router.push(`/rentals/${id}`);
  };

  // Fallback image based on category
  const fallbackImage = category === 'bike' 
    ? 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' 
    : 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80';

  return (
    <div onClick={handleCardClick} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-300 group cursor-pointer relative">
      {/* Loading Overlay */}
      {isNavigating && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin" style={{ padding: '3px' }}>
              <div className="w-full h-full rounded-full bg-white"></div>
            </div>
            <p className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Loading...</p>
          </div>
        </div>
      )}
      
      {/* Image */}
      <div className="block">
        <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
          <Image
            src={imageError ? fallbackImage : image}
            alt={title || `${category === 'bike' ? 'Bike' : 'Car'} available for rent`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {featured && (
              <Badge color="yellow" className="flex items-center gap-1">
                <Star className="w-3 h-3" fill="currentColor" />
                Featured
              </Badge>
            )}
            {!isAvailable && (
              <Badge color="red">Rented</Badge>
            )}
          </div>
          
          <div className="absolute top-3 right-3">
            <Badge color="blue" className="flex items-center gap-1">
              {category === 'bike' ? (
                <><Bike className="w-3 h-3" /> Bike</>
              ) : (
                <><CarIcon className="w-3 h-3" /> Car</>
              )}
            </Badge>
          </div>

          {/* Rating */}
          {rating && (
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
              <span className="text-sm font-semibold text-gray-900">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
          {title}
        </h3>
        
        {/* Pricing */}
        <div className="mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-green-600">
              ₹{dailyRate.toLocaleString('en-IN')}
            </span>
            <span className="text-sm text-gray-500">/day</span>
          </div>
          <div className="mt-1 text-sm text-gray-600">
            ₹{weeklyRate.toLocaleString('en-IN')}/week
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{year}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Settings className="w-4 h-4 text-gray-400" />
            <span className="capitalize">{transmission}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Fuel className="w-4 h-4 text-gray-400" />
            <span className="capitalize">{fuelType}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-gray-400" />
            <span>{seatingCapacity} Seats</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 col-span-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="truncate">{city}</span>
          </div>
        </div>

        {/* Actions */}
        <Button 
          variant={isAvailable ? "primary" : "outline"} 
          size="sm" 
          className={`w-full ${isAvailable ? 'bg-blue-600 hover:bg-blue-700' : 'cursor-not-allowed opacity-60'}`}
          disabled={!isAvailable}
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
        >
          {isAvailable ? 'Book Now' : 'Currently Rented'}
        </Button>
      </div>
    </div>
  );
}
