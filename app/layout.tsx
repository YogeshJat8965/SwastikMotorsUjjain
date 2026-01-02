import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import NavigationProgress from "@/components/ui/NavigationProgress";
import { Suspense } from "react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: "Swastik Bikes - Buy, Sell & Rent Bikes & Cars | 35k+ Instagram Followers",
  description: "Your trusted partner for buying, selling, and renting bikes & cars. 35k+ Instagram followers, 3k+ WhatsApp members. Best prices on quality vehicles in India.",
  keywords: "bikes, cars, buy bikes, sell bikes, rent bikes, used bikes, used cars, second hand bikes, second hand cars, bike rental, car rental, swastik bikes, vehicle marketplace",
  authors: [{ name: "Swastik Bikes" }],
  creator: "Swastik Bikes",
  publisher: "Swastik Bikes",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'Swastik Bikes',
    title: 'Swastik Bikes - Buy, Sell & Rent Bikes & Cars',
    description: 'Your trusted partner for buying, selling, and renting bikes & cars. 35k+ Instagram followers, 3k+ WhatsApp members.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Swastik Bikes - Vehicle Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Swastik Bikes - Buy, Sell & Rent Bikes & Cars',
    description: 'Your trusted partner for buying, selling, and renting bikes & cars. 35k+ Instagram followers.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
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
