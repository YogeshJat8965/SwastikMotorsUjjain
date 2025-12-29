#!/bin/bash

# Create Footer component
cat > components/layout/Footer.tsx << 'EOF'
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">Swastik Bikes</h3>
            <p className="text-gray-400 text-sm">
              Your trusted partner for buying, selling, and renting bikes & cars.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-primary-400">��</span>
                <span>35,000+ Instagram Followers</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-primary-400">👥</span>
                <span>3,000+ WhatsApp Members</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/buy" className="text-gray-400 hover:text-white">
                  Buy Bikes & Cars
                </Link>
              </li>
              <li>
                <Link href="/rentals" className="text-gray-400 hover:text-white">
                  Rentals
                </Link>
              </li>
              <li>
                <Link href="/sell-to-us" className="text-gray-400 hover:text-white">
                  Sell to Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>WhatsApp: +91 98765 43210</li>
              <li>Instagram: @swastikbikes</li>
              <li>Email: info@swastikbikes.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Swastik Bikes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
EOF

# Create BottomNav component  
cat > components/layout/BottomNav.tsx << 'EOF'
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="grid grid-cols-4 h-16">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center space-y-1 ${
            isActive('/') ? 'text-primary-600' : 'text-gray-600'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs font-medium">Home</span>
        </Link>

        <Link
          href="/buy"
          className={`flex flex-col items-center justify-center space-y-1 ${
            isActive('/buy') ? 'text-primary-600' : 'text-gray-600'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-xs font-medium">Buy</span>
        </Link>

        <Link
          href="/sell-to-us"
          className={`flex flex-col items-center justify-center space-y-1 ${
            isActive('/sell-to-us') ? 'text-primary-600' : 'text-gray-600'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-medium">Sell</span>
        </Link>

        <Link
          href="/rentals"
          className={`flex flex-col items-center justify-center space-y-1 ${
            isActive('/rentals') ? 'text-primary-600' : 'text-gray-600'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-medium">Rent</span>
        </Link>
      </div>
    </nav>
  );
}
EOF

# Create globals.css
cat > app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  @apply text-gray-900 bg-gray-50;
}

@layer utilities {
  .container {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }
}
EOF

# Create layout.tsx
cat > app/layout.tsx << 'EOF'
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "Swastik Bikes - Buy, Sell & Rent Bikes & Cars",
  description: "Your trusted partner for buying, selling, and renting bikes & cars. 35k+ Instagram followers, 3k+ WhatsApp members.",
  keywords: "bikes, cars, buy bikes, sell bikes, rent bikes, used bikes, used cars",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen pb-20 md:pb-0">
          {children}
        </main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
EOF

# Create homepage
cat > app/page.tsx << 'EOF'
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function Home() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP || '919876543210';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi, I want to know more about your bikes/cars`;

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Buy, Sell & Rent Bikes & Cars
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Your trusted partner with 35,000+ Instagram followers and 3,000+ WhatsApp members
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge color="blue" className="text-sm py-2 px-4">
                �� 35,000+ Instagram Followers
              </Badge>
              <Badge color="green" className="text-sm py-2 px-4">
                👥 3,000+ WhatsApp Members
              </Badge>
              <Badge color="yellow" className="text-sm py-2 px-4">
                ⭐ 100% Trusted
              </Badge>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-lg p-2 max-w-2xl mx-auto mb-6">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Search for bikes or cars..."
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none"
                />
                <Button variant="primary" size="lg" className="whitespace-nowrap">
                  🔍 Search
                </Button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/buy">
                <Button variant="primary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                  Browse Vehicles
                </Button>
              </Link>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                  💬 Contact on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚗</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                Browse through our extensive collection of bikes and cars
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Best Prices</h3>
              <p className="text-gray-600">
                Get the best deals on quality vehicles
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Trusted Platform</h3>
              <p className="text-gray-600">
                35k+ followers trust us for their vehicle needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Sell Your Vehicle?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Get the best price for your bike or car. We'll contact you within 24 hours!
          </p>
          <Link href="/sell-to-us">
            <Button variant="primary" size="lg">
              💵 Sell to Us Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
EOF

echo "All files created successfully!"
