import Link from 'next/link';
import { Instagram, MessageCircle, Shield, Search, Car, IndianRupee, CheckCircle, TrendingUp, Users, Clock, Youtube } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import VehicleCard from '@/components/ui/VehicleCard';

// Enable ISR with revalidation
export const revalidate = 300; // Revalidate every 5 minutes

// Fetch featured vehicles from API
async function getFeaturedVehicles() {
  try {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
      || `${protocol}://localhost:3000`;
    
    const res = await fetch(`${baseUrl}/api/vehicles?category=all&limit=12&sort=latest`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
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
  const whatsappNumber = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '917089311939';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi, I want to know more about your bikes/cars`;
  
  const vehicles = await getFeaturedVehicles();

  return (
    <div>
      {/* Hero Section - Modern Split Design */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden" style={{ minHeight: 'auto' }}>
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-float-slow"></div>
        </div>

        <div className="container relative z-10 py-4 sm:py-12 md:py-12 lg:py-16">
          {/* Top Badge */}
          <div className="flex justify-center mb-3 sm:mb-8 animate-fade-in-down">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-6 sm:py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs sm:text-sm font-semibold">🔥 Trusted by 38,000+ Happy Customers</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-5 sm:space-y-8 animate-fade-in-left">
              {/* Main Headline */}
              <div>
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-3 sm:mb-6">
                  <span className="block text-white">Find Your</span>
                  <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                    Dream Ride
                  </span>
                  <span className="block text-white">Today</span>
                </h1>
                <p className="text-sm sm:text-xl md:text-2xl text-gray-300 leading-relaxed">
                  Buy, Sell & Rent bikes and cars with the most trusted marketplace
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="relative bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-blue-400/30 hover:scale-105 transition-transform duration-300 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="relative">
                    <div className="text-xl sm:text-3xl font-bold text-blue-300 animate-pulse-slow">37K+</div>
                    <div className="text-[10px] sm:text-xs text-gray-300 mt-0.5 sm:mt-1">Instagram</div>
                  </div>
                </div>
                <div className="relative bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-green-400/30 hover:scale-105 transition-transform duration-300 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 animation-delay-200"></div>
                  <div className="relative">
                    <div className="text-xl sm:text-3xl font-bold text-green-300 animate-pulse-slow">8K+</div>
                    <div className="text-[10px] sm:text-xs text-gray-300 mt-0.5 sm:mt-1">WhatsApp</div>
                  </div>
                </div>
                <div className="relative bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-yellow-400/30 hover:scale-105 transition-transform duration-300 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 animation-delay-400"></div>
                  <div className="relative">
                    <div className="text-xl sm:text-3xl font-bold text-yellow-300 animate-pulse-slow">100%</div>
                    <div className="text-[10px] sm:text-xs text-gray-300 mt-0.5 sm:mt-1">Trusted</div>
                  </div>
                </div>
              </div>

              {/* Search Box - Hidden on Mobile */}
              <div className="relative group hidden md:block">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                <div className="relative bg-white rounded-2xl p-2 shadow-2xl">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search bikes, cars, scooters..."
                        className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-lg font-medium"
                      />
                    </div>
                    <Link href="/buy">
                      <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl whitespace-nowrap flex items-center justify-center gap-2">
                        <Search className="w-5 h-5" />
                        Search
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/buy" className="flex-1">
                  <button className="w-full px-6 py-3.5 sm:px-8 sm:py-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 sm:gap-3 group text-sm sm:text-base">
                    <Car className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform" />
                    <span>Browse Vehicles</span>
                  </button>
                </Link>
                <Link href="/sell-to-us" className="flex-1">
                  <button className="w-full px-6 py-3.5 sm:px-8 sm:py-5 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 sm:gap-3 group text-sm sm:text-base">
                    <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                    <span>Sell Your Vehicle</span>
                  </button>
                </Link>
              </div>

              {/* Quick Features */}
              <div className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 sm:gap-2 group cursor-pointer">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  </div>
                  <span className="text-gray-300">Verified Vehicles</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 group cursor-pointer">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  </div>
                  <span className="text-gray-300">Secure Deals</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 group cursor-pointer">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-500/20 flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                  </div>
                  <span className="text-gray-300">Fast Response</span>
                </div>
              </div>
            </div>

            {/* Right Visual - Interactive Cards */}
            <div className="relative hidden lg:block animate-fade-in-right">
              <div className="relative h-[600px]">
                {/* Main Featured Card */}
                <div className="absolute top-0 right-0 w-80 h-96 bg-gradient-to-br from-blue-500/90 to-purple-600/90 backdrop-blur-xl rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500 border border-white/20 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/50"></div>
                  <div className="relative h-full p-6 flex flex-col justify-between">
                    <div>
                      <div className="inline-block px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold mb-3">
                        ⭐ FEATURED
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Premium Bikes</h3>
                      <p className="text-blue-100 text-sm">Starting from ₹45,000</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-sm">200+ Available</span>
                      </div>
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-xl">🏍️</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Card */}
                <div className="absolute top-20 left-0 w-72 h-80 bg-gradient-to-br from-cyan-500/90 to-blue-600/90 backdrop-blur-xl rounded-3xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-all duration-500 border border-white/20 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/50"></div>
                  <div className="relative h-full p-6 flex flex-col justify-between">
                    <div>
                      <div className="inline-block px-3 py-1 bg-green-400 text-green-900 rounded-full text-xs font-bold mb-3">
                        🚗 NEW ARRIVALS
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Latest Cars</h3>
                      <p className="text-cyan-100 text-sm">From ₹2,50,000</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Users className="w-5 h-5" />
                        </div>
                        <span className="text-sm">150+ Models</span>
                      </div>
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-xl">🚗</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Float Button */}
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="absolute bottom-0 right-10 w-64 h-24 bg-gradient-to-r from-green-500 to-green-600 backdrop-blur-xl rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border border-green-400/30 overflow-hidden group">
                  <div className="relative h-full p-5 flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                      <MessageCircle className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-green-100 mb-1">Connect Now</div>
                      <div className="font-bold">WhatsApp Us</div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Mobile WhatsApp Button */}
          <div className="lg:hidden mt-4 sm:mt-6 animate-fade-in-up animation-delay-600">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <button className="w-full px-6 py-3.5 sm:px-8 sm:py-5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Chat on WhatsApp</span>
              </button>
            </a>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden lg:block">
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-white/50 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Scrolling Text Marquee */}
        <div className="relative border-t border-white/10 bg-gradient-to-r from-blue-600/30 to-purple-600/30 backdrop-blur-sm overflow-hidden py-3 sm:py-4 md:py-6">
          <div className="flex animate-scroll-left md:animate-scroll-left-slow whitespace-nowrap">
            <div className="flex items-center gap-6 sm:gap-8 md:gap-12 px-4 sm:px-6">
              <span className="text-xs sm:text-sm md:text-lg font-semibold text-white flex items-center gap-1.5 sm:gap-2">
                ⚡ Instant Verification
              </span>
              <span className="text-white/60">•</span>
              <span className="text-xs sm:text-sm md:text-lg font-semibold text-white flex items-center gap-1.5 sm:gap-2">
                🏆 Best Prices Guaranteed
              </span>
              <span className="text-white/60">•</span>
              <span className="text-xs sm:text-sm md:text-lg font-semibold text-white flex items-center gap-1.5 sm:gap-2">
                🚀 Quick Delivery
              </span>
              <span className="text-white/60">•</span>
              <span className="text-xs sm:text-sm md:text-lg font-semibold text-white flex items-center gap-1.5 sm:gap-2">
                💯 100% Genuine Vehicles
              </span>
              <span className="text-white/60">•</span>
              <span className="text-xs sm:text-sm md:text-lg font-semibold text-white flex items-center gap-1.5 sm:gap-2">
                🔒 Secure Transactions
              </span>
              <span className="text-white/60">•</span>
              <span className="text-xs sm:text-sm md:text-lg font-semibold text-white flex items-center gap-1.5 sm:gap-2">
                📱 24/7 Support
              </span>
              <span className="text-white/60">•</span>
            </div>
            {/* Duplicate for seamless loop */}
            <div className="flex items-center gap-6 sm:gap-8 md:gap-12 px-4 sm:px-6">
              <span className="text-xs sm:text-sm md:text-lg font-semibold text-white flex items-center gap-1.5 sm:gap-2">
                ⚡ Instant Verification
              </span>
              <span className="text-white/60">•</span>
              <span className="text-xs sm:text-sm md:text-lg font-semibold text-white flex items-center gap-1.5 sm:gap-2">
                🏆 Best Prices Guaranteed
              </span>
              <span className="text-white/60">•</span>
              <span className="text-xs sm:text-sm md:text-lg font-semibold text-white flex items-center gap-1.5 sm:gap-2">
                🚀 Quick Delivery
              </span>
              <span className="text-white/60">•</span>
              <span className="text-xs sm:text-sm md:text-lg font-semibold text-white flex items-center gap-1.5 sm:gap-2">
                💯 100% Genuine Vehicles
              </span>
              <span className="text-white/60">•</span>
              <span className="text-xs sm:text-sm md:text-lg font-semibold text-white flex items-center gap-1.5 sm:gap-2">
                🔒 Secure Transactions
              </span>
              <span className="text-white/60">•</span>
              <span className="text-xs sm:text-sm md:text-lg font-semibold text-white flex items-center gap-1.5 sm:gap-2">
                📱 24/7 Support
              </span>
              <span className="text-white/60">•</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="pt-6 sm:pt-12 md:pt-16 pb-8 sm:pb-12 md:pb-16 bg-gray-50" style={{ marginTop: '0px' }}>
        <div className="container">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
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
      <section className="relative py-10 md:py-14 overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Floating orbs */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>

        <div className="container relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/30 p-5 md:p-10 hover:shadow-white/50 transition-all duration-500 animate-fade-in-up">
              {/* Mobile-First Layout */}
              <div className="flex flex-col gap-5">
                {/* Icon and Title - Stacked on Mobile, Inline on Desktop */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="relative group flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 animate-pulse transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-purple-500 to-pink-600 p-3 md:p-4 rounded-2xl shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all">
                      <Instagram className="w-10 h-10 md:w-12 md:h-12 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-slate-800 via-purple-700 to-pink-700 bg-clip-text text-transparent mb-2">
                      Follow Us on Instagram
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700 font-semibold">
                      Join <span className="text-purple-600 font-black text-lg md:text-xl">37,000+</span> followers • Response in <span className="text-pink-600 font-black">24 Hours</span>
                    </p>
                  </div>
                </div>

                {/* Feature tags */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 hover:scale-105 transition-transform animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <span>📱</span> Stories Daily
                  </span>
                  <span className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 hover:scale-105 transition-transform animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <span>🎥</span> Reels & Videos
                  </span>
                  <span className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 hover:scale-105 transition-transform animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <span>💬</span> Active Community
                  </span>
                  <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 hover:scale-105 transition-transform animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <span>🎁</span> Giveaways
                  </span>
                </div>

                {/* CTA Button - Full Width on Mobile */}
                <a
                  href={`https://instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || 'yogeshjat100'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full sm:w-auto"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl md:rounded-2xl blur-xl opacity-60 group-hover:opacity-100 animate-pulse transition-opacity"></div>
                    
                    <button className="relative w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white px-6 py-4 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 border-2 border-white/20">
                      <Instagram className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-semibold opacity-90">Follow Now</span>
                        <span className="text-sm md:text-base">@{process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || 'yogeshjat100'}</span>
                      </div>
                      <span className="text-xl md:text-2xl group-hover:translate-x-1 transition-transform flex-shrink-0">→</span>
                    </button>
                  </div>
                </a>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-4 md:mt-6 text-xs md:text-sm text-white font-semibold">
              <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <span className="text-yellow-300 text-lg md:text-xl">✓</span> 
                <span>Daily Updates</span>
              </div>
              <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <span className="text-yellow-300 text-lg md:text-xl">✓</span> 
                <span>Exclusive Deals</span>
              </div>
              <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.7s' }}>
                <span className="text-yellow-300 text-lg md:text-xl">✓</span> 
                <span>Behind Scenes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-10 md:py-14 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Floating orbs */}
        <div className="absolute top-10 right-10 w-24 h-24 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>

        <div className="container relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-gray-200 p-5 md:p-10 hover:shadow-blue-200/50 transition-all duration-500 animate-fade-in-up">
              {/* Mobile-First Layout */}
              <div className="flex flex-col gap-5">
                {/* Icon and Title - Stacked on Mobile, Inline on Desktop */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="relative group flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 animate-pulse transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-3 md:p-4 rounded-2xl shadow-xl transform group-hover:scale-110 group-hover:rotate-12 transition-all">
                      <span className="text-3xl md:text-4xl">💰</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-slate-800 via-blue-700 to-purple-700 bg-clip-text text-transparent mb-2">
                      Sell Your Vehicle
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700 font-semibold">
                      Get <span className="text-blue-600 font-black text-lg md:text-xl">BEST PRICE</span> • Response in <span className="text-purple-600 font-black">24 Hours</span>
                    </p>
                  </div>
                </div>

                {/* Feature tags */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 hover:scale-105 transition-transform animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <span>⚡</span> Quick Process
                  </span>
                  <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 hover:scale-105 transition-transform animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <span>💯</span> Fair Value
                  </span>
                  <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 hover:scale-105 transition-transform animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <span>🔒</span> 100% Safe
                  </span>
                  <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 hover:scale-105 transition-transform animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <span>✅</span> Instant Cash
                  </span>
                </div>

                {/* CTA Button - Full Width on Mobile */}
                <Link href="/sell-to-us" className="group w-full sm:w-auto">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl md:rounded-2xl blur-xl opacity-60 group-hover:opacity-100 animate-pulse transition-opacity"></div>
                    
                    <button className="relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-6 py-4 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 border-2 border-white/20">
                      <span className="text-xl md:text-2xl animate-bounce flex-shrink-0">💵</span>
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-semibold opacity-90">Get Started</span>
                        <span className="text-sm md:text-base">Sell Now</span>
                      </div>
                      <span className="text-xl md:text-2xl group-hover:translate-x-1 transition-transform flex-shrink-0">→</span>
                    </button>
                  </div>
                </Link>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-4 md:mt-6 text-xs md:text-sm text-gray-600 font-semibold">
              <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <span className="text-green-500 text-lg md:text-xl">✓</span> 
                <span>Free Evaluation</span>
              </div>
              <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <span className="text-green-500 text-lg md:text-xl">✓</span> 
                <span>No Hidden Charges</span>
              </div>
              <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.7s' }}>
                <span className="text-green-500 text-lg md:text-xl">✓</span> 
                <span>Expert Team</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Section - Redesigned */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #e11d48 50%, #ec4899 100%)', margin: 0, padding: '2.5rem 0 2.5rem 0', marginBottom: 0 }}>
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="container relative z-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* YouTube Icon */}
            <div className="inline-flex items-center justify-center mb-4 md:mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-3xl blur-xl opacity-50 animate-pulse"></div>
                <div className="relative bg-white p-3 md:p-6 rounded-3xl shadow-2xl">
                  <Youtube className="w-10 h-10 md:w-16 md:h-16 text-red-600" />
                </div>
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-3 md:mb-4 leading-tight" style={{ color: '#ffffff', textShadow: '2px 2px 8px rgba(0,0,0,0.3)' }}>
              Watch Us on YouTube
            </h2>
            <p className="text-base md:text-xl font-semibold mb-2 md:mb-3" style={{ color: '#ffffff', textShadow: '1px 1px 4px rgba(0,0,0,0.3)' }}>
              <span className="font-black text-xl md:text-3xl" style={{ color: '#fde047', textShadow: '2px 2px 6px rgba(0,0,0,0.4)' }}>1k+</span> Subscribers
            </p>
            <p className="text-sm md:text-lg mb-6 md:mb-8" style={{ color: '#ffffff', textShadow: '1px 1px 4px rgba(0,0,0,0.3)' }}>
              Daily bike reviews, live updates & expert tips
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8">
              <div className="bg-white/30 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg" style={{ color: '#ffffff' }}>
                <span>🎬</span> Daily Videos
              </div>
              <div className="bg-white/30 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg" style={{ color: '#ffffff' }}>
                <span>🏍️</span> Bike Reviews
              </div>
              <div className="bg-white/30 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg" style={{ color: '#ffffff' }}>
                <span>🔴</span> Live Updates
              </div>
            </div>

            {/* CTA Button */}
            <a
              href={process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL || 'https://www.youtube.com/@Swastik_motors_Ujjain'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <button className="relative bg-white px-6 py-3 md:px-10 md:py-5 rounded-2xl font-black text-base md:text-xl shadow-2xl transform group-hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 md:gap-4" style={{ color: '#dc2626' }}>
                  <Youtube className="w-5 h-5 md:w-7 md:h-7" style={{ color: '#dc2626' }} />
                  <span>Subscribe Now</span>
                  <span className="text-xl md:text-2xl group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </a>

            {/* Channel Name */}
            <p className="mt-4 md:mt-6 font-semibold text-xs md:text-base" style={{ color: '#ffffff', textShadow: '1px 1px 4px rgba(0,0,0,0.3)', marginTop: '1rem', marginBottom: 0 }}>
              @Swastik_motors_Ujjain
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
