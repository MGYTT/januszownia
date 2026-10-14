import type {
  Metadata,
} from "next";

import Link from "next/link";

import type {
  ReactNode,
} from "react";

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
    profile.display_name ??
    profile.username ??
    "Janusz";

  const profileReady =
    Boolean(
      profile.display_name &&
      profile.username,
    );

  const recentReputation =
    reputation.recentEntries.slice(
      0,
      4,
    );

  const levelCount =
    DEFAULT_REPUTATION_LEVELS.length;

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
                      Zamknij interes
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

        <main className="min-w-0">
          <section className="rounded-[2rem] border border-line bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-700">
                  Pulpit gospodarza
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                  Tu trzymasz cały
                  cebulowy majątek.
                </h2>

                <p className="mt-4 text-sm leading-6 text-muted sm:text-base">
                  Kolekcje, odznaki,
                  Cebuliony, prywatność
                  i ustawienia profilu.
                  Bez biegania po urzędach
                  i bez pytania „gdzie to
                  było?”.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <AccountBadge>
                  {roleName(
                    profile.role,
                  )}
                </AccountBadge>

                <AccountBadge>
                  Konto od{" "}
                  {formatDate(
                    profile.created_at,
                  )}
                </AccountBadge>
              </div>
            </div>
          </section>

          {!profileReady ? (
            <section className="mt-5 overflow-hidden rounded-[1.5rem] border border-accent-200 bg-accent-50">
              <div className="grid gap-4 p-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-accent-700 shadow-sm">
                  <Icon
                    name="users"
                    className="h-5 w-5"
                  />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-accent-700">
                    Papierologia
                  </p>

                  <h2 className="mt-1 font-black text-ink">
                    Profil jeszcze nie ma wszystkich pieczątek.
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-muted">
                    Ustaw nazwę i nick.
                    Nick będzie potrzebny,
                    jeśli zechcesz pokazać
                    publiczny profil.
                  </p>
                </div>

                <a
                  href="#dane-profilu"
                  className="inline-flex min-h-11 items-center justify-center rounded-button bg-white px-4 py-2.5 text-sm font-black text-brand-700 shadow-sm transition hover:bg-brand-50"
                >
                  Uzupełnij profil
                </a>
              </div>
            </section>
          ) : null}

          <section className="mt-8">
            <SectionTitle
              kicker="Szybki dostęp"
              title="Najczęściej otwierane szuflady"
              description="Duże, jednoznaczne skróty. Klikasz i od razu jesteś tam, gdzie trzeba."
            />

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <QuickAction
                href="/konto/kolekcje"
                icon="grid"
                eyebrow="Szafka"
                title="Moje miejsca"
                detail={
                  dashboard.savedPlaceEntriesCount +
                  " zapisów"
                }
              />

              <QuickAction
                href="/konto/osiagniecia"
                icon="trophy"
                eyebrow="Gablotka"
                title="Osiągnięcia"
                detail={
                  dashboard.unlockedAchievementsCount +
                  "/" +
                  dashboard.totalAchievementsCount
                }
              />

              <QuickAction
                href="/powiadomienia"
                icon="sparkles"
                eyebrow="Listonosz"
                title="Powiadomienia"
                detail={
                  dashboard.unreadNotificationsCount >
                  0
                    ? dashboard.unreadNotificationsCount +
                      " nowych"
                    : "Cisza i spokój"
                }
              />

              <QuickAction
                href="/mapy/dodaj"
                icon="map-pin"
                eyebrow="Mapa"
                title="Dodaj miejsce"
                detail="Dorzuć punkt"
              />
            </div>
          </section>

          <section className="mt-9">
            <SectionTitle
              kicker="Dorobek"
              title="Co już wypracowałeś"
              description="Tu liczy się efekt. Cebuliony nie rosną od samego klikania."
            />

            <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
              <article className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm">
                <div className="grid gap-6 p-6 sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto]">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
                      Portfel Cebulionów
                    </p>

                    <h3 className="mt-2 text-2xl font-black">
                      {
                        reputation.level
                          .name
                      }
                    </h3>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                      {
                        reputation.level
                          .description
                      }
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] bg-brand-900 px-6 py-5 text-white">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-brand-200">
                      Stan konta
                    </p>

                    <p className="mt-1 text-4xl font-black tracking-[-0.04em]">
                      {
                        reputation.cebulions
                      }
                    </p>

                    <p className="mt-1 text-xs font-bold text-brand-100">
                      Cebulionów
                    </p>
                  </div>
                </div>

                <div className="border-t border-line bg-canvas p-6 sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                    <div>
                      <p className="font-black text-ink">
                        {reputation.level
                          .nextLevelName
                          ? "Następny awans: " +
                            reputation.level
                              .nextLevelName
                          : "Najwyższy szczebel osiągnięty"}
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        {reputation.level
                          .nextLevelPoints !==
                        null
                          ? reputation.level
                              .pointsToNext +
                            " Cebulionów zostało do awansu."
                          : "Wyżej jest już tylko legenda przy rodzinnym stole."}
                      </p>
                    </div>

                    <Link
                      href="/konto/poziomy"
                      className="inline-flex min-h-10 items-center gap-2 rounded-button border border-line bg-white px-4 py-2 text-xs font-black transition hover:bg-brand-50"
                    >
                      Zobacz poziomy

                      <Icon
                        name="arrow-right"
                        className="h-3.5 w-3.5"
                      />
                    </Link>
                  </div>

                  <div
                    className="mt-4 h-3 overflow-hidden rounded-full bg-brand-100"
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

                <div className="p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-muted">
                        Kronika sukcesów
                      </p>

                      <h4 className="mt-1 font-black">
                        Ostatnie nagrodzone działania
                      </h4>
                    </div>

                    <span className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-black text-brand-700">
                      {
                        reputation.rewardedActions
                      }{" "}
                      łącznie
                    </span>
                  </div>

                  {recentReputation.length ===
                  0 ? (
                    <div className="mt-4 rounded-2xl border border-dashed border-line bg-canvas p-5">
                      <p className="font-black">
                        Na razie pusto jak półka po promocji.
                      </p>

                      <p className="mt-1 text-sm leading-6 text-muted">
                        Pierwsze wpisy pojawią się po zatwierdzeniu wartościowego działania.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3 divide-y divide-line">
                      {recentReputation.map(
                        (
                          entry,
                        ) => (
                          <div
                            key={
                              entry.id
                            }
                            className="flex items-center justify-between gap-4 py-3.5"
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

              <div className="space-y-5">
                <article className="rounded-[2rem] border border-line bg-accent-50 p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-accent-700 shadow-sm">
                    <Icon
                      name="map-pin"
                      className="h-5 w-5"
                    />
                  </div>

                  <p className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-accent-700">
                    Dorobek na mapie
                  </p>

                  <h3 className="mt-1 text-xl font-black">
                    Co dorzuciłeś do wspólnego stołu
                  </h3>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <ContributionStat
                      value={
                        dashboard.placeSubmissionsCount
                      }
                      label="miejsca"
                    />

                    <ContributionStat
                      value={
                        dashboard.placeReportsCount
                      }
                      label="raporty"
                    />
                  </div>

                  <p className="mt-4 text-xs leading-5 text-muted">
                    Punkty wpadają za zweryfikowany efekt, nie za samo wysłanie formularza. Tak jest uczciwiej i mniej spamersko.
                  </p>

                  <Link
                    href="/spolecznosc"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-700 hover:underline"
                  >
                    Jak działa wkład

                    <Icon
                      name="arrow-right"
                      className="h-4 w-4"
                    />
                  </Link>
                </article>

                {isStaff ? (
                  <article className="rounded-[2rem] border border-brand-200 bg-brand-50 p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm">
                      <Icon
                        name="shield-check"
                        className="h-5 w-5"
                      />
                    </div>

                    <p className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-brand-700">
                      Tylko dla ekipy
                    </p>

                    <h3 className="mt-1 text-xl font-black">
                      Biurko moderatora
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted">
                      Tu kończy się cebulowanie, a zaczyna urzędowa robota: zgłoszenia miejsc i raporty społeczności.
                    </p>

                    <Link
                      href="/moderacja"
                      className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-button bg-brand-900 px-5 py-2.5 text-sm font-black text-white transition hover:bg-brand-800"
                    >
                      Otwórz moderację

                      <Icon
                        name="arrow-right"
                        className="h-4 w-4"
                      />
                    </Link>
                  </article>
                ) : null}
              </div>
            </div>
          </section>

          <section
            id="prywatnosc"
            className="mt-9 scroll-mt-24"
          >
            <SectionTitle
              kicker="Prywatność"
              title="Kto może zaglądać przez płot?"
              description="Pomaganie Januszowni nie oznacza obowiązku wystawiania całego konta na widok publiczny."
            />

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <PrivacyOption
                href="/konto/publiczny-profil"
                icon="users"
                label="Publiczny profil"
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
              >
                Decyduje, czy inni mogą
                otworzyć Twój profil,
                poziom, Cebuliony i
                publiczne statystyki.
              </PrivacyOption>

              <PrivacyOption
                href="/ranking"
                icon="trophy"
                label="Ranking Cebularzy"
                status={
                  dashboard.showInLeaderboard
                    ? "Pokazujesz się"
                    : "Nie pokazujesz się"
                }
                enabled={
                  dashboard.showInLeaderboard
                }
              >
                Ranking jest osobnym
                ustawieniem. Możesz mieć
                konto i reputację bez
                udziału w publicznej
                tabeli.
              </PrivacyOption>
            </div>
          </section>

          <section
            id="dane-profilu"
            className="mt-9 scroll-mt-24 overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm"
          >
            <div className="grid lg:grid-cols-[0.75fr_1.25fr]">
              <div className="border-b border-line bg-canvas p-6 sm:p-8 lg:border-b-0 lg:border-r">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
                  Dane profilu
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">
                  Papierologia osobowa
                </h2>

                <p className="mt-3 text-sm leading-6 text-muted">
                  Nazwa wyświetlana i nick
                  pojawiają się w funkcjach
                  społecznościowych. E-mail
                  zostaje prywatną daną
                  logowania.
                </p>

                <div className="mt-6 rounded-2xl border border-line bg-white p-4">
                  <p className="text-xs font-bold text-muted">
                    E-mail konta
                  </p>

                  <p className="mt-1 break-all text-sm font-black text-ink">
                    {user.email ??
                      "Brak e-maila"}
                  </p>
                </div>

                <div className="mt-4 rounded-2xl border border-line bg-white p-4">
                  <p className="text-xs font-bold text-muted">
                    Status konta
                  </p>

                  <p className="mt-1 text-sm font-black text-ink">
                    {roleName(
                      profile.role,
                    )}
                    {" · "}
                    od{" "}
                    {formatDate(
                      profile.created_at,
                    )}
                  </p>
                </div>
              </div>

              <form
                action={updateProfile}
                className="space-y-6 p-6 sm:p-8"
              >
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
                    Normalna nazwa, którą
                    pokazujemy w Januszowni.
                    Może być imię albo
                    pseudonim.
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
                    cyfry i znak _. Jeśli
                    włączysz publiczny
                    profil, nick trafi do
                    jego adresu.
                  </p>
                </div>

                <div className="rounded-2xl bg-brand-50 p-4">
                  <p className="text-sm font-black text-brand-800">
                    Bez drobnego druku
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted">
                    Zmiana nazwy i nicku
                    nie zmienia Twoich
                    Cebulionów, poziomu,
                    osiągnięć ani zapisanych
                    miejsc.
                  </p>
                </div>

                <button
                  type="submit"
                  className="min-h-12 w-full rounded-button bg-brand-600 px-5 py-3 font-black text-white transition hover:bg-brand-700 sm:w-auto"
                >
                  Zapisz papierologię
                </button>
              </form>
            </div>
          </section>

          <section className="mt-6 rounded-[1.5rem] border border-line bg-canvas p-5 sm:flex sm:items-center sm:justify-between sm:gap-5">
            <div>
              <p className="font-black">
                Wszystko na swoim miejscu?
              </p>

              <p className="mt-1 text-sm leading-6 text-muted">
                W takim razie można wracać do mapy, narzędzi albo dalszego rozsądnego kombinowania.
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:mt-0 sm:flex-row">
              <Link
                href="/mapy"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button border border-line bg-white px-4 py-2.5 text-sm font-black transition hover:bg-brand-50"
              >
                Mapa

                <Icon
                  name="map-pin"
                  className="h-4 w-4 text-brand-700"
                />
              </Link>

              <Link
                href="/narzedzia"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button bg-brand-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-brand-700"
              >
                Narzędzia

                <Icon
                  name="calculator"
                  className="h-4 w-4"
                />
              </Link>
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
  children,
}: {
  children:
    ReactNode;
}) {
  return (
    <span className="rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-black text-muted">
      {children}
    </span>
  );
}

function SectionTitle({
  kicker,
  title,
  description,
}: {
  kicker:
    string;

  title:
    string;

  description:
    string;
}) {
  return (
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
  );
}

function QuickAction({
  href,
  icon,
  eyebrow,
  title,
  detail,
}: {
  href:
    string;

  icon:
    IconName;

  eyebrow:
    string;

  title:
    string;

  detail:
    string;
}) {
  return (
    <Link
      href={
        href
      }
      className="group rounded-[1.5rem] border border-line bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <Icon
            name={
              icon
            }
            className="h-5 w-5"
          />
        </div>

        <Icon
          name="arrow-right"
          className="h-4 w-4 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand-700"
        />
      </div>

      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.12em] text-brand-700">
        {eyebrow}
      </p>

      <h3 className="mt-1 font-black">
        {title}
      </h3>

      <p className="mt-1 text-xs font-semibold text-muted">
        {detail}
      </p>
    </Link>
  );
}

function ContributionStat({
  value,
  label,
}: {
  value:
    number;

  label:
    string;
}) {
  return (
    <div className="rounded-2xl border border-accent-200 bg-white p-4">
      <p className="text-3xl font-black tracking-[-0.03em] text-accent-700">
        {value}
      </p>

      <p className="mt-1 text-xs font-bold text-muted">
        {label}
      </p>
    </div>
  );
}

function PrivacyOption({
  href,
  icon,
  label,
  status,
  enabled,
  children,
}: {
  href:
    string;

  icon:
    IconName;

  label:
    string;

  status:
    string;

  enabled:
    boolean;

  children:
    ReactNode;
}) {
  return (
    <Link
      href={
        href
      }
      className="group rounded-[1.75rem] border border-line bg-white p-5 shadow-sm transition hover:border-brand-200 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <Icon
            name={
              icon
            }
            className="h-5 w-5"
          />
        </div>

        <span
          className={
            enabled
              ? "rounded-full bg-brand-100 px-3 py-1.5 text-xs font-black text-brand-800"
              : "rounded-full bg-canvas px-3 py-1.5 text-xs font-black text-muted"
          }
        >
          {status}
        </span>
      </div>

      <h3 className="mt-4 font-black">
        {label}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted">
        {children}
      </p>

      <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-brand-700">
        Ustaw widoczność

        <Icon
          name="arrow-right"
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </Link>
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
