"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { ReactNode } from "react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

interface SwiperComponentProps {
  children: ReactNode[];
  spaceBetween?: number;
  slidesPerView?: number;
  pagination?: boolean;
  autoplay?: boolean | { delay: number; disableOnInteraction?: boolean };
  breakpoints?: {
    [width: number]: {
      slidesPerView: number;
      spaceBetween?: number;
    };
  };
  className?: string;
  showOnMobile?: boolean;
}

export default function SwiperComponent({
  children,
  spaceBetween = 20,
  slidesPerView = 1,
  pagination = true,
  autoplay = { delay: 3000, disableOnInteraction: false },
  breakpoints = {
    480: {
      slidesPerView: 2,
      spaceBetween: 15,
    },
  },
  className = "",
  showOnMobile = true,
}: SwiperComponentProps) {
  const wrapperClass = showOnMobile ? "md:hidden" : "";

  return (
    <div className={wrapperClass}>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        pagination={
          pagination
            ? {
                clickable: true,
                dynamicBullets: true,
              }
            : false
        }
        autoplay={autoplay}
        breakpoints={breakpoints}
        className={`custom-swiper ${className}`}
      >
        {children.map((child, index) => (
          <SwiperSlide key={index}>
            <div className="mx-2">{child}</div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
