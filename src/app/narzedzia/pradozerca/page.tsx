import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  PowerCostCalculator,
} from "@/components/calculators/power-cost-calculator";

export const metadata: Metadata = {
  title:
    "Prądożerca",

  description:
    "Oblicz zużycie energii i koszt pracy urządzenia na dzień, miesiąc i rok.",
};

export default function PowerCostPage() {
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
          Dom
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
          Prądożerca
        </h1>

        <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
          Sprawdź ile energii zużywa
          urządzenie i ile kosztuje
          jego codzienna praca.
          Kalkulator osobno uwzględnia
          również pobór w trybie
          czuwania.
        </p>
      </header>

      <div className="mt-9">
        <PowerCostCalculator />
      </div>

      <section className="mt-10 rounded-card border border-line bg-white p-6 sm:p-8">
        <h2 className="text-xl font-black">
          Jak powstaje wynik?
        </h2>

        <div className="mt-5 space-y-4 text-sm leading-7 text-muted sm:text-base">
          <p>
            Moc urządzenia w watach
            zamieniamy na kilowaty i
            mnożymy przez czas pracy.
            Dzięki temu otrzymujemy
            zużycie energii w kWh.
          </p>

          <div className="rounded-xl bg-canvas px-4 py-3 font-mono text-sm font-bold text-ink">
            energia [kWh] = moc [W] /
            1000 × czas [h]
          </div>

          <p>
            Dla trybu czuwania liczymy
            pozostałe godziny doby.
            Jeżeli urządzenie po
            wyłączeniu faktycznie nie
            pobiera energii, wpisz 0 W.
          </p>

          <p>
            Cena 1 kWh nie jest pobierana
            z internetu. Wpisujesz własną
            wartość z taryfy lub rachunku,
            dlatego wynik nie udaje
            uniwersalnej ceny energii dla
            każdego gospodarstwa.
          </p>
        </div>
      </section>
    </div>
  );
}