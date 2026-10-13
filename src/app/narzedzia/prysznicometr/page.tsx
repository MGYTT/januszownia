import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  ShowerCostCalculator,
} from "@/components/calculators/shower-cost-calculator";

export const metadata: Metadata = {
  title:
    "Prysznicometr",

  description:
    "Oblicz zużycie wody, energię potrzebną do jej podgrzania oraz koszt jednego prysznica, miesiąca i roku.",
};

export default function ShowerCostPage() {
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
          Prysznicometr
        </h1>

        <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
          Policz ile litrów wody zużywa
          jeden prysznic, ile energii
          potrzeba do jej podgrzania
          i jaki jest łączny koszt
          kąpieli w Twoich warunkach.
        </p>
      </header>

      <div className="mt-9">
        <ShowerCostCalculator />
      </div>

      <section className="mt-10 rounded-card border border-line bg-white p-6 sm:p-8">
        <h2 className="text-xl font-black">
          Dlaczego potrzebujemy tylu danych?
        </h2>

        <div className="mt-5 space-y-4 text-sm leading-7 text-muted sm:text-base">
          <p>
            Zużycie wody zależy
            bezpośrednio od czasu
            prysznica i przepływu
            słuchawki.
          </p>

          <div className="rounded-xl bg-canvas px-4 py-3 font-mono text-sm font-bold text-ink">
            litry = minuty × litry na
            minutę
          </div>

          <p>
            Energia potrzebna do
            podgrzania zależy od ilości
            wody oraz różnicy temperatur.
            Model wykorzystuje ciepło
            właściwe wody 4,186
            kJ/(kg·K) i przyjmuje około
            1 kg masy na 1 litr wody.
          </p>

          <p>
            Sprawność podgrzewania
            pozwala uwzględnić straty
            instalacji. Cena energii
            oraz cena wody i ścieków
            są wpisywane ręcznie, bo
            rzeczywiste stawki zależą
            od taryfy, dostawcy i miejsca
            zamieszkania.
          </p>
        </div>
      </section>
    </div>
  );
}