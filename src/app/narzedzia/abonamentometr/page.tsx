import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  SubscriptionMeterCalculator,
} from "@/components/calculators/subscription-meter-calculator";

export const metadata: Metadata = {
  title:
    "Abonamentometr",

  description:
    "Policz rzeczywisty koszt abonamentu, koszt jednego użycia, wpływ promocji, opłat startowych, podwyżek i podziału kosztu.",
};

export default function SubscriptionMeterPage() {
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
          Abonamentometr
        </h1>

        <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
          „Tylko 29,99 miesięcznie” potrafi
          rozmnożyć się szybciej niż cebula
          na promocji. Tu zobaczysz pełny
          koszt abonamentu, koszt jednego
          użycia, opłaty startowe, okres
          promocyjny, podwyżki i koszt
          przypadający na osobę.
        </p>
      </header>

      <div className="mt-9">
        <SubscriptionMeterCalculator />
      </div>

      <section className="mt-10 rounded-card border border-line bg-white p-6 sm:p-8">
        <h2 className="text-xl font-black">
          Co dokładnie liczy Abonamentometr?
        </h2>

        <div className="mt-5 space-y-5 text-sm leading-7 text-muted sm:text-base">
          <p>
            Nie sprowadzamy wszystkiego do
            prostego „cena × 12”. Budujemy
            harmonogram faktycznych
            płatności zgodnie z okresem
            rozliczeniowym: miesięcznym,
            kwartalnym, półrocznym albo
            rocznym. Osobno pokazujemy ile
            realnie schodzi z konta i jaki
            koszt usługi przypada na sam
            analizowany okres.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <FormulaCard
              title="Koszt jednego użycia"
              formula="pełny koszt ÷ łączna liczba użyć"
            />

            <FormulaCard
              title="Średni koszt miesięczny"
              formula="pełny koszt ÷ miesiące analizy"
            />

            <FormulaCard
              title="Koszt na osobę"
              formula="pełny koszt ÷ liczba osób"
            />

            <FormulaCard
              title="Użycia potrzebne do celu"
              formula="pełny koszt ÷ limit za użycie ÷ miesiące"
            />
          </div>

          <p>
            Jeżeli ustawisz cenę startową,
            pierwsze wskazane płatności
            korzystają właśnie z niej.
            Możesz więc policzyć zarówno
            darmowy start za 0 zł, jak i
            ofertę typu „pierwsze 3
            płatności po 9,99 zł”.
          </p>

          <p>
            Opcjonalna coroczna podwyżka
            zaczyna działać po każdych
            pełnych 12 miesiącach od startu
            analizy. Cena promocyjna
            pierwszych płatności pozostaje
            ceną startową — nie podnosimy jej
            automatycznie.
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-card border border-line bg-canvas p-6 sm:p-8">
        <h2 className="text-xl font-black">
          Ważne założenia
        </h2>

        <div className="mt-4 space-y-3 text-sm leading-7 text-muted">
          <p>
            Jeżeli termin płatności wpada w
            analizowany okres, harmonogram
            pokazuje pełne obciążenie konta.
            Jednocześnie koszt użytkowania
            rozliczamy proporcjonalnie do
            miesięcy faktycznie należących do
            analizy. Przykład: roczny plan za
            240 zł analizowany przez 13
            miesięcy pokaże 480 zł pobrane z
            konta, ale 260 zł kosztu usługi
            przypadającego na te 13 miesięcy.
          </p>

          <p>
            Nie modelujemy częściowych
            zwrotów, wypowiedzeń w połowie
            okresu, kursów walut, podatków
            ani indywidualnych zasad
            konkretnego usługodawcy.
          </p>

          <p>
            Pole „ile osób pokrywa koszt”
            służy wyłącznie do matematycznego
            podziału wydatku. Kalkulator nie
            zakłada, że regulamin danej
            usługi pozwala współdzielić konto.
          </p>
        </div>
      </section>
    </div>
  );
}

function FormulaCard({
  title,
  formula,
}: {
  title:
    string;

  formula:
    string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-canvas p-4">
      <p className="text-xs font-black uppercase tracking-[0.08em] text-brand-700">
        {title}
      </p>

      <p className="mt-2 font-mono text-sm font-bold text-ink">
        {formula}
      </p>
    </div>
  );
}
