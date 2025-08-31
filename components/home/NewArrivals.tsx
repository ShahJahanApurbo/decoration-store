"use client";

import { useProducts } from "@/lib/hooks/useShopify";
import ProductCard from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMemo } from "react";

export default function NewArrivals() {
  const { data, loading, error } = useProducts(50); // Get more products to filter from

  // Filter products to show only recent arrivals
  const newProducts = useMemo(() => {
    if (!data?.products) return [];

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return data.products
      .filter((product: any) => {
        // Filter by creation date (within last 30 days)
        const createdAt = new Date(product.createdAt);
        const isRecent = createdAt > thirtyDaysAgo;

        // Also check for "new" tag
        const hasNewTag = product.tags?.some(
          (tag: string) =>
            tag.toLowerCase().includes("new") ||
            tag.toLowerCase().includes("arrival") ||
            tag.toLowerCase().includes("latest")
        );

        return isRecent || hasNewTag;
      })
      .slice(0, 8); // Limit to 8 products
  }, [data]);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              New Arrivals
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our latest collection of decoration items
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="space-y-4">
                <div className="aspect-square bg-muted animate-pulse rounded-lg"></div>
                <div className="h-4 bg-muted animate-pulse rounded"></div>
                <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              New Arrivals
            </h2>
            <p className="text-muted-foreground">
              Unable to load new arrivals at this time.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (newProducts.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              New Arrivals
            </h2>
            <p className="text-muted-foreground">
              No new arrivals available at this time.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            New Arrivals
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our latest collection of carefully curated decoration items
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {newProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/shop">Explore All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
