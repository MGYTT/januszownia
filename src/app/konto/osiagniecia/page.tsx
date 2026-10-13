import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  AchievementBadge,
} from "@/components/reputation/achievement-badge";

import {
  AchievementFeatureButton,
} from "@/components/reputation/achievement-feature-button";

import {
  Icon,
} from "@/components/ui/icon";

import {
  requireAuthenticatedUser,
} from "@/lib/auth/server-session";

import {
  getOwnAchievementDashboard,
} from "@/lib/reputation/achievement-data";

import {
  achievementCategoryLabel,
  type AchievementCategory,
} from "@/lib/reputation/achievements";

export const instant =
  false;

export const metadata: Metadata = {
  title:
    "Osiągnięcia",

  description:
    "Osiągnięcia, odznaki i postęp w Januszowni.",
};

const CATEGORIES:
  AchievementCategory[] = [
    "places",
    "reports",
    "reputation",
    "community",
    "versatile",
  ];

export default async function AchievementsPage() {
  const {
    supabase,
    userId,
  } =
    await requireAuthenticatedUser();

  const dashboard =
    await getOwnAchievementDashboard(
      supabase,
      userId,
    );

  const completion =
    dashboard.totalCount >
    0
      ? Math.round(
          (
            dashboard.unlockedCount /
            dashboard.totalCount
          ) *
            100,
        )
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Link
        href="/konto"
        className="text-sm font-bold text-brand-700 hover:underline"
      >
        ← Wróć do konta
      </Link>

      <header className="mt-7">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-3 py-1.5 text-sm font-bold text-accent-700">
          <Icon
            name="trophy"
            className="h-4 w-4"
          />

          Kolekcja odznak
        </div>

        <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
          Osiągnięcia
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
          Tutaj widzisz całą
          kolekcję, również
          osiągnięcia jeszcze
          nieodblokowane oraz
          rzeczywisty postęp do
          kolejnych progów.
        </p>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStat
          label="Zdobyte"
          value={`${dashboard.unlockedCount}/${dashboard.totalCount}`}
        />

        <DashboardStat
          label="Ukończenie"
          value={`${completion}%`}
        />

        <DashboardStat
          label="Wyróżnione"
          value={`${dashboard.featuredCount}/5`}
        />

        <DashboardStat
          label="Do zdobycia"
          value={String(
            dashboard.totalCount -
              dashboard.unlockedCount,
          )}
        />
      </section>

      <section className="mt-6 rounded-[2rem] border border-line bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
              Cała kolekcja
            </p>

            <h2 className="mt-2 text-xl font-black">
              Postęp
            </h2>
          </div>

          <strong className="text-2xl">
            {completion}%
          </strong>
        </div>

        <div className="mt-4 h-4 overflow-hidden rounded-full bg-canvas">
          <div
            className="h-full rounded-full bg-brand-600"
            style={{
              width:
                `${completion}%`,
            }}
          />
        </div>
      </section>

      <section className="mt-6 rounded-[2rem] border border-brand-200 bg-brand-50 p-5 sm:p-6">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700">
            <Icon
              name="trophy"
              className="h-5 w-5"
            />
          </div>

          <div>
            <h2 className="font-black text-brand-900">
              Publiczny profil pokazuje tylko Top 5
            </h2>

            <p className="mt-1 text-sm leading-6 text-brand-800">
              Możesz sam wyróżnić
              maksymalnie pięć
              odznak. Jeśli wybierzesz
              mniej, profil
              automatycznie uzupełni
              wolne miejsca
              najrzadszymi zdobytymi
              badge’ami.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-10 space-y-12">
        {CATEGORIES.map(
          (category) => {
            const achievements =
              dashboard.achievements.filter(
                (achievement) =>
                  achievement.category ===
                  category,
              );

            const unlocked =
              achievements.filter(
                (achievement) =>
                  achievement.earnedAt !==
                  null,
              ).length;

            return (
              <section
                key={
                  category
                }
              >
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
                      Kategoria
                    </p>

                    <h2 className="mt-1 text-2xl font-black">
                      {achievementCategoryLabel(
                        category,
                      )}
                    </h2>
                  </div>

                  <span className="rounded-full bg-canvas px-3 py-1.5 text-xs font-black">
                    {unlocked}/
                    {
                      achievements.length
                    }
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {achievements.map(
                    (
                      achievement,
                    ) => {
                      const earned =
                        achievement.earnedAt !==
                        null;

                      return (
                        <div
                          key={
                            achievement.code
                          }
                        >
                          <AchievementBadge
                            name={
                              achievement.name
                            }
                            description={
                              achievement.description
                            }
                            category={
                              achievement.category
                            }
                            rarity={
                              achievement.rarity
                            }
                            iconKey={
                              achievement.iconKey
                            }
                            earned={
                              earned
                            }
                            progressPercent={
                              achievement.progressPercent
                            }
                            currentValue={
                              achievement.currentValue
                            }
                            threshold={
                              achievement.threshold
                            }
                            earnedAt={
                              achievement.earnedAt
                            }
                            featured={
                              achievement.featuredOrder !==
                              null
                            }
                          />

                          {earned ? (
                            <AchievementFeatureButton
                              achievementCode={
                                achievement.code
                              }
                              initialFeatured={
                                achievement.featuredOrder !==
                                null
                              }
                              initialSlot={
                                achievement.featuredOrder
                              }
                            />
                          ) : null}
                        </div>
                      );
                    },
                  )}
                </div>
              </section>
            );
          },
        )}
      </div>

      <section className="mt-12 rounded-[2rem] border border-line bg-canvas p-6 sm:p-8">
        <h2 className="text-xl font-black">
          Publiczna gablotka
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Na publicznym profilu
          pokazujemy maksymalnie
          pięć najlepszych odznak.
          Kliknięcie `•••` na
          profilu otwiera pełną
          kolekcję wszystkich
          zdobytych badge’y.
        </p>

        <Link
          href="/konto/publiczny-profil"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-button border border-line bg-white px-5 py-2.5 text-sm font-black transition hover:bg-brand-50"
        >
          Ustawienia publicznego profilu
        </Link>
      </section>
    </div>
  );
}

function DashboardStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-line bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black">
        {value}
      </p>
    </div>
  );
}