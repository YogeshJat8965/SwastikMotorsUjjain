import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from './Button';
import Badge from './Badge';

interface VehicleCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  year: number;
  kilometers: number;
  location: string;
  category: 'bike' | 'car';
  isFeatured?: boolean;
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
  category,
  isFeatured = false,
  onWhatsAppClick,
}: VehicleCardProps) {
  const whatsappNumber = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '918965900973';
  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in ${title}\nPrice: ₹${price.toLocaleString('en-IN')}\nLocation: ${location}`
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 w-full bg-gray-200">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isFeatured && (
          <div className="absolute top-2 left-2">
            <Badge color="yellow">⭐ Featured</Badge>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge color="blue">{category === 'bike' ? '🏍️ Bike' : '🚗 Car'}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{title}</h3>
        
        {/* Price */}
        <div className="mb-3">
          <span className="text-2xl font-bold text-primary-600">
            ₹{price.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
          <span className="flex items-center gap-1">
            📅 {year}
          </span>
          <span className="flex items-center gap-1">
            🛣️ {kilometers.toLocaleString('en-IN')} km
          </span>
        </div>

        {/* Location */}
        <div className="text-sm text-gray-500 mb-4 flex items-center gap-1">
          📍 {location}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/vehicle/${id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onWhatsAppClick}
            className="flex-1"
          >
            <Button variant="primary" size="sm" className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
