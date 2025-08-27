import { storefrontClient, type ShopifyProduct, type ShopifyCollection } from './shopify';
import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_COLLECTIONS_QUERY,
  GET_COLLECTION_BY_HANDLE_QUERY,
  SEARCH_PRODUCTS_QUERY,
  GET_FEATURED_PRODUCTS_QUERY,
  GET_PRODUCT_RECOMMENDATIONS_QUERY,
} from './shopify-queries';

// Type definitions for API responses
interface StorefrontError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: string[];
}

interface StorefrontResponse<T> {
  data?: T;
  errors?: StorefrontError[];
  extensions?: Record<string, any>;
}

interface ProductsResponse {
  products: {
    edges: Array<{
      cursor: string;
      node: ShopifyProduct;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
}

interface CollectionsResponse {
  collections: {
    edges: Array<{
      cursor: string;
      node: ShopifyCollection;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
}

interface SingleProductResponse {
  product: ShopifyProduct | null;
}

interface SingleCollectionResponse {
  collection: ShopifyCollection | null;
}

interface ProductRecommendationsResponse {
  productRecommendations: ShopifyProduct[];
}

// Error handling function
const handleShopifyError = (error: any) => {
  console.error('Shopify API Error:', error);
  throw new Error(`Shopify API Error: ${error.message || 'Unknown error'}`);
};

// Generic function to make Shopify requests
const makeShopifyRequest = async <T>(
  query: string,
  variables: Record<string, any> = {}
): Promise<T> => {
  if (!storefrontClient) {
    throw new Error('Shopify client is not configured. Please check your environment variables.');
  }

  try {
    const response = await storefrontClient.request<T>(query, { variables });
    
    if (response.errors) {
      const errorArray = Array.isArray(response.errors) ? response.errors : [response.errors];
      if (errorArray.length > 0) {
        handleShopifyError(errorArray[0]);
      }
    }

    if (!response.data) {
      throw new Error('No data received from Shopify API');
    }

    return response.data;
  } catch (error) {
    handleShopifyError(error);
    throw error;
  }
};

// Products API
export const shopifyProducts = {
  // Get all products with pagination
  getAll: async (first: number = 20, after?: string): Promise<ProductsResponse> => {
    return makeShopifyRequest<ProductsResponse>(GET_PRODUCTS_QUERY, {
      first,
      after,
    });
  },

  // Get a single product by handle
  getByHandle: async (handle: string): Promise<ShopifyProduct | null> => {
    const response = await makeShopifyRequest<SingleProductResponse>(
      GET_PRODUCT_BY_HANDLE_QUERY,
      { handle }
    );
    return response.product;
  },

  // Search products
  search: async (
    query: string,
    first: number = 20,
    after?: string
  ): Promise<ProductsResponse> => {
    return makeShopifyRequest<ProductsResponse>(SEARCH_PRODUCTS_QUERY, {
      query,
      first,
      after,
    });
  },

  // Get featured products
  getFeatured: async (first: number = 8): Promise<ShopifyProduct[]> => {
    const response = await makeShopifyRequest<ProductsResponse>(
      GET_FEATURED_PRODUCTS_QUERY,
      { first }
    );
    return response.products.edges.map((edge) => edge.node);
  },

  // Get product recommendations
  getRecommendations: async (productId: string): Promise<ShopifyProduct[]> => {
    const response = await makeShopifyRequest<ProductRecommendationsResponse>(
      GET_PRODUCT_RECOMMENDATIONS_QUERY,
      { productId }
    );
    return response.productRecommendations;
  },
};

// Collections API
export const shopifyCollections = {
  // Get all collections with pagination
  getAll: async (first: number = 20, after?: string): Promise<CollectionsResponse> => {
    return makeShopifyRequest<CollectionsResponse>(GET_COLLECTIONS_QUERY, {
      first,
      after,
    });
  },

  // Get a single collection by handle
  getByHandle: async (
    handle: string,
    first: number = 20,
    after?: string
  ): Promise<ShopifyCollection | null> => {
    const response = await makeShopifyRequest<SingleCollectionResponse>(
      GET_COLLECTION_BY_HANDLE_QUERY,
      { handle, first, after }
    );
    return response.collection;
  },

  // Get collection products
  getProducts: async (
    handle: string,
    first: number = 20,
    after?: string
  ): Promise<ShopifyProduct[]> => {
    const collection = await shopifyCollections.getByHandle(handle, first, after);
    return collection?.products.edges.map((edge) => edge.node) || [];
  },
};

// Utility functions
export const shopifyUtils = {
  // Check if Shopify is configured
  isConfigured: (): boolean => {
    return !!storefrontClient;
  },

  // Get product image URLs
  getProductImages: (product: ShopifyProduct): string[] => {
    return product.images.edges.map((edge) => edge.node.url);
  },

  // Get product main image
  getProductMainImage: (product: ShopifyProduct): string | null => {
    const images = shopifyUtils.getProductImages(product);
    return images.length > 0 ? images[0] : null;
  },

  // Get product price
  getProductPrice: (product: ShopifyProduct): { amount: string; currencyCode: string } => {
    return product.priceRange.minVariantPrice;
  },

  // Check if product is on sale
  isProductOnSale: (product: ShopifyProduct): boolean => {
    return product.variants.edges.some((edge) => 
      edge.node.compareAtPrice && 
      parseFloat(edge.node.compareAtPrice.amount) > parseFloat(edge.node.price.amount)
    );
  },

  // Get collection image URL
  getCollectionImage: (collection: ShopifyCollection): string | null => {
    return collection.image?.url || null;
  },

  // Transform Shopify product for component use
  transformProduct: (product: ShopifyProduct) => ({
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    price: shopifyUtils.getProductPrice(product),
    image: shopifyUtils.getProductMainImage(product),
    images: shopifyUtils.getProductImages(product),
    vendor: product.vendor,
    productType: product.productType,
    tags: product.tags,
    availableForSale: product.availableForSale,
    isOnSale: shopifyUtils.isProductOnSale(product),
  }),

  // Transform Shopify collection for component use
  transformCollection: (collection: ShopifyCollection) => ({
    id: collection.id,
    title: collection.title,
    handle: collection.handle,
    description: collection.description,
    image: shopifyUtils.getCollectionImage(collection),
    productCount: collection.products.edges.length,
    products: collection.products.edges.map((edge) => 
      shopifyUtils.transformProduct(edge.node)
    ),
  }),
};

// Default export with all APIs
export default {
  products: shopifyProducts,
  collections: shopifyCollections,
  utils: shopifyUtils,
};
