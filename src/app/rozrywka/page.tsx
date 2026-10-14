import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  Januszometer,
} from "@/components/entertainment/januszometer";

import {
  Icon,
  type IconName,
} from "@/components/ui/icon";

export const metadata: Metadata = {
  title:
    "Rozrywka i Januszometr",

  description:
    "Strefa Beki Januszowni: humorystyczny Januszometr i miejsce na lekką rozrywkę, która nie udaje porady finansowej.",
};

export default function EntertainmentPage() {
  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-black text-brand-700">
                <Icon
                  name="smile"
                  className="h-4 w-4"
                />

                Strefa Beki
              </div>

              <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-[-0.05em] text-ink sm:text-5xl lg:text-6xl">
                Tu można się pośmiać.
                Liczby nadal traktujemy
                serio.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                Rozrywka w Januszowni ma
                bawić, a nie udawać
                ekspercką analizę.
                Januszometr sprawdzi Twój
                cebulowy instynkt w ośmiu
                krótkich sytuacjach.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#januszometr"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-button bg-brand-600 px-5 py-3 text-sm font-black text-white transition hover:bg-brand-700"
                >
                  Odpal Januszometr

                  <Icon
                    name="arrow-right"
                    className="h-4 w-4"
                  />
                </a>

                <Link
                  href="/narzedzia"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-button border border-line bg-white px-5 py-3 text-sm font-black text-ink transition hover:bg-canvas"
                >
                  Wolę dziś konkrety

                  <Icon
                    name="calculator"
                    className="h-4 w-4 text-brand-700"
                  />
                </Link>
              </div>

              <div className="mt-8 grid max-w-2xl gap-2 sm:grid-cols-3">
                <HeroFact
                  value="8"
                  label="pytań"
                />

                <HeroFact
                  value="0"
                  label="logowania do testu"
                />

                <HeroFact
                  value="100%"
                  label="wyniku dla beki"
                />
              </div>
            </div>

            <aside className="overflow-hidden rounded-[2rem] bg-brand-900 text-white shadow-card">
              <div className="p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-brand-100">
                    <Icon
                      name="trophy"
                      className="h-6 w-6"
                    />
                  </div>

                  <span className="rounded-full bg-brand-700 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">
                    Działa teraz
                  </span>
                </div>

                <p className="mt-7 text-xs font-black uppercase tracking-[0.14em] text-brand-200">
                  Główna atrakcja
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">
                  Januszometr
                </h2>

                <p className="mt-3 text-sm leading-6 text-brand-100">
                  Promocje, parking,
                  pizza, paliwo i inne
                  sytuacje, w których
                  człowiek mówi „przecież
                  to się opłaca”.
                </p>
              </div>

              <div className="border-t border-white/10 bg-black/10 p-5 sm:p-6">
                <div className="space-y-3">
                  <FeatureCheck>
                    Jedno pytanie na raz
                  </FeatureCheck>

                  <FeatureCheck>
                    Możesz wracać do odpowiedzi
                  </FeatureCheck>

                  <FeatureCheck>
                    Wynik nie trafia do profilu
                  </FeatureCheck>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section
        id="januszometr"
        className="scroll-mt-24"
      >
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="mb-7 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
                Januszometr
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                Sprawdź, jak bardzo
                kombinujesz przed wydaniem
                złotówki.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
                Nie ma tu dobrych ani
                złych ludzi. Jest tylko
                humorystyczna punktacja za
                podejście do codziennych
                cebulowych dylematów.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-white px-4 py-3 text-xs font-bold leading-5 text-muted shadow-sm">
              Bez rankingu.
              <br />
              Bez Cebulionów.
              <br />
              Bez spiny.
            </div>
          </div>

          <Januszometer />
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
                Zasady tej części serwisu
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em]">
                Beka ma swoje granice.
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted">
                Humor nie powinien
                zaciemniać tego, co w
                Januszowni ma być
                użyteczne i prawdziwe.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Principle
                icon="smile"
                title="Humor, nie diagnoza"
                description="Wynik Januszometru nie ocenia Twoich finansów, inteligencji ani rozsądku."
              />

              <Principle
                icon="shield-check"
                title="Bez udawanych danych"
                description="Nie dokładamy fikcyjnych rankingów, popularności ani procentów tylko dla efektu."
              />

              <Principle
                icon="calculator"
                title="Konkrety są obok"
                description="Gdy potrzebujesz realnej decyzji, korzystasz z kalkulatorów i danych, nie z żartu."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
              Następne w kolejce
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em]">
              Rozrywka będzie rosła, ale
              bez kart-wydmuszek.
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
              Poniższe moduły są
              świadomie oznaczone jako
              planowane. Nie udajemy, że
              można już z nich korzystać.
            </p>
          </div>

          <span className="w-fit rounded-full border border-line bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-muted">
            Roadmapa
          </span>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <PlannedFeature
            icon="sparkles"
            title="Dylemat dnia"
            description="Krótka, absurdalna decyzja w stylu Januszowni — do porównania własnego odruchu z cebulowym scenariuszem."
          />

          <PlannedFeature
            icon="trophy"
            title="Wyzwania"
            description="Lekkie zadania i cele dla chętnych. Dopóki nie ma prawdziwego mechanizmu, nie pokazujemy sztucznych serii ani punktów."
          />

          <PlannedFeature
            icon="smile"
            title="Januszex Simulator"
            description="Symulator firmowych absurdów z przymrużeniem oka. Osobny moduł, nie atrapowy przycisk na tej stronie."
          />
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-[2rem] border border-line bg-canvas p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-brand-700">
              Koniec żartów?
            </p>

            <h2 className="mt-1 text-xl font-black">
              W Centrum Cebulowych
              Obliczeń czekają prawdziwe
              liczby.
            </h2>
          </div>

          <Link
            href="/narzedzia"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-button bg-brand-900 px-5 py-2.5 text-sm font-black text-white transition hover:bg-brand-800"
          >
            Przejdź do narzędzi

            <Icon
              name="arrow-right"
              className="h-4 w-4"
            />
          </Link>
        </div>
      </section>
    </>
  );
}

function HeroFact({
  value,
  label,
}: {
  value:
    string;

  label:
    string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-canvas px-4 py-3">
      <p className="text-xl font-black tracking-[-0.03em] text-brand-800">
        {value}
      </p>

      <p className="mt-0.5 text-xs font-bold text-muted">
        {label}
      </p>
    </div>
  );
}

function FeatureCheck({
  children,
}: {
  children:
    string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm font-bold text-brand-100">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
        <Icon
          name="check"
          className="h-3.5 w-3.5"
        />
      </span>

      <span>
        {children}
      </span>
    </div>
  );
}

function Principle({
  icon,
  title,
  description,
}: {
  icon:
    IconName;

  title:
    string;

  description:
    string;
}) {
  return (
    <article className="rounded-[1.5rem] border border-line bg-canvas p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm">
        <Icon
          name={
            icon
          }
          className="h-5 w-5"
        />
      </div>

      <h3 className="mt-4 font-black text-ink">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted">
        {description}
      </p>
    </article>
  );
}

function PlannedFeature({
  icon,
  title,
  description,
}: {
  icon:
    IconName;

  title:
    string;

  description:
    string;
}) {
  return (
    <article className="rounded-[1.75rem] border border-line bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <Icon
            name={
              icon
            }
            className="h-5 w-5"
          />
        </div>

        <span className="rounded-full bg-canvas px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-muted">
          W planach
        </span>
      </div>

      <h3 className="mt-5 text-lg font-black text-ink">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted">
        {description}
      </p>
    </article>
  );
}
