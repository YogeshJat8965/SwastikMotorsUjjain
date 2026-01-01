// Quick test script to verify purchase workflow
// Run with: node test-purchase.js

const mongoose = require('mongoose');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://yogeshjat958:qYiFMU4fD16WoZ8f@cluster0.bnrvu.mongodb.net/swastik-bike?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    // Import models
    const Submission = mongoose.model('Submission', new mongoose.Schema({
      referenceNumber: String,
      name: String,
      email: String,
      phone: String,
      city: String,
      state: String,
      category: String,
      brand: String,
      vehicleModel: String,
      year: Number,
      kilometers: Number,
      fuelType: String,
      transmission: String,
      color: String,
      owners: Number,
      images: [String],
      expectedPrice: Number,
      description: String,
      status: String,
      adminNotes: String,
    }, { timestamps: true }));

    // Find all submissions
    const submissions = await Submission.find({}).limit(5);
    
    console.log(`\n📊 Found ${submissions.length} submissions in database:`);
    
    if (submissions.length === 0) {
      console.log('\n⚠️  No submissions found! Creating a test submission...\n');
      
      const testSubmission = await Submission.create({
        referenceNumber: `REF-${Date.now()}`,
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '9876543210',
        city: 'Jaipur',
        state: 'Rajasthan',
        category: 'bike',
        brand: 'Honda',
        vehicleModel: 'Activa',
        year: 2020,
        kilometers: 15000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        color: 'Black',
        owners: 1,
        images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
        expectedPrice: 60000,
        description: 'Well maintained bike',
        status: 'approved',
      });
      
      console.log('✅ Test submission created:');
      console.log(`   ID: ${testSubmission._id}`);
      console.log(`   Reference: ${testSubmission.referenceNumber}`);
      console.log(`   Vehicle: ${testSubmission.brand} ${testSubmission.vehicleModel} ${testSubmission.year}`);
      console.log(`   Status: ${testSubmission.status}`);
      console.log(`\n👉 Use this ID to test purchase: ${testSubmission._id}`);
      console.log(`   URL: http://localhost:3000/admin/requests/${testSubmission._id}`);
    } else {
      submissions.forEach((sub, index) => {
        console.log(`\n${index + 1}. ${sub.brand} ${sub.vehicleModel} ${sub.year}`);
        console.log(`   ID: ${sub._id}`);
        console.log(`   Reference: ${sub.referenceNumber}`);
        console.log(`   Status: ${sub.status}`);
        console.log(`   Expected Price: ₹${sub.expectedPrice?.toLocaleString('en-IN')}`);
        console.log(`   Fuel: ${sub.fuelType}, Transmission: ${sub.transmission}`);
        console.log(`   URL: http://localhost:3000/admin/requests/${sub._id}`);
      });
      
      const approvedSubmissions = submissions.filter(s => s.status === 'approved');
      if (approvedSubmissions.length === 0) {
        console.log(`\n⚠️  No approved submissions! Approve one first or use ID from above.`);
      } else {
        console.log(`\n✅ ${approvedSubmissions.length} approved submission(s) ready for purchase!`);
      }
    }

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed\n');
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
