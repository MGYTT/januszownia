import Link from "next/link";

import {
  Icon,
} from "@/components/ui/icon";

import type {
  MapExplorerPlace,
} from "@/lib/maps/explorer-types";

interface MapPlaceListProps {
  places:
    MapExplorerPlace[];

  selectedPlaceId:
    string | null;

  query:
    string;

  categories:
    readonly string[];

  emptyTitle:
    string;

  emptyDescription:
    string;
}

export function MapPlaceList({
  places,
  selectedPlaceId,
  query,
  categories,
  emptyTitle,
  emptyDescription,
}: MapPlaceListProps) {
  if (
    places.length ===
    0
  ) {
    return (
      <div className="px-5 py-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <Icon
            name="map-pin"
            className="h-5 w-5"
          />
        </div>

        <h3 className="mt-4 font-black">
          {emptyTitle}
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
          {emptyDescription}
        </p>

        <Link
          href="/mapy/dodaj"
          className="mt-5 inline-flex min-h-10 items-center justify-center rounded-xl bg-brand-600 px-4 text-xs font-black text-white transition hover:bg-brand-700"
        >
          Dodaj miejsce
        </Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-line">
      {places.map(
        (
          place,
        ) => {
          const selected =
            place.id ===
            selectedPlaceId;

          return (
            <article
              key={
                place.id
              }
              className={[
                "p-4 transition sm:p-5",
                selected
                  ? "bg-brand-50/80"
                  : "bg-white hover:bg-canvas/70",
              ].join(
                " ",
              )}
            >
              <div className="flex items-start gap-3">
                <CategoryDot
                  slug={
                    place.categorySlug
                  }
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.08em] text-brand-700">
                      {
                        place.categoryName
                      }
                    </span>

                    {place.verifiedAt ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-muted">
                        <Icon
                          name="shield-check"
                          className="h-3 w-3 text-brand-700"
                        />

                        zweryfikowane
                      </span>
                    ) : null}
                  </div>

                  <Link
                    href={`/mapy/miejsce/${place.id}`}
                    className="mt-1 block text-[15px] font-black leading-5 hover:text-brand-700 hover:underline"
                  >
                    {
                      place.name
                    }
                  </Link>

                  <p className="mt-1.5 text-xs leading-5 text-muted">
                    {formatPlaceAddress(
                      place,
                    )}
                  </p>

                  {place.description ? (
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">
                      {
                        place.description
                      }
                    </p>
                  ) : null}

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Link
                      href={
                        buildMapHref({
                          query,

                          categories,

                          placeId:
                            place.id,
                        })
                      }
                      className="inline-flex min-h-9 items-center justify-center rounded-xl border border-brand-200 bg-brand-50 px-3 text-xs font-black text-brand-800 transition hover:bg-brand-100"
                    >
                      Pokaż na mapie
                    </Link>

                    <Link
                      href={`/mapy/miejsce/${place.id}`}
                      className="inline-flex min-h-9 items-center justify-center rounded-xl border border-line bg-white px-3 text-xs font-black transition hover:bg-canvas"
                    >
                      Szczegóły
                    </Link>

                    <a
                      href={
                        openStreetMapHref(
                          place,
                        )
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-9 items-center justify-center px-2 text-xs font-black text-brand-700 hover:underline"
                    >
                      Otwórz w OSM ↗
                    </a>
                  </div>

                  {place.verifiedAt ? (
                    <p className="mt-3 text-[10px] text-subtle">
                      Weryfikacja{" "}
                      {formatDate(
                        place.verifiedAt,
                      )}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          );
        },
      )}
    </div>
  );
}

function CategoryDot({
  slug,
}: {
  slug: string;
}) {
  return (
    <span
      aria-hidden="true"
      className="mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-white shadow-sm"
      style={{
        backgroundColor:
          categoryColor(
            slug,
          ),
      }}
    />
  );
}

function buildMapHref({
  query,
  categories,
  placeId,
}: {
  query: string;
  categories:
    readonly string[];
  placeId:
    string;
}): string {
  const params =
    new URLSearchParams();

  if (query) {
    params.set(
      "q",
      query,
    );
  }

  if (
    categories.length >
    0
  ) {
    params.set(
      "category",
      categories.join(
        ",",
      ),
    );
  }

  params.set(
    "view",
    "map",
  );

  params.set(
    "place",
    placeId,
  );

  return `/mapy?${params.toString()}`;
}

function formatPlaceAddress(
  place: MapExplorerPlace,
): string {
  const parts =
    [
      place.address,
      place.city,
    ].filter(
      (
        value,
      ): value is string =>
        Boolean(
          value,
        ),
    );

  return parts.length >
    0
    ? parts.join(
        " · ",
      )
    : "Brak szczegółowego adresu";
}

function openStreetMapHref(
  place: MapExplorerPlace,
): string {
  const latitude =
    place.latitude.toFixed(
      6,
    );

  const longitude =
    place.longitude.toFixed(
      6,
    );

  return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`;
}

function categoryColor(
  slug: string,
): string {
  switch (slug) {
    case "parking":
      return "#2563eb";

    case "water":
      return "#0284c7";

    case "toilets":
      return "#7c3aed";

    case "food":
      return "#d97706";

    case "free":
      return "#16a34a";

    case "markets":
      return "#be123c";

    default:
      return "#166534";
  }
}

const dateFormatter =
  new Intl.DateTimeFormat(
    "pl-PL",
    {
      dateStyle:
        "medium",
    },
  );

function formatDate(
  value: string,
): string {
  const date =
    new Date(
      value,
    );

  return Number.isNaN(
    date.getTime(),
  )
    ? "—"
    : dateFormatter.format(
        date,
      );
}