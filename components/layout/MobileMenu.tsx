"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, MapPin, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface MenuItem {
  label: string;
  href: string;
}

interface CategoryColumn {
  title: string;
  items: MenuItem[];
}

const categoryColumns: CategoryColumn[] = [
  {
    title: "Furniture",
    items: [
      { label: "Sofas", href: "/furniture/sofas" },
      { label: "Tables & Desks", href: "/furniture/tables-desks" },
      { label: "Chair & Stools", href: "/furniture/chairs-stools" },
      { label: "Shelves", href: "/furniture/shelves" },
      { label: "Shop All", href: "/furniture" },
    ],
  },
  {
    title: "Table & Desks",
    items: [
      { label: "Dining Tables", href: "/tables-desks/dining" },
      { label: "Coffee Table", href: "/tables-desks/coffee" },
      { label: "Side Tables", href: "/tables-desks/side" },
      { label: "Work Desk", href: "/tables-desks/work" },
      { label: "Table Lamps", href: "/tables-desks/lamps" },
      { label: "Shop All", href: "/tables-desks" },
    ],
  },
  {
    title: "Chair & Stools",
    items: [
      { label: "Dining Chairs", href: "/chairs-stools/dining-chairs" },
      { label: "Bar Stools", href: "/chairs-stools/bar-stools" },
      { label: "Office Chairs", href: "/chairs-stools/office" },
      { label: "Arm Chairs", href: "/chairs-stools/arm-chairs" },
      { label: "Shop All", href: "/chairs-stools" },
    ],
  },
  {
    title: "Home & Decor",
    items: [
      { label: "Rugs", href: "/decor/rugs" },
      { label: "Candles", href: "/decor/candles" },
      { label: "Wall Decors", href: "/decor/wall" },
      { label: "Mirrors", href: "/decor/mirrors" },
      { label: "Ottomans", href: "/decor/ottomans" },
      { label: "Floor Lamps", href: "/decor/floor-lamps" },
      { label: "Pillows", href: "/decor/pillows" },
      { label: "Shop All", href: "/decor" },
    ],
  },
];

const roomCategories = [
  { label: "Living Room", href: "/room/living" },
  { label: "Bedroom", href: "/room/bedroom" },
  { label: "Dining", href: "/room/dining" },
];

const tableCategories = [
  { label: "Dining Tables", href: "/tables-desks/dining" },
  { label: "Coffee Tables", href: "/tables-desks/coffee" },
];

const themeCategories = [
  { label: "Gift Guide", href: "/themes/gift-guide" },
  { label: "Eco Friendly", href: "/themes/eco" },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleLinkClick = () => {
    setIsOpen(false);
    setExpandedSection(null);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            aria-label="Toggle menu"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-[280px] sm:w-[350px] p-0">
          <SheetHeader className="border-b p-4">
            <SheetTitle className="text-left">
              <Link href="/" onClick={handleLinkClick}>
                DecoStore
              </Link>
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full">
            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6">
                {/* Main Navigation */}
                <div className="space-y-3">
                  <Link
                    href="/"
                    onClick={handleLinkClick}
                    className="block py-2 text-lg font-medium transition-colors hover:text-primary"
                  >
                    Home
                  </Link>
                  <Link
                    href="/shop"
                    onClick={handleLinkClick}
                    className="block py-2 text-lg font-medium transition-colors hover:text-primary"
                  >
                    Shop
                  </Link>
                  <Link
                    href="/about"
                    onClick={handleLinkClick}
                    className="block py-2 text-lg font-medium transition-colors hover:text-primary"
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    onClick={handleLinkClick}
                    className="block py-2 text-lg font-medium transition-colors hover:text-primary"
                  >
                    Contact
                  </Link>
                </div>

                {/* Categories Section */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => toggleSection("categories")}
                    className="flex w-full items-center justify-between py-2 text-lg font-medium"
                  >
                    Shop By Categories
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        expandedSection === "categories" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedSection === "categories" && (
                    <div className="mt-3 space-y-4 pl-4">
                      {categoryColumns.map((column) => (
                        <div key={column.title}>
                          <h4 className="mb-2 font-semibold text-sm text-muted-foreground">
                            {column.title}
                          </h4>
                          <div className="space-y-2">
                            {column.items.map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                onClick={handleLinkClick}
                                className="block py-1 text-sm transition-colors hover:text-primary"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Room Section */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => toggleSection("rooms")}
                    className="flex w-full items-center justify-between py-2 text-lg font-medium"
                  >
                    Shop By Room
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        expandedSection === "rooms" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedSection === "rooms" && (
                    <div className="mt-3 space-y-2 pl-4">
                      {roomCategories.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={handleLinkClick}
                          className="block py-1 text-sm transition-colors hover:text-primary"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tables & Desks Section */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => toggleSection("tables")}
                    className="flex w-full items-center justify-between py-2 text-lg font-medium"
                  >
                    Tables & Desks
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        expandedSection === "tables" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedSection === "tables" && (
                    <div className="mt-3 space-y-2 pl-4">
                      {tableCategories.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={handleLinkClick}
                          className="block py-1 text-sm transition-colors hover:text-primary"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Theme Features Section */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => toggleSection("themes")}
                    className="flex w-full items-center justify-between py-2 text-lg font-medium"
                  >
                    Theme Features
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        expandedSection === "themes" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedSection === "themes" && (
                    <div className="mt-3 space-y-2 pl-4">
                      {themeCategories.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={handleLinkClick}
                          className="block py-1 text-sm transition-colors hover:text-primary"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sale Link */}
                <div className="border-t pt-4">
                  <Link
                    href="/sale"
                    onClick={handleLinkClick}
                    className="block py-2 text-lg font-medium text-red-600 transition-colors hover:text-red-500"
                  >
                    On Sale
                  </Link>
                </div>
              </div>
            </nav>

            {/* Footer with Location */}
            <div className="border-t p-4 mt-auto">
              <Link
                href="/location"
                onClick={handleLinkClick}
                className="flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-primary"
              >
                <MapPin className="h-4 w-4" />
                Find Store
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
