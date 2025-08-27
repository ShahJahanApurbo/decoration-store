"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Star, Heart, ShoppingCart, Search, Filter } from "lucide-react";
import {
  useProducts,
  useProductSearch,
  useCollections,
  useCollection,
} from "@/lib/hooks/useShopify";
import { formatPrice, getOptimizedImageUrl } from "@/lib/shopify";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get("category") || "";
  const initialCollection = searchParams.get("collection") || "";
  const initialSearch = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory || initialCollection
  );
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [showFilters, setShowFilters] = useState(false);

  // Use search hook when there's a search query, otherwise use regular products
  const {
    products: searchResults,
    loading: searchLoading,
    error: searchError,
    searchProducts,
    clearSearch,
    currentQuery,
  } = useProductSearch();

  const {
    products: allProducts,
    loading: productsLoading,
    error: productsError,
    hasNextPage,
    loadMore,
  } = useProducts();

  const {
    collections,
    loading: collectionsLoading,
    error: collectionsError,
  } = useCollections();

  // Hook for getting specific collection products
  const {
    collection: selectedCollectionData,
    loading: collectionLoading,
    error: collectionError,
  } = useCollection(selectedCategory, 50);

  // Determine which data to show
  const isSearchMode = !!searchQuery;
  const isCollectionMode =
    !isSearchMode &&
    selectedCategory &&
    collections.some((c) => c.handle === selectedCategory);

  let products: any[] = [];
  let loading = false;
  let error: string | null = null;

  if (isSearchMode) {
    products = searchResults;
    loading = searchLoading;
    error = searchError;
  } else if (isCollectionMode && selectedCollectionData) {
    // Show products from the selected collection
    products = selectedCollectionData.products.edges.map((edge) => edge.node);
    loading = collectionLoading;
    error = collectionError;
  } else {
    // Show all products
    products = allProducts;
    loading = productsLoading;
    error = productsError;
  }

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchProducts(query);
      // Update URL with search parameter
      const newParams = new URLSearchParams(searchParams);
      newParams.set("search", query);
      if (selectedCategory) newParams.set("category", selectedCategory);
      router.replace(`/shop?${newParams.toString()}`);
    } else {
      clearSearch();
      // Remove search parameter from URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("search");
      if (selectedCategory) newParams.set("category", selectedCategory);
      const queryString = newParams.toString();
      router.replace(`/shop${queryString ? `?${queryString}` : ""}`);
    }
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Update URL with category or collection parameter
    const newParams = new URLSearchParams(searchParams);

    // Clear both category and collection params first
    newParams.delete("category");
    newParams.delete("collection");

    if (categoryId) {
      // Check if this is a collection handle or a regular category
      const isCollection = collections.some(
        (collection) => collection.handle === categoryId
      );
      if (isCollection) {
        newParams.set("collection", categoryId);
      } else {
        newParams.set("category", categoryId);
      }
    }

    if (searchQuery) newParams.set("search", searchQuery);
    const queryString = newParams.toString();
    router.replace(`/shop${queryString ? `?${queryString}` : ""}`);
  };

  // Filter products by category (only for non-collection filtering)
  const filteredProducts =
    selectedCategory && !isCollectionMode
      ? products.filter((product) => {
          // Check product type and tags for regular category filtering
          const matchesProductType =
            product.productType?.toLowerCase() ===
            selectedCategory.toLowerCase();
          const matchesTags = product.tags?.some(
            (tag: string) =>
              tag.toLowerCase() === selectedCategory.toLowerCase()
          );

          return matchesProductType || matchesTags;
        })
      : products;

  // Get categories from collections with product counts
  const categories = collections.map((collection) => ({
    id: collection.handle,
    name: collection.title,
    count: collection.products.edges.length,
    description: collection.description || undefined,
  }));

  useEffect(() => {
    if (initialSearch) {
      handleSearch(initialSearch);
    }
  }, [initialSearch]);

  if (error && !products.length) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop</h1>
          <p className="text-red-600 mb-8">
            {error.includes("not configured")
              ? "Store configuration needed. Please set up your Shopify credentials."
              : "Unable to load products. Please try again later."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop</h1>
        <p className="text-gray-600">
          Discover our complete collection of home decoration items
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 space-y-6">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
          </div>

          <div
            className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            {/* Categories */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
              {collectionsLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 bg-gray-200 rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    variant={!selectedCategory ? "default" : "ghost"}
                    className="w-full justify-between"
                    onClick={() => handleCategorySelect("")}
                  >
                    All Products
                    <span className="text-sm text-gray-500">
                      {allProducts.length}
                    </span>
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={
                        selectedCategory === category.id ? "default" : "ghost"
                      }
                      className="w-full justify-between"
                      onClick={() => handleCategorySelect(category.id)}
                      title={category.description}
                    >
                      <span className="truncate">{category.name}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {category.count}
                      </span>
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Results Info */}
            {isSearchMode && currentQuery && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  {searchResults.length} results for "{currentQuery}"
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    clearSearch();
                  }}
                  className="mt-2"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">
                {isSearchMode
                  ? `No products found for "${currentQuery}"`
                  : selectedCategory
                  ? `No products found in ${selectedCategory} category`
                  : "No products available"}
              </p>
              {(isSearchMode || selectedCategory) && (
                <div className="space-x-4">
                  {isSearchMode && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        clearSearch();
                      }}
                    >
                      Clear Search
                    </Button>
                  )}
                  {selectedCategory && (
                    <Button
                      variant="outline"
                      onClick={() => handleCategorySelect("")}
                    >
                      View All Products
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {filteredProducts.map((product) => {
                  const mainImage = product.images.edges[0]?.node;
                  const firstVariant = product.variants.edges[0]?.node;
                  const hasComparePrice =
                    firstVariant?.compareAtPrice &&
                    parseFloat(firstVariant.compareAtPrice.amount) >
                      parseFloat(firstVariant.price.amount);

                  return (
                    <Card
                      key={product.id}
                      className="group overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <Link href={`/products/${product.handle}`}>
                          <Image
                            src={
                              mainImage?.url
                                ? getOptimizedImageUrl(mainImage.url, {
                                    width: 300,
                                    height: 300,
                                  })
                                : "/placeholder-product.jpg"
                            }
                            alt={mainImage?.altText || product.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </Link>

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {hasComparePrice && (
                            <Badge variant="destructive" className="text-xs">
                              {Math.round(
                                ((parseFloat(
                                  firstVariant.compareAtPrice!.amount
                                ) -
                                  parseFloat(firstVariant.price.amount)) /
                                  parseFloat(
                                    firstVariant.compareAtPrice!.amount
                                  )) *
                                  100
                              )}
                              % OFF
                            </Badge>
                          )}
                          {product.tags.includes("new") && (
                            <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                              NEW
                            </Badge>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 bg-white/90 hover:bg-white"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="mb-2">
                          {product.vendor && (
                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                              {product.vendor}
                            </p>
                          )}
                          <Link href={`/products/${product.handle}`}>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                              {product.title}
                            </h3>
                          </Link>
                          {product.productType && (
                            <p className="text-xs text-gray-500 capitalize">
                              {product.productType}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className="h-3 w-3 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">(4.8)</span>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">
                              {formatPrice(
                                firstVariant?.price.amount ||
                                  product.priceRange.minVariantPrice.amount,
                                firstVariant?.price.currencyCode ||
                                  product.priceRange.minVariantPrice
                                    .currencyCode
                              )}
                            </span>
                            {hasComparePrice && (
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(
                                  firstVariant.compareAtPrice!.amount,
                                  firstVariant.compareAtPrice!.currencyCode
                                )}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button asChild className="flex-1" size="sm">
                            <Link href={`/products/${product.handle}`}>
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          <WhatsAppButton
                            message={`Hi! I'm interested in ${product.title}. Can you tell me more about it?`}
                            className="px-3"
                            size="sm"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Load More Button - only show for regular product browsing */}
              {!isSearchMode && !isCollectionMode && hasNextPage && (
                <div className="text-center">
                  <Button
                    onClick={loadMore}
                    disabled={loading}
                    variant="outline"
                    size="lg"
                  >
                    {loading ? "Loading..." : "Load More Products"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
