import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  Suspense,
} from "react";

import {
  notFound,
} from "next/navigation";

import {
  PlaceCollectionsSection,
} from "@/components/collections/place-collections-section";

import {
  PlaceCommunitySection,
} from "@/components/maps/place-community-section";

import {
  PlaceLocationMap,
} from "@/components/maps/place-location-map";

import {
  Icon,
} from "@/components/ui/icon";

import {
  getPublicPlaceDetails,
  getPublicPlaceStats,
} from "@/lib/maps/place-details";

interface PlacePageProps {
  params: Promise<{
    id: string;
  }>;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function generateMetadata({
  params,
}: PlacePageProps): Promise<Metadata> {
  const {
    id,
  } =
    await params;

  if (
    !UUID_PATTERN.test(
      id,
    )
  ) {
    return {
      title:
        "Nie znaleziono miejsca",
    };
  }

  const place =
    await getPublicPlaceDetails(
      id,
    );

  if (!place) {
    return {
      title:
        "Nie znaleziono miejsca",
    };
  }

  return {
    title:
      place.name,

    description:
      place.description ??
      `${place.name} w Januszowni.`,
  };
}

export default async function PlacePage({
  params,
}: PlacePageProps) {
  const {
    id,
  } =
    await params;

  if (
    !UUID_PATTERN.test(
      id,
    )
  ) {
    notFound();
  }

  const [
    place,
    stats,
  ] =
    await Promise.all([
      getPublicPlaceDetails(
        id,
      ),

      getPublicPlaceStats(
        id,
      ),
    ]);

  if (!place) {
    notFound();
  }

  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <Link
            href="/mapy"
            className="text-sm font-bold text-brand-700 hover:underline"
          >
            ← Wróć do mapy
          </Link>

          <div className="mt-7 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-black text-brand-700">
                {
                  place.category_name
                }
              </span>

              {place.verified_at ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-3 py-1.5 text-xs font-black text-muted">
                  <Icon
                    name="shield-check"
                    className="h-3.5 w-3.5"
                  />

                  Zweryfikowane{" "}
                  {formatDate(
                    place.verified_at,
                  )}
                </span>
              ) : null}
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              {
                place.name
              }
            </h1>

