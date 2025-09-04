"use client";

import Link from "next/link";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

type MenuItem = { label: string; href: string };
type Column = { title: string; items: MenuItem[] };

const columns: Column[] = [
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

export default function SecondaryNavbar() {
  return (
    <div className="hidden md:block w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative z-100">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center gap-8">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="group gap-1">
                  Shop By Categories
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-0">
                  <div className="flex w-[280px] sm:w-[600px] lg:w-[800px] xl:w-[1160px] gap-4 lg:gap-8 bg-background p-4 lg:p-6">
                    <div className="grid flex-1 grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                      {columns.map((col) => (
                        <div
                          key={col.title}
                          className="min-w-[140px] lg:min-w-[180px]"
                        >
                          <p className="mb-2 lg:mb-3 text-sm lg:text-base font-semibold">
                            {col.title}
                          </p>
                          <ul className="space-y-2 lg:space-y-3">
                            {col.items.map((item) => (
                              <li key={item.label}>
                                <Link
                                  href={item.href}
                                  className="text-xs lg:text-sm text-foreground/80 transition-colors hover:text-foreground"
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <Link
                      href="/decor"
                      className="hidden xl:block relative overflow-hidden rounded-xl border bg-muted/40 transition-shadow hover:shadow-sm w-[320px] min-h-[360px]"
                    >
                      <Image
                        src="/images/mega-decor.jpg"
                        alt="Home & Decor"
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="relative z-10 p-6 text-white">
                        <p className="text-sm font-medium">Home & Decor</p>
                        <h3 className="mt-2 text-2xl font-bold leading-tight">
                          Decoration From $10
                        </h3>
                        <div className="mt-6 inline-flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900">
                          Shop Now
                        </div>
                      </div>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="group gap-1">
                  Shop By Room
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-4 lg:p-6">
                  <div className="w-[240px] sm:w-[480px] lg:w-[720px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    <MenuLink label="Living Room" href="/room/living" />
                    <MenuLink label="Bedroom" href="/room/bedroom" />
                    <MenuLink label="Dining" href="/room/dining" />
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="group gap-1">
                  Tables & Desks
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-4 lg:p-6">
                  <div className="w-[240px] sm:w-[480px] lg:w-[720px] grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <MenuLink
                      label="Dining Tables"
                      href="/tables-desks/dining"
                    />
                    <MenuLink
                      label="Coffee Tables"
                      href="/tables-desks/coffee"
                    />
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="group gap-1">
                  Theme Features
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-4 lg:p-6">
                  <div className="w-[240px] sm:w-[400px] lg:w-[560px] grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <MenuLink label="Gift Guide" href="/themes/gift-guide" />
                    <MenuLink label="Eco Friendly" href="/themes/eco" />
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/sale" className={navigationMenuTriggerStyle()}>
                  On Sale
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuViewport />
          </NavigationMenu>
        </div>
      </div>
    </div>
  );
}

function MenuLink({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-md p-2 lg:p-3 text-sm lg:text-base text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
    >
      {label}
    </Link>
  );
}
