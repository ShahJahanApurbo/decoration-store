import Link from "next/link";
import { MapPin } from "lucide-react";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu - Left side */}
          <div className="flex items-center space-x-3 md:hidden">
            <MobileMenu />
          </div>

          {/* Logo - Center on mobile, left on desktop */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl font-bold">DecoStore</span>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
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

          {/* Find Store - Always visible */}
          <div className="flex items-center">
            <Link
              href="/location"
              className="flex items-center justify-center p-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
              title="View our location"
            >
              <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-1" />
              <span className="hidden sm:inline">Find Store</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
