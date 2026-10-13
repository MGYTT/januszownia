"use client";

import Link from "next/link";

import {
  type ReactNode,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  MapCanvas,
} from "@/components/maps/map-canvas";

import {
  Icon,
} from "@/components/ui/icon";

import type {
  MapBounds,
  MapCategory,
  MapExplorerPlace,
  MapFocus,
  MapPlacesApiResponse,
} from "@/lib/maps/explorer-types";

interface MapExplorerProps {
  categories:
    MapCategory[];
}

type MobileMode =
  | "map"
  | "list";

const POLAND_FOCUS = {
  latitude:
    52.0693,

  longitude:
    19.4803,

  zoom:
    6,
};

export function MapExplorer({
  categories,
}: MapExplorerProps) {
  const [
    bounds,
    setBounds,
  ] =
    useState<MapBounds | null>(
      null,
    );

  const [
    places,
    setPlaces,
  ] =
    useState<
      MapExplorerPlace[]
    >(
      [],
    );

  const [
    selectedCategories,
    setSelectedCategories,
  ] =
    useState<
      string[]
    >(
      [],
    );

  const [
    search,
    setSearch,
  ] =
    useState(
      "",
    );

  const deferredSearch =
    useDeferredValue(
      search,
    );

  const [
    selectedPlaceId,
    setSelectedPlaceId,
  ] =
    useState<
      string | null
    >(
      null,
    );

  const [
    focus,
    setFocus,
  ] =
    useState<MapFocus | null>(
      null,
    );

  const [
    mobileMode,
    setMobileMode,
  ] =
    useState<MobileMode>(
      "map",
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      false,
    );

  const [
    truncated,
    setTruncated,
  ] =
    useState(
      false,
    );

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(
      null,
    );

  const [
    locating,
    setLocating,
  ] =
    useState(
      false,
    );

  const [
    locationError,
    setLocationError,
  ] =
    useState<
      string | null
    >(
      null,
    );

  const handleViewportChange =
    useCallback(
      (
        nextBounds:
          MapBounds,
      ) => {
        setBounds(
          nextBounds,
        );
      },
      [],
    );

  useEffect(
    () => {
      if (!bounds) {
        return;
      }

      const controller =
        new AbortController();

      const timeout =
        window.setTimeout(
          async () => {
            setLoading(
              true,
            );

            setError(
              null,
            );

            const params =
              new URLSearchParams({
                minLat:
                  String(
                    bounds.minLat,
                  ),

                minLong:
                  String(
                    bounds.minLong,
                  ),

                maxLat:
                  String(
                    bounds.maxLat,
                  ),

                maxLong:
                  String(
                    bounds.maxLong,
                  ),
              });

            if (
              selectedCategories.length >
              0
            ) {
              params.set(
                "categories",
                selectedCategories.join(
                  ",",
                ),
              );
            }

            try {
              const response =
                await fetch(
                  `/api/mapy/miejsca?${params.toString()}`,
                  {
                    signal:
                      controller.signal,

                    cache:
                      "no-store",
                  },
                );

              if (
                !response.ok
              ) {
                throw new Error(
                  "MAP_REQUEST_FAILED",
                );
              }

              const payload =
                await response.json() as MapPlacesApiResponse;

              setPlaces(
                Array.isArray(
                  payload.places,
                )
                  ? payload.places
                  : [],
              );

              setTruncated(
                Boolean(
                  payload.truncated,
                ),
              );
            } catch (
              requestError
            ) {
              if (
                controller.signal
                  .aborted
              ) {
                return;
              }

              console.error(
                "Błąd pobierania miejsc mapy:",
                requestError,
              );

              setError(
                "Nie udało się odświeżyć miejsc. Spróbuj ponownie przesunąć mapę.",
              );
            } finally {
              if (
                !controller.signal
                  .aborted
              ) {
                setLoading(
                  false,
                );
              }
            }
          },
          180,
        );

      return () => {
        window.clearTimeout(
          timeout,
        );

        controller.abort();
      };
    },
    [
      bounds,
      selectedCategories,
    ],
  );

  const visiblePlaces =
    useMemo(
      () => {
        const query =
          normalizeSearch(
            deferredSearch,
          );

        if (!query) {
          return places;
        }

        return places.filter(
          (place) => {
            const haystack =
              normalizeSearch(
                [
                  place.name,
                  place.address,
                  place.city,
                  place.categoryName,
                ]
                  .filter(
                    Boolean,
                  )
                  .join(
                    " ",
                  ),
              );

            return haystack.includes(
              query,
            );
          },
        );
      },
      [
        places,
        deferredSearch,
      ],
    );

  function toggleCategory(
    slug: string,
  ) {
    setSelectedCategories(
      (
        current,
      ) =>
        current.includes(
          slug,
        )
          ? current.filter(
              (
                currentSlug,
              ) =>
                currentSlug !==
                slug,
            )
          : [
              ...current,
              slug,
            ],
    );

    setSelectedPlaceId(
      null,
    );
  }

  function resetFilters() {
    setSearch(
      "",
    );

    setSelectedCategories(
      [],
    );

    setSelectedPlaceId(
      null,
    );
  }

  function showPlaceOnMap(
    place:
      MapExplorerPlace,
  ) {
    setSelectedPlaceId(
      place.id,
    );

    setFocus({
      latitude:
        place.latitude,

      longitude:
        place.longitude,

      zoom:
        16,

      token:
        Date.now(),

      showLocationMarker:
        false,
    });

    setMobileMode(
      "map",
    );
  }

  function showWholePoland() {
    setSelectedPlaceId(
      null,
    );

    setFocus({
      ...POLAND_FOCUS,

      token:
        Date.now(),

      showLocationMarker:
        false,
    });

    setMobileMode(
      "map",
    );
  }

  function locateUser() {
    if (
      !navigator.geolocation
    ) {
      setLocationError(
        "Ta przeglądarka nie obsługuje lokalizacji.",
      );

      return;
    }

    setLocating(
      true,
    );

    setLocationError(
      null,
    );

    navigator.geolocation.getCurrentPosition(
      (
        position,
      ) => {
        setLocating(
          false,
        );

        setFocus({
          latitude:
            position.coords
              .latitude,

          longitude:
            position.coords
              .longitude,

          zoom:
            15,

          token:
            Date.now(),

          showLocationMarker:
            true,
        });

        setMobileMode(
          "map",
        );
      },

      (
        geolocationError,
      ) => {
        console.warn(
          "Nie udało się pobrać lokalizacji:",
          geolocationError,
        );

        setLocating(
          false,
        );

        setLocationError(
          "Nie udało się pobrać lokalizacji. Możesz normalnie korzystać z mapy bez udostępniania pozycji.",
        );
      },

      {
        enableHighAccuracy:
          false,

        timeout:
          10000,

        maximumAge:
          60000,
      },
    );
  }

  const filtersActive =
    search.trim().length >
      0 ||
    selectedCategories.length >
      0;

  return (
    <section className="overflow-hidden rounded-[1.6rem] border border-line bg-white shadow-sm sm:rounded-[2rem]">
      <div className="border-b border-line p-3 sm:p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">
              Szukaj miejsca
            </span>

            <Icon
              name="search"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            />

            <input
              type="search"
              value={
                search
              }
              onChange={
                (
                  event,
                ) =>
                  setSearch(
                    event.target
                      .value,
                  )
              }
              placeholder="Szukaj w widocznym obszarze…"
              className="h-12 w-full rounded-2xl border border-line bg-canvas pl-11 pr-4 text-sm font-semibold outline-none transition placeholder:font-normal placeholder:text-subtle focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />
          </label>

          <div className="grid grid-cols-2 gap-2 sm:flex">
            <button
              type="button"
              onClick={
                locateUser
              }
              disabled={
                locating
              }
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white px-3 text-xs font-black transition hover:bg-canvas disabled:cursor-wait disabled:opacity-60 sm:px-4 sm:text-sm"
            >
              <Icon
                name="map-pin"
                className="h-4 w-4"
              />

              {locating
                ? "Szukam…"
                : "Moja okolica"}
            </button>

            <Link
              href="/mapy/dodaj"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 px-3 text-xs font-black text-white transition hover:bg-brand-700 sm:px-4 sm:text-sm"
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

        <div className="mt-3 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-4">
          <button
            type="button"
            onClick={
              () =>
                setSelectedCategories(
                  [],
                )
            }
            aria-pressed={
              selectedCategories.length ===
              0
            }
            className={[
              "inline-flex min-h-10 shrink-0 items-center rounded-full border px-4 text-xs font-black transition",
              selectedCategories.length ===
              0
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-line bg-white text-muted hover:bg-canvas hover:text-ink",
            ].join(
              " ",
            )}
          >
            Wszystkie
          </button>

          {categories.map(
            (
              category,
            ) => {
              const active =
                selectedCategories.includes(
                  category.slug,
                );

              return (
                <button
                  key={
                    category.id
                  }
                  type="button"
                  onClick={
                    () =>
                      toggleCategory(
                        category.slug,
                      )
                  }
                  aria-pressed={
                    active
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
                </button>
              );
            },
          )}

          {filtersActive ? (
            <button
              type="button"
              onClick={
                resetFilters
              }
              className="min-h-10 shrink-0 rounded-full px-3 text-xs font-black text-brand-700 hover:bg-brand-50"
            >
              Wyczyść
            </button>
          ) : null}
        </div>

        {locationError ? (
          <div
            role="status"
            className="mt-3 rounded-xl border border-accent-200 bg-accent-50 px-4 py-3 text-xs font-semibold leading-5 text-accent-800"
          >
            {
              locationError
            }
          </div>
        ) : null}
      </div>

      <div className="border-b border-line p-2.5 lg:hidden">
        <div className="grid grid-cols-2 rounded-xl bg-canvas p-1">
          <MobileModeButton
            active={
              mobileMode ===
              "map"
            }
            onClick={
              () =>
                setMobileMode(
                  "map",
                )
            }
          >
            Mapa
          </MobileModeButton>

          <MobileModeButton
            active={
              mobileMode ===
              "list"
            }
            onClick={
              () =>
                setMobileMode(
                  "list",
                )
            }
          >
            Lista ·{" "}
            {
              visiblePlaces.length
            }
          </MobileModeButton>
        </div>
      </div>

      <div className="lg:grid lg:h-[calc(100svh-11rem)] lg:min-h-[640px] lg:max-h-[900px] lg:grid-cols-[370px_minmax(0,1fr)]">
        <aside className="hidden min-h-0 flex-col border-r border-line bg-white lg:flex">
          <ResultsHeader
            count={
              visiblePlaces.length
            }
            loading={
              loading
            }
            truncated={
              truncated
            }
          />

          <div className="min-h-0 flex-1 overflow-y-auto">
            <PlaceResults
              places={
                visiblePlaces
              }
              selectedPlaceId={
                selectedPlaceId
              }
              error={
                error
              }
              searchActive={
                deferredSearch
                  .trim()
                  .length >
                0
              }
              onShowOnMap={
                showPlaceOnMap
              }
            />
          </div>
        </aside>

        <div
          className={[
            /*
             * svh jest stabilniejsze od
             * dvh przy chowającym się
             * pasku adresu w Safari/Chrome.
             */
            "relative h-[56svh] min-h-[420px] max-h-[620px] bg-canvas lg:block lg:h-full lg:min-h-0 lg:max-h-none",
            mobileMode ===
            "map"
              ? "block"
              : "hidden",
          ].join(
            " ",
          )}
        >
          <MapCanvas
            places={
              places
            }
            selectedPlaceId={
              selectedPlaceId
            }
            focus={
              focus
            }
            onSelectPlace={
              setSelectedPlaceId
            }
            onViewportChange={
              handleViewportChange
            }
          />

          <div className="pointer-events-none absolute left-3 top-3 z-[500] flex max-w-[calc(100%-1.5rem)] flex-wrap gap-2">
            <div className="pointer-events-auto rounded-full border border-line bg-white/95 px-3 py-2 text-xs font-black shadow-sm backdrop-blur">
              {loading
                ? "Aktualizuję…"
                : `${visiblePlaces.length} ${placeWord(
                    visiblePlaces.length,
                  )}`}
            </div>

            {truncated ? (
              <div className="pointer-events-auto rounded-full border border-accent-200 bg-accent-50/95 px-3 py-2 text-xs font-black text-accent-800 shadow-sm backdrop-blur">
                Przybliż mapę
              </div>
            ) : null}
          </div>

          <div className="absolute right-3 top-14 z-[500] flex flex-col gap-2 sm:top-3">
            <button
              type="button"
              onClick={
                locateUser
              }
              disabled={
                locating
              }
              aria-label="Pokaż moją lokalizację"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white/95 text-brand-700 shadow-md backdrop-blur transition hover:bg-white disabled:opacity-60 sm:h-auto sm:w-auto sm:min-h-11 sm:gap-2 sm:px-4"
            >
              <Icon
                name="map-pin"
                className="h-4 w-4"
              />

              <span className="hidden text-xs font-black sm:inline">
                {locating
                  ? "Szukam…"
                  : "Moja lokalizacja"}
              </span>
            </button>

            <button
              type="button"
              onClick={
                showWholePoland
              }
              aria-label="Pokaż całą Polskę"
              className="min-h-10 rounded-xl border border-line bg-white/95 px-3 text-xs font-black shadow-md backdrop-blur transition hover:bg-white"
            >
              <span className="sm:hidden">
                PL
              </span>

              <span className="hidden sm:inline">
                Cała Polska
              </span>
            </button>
          </div>

          {selectedPlaceId ? (
            <SelectedPlaceCard
              place={
                places.find(
                  (
                    place,
                  ) =>
                    place.id ===
                    selectedPlaceId,
                ) ??
                null
              }
              onClose={
                () =>
                  setSelectedPlaceId(
                    null,
                  )
              }
            />
          ) : null}
        </div>

        <div
          className={[
            "bg-white lg:hidden",
            mobileMode ===
            "list"
              ? "block"
              : "hidden",
          ].join(
            " ",
          )}
        >
          <ResultsHeader
            count={
              visiblePlaces.length
            }
            loading={
              loading
            }
            truncated={
              truncated
            }
          />

          <PlaceResults
            places={
              visiblePlaces
            }
            selectedPlaceId={
              selectedPlaceId
            }
            error={
              error
            }
            searchActive={
              deferredSearch
                .trim()
                .length >
              0
            }
            onShowOnMap={
              showPlaceOnMap
            }
          />
        </div>
      </div>
    </section>
  );
}

function ResultsHeader({
  count,
  loading,
  truncated,
}: {
  count: number;

  loading: boolean;

  truncated: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.1em] text-muted">
          Widoczny obszar
        </p>

        <p
          className="mt-1 font-black"
          aria-live="polite"
        >
          {loading
            ? "Aktualizuję…"
            : `${count} ${placeWord(
                count,
              )}`}
        </p>
      </div>

      {truncated ? (
        <span className="rounded-full bg-accent-50 px-2.5 py-1 text-[10px] font-black text-accent-800">
          300+
        </span>
      ) : null}
    </div>
  );
}

