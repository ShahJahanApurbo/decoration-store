import { NextRequest, NextResponse } from 'next/server';
import { shopifyConfig } from '@/lib/shopify';

const FEATURED_PRODUCTS_QUERY = `
  query getFeaturedProducts($first: Int!) {
    products(first: $first, sortKey: BEST_SELLING, reverse: true) {
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
    }
  }
`;

async function shopifyFetch(query: string, variables: any = {}) {
  const response = await fetch(`https://${shopifyConfig.domain}/api/2025-04/graphql.json`, {
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const first = parseInt(searchParams.get('first') || '8');

    const data = await shopifyFetch(FEATURED_PRODUCTS_QUERY, { first });

    return NextResponse.json({
      success: true,
      data: data.products.edges.map((edge: any) => edge.node),
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
