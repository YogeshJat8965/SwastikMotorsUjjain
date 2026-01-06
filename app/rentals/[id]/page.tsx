import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ImageGallery from '@/components/vehicle/ImageGallery';
import RentalBooking from '@/components/rental/RentalBooking';
import Badge from '@/components/ui/Badge';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Rental {
  _id: string;
  title: string;
  description: string;
  category: 'bike' | 'car';
  brand: string;
  vehicleModel: string;
  year: number;
  fuelType: string;
  transmission: string;
  color: string;
  city: string;
  state: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  securityDeposit: number;
  seatingCapacity: number;
  mileageLimit: number;
  extraKmCharge: number;
  features: string[];
  status: 'available' | 'rented' | 'maintenance' | 'inactive';
  minimumRentalDays: number;
  maximumRentalDays?: number;
  rating?: number;
  totalBookings: number;
  images: string[];
  registrationNumber: string;
}

async function getRental(id: string): Promise<Rental | null> {
  try {
    // For server-side rendering, use absolute URL
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
      || `${protocol}://localhost:3000`;
    
    const res = await fetch(`${baseUrl}/api/rentals/${id}`, {
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
    console.error('Error fetching rental:', error);
    return null;
  }
}

async function incrementViews(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000');
    await fetch(`${baseUrl}/api/rentals/${id}/view`, {
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
  const rental = await getRental(id);

  if (!rental) {
    return {
      title: 'Rental Not Found | Swastik Motors',
    };
  }

  const title = rental.title;
  const description = `Rent ${title} - ₹${rental.dailyRate}/day | ${rental.city} | ${rental.transmission} | ${rental.fuelType}`;

  return {
    title: `${title} for Rent | Swastik Bikes`,
    description,
    openGraph: {
      title: `${title} for Rent | Swastik Bikes`,
      description,
      images: [rental.images[0]],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} for Rent | Swastik Bikes`,
      description,
      images: [rental.images[0]],
    },
  };
}

export default async function RentalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rental = await getRental(id);

  if (!rental) {
    notFound();
  }

  // Increment views (fire and forget)
  incrementViews(id);

  const isAvailable = rental.status === 'available';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/rentals" className="hover:text-blue-600">Rentals</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium truncate">{rental.title}</span>
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
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge color="blue">{rental.category === 'bike' ? '🏍️ Bike' : '🚗 Car'}</Badge>
                {!isAvailable && <Badge color="red">Currently Rented</Badge>}
                {rental.rating && (
                  <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-semibold text-gray-900">{rental.rating.toFixed(1)}</span>
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  {rental.totalBookings} {rental.totalBookings === 1 ? 'booking' : 'bookings'}
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {rental.title}
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <span>📍</span>
                {rental.city}, {rental.state}
              </p>
            </div>

            {/* Image Gallery */}
            <ImageGallery images={rental.images} alt={rental.title} />

            {/* Vehicle Specifications */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Vehicle Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🚗</span>
                  <div>
                    <div className="text-sm text-gray-500">Brand</div>
                    <div className="font-semibold text-gray-900">{rental.brand}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📦</span>
                  <div>
                    <div className="text-sm text-gray-500">Model</div>
                    <div className="font-semibold text-gray-900">{rental.vehicleModel}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <div className="text-sm text-gray-500">Year</div>
                    <div className="font-semibold text-gray-900">{rental.year}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⛽</span>
                  <div>
                    <div className="text-sm text-gray-500">Fuel Type</div>
                    <div className="font-semibold text-gray-900 capitalize">{rental.fuelType}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚙️</span>
                  <div>
                    <div className="text-sm text-gray-500">Transmission</div>
                    <div className="font-semibold text-gray-900 capitalize">{rental.transmission}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">👥</span>
                  <div>
                    <div className="text-sm text-gray-500">Seating</div>
                    <div className="font-semibold text-gray-900">{rental.seatingCapacity} Seats</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎨</span>
                  <div>
                    <div className="text-sm text-gray-500">Color</div>
                    <div className="font-semibold text-gray-900">{rental.color}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🛣️</span>
                  <div>
                    <div className="text-sm text-gray-500">Km Limit/Day</div>
                    <div className="font-semibold text-gray-900">{rental.mileageLimit} km</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💰</span>
                  <div>
                    <div className="text-sm text-gray-500">Extra Km</div>
                    <div className="font-semibold text-gray-900">₹{rental.extraKmCharge}/km</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rental Terms */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Rental Terms</h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">ℹ️</span>
                  <div>
                    <strong>Security Deposit:</strong> ₹{rental.securityDeposit.toLocaleString('en-IN')} (refundable)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">ℹ️</span>
                  <div>
                    <strong>Minimum Rental:</strong> {rental.minimumRentalDays} {rental.minimumRentalDays === 1 ? 'day' : 'days'}
                  </div>
                </div>
                {rental.maximumRentalDays && (
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">ℹ️</span>
                    <div>
                      <strong>Maximum Rental:</strong> {rental.maximumRentalDays} days
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">ℹ️</span>
                  <div>
                    <strong>Fuel:</strong> Vehicle will be provided with full tank. Return with full tank or pay for refueling.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">ℹ️</span>
                  <div>
                    <strong>Documents Required:</strong> Valid driving license, Aadhar card, and one local address proof.
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {rental.description && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {rental.description}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Date Picker and Booking */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <RentalBooking rental={rental} isAvailable={isAvailable} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}