'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import ImageUpload from './ImageUpload';
import { SubmissionData, submissionSchema } from '@/lib/validation/submissionSchema';

const FORM_STORAGE_KEY = 'sell-to-us-form-data';

const steps = [
  'Your Details',
  'Vehicle Type',
  'Condition',
  'Photos',
  'Pricing & Description',
  'Review',
];

const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'];
const transmissionTypes = ['Manual', 'Automatic'];
const categories = [
  { value: 'bike', label: 'Bike 🏍️' },
  { value: 'car', label: 'Car 🚗' },
];

// Popular brands
const brands = {
  bike: ['Royal Enfield', 'Honda', 'Bajaj', 'TVS', 'Yamaha', 'KTM', 'Suzuki', 'Hero', 'Kawasaki', 'Harley-Davidson', 'Ducati', 'BMW', 'Triumph', 'Jawa', 'Benelli', 'Aprilia', 'Vespa'],
  car: ['Maruti Suzuki', 'Hyundai', 'Tata', 'Honda', 'Mahindra', 'Toyota', 'Kia', 'Ford', 'Volkswagen', 'Skoda', 'Renault', 'Nissan', 'BMW', 'Mercedes-Benz', 'Audi', 'Jeep', 'MG', 'Chevrolet', 'Fiat'],
};

// Popular models by brand
const bikeModels: Record<string, string[]> = {
  'Royal Enfield': ['Classic 350', 'Meteor 350', 'Himalayan', 'Interceptor 650', 'Continental GT 650', 'Hunter 350', 'Bullet 350'],
  'Honda': ['Activa', 'Shine', 'Unicorn', 'CB350', 'Hornet 2.0', 'SP 125', 'Dio', 'CBR', 'Africa Twin'],
  'Bajaj': ['Pulsar', 'Pulsar NS200', 'Pulsar RS200', 'Dominar 400', 'Avenger', 'CT 100', 'Platina'],
  'TVS': ['Apache RTR 160', 'Apache RTR 200', 'Jupiter', 'Ntorq', 'Raider', 'Sport', 'XL100'],
  'Yamaha': ['FZ', 'FZ-S', 'MT-15', 'R15', 'Fascino', 'Ray ZR', 'Aerox'],
  'KTM': ['Duke 200', 'Duke 250', 'Duke 390', 'RC 200', 'RC 390', 'Adventure 390'],
  'Suzuki': ['Access 125', 'Gixxer', 'Gixxer SF', 'Burgman Street', 'Avenis', 'Intruder', 'V-Strom'],
  'Hero': ['Splendor', 'HF Deluxe', 'Passion', 'Glamour', 'Xtreme', 'XPulse 200', 'Destini 125'],
};

const carModels: Record<string, string[]> = {
  'Maruti Suzuki': ['Swift', 'Baleno', 'Wagon R', 'Alto', 'Dzire', 'Vitara Brezza', 'Ertiga', 'Celerio', 'S-Presso', 'Eeco', 'Grand Vitara'],
  'Hyundai': ['i20', 'Creta', 'Venue', 'Verna', 'Grand i10 Nios', 'Aura', 'Alcazar', 'Tucson', 'Exter'],
  'Tata': ['Nexon', 'Harrier', 'Safari', 'Punch', 'Altroz', 'Tiago', 'Tigor', 'Nexon EV'],
  'Mahindra': ['Scorpio', 'XUV700', 'Thar', 'Bolero', 'XUV300', 'Scorpio N', 'XUV400'],
  'Toyota': ['Fortuner', 'Innova Crysta', 'Urban Cruiser Hyryder', 'Glanza', 'Camry', 'Vellfire'],
  'Kia': ['Seltos', 'Sonet', 'Carens', 'EV6'],
  'Volkswagen': ['Polo', 'Vento', 'Virtus', 'Taigun', 'Tiguan'],
  'Skoda': ['Rapid', 'Kushaq', 'Slavia', 'Superb', 'Octavia'],
  'Honda': ['City', 'Amaze', 'Elevate', 'City e:HEV'],
  'Renault': ['Kwid', 'Triber', 'Kiger'],
  'MG': ['Hector', 'Astor', 'Gloster', 'ZS EV', 'Comet EV'],
};

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

interface MultiStepFormProps {
  onSuccess: (referenceNumber: string) => void;
}

