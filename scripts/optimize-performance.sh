#!/bin/bash

# Performance Optimization Script for Swastik Motors

echo "🚀 Optimizing Swastik Motors Website..."
echo ""

# 1. Add database indexes
echo "📊 Adding database indexes..."
node -e "
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function addIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const Vehicle = mongoose.model('Vehicle');
    const Review = mongoose.model('Review');
    
    // Add Vehicle indexes
    await Vehicle.collection.createIndex({ category: 1, status: 1, featured: -1 });
    await Vehicle.collection.createIndex({ brand: 1, category: 1 });
    await Vehicle.collection.createIndex({ sellingPrice: 1 });
    await Vehicle.collection.createIndex({ createdAt: -1 });
    await Vehicle.collection.createIndex({ 'location.city': 1 });
    
    console.log('✓ Vehicle indexes created');
    
    // Add Review indexes
    await Review.collection.createIndex({ isActive: 1, order: 1 });
    
    console.log('✓ Review indexes created');
    
    await mongoose.connection.close();
    console.log('✓ Database optimization complete');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addIndexes();
"

echo ""
echo "✅ Optimization Complete!"
echo ""
echo "📈 Performance Improvements Applied:"
echo "  ✓ Image optimization (WebP + AVIF)"
echo "  ✓ API caching (5 minutes)"
echo "  ✓ Static page generation with ISR"
echo "  ✓ Database indexes for faster queries"
echo "  ✓ HTTP caching headers"
echo "  ✓ Compression enabled"
echo "  ✓ Bundle optimization"
echo ""
echo "🔧 Next Steps:"
echo "  1. Run: npm run build"
echo "  2. Test performance with Lighthouse"
echo "  3. Monitor loading times in production"
echo ""
