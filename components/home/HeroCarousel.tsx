"use client";
import * as React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { CarouselSlide } from "@/components/carousel/CarouselSlide";
import { CarouselNavButton } from "@/components/carousel/CarouselNavButton";
import { CarouselErrorBoundary } from "@/components/carousel/CarouselErrorBoundary";
import { CAROUSEL_CONFIG } from "@/constants/carousel";
import type { CarouselProps } from "@/types/carousel";
import { defaultSlides } from "@/data/slides";
import styles from "./HeroCarousel.module.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const HeroCarousel: React.FC<CarouselProps> = ({
  slides = defaultSlides,
  autoplayDelay = CAROUSEL_CONFIG.AUTOPLAY_DELAY,
  className = "",
}) => {
  const [swiperInstance, setSwiperInstance] = React.useState<SwiperType | null>(
    null
  );

  const handleSwiperInit = React.useCallback(
    (swiper: SwiperType) => {
      setSwiperInstance(swiper);
      const paginationEl = swiper.el.querySelector(`.${styles.pagination}`);
      if (paginationEl) {
        (paginationEl as HTMLElement).style.setProperty(
          "--hero-delay",
          `${autoplayDelay}ms`
        );
      }
    },
    [autoplayDelay]
  );

  const handleSlideChange = React.useCallback((swiper: SwiperType) => {
    // Reset all progress bars
    const bullets = swiper.el.querySelectorAll(`.${styles.progressBar}`);
    bullets.forEach((bullet) => {
      (bullet as HTMLElement).style.width = "0%";
    });

    // Ensure autoplay continues if it was paused
    if (!swiper.autoplay.running) {
      swiper.autoplay.start();
    }
  }, []);

  const handleAutoplayStop = React.useCallback((swiper: SwiperType) => {
    // Restart autoplay after a brief delay to prevent getting stuck
    setTimeout(() => {
      if (swiper.autoplay && !swiper.destroyed) {
        swiper.autoplay.start();
      }
    }, 100);
  }, []);

  const renderPaginationBullet = React.useCallback(
    (_index: number, className: string) => {
      return `<span class="${className}"><span class='${styles.progressBar}'></span></span>`;
    },
    []
  );

  return (
    <div className={`w-full h-[500px] md:h-[600px] ${className}`}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop
        autoplay={{
          delay: autoplayDelay,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          waitForTransition: false,
        }}
        speed={CAROUSEL_CONFIG.TRANSITION_SPEED}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        pagination={{
          el: `.${styles.pagination}`,
          clickable: true,
          renderBullet: renderPaginationBullet,
        }}
        navigation={{
          nextEl: ".hero-carousel-next",
          prevEl: ".hero-carousel-prev",
        }}
        onInit={handleSwiperInit}
        onSlideChange={handleSlideChange}
        onAutoplayStop={handleAutoplayStop}
        onAutoplayTimeLeft={(swiper, time, progress) => {
          // Update progress bar animation in real-time
          const activeBullet = swiper.el.querySelector(
            `.swiper-pagination-bullet-active .${styles.progressBar}`
          ) as HTMLElement;
          if (activeBullet) {
            activeBullet.style.width = `${(1 - progress) * 100}%`;
          }
        }}
        className="relative w-full rounded-2xl overflow-hidden shadow-lg"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <CarouselSlide slide={slide} priority={index === 0} />
          </SwiperSlide>
        ))}
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 md:gap-6">
          <CarouselNavButton direction="prev" className="hero-carousel-prev" />
          <div className={`${styles.pagination} flex items-center`} />
          <CarouselNavButton direction="next" className="hero-carousel-next" />
        </div>
      </Swiper>
    </div>
  );
};

export default function HeroCarouselWithBoundary(props: CarouselProps) {
  return (
    <CarouselErrorBoundary>
      <HeroCarousel {...props} />
    </CarouselErrorBoundary>
  );
}
