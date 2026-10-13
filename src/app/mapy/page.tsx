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
  getMapCatalogPlaces,
  getMapCategories,
  normalizeMapQuery,
} from "@/lib/maps/catalog";

import type {
  MapViewMode,
} from "@/lib/maps/explorer-types";

export const metadata: Metadata = {
  title:
    "Mapy",

  description:
    "Mapa praktycznych miejsc Januszowni: parkingi, woda, toalety, tanie jedzenie, darmowe miejsca i targowiska.",
};

interface MapsPageProps {
  searchParams:
    Promise<
      Record<
        string,
        | string
        | string[]
        | undefined
      >
    >;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function MapsPage({
  searchParams,
}: MapsPageProps) {
  const params =
    await searchParams;

  const categories =
    await getMapCategories();

  const query =
    normalizeMapQuery(
      readSingleParam(
        params.q,
      ),
    );

  const knownSlugs =
    new Set(
      categories.map(
        (
          category,
        ) =>
          category.slug,
      ),
    );

  const selectedCategories =
    readListParam(
      params.category,
    ).filter(
      (
        slug,
      ) =>
        knownSlugs.has(
          slug,
        ),
    );

  const initialView:
    MapViewMode =
    readSingleParam(
      params.view,
    ) ===
    "map"
      ? "map"
      : "list";

  const rawPlaceId =
    readSingleParam(
      params.place,
    );

  const initialPlaceId =
    UUID_PATTERN.test(
      rawPlaceId,
    )
      ? rawPlaceId
      : null;

  const initialPlaces =
    await getMapCatalogPlaces({
      query,

      categorySlugs:
        selectedCategories,

      limit:
        80,
    });

  return (
    <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-5 sm:py-6 lg:px-7">
      <header className="mb-4 flex flex-col gap-4 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-black text-brand-700">
            <Icon
              name="map-pin"
              className="h-4 w-4"
            />

            Mapa Cebularza
          </div>

          <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
            Przydatne miejsca bez
            zbędnego kombinowania
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">
            Na telefonie zaczynamy
            od szybkiej listy. Widok
            mapy działa w osobnym,
            lekkim module niezależnym
            od hydracji całej strony.
          </p>
        </div>

        <div className="hidden shrink-0 gap-2 sm:flex">
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
        initialPlaces={
          initialPlaces
        }
        initialQuery={
          query
        }
        initialCategories={
          selectedCategories
        }
        initialView={
          initialView
        }
        initialPlaceId={
          initialPlaceId
        }
      />

      <footer className="mt-4 flex flex-col gap-2 px-1 text-xs leading-5 text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          Lista miejsc działa niezależnie
          od interaktywnej mapy. Punkty są
          publikowane po moderacji, a ich
          aktualność może być potwierdzana
          przez społeczność.
        </p>

        <Link
          href="/o-nas"
          className="shrink-0 font-black text-brand-700 hover:underline"
        >
          Jak weryfikujemy dane?
        </Link>
      </footer>
    </div>
  );
}

function readSingleParam(
  value:
    | string
    | string[]
    | undefined,
): string {
  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  if (
    Array.isArray(
      value,
    )
  ) {
    return (
      value[0] ??
      ""
    );
  }

  return "";
}

function readListParam(
  value:
    | string
    | string[]
    | undefined,
): string[] {
  const values =
    Array.isArray(
      value,
    )
      ? value
      : typeof value ===
          "string"
        ? [
            value,
          ]
        : [];

  return [
    ...new Set(
      values
        .flatMap(
          (
            item,
          ) =>
            item.split(
              ",",
            ),
        )
        .map(
          (
            item,
          ) =>
            item.trim(),
        )
        .filter(
          Boolean,
        ),
    ),
  ].slice(
    0,
    20,
  );
}
