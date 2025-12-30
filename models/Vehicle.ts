import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVehicle extends Document {
  title: string;
  description: string;
  price: number;
  rentalPricePerDay?: number;
  images: string[];
  category: 'bike' | 'car';
  brand: string;
  vehicleModel: string;
  year: number;
  kilometers: number;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'cng';
  transmission: 'manual' | 'automatic';
  location: {
    city: string;
    state: string;
  };
  purchasePrice: number;
  sellingPrice: number;
  status: 'for_sale' | 'sold' | 'rented' | 'draft';
  availableForRent: boolean;
  isFeatured: boolean;
  views: number;
  contacts: number;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema = new Schema<IVehicle>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    rentalPricePerDay: { type: Number, default: 0 },
    images: [{ type: String }],
    category: { type: String, enum: ['bike', 'car'], required: true },
    brand: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    year: { type: Number, required: true },
    kilometers: { type: Number, required: true },
    fuelType: { type: String, enum: ['petrol', 'diesel', 'electric', 'cng'], required: true },
    transmission: { type: String, enum: ['manual', 'automatic'], required: true },
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
    },
    purchasePrice: { type: Number, default: 0 },
    sellingPrice: { type: Number, required: true },
    status: { type: String, enum: ['for_sale', 'sold', 'rented', 'draft'], default: 'for_sale' },
    availableForRent: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    contacts: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
VehicleSchema.index({ category: 1, status: 1 });
VehicleSchema.index({ price: 1 });
VehicleSchema.index({ createdAt: -1 });
VehicleSchema.index({ isFeatured: -1, createdAt: -1 });

const Vehicle: Model<IVehicle> = mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema);

export default Vehicle;