            {place.description ? (
              <p className="mt-5 max-w-3xl text-base leading-7 text-muted sm:text-lg">
                {
                  place.description
                }
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {place.address ? (
                <span>
                  {
                    place.address
                  }
                </span>
              ) : null}

              {place.city ? (
                <span>
                  {
                    place.city
                  }
                </span>
              ) : null}

              <span>
                {
                  place.country_code
                }
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main className="space-y-7">
            <section className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm">
              <div className="border-b border-line p-5 sm:p-6">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
                  Lokalizacja
                </p>

                <h2 className="mt-1 text-xl font-black">
                  Gdzie to jest?
                </h2>
              </div>

              <PlaceLocationMap
                latitude={
                  place.latitude
                }
                longitude={
                  place.longitude
                }
                name={
                  place.name
                }
              />

              <div className="grid gap-3 border-t border-line p-5 text-sm sm:grid-cols-2 sm:p-6">
                <div>
                  <p className="text-xs font-bold text-muted">
                    Szerokość
                  </p>

                  <p className="mt-1 font-black">
                    {
                      place.latitude
                    }
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-muted">
                    Długość
                  </p>

                  <p className="mt-1 font-black">
                    {
                      place.longitude
                    }
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-line bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
                Źródła
              </p>

              <h2 className="mt-2 text-xl font-black">
                Skąd mamy te dane?
              </h2>

              {place.sources.length ===
              0 ? (
                <div className="mt-5 rounded-2xl bg-canvas p-5">
                  <p className="font-black">
                    Brak dodatkowego źródła.
                  </p>

                  <p className="mt-1 text-sm leading-6 text-muted">
                    Miejsce zostało
                    opublikowane po
                    moderacji, ale nie
                    ma przypisanego
                    zewnętrznego
                    źródła.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {place.sources.map(
                    (source) => {
                      const safeUrl =
                        safeExternalUrl(
                          source.source_url,
                        );

                      return (
                        <article
                          key={
                            source.id
                          }
                          className="rounded-2xl border border-line p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="font-black">
                                {
                                  source.label
                                }
                              </p>

                              <p className="mt-1 text-xs text-muted">
                                {sourceTypeLabel(
                                  source.source_type,
                                )}
                              </p>
                            </div>

                            {safeUrl ? (
                              <a
                                href={
                                  safeUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm font-black text-brand-700 hover:underline"
                              >
                                Otwórz źródło ↗
                              </a>
                            ) : null}
                          </div>

                          {source.observed_at ? (
                            <p className="mt-3 text-xs text-muted">
                              Dane
                              zaobserwowane{" "}
                              {formatDate(
                                source.observed_at,
                              )}
                            </p>
                          ) : null}
                        </article>
                      );
                    },
                  )}
                </div>
              )}
            </section>

            <Suspense
              fallback={
                <DynamicCardFallback />
              }
            >
              <PlaceCommunitySection
                placeId={
                  place.id
                }
              />
            </Suspense>
          </main>

          <aside className="space-y-6">
            <Suspense
              fallback={
                <DynamicCardFallback />
              }
            >
              <PlaceCollectionsSection
                placeId={
                  place.id
                }
              />
            </Suspense>

            <section className="rounded-[2rem] border border-line bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
                Aktualność
              </p>

              <h2 className="mt-2 text-xl font-black">
                {trustSignalTitle(
                  stats,
                )}
              </h2>

              {stats ? (
                <>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Stat
                      label="Potwierdzenia łącznie"
                      value={
                        stats.confirmed_total
                      }
                    />

                    <Stat
                      label="Nieaktualne łącznie"
                      value={
                        stats.outdated_total
                      }
                    />

                    <Stat
                      label="Potwierdzenia w bieżącym oknie"
                      value={
                        stats.confirmed_current_window
                      }
                    />

                    <Stat
                      label="Problemy w bieżącym oknie"
                      value={
                        stats.outdated_current_window
                      }
                    />
                  </div>

                  {stats.signal_window_start ? (
                    <p className="mt-4 text-xs leading-5 text-muted">
                      Bieżące sygnały
                      liczymy od{" "}
                      <strong className="text-ink">
                        {formatDate(
                          stats.signal_window_start,
                        )}
                      </strong>
                      .
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="mt-3 text-sm leading-6 text-muted">
                  Brak danych
                  społecznościowych.
                </p>
              )}

              {stats?.last_confirmed_at ? (
                <p className="mt-4 text-xs text-muted">
                  Ostatnie
                  potwierdzenie{" "}
                  {formatDate(
                    stats.last_confirmed_at,
                  )}
                </p>
              ) : null}

              {stats?.last_outdated_at ? (
                <p className="mt-2 text-xs text-muted">
                  Ostatni sygnał
                  nieaktualności{" "}
                  {formatDate(
                    stats.last_outdated_at,
                  )}
                </p>
              ) : null}
            </section>

            <section className="rounded-[2rem] border border-line bg-canvas p-6">
              <p className="font-black">
                Widzisz błąd?
              </p>

              <p className="mt-2 text-sm leading-6 text-muted">
                Nie poprawiamy
                danych anonimowo
                i bez śladu.
                Zgłoszenie trafia
                do moderacji,
                a miejsce pozostaje
                publiczne do czasu
                decyzji.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}

function DynamicCardFallback() {
  return (
    <div
      aria-hidden="true"
      className="h-48 animate-pulse rounded-[2rem] border border-line bg-white"
    />
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-canvas p-3">
      <p className="text-xl font-black">
        {value}
      </p>

      <p className="mt-1 text-[11px] leading-4 text-muted">
        {label}
      </p>
    </div>
  );
}

function trustSignalTitle(
  stats:
    | Awaited<
        ReturnType<
          typeof getPublicPlaceStats
        >
      >
    | null,
): string {
  if (!stats) {
    return "Brak danych";
  }

  const currentSignals =
    stats.confirmed_current_window +
    stats.outdated_current_window;

  if (
    currentSignals ===
    0
  ) {
    return "Brak świeżych sygnałów";
  }

  if (
    stats.outdated_current_window >
    stats.confirmed_current_window
  ) {
    return "Wymaga ponownego sprawdzenia";
  }

  if (
    stats.confirmed_current_window >
      0 &&
    stats.outdated_current_window ===
      0
  ) {
    return "Ostatnio potwierdzane";
  }

  if (
    stats.confirmed_current_window >
    stats.outdated_current_window
  ) {
    return "Przewaga potwierdzeń";
  }

  return "Sygnały są mieszane";
}

function sourceTypeLabel(
  value: string,
): string {
  switch (value) {
    case "official":
      return "Źródło oficjalne";

    case "public_data":
      return "Dane publiczne";

    case "business":
      return "Źródło firmy";

    case "partner":
      return "Partner";

    case "user":
      return "Źródło użytkownika";

    default:
      return "Źródło";
  }
}

function safeExternalUrl(
  value:
    | string
    | null,
): string | null {
  if (!value) {
    return null;
  }

  try {
    const url =
      new URL(
        value,
      );

    if (
      url.protocol !==
        "http:" &&
      url.protocol !==
        "https:"
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
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