import type { Metadata } from "next";
import Link from "next/link";

import { FuelTripCalculator } from "@/components/calculators/fuel-trip-calculator";

export const metadata: Metadata = {
  title: "OpłacaSięTankować?",
  description:
    "Sprawdź, czy wyjazd do tańszej stacji paliw rzeczywiście przyniesie oszczędność.",
};

export default function FuelTripPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Link
        href="/narzedzia"
        className="text-sm font-bold text-brand-700 hover:underline"
      >
        ← Wróć do narzędzi
      </Link>

      <header className="mt-6 max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-700">
          Samochód
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
          OpłacaSięTankować?
        </h1>

        <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
          Tańsze paliwo nie zawsze
          oznacza tańsze tankowanie.
          Kalkulator uwzględnia paliwo
          spalone podczas dodatkowego
          dojazdu.
        </p>
      </header>

      <div className="mt-9">
        <FuelTripCalculator />
      </div>

      <section className="mt-10 rounded-card border border-line bg-white p-6 sm:p-8">
        <h2 className="text-xl font-black">
          Jak to liczymy?
        </h2>

        <div className="mt-5 space-y-4 text-sm leading-7 text-muted sm:text-base">
          <p>
            Najpierw sprawdzamy, ile
            oszczędziłbyś na samej
            różnicy cen.
          </p>

          <div className="rounded-xl bg-canvas px-4 py-3 font-mono text-sm font-bold text-ink">
            oszczędność brutto =
            (cena bliższa − cena dalsza)
            × liczba litrów
          </div>

          <p>
            Następnie obliczamy paliwo
            zużyte podczas dodatkowej
            drogi.
          </p>

          <div className="rounded-xl bg-canvas px-4 py-3 font-mono text-sm font-bold text-ink">
            dodatkowe paliwo =
            dystans × spalanie ÷ 100
          </div>

          <p>
            Na końcu koszt tego paliwa
            odejmujemy od potencjalnej
            oszczędności.
          </p>
        </div>
      </section>
    </div>
  );
}