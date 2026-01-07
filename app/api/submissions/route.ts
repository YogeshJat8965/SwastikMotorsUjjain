
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';
import { submissionSchema } from '@/lib/validation/submissionSchema';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate with Zod
    const validatedData = submissionSchema.parse(body);

    // Generate reference number
    const referenceNumber = `SB${Date.now().toString().slice(-8)}`;

    // Create submission
    const submission = await Submission.create({
      ...validatedData,
      referenceNumber,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      referenceNumber: submission.referenceNumber,
      message: 'Your submission has been received successfully!',
    });
  } catch (error) {
    console.error('Submission error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    // Get all submissions (admin only - should add auth later)
    const submissions = await Submission.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Get submissions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
