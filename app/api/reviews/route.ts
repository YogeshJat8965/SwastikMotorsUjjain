export const runtime = "edge";

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';

export const dynamic = 'force-dynamic';

// GET - Fetch all reviews or active reviews only
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    
    const query = activeOnly ? { isActive: true } : {};
    const reviews = await Review.find(query)
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    return NextResponse.json({ 
      success: true, 
      reviews,
      count: reviews.length 
    });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - Create a new review
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { customerName, vehicleName, testimonial, rating, isActive, order } = body;
    
    // Validation
    if (!customerName || !vehicleName || !testimonial) {
      return NextResponse.json(
        { success: false, error: 'Customer name, vehicle name, and testimonial are required' },
        { status: 400 }
      );
    }
    
    const review = await Review.create({
      customerName,
      vehicleName,
      testimonial,
      rating: rating || 5,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
    });
    
    return NextResponse.json({ 
      success: true, 
      review,
      message: 'Review created successfully' 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create review' },
      { status: 500 }
    );
  }
}

// PUT - Update a review
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { id, customerName, vehicleName, testimonial, rating, isActive, order } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Review ID is required' },
        { status: 400 }
      );
    }
    
    const updateData: any = {};
    if (customerName !== undefined) updateData.customerName = customerName;
    if (vehicleName !== undefined) updateData.vehicleName = vehicleName;
    if (testimonial !== undefined) updateData.testimonial = testimonial;
    if (rating !== undefined) updateData.rating = rating;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (order !== undefined) updateData.order = order;
    
    const review = await Review.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      review,
      message: 'Review updated successfully' 
    });
  } catch (error: any) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a review
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Review ID is required' },
        { status: 400 }
      );
    }
    
    const review = await Review.findByIdAndDelete(id);
    
    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Review deleted successfully' 
    });
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete review' },
      { status: 500 }
    );
  }
}
