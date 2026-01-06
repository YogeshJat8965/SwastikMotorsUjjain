'use client';

import { useState, useEffect } from 'react';
import { Star, Plus, Edit2, Trash2, Check, X, Loader2, Eye, EyeOff, MoveUp, MoveDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Card from '@/components/ui/Card';

interface Review {
  _id: string;
  customerName: string;
  vehicleName: string;
  testimonial: string;
  rating: number;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    vehicleName: '',
    testimonial: '',
    rating: 5,
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      alert('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId 
        ? { id: editingId, ...formData }
        : formData;

      const res = await fetch('/api/reviews', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      
      if (data.success) {
        alert(data.message);
        fetchReviews();
        resetForm();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error saving review:', error);
      alert('Failed to save review');
    }
  };

  const handleEdit = (review: Review) => {
    setEditingId(review._id);
    setFormData({
      customerName: review.customerName,
      vehicleName: review.vehicleName,
      testimonial: review.testimonial,
      rating: review.rating,
      isActive: review.isActive,
      order: review.order,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const res = await fetch(`/api/reviews?id=${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      
      if (data.success) {
        alert(data.message);
        fetchReviews();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const toggleActive = async (review: Review) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: review._id,
          isActive: !review.isActive,
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        fetchReviews();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
      alert('Failed to update review');
    }
  };

  const moveReview = async (review: Review, direction: 'up' | 'down') => {
    const newOrder = direction === 'up' ? review.order - 1 : review.order + 1;
    
    try {
      const res = await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: review._id,
          order: newOrder,
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        fetchReviews();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order');
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      vehicleName: '',
      testimonial: '',
      rating: 5,
      isActive: true,
      order: 0,
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Customer Reviews Management</h1>
          <p className="text-gray-600">Manage reviews displayed on Success Stories page</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          variant="primary"
          size="md"
        >
          {showAddForm ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {showAddForm ? 'Cancel' : 'Add Review'}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? 'Edit Review' : 'Add New Review'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Customer Name"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                required
                placeholder="John Doe"
              />
              <Input
                label="Vehicle Name"
                value={formData.vehicleName}
                onChange={(e) => setFormData({ ...formData, vehicleName: e.target.value })}
                required
                placeholder="Honda Activa 125"
              />
            </div>
            
            <Textarea
              label="Testimonial"
              value={formData.testimonial}
              onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
              required
              placeholder="Share the customer's experience..."
              rows={4}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[5, 4, 3, 2, 1].map(num => (
                    <option key={num} value={num}>{num} Stars</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" variant="primary" size="md">
                <Check className="w-5 h-5 mr-2" />
                {editingId ? 'Update Review' : 'Create Review'}
              </Button>
              {editingId && (
                <Button type="button" onClick={resetForm} variant="outline" size="md">
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold mb-4">
          All Reviews ({reviews.length})
        </h2>
        
        {reviews.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No reviews yet. Add your first review!</p>
          </Card>
        ) : (
          reviews.map((review, index) => (
            <Card key={review._id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">{review.customerName}</h3>
                    <span className="text-sm text-gray-500">• {review.vehicleName}</span>
                    {!review.isActive && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                        Inactive
                      </span>
                    )}
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                      Order: {review.order}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 mb-3 italic">"{review.testimonial}"</p>
                  
                  <p className="text-xs text-gray-500">
                    Created: {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => toggleActive(review)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title={review.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {review.isActive ? (
                      <Eye className="w-5 h-5 text-green-600" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => moveReview(review, 'up')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Move Up"
                    disabled={index === 0}
                  >
                    <MoveUp className={`w-5 h-5 ${index === 0 ? 'text-gray-300' : 'text-blue-600'}`} />
                  </button>
                  
                  <button
                    onClick={() => moveReview(review, 'down')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Move Down"
                    disabled={index === reviews.length - 1}
                  >
                    <MoveDown className={`w-5 h-5 ${index === reviews.length - 1 ? 'text-gray-300' : 'text-blue-600'}`} />
                  </button>

                  <button
                    onClick={() => handleEdit(review)}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5 text-blue-600" />
                  </button>

                  <button
                    onClick={() => handleDelete(review._id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
