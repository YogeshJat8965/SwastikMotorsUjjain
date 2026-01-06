import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SoldVehicle from '@/models/SoldVehicle';
import { validateAdminSession } from '@/lib/auth';

// GET - Fetch all sold vehicles for admin
export async function GET(req: NextRequest) {
  try {
    const isAdmin = await validateAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const soldVehicles = await SoldVehicle.find().sort({ soldDate: -1 });

    return NextResponse.json({
      success: true,
      soldVehicles,
    });
  } catch (error: any) {
    console.error('Error fetching sold vehicles:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sold vehicles' },
      { status: 500 }
    );
  }
}

// POST - Create new sold vehicle entry
export async function POST(req: NextRequest) {
  try {
    const isAdmin = await validateAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { vehicleName, vehicleType, customerName, image, soldDate, testimonial, price, featured } = body;

    // Validation
    if (!vehicleName || !image) {
      return NextResponse.json(
        { error: 'Vehicle name and image are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const soldVehicle = await SoldVehicle.create({
      vehicleName,
      vehicleType: vehicleType || 'bike',
      customerName,
      image,
      soldDate: soldDate || new Date(),
      testimonial,
      price,
      featured: featured || false,
    });

    return NextResponse.json({
      success: true,
      soldVehicle,
      message: 'Sold vehicle entry created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating sold vehicle:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create sold vehicle entry' },
      { status: 500 }
    );
  }
}
