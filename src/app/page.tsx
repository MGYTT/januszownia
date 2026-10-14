import Link from "next/link";

import type {
  ReactNode,
} from "react";

import { Hero } from "@/components/home/hero";

import {
  Icon,
  type IconName,
} from "@/components/ui/icon";

import {
  DEFAULT_REPUTATION_LEVELS,
} from "@/lib/reputation/levels";

import {
  getAvailableTools,
  type ToolDefinition,
} from "@/lib/tools/catalog";

interface PortalModule {
  title: string;
  description: string;
  href: string;
  icon: IconName;
  kicker: string;
  cta: string;
}

const portalModules: PortalModule[] = [
  {
    title:
      "Mapa Cebularza",

    description:
      "Publiczne miejsca z prawdziwej bazy: m.in. parkingi, woda, toalety, jedzenie, darmowe miejsca i targowiska. Nowe punkty przechodzą moderację.",

    href:
      "/mapy",

    icon:
      "map-pin",

    kicker:
      "Mapy",

    cta:
      "Otwórz mapę",
  },

  {
    title:
      "Społeczność",

    description:
      "Dodawaj miejsca, potwierdzaj aktualność danych i zgłaszaj problemy. Wkład ma poprawiać portal, a nie produkować pustą aktywność.",

    href:
      "/spolecznosc",

    icon:
      "users",

    kicker:
      "Ludzie",

    cta:
      "Zobacz społeczność",
  },

  {
    title:
      "Ranking Cebularzy",

    description:
      "Cebuliony, poziomy i osiągnięcia za zweryfikowany wkład. Udział w publicznym rankingu jest dobrowolny.",

    href:
      "/ranking",

    icon:
      "trophy",

    kicker:
      "Reputacja",

    cta:
      "Zobacz ranking",
  },

  {
    title:
      "Strefa Beki",

    description:
      "Lżejsza część Januszowni. Humor ma tu swoje miejsce, ale pozostaje oddzielony od poważnych danych i obliczeń.",

    href:
      "/rozrywka",

    icon:
      "smile",

    kicker:
      "Rozrywka",

    cta:
      "Wejdź dla beki",
  },
];

const featuredToolSlugs = new Set([
  "abonamentometr",
  "promocjometr",
  "kalkulator-trasy",
  "pradozerca",
  "oplaca-sie-tankowac",
  "pizza-na-cebule",
]);

