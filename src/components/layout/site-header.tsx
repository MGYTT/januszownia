import Link from "next/link";
import { Suspense } from "react";

import { OnionMark } from "@/components/brand/onion-mark";
import { HeaderAuthAction } from "@/components/layout/header-auth-action";
import { mainNavigation } from "@/lib/navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-canvas/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[72px] lg:px-8">
        <Link
          href="/"
          aria-label="Januszownia — strona główna"
          className="flex items-center gap-2.5 rounded-xl font-bold tracking-tight"
        >
          <span className="text-brand-600">
            <OnionMark className="h-8 w-8 lg:h-9 lg:w-9" />
          </span>

          <span className="text-lg sm:text-xl">
            Januszownia
          </span>
        </Link>

        <nav
          aria-label="Główna nawigacja"
          className="hidden items-center gap-1 lg:flex"
        >
          {mainNavigation.map(
            (item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-muted transition hover:bg-white hover:text-ink"
              >
                {item.label}
              </Link>
            ),
          )}

          <Link
            href="/o-projekcie"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-muted transition hover:bg-white hover:text-ink"
          >
            O projekcie
          </Link>
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href="/narzedzia"
            className="hidden min-h-11 items-center gap-2 rounded-button border border-line bg-white px-4 py-2.5 text-sm font-bold transition hover:bg-brand-50 md:inline-flex"
          >
            Narzędzia
          </Link>

          <Suspense
            fallback={
              <HeaderAuthFallback />
            }
          >
            <HeaderAuthAction />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

function HeaderAuthFallback() {
  return (
    <div
      aria-hidden="true"
      className="h-11 w-[118px] animate-pulse rounded-button bg-brand-100"
    />
  );
}