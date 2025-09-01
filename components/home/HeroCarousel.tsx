"use client";
import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

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
  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={800}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet",
          bulletActiveClass: "swiper-pagination-bullet-active",
        }}
        navigation={{
          nextEl: ".hero-carousel-next",
          prevEl: ".hero-carousel-prev",
        }}
        className="w-full h-[420px] md:h-[520px] rounded-xl overflow-hidden"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full bg-neutral-900 text-white">
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
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        <div className="hero-carousel-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-sm">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </div>

        <div className="hero-carousel-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-sm">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Swiper>

      <style jsx global>{`
        .swiper-pagination {
          bottom: 20px !important;
        }

        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          margin: 0 6px;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active {
          background: white;
          transform: scale(1.2);
        }

        .swiper-pagination-bullet:hover {
          background: rgba(255, 255, 255, 0.8);
        }
      `}</style>
    </div>
  );
}
