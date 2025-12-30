'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import Button from '../ui/Button';

interface StickyActionBarProps {
  title: string;
  price: number;
  whatsappLink: string;
}

export default function StickyActionBar({
  title,
  price,
  whatsappLink,
}: StickyActionBarProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    // Try native share first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this ${title} for ₹${price.toLocaleString('en-IN')}`,
          url: url,
        });
        return;
      } catch (err) {
        // User cancelled or error - fall back to copy
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      {/* Desktop Action Bar - Not sticky */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">Price</div>
            <div className="text-2xl lg:text-3xl font-bold text-green-600">
              ₹{price.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2 text-base lg:text-lg py-3 lg:py-4">
                <svg className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>Chat on WhatsApp</span>
              </Button>
            </a>
            <Button
              variant="outline"
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 py-3"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Action Bar - Positioned above BottomNav */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg z-40">
        <div className="flex items-center gap-2">
          <div className="min-w-0">
            <div className="text-xs text-gray-500 mb-0.5">Price</div>
            <div className="text-lg font-bold text-green-600 whitespace-nowrap">
              ₹{price.toLocaleString('en-IN')}
            </div>
          </div>
          <button
            onClick={handleShare}
            className="flex flex-col items-center justify-center px-3 py-2 rounded-lg border border-blue-500 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 flex-shrink-0 min-w-[60px]"
            aria-label="Share"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-green-600 mb-0.5" />
                <span className="text-xs text-green-600 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5 text-blue-600 mb-0.5" />
                <span className="text-xs text-blue-600 font-medium">Share</span>
              </>
            )}
          </button>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-0"
          >
            <Button className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-1.5 text-sm py-3">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span className="truncate">WhatsApp</span>
            </Button>
          </a>
        </div>
      </div>

      {/* Spacer for mobile to prevent content being hidden behind sticky bars */}
      <div className="md:hidden h-32" />
    </>
  );
}
