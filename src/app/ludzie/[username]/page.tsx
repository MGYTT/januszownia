import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import {
  ProfileAchievementsShowcase,
} from "@/components/reputation/profile-achievements-showcase";

import {
  Icon,
} from "@/components/ui/icon";

import type {
  PublicAchievement,
} from "@/lib/reputation/achievements";

import {
  getPublicProfileByUsername,
} from "@/lib/reputation/public-profile";

interface PublicProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({
  params,
}: PublicProfilePageProps): Promise<Metadata> {
  const {
    username,
  } =
    await params;

  const profile =
    await getPublicProfileByUsername(
      username,
    );

  if (!profile) {
    return {
      title:
        "Nie znaleziono profilu",
    };
  }

  const achievements =
    normalizeAchievements(
      profile.achievements,
    );

  return {
    title:
      `${profile.displayName} (@${profile.username})`,

    description:
      `${profile.displayName} w Januszowni — ${profile.cebulions} Cebulionów, poziom ${profile.level.name}, ${achievements.length} osiągnięć.`,
  };
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const {
    username,
  } =
    await params;

  const profile =
    await getPublicProfileByUsername(
      username,
    );

  if (!profile) {
    notFound();
  }

  const achievements =
    normalizeAchievements(
      profile.achievements,
    );

  const topAchievements =
    normalizeAchievements(
      profile.featuredAchievements,
    ).slice(
      0,
      5,
    );

  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <Link
            href="/ranking"
            className="text-sm font-bold text-brand-700 hover:underline"
          >
            ← Ranking Cebularzy
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.6rem] bg-brand-600 text-3xl font-black text-white shadow-card sm:h-24 sm:w-24 sm:text-4xl">
                  {profile.displayName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700">
                    <Icon
                      name="users"
                      className="h-4 w-4"
                    />

                    Publiczny profil
                  </div>

                  <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-5xl">
                    {
                      profile.displayName
                    }
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    <span className="font-black text-brand-700">
                      @
                      {
                        profile.username
                      }
                    </span>

                    <span className="text-muted">
                      •
                    </span>

                    <span className="font-bold text-muted">
                      {
                        profile.level.name
                      }
                    </span>
                  </div>
                </div>
              </div>

              <ProfileAchievementsShowcase
                achievements={
                  achievements
                }
                topAchievements={
                  topAchievements
                }
              />
            </div>

            <div className="flex gap-3 lg:flex-col">
              <div className="min-w-36 rounded-[1.5rem] bg-brand-900 px-5 py-4 text-white">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-brand-100">
                  Cebuliony
                </p>

                <p className="mt-1 text-3xl font-black">
                  {
                    profile.cebulions
                  }
                </p>
              </div>

              <div className="min-w-36 rounded-[1.5rem] border border-line bg-canvas px-5 py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-muted">
                  Odznaki
                </p>

                <p className="mt-1 text-3xl font-black">
                  {
                    achievements.length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon="map-pin"
            label="Zatwierdzone miejsca"
            value={
              profile.approvedPlaces
            }
          />

          <StatCard
            icon="shield-check"
            label="Trafne zgłoszenia"
            value={
              profile.validReports
            }
          />

          <StatCard
            icon="check"
            label="Zweryfikowane działania"
            value={
              profile.rewardedActions
            }
          />

          <StatCard
            icon="trophy"
            label="Zdobyte odznaki"
            value={
              achievements.length
            }
          />
        </section>

        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <main>
            <section className="rounded-[2rem] border border-line bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
                Wkład
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Sprawdzony wkład w Januszownię
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
                Statystyki profilu
                obejmują wyłącznie
                działania, które
                przeszły moderację
                i zostały uznane za
                wartościowe dla
                społeczności.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <ContributionCard
                  title="Mapa Cebularza"
                  value={
                    profile.approvedPlaces
                  }
                  description="opublikowanych miejsc pochodzi z zatwierdzonych zgłoszeń tego użytkownika."
                />

                <ContributionCard
                  title="Jakość danych"
                  value={
                    profile.validReports
                  }
                  description="zgłoszeń doprowadziło do faktycznej poprawy danych."
                />
              </div>
            </section>
          </main>

          <aside className="space-y-5">
            <section className="rounded-[2rem] border border-line bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
                Reputacja
              </p>

              <h2 className="mt-2 text-xl font-black">
                {
                  profile.level.name
                }
              </h2>

              {profile.level.nextLevelPoints !==
              null ? (
                <>
                  <div
                    className="mt-5 h-2.5 overflow-hidden rounded-full bg-brand-100"
                    role="progressbar"
                    aria-label="Postęp do następnego poziomu"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={
                      profile.level.progressPercent
                    }
                  >
                    <div
                      className="h-full rounded-full bg-brand-600"
                      style={{
                        width:
                          `${profile.level.progressPercent}%`,
                      }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                    <span className="text-muted">
                      Do następnego
                      poziomu
                    </span>

                    <strong>
                      {
                        profile.level.pointsToNext
                      }{" "}
                      pkt
                    </strong>
                  </div>
                </>
              ) : (
                <p className="mt-4 text-sm font-bold text-accent-700">
                  Najwyższy poziom
                  reputacji.
                </p>
              )}
            </section>

            <section className="rounded-[2rem] border border-line bg-canvas p-6">
              <p className="text-sm font-black">
                Wiarygodne odznaki
              </p>

              <p className="mt-2 text-sm leading-6 text-muted">
                Badge’e wynikają
                ze zweryfikowanego
                wkładu. Użytkownik
                nie może ręcznie
                przyznać sobie
                osiągnięcia.
              </p>
            </section>

            <section className="rounded-[2rem] border border-line bg-white p-6">
              <p className="text-sm font-black">
                Prywatność
              </p>

              <p className="mt-2 text-sm leading-6 text-muted">
                Ten profil został
                świadomie
                udostępniony przez
                właściciela.
              </p>

              <p className="mt-4 border-t border-line pt-4 text-xs text-muted">
                Aktualizacja{" "}
                {formatDate(
                  profile.updatedAt,
                )}
              </p>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}

function ContributionCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-canvas p-5">
      <p className="text-sm font-black">
        {title}
      </p>

      <p className="mt-3 text-3xl font-black text-brand-700">
        {value}
      </p>

      <p className="mt-2 text-sm leading-6 text-muted">
        {description}
      </p>
    </div>
  );
}

function normalizeAchievements(
  value:
    | PublicAchievement[]
    | undefined
    | null,
): PublicAchievement[] {
  return Array.isArray(
    value,
  )
    ? value
    : [];
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon:
    | "map-pin"
    | "shield-check"
    | "check"
    | "trophy";

  label: string;

  value: number;
}) {
  return (
    <div className="rounded-[1.4rem] border border-line bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <Icon
            name={
              icon
            }
            className="h-4 w-4"
          />
        </div>

        <div className="min-w-0">
          <p className="text-2xl font-black">
            {value}
          </p>

          <p className="truncate text-xs text-muted">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
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

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "—";
  }

  return dateFormatter.format(
    date,
  );
}