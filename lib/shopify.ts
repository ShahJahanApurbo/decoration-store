// Shopify configuration for Next.js with Hydrogen React
export const shopifyConfig = {
  domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2025-04',
};

// Helper function to get the Storefront API URL
export const getStorefrontApiUrl = () => {
  return `https://${shopifyConfig.domain}/api/${shopifyConfig.apiVersion}/graphql.json`;
};

// Validate configuration
if (!shopifyConfig.domain) {
  throw new Error('Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN environment variable');
}

if (!shopifyConfig.storefrontAccessToken) {
  throw new Error('Missing NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable');
}

export const isShopifyConfigured = Boolean(
  shopifyConfig.domain && shopifyConfig.storefrontAccessToken
);

// TypeScript types for Shopify data
export interface ShopifyImage {
  id: string;
  url: string;
  altText?: string;
  width: number;
  height: number;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney;
  availableForSale: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  options?: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyProductVariant;
    }>;
  };
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: ShopifyImage;
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}


