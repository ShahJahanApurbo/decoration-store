"use client";

import { ShopifyProvider } from "@shopify/hydrogen-react";
import { ReactNode } from "react";

interface HydrogenProviderProps {
  children: ReactNode;
}

const shopifyConfig = {
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "",
  storefrontAccessToken:
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "",
  storefrontApiVersion:
    process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || "2025-04",
};

export function HydrogenProvider({ children }: HydrogenProviderProps) {
  return (
    <ShopifyProvider
      storeDomain={shopifyConfig.storeDomain}
      storefrontToken={shopifyConfig.storefrontAccessToken}
      storefrontApiVersion={shopifyConfig.storefrontApiVersion}
      countryIsoCode="US"
      languageIsoCode="EN"
    >
      {children}
    </ShopifyProvider>
  );
}

export default HydrogenProvider;
