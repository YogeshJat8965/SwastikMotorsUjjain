import Link from 'next/link';
import { Instagram, MessageCircle, Shield, Search, Car, DollarSign, CheckCircle, TrendingUp, Users, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import VehicleCard from '@/components/ui/VehicleCard';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Fetch featured vehicles from API
async function getFeaturedVehicles() {
  try {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
      || `${protocol}://localhost:3000`;
    
    const res = await fetch(`${baseUrl}/api/vehicles?category=all&limit=12&sort=latest`, {
      cache: 'no-store',
    });

    if (!res.ok) return [];
    const data = await res.json();
    const vehicles = data.vehicles || [];
    
    // Transform vehicles to match VehicleCard props
    return vehicles.map((vehicle: any) => ({
      id: vehicle._id,
      title: `${vehicle.brand || ''} ${vehicle.model || vehicle.vehicleModel || ''} ${vehicle.year || ''}`.trim() || 'Vehicle',
      price: vehicle.sellingPrice || vehicle.price || 0,
      image: vehicle.images?.[0] || '',
      year: vehicle.year || new Date().getFullYear(),
      kilometers: vehicle.odometer || vehicle.kilometers || 0,
      location: vehicle.location?.city || vehicle.city || 'Ujjain',
      fuelType: vehicle.fuelType || 'Petrol',
      category: vehicle.category || 'bike',
      featured: vehicle.featured || false,
    }));
  } catch (error) {
    console.error('Error fetching featured vehicles:', error);
    return [];
  }
}

export default async function Home() {
  const whatsappNumber = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '918965900973';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi, I want to know more about your bikes/cars`;
  
  const vehicles = await getFeaturedVehicles();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12 md:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Buy, Sell & Rent Bikes & Cars
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Your trusted partner with 35,000+ Instagram followers and 3,000+ WhatsApp members
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge color="blue" className="text-sm py-2 px-4 flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                35,000+ Instagram Followers
              </Badge>
              <Badge color="green" className="text-sm py-2 px-4 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                3,000+ WhatsApp Members
              </Badge>
              <Badge color="yellow" className="text-sm py-2 px-4 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                100% Trusted
              </Badge>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-lg p-2 max-w-2xl mx-auto mb-6">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Search for bikes or cars..."
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none"
                />
                <Button variant="primary" size="lg" className="whitespace-nowrap" icon={<Search className="w-5 h-5" />}>
                  Search
                </Button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/buy">
                <Button variant="secondary" size="lg" className="!bg-white !text-primary-600 hover:!bg-gray-100 font-semibold">
                  Browse Vehicles
                </Button>
              </Link>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600" icon={<MessageCircle className="w-5 h-5" />}>
                  Contact on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                Browse through our extensive collection of bikes and cars
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Best Prices</h3>
              <p className="text-gray-600">
                Get the best deals on quality vehicles
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Trusted Platform</h3>
              <p className="text-gray-600">
                35k+ followers trust us for their vehicle needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">⭐ Featured Vehicles</h2>
            <Link href="/buy">
              <Button variant="outline" size="md">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.slice(0, 6).map((vehicle: any) => (
              <VehicleCard key={vehicle.id} {...vehicle} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Bikes */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">🏍️ Latest Bikes</h2>
            <Link href="/buy?category=bike">
              <Button variant="outline" size="md">View All Bikes</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.filter((v: any) => v.category === 'bike').slice(0, 6).map((vehicle: any) => (
              <VehicleCard key={vehicle.id} {...vehicle} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Cars */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">🚗 Latest Cars</h2>
            <Link href="/buy?category=car">
              <Button variant="outline" size="md">View All Cars</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.filter((v: any) => v.category === 'car').slice(0, 6).map((vehicle: any) => (
              <VehicleCard key={vehicle.id} {...vehicle} />
            ))}
          </div>
        </div>
      </section>

      {/* Instagram CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container text-center">
          <div className="max-w-2xl mx-auto">
            <div className="mb-4 flex justify-center">
              <Instagram className="w-16 h-16" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Follow Us on Instagram</h2>
            <p className="text-xl mb-8 text-purple-100">
              Join our community of 35,000+ followers for daily updates on new bikes & cars!
            </p>
            <div className="flex justify-center">
              <a
                href={`https://instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || 'yogeshjat100'}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="lg" className="!bg-white !text-purple-600 hover:!bg-gray-100 font-semibold" icon={<Instagram className="w-5 h-5" />}>
                  Follow @{process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || 'yogeshjat100'}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Sell Your Vehicle?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Get the best price for your bike or car. We'll contact you within 24 hours!
          </p>
          <Link href="/sell-to-us">
            <Button variant="primary" size="lg">
              💵 Sell to Us Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
