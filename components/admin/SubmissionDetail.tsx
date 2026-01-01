'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  ShoppingCart,
  X,
  Eye,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

interface Submission {
  _id: string;
  referenceNumber: string;
  name: string;
  email?: string;
  phone: string;
  city: string;
  state: string;
  category: 'bike' | 'car';
  brand: string;
  vehicleModel: string;
  year: number;
  kilometers: number;
  fuelType: string;
  transmission: string;
  color: string;
  owners: number;
  images: string[];
  expectedPrice: number;
  description?: string;
  status: 'pending' | 'contacted' | 'approved' | 'rejected' | 'purchased';
  adminNotes?: string;
  createdAt: string;
}

interface PurchaseFormData {
  purchasePrice: string;
  sellingPrice: string;
  availableForRent: boolean;
  rentalPricePerDay: string;
  additionalNotes: string;
}

export default function SubmissionDetail({ submissionId }: { submissionId: string }) {
  const router = useRouter();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<PurchaseFormData>({
    purchasePrice: '',
    sellingPrice: '',
    availableForRent: false,
    rentalPricePerDay: '',
    additionalNotes: '',
  });

  useEffect(() => {
    fetchSubmission();
  }, [submissionId]);

  useEffect(() => {
    // Pre-fill selling price suggestion when purchase price changes
    if (formData.purchasePrice && !formData.sellingPrice) {
      const purchase = parseFloat(formData.purchasePrice);
      if (!isNaN(purchase)) {
        // Suggest 20% profit margin
        const suggested = Math.round(purchase * 1.2);
        setFormData(prev => ({ ...prev, sellingPrice: suggested.toString() }));
      }
    }
  }, [formData.purchasePrice]);

  const fetchSubmission = async () => {
    try {
      const response = await fetch(`/api/submissions/${submissionId}`);
      if (response.ok) {
        const data = await response.json();
        setSubmission(data);
        // Pre-fill expected price as starting point
        setFormData(prev => ({
          ...prev,
          purchasePrice: data.expectedPrice.toString(),
        }));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching submission:', error);
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!submission) return;
    const message = encodeURIComponent(
      `Hi ${submission.name}, regarding your ${submission.brand} ${submission.vehicleModel} ${submission.year} submission (Ref: ${submission.referenceNumber}). Expected: ₹${submission.expectedPrice.toLocaleString('en-IN')}`
    );
    window.open(`https://wa.me/91${submission.phone}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    if (!submission) return;
    window.open(`tel:+91${submission.phone}`, '_self');
  };

  const calculateProfit = () => {
    const purchase = parseFloat(formData.purchasePrice) || 0;
    const selling = parseFloat(formData.sellingPrice) || 0;
    return selling - purchase;
  };

  const calculateProfitPercentage = () => {
    const purchase = parseFloat(formData.purchasePrice) || 0;
    if (purchase === 0) return 0;
    const profit = calculateProfit();
    return ((profit / purchase) * 100).toFixed(1);
  };

  const handlePurchase = async () => {
    if (!submission) return;

    const purchasePrice = parseFloat(formData.purchasePrice);
    const sellingPrice = parseFloat(formData.sellingPrice);

    if (!purchasePrice || purchasePrice <= 0) {
      alert('Please enter a valid purchase price');
      return;
    }

    if (!sellingPrice || sellingPrice <= 0) {
      alert('Please enter a valid selling price');
      return;
    }

    if (sellingPrice <= purchasePrice) {
      const confirm = window.confirm(
        'Selling price is not higher than purchase price. This will result in zero or negative profit. Continue anyway?'
      );
      if (!confirm) return;
    }

    setPurchasing(true);

    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purchasePrice,
          sellingPrice,
          availableForRent: formData.availableForRent,
          rentalPricePerDay: formData.availableForRent ? parseFloat(formData.rentalPricePerDay) || 0 : 0,
          additionalNotes: formData.additionalNotes,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ Vehicle added to inventory successfully!\nProfit: ₹${calculateProfit().toLocaleString('en-IN')}`);
        router.push(`/admin/inventory/edit/${result.vehicleId}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to purchase vehicle'}`);
      }
    } catch (error) {
      console.error('Error purchasing vehicle:', error);
      alert('Failed to purchase vehicle. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      const response = await fetch(`/api/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchSubmission();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submission...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission not found</h2>
          <Button variant="primary" onClick={() => router.push('/admin/requests')}>
            Back to Requests
          </Button>
        </div>
      </div>
    );
  }

  const profit = calculateProfit();
  const profitPercentage = calculateProfitPercentage();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin/requests')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {submission.brand} {submission.vehicleModel} {submission.year}
                </h1>
                <p className="text-sm text-gray-600">Ref: {submission.referenceNumber}</p>
              </div>
            </div>
            {submission.status !== 'purchased' && (
              <Button
                variant="primary"
                onClick={() => setShowPurchaseForm(true)}
                icon={<ShoppingCart className="w-5 h-5" />}
              >
                I Want to Buy
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Images */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Vehicle Images</h2>
            <div className="grid grid-cols-2 gap-4">
              {submission.images.map((image, index) => (
                <div
                  key={index}
                  className="relative bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image}
                    alt={`${submission.brand} ${submission.vehicleModel} - Image ${index + 1}`}
                    className="w-full h-48 object-contain bg-gray-50"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                    <Eye className="w-3 h-3 inline" /> Click to view
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Owner Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Owner Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-900">{submission.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold text-gray-900">{submission.phone}</p>
                </div>
                {submission.email && (
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{submission.email}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-gray-900">
                    {submission.city}, {submission.state}
                  </p>
                </div>
                <div className="flex gap-2 pt-3">
                  <button
                    onClick={handleWhatsApp}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </button>
                  <button
                    onClick={handleCall}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Vehicle Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Category</p>
                  <p className="font-semibold capitalize">{submission.category}</p>
                </div>
                <div>
                  <p className="text-gray-600">Brand</p>
                  <p className="font-semibold">{submission.brand}</p>
                </div>
                <div>
                  <p className="text-gray-600">Model</p>
                  <p className="font-semibold">{submission.vehicleModel}</p>
                </div>
                <div>
                  <p className="text-gray-600">Year</p>
                  <p className="font-semibold">{submission.year}</p>
                </div>
                <div>
                  <p className="text-gray-600">Kilometers</p>
                  <p className="font-semibold">{submission.kilometers.toLocaleString('en-IN')} km</p>
                </div>
                <div>
                  <p className="text-gray-600">Fuel Type</p>
                  <p className="font-semibold">{submission.fuelType}</p>
                </div>
                <div>
                  <p className="text-gray-600">Transmission</p>
                  <p className="font-semibold">{submission.transmission}</p>
                </div>
                <div>
                  <p className="text-gray-600">Color</p>
                  <p className="font-semibold">{submission.color}</p>
                </div>
                <div>
                  <p className="text-gray-600">Owners</p>
                  <p className="font-semibold">{submission.owners}</p>
                </div>
              </div>
            </div>

            {/* Expected Price */}
            <div className="bg-green-50 rounded-lg border border-green-200 p-6">
              <p className="text-sm text-gray-600 mb-1">Customer's Expected Price</p>
              <p className="text-3xl font-bold text-green-700">
                ₹{submission.expectedPrice.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                You can negotiate a different purchase price
              </p>
            </div>

            {/* Description */}
            {submission.description && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{submission.description}</p>
              </div>
            )}

            {/* Admin Notes */}
            {submission.adminNotes && (
              <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Admin Notes</h3>
                <p className="text-gray-700">{submission.adminNotes}</p>
              </div>
            )}

            {/* Status Actions */}
            {submission.status !== 'purchased' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="flex gap-2">
                  {submission.status !== 'approved' && (
                    <button
                      onClick={() => updateStatus('approved')}
                      className="flex-1 bg-green-50 text-green-700 px-4 py-2 rounded-lg font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                  )}
                  {submission.status !== 'rejected' && (
                    <button
                      onClick={() => updateStatus('rejected')}
                      className="flex-1 bg-red-50 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Purchase Form Modal */}
      {showPurchaseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Purchase Vehicle</h2>
              <button
                onClick={() => setShowPurchaseForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Pricing Section */}
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Customer Expected Price</p>
                <p className="text-2xl font-bold text-blue-700">
                  ₹{submission.expectedPrice.toLocaleString('en-IN')}
                </p>
              </div>

              <Input
                label="Purchase Price (What you'll pay after negotiation)"
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                placeholder="Enter negotiated purchase price"
                required
              />

              <Input
                label="Selling Price (What you'll list it for)"
                type="number"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                placeholder="Enter selling price"
                required
              />

              {/* Profit Preview */}
              <div className={`rounded-lg p-4 ${profit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="text-sm text-gray-600 mb-2">Estimated Profit</p>
                <p className={`text-3xl font-bold ${profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  ₹{profit.toLocaleString('en-IN')}
                  <span className="text-lg ml-2">({profitPercentage}%)</span>
                </p>
                {profit < 0 && (
                  <p className="text-sm text-red-600 mt-2">
                    ⚠️ Warning: Selling price is lower than purchase price
                  </p>
                )}
              </div>

              {/* Rental Options */}
              <div className="border-t pt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.availableForRent}
                    onChange={(e) =>
                      setFormData({ ...formData, availableForRent: e.target.checked })
                    }
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="font-semibold text-gray-900">
                    Make available for rent
                  </span>
                </label>

                {formData.availableForRent && (
                  <div className="mt-4">
                    <Input
                      label="Rental Price per Day"
                      type="number"
                      value={formData.rentalPricePerDay}
                      onChange={(e) =>
                        setFormData({ ...formData, rentalPricePerDay: e.target.value })
                      }
                      placeholder="Enter daily rental price"
                    />
                  </div>
                )}
              </div>

              {/* Additional Notes */}
              <Textarea
                label="Additional Notes (Optional)"
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                placeholder="Any additional notes about this purchase..."
                rows={3}
              />

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPurchaseForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {purchasing ? 'Processing...' : 'Purchase & Add to Inventory'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
