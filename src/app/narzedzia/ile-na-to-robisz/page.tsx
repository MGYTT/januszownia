import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  WorkTimeCostCalculator,
} from "@/components/calculators/work-time-cost-calculator";

export const metadata: Metadata = {
  title:
    "IleNaToRobisz?",

  description:
    "Przelicz cenę zakupu na godziny i dni pracy na podstawie własnego miesięcznego dochodu netto.",
};

export default function WorkTimeCostPage() {
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
          Pieniądze
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
          IleNaToRobisz?
        </h1>

        <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
          Zobacz cenę zakupu w godzinach
          własnej pracy. Bez przeliczania
          brutto na netto i bez zgadywania
          podatków — wpisujesz to, co
          naprawdę zarabiasz na rękę.
        </p>
      </header>

      <div className="mt-9">
        <WorkTimeCostCalculator />
      </div>

      <section className="mt-10 rounded-card border border-line bg-white p-6 sm:p-8">
        <h2 className="text-xl font-black">
          Jak działa przeliczenie?
        </h2>

        <div className="mt-5 space-y-4 text-sm leading-7 text-muted sm:text-base">
          <p>
            Najpierw dzielimy miesięczny
            dochód netto przez liczbę
            godzin pracy w tym miesiącu.
            Otrzymujemy przybliżony dochód
            netto przypadający na jedną
            godzinę pracy.
          </p>

          <div className="rounded-xl bg-canvas px-4 py-3 font-mono text-sm font-bold text-ink">
            stawka netto / h = dochód netto
            ÷ godziny pracy
          </div>

          <p>
            Następnie cenę zakupu dzielimy
            przez tę stawkę. Dni pracy są
            tylko wygodnym przeliczeniem
            według długości dnia pracy,
            którą podasz.
          </p>

          <p>
            To nie jest kalkulator
            zdolności finansowej. Nie
            odejmujemy czynszu, jedzenia,
            kredytów ani innych kosztów
            życia, dlatego wynik pokazuje
            relację ceny do pracy, a nie
            realną dostępność pieniędzy.
          </p>
        </div>
      </section>
    </div>
  );
}