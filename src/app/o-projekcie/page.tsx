import type { Metadata } from "next";
import Link from "next/link";

import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "O projekcie",
  description:
    "Założenia i kierunek rozwoju Januszowni.",
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-700">
            O projekcie
          </p>

          <h1 className="mt-2 max-w-4xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Januszownia ma być
            zabawna, ale przede
            wszystkim przydatna.
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-7 text-muted sm:text-lg">
            Budujemy jeden duży portal
            łączący praktyczne
            kalkulatory, lokalne mapy,
            społeczność i
            rozrywkę.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-5 sm:grid-cols-3">
          <Value
            icon="calculator"
            title="Użyteczność"
          >
            Narzędzia mają rozwiązywać
            prawdziwe codzienne
            problemy.
          </Value>

          <Value
            icon="shield-check"
            title="Rzetelność"
          >
            Wyniki i zmienne dane mają
            posiadać jasne założenia,
            źródła i aktualność.
          </Value>

          <Value
            icon="smile"
            title="Charakter"
          >
            Humor Januszowni powinien
            być rozpoznawalny, ale
            nigdy męczący.
          </Value>
        </div>

        <div className="mt-12 rounded-[2rem] border border-line bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-black">
            Dlaczego budujemy portal
            etapami?
          </h2>

          <div className="mt-5 space-y-4 leading-7 text-muted">
            <p>
              Duża liczba funkcji nie
              może oznaczać dużej
              liczby niezależnych
              miniaplikacji.
            </p>

            <p>
              Najpierw powstaje wspólna
              architektura, design
              system oraz modele
              danych. Następnie
              podpinamy mapy, bazę,
              konta i kolejne
              narzędzia.
            </p>

            <p>
              Dzięki temu jedno konto
              będzie mogło później
              zapisywać obliczenia,
              miejsca, zgłoszenia,
              alerty i osiągnięcia.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <Link
            href="/narzedzia"
            className="inline-flex min-h-12 items-center gap-2 rounded-button bg-brand-600 px-5 py-3 font-black text-white transition hover:bg-brand-700"
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

function Value({
  icon,
  title,
  children,
}: {
  icon:
    | "calculator"
    | "shield-check"
    | "smile";
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-card border border-line bg-white p-6 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <Icon
          name={icon}
          className="h-5 w-5"
        />
      </div>

      <h2 className="mt-5 text-lg font-black">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-muted">
        {children}
      </p>
    </article>
  );
}