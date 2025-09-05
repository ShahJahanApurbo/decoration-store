"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useProducts,
  useCollections,
  useProductSearch,
} from "@/lib/hooks/useShopify";
import ProductGrid from "@/components/shop/ProductGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X, Menu } from "lucide-react";

export default function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("title");
  const [showFilters, setShowFilters] = useState(false);

  // Helper function to normalize category names
  const normalizeCategory = (categoryName: string): string => {
    return categoryName
      .toLowerCase()
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
      .replace(/-/g, " ")
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Handle URL parameters on component mount
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");
    const sortParam = searchParams.get("sort");

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    if (sortParam) {
      setSortBy(sortParam);
    }
  }, [searchParams]);

  // Update URL when filters change
  const updateURL = (category: string, search: string, sort: string) => {
    const params = new URLSearchParams();

    if (category) params.set("category", category);
    if (search) params.set("search", search);
    if (sort && sort !== "title") params.set("sort", sort);

    const queryString = params.toString();
    const newURL = queryString ? `/shop?${queryString}` : "/shop";

    router.push(newURL, { scroll: false });
  };

  // Fetch data
  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = useProducts(50);
  const { data: collectionsData, loading: collectionsLoading } =
    useCollections(20);
  const { searchProducts, loading: searchLoading } = useProductSearch();

  // Get products and collections
  const allProducts = productsData?.products || [];
  const collections = collectionsData?.collections || [];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter((product: any) => {
        const selectedCategoryLower = selectedCategory.toLowerCase();

        // Check if the category matches product type (case insensitive)
        const productTypeMatch =
          product.productType?.toLowerCase() === selectedCategoryLower;

        // Check if the category is in product tags
        const tagMatch = product.tags?.some(
          (tag: string) => tag.toLowerCase() === selectedCategoryLower
        );

        // Check if the category matches any collection that this product belongs to
        const collectionMatch = collections.some((collection: any) => {
          if (
            !collection.products?.edges?.some(
              (edge: any) => edge.node.id === product.id
            )
          ) {
            return false;
          }

          const collectionTitle = collection.title?.toLowerCase();
          const collectionHandle = collection.handle?.toLowerCase();

          // Also check normalized version
          const normalizedCollection = normalizeCategory(
            collection.title || collection.handle || ""
          ).toLowerCase();

          return (
            collectionTitle === selectedCategoryLower ||
            collectionHandle === selectedCategoryLower ||
            normalizedCollection === selectedCategoryLower
          );
        });

        return productTypeMatch || tagMatch || collectionMatch;
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product: any) =>
          product.title.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.vendor?.toLowerCase().includes(query) ||
          product.productType?.toLowerCase().includes(query) ||
          product.tags?.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }

    // Sort products
    filtered = [...filtered].sort((a: any, b: any) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "price-low":
          return (
            parseFloat(a.priceRange.minVariantPrice.amount) -
            parseFloat(b.priceRange.minVariantPrice.amount)
          );
        case "price-high":
          return (
            parseFloat(b.priceRange.minVariantPrice.amount) -
            parseFloat(a.priceRange.minVariantPrice.amount)
          );
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [allProducts, selectedCategory, searchQuery, sortBy, collections]);

  // Get unique categories from products and collections
  const categories = useMemo(() => {
    const categorySet = new Set<string>();

    // Add product types
    allProducts.forEach((product: any) => {
      if (product.productType) categorySet.add(product.productType);
    });

    // Add collection titles (prefer titles over handles for better display)
    collections.forEach((collection: any) => {
      // Use title if available, otherwise use handle
      const categoryName = collection.title || collection.handle;
      if (categoryName) {
        const normalizedName = normalizeCategory(categoryName);
        categorySet.add(normalizedName);
      }
    });

    return Array.from(categorySet).sort();
  }, [allProducts, collections]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the useMemo filter above
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateURL(category, searchQuery, sortBy);
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    updateURL(selectedCategory, search, sortBy);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    updateURL(selectedCategory, searchQuery, sort);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSortBy("title");
    updateURL("", "", "title");
  };

  const removeSearchFilter = () => {
    setSearchQuery("");
    updateURL(selectedCategory, "", sortBy);
  };

  const removeCategoryFilter = () => {
    setSelectedCategory("");
    updateURL("", searchQuery, sortBy);
  };

  const isLoading = productsLoading || collectionsLoading || searchLoading;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Shop</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our complete collection of home decoration items
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full mb-4"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {/* Filters Sidebar */}
          <div
            className={`lg:w-1/4 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </h2>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Search
                  </label>
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10"
                    />
                  </form>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full p-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full p-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="title">Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>

                {/* Active Filters */}
                {(searchQuery || selectedCategory) && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Active Filters
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {searchQuery && (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 pr-1"
                        >
                          <span>Search: "{searchQuery}"</span>
                          <button
                            type="button"
                            className="p-1 rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors"
                            onClick={removeSearchFilter}
                            aria-label="Remove search filter"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {selectedCategory && (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 pr-1"
                        >
                          <span>Category: {selectedCategory}</span>
                          <button
                            type="button"
                            className="p-1 rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors"
                            onClick={removeCategoryFilter}
                            aria-label="Remove category filter"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="mt-2 h-8 px-3 text-xs"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Products Section */}
          <div className="lg:w-3/4">
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                {isLoading
                  ? "Loading products..."
                  : `${filteredProducts.length} product${
                      filteredProducts.length !== 1 ? "s" : ""
                    } found`}
              </p>
            </div>

            {/* Product Grid */}
            <ProductGrid products={filteredProducts} loading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
