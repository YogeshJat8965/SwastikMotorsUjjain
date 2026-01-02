'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Upload } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import ImageUpload from '@/components/forms/ImageUpload';

interface VehicleFormData {
  // Step 1: Category
  category: 'bike' | 'car' | '';
  
  // Step 2: Basic Details
  brand: string;
  vehicleModel: string;
  year: number;
  color: string;
  
  // Step 3: Photos
  images: string[];
  
  // Step 4: Specifications
  kilometers: number;
  fuelType: string;
  transmission: string;
  description: string;
  
  // Step 5: Location
  city: string;
  state: string;
  
  // Step 6: Pricing
  purchasePrice: number;
  sellingPrice: number;
  
  // Step 7: Options
  status: string;
  isFeatured: boolean;
  availableForRent: boolean;
  rentalPricePerDay: number;
}

export default function AddVehicleForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Brand suggestions
  const bikeBrands = [
    'Honda', 'Hero', 'Bajaj', 'TVS', 'Royal Enfield', 'Yamaha', 'Suzuki', 
    'KTM', 'Kawasaki', 'Harley-Davidson', 'Ducati', 'BMW', 'Triumph',
    'Jawa', 'Benelli', 'Aprilia', 'Vespa'
  ];
  
  const carBrands = [
    'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota', 
    'Kia', 'Ford', 'Volkswagen', 'Skoda', 'Renault', 'Nissan', 'BMW',
    'Mercedes-Benz', 'Audi', 'Jeep', 'MG', 'Chevrolet', 'Fiat'
  ];
  
  const popularColors = [
    'Black', 'White', 'Red', 'Blue', 'Silver', 'Grey', 'Green',
    'Yellow', 'Orange', 'Brown', 'Beige', 'Gold', 'Maroon'
  ];
  
  const indianCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
    'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur',
    'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna',
    'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad',
    'Meerut', 'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad',
    'Amritsar', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur',
    'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota',
    'Chandigarh', 'Guwahati', 'Solapur', 'Hubli', 'Mysore', 'Ujjain'
  ];
  
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];
  
  const [formData, setFormData] = useState<VehicleFormData>({
    category: '',
    brand: '',
    vehicleModel: '',
    year: new Date().getFullYear(),
    color: '',
    images: [],
    kilometers: 0,
    fuelType: 'Petrol',
    transmission: 'Manual',
    description: '',
    city: '',
    state: '',
    purchasePrice: 0,
    sellingPrice: 0,
    status: 'for_sale',
    isFeatured: false,
    availableForRent: false,
    rentalPricePerDay: 0,
  });

  const totalSteps = 7;

  const updateField = (field: keyof VehicleFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!formData.category) newErrors.category = 'Please select a category';
        break;
      case 2:
        if (!formData.brand) newErrors.brand = 'Brand is required';
        if (!formData.vehicleModel) newErrors.vehicleModel = 'Model is required';
        if (!formData.year || formData.year < 1990) newErrors.year = 'Valid year is required';
        if (!formData.color) newErrors.color = 'Color is required';
        break;
      case 3:
        if (formData.images.length === 0) newErrors.images = 'At least one image is required';
        break;
      case 4:
        if (!formData.kilometers || formData.kilometers < 0) newErrors.kilometers = 'Kilometers is required';
        if (!formData.fuelType) newErrors.fuelType = 'Fuel type is required';
        if (!formData.transmission) newErrors.transmission = 'Transmission is required';
        break;
      case 5:
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        break;
      case 6:
        if (!formData.purchasePrice || formData.purchasePrice <= 0) newErrors.purchasePrice = 'Purchase price is required';
        if (!formData.sellingPrice || formData.sellingPrice <= 0) newErrors.sellingPrice = 'Selling price is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      const title = `${formData.brand} ${formData.vehicleModel} ${formData.year}`;
      
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          title,
          price: formData.sellingPrice,
          location: {
            city: formData.city,
            state: formData.state,
          },
        }),
      });

      if (response.ok) {
        router.push('/admin/inventory');
      } else {
        alert('Failed to add vehicle');
      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const profit = formData.sellingPrice - formData.purchasePrice;
  const profitPercentage = formData.purchasePrice > 0 
    ? ((profit / formData.purchasePrice) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.push('/admin/inventory')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Vehicle</h1>
              <p className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          {/* Step 1: Category */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Category</h2>
                <p className="text-gray-600">Choose the type of vehicle you want to add</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => updateField('category', 'bike')}
                  className={`p-8 border-2 rounded-xl transition-all ${
                    formData.category === 'bike'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-6xl mb-4">🏍️</div>
                  <h3 className="text-xl font-bold text-gray-900">Bike</h3>
                  <p className="text-sm text-gray-600 mt-2">Two-wheeler vehicles</p>
                </button>

                <button
                  onClick={() => updateField('category', 'car')}
                  className={`p-8 border-2 rounded-xl transition-all ${
                    formData.category === 'car'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-6xl mb-4">🚗</div>
                  <h3 className="text-xl font-bold text-gray-900">Car</h3>
                  <p className="text-sm text-gray-600 mt-2">Four-wheeler vehicles</p>
                </button>
              </div>

              {errors.category && (
                <p className="text-red-600 text-sm">{errors.category}</p>
              )}
            </div>
          )}

          {/* Step 2: Basic Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Details</h2>
                <p className="text-gray-600">Enter the vehicle information</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand *
                </label>
                <input
                  list="brand-suggestions"
                  value={formData.brand}
                  onChange={(e) => updateField('brand', e.target.value)}
                  placeholder="e.g., Honda, Maruti, Royal Enfield"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.brand ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <datalist id="brand-suggestions">
                  {(formData.category === 'bike' ? bikeBrands : carBrands).map((brand) => (
                    <option key={brand} value={brand} />
                  ))}
                </datalist>
                {errors.brand && (
                  <p className="text-red-600 text-sm mt-1">{errors.brand}</p>
                )}
              </div>

              <Input
                label="Model *"
                value={formData.vehicleModel}
                onChange={(e) => updateField('vehicleModel', e.target.value)}
                placeholder="e.g., City, Swift, Classic 350"
                error={errors.vehicleModel}
              />

              <Input
                label="Year *"
                type="number"
                value={formData.year}
                onChange={(e) => updateField('year', parseInt(e.target.value))}
                min={1990}
                max={new Date().getFullYear() + 1}
                error={errors.year}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color *
                </label>
                <input
                  list="color-suggestions"
                  value={formData.color}
                  onChange={(e) => updateField('color', e.target.value)}
                  placeholder="e.g., Black, White, Red"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.color ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <datalist id="color-suggestions">
                  {popularColors.map((color) => (
                    <option key={color} value={color} />
                  ))}
                </datalist>
                {errors.color && (
                  <p className="text-red-600 text-sm mt-1">{errors.color}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Photos */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Photos</h2>
                <p className="text-gray-600">Add at least one photo (max 10)</p>
              </div>

              <ImageUpload
                images={formData.images}
                onImagesChange={(images) => updateField('images', images)}
                maxImages={10}
              />

              {errors.images && (
                <p className="text-red-600 text-sm">{errors.images}</p>
              )}
            </div>
          )}

          {/* Step 4: Specifications */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Specifications</h2>
                <p className="text-gray-600">Technical details of the vehicle</p>
              </div>

              <Input
                label="Kilometers Driven *"
                type="number"
                value={formData.kilometers}
                onChange={(e) => updateField('kilometers', parseInt(e.target.value))}
                placeholder="e.g., 25000"
                error={errors.kilometers}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Type *
                </label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => updateField('fuelType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="CNG">CNG</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
                {errors.fuelType && (
                  <p className="text-red-600 text-sm mt-1">{errors.fuelType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transmission *
                </label>
                <select
                  value={formData.transmission}
                  onChange={(e) => updateField('transmission', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
                {errors.transmission && (
                  <p className="text-red-600 text-sm mt-1">{errors.transmission}</p>
                )}
              </div>

              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe the vehicle condition, features, etc..."
                rows={4}
              />
            </div>
          )}

          {/* Step 5: Location */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Location</h2>
                <p className="text-gray-600">Where is the vehicle located?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  list="city-suggestions"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="e.g., Ujjain, Mumbai, Delhi"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <datalist id="city-suggestions">
                  {indianCities.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
                {errors.city && (
                  <p className="text-red-600 text-sm mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  list="state-suggestions"
                  value={formData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  placeholder="e.g., Madhya Pradesh, Maharashtra"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <datalist id="state-suggestions">
                  {indianStates.map((state) => (
                    <option key={state} value={state} />
                  ))}
                </datalist>
                {errors.state && (
                  <p className="text-red-600 text-sm mt-1">{errors.state}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 6: Pricing */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Pricing</h2>
                <p className="text-gray-600">Set your prices</p>
              </div>

              <Input
                label="I Bought For (₹) *"
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => updateField('purchasePrice', parseFloat(e.target.value))}
                placeholder="40000"
                error={errors.purchasePrice}
              />

              <Input
                label="I'll Sell For (₹) *"
                type="number"
                value={formData.sellingPrice}
                onChange={(e) => updateField('sellingPrice', parseFloat(e.target.value))}
                placeholder="52000"
                error={errors.sellingPrice}
              />

              {/* Profit Display */}
              {formData.purchasePrice > 0 && formData.sellingPrice > 0 && (
                <div className={`p-6 rounded-xl border-2 ${
                  profit >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">My Profit</p>
                      <p className={`text-3xl font-bold ${
                        profit >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ₹{profit.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Margin</p>
                      <p className={`text-2xl font-bold ${
                        profit >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {profitPercentage}%
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 7: Options */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Options</h2>
                <p className="text-gray-600">Configure additional settings</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => updateField('status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="for_sale">For Sale</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.isFeatured}
                  onChange={(e) => updateField('isFeatured', e.target.checked)}
                  className="w-5 h-5 text-blue-600"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-900">
                  ⭐ Pin to Top (Featured)
                </label>
              </div>

              <div className="space-y-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="rental"
                    checked={formData.availableForRent}
                    onChange={(e) => updateField('availableForRent', e.target.checked)}
                    className="w-5 h-5 text-purple-600"
                  />
                  <label htmlFor="rental" className="text-sm font-medium text-gray-900">
                    🏠 Available for Rent
                  </label>
                </div>

                {formData.availableForRent && (
                  <Input
                    label="Daily Rental Price (₹)"
                    type="number"
                    value={formData.rentalPricePerDay}
                    onChange={(e) => updateField('rentalPricePerDay', parseFloat(e.target.value))}
                    placeholder="500"
                  />
                )}
              </div>

              {/* Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3">
                <h3 className="font-bold text-gray-900 mb-3">Summary</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Vehicle:</span>
                    <span className="ml-2 font-medium">{formData.brand} {formData.vehicleModel}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Year:</span>
                    <span className="ml-2 font-medium">{formData.year}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Photos:</span>
                    <span className="ml-2 font-medium">{formData.images.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Location:</span>
                    <span className="ml-2 font-medium">{formData.city}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Selling Price:</span>
                    <span className="ml-2 font-medium text-blue-600">₹{formData.sellingPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Profit:</span>
                    <span className="ml-2 font-medium text-green-600">₹{profit.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={prevStep}
                icon={<ArrowLeft className="w-5 h-5" />}
              >
                Previous
              </Button>
            )}

            {currentStep < totalSteps ? (
              <Button
                variant="primary"
                onClick={nextStep}
                className="ml-auto"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={loading}
                className="ml-auto"
                icon={<Check className="w-5 h-5" />}
              >
                {loading ? 'Adding...' : 'Add Vehicle'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
