"use client";
import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  cta?: string;
  image: string;
  accent?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Elevate Every Corner",
    subtitle: "Premium Carpets For Cozy Living",
    cta: "Shop Carpets",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    accent: "#b45309",
  },
  {
    id: 2,
    title: "Green That Never Fades",
    subtitle: "Artificial Plants • Zero Maintenance",
    cta: "Browse Plants",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80",
    accent: "#047857",
  },
  {
    id: 3,
    title: "Reflect Your Style",
    subtitle: "Modern Mirrors & Ambient Lamps",
    cta: "Find Your Glow",
    image:
      "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1600&q=80",
    accent: "#4f46e5",
  },
];

export default function HeroCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden rounded-xl bg-neutral-900 text-white">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 max-w-2xl px-8 md:px-16 py-12 md:py-20 flex flex-col gap-4 h-full justify-center">
                <p
                  className="text-sm font-medium tracking-wide opacity-90"
                  style={{ color: slide.accent }}
                >
                  {slide.subtitle}
                </p>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                  {slide.title}
                </h2>
                {slide.cta && (
                  <Button
                    className="mt-2 w-fit bg-white text-neutral-900 hover:bg-neutral-100"
                    size="lg"
                  >
                    {slide.cta} →
                  </Button>
                )}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
}
