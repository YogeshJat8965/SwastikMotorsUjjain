'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageCircle, Calendar, Route, Fuel, MapPin, Star, Bike, Car as CarIcon } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';

interface VehicleCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  year: number;
  kilometers: number;
  location?: string;
  fuelType?: string;
  category: 'bike' | 'car';
  featured?: boolean;
  onWhatsAppClick?: () => void;
}

export default function VehicleCard({
  id,
  title,
  price,
  image,
  year,
  kilometers,
  location,
  fuelType,
  category,
  featured = false,
  onWhatsAppClick,
}: VehicleCardProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  
  const whatsappNumber = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '918965900973';
  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in ${title}\nPrice: ₹${price.toLocaleString('en-IN')}\nLocation: ${location}`
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Fallback image based on category
  const fallbackImage = category === 'bike' 
    ? 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' 
    : 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80';

  const handleCardClick = () => {
    setIsNavigating(true);
    router.push(`/vehicle/${id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-300 group cursor-pointer relative"
    >
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
            alt={title || `${category === 'bike' ? 'Bike' : 'Car'} for sale`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
          {featured && (
            <div className="absolute top-3 left-3">
              <Badge color="yellow" className="flex items-center gap-1">
                <Star className="w-3 h-3" fill="currentColor" />
                Featured
              </Badge>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge color="blue" className="flex items-center gap-1">
              {category === 'bike' ? (
                <><Bike className="w-3 h-3" /> Bike</>
              ) : (
                <><CarIcon className="w-3 h-3" /> Car</>
              )}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
          {title}
        </h3>
        
        {/* Price */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-green-600">
            ₹{price ? price.toLocaleString('en-IN') : '0'}
          </span>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{year || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Route className="w-4 h-4 text-gray-400" />
            <span>{kilometers ? kilometers.toLocaleString('en-IN') : '0'} km</span>
          </div>
          {fuelType && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Fuel className="w-4 h-4 text-gray-400" />
              <span>{fuelType}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="block"
          >
            <Link href={`/vehicle/${id}`}>
              <Button variant="outline" size="sm" className="w-full hover:border-blue-600 hover:text-blue-600">
                View Details
              </Button>
            </Link>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onWhatsAppClick}
            >
              <Button variant="primary" size="sm" className="w-full bg-green-600 hover:bg-green-700" icon={<MessageCircle className="w-4 h-4" />}>
                WhatsApp
              </Button>
          </a>
          </div>
        </div>
      </div>
    </div>
  );
}
