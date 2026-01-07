
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function GET() {
  try {
    // Test cloudinary configuration
    const config = cloudinary.config();
    
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      throw new Error('Cloudinary configuration is incomplete');
    }

    // Try to get account details (this verifies the credentials)
    const result = await cloudinary.api.ping();
    
    return NextResponse.json({
      success: true,
      message: 'Cloudinary connected successfully!',
      cloudName: config.cloud_name,
      status: result.status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cloudinary connection error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to connect to Cloudinary',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
