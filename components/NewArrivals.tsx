import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart } from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  discount?: number;
}

const newArrivals: Product[] = [
  {
    id: "5",
    name: "Vintage Brass Wall Clock",
    price: 89.99,
    originalPrice: 119.99,
    image:
      "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=400&q=60",
    rating: 4.5,
    reviews: 92,
    discount: 25,
  },
  {
    id: "6",
    name: "Ceramic Table Vase Set",
    price: 159.99,
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=60",
    rating: 4.8,
    reviews: 147,
    isNew: true,
  },
  {
    id: "7",
    name: "Woven Pendant Light",
    price: 179.99,
    originalPrice: 229.99,
    image:
      "https://images.unsplash.com/photo-1524634126442-357e0eac3c14?auto=format&fit=crop&w=400&q=60",
    rating: 4.7,
    reviews: 73,
    discount: 22,
  },
  {
    id: "8",
    name: "Modern Canvas Art Print",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=400&q=60",
    rating: 4.6,
    reviews: 184,
    isNew: true,
  },
];

export default function NewArrivals() {
  return (
    <section className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h3 className="text-2xl font-semibold">New Arrivals</h3>
          <p className="text-muted-foreground">
            Latest decoration pieces added to our collection.
          </p>
        </div>
        <Button variant="outline" size="sm">
          View all new items
        </Button>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {newArrivals.map((product) => (
          <Card
            key={product.id}
            className="group cursor-pointer overflow-hidden border-0 shadow-sm hover:shadow-md transition-all"
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {(product.isNew || product.discount) && (
                <div className="absolute top-2 left-2 z-10">
                  {product.isNew && (
                    <Badge className="bg-green-600 hover:bg-green-700">
                      New
                    </Badge>
                  )}
                  {product.discount && (
                    <Badge variant="destructive">-{product.discount}%</Badge>
                  )}
                </div>
              )}
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2 z-10 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-4 space-y-2">
              <h4 className="font-medium text-sm leading-tight line-clamp-2">
                {product.name}
              </h4>
              <div className="flex items-center gap-1 text-xs">
                <div className="flex items-center">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-medium">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">
                  ({product.reviews})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <WhatsAppButton
                  productName={product.name}
                  productPrice={product.price}
                  productImage={product.image}
                  size="sm"
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
