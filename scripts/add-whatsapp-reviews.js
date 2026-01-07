// Add WhatsApp-style genuine reviews with male names only
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://yogeshjat958_db_user:3AT9aORJJMZ8vQ1A@cluster0.e4bksba.mongodb.net/?appName=Cluster0';

async function addWhatsAppStyleReviews() {
  await mongoose.connect(MONGODB_URI);
  
  const Review = mongoose.model('Review', new mongoose.Schema({
    customerName: { type: String, required: true },
    vehicleName: { type: String, required: true },
    testimonial: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  }, { timestamps: true }));

  // Delete all existing reviews first
  await Review.deleteMany({});
  console.log('✅ Cleared all existing reviews');

  // WhatsApp-style reviews with male names and Hinglish language
  const whatsappReviews = [
    {
      customerName: 'Rajesh Sharma',
      vehicleName: 'Royal Enfield Classic 350',
      testimonial: 'Bahut achhi service mili bhai. Bike ekdum perfect condition me thi or price bhi reasonable tha. Swastik Motors se lene me koi tension nahi hai. Highly recommended!',
      rating: 5,
      order: 1,
      isActive: true
    },
    {
      customerName: 'Aditya Patel',
      vehicleName: 'Maruti Swift',
      testimonial: 'Bhai ekdum mast car mila yaha se. Papers sab clear the or bhaiya ne pura detail me samjhaya. Worth it hai Ujjain me best jagah hai used vehicles ke liye.',
      rating: 5,
      order: 2,
      isActive: true
    },
    {
      customerName: 'Vikram Singh',
      vehicleName: 'Honda Activa 6G',
      testimonial: 'Scooty leni thi to dost ne recommend kiya tha Swastik Motors. Ekdum genuine dealing hai or staff bahut helpful hai. Mast experience raha overall.',
      rating: 5,
      order: 3,
      isActive: true
    },
    {
      customerName: 'Rohit Verma',
      vehicleName: 'Hyundai i20',
      testimonial: 'Family ke liye car li thi yaha se. Bhai sahab ne test drive bhi karwai or insurance transfer me bhi help ki. Koi hidden charges nahi the. Satisfied hu completely.',
      rating: 5,
      order: 4,
      isActive: true
    },
    {
      customerName: 'Deepak Joshi',
      vehicleName: 'Bajaj Pulsar 220F',
      testimonial: 'College trip ke liye rent pe li thi bike. Condition ekdum top class thi or rates bhi affordable the. Next time bhi yahi se lunga. Great service!',
      rating: 5,
      order: 5,
      isActive: true
    },
    {
      customerName: 'Manish Gupta',
      vehicleName: 'Honda City',
      testimonial: 'Purani gaadi bechni thi to yaha laya. Fair price mila or process bhi quick tha. Trustworthy dealers hai bhai Ujjain me. Thank you Swastik Motors.',
      rating: 5,
      order: 6,
      isActive: true
    },
    {
      customerName: 'Amit Agarwal',
      vehicleName: 'TVS Jupiter',
      testimonial: 'Bhai bahut smooth raha experience. Scooty bahut achhi condition me thi or documentation bhi jaldi ho gya. Tension free process hai yaha. Recommend karunga sabko.',
      rating: 5,
      order: 7,
      isActive: true
    },
    {
      customerName: 'Sanjay Chouhan',
      vehicleName: 'Yamaha FZ-S',
      testimonial: 'Bike lene ka plan tha to friend ne suggest kiya Swastik Motors. Bhai honest dealings hai or quality bhi mast hai. Happy customer hu me. Thanks!',
      rating: 5,
      order: 8,
      isActive: true
    },
    {
      customerName: 'Rahul Tiwari',
      vehicleName: 'Maruti Alto',
      testimonial: 'First time car kharidi to thoda tension tha but yaha ke staff ne sab guide kiya achhe se. Price bhi budget me tha. Best place for used vehicles in Ujjain.',
      rating: 5,
      order: 9,
      isActive: true
    }
  ];

  // Insert all reviews
  const result = await Review.insertMany(whatsappReviews);
  console.log(`✅ Added ${result.length} WhatsApp-style reviews`);
  
  // Show summary
  console.log('\n📋 WhatsApp-Style Reviews Summary:');
  whatsappReviews.forEach((review, index) => {
    console.log(`${index + 1}. ${review.customerName} - ${review.vehicleName} (${review.rating}⭐)`);
  });

  await mongoose.disconnect();
  console.log('\n✨ Database updated with genuine WhatsApp-style content!');
}

addWhatsAppStyleReviews().catch(console.error);
