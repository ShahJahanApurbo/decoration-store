"use client";
import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { Slide } from "@/types/carousel";

interface CarouselSlideProps {
  slide: Slide;
  priority?: boolean;
}

export const CarouselSlide: React.FC<CarouselSlideProps> = ({
  slide,
  priority,
}) => {
  return (
    <div className="relative w-full h-full bg-neutral-50">
      <Image
        src={slide.image}
        alt={slide.title}
        fill
        priority={priority}
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 md:px-16">
        {slide.subtitle && (
          <p className="text-xs md:text-sm font-medium mb-4 tracking-wide text-white/90 uppercase">
            {slide.subtitle}
          </p>
        )}
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-10 leading-[0.95] drop-shadow-sm">
          {slide.title}
        </h2>
        {slide.cta && (
          <Button
            className="bg-white text-neutral-900 hover:bg-neutral-100 shadow-lg px-10 py-6 text-base md:text-lg font-medium rounded-full transition-all duration-300"
            size="lg"
          >
            {slide.cta}
          </Button>
        )}
      </div>
    </div>
  );
};
