import { NextRequest, NextResponse } from 'next/server';
import { shopifyProducts } from '@/lib/shopify-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const first = parseInt(searchParams.get('first') || '8');

    const products = await shopifyProducts.getFeatured(first);

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch featured products',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
