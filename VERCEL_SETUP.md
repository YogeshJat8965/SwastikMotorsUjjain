# Vercel Deployment Environment Variables

Make sure to add these environment variables in your Vercel project settings:

## Required Variables

1. **MONGODB_URI**
   - Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
   - Get this from MongoDB Atlas

2. **CLOUDINARY_CLOUD_NAME**
   - Your Cloudinary cloud name
   - Get this from Cloudinary dashboard

3. **CLOUDINARY_API_KEY**
   - Your Cloudinary API key
   - Get this from Cloudinary dashboard

4. **CLOUDINARY_API_SECRET**
   - Your Cloudinary API secret
   - Get this from Cloudinary dashboard

5. **ADMIN_PASSWORD_HASH**
   - Bcrypt hash of your admin password
   - Generate using: `node scripts/hash-password.js yourpassword`

6. **JWT_SECRET**
   - Random secret string for JWT tokens
   - Generate using: `openssl rand -base64 32`

## Optional Variables

7. **NEXT_PUBLIC_ADMIN_WHATSAPP**
   - WhatsApp number for customer contact (e.g., `919876543210`)

8. **NEXT_PUBLIC_INSTAGRAM_HANDLE**
   - Instagram username without @ (e.g., `yogeshjat100`)

## How to Add in Vercel

1. Go to your Vercel project dashboard
2. Click on "Settings"
3. Go to "Environment Variables"
4. Add each variable with its value
5. Select environments: Production, Preview, Development
6. Click "Save"
7. Redeploy your application

## Testing the Connection

After deployment, visit: `https://your-domain.vercel.app/api/health`

This will show if MongoDB is connected properly.
