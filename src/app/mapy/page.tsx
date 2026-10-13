import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  MapExplorer,
} from "@/components/maps/map-explorer";

import {
  Icon,
} from "@/components/ui/icon";

import {
  getMapCategories,
} from "@/lib/maps/catalog";

export const metadata: Metadata = {
  title:
    "Mapy",

  description:
    "Mapa praktycznych miejsc Januszowni: parkingi, woda, toalety, tanie jedzenie, darmowe miejsca i targowiska.",
};

export default async function MapsPage() {
  const categories =
    await getMapCategories();

  return (
    <div className="mx-auto max-w-[1600px] px-3 py-5 sm:px-5 sm:py-7 lg:px-7">
      <header className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-black text-brand-700">
            <Icon
              name="map-pin"
              className="h-4 w-4"
            />

            Mapa Cebularza
          </div>

          <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
            Znajdź coś przydatnego
            w pobliżu
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">
            Bez przebijania się
            przez zbędne formularze.
            Przesuń mapę, wybierz
            kategorię albo skorzystaj
            z własnej lokalizacji.
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <Link
            href="/konto/kolekcje"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-black transition hover:bg-canvas"
          >
            <Icon
              name="grid"
              className="h-4 w-4"
            />

            Kolekcje
          </Link>

          <Link
            href="/mapy/dodaj"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-black text-white transition hover:bg-brand-700"
          >
            <span
              aria-hidden="true"
              className="text-lg leading-none"
            >
              +
            </span>

            Dodaj miejsce
          </Link>
        </div>
      </header>

      <MapExplorer
        categories={
          categories
        }
      />

      <div className="mt-4 flex flex-col gap-2 px-1 text-xs leading-5 text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          Punkty na mapie są
          publikowane po moderacji.
          Aktualność może być
          dodatkowo potwierdzana przez
          społeczność.
        </p>

        <Link
          href="/o-nas"
          className="shrink-0 font-black text-brand-700 hover:underline"
        >
          Jak weryfikujemy dane?
        </Link>
      </div>
    </div>
  );
}