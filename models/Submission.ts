import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubmission extends Document {
  name: string;
  phone: string;
  whatsapp: string;
  vehicle: {
    category: 'bike' | 'car';
    brand: string;
    model: string;
    year: number;
    kilometers: number;
    fuelType: 'petrol' | 'diesel' | 'electric' | 'cng';
    transmission: 'manual' | 'automatic';
    expectedPrice: number;
    description: string;
    images: string[];
    location: {
      city: string;
      state: string;
    };
  };
  status: 'new' | 'contacted' | 'purchased' | 'rejected';
  adminNotes: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: true },
    vehicle: {
      category: { type: String, enum: ['bike', 'car'], required: true },
      brand: { type: String, required: true },
      model: { type: String, required: true },
      year: { type: Number, required: true },
      kilometers: { type: Number, required: true },
      fuelType: { type: String, enum: ['petrol', 'diesel', 'electric', 'cng'], required: true },
      transmission: { type: String, enum: ['manual', 'automatic'], required: true },
      expectedPrice: { type: Number, required: true },
      description: { type: String, default: '' },
      images: [{ type: String }],
      location: {
        city: { type: String, required: true },
        state: { type: String, required: true },
      },
    },
    status: { type: String, enum: ['new', 'contacted', 'purchased', 'rejected'], default: 'new' },
    adminNotes: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

SubmissionSchema.index({ status: 1, createdAt: -1 });

const Submission: Model<ISubmission> = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);

export default Submission;
