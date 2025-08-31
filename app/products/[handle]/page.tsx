import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { shopifyConfig } from "@/lib/shopify";
import { Card, CardContent } from "@/components/ui/card";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductGallery from "@/components/shop/product/ProductGallery";
import ProductInfo from "@/components/shop/product/ProductInfo";
import RelatedProducts from "@/components/shop/product/RelatedProducts";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

// Simple product fetching function
async function fetchProduct(handle: string) {
  if (!shopifyConfig.domain || !shopifyConfig.storefrontAccessToken) {
    throw new Error("Shopify configuration missing");
  }

  // Use our API route
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    }/api/products/${handle}`,
    {
      // Add cache control for ISR
      next: { revalidate: 3600 }, // Revalidate every hour
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch product");
  }

  const result = await response.json();
  return result.success ? result.data : null;
}

// Enable dynamic params
export const dynamicParams = true;

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  const { handle } = await params;

  try {
    const product = await fetchProduct(handle);

    if (!product) {
      return {
        title: "Product Not Found | Decoration Store",
        description: "The requested product could not be found.",
      };
    }

    return {
      title: `${product.title} | Decoration Store`,
      description:
        product.description || `Shop ${product.title} at our decoration store`,
      openGraph: {
        title: product.title,
        description: product.description,
        images:
          product.images?.edges?.length > 0
            ? [
                {
                  url: product.images.edges[0].node.url,
                  width: product.images.edges[0].node.width,
                  height: product.images.edges[0].node.height,
                  alt: product.images.edges[0].node.altText || product.title,
                },
              ]
            : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product | Decoration Store",
      description: "Shop our collection of home decoration items",
    };
  }
}

async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;

  try {
    const product = await fetchProduct(handle);

    if (!product) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/shop"
              className="hover:text-foreground transition-colors"
            >
              Shop
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.title}</span>
          </nav>

          {/* Product Details */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Product Gallery */}
            <div className="space-y-4">
              <ProductGallery product={product} />
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              <ProductInfo product={product} />
            </div>
          </div>

          {/* Product Description */}
          {product.description && (
            <Card className="mb-12">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <div
                  className="prose prose-gray max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </CardContent>
            </Card>
          )}

          {/* Related Products */}
          <div className="mb-12">
            <Suspense
              fallback={
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">
                    Loading related products...
                  </p>
                </div>
              }
            >
              <RelatedProducts
                currentProduct={product}
                productType={product.productType}
                tags={product.tags}
              />
            </Suspense>
          </div>
        </div>

        {/* Floating WhatsApp Button */}
        <WhatsAppButton floating />
      </div>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    notFound();
  }
}

export default ProductPage;
