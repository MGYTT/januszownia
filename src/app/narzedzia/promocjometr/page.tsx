import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  PromotionMeterCalculator,
} from "@/components/calculators/promotion-meter-calculator";

export const metadata: Metadata = {
  title:
    "Promocjometr",

  description:
    "Policz rzeczywistą różnicę między ceną regularną i promocyjną oraz porównaj ją z podaną najniższą ceną z 30 dni.",
};

export default function PromotionMeterPage() {
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
          Zakupy
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
          Promocjometr
        </h1>

        <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
          Zamiast patrzeć na wielki
          czerwony procent, policz ile
          naprawdę zostaje w portfelu.
          Możesz też porównać aktualną
          cenę z podaną najniższą ceną
          z 30 dni.
        </p>
      </header>

      <div className="mt-9">
        <PromotionMeterCalculator />
      </div>

      <section className="mt-10 rounded-card border border-line bg-white p-6 sm:p-8">
        <h2 className="text-xl font-black">
          Co dokładnie liczymy?
        </h2>

        <div className="mt-5 space-y-4 text-sm leading-7 text-muted sm:text-base">
          <p>
            Podstawowa obniżka to
            różnica między wpisaną ceną
            regularną i promocyjną.
            Dzielimy ją przez cenę
            regularną, aby otrzymać
            procentową zmianę ceny.
          </p>

          <div className="rounded-xl bg-canvas px-4 py-3 font-mono text-sm font-bold text-ink">
            rabat % = (cena regularna −
            cena promocyjna) / cena
            regularna × 100
          </div>

          <p>
            Jeżeli wpiszesz najniższą
            cenę z 30 dni, kalkulator
            wykonuje drugie, niezależne
            porównanie matematyczne.
            Nie oceniamy zgodności sklepu
            z przepisami ani sposobu
            prezentowania promocji.
          </p>

          <p>
            Liczba sztuk służy wyłącznie
            do pokazania, ile łącznie
            zapłacisz i ile łącznie
            wynosi różnica względem ceny
            regularnej.
          </p>
        </div>
      </section>
    </div>
  );
}