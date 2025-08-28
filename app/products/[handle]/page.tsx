import { Suspense } from "react";
import { notFound } from "next/navigation";
import { shopifyProducts } from "@/lib/shopify-api";
import { Card, CardContent } from "@/components/ui/card";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";
import RelatedProducts from "@/components/RelatedProducts";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

// Generate static params for popular products
export async function generateStaticParams() {
  try {
    const products = await shopifyProducts.getAll(20);
    return products.products.edges.map((edge) => ({
      handle: edge.node.handle,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Enable dynamic params for products not pre-generated
export const dynamicParams = true;

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  const { handle } = await params;

  try {
    const product = await shopifyProducts.getByHandle(handle);

    if (!product) {
      return {
        title: "Product Not Found | Decoration Store",
        description: "The requested product could not be found.",
      };
    }

    const mainImage = product.images.edges[0]?.node;

    return {
      title: `${product.title} | Decoration Store`,
      description:
        product.description.substring(0, 160) ||
        `Shop ${product.title} at our decoration store.`,
      keywords: [
        product.title,
        product.productType,
        product.vendor,
        ...product.tags,
      ].join(", "),
      openGraph: {
        title: product.title,
        description: product.description,
        images: mainImage
          ? [
              {
                url: mainImage.url,
                width: mainImage.width,
                height: mainImage.height,
                alt: mainImage.altText || product.title,
              },
            ]
          : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.title,
        description: product.description,
        images: mainImage ? [mainImage.url] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product | Decoration Store",
      description: "Shop premium decoration items at our store.",
    };
  }
}

async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;

  try {
    const product = await shopifyProducts.getByHandle(handle);

    if (!product) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <a href="/" className="hover:text-foreground transition-colors">
              Home
            </a>
            <span>/</span>
            <a href="/shop" className="hover:text-foreground transition-colors">
              Shop
            </a>
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
