'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  tags: string[];
  vendor: string;
  productType: string;
  createdAt: string;
  updatedAt: string;
  availableForSale: boolean;
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
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
}

interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  updatedAt: string;
  image?: {
    id: string;
    url: string;
    altText?: string;
    width: number;
    height: number;
  };
  products: {
    edges: Array<{
      node: Product;
    }>;
  };
}

interface UseDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Hook for fetching featured products
export function useFeaturedProducts(count: number = 8): UseDataResult<Product[]> {
  const [data, setData] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/products/featured?first=${count}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to fetch featured products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch featured products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [count]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for fetching all products
export function useProducts(count: number = 20): UseDataResult<{ products: Product[]; hasNextPage: boolean }> {
  const [data, setData] = useState<{ products: Product[]; hasNextPage: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/products?first=${count}`);
      const result = await response.json();
      
      if (result.success) {
        setData({
          products: result.data.edges.map((edge: any) => edge.node),
          hasNextPage: result.data.pageInfo.hasNextPage,
        });
      } else {
        setError(result.error || 'Failed to fetch products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [count]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for fetching collections
export function useCollections(count: number = 20): UseDataResult<{ collections: Collection[]; hasNextPage: boolean }> {
  const [data, setData] = useState<{ collections: Collection[]; hasNextPage: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/collections?first=${count}`);
      const result = await response.json();
      
      if (result.success) {
        setData({
          collections: result.data.edges.map((edge: any) => edge.node),
          hasNextPage: result.data.pageInfo.hasNextPage,
        });
      } else {
        setError(result.error || 'Failed to fetch collections');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch collections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [count]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for searching products
export function useProductSearch() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProducts = async (query: string, count: number = 20) => {
    if (!query.trim()) {
      setData([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/products?query=${encodeURIComponent(query)}&first=${count}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data.edges.map((edge: any) => edge.node));
      } else {
        setError(result.error || 'Failed to search products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search products');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setData([]);
    setError(null);
  };

  return { data, loading, error, searchProducts, clearSearch };
}

// Utility functions
export function formatPrice(amount: string, currencyCode: string = 'USD'): string {
  const numericAmount = parseFloat(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(numericAmount);
}

export function getOptimizedImageUrl(url: string, options: { width?: number; height?: number } = {}): string {
  if (!url) return '/placeholder-image.jpg';
  
  const { width = 400, height = 400 } = options;
  const urlObj = new URL(url);
  urlObj.searchParams.set('width', width.toString());
  urlObj.searchParams.set('height', height.toString());
  
  return urlObj.toString();
}
