'use client';

import { useState, useEffect, useRef } from 'react';
import { Calendar, Heart, CheckCircle, Filter, Star, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import LoadingState from '@/components/ui/LoadingState';

interface SoldVehicle {
  _id: string;
  vehicleName: string;
  vehicleType: 'bike' | 'car';
  customerName?: string;
  image: string;
  soldDate: string;
  testimonial?: string;
  price?: number;
  featured: boolean;
}

export default function SuccessStoriesPage() {
  const [soldVehicles, setSoldVehicles] = useState<SoldVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'bike' | 'car'>('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSoldVehicles();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (!isAutoPlaying || featuredVehicles.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredVehicles.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, soldVehicles]);

  const fetchSoldVehicles = async () => {
    try {
      const res = await fetch('/api/sold-vehicles?limit=100');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setSoldVehicles(data.soldVehicles || []);
    } catch (error) {
      console.error('Error fetching sold vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredVehicles = soldVehicles.filter(
    (vehicle) => filter === 'all' || vehicle.vehicleType === filter
  );

  const featuredVehicles = filteredVehicles.filter((v) => v.featured);
  const regularVehicles = filteredVehicles.filter((v) => !v.featured);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredVehicles.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredVehicles.length) % featuredVehicles.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Parallax Effect */}
      <section className="relative bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 text-white py-12 sm:py-16 md:py-24 overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-white/10 rounded-full -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-white/10 rounded-full -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute w-64 h-64 bg-white/5 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container relative z-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 animate-fade-in text-sm sm:text-base">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce" />
              <span className="font-semibold">Trusted by Hundreds</span>
            </div>

            {/* Animated Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 animate-slide-up leading-tight px-2">
              <span className="inline-block animate-float text-4xl sm:text-5xl">🎉</span>
              <br className="sm:hidden" />
              Our Success Stories
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 mb-8 sm:mb-10 animate-fade-in px-4 leading-relaxed" style={{ animationDelay: '0.2s' }}>
              Real customers, real deals, real happiness!
              <br />
              See the smiles of satisfied buyers who found their dream vehicles with us.
            </p>

            {/* Animated Stats */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 animate-fade-in px-2" style={{ animationDelay: '0.4s' }}>
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl px-5 sm:px-6 md:px-8 py-4 sm:py-5 border border-white/30 transform active:scale-95 sm:hover:scale-110 transition-transform duration-300 hover:bg-white/20 min-w-[90px] sm:min-w-[110px]">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1">{soldVehicles.length}+</div>
                <div className="text-xs sm:text-sm text-blue-100 whitespace-nowrap">Happy Customers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl px-5 sm:px-6 md:px-8 py-4 sm:py-5 border border-white/30 transform active:scale-95 sm:hover:scale-110 transition-transform duration-300 hover:bg-white/20 min-w-[90px] sm:min-w-[110px]">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1">100%</div>
                <div className="text-xs sm:text-sm text-blue-100 whitespace-nowrap">Satisfaction</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl px-5 sm:px-6 md:px-8 py-4 sm:py-5 border border-white/30 transform active:scale-95 sm:hover:scale-110 transition-transform duration-300 hover:bg-white/20 min-w-[90px] sm:min-w-[110px]">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1">5★</div>
                <div className="text-xs sm:text-sm text-blue-100 whitespace-nowrap">Average Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 fill-gray-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      <div className="container py-8 sm:py-12 md:py-16 px-4">
        {/* Filter Tabs with Animation */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-12 md:mb-16 animate-fade-in flex-wrap">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="md"
            onClick={() => setFilter('all')}
            className="transform active:scale-95 sm:hover:scale-105 transition-all min-h-[48px] px-4 sm:px-6 text-sm sm:text-base font-semibold"
          >
            All ({soldVehicles.length})
          </Button>
          <Button
            variant={filter === 'bike' ? 'primary' : 'outline'}
            size="md"
            onClick={() => setFilter('bike')}
            className="transform active:scale-95 sm:hover:scale-105 transition-all min-h-[48px] px-4 sm:px-6 text-sm sm:text-base font-semibold whitespace-nowrap"
          >
            🏍️ Bikes ({soldVehicles.filter((v) => v.vehicleType === 'bike').length})
          </Button>
          <Button
            variant={filter === 'car' ? 'primary' : 'outline'}
            size="md"
            onClick={() => setFilter('car')}
            className="transform active:scale-95 sm:hover:scale-105 transition-all min-h-[48px] px-4 sm:px-6 text-sm sm:text-base font-semibold whitespace-nowrap"
          >
            🚗 Cars ({soldVehicles.filter((v) => v.vehicleType === 'car').length})
          </Button>
        </div>

        {/* Featured Success Stories - Auto Slider */}
        {featuredVehicles.length > 0 && (
          <div className="mb-12 sm:mb-16 md:mb-20">
            <div className="flex items-center justify-between mb-6 sm:mb-8 px-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <Star className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-yellow-500 fill-yellow-500 animate-pulse flex-shrink-0" />
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">Featured Success Stories</h2>
              </div>
            </div>

            {/* Slider Container */}
            <div className="relative group -mx-4 sm:mx-0">
              {/* Main Slider */}
              <div className="relative overflow-hidden sm:rounded-2xl md:rounded-3xl shadow-2xl" ref={sliderRef}>
                <div 
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {featuredVehicles.map((vehicle, index) => (
                    <div key={vehicle._id} className="min-w-full">
                      <div className="relative h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px]">
                        {/* Background Image with Parallax */}
                        <div 
                          className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-700"
                          style={{ 
                            backgroundImage: `url(${vehicle.image})`,
                            transform: currentSlide === index ? 'scale(1)' : 'scale(1.1)'
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        </div>

                        {/* Content Overlay */}
                        <div className="relative h-full flex flex-col justify-end p-8 md:p-12 z-10">
                          <div className="max-w-3xl animate-slide-up">
                            <div className="flex gap-2 mb-4">
                              <Badge color="yellow" className="text-sm">
                                <Star className="w-3 h-3" /> Featured
                              </Badge>
                              <Badge color={vehicle.vehicleType === 'bike' ? 'blue' : 'green'} className="text-sm">
                                {vehicle.vehicleType === 'bike' ? '🏍️ Bike' : '🚗 Car'}
                              </Badge>
                            </div>
                            
                            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
                              {vehicle.vehicleName}
                            </h3>
                            
                            {vehicle.customerName && (
                              <p className="text-xl text-blue-200 mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Proud Owner: <span className="font-semibold text-white">{vehicle.customerName}</span>
                              </p>
                            )}
                            
                            <div className="flex items-center gap-2 text-sm text-gray-300 mb-6">
                              <Calendar className="w-4 h-4" />
                              {formatDate(vehicle.soldDate)}
                            </div>
                            
                            {vehicle.testimonial && (
                              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                                <p className="text-lg text-white italic leading-relaxed">
                                  "{vehicle.testimonial}"
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              {featuredVehicles.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 border border-white/30"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 border border-white/30"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Dot Indicators */}
              {featuredVehicles.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {featuredVehicles.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`transition-all duration-300 rounded-full ${
                        currentSlide === index
                          ? 'w-12 h-3 bg-white'
                          : 'w-3 h-3 bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* All Success Stories - Animated Grid */}
        {regularVehicles.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              All Success Stories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {regularVehicles.map((vehicle, index) => (
                <div
                  key={vehicle._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer transform hover:-translate-y-2">
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={vehicle.image}
                      alt={vehicle.vehicleName}
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge
                        color={vehicle.vehicleType === 'bike' ? 'blue' : 'green'}
                        className="text-xs backdrop-blur-sm shadow-lg"
                      >
                        {vehicle.vehicleType === 'bike' ? '🏍️' : '🚗'}
                      </Badge>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
                      {vehicle.customerName && (
                        <p className="text-white text-sm font-semibold mb-1">
                          {vehicle.customerName}
                        </p>
                      )}
                      {vehicle.testimonial && (
                        <p className="text-white/90 text-xs line-clamp-2">
                          "{vehicle.testimonial}"
                        </p>
                      )}
                    </div>

                    {/* Sparkle Effect on Hover */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-sm mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {vehicle.vehicleName}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {formatDate(vehicle.soldDate)}
                    </div>
                  </div>
                </Card>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredVehicles.length === 0 && (
          <Card className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No success stories yet</h3>
            <p className="text-gray-500">Check back soon for more happy customers!</p>
          </Card>
        )}

        {/* Trust Section - Enhanced Animation */}
        <div className="mt-20 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute w-96 h-96 bg-blue-400/20 rounded-full top-0 left-0 animate-pulse blur-3xl"></div>
            <div className="absolute w-96 h-96 bg-purple-400/20 rounded-full bottom-0 right-0 animate-pulse blur-3xl" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 md:p-16 text-white text-center shadow-2xl transform hover:scale-105 transition-transform duration-500">
            <div className="max-w-3xl mx-auto">
              <div className="inline-block animate-bounce mb-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                  <Heart className="w-10 h-10 text-white fill-white animate-pulse" />
                </div>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
                Want to Be Our Next Success Story?
              </h2>
              <p className="text-xl mb-10 text-blue-100 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Join hundreds of satisfied customers who found their perfect vehicle with us.<br />
                Your dream ride is just one click away! 🚀
              </p>
              <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <a href="/buy">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="!bg-white !text-blue-600 hover:!bg-gray-100 font-bold transform hover:scale-110 transition-all duration-300 !shadow-xl"
                  >
                    🔍 Browse Vehicles
                  </Button>
                </a>
                <a href="/sell-to-us">
                  <Button
                    variant="outline"
                    size="lg"
                    className="!border-2 !border-white !text-white hover:!bg-white hover:!text-blue-600 font-bold transform hover:scale-110 transition-all duration-300"
                  >
                    💰 Sell Your Vehicle
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
