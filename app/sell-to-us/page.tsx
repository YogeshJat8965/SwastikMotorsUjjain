'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import MultiStepForm from '@/components/forms/MultiStepForm';
import Button from '@/components/ui/Button';

export default function SellToUsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');

  const handleSuccess = (refNumber: string) => {
    setReferenceNumber(refNumber);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-green-600" />
            </div>

            {/* Success Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Submission Successful!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for submitting your vehicle details. Our team will review your submission and contact you soon.
            </p>

            {/* Reference Number */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">Your Reference Number</p>
              <p className="text-2xl md:text-3xl font-bold text-blue-600 tracking-wide">
                {referenceNumber}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Please save this number for future reference
              </p>
            </div>

            {/* Next Steps */}
            <div className="text-left mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">What happens next?</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Review</h3>
                    <p className="text-gray-600 text-sm">
                      Our team will review your vehicle details and photos
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Contact</h3>
                    <p className="text-gray-600 text-sm">
                      We'll contact you within 24-48 hours via phone or WhatsApp
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Evaluation</h3>
                    <p className="text-gray-600 text-sm">
                      Schedule an inspection and get the best price for your vehicle
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Options */}
            <div className="border-t border-gray-200 pt-8">
              <p className="text-gray-600 mb-4">Need immediate assistance?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+918965900973"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call Us</span>
                </a>
                <a
                  href={`https://wa.me/918965900973?text=${encodeURIComponent(`Hi, I submitted my vehicle with reference number ${referenceNumber}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Return Home */}
            <div className="mt-8">
              <Link href="/">
                <Button variant="outline" className="inline-flex items-center gap-2">
                  Return to Home
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sell Your Vehicle to Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get the best price for your bike or car. Fill out the form below and our team will contact you within 24-48 hours.
          </p>
        </div>

        {/* Multi-Step Form - Shows first on mobile, after benefits on desktop */}
        <div className="md:hidden mb-12">
          <MultiStepForm onSuccess={handleSuccess} />
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Best Price Guaranteed</h3>
            <p className="text-sm text-gray-600">We offer competitive prices for your vehicle</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quick Process</h3>
            <p className="text-sm text-gray-600">Get evaluated and paid within days</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Hassle-Free</h3>
            <p className="text-sm text-gray-600">We handle all the paperwork</p>
          </div>
        </div>

        {/* Multi-Step Form - Shows after benefits on desktop */}
        <div className="hidden md:block">
          <MultiStepForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}
