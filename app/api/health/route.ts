export const runtime = "edge";

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    mongodbConfigured: !!process.env.MONGODB_URI,
  };

  try {
    await connectDB();
    return NextResponse.json({
      ...health,
      database: 'connected',
    });
  } catch (error: any) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      ...health,
      database: 'disconnected',
      error: error.message,
    }, { status: 500 });
  }
}
