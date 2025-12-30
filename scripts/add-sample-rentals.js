// Script to add sample rental vehicles to MongoDB for testing
// Run with: node scripts/add-sample-rentals.js

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables manually
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

const rentalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  category: { type: String, enum: ['bike', 'car'], required: true },
  brand: { type: String, required: true },
  vehicleModel: { type: String, required: true },
  year: { type: Number, required: true },
  fuelType: { type: String, required: true },
  transmission: { type: String, required: true },
  color: { type: String, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  dailyRate: { type: Number, required: true },
  weeklyRate: { type: Number, required: true },
  monthlyRate: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  seatingCapacity: { type: Number, required: true },
  mileageLimit: { type: Number, default: 100 },
  extraKmCharge: { type: Number, default: 5 },
  features: [{ type: String }],
  status: { type: String, default: 'available' },
  minimumRentalDays: { type: Number, default: 1 },
  maximumRentalDays: { type: Number, default: 30 },
  totalBookings: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  rating: { type: Number },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Rental = mongoose.models.Rental || mongoose.model('Rental', rentalSchema);

const sampleRentals = [
  // BIKES
  {
    title: 'Royal Enfield Classic 350',
    description: 'Classic cruiser bike perfect for long rides. Well-maintained and ready for your adventures. Ideal for weekend getaways and city commutes.',
    images: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39',
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65',
    ],
    category: 'bike',
    brand: 'Royal Enfield',
    vehicleModel: 'Classic 350',
    year: 2023,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'Black',
    registrationNumber: 'MP09AA1111',
    city: 'Indore',
    state: 'Madhya Pradesh',
    dailyRate: 800,
    weeklyRate: 5000,
    monthlyRate: 18000,
    securityDeposit: 5000,
    seatingCapacity: 2,
    mileageLimit: 100,
    extraKmCharge: 5,
    features: ['Helmet Included', 'Insurance', '24/7 Support', 'Bluetooth Audio'],
    status: 'available',
    minimumRentalDays: 1,
    maximumRentalDays: 30,
    isFeatured: true,
    rating: 4.8,
  },
  {
    title: 'Honda Activa 6G',
    description: 'Most reliable and fuel-efficient scooter. Perfect for daily commute and city rides. Easy to ride and comfortable.',
    images: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
    ],
    category: 'bike',
    brand: 'Honda',
    vehicleModel: 'Activa 6G',
    year: 2024,
    fuelType: 'petrol',
    transmission: 'automatic',
    color: 'Red',
    registrationNumber: 'MP09BB2222',
    city: 'Indore',
    state: 'Madhya Pradesh',
    dailyRate: 400,
    weeklyRate: 2500,
    monthlyRate: 9000,
    securityDeposit: 3000,
    seatingCapacity: 2,
    mileageLimit: 80,
    extraKmCharge: 4,
    features: ['Helmet Included', 'Insurance', 'Fuel Efficient', 'Under Seat Storage'],
    status: 'available',
    minimumRentalDays: 1,
    maximumRentalDays: 30,
    isFeatured: true,
    rating: 4.7,
  },
  {
    title: 'KTM Duke 390',
    description: 'Powerful street bike for thrill seekers. Perfect for experienced riders who love speed and performance.',
    images: [
      'https://images.unsplash.com/photo-1599819177795-7a88f194a2bb',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc',
    ],
    category: 'bike',
    brand: 'KTM',
    vehicleModel: 'Duke 390',
    year: 2023,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'Orange',
    registrationNumber: 'MP09CC3333',
    city: 'Indore',
    state: 'Madhya Pradesh',
    dailyRate: 1200,
    weeklyRate: 7500,
    monthlyRate: 28000,
    securityDeposit: 10000,
    seatingCapacity: 2,
    mileageLimit: 150,
    extraKmCharge: 6,
    features: ['Helmet Included', 'Insurance', 'ABS', 'Digital Speedometer', 'LED Lights'],
    status: 'available',
    minimumRentalDays: 1,
    maximumRentalDays: 15,
    isFeatured: false,
    rating: 4.9,
  },
  {
    title: 'TVS Apache RTR 160',
    description: 'Sporty commuter bike with excellent mileage. Great for daily use and weekend rides.',
    images: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87',
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65',
    ],
    category: 'bike',
    brand: 'TVS',
    vehicleModel: 'Apache RTR 160',
    year: 2023,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'Blue',
    registrationNumber: 'MP09DD4444',
    city: 'Indore',
    state: 'Madhya Pradesh',
    dailyRate: 600,
    weeklyRate: 3800,
    monthlyRate: 14000,
    securityDeposit: 4000,
    seatingCapacity: 2,
    mileageLimit: 120,
    extraKmCharge: 5,
    features: ['Helmet Included', 'Insurance', 'Digital Console', 'LED Tail Lamp'],
    status: 'available',
    minimumRentalDays: 1,
    maximumRentalDays: 30,
    isFeatured: false,
    rating: 4.5,
  },

  // CARS
  {
    title: 'Maruti Swift VXI',
    description: 'Popular hatchback perfect for city driving. Fuel efficient, comfortable, and easy to drive. Great for family trips and daily commute.',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888',
    ],
    category: 'car',
    brand: 'Maruti',
    vehicleModel: 'Swift VXI',
    year: 2023,
    fuelType: 'petrol',
    transmission: 'manual',
    color: 'White',
    registrationNumber: 'MP09EE5555',
    city: 'Indore',
    state: 'Madhya Pradesh',
    dailyRate: 1500,
    weeklyRate: 9500,
    monthlyRate: 35000,
    securityDeposit: 10000,
    seatingCapacity: 5,
    mileageLimit: 150,
    extraKmCharge: 8,
    features: ['AC', 'Music System', 'Power Windows', 'Central Locking', 'Insurance', 'GPS'],
    status: 'available',
    minimumRentalDays: 1,
    maximumRentalDays: 30,
    isFeatured: true,
    rating: 4.6,
  },
  {
    title: 'Hyundai Creta SX',
    description: 'Premium SUV with all modern features. Spacious interior, powerful engine, perfect for family trips and long journeys.',
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf',
    ],
    category: 'car',
    brand: 'Hyundai',
    vehicleModel: 'Creta SX',
    year: 2024,
    fuelType: 'diesel',
    transmission: 'automatic',
    color: 'Grey',
    registrationNumber: 'MP09FF6666',
    city: 'Indore',
    state: 'Madhya Pradesh',
    dailyRate: 3500,
    weeklyRate: 22000,
    monthlyRate: 80000,
    securityDeposit: 20000,
    seatingCapacity: 5,
    mileageLimit: 200,
    extraKmCharge: 10,
    features: ['AC', 'Sunroof', 'Leather Seats', 'Touchscreen', 'Reverse Camera', 'Insurance', 'GPS', 'Cruise Control'],
    status: 'available',
    minimumRentalDays: 2,
    maximumRentalDays: 30,
    isFeatured: true,
    rating: 4.9,
  },
  {
    title: 'Tata Nexon EV',
    description: 'Electric SUV with zero emissions. Modern features, great range, and eco-friendly. Perfect for city driving.',
    images: [
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d',
    ],
    category: 'car',
    brand: 'Tata',
    vehicleModel: 'Nexon EV',
    year: 2024,
    fuelType: 'electric',
    transmission: 'automatic',
    color: 'Blue',
    registrationNumber: 'MP09GG7777',
    city: 'Indore',
    state: 'Madhya Pradesh',
    dailyRate: 2500,
    weeklyRate: 16000,
    monthlyRate: 60000,
    securityDeposit: 15000,
    seatingCapacity: 5,
    mileageLimit: 180,
    extraKmCharge: 0,
    features: ['AC', 'Touchscreen', 'Electric', 'Regenerative Braking', 'Insurance', 'GPS', 'Fast Charging Support'],
    status: 'available',
    minimumRentalDays: 1,
    maximumRentalDays: 20,
    isFeatured: false,
    rating: 4.7,
  },
  {
    title: 'Honda City VX',
    description: 'Premium sedan with excellent comfort. Spacious, feature-rich, and perfect for business or family use.',
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888',
    ],
    category: 'car',
    brand: 'Honda',
    vehicleModel: 'City VX',
    year: 2023,
    fuelType: 'petrol',
    transmission: 'automatic',
    color: 'Silver',
    registrationNumber: 'MP09HH8888',
    city: 'Indore',
    state: 'Madhya Pradesh',
    dailyRate: 2200,
    weeklyRate: 14000,
    monthlyRate: 52000,
    securityDeposit: 12000,
    seatingCapacity: 5,
    mileageLimit: 180,
    extraKmCharge: 9,
    features: ['AC', 'Leather Seats', 'Sunroof', 'Touchscreen', 'Cruise Control', 'Insurance', 'GPS'],
    status: 'available',
    minimumRentalDays: 1,
    maximumRentalDays: 30,
    isFeatured: false,
    rating: 4.8,
  },
  {
    title: 'Mahindra Thar LX',
    description: 'Rugged off-road SUV perfect for adventures. Powerful 4x4, ideal for mountain trips and rough terrain.',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b',
    ],
    category: 'car',
    brand: 'Mahindra',
    vehicleModel: 'Thar LX',
    year: 2023,
    fuelType: 'diesel',
    transmission: 'manual',
    color: 'Red',
    registrationNumber: 'MP09II9999',
    city: 'Indore',
    state: 'Madhya Pradesh',
    dailyRate: 3000,
    weeklyRate: 19000,
    monthlyRate: 70000,
    securityDeposit: 18000,
    seatingCapacity: 4,
    mileageLimit: 200,
    extraKmCharge: 10,
    features: ['AC', '4x4', 'Convertible Top', 'Insurance', 'GPS', 'Off-road Tires', 'Hill Assist'],
    status: 'available',
    minimumRentalDays: 2,
    maximumRentalDays: 15,
    isFeatured: true,
    rating: 4.9,
  },
];

async function addSampleRentals() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing rental vehicles
    console.log('Clearing existing rentals...');
    await Rental.deleteMany({});
    console.log('Cleared existing rentals');

    // Add new rental vehicles
    console.log('Adding sample rentals...');
    const result = await Rental.insertMany(sampleRentals);
    console.log(`Successfully added ${result.length} rental vehicles!`);

    // Display summary
    console.log('\n=== Summary ===');
    const bikes = result.filter(r => r.category === 'bike');
    const cars = result.filter(r => r.category === 'car');
    console.log(`Bikes: ${bikes.length}`);
    console.log(`Cars: ${cars.length}`);
    console.log(`Total: ${result.length}`);
    console.log('\nFeatured Rentals:');
    result.filter(r => r.isFeatured).forEach(r => {
      console.log(`  - ${r.title} (₹${r.dailyRate}/day)`);
    });

  } catch (error) {
    console.error('Error adding sample rentals:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
  }
}

addSampleRentals();