export default function MultiStepForm({ onSuccess }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<Partial<SubmissionData>>({
    category: undefined,
    brand: '',
    vehicleModel: '',
    year: new Date().getFullYear(),
    kilometers: 0,
    fuelType: undefined,
    transmission: undefined,
    color: '',
    owners: 1,
    images: [],
    expectedPrice: 0,
    description: '',
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(FORM_STORAGE_KEY);
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved form data');
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
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
      case 0: // Your Details
        if (!formData.name || formData.name.length < 2) newErrors.name = 'Name is required';
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
        if (!formData.phone || formData.phone.length < 10) newErrors.phone = 'Valid phone number is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        break;

      case 1: // Vehicle Type
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.brand) newErrors.brand = 'Brand is required';
        if (!formData.vehicleModel) newErrors.vehicleModel = 'Model is required';
        if (!formData.year || formData.year < 1990) newErrors.year = 'Valid year is required';
        break;

      case 2: // Condition
        if (!formData.kilometers || formData.kilometers < 0) newErrors.kilometers = 'Kilometers is required';
        if (!formData.fuelType) newErrors.fuelType = 'Fuel type is required';
        if (!formData.transmission) newErrors.transmission = 'Transmission is required';
        if (!formData.color) newErrors.color = 'Color is required';
        break;

      case 3: // Photos
        if (!formData.images || formData.images.length === 0) {
          newErrors.images = 'At least 1 image is required';
        }
        break;

      case 4: // Pricing & Description
        if (!formData.expectedPrice || formData.expectedPrice < 1000) {
          newErrors.expectedPrice = 'Expected price is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      // Validate with Zod
      const validated = submissionSchema.parse(formData);

      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });

      if (!response.ok) throw new Error('Failed to submit');

      const data = await response.json();
      
      // Clear localStorage
      localStorage.removeItem(FORM_STORAGE_KEY);
      
      onSuccess(data.referenceNumber);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Your Details
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Contact Details</h2>
            <Input
              label="Full Name *"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              error={errors.name}
              placeholder="John Doe"
            />
            <Input
              label="Email (Optional)"
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              error={errors.email}
              placeholder="john@example.com"
            />
            <Input
              label="Phone Number *"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              error={errors.phone}
              placeholder="9876543210"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  list="sell-city-suggestions"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="Select or type city name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <datalist id="sell-city-suggestions">
                  {indianCities.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
                {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  list="sell-state-suggestions"
                  value={formData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  placeholder="Select or type state name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <datalist id="sell-state-suggestions">
                  {indianStates.map((state) => (
                    <option key={state} value={state} />
                  ))}
                </datalist>
                {errors.state && <p className="text-sm text-red-600 mt-1">{errors.state}</p>}
              </div>
            </div>
          </div>
        );

      case 1: // Vehicle Type
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Category *
              </label>
              <div className="grid grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => updateField('category', cat.value)}
                    className={`
                      p-4 rounded-xl border-2 text-center font-medium transition-all
                      ${
                        formData.category === cat.value
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }
                    `}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <input
                list="sell-brand-suggestions"
                value={formData.brand}
                onChange={(e) => updateField('brand', e.target.value)}
                placeholder="Select or type brand name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <datalist id="sell-brand-suggestions">
                {formData.category && brands[formData.category as 'bike' | 'car'].map((brand) => (
                  <option key={`${formData.category}-${brand}`} value={brand} />
                ))}
              </datalist>
              {errors.brand && <p className="text-sm text-red-600 mt-1">{errors.brand}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model *
              </label>
              <input
                list="sell-model-suggestions"
                value={formData.vehicleModel}
                onChange={(e) => updateField('vehicleModel', e.target.value)}
                placeholder="Select or type model name (e.g., Classic 350, Swift)"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <datalist id="sell-model-suggestions">
                {formData.brand && formData.category && (
                  formData.category === 'bike' 
                    ? bikeModels[formData.brand]?.map((model) => (
                        <option key={`${formData.brand}-${model}`} value={model} />
                      ))
                    : carModels[formData.brand]?.map((model) => (
                        <option key={`${formData.brand}-${model}`} value={model} />
                      ))
                )}
              </datalist>
              {errors.vehicleModel && <p className="text-sm text-red-600 mt-1">{errors.vehicleModel}</p>}
            </div>

            <Input
              label="Year *"
              type="number"
              value={formData.year}
              onChange={(e) => updateField('year', parseInt(e.target.value))}
              error={errors.year}
              placeholder="2020"
            />
          </div>
        );

      case 2: // Condition
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Condition</h2>
            
            <Input
              label="Kilometers Driven *"
              type="number"
              value={formData.kilometers}
              onChange={(e) => updateField('kilometers', parseInt(e.target.value))}
              error={errors.kilometers}
              placeholder="25000"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Type *
              </label>
              <select
                value={formData.fuelType}
                onChange={(e) => updateField('fuelType', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Fuel Type</option>
                {fuelTypes.map((fuel) => (
                  <option key={fuel} value={fuel}>{fuel}</option>
                ))}
              </select>
              {errors.fuelType && <p className="text-sm text-red-600 mt-1">{errors.fuelType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transmission *
              </label>
              <div className="grid grid-cols-2 gap-4">
                {transmissionTypes.map((trans) => (
                  <button
                    key={trans}
                    type="button"
                    onClick={() => updateField('transmission', trans)}
                    className={`
                      p-4 rounded-xl border-2 text-center font-medium transition-all
                      ${
                        formData.transmission === trans
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }
                    `}
                  >
                    {trans}
                  </button>
                ))}
              </div>
              {errors.transmission && <p className="text-sm text-red-600 mt-1">{errors.transmission}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color *
              </label>
              <input
                list="sell-color-suggestions"
                value={formData.color}
                onChange={(e) => updateField('color', e.target.value)}
                placeholder="Select or type color"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <datalist id="sell-color-suggestions">
                {popularColors.map((color) => (
                  <option key={color} value={color} />
                ))}
              </datalist>
              {errors.color && <p className="text-sm text-red-600 mt-1">{errors.color}</p>}
            </div>

            <Input
              label="Number of Owners *"
              type="number"
              value={formData.owners}
              onChange={(e) => updateField('owners', parseInt(e.target.value))}
              min={1}
              max={10}
              placeholder="1"
            />
          </div>
        );

      case 3: // Photos
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Photos</h2>
            <p className="text-gray-600 mb-4">
              Upload clear photos of your vehicle. The first image will be the main display image.
            </p>
            <ImageUpload
              images={formData.images || []}
              onImagesChange={(images) => updateField('images', images)}
              maxImages={10}
            />
            {errors.images && <p className="text-sm text-red-600 mt-1">{errors.images}</p>}
          </div>
        );

      case 4: // Pricing & Description
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing & Description</h2>
            
            <Input
              label="Expected Price (₹) *"
              type="number"
              value={formData.expectedPrice}
              onChange={(e) => updateField('expectedPrice', parseInt(e.target.value))}
              error={errors.expectedPrice}
              placeholder="500000"
            />

            <Textarea
              label="Additional Description (Optional)"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Any additional details about your vehicle..."
              rows={5}
            />
          </div>
        );

      case 5: // Review
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Submission</h2>
            
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Details</h3>
                <p className="text-gray-600">Name: {formData.name}</p>
                <p className="text-gray-600">Phone: {formData.phone}</p>
                {formData.email && <p className="text-gray-600">Email: {formData.email}</p>}
                <p className="text-gray-600">Location: {formData.city}, {formData.state}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Vehicle Details</h3>
                <p className="text-gray-600">Category: {formData.category}</p>
                <p className="text-gray-600">{formData.brand} {formData.vehicleModel} ({formData.year})</p>
                <p className="text-gray-600">{formData.kilometers?.toLocaleString('en-IN')} km</p>
                <p className="text-gray-600">{formData.fuelType} • {formData.transmission}</p>
                <p className="text-gray-600">Color: {formData.color}</p>
                <p className="text-gray-600">Owners: {formData.owners}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Pricing</h3>
                <p className="text-2xl font-bold text-green-600">
                  ₹{formData.expectedPrice?.toLocaleString('en-IN')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Photos</h3>
                <p className="text-gray-600">{formData.images?.length} images uploaded</p>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              By submitting, you agree to be contacted by Swastik Bikes regarding your vehicle.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  transition-colors duration-200
                  ${
                    index < currentStep
                      ? 'bg-green-600 text-white'
                      : index === currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    w-12 md:w-24 h-1 mx-2
                    ${index < currentStep ? 'bg-green-600' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-600">
          Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
        </p>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        {currentStep > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="flex-1"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        )}
        
        {currentStep < steps.length - 1 ? (
          <Button
            type="button"
            onClick={handleNext}
            className="flex-1"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            className="flex-1"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Vehicle'}
          </Button>
        )}
      </div>
    </div>
  );
}
