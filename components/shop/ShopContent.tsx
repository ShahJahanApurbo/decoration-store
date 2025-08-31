"use client";

import { useState, useMemo } from "react";
import {
  useProducts,
  useCollections,
  useProductSearch,
} from "@/lib/hooks/useShopify";
import ProductGrid from "@/components/shop/ProductGrid";
import CategoryGrid from "@/components/shop/CategoryGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";

export default function ShopContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("title");
  const [showCategories, setShowCategories] = useState(true);

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
      filtered = filtered.filter(
        (product: any) =>
          product.productType === selectedCategory ||
          product.tags?.includes(selectedCategory)
      );
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
  }, [allProducts, selectedCategory, searchQuery, sortBy]);

  // Get unique categories from products
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    allProducts.forEach((product: any) => {
      if (product.productType) categorySet.add(product.productType);
    });
    return Array.from(categorySet).sort();
  }, [allProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the useMemo filter above
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSortBy("title");
  };

  const isLoading = productsLoading || collectionsLoading || searchLoading;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Shop</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our complete collection of home decoration items
          </p>
        </div>

        {/* Categories Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            <Button
              variant={showCategories ? "default" : "outline"}
              onClick={() => setShowCategories(true)}
            >
              Categories
            </Button>
            <Button
              variant={!showCategories ? "default" : "outline"}
              onClick={() => setShowCategories(false)}
            >
              All Products
            </Button>
          </div>
        </div>

        {/* Show Categories */}
        {showCategories && (
          <div className="mb-12">
            <CategoryGrid />
          </div>
        )}

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* Search */}
              <div className="md:col-span-2">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </form>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
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
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full md:w-auto p-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
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
              <div className="flex flex-wrap gap-2 mt-4">
                {searchQuery && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Search: "{searchQuery}"
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSearchQuery("")}
                    />
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Category: {selectedCategory}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedCategory("")}
                    />
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-6 px-2 text-xs"
                >
                  Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {!showCategories && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              {isLoading
                ? "Loading products..."
                : `${filteredProducts.length} product${
                    filteredProducts.length !== 1 ? "s" : ""
                  } found`}
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!showCategories && (
          <ProductGrid products={filteredProducts} loading={isLoading} />
        )}
      </div>
    </div>
  );
}
