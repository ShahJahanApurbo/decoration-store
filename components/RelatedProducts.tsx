import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, isOnSale, getDiscountPercentage } from "@/lib/utils";
import { shopifyProducts } from "@/lib/shopify-api";
import { ShopifyProduct } from "@/lib/shopify";
import { cn } from "@/lib/utils";

interface RelatedProductsProps {
  currentProduct: ShopifyProduct;
  productType?: string;
  tags?: string[];
}

async function RelatedProductsList({
  currentProduct,
  productType,
  tags,
}: RelatedProductsProps) {
  try {
    // Get products to find related ones
    const products = await shopifyProducts.getAll(50);

    // Filter related products based on product type and tags
    const relatedProducts = products.products.edges
      .map((edge) => edge.node)
      .filter((product) => {
        // Exclude current product
        if (product.id === currentProduct.id) return false;

        // Match by product type
        if (product.productType === productType) return true;

        // Match by tags (if at least one tag matches)
        if (tags && tags.length > 0) {
          const hasMatchingTag = product.tags.some((tag) => tags.includes(tag));
          if (hasMatchingTag) return true;
        }

        return false;
      })
      .slice(0, 4); // Limit to 4 related products

    if (relatedProducts.length === 0) {
      return null;
    }

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">
          Related Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <RelatedProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading related products:", error);
    return null;
  }
}

function RelatedProductCard({ product }: { product: ShopifyProduct }) {
  const mainImage = product.images.edges[0]?.node;
  const firstVariant = product.variants.edges[0]?.node;

  if (!firstVariant) return null;

  const currentPrice = firstVariant.price.amount;
  const compareAtPrice = firstVariant.compareAtPrice?.amount;
  const onSale = isOnSale(currentPrice, compareAtPrice);
  const discountPercentage = compareAtPrice
    ? getDiscountPercentage(currentPrice, compareAtPrice)
    : 0;

  return (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <Link href={`/products/${product.handle}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={mainImage.altText || product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="w-12 h-12 bg-muted-foreground/20 rounded-full mx-auto mb-2"></div>
                <p className="text-xs">No image</p>
              </div>
            </div>
          )}

          {/* Sale Badge */}
          {onSale && (
            <Badge
              variant="destructive"
              className="absolute top-2 left-2 text-xs font-medium"
            >
              {discountPercentage}% OFF
            </Badge>
          )}

          {/* Availability Badge */}
          {!firstVariant.availableForSale && (
            <Badge
              variant="secondary"
              className="absolute top-2 right-2 text-xs"
            >
              Out of Stock
            </Badge>
          )}
        </div>

        <CardContent className="p-4 space-y-2">
          {/* Product Title */}
          <h3 className="font-medium text-foreground line-clamp-2 text-sm leading-tight group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              {formatPrice(currentPrice, firstVariant.price.currencyCode)}
            </span>
            {onSale && compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(compareAtPrice, firstVariant.price.currencyCode)}
              </span>
            )}
          </div>

          {/* Product Type */}
          {product.productType && (
            <Badge variant="outline" className="text-xs">
              {product.productType}
            </Badge>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}

export default function RelatedProducts(props: RelatedProductsProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-square bg-muted animate-pulse"></div>
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      }
    >
      <RelatedProductsList {...props} />
    </Suspense>
  );
}
