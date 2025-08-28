"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import {
  useProducts,
  useProductSearch,
  useCollections,
  useCollection,
} from "@/lib/hooks/useShopify";
import { ProductGrid } from "@/components/shop";

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
          {/* No Products Found */}
          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isSearchMode
                    ? `No products found for "${currentQuery}"`
                    : selectedCategory
                    ? `No products found in ${selectedCategory} category`
                    : "No products available"}
                </h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any products matching your criteria. Try
                  adjusting your filters or search terms.
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
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length > 0 && (
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              loadingCount={8}
              columns={{
                mobile: 1,
                tablet: 2,
                desktop: 4,
              }}
              variant="default"
              showQuickView={true}
            />
          )}

          {/* Loading State */}
          {loading && (
            <ProductGrid
              products={[]}
              loading={true}
              loadingCount={8}
              columns={{
                mobile: 1,
                tablet: 2,
                desktop: 4,
              }}
              variant="default"
              showQuickView={true}
            />
          )}

          {/* Load More Button - only show for regular product browsing */}
          {!isSearchMode &&
            !isCollectionMode &&
            hasNextPage &&
            filteredProducts.length > 0 && (
              <div className="text-center mt-12">
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 text-base font-medium"
                >
                  {loading ? "Loading..." : "Load More Products"}
                </Button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
