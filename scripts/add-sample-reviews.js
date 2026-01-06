const mongoose = require('mongoose');

// Load environment variables from .env.local
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

const ReviewSchema = new mongoose.Schema(
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

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

const sampleReviews = [
  {
    customerName: 'Rajesh Kumar',
    vehicleName: 'Honda Activa 125',
    testimonial: 'Excellent service! Got the best price for my old scooter and the whole process was super smooth. The team was professional and helpful throughout.',
    rating: 5,
    isActive: true,
    order: 1
  },
  {
    customerName: 'Priya Sharma',
    vehicleName: 'Maruti Swift VXI',
    testimonial: 'Very satisfied with the deal. They offered a fair price and completed all paperwork within a day. Highly recommend Swastik Motors to everyone!',
    rating: 5,
    isActive: true,
    order: 2
  },
  {
    customerName: 'Amit Patel',
    vehicleName: 'Royal Enfield Classic 350',
    testimonial: 'Great experience selling my bike here. The staff was friendly and transparent about the pricing. No hidden charges at all!',
    rating: 5,
    isActive: true,
    order: 3
  },
  {
    customerName: 'Sneha Verma',
    vehicleName: 'Hyundai i20',
    testimonial: 'Best decision to sell my car through Swastik Motors. They handled everything professionally and paid me instantly. Very trustworthy!',
    rating: 5,
    isActive: true,
    order: 4
  },
  {
    customerName: 'Vikram Singh',
    vehicleName: 'Bajaj Pulsar 150',
    testimonial: 'Amazing service! Sold my bike in just 2 hours. The price was better than what I expected. Will definitely come back for future deals.',
    rating: 5,
    isActive: true,
    order: 5
  },
  {
    customerName: 'Neha Gupta',
    vehicleName: 'TVS Jupiter',
    testimonial: 'Very professional team. They inspected my scooter fairly and gave me a good price. The payment was instant and secure!',
    rating: 5,
    isActive: true,
    order: 6
  },
  {
    customerName: 'Rahul Mehta',
    vehicleName: 'Honda City',
    testimonial: 'Excellent buying experience! Got my dream car at an amazing price. The vehicle was in perfect condition just as described.',
    rating: 5,
    isActive: true,
    order: 7
  },
  {
    customerName: 'Kavita Joshi',
    vehicleName: 'Hero Splendor Plus',
    testimonial: 'Smooth transaction from start to finish. They took care of all the documentation and the whole process was hassle-free!',
    rating: 5,
    isActive: true,
    order: 8
  },
  {
    customerName: 'Sanjay Malhotra',
    vehicleName: 'Tata Nexon',
    testimonial: 'Trustworthy dealers with fair pricing. Got a great deal on my used car and the team was very supportive throughout.',
    rating: 5,
    isActive: true,
    order: 9
  },
  {
    customerName: 'Pooja Reddy',
    vehicleName: 'Yamaha FZ',
    testimonial: 'Highly recommended! Quick evaluation, fair price, and instant payment. Best place in Ujjain to sell your vehicle!',
    rating: 5,
    isActive: true,
    order: 10
  },
  {
    customerName: 'Karan Kapoor',
    vehicleName: 'Maruti Alto',
    testimonial: 'Great experience! The team was very professional and offered me the best price. Will definitely recommend to friends and family.',
    rating: 5,
    isActive: true,
    order: 11
  },
  {
    customerName: 'Anjali Desai',
    vehicleName: 'Honda Dio',
    testimonial: 'Perfect service! Sold my scooter hassle-free. They took care of everything and paid me immediately. Very satisfied!',
    rating: 5,
    isActive: true,
    order: 12
  }
];

async function addSampleReviews() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing reviews (optional)
    console.log('\nClearing existing reviews...');
    await Review.deleteMany({});
    console.log('Existing reviews cleared');

    // Add sample reviews
    console.log('\nAdding sample reviews...');
    const reviews = await Review.insertMany(sampleReviews);
    console.log(`✓ Successfully added ${reviews.length} sample reviews`);

    console.log('\nSample Reviews:');
    reviews.forEach((review, index) => {
      console.log(`${index + 1}. ${review.customerName} - ${review.vehicleName} (${review.rating} stars)`);
    });

    console.log('\n✓ Done! Sample reviews added successfully.');
  } catch (error) {
    console.error('Error adding sample reviews:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
  }
}

addSampleReviews();
