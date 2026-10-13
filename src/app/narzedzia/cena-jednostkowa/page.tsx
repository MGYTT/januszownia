import type { Metadata } from "next";
import Link from "next/link";

import { UnitPriceCalculator } from "@/components/calculators/unit-price-calculator";

export const metadata: Metadata = {
  title: "Cena Jednostkowa",
  description:
    "Porównaj produkty według ceny za kilogram, litr albo sztukę.",
};

export default function UnitPricePage() {
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
          Cena Jednostkowa
        </h1>

        <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
          Większe opakowanie nie zawsze
          jest tańsze. Porównaj cenę za
          kilogram, litr albo sztukę i
          sprawdź rzeczywistą różnicę.
        </p>
      </header>

      <div className="mt-9">
        <UnitPriceCalculator />
      </div>

      <section className="mt-10 rounded-card border border-line bg-white p-6 sm:p-8">
        <h2 className="text-xl font-black">
          Jak działa przeliczanie?
        </h2>

        <div className="mt-5 space-y-4 text-sm leading-7 text-muted sm:text-base">
          <p>
            Gramy są przeliczane na
            kilogramy, a mililitry na
            litry.
          </p>

          <div className="rounded-xl bg-canvas px-4 py-3 font-mono text-sm font-bold text-ink">
            500 g = 0,5 kg
          </div>

          <div className="rounded-xl bg-canvas px-4 py-3 font-mono text-sm font-bold text-ink">
            750 ml = 0,75 l
          </div>

          <p>
            Cena produktu jest następnie
            dzielona przez ilość w
            jednostce bazowej.
          </p>

          <p>
            Nie pozwalamy porównywać
            niezgodnych jednostek, np.
            kilogramów z litrami, ponieważ
            taki wynik bez dodatkowej
            informacji o produkcie nie
            miałby sensu.
          </p>
        </div>
      </section>
    </div>
  );
}