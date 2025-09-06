"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Star,
  Heart,
  ShoppingCart,
  Eye,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Package,
} from "lucide-react";
import { formatPrice, isOnSale, getDiscountPercentage } from "@/lib/utils";
import { getOptimizedImageUrl } from "@/lib/hooks/useShopify";
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
  const allVariantsAvailable = product.variants.edges.every(
    (edge: any) => edge.node.availableForSale
  );
  const someVariantsAvailable = product.variants.edges.some(
    (edge: any) => edge.node.availableForSale
  );

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

  // Get stock status for display
  const getStockStatus = () => {
    if (!product.availableForSale || !someVariantsAvailable) {
      return { text: "Out of Stock", color: "text-red-600", icon: XCircle };
    }
    if (allVariantsAvailable) {
      return { text: "In Stock", color: "text-green-600", icon: CheckCircle };
    }
    return { text: "Limited Stock", color: "text-yellow-600", icon: Package };
  };

  const stockStatus = getStockStatus();

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
      "group relative overflow-hidden bg-card rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-border/50 backdrop-blur-sm h-full flex flex-col",
    compact:
      "group relative overflow-hidden bg-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-border/50 h-full flex flex-col",
    featured:
      "group relative overflow-hidden bg-card rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 border border-border/50 backdrop-blur-sm h-full flex flex-col",
  };

  const imageVariants = {
    default:
      "relative aspect-square overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 rounded-t-2xl border-0",
    compact:
      "relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 rounded-t-xl border-0",
    featured:
      "relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 rounded-t-3xl border-0",
  };

  return (
    <Card
      className={cn(cardVariants[variant], className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container - No gaps, perfect fit */}
      <div className={cn(imageVariants[variant], "flex-shrink-0")}>
        <Link
          href={`/products/${product.handle}`}
          className="block h-full relative"
        >
          <Image
            src={
              mainImage?.url
                ? getOptimizedImageUrl(mainImage.url, {
                    width: variant === "featured" ? 400 : 320,
                    height: variant === "featured" ? 500 : 320,
                  })
                : "/placeholder-product.svg"
            }
            alt={mainImage?.altText || product.title}
            fill
            className={cn(
              "object-cover object-center transition-all duration-700 group-hover:scale-105",
              variant === "featured" && "group-hover:scale-102"
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={variant === "featured"}
            quality={90}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-product.svg";
            }}
          />

          {/* Loading overlay for better UX */}
          <div className="absolute inset-0 bg-muted/20 animate-pulse opacity-0 group-data-[loading=true]:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Image Navigation - Only show if multiple images */}
        {images.length > 1 && isHovered && (
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90 shadow-lg"
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
              className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90 shadow-lg"
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
                    ? "bg-foreground shadow-sm scale-110"
                    : "bg-foreground/50 hover:bg-foreground/80"
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
              "h-9 w-9 bg-background/90 backdrop-blur-sm hover:bg-background shadow-lg transition-all duration-200",
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
              className="h-9 w-9 bg-background/90 backdrop-blur-sm hover:bg-background shadow-lg"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Quick Add to Cart - Visible on hover */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button
            asChild
            className="w-full bg-primary/90 backdrop-blur-sm hover:bg-primary text-primary-foreground shadow-lg font-medium py-2.5"
          >
            <Link href={`/products/${product.handle}`}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Quick View
            </Link>
          </Button>
        </div>
      </div>

      {/* Content - Flex grow to push buttons to bottom */}
      <div className="flex flex-col flex-grow">
        <CardHeader
          className={cn(
            "px-4 pb-2",
            variant === "featured" && "px-6",
            variant === "compact" && "px-3"
          )}
        >
          {/* Brand/Vendor */}
          {product.vendor && (
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              {product.vendor}
            </p>
          )}

          {/* Title */}
          <Link href={`/products/${product.handle}`}>
            <h3
              className={cn(
                "font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2",
                variant === "featured" ? "text-lg" : "text-sm",
                variant === "compact" && "text-xs"
              )}
            >
              {product.title}
            </h3>
          </Link>

          {/* Product Type */}
          {product.productType && variant !== "compact" && (
            <p className="text-xs text-muted-foreground capitalize mb-2">
              {product.productType}
            </p>
          )}
        </CardHeader>

        <CardContent
          className={cn(
            "px-4 pt-0 flex flex-col flex-grow",
            variant === "featured" && "px-6",
            variant === "compact" && "px-3"
          )}
        >
          {/* Stock Status */}
          <div className="flex items-center gap-1.5 mb-3">
            <stockStatus.icon className={cn("h-3 w-3", stockStatus.color)} />
            <span className={cn("text-xs font-medium", stockStatus.color)}>
              {stockStatus.text}
            </span>
            {variant === "featured" && product.variants.edges.length > 1 && (
              <span className="text-xs text-muted-foreground ml-auto">
                {product.variants.edges.length} variants
              </span>
            )}
          </div>

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
            <span className="text-xs text-muted-foreground ml-1">(4.8)</span>
            {variant === "featured" && (
              <span className="text-xs text-muted-foreground ml-auto">
                127 reviews
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "font-bold text-foreground",
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
                <span className="text-sm text-muted-foreground line-through">
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

          {/* Actions - Pushed to bottom with flex-grow */}
          <div className="mt-auto">
            {variant !== "compact" && (
              <div className="flex gap-2 h-9">
                <Button
                  asChild
                  className="flex-1 h-full"
                  size="sm"
                  disabled={!product.availableForSale || !someVariantsAvailable}
                >
                  <Link href={`/products/${product.handle}`}>
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    View Details
                  </Link>
                </Button>
                <WhatsAppButton
                  message={`Hi! I'm interested in ${product.title}. Can you tell me more about it?`}
                  className="px-3 h-full"
                  size="sm"
                />
              </div>
            )}

            {/* Compact variant actions */}
            {variant === "compact" && (
              <div className="flex gap-1 h-8">
                <Button
                  asChild
                  className="flex-1 h-full text-xs"
                  size="sm"
                  variant="outline"
                  disabled={!product.availableForSale || !someVariantsAvailable}
                >
                  <Link href={`/products/${product.handle}`}>View</Link>
                </Button>
                <WhatsAppButton
                  message={`Hi! I'm interested in ${product.title}. Can you tell me more about it?`}
                  className="px-2 h-full"
                  size="sm"
                  variant="outline"
                />
              </div>
            )}
          </div>
        </CardContent>
      </div>

      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-secondary/0 to-accent/0 group-hover:from-primary/5 group-hover:via-secondary/3 group-hover:to-accent/5 transition-all duration-700 pointer-events-none -z-10" />
    </Card>
  );
}
