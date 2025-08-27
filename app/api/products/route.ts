import { NextRequest, NextResponse } from 'next/server';
import { shopifyProducts } from '@/lib/shopify-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const first = parseInt(searchParams.get('first') || '20');
    const after = searchParams.get('after') || undefined;
    const query = searchParams.get('query');

    let response;

    if (query) {
      // Search products
      response = await shopifyProducts.search(query, first, after);
    } else {
      // Get all products
      response = await shopifyProducts.getAll(first, after);
    }

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
