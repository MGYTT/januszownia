import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  Suspense,
} from "react";

import {
  LeaderboardViewerPanel,
} from "@/components/reputation/leaderboard-viewer-panel";

import {
  Icon,
} from "@/components/ui/icon";

import {
  getPublicLeaderboard,
} from "@/lib/reputation/leaderboard";

export const metadata: Metadata = {
  title:
    "Ranking Cebularzy",

  description:
    "Ranking użytkowników Januszowni zdobywających Cebuliony za zweryfikowane działania.",
};

interface RankingPageProps {
  searchParams: Promise<{
    message?: string;
    error?: string;
  }>;
}

export default async function RankingPage({
  searchParams,
}: RankingPageProps) {
  const leaderboard =
    await getPublicLeaderboard();

  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-3 py-1.5 text-sm font-bold text-accent-700">
              <Icon
                name="trophy"
                className="h-4 w-4"
              />

              Cebuliony
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Ranking Cebularzy
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Punkty nie lecą za
              klikanie. Ranking
              pokazuje ludzi,
              których zweryfikowane
              działania rzeczywiście
              pomogły społeczności.
            </p>

            <div className="mt-5 rounded-2xl bg-canvas p-4 text-sm leading-6 text-muted">
              Ranking oraz publiczny
              profil są dwoma
              niezależnymi ustawieniami
              prywatności.
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main>
            <Suspense>
              <RankingMessages
                searchParams={
                  searchParams
                }
              />
            </Suspense>

            <section className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-line p-5 sm:p-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
                    Top 100
                  </p>

                  <h2 className="mt-1 text-xl font-black">
                    Największe cebule
                  </h2>
                </div>

                <span className="rounded-full bg-canvas px-3 py-1.5 text-xs font-black text-muted">
                  {
                    leaderboard.length
                  }
                </span>
              </div>

              {leaderboard.length ===
              0 ? (
                <div className="p-8 text-center sm:p-12">
                  <Icon
                    name="trophy"
                    className="mx-auto h-9 w-9 text-brand-700"
                  />

                  <h3 className="mt-4 text-xl font-black">
                    Ranking jest
                    jeszcze pusty.
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
                    Nikogo nie
                    publikujemy
                    automatycznie.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-line">
                  {leaderboard.map(
                    (
                      entry,
                      index,
                    ) => (
                      <article
                        key={`${entry.position}-${entry.username ?? entry.displayName}-${index}`}
                        className="grid grid-cols-[54px_minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 sm:grid-cols-[70px_minmax(0,1fr)_170px] sm:px-6"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-canvas text-sm font-black sm:h-11 sm:w-11">
                          {positionLabel(
                            entry.position,
                          )}
                        </div>

                        <div className="min-w-0">
                          {entry.publicProfileEnabled &&
                          entry.username ? (
                            <Link
                              href={`/ludzie/${entry.username}`}
                              className="truncate font-black hover:text-brand-700 hover:underline"
                            >
                              {
                                entry.displayName
                              }
                            </Link>
                          ) : (
                            <p className="truncate font-black">
                              {
                                entry.displayName
                              }
                            </p>
                          )}

                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                            {entry.username ? (
                              <span>
                                @
                                {
                                  entry.username
                                }
                              </span>
                            ) : null}

                            <span>
                              {
                                entry.level.name
                              }
                            </span>

                            {entry.publicProfileEnabled &&
                            entry.username ? (
                              <span className="font-bold text-brand-700">
                                profil publiczny
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-black text-brand-700">
                            {
                              entry.cebulions
                            }
                          </p>

                          <p className="text-xs font-bold text-muted">
                            Cebulionów
                          </p>
                        </div>
                      </article>
                    ),
                  )}
                </div>
              )}
            </section>

            <section className="mt-6 rounded-[2rem] border border-line bg-canvas p-6">
              <p className="font-black">
                Jak liczymy ranking?
              </p>

              <p className="mt-2 text-sm leading-6 text-muted">
                Pozycja zależy od
                liczby Cebulionów.
                Użytkownicy z takim
                samym wynikiem mają
                tę samą pozycję.
                Publiczna tabela
                pokazuje maksymalnie
                100 kont.
              </p>
            </section>
          </main>

          <aside>
            <Suspense
              fallback={
                <ViewerFallback />
              }
            >
              <LeaderboardViewerPanel />
            </Suspense>
          </aside>
        </div>
      </div>
    </>
  );
}

async function RankingMessages({
  searchParams,
}: {
  searchParams:
    RankingPageProps["searchParams"];
}) {
  const params =
    await searchParams;

  if (
    !params.message &&
    !params.error
  ) {
    return null;
  }

  return (
    <div className="mb-6">
      {params.message ? (
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm font-bold text-brand-800">
          {
            params.message
          }
        </div>
      ) : null}

      {params.error ? (
        <div
          role="alert"
          className="rounded-2xl border border-danger-600/20 bg-danger-50 p-4 text-sm font-bold text-danger-600"
        >
          {
            params.error
          }
        </div>
      ) : null}
    </div>
  );
}

function ViewerFallback() {
  return (
    <div
      aria-hidden="true"
      className="h-64 animate-pulse rounded-[2rem] border border-line bg-white"
    />
  );
}

function positionLabel(
  position: number,
): string {
  switch (position) {
    case 1:
      return "🥇";

    case 2:
      return "🥈";

    case 3:
      return "🥉";

    default:
      return `#${position}`;
  }
}