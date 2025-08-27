import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import NewArrivals from "@/components/NewArrivals";
import WhatsAppButton, { WhatsAppContact } from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-16">
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Category Section */}
        <CategorySection />

        {/* Featured Products */}
        <FeaturedProducts />

        {/* New Arrivals */}
        <NewArrivals />
      </main>

      {/* Floating WhatsApp Button */}
      <WhatsAppButton floating />
    </div>
  );
}
