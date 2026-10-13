import Link from "next/link";

import {
  MapPlaceList,
} from "@/components/maps/map-place-list";

import {
  Icon,
} from "@/components/ui/icon";

import type {
  MapCategory,
  MapExplorerPlace,
  MapViewMode,
} from "@/lib/maps/explorer-types";

interface MapExplorerProps {
  categories:
    MapCategory[];

  initialPlaces:
    MapExplorerPlace[];

  initialQuery:
    string;

  initialCategories:
    string[];

  initialView:
    MapViewMode;

  initialPlaceId:
    string | null;
}

export function MapExplorer({
  categories,
  initialPlaces,
  initialQuery,
  initialCategories,
  initialView,
  initialPlaceId,
}: MapExplorerProps) {
  const selectedPlace =
    initialPlaceId
      ? initialPlaces.find(
          (
            place,
          ) =>
            place.id ===
            initialPlaceId,
        ) ??
        null
      : null;

  const listHref =
    buildMapHref({
      query:
        initialQuery,

      categories:
        initialCategories,

      view:
        "list",
    });

  const mapHref =
    buildMapHref({
      query:
        initialQuery,

      categories:
        initialCategories,

      view:
        "map",

      placeId:
        initialPlaceId,
    });

  const embedHref =
    buildEmbedHref({
      query:
        initialQuery,

      categories:
        initialCategories,

      place:
        selectedPlace,
    });

  return (
    <section className="overflow-hidden rounded-[1.6rem] border border-line bg-white shadow-sm sm:rounded-[2rem]">
      <div className="border-b border-line bg-white p-3 sm:p-5">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
          <form
            action="/mapy"
            method="get"
            className="flex min-w-0 gap-2"
          >
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">
                Szukaj miejsca
              </span>

              <Icon
                name="search"
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              />

              <input
                name="q"
                type="search"
                defaultValue={
                  initialQuery
                }
                maxLength={80}
                placeholder="Miejsce, miasto lub adres…"
                className="h-12 w-full rounded-2xl border border-line bg-canvas pl-11 pr-4 text-sm font-semibold outline-none transition placeholder:font-normal placeholder:text-subtle focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
              />
            </label>

            {initialCategories.length >
            0 ? (
              <input
                type="hidden"
                name="category"
                value={
                  initialCategories.join(
                    ",",
                  )
                }
              />
            ) : null}

            {initialView ===
            "map" ? (
              <input
                type="hidden"
                name="view"
                value="map"
              />
            ) : null}

            <button
              type="submit"
              className="flex h-12 shrink-0 items-center justify-center rounded-2xl bg-brand-600 px-4 text-sm font-black text-white transition hover:bg-brand-700"
            >
              Szukaj
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Link
              href="/konto/kolekcje"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white px-3 text-xs font-black transition hover:bg-canvas sm:px-4 sm:text-sm"
            >
              <Icon
                name="grid"
                className="h-4 w-4"
              />

              Kolekcje
            </Link>

            <Link
              href="/mapy/dodaj"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-900 px-3 text-xs font-black text-white transition hover:bg-brand-800 sm:px-4 sm:text-sm"
            >
              <span
                aria-hidden="true"
                className="text-base"
              >
                +
              </span>

              Dodaj miejsce
            </Link>
          </div>
        </div>

        <nav
          aria-label="Kategorie mapy"
          className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-4"
        >
          <Link
            href={
              buildMapHref({
                query:
                  initialQuery,

                categories:
                  [],

                view:
                  initialView,
              })
            }
            aria-current={
              initialCategories.length ===
              0
                ? "page"
                : undefined
            }
            className={[
              "inline-flex min-h-10 shrink-0 items-center rounded-full border px-4 text-xs font-black transition",
              initialCategories.length ===
              0
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-line bg-white text-muted hover:bg-canvas hover:text-ink",
            ].join(
              " ",
            )}
          >
            Wszystkie
          </Link>

          {categories.map(
            (
              category,
            ) => {
              const active =
                initialCategories.includes(
                  category.slug,
                );

              const nextCategories =
                active
                  ? initialCategories.filter(
                      (
                        slug,
                      ) =>
                        slug !==
                        category.slug,
                    )
                  : [
                      ...initialCategories,
                      category.slug,
                    ];

              return (
                <Link
                  key={
                    category.id
                  }
                  href={
                    buildMapHref({
                      query:
                        initialQuery,

                      categories:
                        nextCategories,

                      view:
                        initialView,
                    })
                  }
                  aria-current={
                    active
                      ? "page"
                      : undefined
                  }
                  title={
                    category.description ??
                    category.name
                  }
                  className={[
                    "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-black transition",
                    active
                      ? "border-brand-600 bg-brand-50 text-brand-800"
                      : "border-line bg-white text-muted hover:bg-canvas hover:text-ink",
                  ].join(
                    " ",
                  )}
                >
                  <Icon
                    name={
                      category.icon
                    }
                    className="h-4 w-4"
                  />

                  {
                    category.name
                  }
                </Link>
              );
            },
          )}

          {initialQuery ||
          initialCategories.length >
            0 ? (
            <Link
              href={
                buildMapHref({
                  query:
                    "",

                  categories:
                    [],

                  view:
                    initialView,
                })
              }
              className="inline-flex min-h-10 shrink-0 items-center px-3 text-xs font-black text-brand-700 hover:underline"
            >
              Wyczyść
            </Link>
          ) : null}
        </nav>
      </div>

      <div className="border-b border-line p-2.5 lg:hidden">
        <div className="grid grid-cols-2 rounded-xl bg-canvas p-1">
          <Link
            href={
              mapHref
            }
            aria-current={
              initialView ===
              "map"
                ? "page"
                : undefined
            }
            className={[
              "flex min-h-10 items-center justify-center rounded-lg px-3 text-xs font-black transition",
              initialView ===
              "map"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-muted",
            ].join(
              " ",
            )}
          >
            Mapa
          </Link>

          <Link
            href={
              listHref
            }
            aria-current={
              initialView ===
              "list"
                ? "page"
                : undefined
            }
            className={[
              "flex min-h-10 items-center justify-center rounded-lg px-3 text-xs font-black transition",
              initialView ===
              "list"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-muted",
            ].join(
              " ",
            )}
          >
            Lista ·{" "}
            {
              initialPlaces.length
            }
          </Link>
        </div>
      </div>

      <div className="lg:grid lg:h-[calc(100vh-10rem)] lg:min-h-[650px] lg:max-h-[960px] lg:grid-cols-[390px_minmax(0,1fr)]">
        <aside
          className={[
            "min-h-0 bg-white lg:flex lg:flex-col lg:border-r lg:border-line",
            initialView ===
            "list"
              ? "block"
              : "hidden lg:flex",
          ].join(
            " ",
          )}
        >
          <ResultsHeader
            count={
              initialPlaces.length
            }
            query={
              initialQuery
            }
          />

          <div className="min-h-0 flex-1 lg:overflow-y-auto">
            <MapPlaceList
              places={
                initialPlaces
              }
              selectedPlaceId={
                initialPlaceId
              }
              query={
                initialQuery
              }
              categories={
                initialCategories
              }
              emptyTitle={
                initialQuery
                  ? "Brak pasujących miejsc"
                  : "Nie znaleziono miejsc"
              }
              emptyDescription={
                initialQuery
                  ? "Zmień wyszukiwaną frazę albo usuń część filtrów."
                  : "Zmień kategorię albo dodaj pierwsze sprawdzone miejsce."
              }
            />
          </div>
        </aside>

        <div
          className={[
            "relative h-[64vh] min-h-[460px] max-h-[760px] bg-[#eef2ec] lg:block lg:h-full lg:min-h-0 lg:max-h-none",
            initialView ===
            "map"
              ? "block"
              : "hidden lg:block",
          ].join(
            " ",
          )}
        >
          <iframe
            key={
              embedHref
            }
            src={
              embedHref
            }
            title="Interaktywna mapa miejsc Januszowni"
            loading={
              initialView ===
              "map"
                ? "eager"
                : "lazy"
            }
            referrerPolicy="strict-origin-when-cross-origin"
            className="h-full w-full border-0"
            style={{
              width:
                "100%",

              height:
                "100%",

              minHeight:
                "460px",

              border:
                0,

              display:
                "block",
            }}
          />
        </div>
      </div>
    </section>
  );
}

