import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  customerName: string;
  vehicleName: string;
  testimonial: string;
  rating: number;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    customerName: { 
      type: String, 
      required: true,
      trim: true 
    },
    vehicleName: { 
      type: String, 
      required: true,
      trim: true 
    },
    testimonial: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 500
    },
    rating: { 
      type: Number, 
      default: 5,
      min: 1,
      max: 5
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    order: { 
      type: Number, 
      default: 0 
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
ReviewSchema.index({ isActive: 1, order: 1 });

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
