import type { Metadata } from "next";
import Link from "next/link";

import { PizzaCalculator } from "@/components/calculators/pizza-calculator";

export const metadata: Metadata = {
  title: "Pizza na Cebulę",
  description:
    "Porównaj pizze na podstawie ceny i rzeczywistej powierzchni.",
};

export default function PizzaCalculatorPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Link
        href="/#narzedzia"
        className="text-sm font-bold text-brand-700 hover:underline"
      >
        ← Wróć do narzędzi
      </Link>

      <header className="mt-6 max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-700">
          Kalkulator
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
          Pizza na Cebulę 🍕
        </h1>

        <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
          Sama średnica może być myląca.
          Porównamy powierzchnię pizzy oraz koszt
          każdych 100 cm².
        </p>
      </header>

      <div className="mt-9">
        <PizzaCalculator />
      </div>

      <section className="mt-10 rounded-card border border-line bg-white p-6 sm:p-8">
        <h2 className="text-xl font-black">
          Jak liczymy?
        </h2>

        <div className="mt-5 space-y-4 text-sm leading-7 text-muted sm:text-base">
          <p>
            Pizza jest traktowana jako koło.
            Najpierw obliczamy jej powierzchnię
            ze wzoru:
          </p>

          <div className="rounded-xl bg-canvas px-4 py-3 font-mono font-bold text-ink">
            pole = π × (średnica ÷ 2)²
          </div>

          <p>
            Następnie dzielimy cenę przez
            powierzchnię i przeliczamy wynik na
            100 cm².
          </p>

          <div className="rounded-xl bg-canvas px-4 py-3 font-mono font-bold text-ink">
            cena / 100 cm² =
            (cena ÷ powierzchnia) × 100
          </div>

          <p>
            Niższy wynik oznacza więcej powierzchni
            pizzy za tę samą kwotę.
          </p>
        </div>
      </section>
    </div>
  );
}