
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Eye } from 'lucide-react';
import ImageGallery from '@/components/vehicle/ImageGallery';
import SpecsTable from '@/components/vehicle/SpecsTable';
import StickyActionBar from '@/components/vehicle/StickyActionBar';
import VehicleCard from '@/components/ui/VehicleCard';
import Badge from '@/components/ui/Badge';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Vehicle {
  _id: string;
  category: 'bike' | 'car';
  brand: string;
  vehicleModel: string;
  year: number;
  sellingPrice: number;
  images: string[];
  fuelType: string;
  transmission: string;
  kilometers: number;
  color: string;
  city?: string;
  state?: string;
  description?: string;
  status: string;
  featured?: boolean;
  views?: number;
  createdAt: string;
}

async function getVehicle(id: string): Promise<Vehicle | null> {
  try {
    // For server-side rendering, use absolute URL
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
      || `${protocol}://localhost:3000`;
    
    const res = await fetch(`${baseUrl}/api/vehicles/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return null;
  }
}

async function getSimilarVehicles(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000');
    const res = await fetch(`${baseUrl}/api/vehicles/${id}/similar`, {
      cache: 'no-store',
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.vehicles || [];
  } catch (error) {
    console.error('Error fetching similar vehicles:', error);
    return [];
  }
}

async function incrementViews(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000');
    await fetch(`${baseUrl}/api/vehicles/${id}/view`, {
      method: 'POST',
      cache: 'no-store',
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await getVehicle(id);

  if (!vehicle) {
    return {
      title: 'Vehicle Not Found | Swastik Motors',
    };
  }

  const title = `${vehicle.brand} ${vehicle.vehicleModel} ${vehicle.year}`;
  const description = vehicle.description || `${title} - ₹${vehicle.sellingPrice.toLocaleString('en-IN')} | ${vehicle.kilometers.toLocaleString('en-IN')} km | ${vehicle.fuelType} | ${vehicle.city || 'India'}`;

  return {
    title: `${title} | Swastik Bikes`,
    description,
    openGraph: {
      title: `${title} | Swastik Bikes`,
      description,
      images: [vehicle.images[0]],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Swastik Bikes`,
      description,
      images: [vehicle.images[0]],
    },
  };
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = await getVehicle(id);

  if (!vehicle) {
    notFound();
  }

  // Increment views (fire and forget)
  incrementViews(id);

  // Get similar vehicles
  const similarVehicles = await getSimilarVehicles(id);

  const title = `${vehicle.brand} ${vehicle.vehicleModel} ${vehicle.year}`;
  const whatsappNumber = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '918965900973';
  
  // Construct the full vehicle URL for sharing
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const vehicleUrl = `${baseUrl}/vehicle/${id}`;
  
  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in ${title}\n\nPrice: ₹${vehicle.sellingPrice.toLocaleString('en-IN')}\nYear: ${vehicle.year}\nKilometers: ${vehicle.kilometers.toLocaleString('en-IN')} km\nLocation: ${[vehicle.city, vehicle.state].filter(Boolean).join(', ')}\n\nLink: ${vehicleUrl}`
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/buy" className="hover:text-blue-600">Browse</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium truncate">{title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Badges */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                <div className="flex gap-2">
                  {vehicle.featured && <Badge color="yellow">⭐ Featured</Badge>}
                  <Badge color="blue">{vehicle.category === 'bike' ? '🏍️ Bike' : '🚗 Car'}</Badge>
                </div>
              </div>
              
              {/* Views Counter */}
              <div className="flex items-center gap-2 text-gray-600">
                <Eye className="w-5 h-5" />
                <span className="text-sm">{vehicle.views || 0} {vehicle.views === 1 ? 'view' : 'views'}</span>
              </div>
            </div>

            {/* Image Gallery */}
            <ImageGallery images={vehicle.images} alt={title} />

            {/* Specifications */}
            <SpecsTable
              brand={vehicle.brand}
              model={vehicle.vehicleModel}
              year={vehicle.year}
              kilometers={vehicle.kilometers}
              fuelType={vehicle.fuelType}
              transmission={vehicle.transmission}
              color={vehicle.color}
              city={vehicle.city}
              state={vehicle.state}
              category={vehicle.category}
            />

            {/* Description */}
            {vehicle.description && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {vehicle.description}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Action Bar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <StickyActionBar
                title={title}
                price={vehicle.sellingPrice}
                whatsappLink={whatsappLink}
              />
            </div>
          </div>
        </div>

        {/* Similar Vehicles */}
        {similarVehicles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Vehicles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarVehicles.map((vehicle: any) => (
                <VehicleCard
                  key={vehicle._id}
                  id={vehicle._id}
                  title={`${vehicle.brand} ${vehicle.vehicleModel}`}
                  price={vehicle.sellingPrice}
                  image={vehicle.images[0]}
                  year={vehicle.year}
                  kilometers={vehicle.kilometers}
                  fuelType={vehicle.fuelType}
                  location={vehicle.city}
                  featured={vehicle.featured}
                  category={vehicle.category}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
