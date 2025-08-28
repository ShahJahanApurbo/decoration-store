"use client";

import { useState } from "react";
import { Star, Heart, Share2, ShoppingCart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, isOnSale, getDiscountPercentage } from "@/lib/utils";
import { ShopifyProduct } from "@/lib/shopify";
import { cn } from "@/lib/utils";

interface ProductInfoProps {
  product: ShopifyProduct;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const variants = product.variants.edges.map((edge) => edge.node);
  const selectedVariant = variants[selectedVariantIndex];

  const currentPrice = selectedVariant.price.amount;
  const compareAtPrice = selectedVariant.compareAtPrice?.amount;
  const onSale = isOnSale(currentPrice, compareAtPrice);
  const discountPercentage = compareAtPrice
    ? getDiscountPercentage(currentPrice, compareAtPrice)
    : 0;

  // Group variants by option (e.g., size, color)
  const options = product.options || [];

  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      setQuantity((prev) => prev + 1);
    } else {
      setQuantity((prev) => Math.max(1, prev - 1));
    }
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log("Adding to cart:", {
      variantId: selectedVariant.id,
      quantity,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description.substring(0, 100) + "...",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Title and Vendor */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {product.vendor && (
            <Badge variant="secondary" className="text-xs">
              {product.vendor}
            </Badge>
          )}
          {product.productType && (
            <Badge variant="outline" className="text-xs">
              {product.productType}
            </Badge>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          {product.title}
        </h1>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-foreground">
            {formatPrice(currentPrice, selectedVariant.price.currencyCode)}
          </span>
          {onSale && compareAtPrice && (
            <>
              <span className="text-xl text-muted-foreground line-through">
                {formatPrice(
                  compareAtPrice,
                  selectedVariant.price.currencyCode
                )}
              </span>
              <Badge variant="destructive" className="text-xs">
                {discountPercentage}% OFF
              </Badge>
            </>
          )}
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              selectedVariant.availableForSale ? "bg-green-500" : "bg-red-500"
            )}
          />
          <span className="text-sm text-muted-foreground">
            {selectedVariant.availableForSale ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      {/* Product Options */}
      {options.length > 0 && (
        <div className="space-y-4">
          {options.map((option) => (
            <div key={option.id}>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {option.name}
              </label>
              <div className="flex flex-wrap gap-2">
                {option.values.map((value, index) => (
                  <Button
                    key={`${option.id}-${value}`}
                    variant={
                      selectedVariantIndex === index ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedVariantIndex(index)}
                    className="h-10 px-4"
                  >
                    {value}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Quantity</label>
        <div className="flex items-center gap-3">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-r-none"
              onClick={() => handleQuantityChange(false)}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="h-10 w-16 flex items-center justify-center border-x text-center font-medium">
              {quantity}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-l-none"
              onClick={() => handleQuantityChange(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          className="w-full h-12 text-base font-medium"
          onClick={handleAddToCart}
          disabled={!selectedVariant.availableForSale}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {selectedVariant.availableForSale ? "Add to Cart" : "Out of Stock"}
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12"
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <Heart
              className={cn(
                "h-5 w-5",
                isWishlisted && "fill-current text-red-500"
              )}
            />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Product Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {product.tags.slice(0, 6).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Product Details Card */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-medium text-foreground">Product Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Vendor:</span>
              <span className="ml-2 text-foreground">{product.vendor}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Type:</span>
              <span className="ml-2 text-foreground">
                {product.productType}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">SKU:</span>
              <span className="ml-2 text-foreground">
                {selectedVariant.id.split("/").pop()}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Availability:</span>
              <span
                className={cn(
                  "ml-2",
                  selectedVariant.availableForSale
                    ? "text-green-600"
                    : "text-red-600"
                )}
              >
                {selectedVariant.availableForSale ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
