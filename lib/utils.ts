import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format price with currency symbol and proper decimal places
 */
export function formatPrice(amount: string, currencyCode: string = 'USD'): string {
  const price = parseFloat(amount);
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Format price for display without currency symbol
 */
export function formatPriceAmount(amount: string): string {
  const price = parseFloat(amount);
  return price.toFixed(2);
}

/**
 * Check if a price represents a sale (compare at price is higher than current price)
 */
export function isOnSale(price: string, compareAtPrice?: string): boolean {
  if (!compareAtPrice) return false;
  return parseFloat(compareAtPrice) > parseFloat(price);
}

/**
 * Calculate discount percentage
 */
export function getDiscountPercentage(price: string, compareAtPrice: string): number {
  const currentPrice = parseFloat(price);
  const originalPrice = parseFloat(compareAtPrice);
  
  if (originalPrice <= currentPrice) return 0;
  
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}
