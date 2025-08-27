import { useState, useEffect } from 'react';
import { shopifyProducts, shopifyCollections, shopifyUtils } from '@/lib/shopify-api';
import type { ShopifyProduct, ShopifyCollection } from '@/lib/shopify';

// Hook for fetching products
export function useProducts(first: number = 20) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);

  const fetchProducts = async (after?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await shopifyProducts.getAll(first, after);
      
      if (after) {
        // Load more products (append to existing)
        setProducts(prev => [...prev, ...response.products.edges.map(edge => edge.node)]);
      } else {
        // Initial load or refresh
        setProducts(response.products.edges.map(edge => edge.node));
      }
      
      setHasNextPage(response.products.pageInfo.hasNextPage);
      setEndCursor(response.products.pageInfo.endCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasNextPage && endCursor && !loading) {
      fetchProducts(endCursor);
    }
  };

  useEffect(() => {
    if (shopifyUtils.isConfigured()) {
      fetchProducts();
    } else {
      setError('Shopify is not configured');
      setLoading(false);
    }
  }, [first]);

  return {
    products,
    loading,
    error,
    hasNextPage,
    loadMore,
    refetch: () => fetchProducts(),
  };
}

// Hook for fetching a single product
export function useProduct(handle: string) {
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!handle) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const productData = await shopifyProducts.getByHandle(handle);
        setProduct(productData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (shopifyUtils.isConfigured()) {
      fetchProduct();
    } else {
      setError('Shopify is not configured');
      setLoading(false);
    }
  }, [handle]);

  return { product, loading, error };
}

// Hook for searching products
export function useProductSearch() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');

  const searchProducts = async (query: string, first: number = 20, after?: string) => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (query !== currentQuery) {
        setCurrentQuery(query);
      }
      
      const response = await shopifyProducts.search(query, first, after);
      
      if (after && query === currentQuery) {
        // Load more results for the same query
        setProducts(prev => [...prev, ...response.products.edges.map(edge => edge.node)]);
      } else {
        // New search or initial load
        setProducts(response.products.edges.map(edge => edge.node));
      }
      
      setHasNextPage(response.products.pageInfo.hasNextPage);
      setEndCursor(response.products.pageInfo.endCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search products');
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasNextPage && endCursor && currentQuery && !loading) {
      searchProducts(currentQuery, 20, endCursor);
    }
  };

  const clearSearch = () => {
    setProducts([]);
    setCurrentQuery('');
    setError(null);
    setHasNextPage(false);
    setEndCursor(null);
  };

  return {
    products,
    loading,
    error,
    hasNextPage,
    currentQuery,
    searchProducts,
    loadMore,
    clearSearch,
  };
}

// Hook for fetching featured products
export function useFeaturedProducts(first: number = 8) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const productsData = await shopifyProducts.getFeatured(first);
        setProducts(productsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch featured products');
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    if (shopifyUtils.isConfigured()) {
      fetchFeaturedProducts();
    } else {
      setError('Shopify is not configured');
      setLoading(false);
    }
  }, [first]);

  return { products, loading, error };
}

// Hook for fetching collections
export function useCollections(first: number = 20) {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);

  const fetchCollections = async (after?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await shopifyCollections.getAll(first, after);
      
      if (after) {
        setCollections(prev => [...prev, ...response.collections.edges.map(edge => edge.node)]);
      } else {
        setCollections(response.collections.edges.map(edge => edge.node));
      }
      
      setHasNextPage(response.collections.pageInfo.hasNextPage);
      setEndCursor(response.collections.pageInfo.endCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch collections');
      console.error('Error fetching collections:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasNextPage && endCursor && !loading) {
      fetchCollections(endCursor);
    }
  };

  useEffect(() => {
    if (shopifyUtils.isConfigured()) {
      fetchCollections();
    } else {
      setError('Shopify is not configured');
      setLoading(false);
    }
  }, [first]);

  return {
    collections,
    loading,
    error,
    hasNextPage,
    loadMore,
    refetch: () => fetchCollections(),
  };
}

// Hook for fetching a single collection
export function useCollection(handle: string, first: number = 20) {
  const [collection, setCollection] = useState<ShopifyCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!handle) {
      setLoading(false);
      return;
    }

    const fetchCollection = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const collectionData = await shopifyCollections.getByHandle(handle, first);
        setCollection(collectionData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch collection');
        console.error('Error fetching collection:', err);
      } finally {
        setLoading(false);
      }
    };

    if (shopifyUtils.isConfigured()) {
      fetchCollection();
    } else {
      setError('Shopify is not configured');
      setLoading(false);
    }
  }, [handle, first]);

  return { collection, loading, error };
}

// Hook for product recommendations
export function useProductRecommendations(productId: string) {
  const [recommendations, setRecommendations] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const recommendationsData = await shopifyProducts.getRecommendations(productId);
        setRecommendations(recommendationsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    if (shopifyUtils.isConfigured()) {
      fetchRecommendations();
    } else {
      setError('Shopify is not configured');
      setLoading(false);
    }
  }, [productId]);

  return { recommendations, loading, error };
}
