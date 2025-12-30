'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  CheckCircle,
  XCircle,
  Filter,
  Search,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

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
  status: 'pending' | 'contacted' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: string;
}

export default function RequestsManagement() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [activeFilter, searchQuery, submissions]);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/submissions');
      const data = await response.json();
      setSubmissions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setLoading(false);
    }
  };

  const filterSubmissions = () => {
    let filtered = submissions;

    // Filter by status
    if (activeFilter !== 'all') {
      filtered = filtered.filter((s) => s.status === activeFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredSubmissions(filtered);
  };

  const updateStatus = async (id: string, status: string, notes?: string) => {
    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes: notes }),
      });

      if (response.ok) {
        fetchSubmissions();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-orange-100 text-orange-700', label: '🟠 New' },
      contacted: { color: 'bg-blue-100 text-blue-700', label: '💬 Contacted' },
      approved: { color: 'bg-green-100 text-green-700', label: '✅ Approved' },
      rejected: { color: 'bg-red-100 text-red-700', label: '❌ Rejected' },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleWhatsApp = (submission: Submission) => {
    const message = encodeURIComponent(
      `Hi ${submission.name}, regarding your ${submission.brand} ${submission.vehicleModel} ${submission.year} submission (Ref: ${submission.referenceNumber}). Expected: ₹${submission.expectedPrice.toLocaleString('en-IN')}`
    );
    window.open(`https://wa.me/91${submission.phone}?text=${message}`, '_blank');
  };

  const handleCall = (phone: string) => {
    window.open(`tel:+91${phone}`, '_self');
  };

  const filters = [
    { key: 'all', label: 'All', count: submissions.length },
    { key: 'pending', label: 'New', count: submissions.filter((s) => s.status === 'pending').length },
    { key: 'contacted', label: 'Contacted', count: submissions.filter((s) => s.status === 'contacted').length },
    { key: 'approved', label: 'Approved', count: submissions.filter((s) => s.status === 'approved').length },
    { key: 'rejected', label: 'Rejected', count: submissions.filter((s) => s.status === 'rejected').length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sell Requests</h1>
                <p className="text-sm text-gray-600">{filteredSubmissions.length} total requests</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <Input
              placeholder="Search by name, brand, model, or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5 text-gray-400" />}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                  activeFilter === filter.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredSubmissions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No submissions found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try adjusting your search' : 'No submissions match the selected filter'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSubmissions.map((submission) => (
              <div
                key={submission._id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  {submission.images[0] ? (
                    <img
                      src={submission.images[0]}
                      alt={`${submission.brand} ${submission.vehicleModel}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-3 right-3">{getStatusBadge(submission.status)}</div>
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {submission.referenceNumber}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {submission.brand} {submission.vehicleModel} {submission.year}
                  </h3>

                  {/* Owner Info */}
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <p className="font-semibold text-gray-900">{submission.name}</p>
                    <p className="text-sm text-gray-600">
                      📞 {submission.phone} {submission.email && `• ✉️ ${submission.email}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      📍 {submission.city}, {submission.state}
                    </p>
                  </div>

                  {/* Vehicle Details */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <span className="text-gray-600">Category:</span>
                      <span className="ml-2 font-medium capitalize">{submission.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Kilometers:</span>
                      <span className="ml-2 font-medium">{submission.kilometers.toLocaleString('en-IN')} km</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Fuel:</span>
                      <span className="ml-2 font-medium">{submission.fuelType}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Transmission:</span>
                      <span className="ml-2 font-medium">{submission.transmission}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Color:</span>
                      <span className="ml-2 font-medium">{submission.color}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Owners:</span>
                      <span className="ml-2 font-medium">{submission.owners}</span>
                    </div>
                  </div>

                  {/* Expected Price */}
                  <div className="bg-green-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-600 mb-1">Expected Price</p>
                    <p className="text-2xl font-bold text-green-700">
                      ₹{submission.expectedPrice.toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Description */}
                  {submission.description && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-2">{submission.description}</p>
                    </div>
                  )}

                  {/* Admin Notes */}
                  {submission.adminNotes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className="text-sm font-medium text-yellow-800 mb-1">Admin Notes:</p>
                      <p className="text-sm text-yellow-700">{submission.adminNotes}</p>
                    </div>
                  )}

                  {/* Submitted Date */}
                  <p className="text-xs text-gray-500 mb-4">
                    Submitted: {new Date(submission.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleWhatsApp(submission)}
                      className="flex-1 min-w-[120px] bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </button>
                    <button
                      onClick={() => handleCall(submission.phone)}
                      className="flex-1 min-w-[120px] bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                  </div>

                  <div className="flex gap-2 mt-2">
                    {submission.status !== 'approved' && (
                      <button
                        onClick={() => updateStatus(submission._id, 'approved')}
                        className="flex-1 bg-green-50 text-green-700 px-4 py-2 rounded-lg font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                    )}
                    {submission.status !== 'rejected' && (
                      <button
                        onClick={() => updateStatus(submission._id, 'rejected')}
                        className="flex-1 bg-red-50 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
