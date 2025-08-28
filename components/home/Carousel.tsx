"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

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

export default function Carousel() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      6000
    );
    return () => clearInterval(id);
  }, [playing]);

  const slide = slides[index];

  return (
    <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden rounded-xl bg-neutral-900 text-white">
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            priority={i === index}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 max-w-2xl px-8 md:px-16 py-12 md:py-20 flex flex-col gap-4 h-full justify-center">
            <p
              className="text-sm font-medium tracking-wide opacity-90"
              style={{ color: s.accent }}
            >
              {s.subtitle}
            </p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              {s.title}
            </h2>
            {s.cta && (
              <button
                className="mt-2 px-5 py-3 w-fit rounded-full text-sm font-medium shadow bg-white text-neutral-900 hover:shadow-lg transition"
                style={{ color: "#111" }}
              >
                {s.cta} →
              </button>
            )}
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {slides.map((s, i) => (
          <button
            aria-label={`Go to slide ${i + 1}`}
            key={s.id}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
        <button
          aria-label="Previous"
          onClick={() =>
            setIndex((i) => (i - 1 + slides.length) % slides.length)
          }
          className="ml-4 text-white/70 hover:text-white text-lg"
        >
          ‹
        </button>
        <button
          aria-label="Next"
          onClick={() => setIndex((i) => (i + 1) % slides.length)}
          className="text-white/70 hover:text-white text-lg"
        >
          ›
        </button>
        <button
          aria-label={playing ? "Pause" : "Play"}
          onClick={() => setPlaying((p) => !p)}
          className="ml-2 text-white/70 hover:text-white text-sm"
        >
          {playing ? "❚❚" : "▶"}
        </button>
      </div>
    </div>
  );
}
