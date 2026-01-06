#!/usr/bin/env node

/**
 * Script to add sample sold vehicles (success stories) to the database
 * Run: node scripts/add-sample-success-stories.js
 */

const mongoose = require('mongoose');

// Load environment variables from .env.local file manually
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
});

const MONGODB_URI = envVars.MONGODB_URI;

const soldVehicleSchema = new mongoose.Schema({
  vehicleName: String,
  vehicleType: String,
  customerName: String,
  image: String,
  soldDate: Date,
  testimonial: String,
  price: Number,
  featured: Boolean,
}, { timestamps: true });

const SoldVehicle = mongoose.models.SoldVehicle || mongoose.model('SoldVehicle', soldVehicleSchema);

const sampleSuccessStories = [
  {
    vehicleName: 'Royal Enfield Classic 350',
    vehicleType: 'bike',
    customerName: 'Rahul Sharma',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800',
    soldDate: new Date('2024-12-15'),
    testimonial: 'Great service! Got my dream bike at an amazing price. The team was very professional and helpful.',
    price: 145000,
    featured: true,
  },
  {
    vehicleName: 'Honda City 2019',
    vehicleType: 'car',
    customerName: 'Priya Patel',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
    soldDate: new Date('2024-12-10'),
    testimonial: 'Best deal in town! The car was in excellent condition and the paperwork was handled smoothly.',
    price: 850000,
    featured: true,
  },
  {
    vehicleName: 'Yamaha R15 V3',
    vehicleType: 'bike',
    customerName: 'Arjun Verma',
    image: 'https://images.unsplash.com/photo-1558980394-4c7c9f4fa2de?w=800',
    soldDate: new Date('2024-12-08'),
    testimonial: 'Amazing experience! The bike was exactly as described. Highly recommend Swastik Bikes!',
    price: 125000,
    featured: false,
  },
  {
    vehicleName: 'Maruti Swift 2020',
    vehicleType: 'car',
    customerName: 'Sneha Gupta',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
    soldDate: new Date('2024-12-05'),
    testimonial: 'Very satisfied with my purchase. The team was transparent and trustworthy.',
    price: 550000,
    featured: false,
  },
  {
    vehicleName: 'KTM Duke 390',
    vehicleType: 'bike',
    customerName: 'Vikram Singh',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800',
    soldDate: new Date('2024-11-28'),
    testimonial: 'Excellent service and great bike! Worth every penny.',
    price: 185000,
    featured: true,
  },
  {
    vehicleName: 'Hyundai Creta 2021',
    vehicleType: 'car',
    customerName: 'Amit Kumar',
    image: 'https://images.unsplash.com/photo-1549927681-0b673b8243ab?w=800',
    soldDate: new Date('2024-11-25'),
    testimonial: 'Perfect SUV for my family. The buying process was hassle-free!',
    price: 1200000,
    featured: false,
  },
  {
    vehicleName: 'Hero Splendor Plus',
    vehicleType: 'bike',
    customerName: 'Rajesh Yadav',
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
    soldDate: new Date('2024-11-20'),
    testimonial: 'Great value for money. Perfect bike for daily commute.',
    price: 55000,
    featured: false,
  },
  {
    vehicleName: 'Tata Nexon EV',
    vehicleType: 'car',
    customerName: 'Anjali Desai',
    image: 'https://images.unsplash.com/photo-1617654112368-307921291f42?w=800',
    soldDate: new Date('2024-11-15'),
    testimonial: 'Love my new electric car! The team helped me understand all the features.',
    price: 1350000,
    featured: true,
  },
  {
    vehicleName: 'Bajaj Pulsar 220F',
    vehicleType: 'bike',
    customerName: 'Sanjay Mehta',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800',
    soldDate: new Date('2024-11-10'),
    testimonial: 'Smooth transaction and great bike condition. Happy customer!',
    price: 95000,
    featured: false,
  },
  {
    vehicleName: 'Mahindra Thar 2022',
    vehicleType: 'car',
    customerName: 'Karan Malhotra',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
    soldDate: new Date('2024-11-05'),
    testimonial: 'Dream car purchased! The off-road beast is mine now. Thanks to the amazing team!',
    price: 1450000,
    featured: true,
  },
  {
    vehicleName: 'Honda Activa 6G',
    vehicleType: 'bike',
    customerName: 'Deepa Iyer',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800',
    soldDate: new Date('2024-10-30'),
    testimonial: 'Perfect scooter for city rides. Very happy with my purchase.',
    price: 68000,
    featured: false,
  },
  {
    vehicleName: 'Toyota Fortuner 2020',
    vehicleType: 'car',
    customerName: 'Rohan Kapoor',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    soldDate: new Date('2024-10-25'),
    testimonial: 'Premium SUV at a great price. Excellent service throughout the process!',
    price: 2800000,
    featured: true,
  },
];

async function addSampleSuccessStories() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing sold vehicles (optional - comment out if you want to keep existing data)
    // await SoldVehicle.deleteMany({});
    // console.log('🗑️  Cleared existing success stories');

    console.log('📝 Adding sample success stories...');
    const results = await SoldVehicle.insertMany(sampleSuccessStories);
    console.log(`✅ Successfully added ${results.length} success stories!`);

    console.log('\n📊 Summary:');
    console.log(`   - Total: ${results.length}`);
    console.log(`   - Featured: ${results.filter(r => r.featured).length}`);
    console.log(`   - Bikes: ${results.filter(r => r.vehicleType === 'bike').length}`);
    console.log(`   - Cars: ${results.filter(r => r.vehicleType === 'car').length}`);

    console.log('\n✨ Sample success stories added successfully!');
    console.log('🌐 Visit http://localhost:3000/success-stories to see them');
    console.log('🔐 Admin: http://localhost:3000/admin/sold-vehicles');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

addSampleSuccessStories();
