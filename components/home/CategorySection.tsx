"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useCollections } from "@/lib/hooks/useShopify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { cn } from "@/lib/utils";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

export default function CategorySection() {
  const { data, loading, error } = useCollections(6);

  const collections = data?.collections || [];
  const [activeId, setActiveId] = useState<string>("");

  type CollectionItem = {
    id: string;
    title: string;
    handle: string;
    image?: { url: string; altText?: string } | null;
  };

  const items: CollectionItem[] = useMemo(
    () =>
      collections.map((c: any) => ({
        id: c.id as string,
        title: c.title as string,
        handle: c.handle as string,
        image: c.image || null,
      })),
    [collections]
  );

  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 relative">
        <Swiper
          modules={[Navigation, FreeMode]}
          spaceBetween={16}
          slidesPerView="auto"
          freeMode={{
            enabled: true,
            sticky: false,
          }}
          navigation={{
            nextEl: ".category-carousel-next",
            prevEl: ".category-carousel-prev",
          }}
          className="w-full py-2"
          breakpoints={{
            320: {
              slidesPerView: 2.5,
              spaceBetween: 12,
            },
            480: {
              slidesPerView: 3.5,
              spaceBetween: 16,
            },
            640: {
              slidesPerView: 4.5,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 5.5,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 6.5,
              spaceBetween: 24,
            },
          }}
        >
          {loading &&
            [...Array(8)].map((_, i) => (
              <SwiperSlide key={i} className="!w-[140px]">
                <div className="size-28 rounded-full bg-gray-100 animate-pulse mx-auto" />
              </SwiperSlide>
            ))}
          {!loading && !error && items.length === 0 && (
            <div className="text-sm text-gray-500 px-4">No categories</div>
          )}
          {!loading &&
            !error &&
            items.map((item: CollectionItem) => {
              const active = activeId === item.id;
              return (
                <SwiperSlide key={item.id} className="!w-[140px]">
                  <Link
                    href={`/shop?category=${item.handle}`}
                    onClick={() => setActiveId(item.id)}
                    className="group flex flex-col items-center focus:outline-none py-2"
                  >
                    <div
                      className={cn(
                        "relative flex items-center justify-center size-28 rounded-full bg-gray-100 text-sm font-medium transition-all ring-2 ring-transparent select-none",
                        active && " text-white  shadow-md scale-105",
                        !active &&
                          "hover:ring-gray-300 hover:shadow-sm hover:scale-[1.03]"
                      )}
                    >
                      {item.image ? (
                        <Image
                          src={item.image.url}
                          alt={item.image.altText || item.title}
                          width={72}
                          height={72}
                          className="object-contain max-h-20 w-auto"
                        />
                      ) : (
                        <span className="text-xs text-gray-500">No Image</span>
                      )}
                    </div>
                    <span
                      className={cn(
                        "mt-3 text-center text-[13px] font-medium text-gray-800 line-clamp-2 leading-snug",
                        active && "text-gray-700"
                      )}
                    >
                      {item.title}
                    </span>
                  </Link>
                </SwiperSlide>
              );
            })}

          {/* Custom Navigation Buttons */}
          <div className="category-carousel-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 shadow-md text-gray-700 hover:bg-gray-50 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200">
            <svg
              className="w-4 h-4"
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

          <div className="category-carousel-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 shadow-md text-gray-700 hover:bg-gray-50 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200">
            <svg
              className="w-4 h-4"
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
      </div>
    </section>
  );
}