function PlaceResults({
  places,
  selectedPlaceId,
  error,
  searchActive,
  onShowOnMap,
}: {
  places:
    MapExplorerPlace[];

  selectedPlaceId:
    string | null;

  error:
    string | null;

  searchActive:
    boolean;

  onShowOnMap:
    (
      place:
        MapExplorerPlace,
    ) => void;
}) {
  if (error) {
    return (
      <div
        role="alert"
        className="m-5 rounded-2xl border border-danger-600/20 bg-danger-50 p-5"
      >
        <p className="font-black text-danger-600">
          Nie udało się pobrać wyników.
        </p>

        <p className="mt-2 text-sm leading-6 text-muted">
          {error}
        </p>
      </div>
    );
  }

  if (
    places.length ===
    0
  ) {
    return (
      <div className="p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <Icon
            name="map-pin"
            className="h-5 w-5"
          />
        </div>

        <h3 className="mt-4 font-black">
          {searchActive
            ? "Brak pasujących miejsc"
            : "W tym obszarze jeszcze nic nie ma"}
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
          {searchActive
            ? "Zmień wyszukiwaną frazę albo wyczyść filtry."
            : "Przesuń mapę, zmień kategorię albo dodaj pierwsze sprawdzone miejsce."}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-line">
      {places.map(
        (place) => {
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
                  ? "bg-brand-50/70"
                  : "bg-white hover:bg-canvas/60",
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
                  <p className="text-[11px] font-black uppercase tracking-[0.08em] text-brand-700">
                    {
                      place.categoryName
                    }
                  </p>

                  <Link
                    href={`/mapy/miejsce/${place.id}`}
                    className="mt-1 block font-black leading-5 hover:text-brand-700 hover:underline"
                  >
                    {
                      place.name
                    }
                  </Link>

                  <p className="mt-2 text-xs leading-5 text-muted">
                    {formatPlaceAddress(
                      place,
                    )}
                  </p>

                  {place.verifiedAt ? (
                    <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted">
                      <Icon
                        name="shield-check"
                        className="h-3.5 w-3.5 text-brand-700"
                      />

                      Zweryfikowano{" "}
                      {formatDate(
                        place.verifiedAt,
                      )}
                    </p>
                  ) : null}

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={
                        () =>
                          onShowOnMap(
                            place,
                          )
                      }
                      className="min-h-9 rounded-xl border border-line bg-white px-3 text-xs font-black transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                    >
                      Pokaż na mapie
                    </button>

                    <Link
                      href={`/mapy/miejsce/${place.id}`}
                      className="text-xs font-black text-brand-700 hover:underline"
                    >
                      Szczegóły →
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        },
      )}
    </div>
  );
}

function SelectedPlaceCard({
  place,
  onClose,
}: {
  place:
    MapExplorerPlace | null;

  onClose:
    () => void;
}) {
  if (!place) {
    return null;
  }

  return (
    <div className="absolute inset-x-3 bottom-3 z-[550] lg:inset-x-auto lg:bottom-4 lg:left-4 lg:w-[340px]">
      <article className="rounded-[1.4rem] border border-line bg-white/95 p-4 shadow-xl backdrop-blur">
        <div className="flex items-start gap-3">
          <CategoryDot
            slug={
              place.categorySlug
            }
          />

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.08em] text-brand-700">
              {
                place.categoryName
              }
            </p>

            <h3 className="mt-1 line-clamp-2 font-black">
              {
                place.name
              }
            </h3>

            <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">
              {formatPlaceAddress(
                place,
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            aria-label="Zamknij wybrane miejsce"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg text-muted transition hover:bg-canvas hover:text-ink"
          >
            ×
          </button>
        </div>

        <Link
          href={`/mapy/miejsce/${place.id}`}
          className="mt-4 flex min-h-10 w-full items-center justify-center rounded-xl bg-brand-600 px-4 text-xs font-black text-white transition hover:bg-brand-700"
        >
          Otwórz miejsce
        </Link>
      </article>
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
      className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-white shadow-sm"
      style={{
        backgroundColor:
          categoryColor(
            slug,
          ),
      }}
    />
  );
}

function MobileModeButton({
  active,
  onClick,
  children,
}: {
  active:
    boolean;

  onClick:
    () => void;

  children:
    ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      aria-pressed={
        active
      }
      className={[
        "min-h-10 rounded-lg px-3 text-xs font-black transition",
        active
          ? "bg-white text-brand-700 shadow-sm"
          : "text-muted",
      ].join(
        " ",
      )}
    >
      {children}
    </button>
  );
}

function normalizeSearch(
  value: string,
): string {
  return value
    .normalize(
      "NFD",
    )
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLocaleLowerCase(
      "pl",
    )
    .trim();
}

function formatPlaceAddress(
  place:
    MapExplorerPlace,
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