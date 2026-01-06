import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

// For simplicity, we'll use environment variables or a JSON file
// In production, you'd want to store this in a database

const DEFAULT_SETTINGS = {
  whatsappNumber: process.env.WHATSAPP_NUMBER || '+919876543210',
  instagramHandle: process.env.INSTAGRAM_HANDLE || '@swastik_bikes',
  businessName: process.env.BUSINESS_NAME || 'Swastik Motors',
  businessAddress: process.env.BUSINESS_ADDRESS || 'Ujjain, Madhya Pradesh',
  emailNotifications: true,
  smsNotifications: false,
};

// GET /api/settings - Get settings (admin only)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    // In production, fetch from database
    // For now, return default settings
    return NextResponse.json(DEFAULT_SETTINGS);
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// POST /api/settings - Update settings (admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const data = await request.json();

    // In production, save to database
    // For now, just return success
    // You could also update .env file or a JSON config file

    console.log('Settings updated:', data);

    return NextResponse.json({ 
      success: true,
      message: 'Settings updated successfully',
      settings: data,
    });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
