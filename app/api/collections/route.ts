import { NextRequest, NextResponse } from 'next/server';
import { shopifyCollections } from '@/lib/shopify-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const first = parseInt(searchParams.get('first') || '20');
    const after = searchParams.get('after') || undefined;

    const response = await shopifyCollections.getAll(first, after);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch collections',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
