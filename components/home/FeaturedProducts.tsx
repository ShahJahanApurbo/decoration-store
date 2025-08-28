"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { useFeaturedProducts } from "@/lib/hooks/useShopify";
import { formatPrice, getOptimizedImageUrl } from "@/lib/shopify";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function FeaturedProducts() {
  const { products, loading, error } = useFeaturedProducts(8);

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-red-600 mb-8">
              {error.includes("not configured")
                ? "Store configuration needed. Please set up your Shopify credentials."
                : "Unable to load products. Please try again later."}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Skeleton loading cards */}
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium home decoration items
            that will transform your space into a beautiful sanctuary.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        ) : products.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600 mb-8">
              No featured products available at the moment.
            </p>
            <Button asChild>
              <Link href="/shop">Browse All Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const mainImage = product.images.edges[0]?.node;
              const firstVariant = product.variants.edges[0]?.node;
              const hasComparePrice =
                firstVariant?.compareAtPrice &&
                parseFloat(firstVariant.compareAtPrice.amount) >
                  parseFloat(firstVariant.price.amount);

              return (
                <Card
                  key={product.id}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Link href={`/products/${product.handle}`}>
                      <Image
                        src={
                          mainImage?.url
                            ? getOptimizedImageUrl(mainImage.url, {
                                width: 400,
                                height: 400,
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
                            ((parseFloat(firstVariant.compareAtPrice!.amount) -
                              parseFloat(firstVariant.price.amount)) /
                              parseFloat(firstVariant.compareAtPrice!.amount)) *
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
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {product.title}
                        </h3>
                      </Link>
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
                              product.priceRange.minVariantPrice.currencyCode
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
                          View Details
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
        )}

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/shop">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
