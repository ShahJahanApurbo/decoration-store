"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCollections } from "@/lib/hooks/useShopify";

export default function CategorySection() {
  const { data, loading, error } = useCollections(6);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of decoration categories
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-4">
                <div className="aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600">
              Unable to load categories at this time.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const collections = data?.collections?.slice(0, 6) || [];

  if (collections.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600">
              No categories available at this time.
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our curated collection of home decoration categories
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {collections.map((collection: any) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.handle}`}
              className="group block"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4">
                {collection.image ? (
                  <Image
                    src={collection.image.url}
                    alt={collection.image.altText || collection.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2"></div>
                      <p className="text-sm">No image</p>
                    </div>
                  </div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button variant="secondary" size="sm">
                    Shop Collection
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors">
                  {collection.title}
                </h3>
                {collection.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {collection.description}
                  </p>
                )}
                <Badge variant="outline" className="text-xs">
                  {collection.products?.edges?.length || 0} items
                </Badge>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/shop">Browse All Categories</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
