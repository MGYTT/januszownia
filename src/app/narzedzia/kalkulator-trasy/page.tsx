import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  RouteCostCalculator,
} from "@/components/calculators/route-cost-calculator";

export const metadata: Metadata = {
  title:
    "Kalkulator Trasy Janusza",

  description:
    "Policz koszt paliwa, opłat drogowych, parkingu i koszt przejazdu przypadający na osobę.",
};

export default function RouteCostPage() {
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
          Podróże
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
          Kalkulator Trasy Janusza
        </h1>

        <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
          Policz pełny koszt konkretnego
          przejazdu: paliwo, opłaty,
          parking oraz inne koszty.
          Jeżeli jedziecie razem, od razu
          zobaczysz uczciwy koszt na osobę.
        </p>
      </header>

      <div className="mt-9">
        <RouteCostCalculator />
      </div>

      <section className="mt-10 rounded-card border border-line bg-white p-6 sm:p-8">
        <h2 className="text-xl font-black">
          Co liczymy?
        </h2>

        <div className="mt-5 space-y-4 text-sm leading-7 text-muted sm:text-base">
          <p>
            Dystans całkowity jest równy
            wpisanej trasie w jedną stronę
            albo jej dwukrotności, jeżeli
            wybierzesz przejazd tam i z
            powrotem.
          </p>

          <div className="rounded-xl bg-canvas px-4 py-3 font-mono text-sm font-bold text-ink">
            paliwo [l] = dystans [km] ×
            spalanie [l/100 km] ÷ 100
          </div>

          <p>
            Do kosztu paliwa dodajemy
            dokładnie te opłaty drogowe,
            parkingowe i inne koszty,
            które wpiszesz.
          </p>

          <p>
            Nie doliczamy automatycznie
            amortyzacji samochodu,
            ubezpieczenia, serwisu, opon
            ani wartości czasu. To
            kalkulator kosztu konkretnego
            przejazdu, a nie pełnego kosztu
            posiadania auta.
          </p>
        </div>
      </section>
    </div>
  );
}
