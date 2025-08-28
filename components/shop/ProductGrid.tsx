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
    default: "aspect-square",
    compact: "aspect-[4/3]",
    featured: "aspect-[3/4]",
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100/50 animate-pulse">
      <div className={cn("bg-gray-200", skeletonVariants[variant])}></div>
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-3 w-3 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded flex-1"></div>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
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
    desktop: 4,
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
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600">
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
