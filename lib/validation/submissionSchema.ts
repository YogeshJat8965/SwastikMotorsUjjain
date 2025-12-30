import { z } from 'zod';

export const submissionSchema = z.object({
  // Personal Details (Step 1)
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(15),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),

  // Vehicle Type (Step 2)
  category: z.enum(['bike', 'car'], {
    required_error: 'Please select a category',
  }),
  brand: z.string().min(2, 'Brand is required').max(50),
  model: z.string().min(1, 'Model is required').max(100),
  year: z.number().min(1990, 'Year must be 1990 or later').max(new Date().getFullYear() + 1),
  
  // Condition (Step 3)
  kilometers: z.number().min(0, 'Kilometers must be positive').max(1000000),
  fuelType: z.enum(['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'], {
    required_error: 'Fuel type is required',
  }),
  transmission: z.enum(['Manual', 'Automatic'], {
    required_error: 'Transmission type is required',
  }),
  color: z.string().min(2, 'Color is required').max(50),
  owners: z.number().min(1).max(10).default(1),
  
  // Photos (Step 4)
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least 1 image is required').max(10, 'Maximum 10 images allowed'),

  // Pricing & Description (Step 5)
  expectedPrice: z.number().min(1000, 'Price must be at least ₹1,000').max(100000000),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000).optional().or(z.literal('')),
  
  // Meta
  status: z.enum(['pending', 'contacted', 'approved', 'rejected']).default('pending'),
});

export type SubmissionData = z.infer<typeof submissionSchema>;
