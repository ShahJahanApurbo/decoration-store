import { Suspense } from "react";
import ShopContent from "@/components/ShopContent";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div>Loading...</div>}>
        <ShopContent />
      </Suspense>

      {/* Floating WhatsApp Button */}
      <WhatsAppButton floating />
    </div>
  );
}
