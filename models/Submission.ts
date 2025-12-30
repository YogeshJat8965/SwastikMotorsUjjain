import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubmission extends Document {
  referenceNumber: string;
  // Personal Details
  name: string;
  email?: string;
  phone: string;
  city: string;
  state: string;
  // Vehicle Details
  category: 'bike' | 'car';
  brand: string;
  vehicleModel: string;
  year: number;
  kilometers: number;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'CNG' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  color: string;
  owners: number;
  // Photos & Pricing
  images: string[];
  expectedPrice: number;
  description?: string;
  // Meta
  status: 'pending' | 'contacted' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    referenceNumber: { type: String, required: true, unique: true },
    // Personal Details
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    // Vehicle Details
    category: { type: String, enum: ['bike', 'car'], required: true },
    brand: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    year: { type: Number, required: true },
    kilometers: { type: Number, required: true },
    fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'], required: true },
    transmission: { type: String, enum: ['Manual', 'Automatic'], required: true },
    color: { type: String, required: true },
    owners: { type: Number, default: 1 },
    // Photos & Pricing
    images: [{ type: String, required: true }],
    expectedPrice: { type: Number, required: true },
    description: { type: String },
    // Meta
    status: { type: String, enum: ['pending', 'contacted', 'approved', 'rejected'], default: 'pending' },
    adminNotes: { type: String },
    adminNotes: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

SubmissionSchema.index({ status: 1, createdAt: -1 });

const Submission: Model<ISubmission> = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);

export default Submission;
