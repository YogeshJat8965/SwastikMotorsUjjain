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
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSoldVehicles();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (!isAutoPlaying || featuredVehicles.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredVehicles.length);
    }, 3000);

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

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      nextSlide();
    }
    if (touchStart - touchEnd < -75) {
      prevSlide();
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20 sm:pb-0">
      {/* Hero Section - Mobile Optimized */}
      <section className="relative bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 text-white py-10 sm:py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-white/10 rounded-full -top-36 -left-36 sm:-top-48 sm:-left-48 animate-pulse"></div>
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-white/10 rounded-full -bottom-36 -right-36 sm:-bottom-48 sm:-right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container relative z-10 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-5 sm:mb-8 animate-fade-in text-xs sm:text-sm md:text-base">
              <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-bounce flex-shrink-0" />
              <span className="font-semibold whitespace-nowrap">Trusted by Hundreds</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 animate-slide-up leading-tight">
              <span className="inline-block animate-float text-3xl sm:text-4xl md:text-5xl">🎉</span>
              <br className="sm:hidden" />
              <span className="block sm:inline"> Success Stories</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 mb-6 sm:mb-10 animate-fade-in px-2 sm:px-4 leading-relaxed" style={{ animationDelay: '0.2s' }}>
              Real customers, real deals!
              <br />
              See satisfied buyers who found their dream vehicles with us.
            </p>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-6 animate-fade-in px-2" style={{ animationDelay: '0.4s' }}>
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 border border-white/30 transform active:scale-95 sm:hover:scale-110 transition-transform duration-300 min-w-[85px] sm:min-w-[100px]">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-0.5 sm:mb-1">{soldVehicles.length}+</div>
                <div className="text-[10px] sm:text-xs md:text-sm text-blue-100 whitespace-nowrap leading-tight">Happy<br className="sm:hidden" /> Customers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 border border-white/30 transform active:scale-95 sm:hover:scale-110 transition-transform duration-300 min-w-[85px] sm:min-w-[100px]">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-0.5 sm:mb-1">100%</div>
                <div className="text-[10px] sm:text-xs md:text-sm text-blue-100 whitespace-nowrap">Satisfaction</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 border border-white/30 transform active:scale-95 sm:hover:scale-110 transition-transform duration-300 min-w-[85px] sm:min-w-[100px]">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-0.5 sm:mb-1">5★</div>
                <div className="text-[10px] sm:text-xs md:text-sm text-blue-100 whitespace-nowrap">Rating</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 sm:h-16 fill-gray-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      <div className="container py-6 sm:py-10 md:py-16 px-3 sm:px-4 md:px-6">
        {/* Filter Tabs - Mobile Optimized */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-10 md:mb-16 animate-fade-in flex-wrap">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="md"
            onClick={() => setFilter('all')}
            className="transform active:scale-95 sm:hover:scale-105 transition-all min-h-[46px] sm:min-h-[50px] px-4 sm:px-6 text-sm sm:text-base font-semibold shadow-md"
          >
            All ({soldVehicles.length})
          </Button>
          <Button
            variant={filter === 'bike' ? 'primary' : 'outline'}
            size="md"
            onClick={() => setFilter('bike')}
            className="transform active:scale-95 sm:hover:scale-105 transition-all min-h-[46px] sm:min-h-[50px] px-4 sm:px-6 text-sm sm:text-base font-semibold whitespace-nowrap shadow-md"
          >
            🏍️ Bikes ({soldVehicles.filter((v) => v.vehicleType === 'bike').length})
          </Button>
          <Button
            variant={filter === 'car' ? 'primary' : 'outline'}
            size="md"
            onClick={() => setFilter('car')}
            className="transform active:scale-95 sm:hover:scale-105 transition-all min-h-[46px] sm:min-h-[50px] px-4 sm:px-6 text-sm sm:text-base font-semibold whitespace-nowrap shadow-md"
          >
            🚗 Cars ({soldVehicles.filter((v) => v.vehicleType === 'car').length})
          </Button>
        </div>

        {/* Featured Slider - Mobile Optimized */}
        {featuredVehicles.length > 0 && (
          <div className="mb-10 sm:mb-14 md:mb-20">
            <div className="flex items-center justify-between mb-5 sm:mb-7 px-1">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-yellow-500 fill-yellow-500 animate-pulse flex-shrink-0" />
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight">Featured Stories</h2>
              </div>
            </div>

            <div className="relative group -mx-3 sm:mx-0">
              <div 
                className="relative overflow-hidden sm:rounded-2xl md:rounded-3xl shadow-2xl touch-pan-y"
                ref={sliderRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div 
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {featuredVehicles.map((vehicle, index) => (
                    <div key={vehicle._id} className="min-w-full">
                      <div className="relative h-[420px] sm:h-[480px] md:h-[540px] lg:h-[600px]">
                        <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${vehicle.image})` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20"></div>
                        </div>

                        <div className="relative h-full flex flex-col justify-end p-4 sm:p-6 md:p-10 z-10">
                          <div className="max-w-3xl">
                            <div className="flex gap-2 mb-3">
                              <Badge color="yellow" className="text-xs px-2 py-1">
                                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Featured
                              </Badge>
                              <Badge color={vehicle.vehicleType === 'bike' ? 'blue' : 'green'} className="text-xs px-2 py-1">
                                {vehicle.vehicleType === 'bike' ? '🏍️ Bike' : '🚗 Car'}
                              </Badge>
                            </div>
                            
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                              {vehicle.vehicleName}
                            </h3>
                            
                            {vehicle.customerName && (
                              <p className="text-sm sm:text-base md:text-lg text-blue-200 mb-3 flex items-center gap-2 flex-wrap">
                                <span className="flex items-center gap-1.5">
                                  <Users className="w-4 h-4 flex-shrink-0" />
                                  Owner:
                                </span>
                                <span className="font-semibold text-white">{vehicle.customerName}</span>
                              </p>
                            )}
                            
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 mb-4">
                              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              {formatDate(vehicle.soldDate)}
                            </div>
                            
                            {vehicle.testimonial && (
                              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5">
                                <p className="text-xs sm:text-sm md:text-base text-white italic leading-relaxed line-clamp-3">
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

              {/* Navigation Arrows - Visible on Mobile */}
              {featuredVehicles.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 bg-white/25 backdrop-blur-md active:bg-white/40 text-white rounded-full p-2 sm:p-2.5 md:p-3 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 z-20 border border-white/30 shadow-lg min-w-[42px] min-h-[42px] sm:min-w-[46px] sm:min-h-[46px] flex items-center justify-center"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 bg-white/25 backdrop-blur-md active:bg-white/40 text-white rounded-full p-2 sm:p-2.5 md:p-3 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 z-20 border border-white/30 shadow-lg min-w-[42px] min-h-[42px] sm:min-w-[46px] sm:min-h-[46px] flex items-center justify-center"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </>
              )}

              {/* Dot Indicators - Touch Friendly */}
              {featuredVehicles.length > 1 && (
                <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20 bg-black/25 backdrop-blur-sm rounded-full px-2.5 sm:px-3 py-2">
                  {featuredVehicles.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className="p-2 sm:p-2.5 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center"
                      aria-label={`Slide ${index + 1}`}
                    >
                      <span className={`block rounded-full transition-all ${
                        currentSlide === index
                          ? 'w-7 sm:w-9 h-2 sm:h-2.5 bg-white'
                          : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/50'
                      }`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Grid - Mobile Optimized */}
        {regularVehicles.length > 0 && (
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-5 sm:mb-7 flex items-center gap-2 px-1">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-500 flex-shrink-0" />
              All Stories
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              {regularVehicles.map((vehicle, index) => (
                <div
                  key={vehicle._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer transform active:scale-95 sm:hover:-translate-y-2">
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={vehicle.image}
                      alt={vehicle.vehicleName}
                      className="w-full h-full object-cover group-active:scale-110 sm:group-hover:scale-125 transition-transform duration-500"
                    />
                    <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
                      <Badge
                        color={vehicle.vehicleType === 'bike' ? 'blue' : 'green'}
                        className="text-[10px] sm:text-xs backdrop-blur-sm shadow-md px-1.5 py-0.5 sm:px-2 sm:py-1"
                      >
                        {vehicle.vehicleType === 'bike' ? '🏍️' : '🚗'}
                      </Badge>
                    </div>
                    
                    {vehicle.testimonial && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-2.5 sm:p-3">
                        {vehicle.customerName && (
                          <p className="text-white text-xs sm:text-sm font-semibold mb-1">
                            {vehicle.customerName}
                          </p>
                        )}
                        <p className="text-white/90 text-[10px] sm:text-xs line-clamp-2 leading-tight">
                          "{vehicle.testimonial}"
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="p-2 sm:p-2.5">
                    <h3 className="font-bold text-xs sm:text-sm mb-1 line-clamp-1 leading-tight">
                      {vehicle.vehicleName}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500">
                      <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                      <span className="truncate">{formatDate(vehicle.soldDate)}</span>
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
          <Card className="p-8 sm:p-12 text-center">
            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No stories yet</h3>
            <p className="text-sm sm:text-base text-gray-500">Check back soon!</p>
          </Card>
        )}

        {/* CTA Section - Mobile Optimized */}
        <div className="mt-10 sm:mt-14 md:mt-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-blue-400/20 rounded-full top-0 left-0 animate-pulse blur-3xl"></div>
            <div className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-purple-400/20 rounded-full bottom-0 right-0 animate-pulse blur-3xl" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-16 text-white text-center shadow-2xl">
            <div className="max-w-3xl mx-auto">
              <div className="inline-block animate-bounce mb-4 sm:mb-6">
                <div className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                  <Heart className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white fill-white animate-pulse" />
                </div>
              </div>
              
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-5 leading-tight px-2">
                Be Our Next Success Story!
              </h2>
              <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-blue-100 px-2 leading-relaxed">
                Join hundreds who found their perfect vehicle.
                <br className="hidden sm:block" />
                <span className="block sm:inline mt-1 sm:mt-0"> Your dream ride awaits! 🚀</span>
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 px-2">
                <a href="/buy" className="w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="!bg-white !text-blue-600 active:!bg-gray-100 font-bold transform active:scale-95 sm:hover:scale-105 transition-all !shadow-xl w-full sm:w-auto min-h-[50px] text-base"
                  >
                    🔍 Browse Vehicles
                  </Button>
                </a>
                <a href="/sell-to-us" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="!border-2 !border-white !text-white active:!bg-white active:!text-blue-600 sm:hover:!bg-white sm:hover:!text-blue-600 font-bold transform active:scale-95 sm:hover:scale-105 transition-all w-full sm:w-auto min-h-[50px] text-base"
                  >
                    💰 Sell Vehicle
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
