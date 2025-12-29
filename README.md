# Swastik Bikes - Vehicle Marketplace

A modern, mobile-first platform for buying, selling, and renting bikes and cars.

## Phase 1 - Foundation (Completed ✅)

### What's Been Built:

1. **Project Structure**
   - Next.js 15 with App Router
   - TypeScript configuration
   - Tailwind CSS setup
   - All dependencies installed

2. **Database & Backend**
   - MongoDB connection utility
   - Mongoose schemas (Vehicle, Submission, Booking, Admin)
   - Cloudinary integration for images

3. **UI Components**
   - Button, Input, Textarea, Card, Badge, Spinner
   - Fully responsive and mobile-first
   - Custom Tailwind styling (no external UI libraries)

4. **Layout Components**
   - Navbar with WhatsApp button
   - Footer with trust badges
   - Bottom navigation for mobile
   - Responsive across all devices

5. **Homepage**
   - Hero section with search
   - Trust signals (35k followers, 3k members)
   - Featured vehicles section
   - Quick category links
   - CTA sections

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `MONGODB_URI` - Your MongoDB connection string
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `ADMIN_EMAIL` - Admin email for login
- `ADMIN_PASSWORD_HASH` - Bcrypt hash of admin password
- `ADMIN_WHATSAPP` - WhatsApp number (format: 919876543210)
- `INSTAGRAM_HANDLE` - Instagram handle (e.g., @swastikbikes)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
swastik-bike/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Spinner.tsx
│   └── layout/            # Layout components
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       └── BottomNav.tsx
├── lib/                   # Utilities
│   ├── mongodb.ts        # Database connection
│   └── cloudinary.ts     # Image upload
├── models/               # Mongoose models
│   ├── Vehicle.ts
│   ├── Submission.ts
│   ├── Booking.ts
│   └── Admin.ts
├── public/              # Static files
└── .env.example         # Environment template
```

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS (custom components)
- **Database:** MongoDB with Mongoose
- **Images:** Cloudinary
- **Deployment:** Vercel

## Features

### Phase 1 ✅
- Project setup and structure
- Database models and connection
- Basic UI components
- Responsive layout
- Homepage with hero section

### Phase 2 (Next)
- Buy page with filters
- Vehicle detail page
- Sell to Us form
- Rentals page
- WhatsApp integration

### Phase 3
- Admin dashboard
- Submission review
- Inventory management

## Mobile-First Design

- Bottom navigation for easy thumb access
- Large tap targets (min 44px)
- Optimized for 3G networks
- Under 2 second load time target
- Responsive across all devices

## Performance Targets

- Lighthouse Score: 85+ (Mobile), 90+ (Desktop)
- First Contentful Paint: <1.8s
- Largest Contentful Paint: <2.5s
- Bundle Size: <100KB

## License

Private Project - All Rights Reserved
