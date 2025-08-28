"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  Heart,
  ShoppingCart,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatPrice, getOptimizedImageUrl } from "@/lib/shopify";
import WhatsAppButton from "@/components/WhatsAppButton";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: any;
  className?: string;
  variant?: "default" | "compact" | "featured";
  showQuickView?: boolean;
}

export default function ProductCard({
  product,
  className,
  variant = "default",
  showQuickView = true,
}: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = product.images.edges.map((edge: any) => edge.node);
  const mainImage = images[currentImageIndex] || images[0];
  const firstVariant = product.variants.edges[0]?.node;

  const hasComparePrice =
    firstVariant?.compareAtPrice &&
    parseFloat(firstVariant.compareAtPrice.amount) >
      parseFloat(firstVariant.price.amount);

  const discountPercentage = hasComparePrice
    ? Math.round(
        ((parseFloat(firstVariant.compareAtPrice!.amount) -
          parseFloat(firstVariant.price.amount)) /
          parseFloat(firstVariant.compareAtPrice!.amount)) *
          100
      )
    : 0;

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
    }
  };

  const cardVariants = {
    default:
      "group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100/50 backdrop-blur-sm",
    compact:
      "group relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100/50",
    featured:
      "group relative overflow-hidden bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 border border-gray-100/50 backdrop-blur-sm",
  };

  const imageVariants = {
    default:
      "relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100/50",
    compact:
      "relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100/50",
    featured:
      "relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100/50",
  };

  return (
    <Card
      className={cn(cardVariants[variant], className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className={imageVariants[variant]}>
        <Link href={`/products/${product.handle}`} className="block h-full">
          <Image
            src={
              mainImage?.url
                ? getOptimizedImageUrl(mainImage.url, {
                    width: variant === "featured" ? 400 : 320,
                    height: variant === "featured" ? 500 : 320,
                  })
                : "/placeholder-product.jpg"
            }
            alt={mainImage?.altText || product.title}
            fill
            className={cn(
              "object-cover transition-all duration-700 group-hover:scale-110",
              variant === "featured" && "group-hover:scale-105"
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>

        {/* Image Navigation - Only show if multiple images */}
        {images.length > 1 && isHovered && (
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white/90 shadow-lg"
              onClick={(e) => {
                e.preventDefault();
                prevImage();
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white/90 shadow-lg"
              onClick={(e) => {
                e.preventDefault();
                nextImage();
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Image Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_: any, index: number) => (
              <button
                key={index}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-200",
                  index === currentImageIndex
                    ? "bg-white shadow-sm scale-110"
                    : "bg-white/50 hover:bg-white/80"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImageIndex(index);
                }}
              />
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasComparePrice && (
            <Badge
              variant="destructive"
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg font-semibold px-2 py-0.5 text-xs"
            >
              -{discountPercentage}%
            </Badge>
          )}
          {product.tags.includes("new") && (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg font-semibold px-2 py-0.5 text-xs">
              NEW
            </Badge>
          )}
          {product.tags.includes("bestseller") && (
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg font-semibold px-2 py-0.5 text-xs">
              ⭐ BESTSELLER
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "h-9 w-9 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg transition-all duration-200",
              isLiked && "bg-red-50 text-red-500 hover:bg-red-100"
            )}
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
          </Button>

          {showQuickView && (
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Quick Add to Cart - Visible on hover */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button
            asChild
            className="w-full bg-black/90 backdrop-blur-sm hover:bg-black text-white shadow-lg font-medium py-2.5"
          >
            <Link href={`/products/${product.handle}`}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Quick View
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <CardContent
        className={cn(
          "p-4",
          variant === "featured" && "p-6",
          variant === "compact" && "p-3"
        )}
      >
        {/* Brand/Vendor */}
        {product.vendor && (
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            {product.vendor}
          </p>
        )}

        {/* Title */}
        <Link href={`/products/${product.handle}`}>
          <h3
            className={cn(
              "font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2",
              variant === "featured" ? "text-lg" : "text-sm",
              variant === "compact" && "text-xs"
            )}
          >
            {product.title}
          </h3>
        </Link>

        {/* Product Type */}
        {product.productType && variant !== "compact" && (
          <p className="text-xs text-gray-500 capitalize mb-2">
            {product.productType}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-3 w-3 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">(4.8)</span>
          {variant === "featured" && (
            <span className="text-xs text-gray-400 ml-auto">127 reviews</span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-bold text-gray-900",
                variant === "featured" ? "text-xl" : "text-lg",
                variant === "compact" && "text-base"
              )}
            >
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
          {hasComparePrice && (
            <div className="text-right">
              <span className="text-xs text-green-600 font-medium">
                Save{" "}
                {formatPrice(
                  (
                    parseFloat(firstVariant.compareAtPrice!.amount) -
                    parseFloat(firstVariant.price.amount)
                  ).toString(),
                  firstVariant.price.currencyCode
                )}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        {variant !== "compact" && (
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
        )}

        {/* Compact variant actions */}
        {variant === "compact" && (
          <div className="flex gap-1">
            <Button asChild className="flex-1" size="sm" variant="outline">
              <Link href={`/products/${product.handle}`}>View</Link>
            </Button>
            <WhatsAppButton
              message={`Hi! I'm interested in ${product.title}. Can you tell me more about it?`}
              className="px-2"
              size="sm"
              variant="outline"
            />
          </div>
        )}
      </CardContent>

      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/30 group-hover:via-purple-50/20 group-hover:to-pink-50/30 transition-all duration-700 pointer-events-none -z-10" />
    </Card>
  );
}
