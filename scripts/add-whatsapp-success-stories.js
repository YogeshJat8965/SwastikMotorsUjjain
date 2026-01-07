// Add WhatsApp-style success stories with male names only
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://yogeshjat958_db_user:3AT9aORJJMZ8vQ1A@cluster0.e4bksba.mongodb.net/?appName=Cluster0';

async function addWhatsAppStyleStories() {
  await mongoose.connect(MONGODB_URI);
  
  const SoldVehicle = mongoose.model('SoldVehicle', new mongoose.Schema({
    vehicleName: { type: String, required: true },
    vehicleType: { type: String, enum: ['bike', 'car'], required: true },
    customerName: String,
    image: { type: String, required: true },
    soldDate: { type: Date, required: true },
    testimonial: String,
    price: Number,
    featured: { type: Boolean, default: true }
  }, { timestamps: true }));

  // Delete all existing sold vehicles
  await SoldVehicle.deleteMany({});
  console.log('✅ Cleared all existing success stories');

  // WhatsApp-style success stories with male names
  const whatsappStories = [
    {
      vehicleName: 'Royal Enfield Classic 350',
      vehicleType: 'bike',
      customerName: 'Rajesh Sharma',
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80',
      soldDate: new Date('2025-12-15'),
      testimonial: 'Bhai dream bike mil gayi yaha se! Staff bahut helpful tha or bike ki condition ekdum mast thi. Paise vasool deal hai. Best decision!',
      price: 135000,
      featured: true
    },
    {
      vehicleName: 'Maruti Swift VXI',
      vehicleType: 'car',
      customerName: 'Aditya Patel',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80',
      soldDate: new Date('2025-12-20'),
      testimonial: 'First car lene ka experience bahut achha raha. Transparent dealing or fair price. Swastik Motors ko trust kar sakte ho completely. Recommended!',
      price: 425000,
      featured: true
    },
    {
      vehicleName: 'Honda Activa 6G',
      vehicleType: 'bike',
      customerName: 'Vikram Singh',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80',
      soldDate: new Date('2025-12-22'),
      testimonial: 'Daily use ke liye perfect scooty mili. Documentation sab jaldi ho gya or koi problem nahi hui. Hassle-free process tha.',
      price: 52000,
      featured: true
    },
    {
      vehicleName: 'Honda City ZX',
      vehicleType: 'car',
      customerName: 'Rohit Verma',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
      soldDate: new Date('2025-12-25'),
      testimonial: 'Family ke liye car li thi yaha se. Ekdum perfect condition me thi or paperwork me bhi full support mila. Very satisfied with purchase!',
      price: 385000,
      featured: true
    },
    {
      vehicleName: 'Bajaj Pulsar 220F',
      vehicleType: 'bike',
      customerName: 'Deepak Joshi',
      image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80',
      soldDate: new Date('2025-12-28'),
      testimonial: 'Mast bike hai bhai! Service bhi top class mili Swastik Motors se. Professional or trustworthy hai log. Thank you!',
      price: 95000,
      featured: true
    },
    {
      vehicleName: 'Hyundai i20 Sportz',
      vehicleType: 'car',
      customerName: 'Manish Gupta',
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80',
      soldDate: new Date('2025-12-30'),
      testimonial: 'Ujjain me used cars ke liye best place hai. Well maintained i20 mili or price bhi budget me thi. Highly recommended hai!',
      price: 465000,
      featured: true
    },
    {
      vehicleName: 'TVS Jupiter',
      vehicleType: 'bike',
      customerName: 'Amit Agarwal',
      image: 'https://images.unsplash.com/photo-1590917861484-0d4a4c177b1c?w=800&q=80',
      soldDate: new Date('2026-01-02'),
      testimonial: 'Smooth buying experience tha bhai. Scooty perfect hai daily needs ke liye. Thanks to Swastik Motors team for support!',
      price: 48000,
      featured: true
    },
    {
      vehicleName: 'Yamaha FZ-S',
      vehicleType: 'bike',
      customerName: 'Sanjay Chouhan',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80',
      soldDate: new Date('2026-01-04'),
      testimonial: 'Love the bike! Process bahut easy tha or staff ne sab kuch detail me explain kiya. Professional or honest service mili.',
      price: 82000,
      featured: true
    }
  ];

  // Insert all success stories
  const result = await SoldVehicle.insertMany(whatsappStories);
  console.log(`✅ Added ${result.length} WhatsApp-style success stories`);
  
  // Show summary
  console.log('\n📋 WhatsApp-Style Success Stories Summary:');
  whatsappStories.forEach((story, index) => {
    console.log(`${index + 1}. ${story.vehicleName} - ${story.customerName} (${story.vehicleType})`);
  });

  await mongoose.disconnect();
  console.log('\n✨ Database updated with genuine WhatsApp-style content!');
}

addWhatsAppStyleStories().catch(console.error);
