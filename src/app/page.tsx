import Link from "next/link";

import { Hero } from "@/components/home/hero";
import {
  Icon,
  type IconName,
} from "@/components/ui/icon";
import { getAvailableTools } from "@/lib/tools/catalog";

interface PortalModule {
  title: string;
  description: string;
  href: string;
  icon: IconName;
  kicker: string;
}

const portalModules: PortalModule[] = [
  {
    title: "Mapa Cebularza",
    description:
      "Jedna mapa z warstwami parkingów, wody, toalet, jedzenia, atrakcji i kolejnych kategorii.",
    href: "/mapy",
    icon: "map-pin",
    kicker: "Mapy",
  },
  {
    title: "Społeczność",
    description:
      "Użytkownicy będą mogli zgłaszać miejsca, poprawiać dane i pomagać w ich weryfikacji.",
    href: "/spolecznosc",
    icon: "users",
    kicker: "Ludzie",
  },
  {
    title: "Strefa Beki",
    description:
      "Testy i zabawa, która zachowuje charakter Januszowni, ale nie miesza się z poważnymi danymi.",
    href: "/rozrywka",
    icon: "smile",
    kicker: "Rozrywka",
  },
];

export default function HomePage() {
  const availableTools =
    getAvailableTools();

  return (
    <>
      <Hero />

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Narzędzia"
              title="Najpierw rzeczy, które naprawdę się przydają."
              description="Trzy pierwsze kalkulatory już wykonują rzeczywiste obliczenia. Każdy kolejny będzie korzystał ze wspólnego systemu."
            />

            <Link
              href="/narzedzia"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-button border border-line bg-white px-4 py-2.5 text-sm font-bold transition hover:border-brand-200 hover:bg-brand-50 sm:self-auto"
            >
              Wszystkie narzędzia

              <Icon
                name="arrow-right"
                className="h-4 w-4"
              />
            </Link>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {availableTools.map(
              (tool) => (
                <Link
                  key={tool.slug}
                  href={tool.href!}
                  className="group rounded-card border border-line bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover"
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

                    <span className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-black text-brand-800">
                      Działa
                    </span>
                  </div>

                  <p className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-brand-700">
                    {tool.category}
                  </p>

                  <h2 className="mt-2 text-xl font-black tracking-tight">
                    {tool.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    {
                      tool.description
                    }
                  </p>

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-700">
                    Uruchom

                    <Icon
                      name="arrow-right"
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <SectionHeading
            eyebrow="Cała Januszownia"
            title="Więcej niż katalog kalkulatorów."
            description="Portal będzie składał się z kilku mocnych części, które później połączymy wspólnym kontem i bazą danych."
          />

          <div className="mt-9 grid gap-5 lg:grid-cols-3">
            {portalModules.map(
              (module) => (
                <Link
                  key={
                    module.title
                  }
                  href={
                    module.href
                  }
                  className="group flex min-h-72 flex-col rounded-[2rem] border border-line bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover sm:p-7"
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
                    {
                      module.kicker
                    }
                  </p>

                  <h2 className="mt-2 text-2xl font-black tracking-tight">
                    {
                      module.title
                    }
                  </h2>

                  <p className="mt-3 flex-1 text-sm leading-6 text-muted">
                    {
                      module.description
                    }
                  </p>

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-700">
                    Zobacz dział

                    <Icon
                      name="arrow-right"
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-700">
                Jak to działa
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
                Jeden portal,
                wspólne zasady.
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-muted">
                Funkcji będzie dużo,
                ale użytkownik nie
                powinien czuć się jak
                w katalogu stu
                przypadkowych linków.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Principle
                icon="search"
                title="Szukasz problemu"
              >
                Nie musisz znać nazwy
                funkcji. Wyszukiwarka
                prowadzi do
                odpowiedniego działu.
              </Principle>

              <Principle
                icon="calculator"
                title="Dostajesz narzędzie"
              >
                Kalkulator lub mapa
                wykonują konkretną
                pracę zamiast tylko
                pokazywać artykuł.
              </Principle>

              <Principle
                icon="shield-check"
                title="Widzisz założenia"
              >
                Wyniki mają wzory,
                źródła i informację o
                aktualności.
              </Principle>

              <Principle
                icon="sparkles"
                title="Humor jest dodatkiem"
              >
                Januszowanie nadaje
                charakter, ale nie
                psuje użyteczności.
              </Principle>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-200">
                Start
              </p>

              <h2 className="mt-2 max-w-3xl text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                Nie wiesz, gdzie
                zacząć?
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-brand-100">
                Wejdź do katalogu
                narzędzi albo sprawdź
                Januszometr.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/narzedzia"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-button bg-white px-5 py-3 font-bold text-brand-900 transition hover:bg-brand-50"
              >
                Narzędzia
              </Link>

              <Link
                href="/rozrywka"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-button border border-brand-700 px-5 py-3 font-bold text-white transition hover:bg-brand-800"
              >
                Januszometr
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
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

interface PrincipleProps {
  icon: IconName;
  title: string;
  children: React.ReactNode;
}

function Principle({
  icon,
  title,
  children,
}: PrincipleProps) {
  return (
    <div className="rounded-card border border-line bg-canvas p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm">
        <Icon
          name={icon}
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