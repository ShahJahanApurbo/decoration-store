"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  whatsappConfig,
  formatPhoneNumber,
  generateWhatsAppURL,
} from "@/lib/whatsapp-config";

interface WhatsAppButtonProps {
  productName?: string;
  productPrice?: number;
  productImage?: string;
  message?: string;
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  floating?: boolean;
  phoneNumber?: string;
}

export default function WhatsAppButton({
  productName,
  productPrice,
  productImage,
  message,
  className,
  variant = "default",
  size = "default",
  floating = false,
  phoneNumber = whatsappConfig.phoneNumber,
}: WhatsAppButtonProps) {
  const generateWhatsAppMessage = () => {
    if (message) {
      return message;
    }

    if (productName) {
      let whatsappMessage = `Hi! I'm interested in the "${productName}"`;

      if (productPrice) {
        whatsappMessage += ` priced at $${productPrice}`;
      }

      whatsappMessage += `. Could you please provide more details and help me with the purchase?`;

      if (productImage) {
        whatsappMessage += `\n\nProduct Image: ${productImage}`;
      }

      return whatsappMessage;
    }

    return whatsappConfig.defaultMessages.general;
  };

  const handleWhatsAppClick = () => {
    const whatsappMessage = generateWhatsAppMessage();
    const whatsappUrl = generateWhatsAppURL(phoneNumber, whatsappMessage);

    // Open in new tab
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (floating) {
    return (
      <Button
        onClick={handleWhatsAppClick}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-green-500 hover:bg-green-600 text-white",
          className
        )}
        size="icon"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleWhatsAppClick}
      variant={variant}
      size={size}
      className={cn(
        "bg-green-500 hover:bg-green-600 text-white",
        variant === "outline" &&
          "border-green-500 text-green-600 hover:bg-green-500 hover:text-white",
        className
      )}
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      {size === "icon" ? null : "Buy via WhatsApp"}
    </Button>
  );
}

// Quick Contact Component for contact information
export function WhatsAppContact({
  phoneNumber = whatsappConfig.phoneNumber,
  className,
}: {
  phoneNumber?: string;
  className?: string;
}) {
  const formattedNumber = formatPhoneNumber(phoneNumber);

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <Phone className="h-4 w-4 text-green-600" />
      <span className="text-muted-foreground">WhatsApp:</span>
      <a
        href={generateWhatsAppURL(
          phoneNumber,
          whatsappConfig.defaultMessages.general
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-600 hover:text-green-700 font-medium"
      >
        {formattedNumber}
      </a>
    </div>
  );
}
