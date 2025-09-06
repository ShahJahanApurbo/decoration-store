"use client";

import { ProductCard } from "./index";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: any[];
  className?: string;
  variant?: "default" | "compact" | "featured";
  columns?: {
    mobile?: 1 | 2;
    tablet?: 2 | 3 | 4;
    desktop?: 3 | 4 | 5 | 6;
  };
  showQuickView?: boolean;
  loading?: boolean;
  loadingCount?: number;
}

const LoadingSkeleton = ({
  variant = "default",
}: {
  variant?: "default" | "compact" | "featured";
}) => {
  const skeletonVariants = {
    default: "aspect-square rounded-t-2xl",
    compact: "aspect-[4/3] rounded-t-xl",
    featured: "aspect-[3/4] rounded-t-3xl",
  };

  const cardVariants = {
    default: "rounded-2xl",
    compact: "rounded-xl",
    featured: "rounded-3xl",
  };

  return (
    <div
      className={cn(
        "overflow-hidden bg-card shadow-sm border border-border/50 animate-pulse h-full flex flex-col",
        cardVariants[variant]
      )}
    >
      <div
        className={cn("bg-muted/50 flex-shrink-0", skeletonVariants[variant])}
      ></div>
      <div className="p-4 space-y-3 flex-grow">
        <div className="h-3 bg-muted/50 rounded w-1/4"></div>
        <div className="h-4 bg-muted/50 rounded w-3/4"></div>
        <div className="h-3 bg-muted/50 rounded w-1/2"></div>
        <div className="flex items-center gap-1 mb-2">
          <div className="h-3 w-3 bg-muted/50 rounded"></div>
          <div className="h-3 bg-muted/50 rounded w-16"></div>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-3 w-3 bg-muted/50 rounded"></div>
          ))}
        </div>
        <div className="h-5 bg-muted/50 rounded w-1/3"></div>
        <div className="flex gap-2 mt-auto">
          <div className="h-9 bg-muted/50 rounded flex-1"></div>
          <div className="h-9 w-9 bg-muted/50 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default function ProductGrid({
  products,
  className,
  variant = "default",
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  },
  showQuickView = true,
  loading = false,
  loadingCount = 8,
}: ProductGridProps) {
  const getGridClasses = () => {
    const mobileClass = columns.mobile === 1 ? "grid-cols-1" : "grid-cols-2";
    const tabletClass =
      columns.tablet === 2
        ? "md:grid-cols-2"
        : columns.tablet === 3
        ? "md:grid-cols-3"
        : "md:grid-cols-4";
    const desktopClass =
      columns.desktop === 3
        ? "lg:grid-cols-3"
        : columns.desktop === 4
        ? "lg:grid-cols-4"
        : columns.desktop === 5
        ? "lg:grid-cols-5"
        : columns.desktop === 6
        ? "lg:grid-cols-6"
        : "lg:grid-cols-4";

    return cn("grid gap-6", mobileClass, tabletClass, desktopClass);
  };

  if (loading) {
    return (
      <div className={cn(getGridClasses(), className)}>
        {Array.from({ length: loadingCount }).map((_, index) => (
          <LoadingSkeleton key={index} variant={variant} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No products found
          </h3>
          <p className="text-muted-foreground">
            We couldn't find any products matching your criteria. Try adjusting
            your filters or search terms.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(getGridClasses(), className)}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          variant={variant}
          showQuickView={showQuickView}
        />
      ))}
    </div>
  );
}
