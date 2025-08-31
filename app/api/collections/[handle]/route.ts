import { NextRequest, NextResponse } from 'next/server';
import { shopifyConfig, getStorefrontApiUrl } from '@/lib/shopify';

const COLLECTION_QUERY = `
  query getCollection($handle: String!, $first: Int!, $after: String) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      updatedAt
      image {
        id
        url
        altText
        width
        height
      }
      products(first: $first, after: $after) {
        edges {
          node {
            id
            title
            handle
            description
            tags
            vendor
            productType
            createdAt
            updatedAt
            availableForSale
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 3) {
              edges {
                node {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 5) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

async function shopifyFetch(query: string, variables: any = {}) {
  const response = await fetch(getStorefrontApiUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': shopifyConfig.storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors.map((e: any) => e.message).join(', '));
  }

  return result.data;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
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

    const data = await shopifyFetch(COLLECTION_QUERY, { handle, first, after });

    if (!data.collection) {
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
      data: data.collection,
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
