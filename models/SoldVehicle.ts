import mongoose from 'mongoose';

export interface ISoldVehicle extends mongoose.Document {
  vehicleName: string;
  vehicleType: 'bike' | 'car';
  customerName?: string;
  image: string;
  soldDate: Date;
  testimonial?: string;
  price?: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const soldVehicleSchema = new mongoose.Schema<ISoldVehicle>(
  {
    vehicleName: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ['bike', 'car'],
      default: 'bike',
    },
    customerName: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    soldDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    testimonial: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
soldVehicleSchema.index({ soldDate: -1 });
soldVehicleSchema.index({ featured: 1 });

const SoldVehicle = mongoose.models.SoldVehicle || mongoose.model<ISoldVehicle>('SoldVehicle', soldVehicleSchema);

export default SoldVehicle;
