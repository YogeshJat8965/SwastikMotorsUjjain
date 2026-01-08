import Link from 'next/link';
import { Instagram, MessageCircle, Mail, Phone, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white" style={{ marginTop: '-1px', paddingTop: 0, display: 'block' }}>
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
                <Instagram className="w-4 h-4 text-purple-400" />
                <span>37,000+ Instagram Followers</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MessageCircle className="w-4 h-4 text-green-400" />
                <span>8,000+ WhatsApp Members</span>
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
                <span>WhatsApp: +91 {process.env.NEXT_PUBLIC_ADMIN_WHATSAPP?.slice(2) || '7089311939'}</span>
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

        {/* Developer Credit */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="text-center">
              <p className="text-sm text-gray-400">
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-semibold">
                  Designed & developed by Yogesh Jat
                </span>
              </p>
            </div>
            <a
              href="https://wa.me/918965900973?text=Hi%20Yogesh%2C%20I%20came%20across%20your%20work%20on%20the%20Swastik%20Motors%20website%20and%20I%27m%20impressed!%20I%27d%20like%20to%20discuss%20a%20web%20development%20project%20with%20you."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-medium rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/50"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact on WhatsApp →</span>
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Swastik Motors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
