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

interface Review {
  _id: string;
  customerName: string;
  vehicleName: string;
  testimonial: string;
  rating: number;
  isActive: boolean;
  order: number;
}

export default function SuccessStoriesPage() {
  const [soldVehicles, setSoldVehicles] = useState<SoldVehicle[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'bike' | 'car'>('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSoldVehicles();
    fetchReviews();
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

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews?active=true');
      if (!res.ok) throw new Error('Failed to fetch reviews');
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
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
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-0">
      {/* Simple Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
            Success Stories
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            See satisfied buyers who found their dream vehicles with us
          </p>
        </div>
      </div>

      <div className="container py-6 sm:py-10 md:py-12 px-3 sm:px-4 md:px-6">
        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 md:mb-10 flex-wrap">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="md"
            onClick={() => setFilter('all')}
            className="transform active:scale-95 sm:hover:scale-105 transition-all px-4 sm:px-6 text-sm sm:text-base font-semibold"
          >
            All ({soldVehicles.length})
          </Button>
          <Button
            variant={filter === 'bike' ? 'primary' : 'outline'}
            size="md"
            onClick={() => setFilter('bike')}
            className="transform active:scale-95 sm:hover:scale-105 transition-all px-4 sm:px-6 text-sm sm:text-base font-semibold"
          >
            Bikes ({soldVehicles.filter((v) => v.vehicleType === 'bike').length})
          </Button>
          <Button
            variant={filter === 'car' ? 'primary' : 'outline'}
            size="md"
            onClick={() => setFilter('car')}
            className="transform active:scale-95 sm:hover:scale-105 transition-all px-4 sm:px-6 text-sm sm:text-base font-semibold"
          >
            Cars ({soldVehicles.filter((v) => v.vehicleType === 'car').length})
          </Button>
        </div>

        {/* Featured Slider - Mobile First Vertical */}
        {featuredVehicles.length > 0 && (
          <div className="mb-10 sm:mb-14 md:mb-20">
            <div className="flex items-center justify-between mb-5 sm:mb-7 px-1">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-yellow-500 fill-yellow-500 animate-pulse flex-shrink-0" />
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight">Featured Stories</h2>
              </div>
            </div>

            <div className="relative group">
              <div 
                className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl touch-pan-y"
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
                      {/* Mobile: Portrait/Vertical Layout */}
                      <div className="block md:hidden">
                        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800">
                          {/* Image - Portrait Aspect Ratio */}
                          <div className="relative h-[520px] overflow-hidden">
                            <img
                              src={vehicle.image}
                              alt={vehicle.vehicleName}
                              className="w-full h-full object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
                          </div>

                          {/* Content Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-5 pb-16 z-10">
                            <h3 className="text-2xl font-black text-white mb-2 leading-tight">
                              {vehicle.vehicleName}
                            </h3>
                            
                            {vehicle.customerName && (
                              <p className="text-sm text-blue-200 mb-2 flex items-center gap-2">
                                <Users className="w-4 h-4 flex-shrink-0" />
                                <span className="font-semibold text-white">{vehicle.customerName}</span>
                              </p>
                            )}
                            
                            <div className="flex items-center gap-2 text-xs text-gray-300 mb-3">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(vehicle.soldDate)}
                            </div>
                            
                            {vehicle.testimonial && (
                              <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-xl p-4">
                                <p className="text-sm text-white leading-relaxed line-clamp-3">
                                  "{vehicle.testimonial}"
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Desktop: Horizontal Layout */}
                      <div className="hidden md:block">
                        <div className="relative h-[540px] lg:h-[600px]">
                          <div 
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${vehicle.image})` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20"></div>
                          </div>

                          <div className="relative h-full flex flex-col justify-end p-8 md:p-10 z-10">
                            <div className="max-w-3xl">
                              <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4 leading-tight">
                                {vehicle.vehicleName}
                              </h3>
                              
                              {vehicle.customerName && (
                                <p className="text-base md:text-lg text-blue-200 mb-3 flex items-center gap-2">
                                  <Users className="w-4 h-4 flex-shrink-0" />
                                  <span>Owner:</span>
                                  <span className="font-semibold text-white">{vehicle.customerName}</span>
                                </p>
                              )}
                              
                              <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(vehicle.soldDate)}
                              </div>
                              
                              {vehicle.testimonial && (
                                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 md:p-5">
                                  <p className="text-sm md:text-base text-white italic leading-relaxed line-clamp-3">
                                    "{vehicle.testimonial}"
                                  </p>
                                </div>
                              )}
                            </div>
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
                    className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md active:bg-white/50 text-white rounded-full p-2.5 md:p-3 opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-20 border border-white/40 shadow-xl"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md active:bg-white/50 text-white rounded-full p-2.5 md:p-3 opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-20 border border-white/40 shadow-xl"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </>
              )}

              {/* Dot Indicators - Mobile Optimized */}
              {featuredVehicles.length > 1 && (
                <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-black/30 backdrop-blur-sm rounded-full px-3 py-2">
                  {featuredVehicles.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className="p-2 transition-all"
                      aria-label={`Slide ${index + 1}`}
                    >
                      <span className={`block rounded-full transition-all duration-300 ${
                        currentSlide === index
                          ? 'w-8 h-2.5 bg-white'
                          : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/70'
                      }`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Grid - Mobile Optimized */}
        {/* Modern Mobile-First Reviews - Vertical Tinder-Style Cards */}
        {reviews.length > 0 && (
          <div className="mb-8 sm:mb-12 md:mb-20 px-3 sm:px-0">
            {/* Eye-catching Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full shadow-lg">
                <Star className="w-5 h-5 text-white fill-white animate-pulse" />
                <span className="text-sm font-bold text-green">4.9/5 Rating</span>
                <Star className="w-5 h-5 text-white fill-white animate-pulse" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
                What Our Customers Say
              </h2>
              <p className="text-sm text-gray-600">38,000+ Happy Customers Trust Us ❤️</p>
            </div>
            
            {/* Mobile: Vertical Swipe Cards, Desktop: Horizontal Grid */}
            <div className="lg:hidden space-y-4">
              {reviews.slice(0, 6).map((review, index) => (
                <div
                  key={review._id}
                  className="relative animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Modern Card with Gradient Border */}
                  <div className="relative bg-white rounded-3xl p-6 shadow-xl border-2 border-transparent bg-clip-padding"
                       style={{
                         background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%) border-box'
                       }}>
                    
                    {/* Top Section - User Info */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {/* Animated Avatar */}
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full blur-md opacity-75 animate-pulse"></div>
                          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {review.customerName ? review.customerName.charAt(0).toUpperCase() : 'C'}
                          </div>
                          {/* Verified Badge */}
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-md">
                            <CheckCircle className="w-4 h-4 text-white" strokeWidth={3} />
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">
                            {review.customerName || 'Happy Customer'}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            {review.vehicleName}
                          </p>
                        </div>
                      </div>
                      
                      {/* Rating Badge */}
                      <div className="flex items-center gap-1 bg-yellow-400 px-3 py-1.5 rounded-full shadow-md">
                        <Star className="w-4 h-4 text-white fill-white" />
                        <span className="text-sm font-bold text-white">{review.rating}.0</span>
                      </div>
                    </div>
                    
                    {/* Review Text */}
                    <div className="mb-4">
                      <p className="text-gray-700 leading-relaxed text-base font-medium">
                        "{review.testimonial}"
                      </p>
                    </div>
                    
                    {/* Bottom - Star Rating */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 transition-all duration-300 ${
                              i < review.rating 
                                ? 'text-yellow-400 fill-yellow-400 scale-110' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      
                      {/* Verified Text */}
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Verified Purchase</span>
                      </div>
                    </div>
                    
                    {/* Decorative gradient blob */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl -z-10"></div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Desktop: Horizontal Scrolling Grid */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review, index) => (
                  <div
                    key={review._id}
                    className="relative animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative bg-white rounded-3xl p-6 shadow-xl border-2 border-transparent bg-clip-padding h-full"
                         style={{
                           background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%) border-box'
                         }}>
                      
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full blur-md opacity-75 animate-pulse"></div>
                            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {review.customerName ? review.customerName.charAt(0).toUpperCase() : 'C'}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" strokeWidth={3} />
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {review.customerName || 'Happy Customer'}
                            </h3>
                            <p className="text-xs text-gray-500 flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                              {review.vehicleName}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 bg-yellow-400 px-2.5 py-1 rounded-full shadow-md">
                          <Star className="w-3 h-3 text-white fill-white" />
                          <span className="text-xs font-bold text-white">{review.rating}.0</span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-gray-700 leading-relaxed text-sm">
                          "{review.testimonial}"
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < review.rating 
                                  ? 'text-yellow-400 fill-yellow-400' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          <span>Verified</span>
                        </div>
                      </div>
                      
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl -z-10"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Trust Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 px-4">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">38K+</div>
                <div className="text-xs text-gray-600 font-semibold">Happy Customers</div>
              </div>
              <div className="w-px h-10 bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">4.9★</div>
                <div className="text-xs text-gray-600 font-semibold">Average Rating</div>
              </div>
              <div className="w-px h-10 bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-black bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-1">100%</div>
                <div className="text-xs text-gray-600 font-semibold">Verified Reviews</div>
              </div>
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
