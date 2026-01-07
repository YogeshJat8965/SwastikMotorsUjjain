
import { NextRequest, NextResponse } from 'next/server';
import { getAvailableBrands } from '@/lib/queries/vehicleQueries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as 'bike' | 'car' | undefined;

    const brands = await getAvailableBrands(category);

    return NextResponse.json({ brands }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands', message: error.message },
      { status: 500 }
    );
  }
}
