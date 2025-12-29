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
