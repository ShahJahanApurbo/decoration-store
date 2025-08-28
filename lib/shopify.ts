import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { createAdminApiClient } from '@shopify/admin-api-client';

// Validate required environment variables
const requiredEnvVars = {
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2025-01',
};

// Check if all required environment variables are present
const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.warn(`Missing Shopify environment variables: ${missingVars.join(', ')}`);
}

// Shopify Storefront API Client (for public data)
export const storefrontClient = requiredEnvVars.storeDomain && requiredEnvVars.storefrontAccessToken
  ? createStorefrontApiClient({
      storeDomain: requiredEnvVars.storeDomain,
      apiVersion: requiredEnvVars.apiVersion,
      publicAccessToken: requiredEnvVars.storefrontAccessToken,
    })
  : null;

// Shopify Admin API Client (for private/admin data - server-side only)
export const adminClient = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
  ? createAdminApiClient({
      storeDomain: requiredEnvVars.storeDomain || '',
      apiVersion: requiredEnvVars.apiVersion,
      accessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
    })
  : null;

// Shopify configuration object
export const shopifyConfig = {
  storeDomain: requiredEnvVars.storeDomain,
  apiVersion: requiredEnvVars.apiVersion,
  isConfigured: !!requiredEnvVars.storeDomain && !!requiredEnvVars.storefrontAccessToken,
};

// Type definitions for Shopify responses
export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: {
    edges: Array<{
      node: {
        id: string;
        url: string;
        altText?: string;
        width: number;
        height: number;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        compareAtPrice?: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        selectedOptions?: Array<{
          name: string;
          value: string;
        }>;
        image?: {
          id: string;
          url: string;
          altText?: string;
        };
      };
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  options?: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image?: {
    id: string;
    url: string;
    altText?: string;
    width: number;
    height: number;
  };
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

// Helper function to format price
export const formatPrice = (amount: string, currencyCode: string = 'USD'): string => {
  const numericAmount = parseFloat(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(numericAmount);
};

// Helper function to get image URL with transformations
export const getOptimizedImageUrl = (
  url: string,
  options: {
    width?: number;
    height?: number;
    crop?: 'center' | 'top' | 'bottom' | 'left' | 'right';
    scale?: number;
  } = {}
): string => {
  if (!url) return '';
  
  const { width, height, crop = 'center', scale = 1 } = options;
  const urlObj = new URL(url);
  
  if (width) urlObj.searchParams.set('width', (width * scale).toString());
  if (height) urlObj.searchParams.set('height', (height * scale).toString());
  if (crop) urlObj.searchParams.set('crop', crop);
  
  return urlObj.toString();
};
