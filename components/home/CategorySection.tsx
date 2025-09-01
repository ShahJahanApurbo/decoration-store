"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useCollections } from "@/lib/hooks/useShopify";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

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
        <Carousel
          opts={{ align: "start", dragFree: true, containScroll: "trimSnaps" }}
          className="w-full"
        >
          <CarouselContent className="py-2 flex justify-center items-center">
            {loading &&
              [...Array(8)].map((_, i) => (
                <CarouselItem key={i} className="basis-[140px] pl-16">
                  <div className="size-28 rounded-full bg-gray-100 animate-pulse mx-auto" />
                </CarouselItem>
              ))}
            {!loading && !error && items.length === 0 && (
              <p className="text-sm text-gray-500 px-4">No categories</p>
            )}
            {!loading &&
              !error &&
              items.map((item: CollectionItem) => {
                const active = activeId === item.id;
                return (
                  <CarouselItem key={item.id} className="basis-[140px]">
                    <Link
                      href={`/shop?category=${item.handle}`}
                      onClick={() => setActiveId(item.id)}
                      className="group flex flex-col items-center focus:outline-none"
                    >
                      <div
                        className={cn(
                          "relative flex items-center justify-center size-28 rounded-full bg-gray-100 text-sm font-medium transition-all ring-2 ring-transparent select-none",
                          active &&
                            "bg-gray-600 text-white ring-gray-600 shadow-md scale-105",
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
                          <span className="text-xs text-gray-500">
                            No Image
                          </span>
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
                  </CarouselItem>
                );
              })}
          </CarouselContent>
          <CarouselPrevious className="-left-2 top-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow-md text-gray-700 hover:bg-white" />
          <CarouselNext className="-right-2 top-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow-md text-gray-700 hover:bg-white" />
        </Carousel>
      </div>
    </section>
  );
}
