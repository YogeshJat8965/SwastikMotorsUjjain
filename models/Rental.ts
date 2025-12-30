import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRental extends Document {
  title: string;
  description: string;
  images: string[];
  category: 'bike' | 'car';
  brand: string;
  vehicleModel: string;
  year: number;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'cng';
  transmission: 'manual' | 'automatic';
  color: string;
  registrationNumber: string;
  city: string;
  state: string;
  
  // Pricing
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  securityDeposit: number;
  
  // Features and specifications
  seatingCapacity: number;
  mileageLimit?: number; // km per day
  extraKmCharge?: number; // per km
  features: string[];
  
  // Availability
  status: 'available' | 'rented' | 'maintenance' | 'inactive';
  availableFrom?: Date;
  minimumRentalDays: number;
  maximumRentalDays?: number;
  
  // Analytics
  totalBookings: number;
  views: number;
  rating?: number;
  
  // Admin fields
  purchasePrice?: number;
  maintenanceCost?: number;
  isFeatured: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const RentalSchema = new Schema<IRental>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    category: { type: String, enum: ['bike', 'car'], required: true },
    brand: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    year: { type: Number, required: true },
    fuelType: { type: String, enum: ['petrol', 'diesel', 'electric', 'cng'], required: true },
    transmission: { type: String, enum: ['manual', 'automatic'], required: true },
    color: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    
    // Pricing
    dailyRate: { type: Number, required: true },
    weeklyRate: { type: Number, required: true },
    monthlyRate: { type: Number, required: true },
    securityDeposit: { type: Number, required: true },
    
    // Features
    seatingCapacity: { type: Number, required: true },
    mileageLimit: { type: Number, default: 100 }, // 100 km per day default
    extraKmCharge: { type: Number, default: 5 }, // ₹5 per extra km
    features: [{ type: String }],
    
    // Availability
    status: { type: String, enum: ['available', 'rented', 'maintenance', 'inactive'], default: 'available' },
    availableFrom: { type: Date },
    minimumRentalDays: { type: Number, default: 1 },
    maximumRentalDays: { type: Number, default: 30 },
    
    // Analytics
    totalBookings: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    rating: { type: Number, min: 0, max: 5 },
    
    // Admin
    purchasePrice: { type: Number },
    maintenanceCost: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
RentalSchema.index({ category: 1, status: 1 });
RentalSchema.index({ dailyRate: 1 });
RentalSchema.index({ city: 1, category: 1 });
RentalSchema.index({ isFeatured: -1, createdAt: -1 });
RentalSchema.index({ status: 1, availableFrom: 1 });

const Rental: Model<IRental> = mongoose.models.Rental || mongoose.model<IRental>('Rental', RentalSchema);

export default Rental;
