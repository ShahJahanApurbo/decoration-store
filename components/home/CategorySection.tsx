"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCollections } from "@/lib/hooks/useShopify";
import { getOptimizedImageUrl } from "@/lib/shopify";

export default function CategorySection() {
  const { collections, loading, error } = useCollections(8);

  // If there's an error loading collections, we can show an error message or fallback
  if (error) {
    console.error("Failed to load collections:", error);
  }

  return (
    <section className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h3 className="text-2xl font-semibold">Shop by Category</h3>
          <p className="text-muted-foreground">
            Curated essentials to transform your space.
          </p>
        </div>
        <Link href="/shop">
          <Button variant="outline" size="sm">
            View all categories
          </Button>
        </Link>
      </header>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[4/5] rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
          {collections.slice(0, 8).map((collection) => {
            const imageUrl = collection.image?.url
              ? getOptimizedImageUrl(collection.image.url, {
                  width: 400,
                  height: 500,
                })
              : "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=60";

            const productCount = collection.products?.edges?.length || 0;

            return (
              <Link
                key={collection.id}
                href={`/shop?collection=${collection.handle}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-muted transition-transform hover:scale-[1.02]"
              >
                <Image
                  src={imageUrl}
                  alt={collection.image?.altText || collection.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="text-white font-medium text-sm mb-1 drop-shadow">
                    {collection.title}
                  </h4>
                  {productCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {productCount} items
                    </Badge>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
