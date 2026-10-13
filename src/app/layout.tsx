import type {
  Metadata,
  Viewport,
} from "next";

import {
  Suspense,
  type ReactNode,
} from "react";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import "./globals.css";

import {
  MobileNav,
} from "@/components/layout/mobile-nav";

import {
  SiteFooter,
} from "@/components/layout/site-footer";

import {
  SiteHeader,
} from "@/components/layout/site-header";

export const metadata: Metadata = {
  metadataBase:
    new URL(
      process.env.NEXT_PUBLIC_SITE_URL ??
        "http://localhost:3000",
    ),

  title: {
    default:
      "Januszownia",

    template:
      "%s | Januszownia",
  },

  description:
    "Po co przepłacać, skoro można pojanuszować? Mapy, kalkulatory, okazje i społeczność rozsądnego oszczędzania.",

  applicationName:
    "Januszownia",

  creator:
    "Januszownia",

  publisher:
    "Januszownia",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width:
    "device-width",

  initialScale:
    1,

  themeColor:
    "#ffffff",
};

interface RootLayoutProps {
  children:
    ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html
      lang="pl"
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />

          <main className="flex-1 pb-20 md:pb-0">
            {children}
          </main>

          <SiteFooter />

          {/*
           * MobileNav korzysta z usePathname().
           *
           * Przy Cache Components pathname jest
           * wartością dostępną dopiero podczas
           * runtime, dlatego izolujemy tylko ten
           * niewielki fragment layoutu.
           *
           * Nie ustawiamy instant = false dla
           * całego RootLayout.
           */}
          <Suspense
            fallback={
              <MobileNavFallback />
            }
          >
            <MobileNav />
          </Suspense>
        </div>
      </body>
    </html>
  );
}

function MobileNavFallback() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <div className="mx-auto grid h-16 max-w-lg grid-cols-5 px-2">
        {Array.from({
          length: 5,
        }).map(
          (
            _,
            index,
          ) => (
            <div
              key={
                index
              }
              className="flex items-center justify-center"
            >
              <div className="h-8 w-10 rounded-xl bg-canvas" />
            </div>
          ),
        )}
      </div>
    </div>
  );
}