function ResultsHeader({
  count,
  query,
}: {
  count: number;
  query: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-muted">
          {query
            ? "Wyniki wyszukiwania"
            : "Katalog miejsc"}
        </p>

        <p className="mt-1 font-black">
          {count}{" "}
          {placeWord(
            count,
          )}
        </p>
      </div>

      {count >=
      80 ? (
        <span className="rounded-full bg-accent-50 px-2.5 py-1 text-[10px] font-black text-accent-800">
          pierwsze 80
        </span>
      ) : null}
    </div>
  );
}

function buildMapHref({
  query,
  categories,
  view,
  placeId,
}: {
  query: string;

  categories:
    readonly string[];

  view:
    MapViewMode;

  placeId?:
    string | null;
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

  if (
    view ===
    "map"
  ) {
    params.set(
      "view",
      "map",
    );
  }

  if (placeId) {
    params.set(
      "place",
      placeId,
    );
  }

  const queryString =
    params.toString();

  return queryString
    ? `/mapy?${queryString}`
    : "/mapy";
}

function buildEmbedHref({
  query,
  categories,
  place,
}: {
  query: string;

  categories:
    readonly string[];

  place:
    MapExplorerPlace | null;
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

  if (place) {
    params.set(
      "place",
      place.id,
    );

    params.set(
      "lat",
      String(
        place.latitude,
      ),
    );

    params.set(
      "lng",
      String(
        place.longitude,
      ),
    );

    params.set(
      "zoom",
      "16",
    );
  }

  const queryString =
    params.toString();

  return queryString
    ? `/mapy/embed?${queryString}`
    : "/mapy/embed";
}

function placeWord(
  count: number,
): string {
  if (
    count === 1
  ) {
    return "miejsce";
  }

  const last =
    count %
    10;

  const lastTwo =
    count %
    100;

  if (
    last >= 2 &&
    last <= 4 &&
    !(
      lastTwo >= 12 &&
      lastTwo <= 14
    )
  ) {
    return "miejsca";
  }

  return "miejsc";
}