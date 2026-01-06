import Link from 'next/link';
import { Instagram, MessageCircle, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Swastik Motors</h3>
            <p className="text-gray-400 text-sm">
              Your trusted partner for buying, selling, and renting bikes & cars.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Instagram className="w-4 h-4 text-primary-400" />
                <span>35,000+ Instagram Followers</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MessageCircle className="w-4 h-4 text-primary-400" />
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
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: +91 {process.env.NEXT_PUBLIC_ADMIN_WHATSAPP?.slice(2) || '8965900973'}</span>
              </li>
              <li>
                <a 
                  href={`https://instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || 'yogeshjat100'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram: @{process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || 'yogeshjat100'}</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>Email: info@swastikbikes.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Swastik Motors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
