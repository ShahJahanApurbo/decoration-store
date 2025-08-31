import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">DecoStore</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/location"
              className="flex items-center justify-center p-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
              title="View our location"
            >
              <MapPin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
