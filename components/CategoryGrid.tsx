"use client";

import Image from "next/image";
import Link from "next/link";
import { useCollections } from "@/lib/hooks/useShopify";
import { getOptimizedImageUrl } from "@/lib/shopify";
import { cn } from "@/lib/utils";

export default function CategoryGrid() {
  const { collections, loading, error } = useCollections();

  // Use only Shopify collections
  const categories = collections.map((collection) => ({
    id: collection.handle,
    name: collection.title,
    image: collection.image?.url
      ? getOptimizedImageUrl(collection.image.url, {
          width: 400,
          height: 400,
        })
      : null,
    productsCount: collection.products.edges.length,
  }));

  // Handle error state
  if (error) {
    return (
      <section className="space-y-6">
        <header className="flex items-end justify-between">
          <div>
            <h3 className="text-xl font-semibold">Shop by Category</h3>
            <p className="text-sm text-neutral-500">
              Curated essentials to transform your space.
            </p>
          </div>
        </header>
        <div className="text-center py-8">
          <p className="text-neutral-500">Unable to load categories</p>
        </div>
      </section>
    );
  }

  // Show skeleton loading state
  if (loading) {
    return (
      <section className="space-y-6">
        <header className="flex items-end justify-between">
          <div>
            <h3 className="text-xl font-semibold">Shop by Category</h3>
            <p className="text-sm text-neutral-500">
              Curated essentials to transform your space.
            </p>
          </div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square overflow-hidden rounded-xl bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  // Don't render if no categories
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h3 className="text-xl font-semibold">Shop by Category</h3>
          <p className="text-sm text-neutral-500">
            Curated essentials to transform your space.
          </p>
        </div>
        <Link href="/shop" className="text-sm font-medium hover:underline">
          View all
        </Link>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
        {categories.slice(0, 8).map((category) => (
          <Link
            key={category.id}
            href={`/shop?category=${encodeURIComponent(category.id)}`}
            className="group relative aspect-square overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800 transition-transform duration-300 hover:scale-105"
          >
            {category.image ? (
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                <span className="text-neutral-400 text-xs">No Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2">
              <span className="text-white text-xs font-medium tracking-wide drop-shadow block truncate">
                {category.name}
              </span>
              {category.productsCount > 0 && (
                <span className="text-white/80 text-xs drop-shadow">
                  {category.productsCount} items
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