export default function HomePage() {
  const availableTools =
    getAvailableTools();

  const featuredTools =
    availableTools.filter(
      (
        tool,
      ) =>
        featuredToolSlugs.has(
          tool.slug,
        ),
    );

  const toolCategoryCount =
    new Set(
      availableTools.map(
        (
          tool,
        ) =>
          tool.category,
      ),
    ).size;

  const reputationLevelCount =
    DEFAULT_REPUTATION_LEVELS.length;

  return (
    <>
      <Hero />

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-3 sm:grid-cols-3">
            <HomeStat
              value={
                String(
                  availableTools.length,
                )
              }
              label="działających narzędzi"
              description="Liczba pochodzi bezpośrednio z aktualnego katalogu."
            />

            <HomeStat
              value={
                String(
                  toolCategoryCount,
                )
              }
              label="obszarów codziennych wydatków"
              description="Od jedzenia i domu po samochód, zakupy, pieniądze i podróże."
            />

            <HomeStat
              value={
                String(
                  reputationLevelCount,
                )
              }
              label="poziomów reputacji"
              description="Za zweryfikowany wkład w rozwój Januszowni."
            />
          </div>
        </div>
      </section>

      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Narzędzia"
              title="Policz konkretną rzecz i podejmij lepszą decyzję."
              description="Nie pokazujemy kalkulatorów dla samej liczby funkcji. Każde narzędzie ma własny model, walidację i wynik, który da się zrozumieć."
            />

            <Link
              href="/narzedzia"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-button border border-line bg-white px-4 py-2.5 text-sm font-black transition hover:border-brand-200 hover:bg-brand-50 sm:self-auto"
            >
              Wszystkie narzędzia

              <Icon
                name="arrow-right"
                className="h-4 w-4"
              />
            </Link>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map(
              (
                tool,
              ) => (
                <ToolCard
                  key={
                    tool.slug
                  }
                  tool={
                    tool
                  }
                />
              ),
            )}
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-line bg-white p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <p className="font-black text-ink">
                To tylko wybrane narzędzia.
              </p>

              <p className="mt-1 text-sm leading-6 text-muted">
                Pełny katalog zawiera obecnie{" "}
                <strong className="text-ink">
                  {availableTools.length}
                </strong>{" "}
                działających pozycji i będzie rozwijany bez zastępowania jakości samym licznikiem funkcji.
              </p>
            </div>

            <Link
              href="/narzedzia"
              className="mt-4 inline-flex min-h-11 shrink-0 items-center gap-2 rounded-button bg-brand-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-brand-700 sm:mt-0"
            >
              Przejdź do katalogu

              <Icon
                name="arrow-right"
                className="h-4 w-4"
              />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Cała Januszownia"
            title="Kalkulatory są ważne, ale portal jest większy."
            description="Mapy, społeczność, reputacja i rozrywka korzystają ze wspólnego stylu i zasad. Nie są już tylko planem na później."
          />

          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {portalModules.map(
              (
                module,
              ) => (
                <PortalModuleCard
                  key={
                    module.title
                  }
                  module={
                    module
                  }
                />
              ),
            )}
          </div>
        </div>
      </section>

      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-9 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-700">
                Jak to działa
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
                Najpierw konkret.
                Potem cebula.
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-muted">
                Januszownia ma być
                prosta w użyciu, ale
                nie uproszczona
                matematycznie ani
                organizacyjnie.
              </p>

              <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
                Dlatego oddzielamy
                obliczenia, dane
                społecznościowe,
                moderację i humor.
                Każda część ma własną
                odpowiedzialność.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Principle
                icon="search"
                title="Szukasz po problemie"
              >
                Wyszukiwarka prowadzi
                do konkretnego
                narzędzia albo działu,
                bez potrzeby znania
                jego nazwy.
              </Principle>

              <Principle
                icon="calculator"
                title="Dostajesz obliczenie"
              >
                Kalkulator wykonuje
                konkretną pracę na
                danych, które podajesz,
                zamiast udawać
                poradnik.
              </Principle>

              <Principle
                icon="shield-check"
                title="Dane przechodzą kontrolę"
              >
                Nowe miejsca nie
                wpadają automatycznie
                na publiczną mapę.
                Najpierw przechodzą
                proces weryfikacji.
              </Principle>

              <Principle
                icon="users"
                title="Społeczność ma zadanie"
              >
                Użytkownicy pomagają
                aktualizować miejsca,
                zgłaszać błędy i
                budować wiarygodność
                danych.
              </Principle>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-700">
                Społeczność
              </p>

              <h2 className="mt-2 max-w-3xl text-3xl font-black tracking-[-0.03em] sm:text-4xl">
                Znalazłeś dobre miejsce?
                Dorzuć je do mapy.
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-muted">
                Zalogowany użytkownik
                może zgłosić nowy punkt,
                a przy istniejących
                miejscach potwierdzić
                aktualność albo wysłać
                formalny raport o
                problemie.
              </p>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                Zatwierdzone działania
                mogą budować reputację
                i Cebuliony. Nie
                przyznajemy punktów za
                samo generowanie ruchu.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/mapy/dodaj"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button bg-brand-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-brand-700"
                >
                  Dodaj miejsce

                  <Icon
                    name="map-pin"
                    className="h-4 w-4"
                  />
                </Link>

                <Link
                  href="/spolecznosc"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button border border-line bg-white px-5 py-2.5 text-sm font-black transition hover:bg-canvas"
                >
                  Jak działa społeczność

                  <Icon
                    name="arrow-right"
                    className="h-4 w-4 text-brand-700"
                  />
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-line bg-canvas p-6 sm:p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-sm">
                <Icon
                  name="shield-check"
                  className="h-6 w-6"
                />
              </div>

              <h3 className="mt-5 text-xl font-black">
                Publikacja nie jest automatem
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted">
                Nowe miejsce trafia
                najpierw do prywatnej
                kolejki moderatorów.
                Zatwierdzenie tworzy
                publiczny punkt na
                mapie. Problemy z już
                opublikowanymi miejscami
                mają osobną kolejkę.
              </p>

              <Link
                href="/mapy"
                className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-700 hover:underline"
              >
                Zobacz Mapę Cebularza

                <Icon
                  name="arrow-right"
                  className="h-4 w-4"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-200">
                Zacznij od konkretu
              </p>

              <h2 className="mt-2 max-w-3xl text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                Co dziś chcesz
                policzyć albo znaleźć?
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-brand-100">
                Otwórz katalog
                narzędzi, przeszukaj
                mapę albo po prostu
                wpisz problem w
                wyszukiwarkę na górze.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/narzedzia"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-button bg-white px-5 py-3 font-black text-brand-900 transition hover:bg-brand-50"
              >
                Narzędzia

                <Icon
                  name="calculator"
                  className="h-4 w-4"
                />
              </Link>

              <Link
                href="/mapy"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-button border border-brand-700 px-5 py-3 font-black text-white transition hover:bg-brand-800"
              >
                Mapa

                <Icon
                  name="map-pin"
                  className="h-4 w-4"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function HomeStat({
  value,
  label,
  description,
}: {
  value:
    string;

  label:
    string;

  description:
    string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-canvas p-5">
      <p className="text-3xl font-black tracking-[-0.03em] text-brand-800">
        {value}
      </p>

      <p className="mt-1 font-black text-ink">
        {label}
      </p>

      <p className="mt-2 text-xs leading-5 text-muted">
        {description}
      </p>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow:
    string;

  title:
    string;

  description:
    string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-700">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
        {title}
      </h2>

      <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
        {description}
      </p>
    </div>
  );
}

function ToolCard({
  tool,
}: {
  tool:
    ToolDefinition;
}) {
  return (
    <Link
      href={
        tool.href!
      }
      className="group flex h-full flex-col rounded-[1.75rem] border border-line bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <Icon
            name={
              tool.icon
            }
            className="h-6 w-6"
          />
        </div>

        <span className="rounded-full bg-brand-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-brand-800">
          działa
        </span>
      </div>

      <p className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-brand-700">
        {tool.category}
      </p>

      <h3 className="mt-1 text-xl font-black tracking-[-0.02em]">
        {tool.title}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-6 text-muted">
        {tool.description}
      </p>

      <p className="mt-4 rounded-xl bg-canvas px-3 py-2.5 text-xs font-semibold leading-5 text-muted">
        {tool.whatYouGet}
      </p>

      <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-700">
        Uruchom

        <Icon
          name="arrow-right"
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}

function PortalModuleCard({
  module,
}: {
  module:
    PortalModule;
}) {
  return (
    <Link
      href={
        module.href
      }
      className="group flex min-h-[270px] flex-col rounded-[2rem] border border-line bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover sm:p-7"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        <Icon
          name={
            module.icon
          }
          className="h-6 w-6"
        />
      </div>

      <p className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-brand-700">
        {module.kicker}
      </p>

      <h3 className="mt-2 text-2xl font-black tracking-tight">
        {module.title}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-6 text-muted">
        {module.description}
      </p>

      <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-brand-700">
        {module.cta}

        <Icon
          name="arrow-right"
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}

function Principle({
  icon,
  title,
  children,
}: {
  icon:
    IconName;

  title:
    string;

  children:
    ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-line bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <Icon
          name={
            icon
          }
          className="h-5 w-5"
        />
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
