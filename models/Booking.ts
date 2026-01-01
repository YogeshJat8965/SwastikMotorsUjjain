import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBooking extends Document {
  vehicle: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerWhatsapp?: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  totalPrice: number;
  pickupLocation: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerWhatsapp: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalDays: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    pickupLocation: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  },
  {
    timestamps: true,
  }
);

BookingSchema.index({ vehicle: 1, startDate: 1, endDate: 1 });
BookingSchema.index({ status: 1, createdAt: -1 });

const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
