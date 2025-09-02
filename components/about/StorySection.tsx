import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface StoryProps {
  features: string[];
}

export default function StorySection({ features }: StoryProps) {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Founded in 2020 with a passion for beautiful living spaces,
                DecoStore started as a small venture with a big dream - to make
                premium home decoration accessible to everyone.
              </p>
              <p>
                What began as a curated collection of carpets and mirrors has
                grown into a comprehensive destination for all your home
                decoration needs. From artificial plants that bring life to any
                corner, to elegant lighting solutions that set the perfect mood.
              </p>
              <p>
                Today, we're proud to serve thousands of customers across the
                region, helping them create homes that truly reflect their
                personality and style.
              </p>
            </div>
          </div>
          <div className="relative">
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">What We Offer</h3>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
