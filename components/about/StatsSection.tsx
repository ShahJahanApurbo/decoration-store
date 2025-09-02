import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import SwiperComponent from "@/components/ui/swiper-component";

interface StatItem {
  icon: LucideIcon;
  number: string;
  label: string;
  description: string;
}

interface StatsProps {
  stats: StatItem[];
}

export default function StatsSection({ stats }: StatsProps) {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        {/* Desktop Grid - Hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="text-center p-6 hover:shadow-lg transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Swiper */}
        <SwiperComponent
          breakpoints={{
            480: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
          }}
        >
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="text-center p-6 hover:shadow-lg transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </SwiperComponent>
      </div>
    </section>
  );
}
