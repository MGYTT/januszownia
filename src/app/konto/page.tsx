import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  signOut,
  updateProfile,
} from "@/app/auth/actions";

import {
  Icon,
  type IconName,
} from "@/components/ui/icon";

import {
  getAccountDashboardSummary,
} from "@/lib/account/dashboard";

import {
  requireAuthenticatedUser,
} from "@/lib/auth/server-session";

import {
  getUserReputation,
} from "@/lib/reputation/data";

import {
  DEFAULT_REPUTATION_LEVELS,
} from "@/lib/reputation/levels";

import type {
  ReputationEventType,
} from "@/lib/reputation/types";

export const instant =
  false;

export const metadata: Metadata = {
  title:
    "Moje konto",

  description:
    "Teczka Cebularza: profil, Cebuliony, osiągnięcia, kolekcje, powiadomienia i ustawienia widoczności konta Januszowni.",
};

interface AccountPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

interface Profile {
  username:
    string | null;

  display_name:
    string | null;

  role:
    | "user"
    | "moderator"
    | "admin";

  created_at:
    string;
}

export default async function AccountPage({
  searchParams,
}: AccountPageProps) {
  const {
    supabase,
    userId,
  } =
    await requireAuthenticatedUser();

  const [
    userResult,
    profileResult,
    reputation,
    dashboard,
    params,
  ] =
    await Promise.all([
      supabase.auth.getUser(),

      supabase
        .from(
          "profiles",
        )
        .select(
          `
            username,
            display_name,
            role,
            created_at
          `,
        )
        .eq(
          "id",
          userId,
        )
        .single(),

      getUserReputation(
        supabase,
        userId,
      ),

      getAccountDashboardSummary(
        supabase,
        userId,
      ),

      searchParams,
    ]);

  if (
    userResult.error ||
    !userResult.data.user
  ) {
    throw new Error(
      "Nie udało się pobrać danych konta.",
    );
  }

  if (
    profileResult.error ||
    !profileResult.data
  ) {
    throw new Error(
      "Nie udało się pobrać profilu użytkownika.",
    );
  }

  const profile =
    profileResult.data as Profile;

  const user =
    userResult.data.user;

  const isStaff =
    profile.role ===
      "moderator" ||
    profile.role ===
      "admin";

  const displayName =
    profile.display_name
      ?.trim() ||
    profile.username
      ?.trim() ||
    "Janusz";

  const profileReady =
    Boolean(
      profile.display_name
        ?.trim() &&
      profile.username
        ?.trim(),
    );

  const recentReputation =
    reputation.recentEntries.slice(
      0,
      4,
    );

  const levelCount =
    DEFAULT_REPUTATION_LEVELS.length;

  const activityCount =
    dashboard.placeSubmissionsCount +
    dashboard.placeReportsCount;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      {params.message ? (
        <div
          role="status"
          className="mb-5 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm font-bold text-brand-800"
        >
          {params.message}
        </div>
      ) : null}

      {params.error ? (
        <div
          role="alert"
          className="mb-5 rounded-2xl border border-danger-600/20 bg-danger-50 p-4 text-sm font-bold text-danger-600"
        >
          {params.error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <section className="overflow-hidden rounded-[2rem] bg-brand-900 text-white shadow-card">
            <div className="relative p-6">
              <div
                aria-hidden="true"
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-700/60"
              />

              <div
                aria-hidden="true"
                className="absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-accent-500/15"
              />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-2xl font-black">
                    {displayName
                      .charAt(
                        0,
                      )
                      .toUpperCase()}
                  </div>

                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-brand-100">
                    Konto aktywne
                  </span>
                </div>

                <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-brand-200">
                  Teczka Cebularza
                </p>

                <h1 className="mt-1 truncate text-2xl font-black tracking-[-0.03em]">
                  {displayName}
                </h1>

                {profile.username ? (
                  <p className="mt-1 text-sm font-bold text-brand-200">
                    @{profile.username}
                  </p>
                ) : (
                  <p className="mt-1 text-sm font-semibold text-accent-100">
                    Nick jeszcze leży w urzędzie.
                  </p>
                )}

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <SidebarStat
                    label="Cebuliony"
                    value={String(
                      reputation.cebulions,
                    )}
                  />

                  <SidebarStat
                    label="Poziom"
                    value={
                      reputation.level.order +
                      "/" +
                      levelCount
                    }
                  />
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold text-brand-100">
                      Następny szczebel
                    </p>

                    <span className="text-xs font-black text-white">
                      {reputation.level
                        .nextLevelPoints !==
                      null
                        ? reputation.level
                            .pointsToNext +
                          " pkt"
                        : "MAX"}
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-black">
                    {reputation.level
                      .nextLevelName ??
                      "Mit Januszowni"}
                  </p>

                  <div
                    className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"
                    role="progressbar"
                    aria-label="Postęp do następnego poziomu"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={
                      reputation.level
                        .progressPercent
                    }
                  >
                    <div
                      className="h-full rounded-full bg-accent-400"
                      style={{
                        width:
                          `${reputation.level.progressPercent}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 bg-black/10 p-3">
              <p className="px-3 pb-2 pt-1 text-[10px] font-black uppercase tracking-[0.14em] text-brand-200">
                Szuflady
              </p>

              <nav
                aria-label="Nawigacja konta"
                className="space-y-1"
              >
                <AccountNavLink
                  href="/konto/kolekcje"
                  icon="grid"
                  label="Kolekcje"
                  detail={
                    String(
                      dashboard.collectionsCount,
                    )
                  }
                />

                <AccountNavLink
                  href="/konto/obliczenia"
                  icon="calculator"
                  label="Obliczenia"
                  detail={
                    String(
                      dashboard.savedCalculationsCount,
                    )
                  }
                />

                <AccountNavLink
                  href="/konto/aktywnosc"
                  icon="route"
                  label="Kronika"
                  detail={
                    String(
                      activityCount,
                    )
                  }
                />

                <AccountNavLink
                  href="/konto/osiagniecia"
                  icon="trophy"
                  label="Osiągnięcia"
                  detail={
                    dashboard.unlockedAchievementsCount +
                    "/" +
                    dashboard.totalAchievementsCount
                  }
                />

                <AccountNavLink
                  href="/powiadomienia"
                  icon="sparkles"
                  label="Powiadomienia"
                  detail={
                    dashboard.unreadNotificationsCount >
                    0
                      ? String(
                          dashboard.unreadNotificationsCount,
                        )
                      : "0"
                  }
                />

                <AccountNavLink
                  href="/konto/poziomy"
                  icon="route"
                  label="Poziomy"
                  detail={
                    String(
                      reputation.level.order,
                    )
                  }
                />

                <AccountNavLink
                  href="/konto/publiczny-profil"
                  icon="users"
                  label="Publiczny profil"
                  detail={
                    dashboard.showPublicProfile
                      ? "ON"
                      : "OFF"
                  }
                />

                <AccountNavLink
                  href="/ranking"
                  icon="trophy"
                  label="Ranking"
                  detail={
                    dashboard.showInLeaderboard
                      ? "ON"
                      : "OFF"
                  }
                />

                {isStaff ? (
                  <AccountNavLink
                    href="/moderacja"
                    icon="shield-check"
                    label="Moderacja"
                    detail="STAFF"
                  />
                ) : null}
              </nav>

              <div className="mt-3 border-t border-white/10 pt-3">
                <form
                  action={signOut}
                >
                  <button
                    type="submit"
                    className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-left text-sm font-black text-brand-100 transition hover:bg-white/10 hover:text-white"
                  >
                    <span>
                      Wyloguj się
                    </span>

                    <span
                      aria-hidden="true"
                      className="text-base"
                    >
                      →
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </section>
        </aside>

        <main className="min-w-0 space-y-8">
          <section className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-700">
                    Panel konta
                  </p>

                  <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                    Dzień dobry,{" "}
                    {displayName}.
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
                    Tu sprawdzasz, co już
                    masz, co zrobiłeś i jak
                    wygląda Twoje konto.
                    Skróty do konkretnych
                    funkcji są w Teczce po
                    lewej — tutaj zostają
                    tylko najważniejsze
                    informacje.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <AccountBadge
                    text={
                      roleName(
                        profile.role,
                      )
                    }
                  />

                  <AccountBadge
                    text={
                      "Konto od " +
                      formatDate(
                        profile.created_at,
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px border-t border-line bg-line lg:grid-cols-4">
              <OverviewMetric
                label="Zapisane miejsca"
                value={
                  dashboard.savedPlaceEntriesCount
                }
                detail={
                  dashboard.collectionsCount +
                  " kolekcji"
                }
              />

              <OverviewMetric
                label="Zapisane obliczenia"
                value={
                  dashboard.savedCalculationsCount
                }
                detail="prywatnych zapisów"
              />

              <OverviewMetric
                label="Aktywność"
                value={
                  activityCount
                }
                detail="wpisów w Kronice"
              />

              <OverviewMetric
                label="Powiadomienia"
                value={
                  dashboard.unreadNotificationsCount
                }
                detail={
                  dashboard.unreadNotificationsCount >
                  0
                    ? "czeka na przeczytanie"
                    : "wszystko przeczytane"
                }
              />
            </div>
          </section>

          {!profileReady ? (
            <section className="rounded-[1.5rem] border border-accent-200 bg-accent-50 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-accent-700 shadow-sm">
                  <Icon
                    name="users"
                    className="h-5 w-5"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-accent-700">
                    Do załatwienia
                  </p>

                  <h2 className="mt-1 font-black text-ink">
                    Profil nie ma jeszcze wszystkich pieczątek.
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-muted">
                    Uzupełnij nazwę i nick.
                    Nick będzie potrzebny,
                    jeśli zechcesz włączyć
                    publiczny profil.
                  </p>
                </div>

                <a
                  href="#dane-profilu"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-button bg-white px-4 py-2.5 text-sm font-black text-brand-700 shadow-sm transition hover:bg-brand-50"
                >
                  Uzupełnij profil
                </a>
              </div>
            </section>
          ) : null}

          <section>
            <SectionHeading
              number="01"
              kicker="Reputacja i wkład"
              title="Co wypracowałeś w Januszowni"
              description="Jeden blok zamiast kilku osobnych kart. Tu masz poziom, postęp, wkład społecznościowy i ostatnie nagrody."
            />

            <article className="mt-5 overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm">
              <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-brand-700">
                    Aktualny poziom
                  </p>

                  <h3 className="mt-2 text-2xl font-black tracking-[-0.03em]">
                    {
                      reputation.level
                        .name
                    }
                  </h3>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                    {
                      reputation.level
                        .description
                    }
                  </p>

                  {reputation.level
                    .nextLevelPoints !==
                  null ? (
                    <div className="mt-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-black">
                          Następny szczebel:{" "}
                          {
                            reputation.level
                              .nextLevelName
                          }
                        </p>

                        <p className="text-xs font-bold text-muted">
                          {
                            reputation.level
                              .pointsToNext
                          }{" "}
                          Cebulionów brakuje
                        </p>
                      </div>

                      <div
                        className="mt-3 h-3 overflow-hidden rounded-full bg-brand-100"
                        role="progressbar"
                        aria-label="Postęp do następnego poziomu"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={
                          reputation.level
                            .progressPercent
                        }
                      >
                        <div
                          className="h-full rounded-full bg-brand-600"
                          style={{
                            width:
                              `${reputation.level.progressPercent}%`,
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 rounded-2xl bg-accent-50 p-4 text-sm font-black text-accent-700">
                      Masz najwyższy poziom.
                      Dalej jest już tylko
                      opowiadanie o tym przy
                      grillu.
                    </div>
                  )}
                </div>

                <div className="rounded-[1.5rem] bg-brand-900 p-5 text-white">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-brand-200">
                    Portfel Cebulionów
                  </p>

                  <p className="mt-2 text-4xl font-black tracking-[-0.05em]">
                    {
                      reputation.cebulions
                    }
                  </p>

                  <p className="mt-1 text-xs font-bold text-brand-100">
                    {
                      reputation.rewardedActions
                    }{" "}
                    nagrodzonych działań
                  </p>
                </div>
              </div>

              <div className="border-t border-line bg-canvas p-6 sm:p-8">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-muted">
                  Twój wkład
                </p>

                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <ContributionMetric
                    value={
                      dashboard.placeSubmissionsCount
                    }
                    label="zgłoszone miejsca"
                  />

                  <ContributionMetric
                    value={
                      dashboard.placeReportsCount
                    }
                    label="raporty problemów"
                  />

                  <ContributionMetric
                    value={
                      reputation.rewardedActions
                    }
                    label="nagrodzone działania"
                    wide
                  />
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/konto/aktywnosc"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button bg-brand-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-brand-700"
                  >
                    Otwórz Kronikę

                    <Icon
                      name="route"
                      className="h-4 w-4"
                    />
                  </Link>

                  <Link
                    href="/mapy/dodaj"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button border border-line bg-white px-5 py-2.5 text-sm font-black transition hover:bg-brand-50"
                  >
                    Dodaj miejsce

                    <Icon
                      name="map-pin"
                      className="h-4 w-4 text-brand-700"
                    />
                  </Link>

                  <Link
                    href="/konto/poziomy"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button border border-line bg-white px-5 py-2.5 text-sm font-black transition hover:bg-brand-50"
                  >
                    Zobacz poziomy
                  </Link>
                </div>
              </div>

              <div className="border-t border-line p-6 sm:p-8">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-brand-700">
                      Ostatnie nagrody
                    </p>

                    <h3 className="mt-1 text-lg font-black">
                      Co ostatnio wpadło do portfela
                    </h3>
                  </div>

                  <Link
                    href="/konto/aktywnosc?filter=cebulions"
                    className="text-xs font-black text-brand-700 hover:underline"
                  >
                    Pełna historia →
                  </Link>
                </div>

                {recentReputation.length ===
                0 ? (
                  <div className="mt-4 rounded-2xl border border-dashed border-line bg-canvas p-5">
                    <p className="font-black">
                      Portfel jeszcze czeka
                      na pierwszy konkretny
                      zarobek.
                    </p>

                    <p className="mt-1 text-sm leading-6 text-muted">
                      Cebuliony pojawią się
                      po zaakceptowaniu
                      wartościowego miejsca
                      albo trafnego raportu.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 divide-y divide-line rounded-2xl border border-line">
                    {recentReputation.map(
                      (
                        entry,
                      ) => (
                        <div
                          key={
                            entry.id
                          }
                          className="flex items-center justify-between gap-4 px-4 py-3.5"
                        >
                          <div>
                            <p className="text-sm font-black">
                              {eventLabel(
                                entry.event_type,
                              )}
                            </p>

                            <p className="mt-1 text-xs text-muted">
                              {formatDateTime(
                                entry.created_at,
                              )}
                            </p>
                          </div>

                          <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-black text-brand-700">
                            +
                            {
                              entry.points
                            }
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </article>
          </section>

          {isStaff ? (
            <section className="rounded-[1.5rem] border border-brand-200 bg-brand-50 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm">
                  <Icon
                    name="shield-check"
                    className="h-5 w-5"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-brand-700">
                    Tylko dla ekipy
                  </p>

                  <h2 className="mt-1 font-black">
                    Biurko moderatora czeka.
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-muted">
                    Zgłoszenia miejsc i
                    raporty społeczności są
                    w osobnym panelu
                    moderacyjnym.
                  </p>
                </div>

                <Link
                  href="/moderacja"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-button bg-brand-900 px-5 py-2.5 text-sm font-black text-white transition hover:bg-brand-800"
                >
                  Otwórz moderację

                  <Icon
                    name="arrow-right"
                    className="h-4 w-4"
                  />
                </Link>
              </div>
            </section>
          ) : null}

          <section
            id="prywatnosc"
            className="scroll-mt-24"
          >
            <SectionHeading
              number="02"
              kicker="Prywatność"
              title="Co pokazujesz innym"
              description="Dwa ustawienia, dwa osobne znaczenia. Bez drobnego druku i bez szukania, co właściwie jest publiczne."
            />

            <div className="mt-5 overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm">
              <SettingRow
                href="/konto/publiczny-profil"
                icon="users"
                title="Publiczny profil"
                status={
                  !profile.username
                    ? "Najpierw ustaw nick"
                    : dashboard.showPublicProfile
                      ? "Widoczny"
                      : "Prywatny"
                }
                enabled={
                  Boolean(
                    profile.username,
                  ) &&
                  dashboard.showPublicProfile
                }
                description="Decyduje, czy inni mogą otworzyć Twój profil, zobaczyć poziom, Cebuliony i publiczne statystyki."
              />

              <div className="border-t border-line" />

              <SettingRow
                href="/ranking"
                icon="trophy"
                title="Ranking Cebularzy"
                status={
                  dashboard.showInLeaderboard
                    ? "Pokazujesz się"
                    : "Nie pokazujesz się"
                }
                enabled={
                  dashboard.showInLeaderboard
                }
                description="To osobne ustawienie. Możesz korzystać z reputacji i konta bez udziału w publicznym rankingu."
              />
            </div>
          </section>

          <section
            id="dane-profilu"
            className="scroll-mt-24"
          >
            <SectionHeading
              number="03"
              kicker="Dane profilu"
              title="Papierologia osobowa"
              description="Tu zmieniasz tylko dane, którymi podpisujesz się w Januszowni. Cebuliony, osiągnięcia i zapisane miejsca zostają nietknięte."
            />

            <div className="mt-5 overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm">
              <div className="grid border-b border-line bg-canvas sm:grid-cols-2">
                <AccountInfo
                  label="E-mail konta"
                  value={
                    user.email ??
                    "Brak e-maila"
                  }
                />

                <AccountInfo
                  label="Status konta"
                  value={
                    roleName(
                      profile.role,
                    ) +
                    " · od " +
                    formatDate(
                      profile.created_at,
                    )
                  }
                  bordered
                />
              </div>

              <form
                action={updateProfile}
                className="p-6 sm:p-8"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="displayName"
                      className="mb-2 block text-sm font-black"
                    >
                      Nazwa wyświetlana
                    </label>

                    <input
                      id="displayName"
                      name="displayName"
                      type="text"
                      minLength={2}
                      maxLength={60}
                      required
                      defaultValue={
                        profile.display_name ??
                        ""
                      }
                      autoComplete="name"
                      className="h-12 w-full rounded-xl border border-line bg-canvas px-4 text-base font-semibold outline-none transition placeholder:text-subtle focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
                    />

                    <p className="mt-2 text-xs leading-5 text-muted">
                      Imię, pseudonim albo
                      normalna nazwa, którą
                      pokazujemy w serwisie.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="username"
                      className="mb-2 block text-sm font-black"
                    >
                      Nick
                    </label>

                    <input
                      id="username"
                      name="username"
                      type="text"
                      minLength={3}
                      maxLength={24}
                      pattern="[a-zA-Z0-9_]{3,24}"
                      defaultValue={
                        profile.username ??
                        ""
                      }
                      placeholder="np. Mirek_Cebula"
                      autoComplete="username"
                      className="h-12 w-full rounded-xl border border-line bg-canvas px-4 text-base font-semibold outline-none transition placeholder:font-normal placeholder:text-subtle focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
                    />

                    <p className="mt-2 text-xs leading-5 text-muted">
                      3–24 znaki. Litery,
                      cyfry i _. Nick jest
                      częścią adresu
                      publicznego profilu.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xl text-xs leading-5 text-muted">
                    Bez niespodzianek:
                    zmiana tych pól nie
                    zeruje punktów, poziomu,
                    osiągnięć ani kolekcji.
                  </p>

                  <button
                    type="submit"
                    className="min-h-12 shrink-0 rounded-button bg-brand-600 px-5 py-3 font-black text-white transition hover:bg-brand-700"
                  >
                    Zapisz dane profilu
                  </button>
                </div>
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function SidebarStat({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-brand-200">
        {label}
      </p>

      <p className="mt-1 text-xl font-black">
        {value}
      </p>
    </div>
  );
}

function AccountNavLink({
  href,
  icon,
  label,
  detail,
}: {
  href:
    string;

  icon:
    IconName;

  label:
    string;

  detail:
    string;
}) {
  return (
    <Link
      href={
        href
      }
      className="group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold text-brand-100 transition hover:bg-white/10 hover:text-white"
    >
      <Icon
        name={
          icon
        }
        className="h-4 w-4 shrink-0"
      />

      <span className="min-w-0 flex-1 truncate">
        {label}
      </span>

      <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-black text-brand-100">
        {detail}
      </span>
    </Link>
  );
}

function AccountBadge({
  text,
}: {
  text:
    string;
}) {
  return (
    <span className="rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-black text-muted">
      {text}
    </span>
  );
}

function OverviewMetric({
  label,
  value,
  detail,
}: {
  label:
    string;

  value:
    number;

  detail:
    string;
}) {
  return (
    <div className="bg-canvas p-4 sm:p-5">
      <p className="text-xs font-bold text-muted">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black tracking-[-0.03em] text-ink">
        {value}
      </p>

      <p className="mt-1 text-[11px] font-semibold text-subtle">
        {detail}
      </p>
    </div>
  );
}

function SectionHeading({
  number,
  kicker,
  title,
  description,
}: {
  number:
    string;

  kicker:
    string;

  title:
    string;

  description:
    string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-[44px_minmax(0,1fr)] sm:items-start">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-900 text-xs font-black text-white">
        {number}
      </div>

      <div className="max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
          {kicker}
        </p>

        <h2 className="mt-1 text-2xl font-black tracking-[-0.03em] sm:text-3xl">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}

function ContributionMetric({
  value,
  label,
  wide = false,
}: {
  value:
    number;

  label:
    string;

  wide?:
    boolean;
}) {
  return (
    <div
      className={
        wide
          ? "col-span-2 rounded-2xl border border-line bg-white p-4 sm:col-span-1"
          : "rounded-2xl border border-line bg-white p-4"
      }
    >
      <p className="text-2xl font-black text-brand-800">
        {value}
      </p>

      <p className="mt-1 text-xs font-semibold leading-5 text-muted">
        {label}
      </p>
    </div>
  );
}

function SettingRow({
  href,
  icon,
  title,
  status,
  enabled,
  description,
}: {
  href:
    string;

  icon:
    IconName;

  title:
    string;

  status:
    string;

  enabled:
    boolean;

  description:
    string;
}) {
  return (
    <Link
      href={
        href
      }
      className="group grid gap-4 p-5 transition hover:bg-brand-50/40 sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:items-center sm:p-6"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <Icon
          name={
            icon
          }
          className="h-5 w-5"
        />
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-black">
            {title}
          </h3>

          <span
            className={
              enabled
                ? "rounded-full bg-brand-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-brand-800"
                : "rounded-full bg-canvas px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-muted"
            }
          >
            {status}
          </span>
        </div>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
          {description}
        </p>
      </div>

      <span className="inline-flex items-center gap-2 text-sm font-black text-brand-700">
        Zarządzaj

        <Icon
          name="arrow-right"
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}

function AccountInfo({
  label,
  value,
  bordered = false,
}: {
  label:
    string;

  value:
    string;

  bordered?:
    boolean;
}) {
  return (
    <div
      className={
        bordered
          ? "border-t border-line p-5 sm:border-l sm:border-t-0 sm:p-6"
          : "p-5 sm:p-6"
      }
    >
      <p className="text-xs font-bold text-muted">
        {label}
      </p>

      <p className="mt-1 break-all text-sm font-black text-ink">
        {value}
      </p>
    </div>
  );
}

function roleName(
  role:
    Profile["role"],
): string {
  switch (role) {
    case "admin":
      return "Administrator";

    case "moderator":
      return "Moderator";

    default:
      return "Cebularz";
  }
}

function eventLabel(
  eventType:
    ReputationEventType,
): string {
  switch (eventType) {
    case "place_approved":
      return "Miejsce zatwierdzone";

    case "valid_report":
      return "Raport okazał się trafny";
  }
}

const dateFormatter =
  new Intl.DateTimeFormat(
    "pl-PL",
    {
      month:
        "short",

      year:
        "numeric",
    },
  );

const dateTimeFormatter =
  new Intl.DateTimeFormat(
    "pl-PL",
    {
      dateStyle:
        "medium",

      timeStyle:
        "short",
    },
  );

function formatDate(
  value:
    string,
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

function formatDateTime(
  value:
    string,
): string {
  const date =
    new Date(
      value,
    );

  return Number.isNaN(
    date.getTime(),
  )
    ? "Brak daty"
    : dateTimeFormatter.format(
        date,
      );
}