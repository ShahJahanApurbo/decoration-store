import Link from "next/link";
import { WhatsAppContact } from "@/components/WhatsAppButton";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-semibold mb-3">DecoStore</h3>
            <p className="text-sm text-muted-foreground">
              Transform your space with premium home decoration items.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Carpets
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Plants
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Mirrors
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Lamps
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Shipping
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Returns
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <WhatsAppContact />
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Follow Us</h4>
            <div className="flex gap-2">
              <button className="p-2 bg-background border rounded-md hover:bg-muted transition-colors">
                📘
              </button>
              <button className="p-2 bg-background border rounded-md hover:bg-muted transition-colors">
                📷
              </button>
              <button className="p-2 bg-background border rounded-md hover:bg-muted transition-colors">
                🐦
              </button>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-4 text-center text-sm text-muted-foreground">
          © 2025 DecoStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
