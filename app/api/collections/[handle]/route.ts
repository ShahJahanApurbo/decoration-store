import { NextRequest, NextResponse } from 'next/server';
import { shopifyCollections } from '@/lib/shopify-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    const { handle } = params;
    const { searchParams } = new URL(request.url);
    const first = parseInt(searchParams.get('first') || '20');
    const after = searchParams.get('after') || undefined;

    if (!handle) {
      return NextResponse.json(
        {
          success: false,
          error: 'Collection handle is required',
        },
        { status: 400 }
      );
    }

    const collection = await shopifyCollections.getByHandle(handle, first, after);

    if (!collection) {
      return NextResponse.json(
        {
          success: false,
          error: 'Collection not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: collection,
    });
  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch collection',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
