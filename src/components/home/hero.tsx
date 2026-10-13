import Link from "next/link";

import { PortalSearch } from "@/components/home/portal-search";
import {
  Icon,
  type IconName,
} from "@/components/ui/icon";

interface Goal {
  title: string;
  description: string;
  href: string;
  icon: IconName;
}

const goals: Goal[] = [
  {
    title: "Chcę zaoszczędzić",
    description:
      "Porównuj ceny i korzystaj z praktycznych przeliczników.",
    href: "/narzedzia",
    icon: "wallet",
  },
  {
    title: "Chcę coś policzyć",
    description:
      "Kalkulatory z prawdziwymi wzorami i jasnym wynikiem.",
    href: "/narzedzia",
    icon: "calculator",
  },
  {
    title: "Szukam w okolicy",
    description:
      "Mapy parkingów, wody, jedzenia i innych przydatnych miejsc.",
    href: "/mapy",
    icon: "map-pin",
  },
  {
    title: "Przyszedłem dla beki",
    description:
      "Januszometr i kolejne cebulowe atrakcje.",
    href: "/rozrywka",
    icon: "smile",
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-36 -top-36 h-96 w-96 rounded-full bg-brand-100/60 blur-3xl" />

      <div className="pointer-events-none absolute -left-40 top-72 h-80 w-80 rounded-full bg-accent-100/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pb-24 lg:pt-20">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1.5 text-sm font-bold text-brand-700 shadow-sm">
            <span aria-hidden="true">
              🧅
            </span>

            Centrum rozsądnego
            cebulowania
          </div>

          <h1 className="max-w-3xl text-balance text-4xl font-black tracking-[-0.04em] text-ink sm:text-5xl lg:text-6xl">
            Co dzisiaj{" "}
            <span className="text-brand-600">
              kombinujemy?
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Mapy, kalkulatory,
            społeczność i trochę
            kontrolowanego januszowania.
            Najpierw użyteczność, później
            żarty.
          </p>

          <div className="mt-8">
            <PortalSearch />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
            {goals.map((goal) => (
              <Link
                key={goal.title}
                href={goal.href}
                className="group rounded-card border border-line bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card sm:p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 sm:h-11 sm:w-11">
                  <Icon
                    name={goal.icon}
                    className="h-5 w-5"
                  />
                </div>

                <h2 className="mt-4 text-sm font-black leading-snug sm:text-base">
                  {goal.title}
                </h2>

                <p className="mt-1.5 hidden text-sm leading-6 text-muted sm:block">
                  {goal.description}
                </p>

                <span className="mt-4 hidden items-center gap-1.5 text-sm font-bold text-brand-700 sm:inline-flex">
                  Otwórz

                  <Icon
                    name="arrow-right"
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>

        <aside className="relative hidden lg:block">
          <div className="sticky top-28 overflow-hidden rounded-[2rem] border border-brand-100 bg-white p-7 shadow-card">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-[5rem] bg-brand-50" />

            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-2xl font-black text-white">
                J
              </div>

              <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-brand-700">
                Zasada Januszowni
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight">
                Najpierw liczby.
                <br />
                Potem cebula.
              </h2>

              <div className="mt-6 space-y-5">
                <QualityPoint
                  number="01"
                  title="Obliczenia mają wzory"
                >
                  Wynik kalkulatora
                  pochodzi z kodu i
                  jawnych założeń.
                </QualityPoint>

                <QualityPoint
                  number="02"
                  title="Dane mają źródło"
                >
                  Miejsca, ceny i okazje
                  będą miały informację
                  o aktualności.
                </QualityPoint>

                <QualityPoint
                  number="03"
                  title="Humor nie przeszkadza"
                >
                  Żart nigdy nie może
                  ukrywać ważnej
                  informacji.
                </QualityPoint>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

interface QualityPointProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

function QualityPoint({
  number,
  title,
  children,
}: QualityPointProps) {
  return (
    <div className="flex gap-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-black text-brand-700">
        {number}
      </span>

      <div>
        <h3 className="font-black">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-muted">
          {children}
        </p>
      </div>
    </div>
  );
}