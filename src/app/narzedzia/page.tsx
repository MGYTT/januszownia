import type {
  Metadata,
} from "next";

import {
  ToolCatalog,
} from "@/components/tools/tool-catalog";

import {
  getAvailableTools,
} from "@/lib/tools/catalog";

export const metadata: Metadata = {
  title:
    "Narzędzia",

  description:
    "Praktyczne kalkulatory Januszowni: zakupy, paliwo, trasa, prąd, woda, grill i inne codzienne wydatki.",
};

export default function ToolsPage() {
  const availableCount =
    getAvailableTools().length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
      <header className="overflow-hidden rounded-[2rem] border border-brand-100 bg-white shadow-card">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center lg:p-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-black text-brand-700 sm:text-sm">
              <span
                aria-hidden="true"
              >
                🧅
              </span>

              Centrum Cebulowych Obliczeń
            </div>

            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Najpierw policz.
              <span className="text-brand-700">
                {" "}
                Potem januszuj.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
              Kalkulatory do normalnych
              problemów: czy promocja ma
              sens, ile naprawdę kosztuje
              trasa, co zjada prąd i czy
              większa pizza faktycznie jest
              lepszym interesem.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <StatPill
                value={
                  String(
                    availableCount,
                  )
                }
                label="działających narzędzi"
              />

              <StatPill
                value="0"
                label="magicznych cen z kosmosu"
              />

              <StatPill
                value="100%"
                label="liczenia na Twoich danych"
              />
            </div>
          </div>

          <div className="rounded-[1.7rem] border border-accent-200 bg-accent-50 p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-accent-700">
              Regulamin Janusza
            </p>

            <div className="mt-4 space-y-4">
              <Rule
                emoji="🧮"
                title="Najpierw liczby"
                description="Wynik ma być konkretny, nie „wydaje mi się, że taniej”."
              />

              <Rule
                emoji="🧅"
                title="Potem beka"
                description="Żart ma pomóc zapamiętać wynik, a nie przykryć obliczenia."
              />

              <Rule
                emoji="💸"
                title="Bez wciskania kitu"
                description="Ceny i stawki wpisujesz sam tam, gdzie nie ma jednej uczciwej wartości dla wszystkich."
              />
            </div>
          </div>
        </div>
      </header>

      <div className="mt-8 sm:mt-10">
        <ToolCatalog />
      </div>
    </div>
  );
}

function StatPill({
  value,
  label,
}: {
  value:
    string;

  label:
    string;
}) {
  return (
    <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-canvas px-3.5 text-xs font-bold text-muted sm:text-sm">
      <strong className="text-brand-800">
        {value}
      </strong>

      <span>
        {label}
      </span>
    </span>
  );
}

function Rule({
  emoji,
  title,
  description,
}: {
  emoji:
    string;

  title:
    string;

  description:
    string;
}) {
  return (
    <div className="flex gap-3">
      <div
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent-200 bg-white text-lg"
      >
        {emoji}
      </div>

      <div>
        <p className="text-sm font-black text-ink">
          {title}
        </p>

        <p className="mt-0.5 text-xs leading-5 text-muted">
          {description}
        </p>
      </div>
    </div>
  );
}