"use client";

import dynamic from "next/dynamic";

// Dynamically import the Map component to avoid SSR issues
const Map = dynamic(() => import("@/components/location/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">Loading map...</div>
  ),
});

export default function LocationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Visit Our Store</h1>
        <p className="text-muted-foreground text-center mb-8">
          Find us at Dragon Mart 2, Dubai
        </p>

        <div className="bg-card rounded-lg border shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Store Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Address</h3>
              <p className="text-muted-foreground">
                Dragon Mart 2<br />
                Dubai, United Arab Emirates
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Store Hours</h3>
              <p className="text-muted-foreground">
                Daily: 10:00 AM - 10:00 PM
                <br />
                Friday: 2:00 PM - 10:00 PM
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <div className="h-96 w-full">
            <Map />
          </div>
        </div>
      </div>
    </div>
  );
}
