import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  GrillCalculator,
} from "@/components/calculators/grill-calculator";

export const metadata: Metadata = {
  title:
    "Grillometr",

  description:
    "Oszacuj ilość jedzenia, napojów, węgla i budżet grilla dla dorosłych i dzieci.",
};

export default function GrillPage() {
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
          Jedzenie
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
          Grillometr
        </h1>

        <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
          Oszacuj ile kupić jedzenia,
          napojów i paliwa do grilla.
          Ceny wpisujesz sam, więc budżet
          wynika z Twojego sklepu i
          Twojego menu, a nie z
          wymyślonego cennika.
        </p>
      </header>

      <div className="mt-9">
        <GrillCalculator />
      </div>

      <section className="mt-10 rounded-card border border-line bg-white p-6 sm:p-8">
        <h2 className="text-xl font-black">
          Założenia planistyczne
        </h2>

        <div className="mt-5 space-y-4 text-sm leading-7 text-muted sm:text-base">
          <p>
            Grillometr nie udaje normy
            dietetycznej. To praktyczny
            punkt startowy do zakupów,
            który można skorygować
            poziomem apetytu.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <Assumption
              label="Produkty główne"
              value="350 g / dorosłą porcję"
            />

            <Assumption
              label="Dodatki"
              value="250 g / dorosłą porcję"
            />

            <Assumption
              label="Warzywa"
              value="200 g / dorosłą porcję"
            />

            <Assumption
              label="Pieczywo"
              value="150 g / dorosłą porcję"
            />

            <Assumption
              label="Napoje"
              value="1,2 l / dorosłą porcję"
            />

            <Assumption
              label="Dziecko"
              value="0,6 porcji dorosłej"
            />
          </div>

          <p>
            Dla węgla lub brykietu
            przyjmujemy około 0,35 kg
            na równoważną porcję
            dorosłą, ale nie mniej niż
            2 kg. Rzeczywiste zużycie
            zależy od rodzaju grilla,
            paliwa, czasu pieczenia
            i pogody.
          </p>

          <p>
            Poziom apetytu wpływa na
            ilość jedzenia: lekki 80%,
            normalny 100%, głodni 125%.
            Nie zwiększamy nim
            automatycznie napojów ani
            węgla.
          </p>
        </div>
      </section>
    </div>
  );
}

function Assumption({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) {
  return (
    <div className="rounded-xl bg-canvas px-4 py-3">
      <p className="text-xs font-bold text-muted">
        {label}
      </p>

      <p className="mt-1 font-black text-ink">
        {value}
      </p>
    </div>
  );
}