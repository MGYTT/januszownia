import type { Metadata } from "next";

import {
  Icon,
  type IconName,
} from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "Społeczność",
  description:
    "Społeczność Januszowni — zgłoszenia miejsc, poprawki danych, potwierdzenia i rankingi.",
};

const communityFeatures: {
  icon: IconName;
  title: string;
  description: string;
}[] = [
  {
    icon: "map-pin",
    title: "Dodawanie miejsc",
    description:
      "Użytkownik poda lokalizację, kategorię, opis i informacje potrzebne do weryfikacji.",
  },
  {
    icon: "check",
    title: "Potwierdzanie danych",
    description:
      "Społeczność pomoże sprawdzać, czy miejsce albo cena są nadal aktualne.",
  },
  {
    icon: "shield-check",
    title: "Moderacja",
    description:
      "Zmiany nie będą bezmyślnie nadpisywać danych. Ważne zgłoszenia przejdą proces kontroli.",
  },
  {
    icon: "trophy",
    title: "Cebuliony",
    description:
      "Punkty będą nagradzać użyteczne, zaakceptowane działania zamiast samej liczby kliknięć.",
  },
];

export default function CommunityPage() {
  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-bold text-brand-700">
              <Icon
                name="users"
                className="h-4 w-4"
              />

              Społeczność
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Januszownię będą
              współtworzyć ludzie.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Ale nie poprzez
              chaotyczny feed.
              Społeczność ma przede
              wszystkim pomagać
              utrzymywać dobre dane.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-5 sm:grid-cols-2">
          {communityFeatures.map(
            (feature) => (
              <article
                key={feature.title}
                className="rounded-[2rem] border border-line bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                  <Icon
                    name={
                      feature.icon
                    }
                    className="h-6 w-6"
                  />
                </div>

                <h2 className="mt-5 text-xl font-black">
                  {
                    feature.title
                  }
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted">
                  {
                    feature.description
                  }
                </p>
              </article>
            ),
          )}
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-700">
              Proces zgłoszenia
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.03em]">
              Jak to będzie działać?
            </h2>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-4">
            <Step
              number="1"
              title="Dodajesz"
            >
              Miejsce, cenę lub
              poprawkę.
            </Step>

            <Step
              number="2"
              title="Sprawdzamy"
            >
              System kontroluje
              kompletność i
              wiarygodność danych.
            </Step>

            <Step
              number="3"
              title="Społeczność potwierdza"
            >
              Inni użytkownicy mogą
              pomóc w weryfikacji.
            </Step>

            <Step
              number="4"
              title="Publikujemy"
            >
              Informacja trafia do
              odpowiedniego miejsca
              portalu.
            </Step>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-brand-200 bg-brand-50 p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
            Stan modułu
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Konta i publikowanie
            dołączymy razem z
            backendem.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Nie wyświetlamy tutaj
            fikcyjnych użytkowników ani
            wymyślonych zgłoszeń.
            Interfejs społeczności
            zostanie zasilony dopiero
            rzeczywistymi rekordami.
          </p>
        </div>
      </section>
    </>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-card border border-line bg-canvas p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-black text-white">
        {number}
      </div>

      <h3 className="mt-4 font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted">
        {children}
      </p>
    </div>
  );
}