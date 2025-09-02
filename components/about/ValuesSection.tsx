import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import SwiperComponent from "@/components/ui/swiper-component";

interface ValueItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ValuesProps {
  values: ValueItem[];
}

export default function ValuesSection({ values }: ValuesProps) {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These core principles guide everything we do and shape the way we
            serve our customers.
          </p>
        </div>

        {/* Desktop Grid - Hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <Card
              key={index}
              className="text-center p-6 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Swiper */}
        <SwiperComponent
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            480: {
              slidesPerView: 1.2,
              spaceBetween: 15,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
          }}
          className="values-swiper"
        >
          {values.map((value, index) => (
            <Card
              key={index}
              className="text-center p-6 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </SwiperComponent>
      </div>
    </section>
  );
}
