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

import type {
  ReputationEventType,
} from "@/lib/reputation/types";

export const instant =
  false;

export const metadata: Metadata = {
  title:
    "Moje konto",

  description:
    "Panel konta Januszowni: profil, reputacja, osiągnięcia, kolekcje, powiadomienia i ustawienia widoczności.",
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
      <section className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-card">
        <div className="grid gap-7 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:p-9">
          <div className="flex min-w-0 items-start gap-4 sm:gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-2xl font-black text-white sm:h-20 sm:w-20 sm:text-3xl">
              {displayName
                .charAt(
                  0,
                )
                .toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
                Twoje konto
              </p>

              <h1 className="mt-1 truncate text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                {displayName}
              </h1>

              {profile.username ? (
                <p className="mt-1 text-sm font-bold text-brand-700">
                  @{profile.username}
                </p>
              ) : (
                <p className="mt-1 text-sm font-semibold text-accent-700">
                  Ustaw nick, aby przygotować publiczny profil.
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <StatusPill>
                  {roleName(
                    profile.role,
                  )}
                </StatusPill>

                <StatusPill>
                  Poziom{" "}
                  {
                    reputation.level
                      .order
                  }
                  /25
                </StatusPill>

                <StatusPill>
                  Od{" "}
                  {formatDate(
                    profile.created_at,
                  )}
                </StatusPill>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-[300px]">
            <HeroStat
              label="Cebuliony"
              value={String(
                reputation.cebulions,
              )}
            />

            <HeroStat
              label="Nagrodzone działania"
              value={String(
                reputation.rewardedActions,
              )}
            />
          </div>
        </div>
      </section>

      {params.message ? (
        <div
          role="status"
          className="mt-5 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm font-bold text-brand-800"
        >
          {params.message}
        </div>
      ) : null}

      {params.error ? (
        <div
          role="alert"
          className="mt-5 rounded-2xl border border-danger-600/20 bg-danger-50 p-4 text-sm font-bold text-danger-600"
        >
          {params.error}
        </div>
      ) : null}

      {!profileReady ? (
        <section className="mt-6 rounded-[1.5rem] border border-accent-200 bg-accent-50 p-5 sm:p-6">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-accent-700">
              <Icon
                name="users"
                className="h-5 w-5"
              />
            </div>

            <div>
              <h2 className="font-black text-ink">
                Dokończ profil
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted">
                Uzupełnij nazwę wyświetlaną i nick. Nick jest potrzebny, jeśli później zechcesz włączyć publiczny profil.
              </p>

              <a
                href="#dane-profilu"
                className="mt-3 inline-flex text-sm font-black text-brand-700 hover:underline"
              >
                Uzupełnij dane →
              </a>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mt-8">
        <SectionHeading
          eyebrow="Najważniejsze"
          title="Wszystko, czego najczęściej potrzebujesz."
          description="Każda karta prowadzi do działającej części konta. Bez atrap i nieklikalnych obietnic."
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <DashboardCard
            href="/konto/kolekcje"
            icon="grid"
            title="Kolekcje miejsc"
            value={
              dashboard.collectionsCount ===
              1
                ? "1 kolekcja"
                : dashboard.collectionsCount +
                  " kolekcji"
            }
            description={
              dashboard.savedPlaceEntriesCount +
              " zapisów miejsc w Twoich listach."
            }
            cta="Otwórz kolekcje"
          />

          <DashboardCard
            href="/konto/osiagniecia"
            icon="trophy"
            title="Osiągnięcia"
            value={
              dashboard.unlockedAchievementsCount +
              "/" +
              dashboard.totalAchievementsCount
            }
            description="Zobacz zdobyte odznaki, postęp i wybierz wyróżnione osiągnięcia."
            cta="Pokaż osiągnięcia"
          />

          <DashboardCard
            href="/powiadomienia"
            icon="sparkles"
            title="Powiadomienia"
            value={
              dashboard.unreadNotificationsCount >
              0
                ? dashboard.unreadNotificationsCount +
                  " nowych"
                : "Brak nowych"
            }
            description="Informacje o poziomach, osiągnięciach i ważnych zdarzeniach konta."
            cta="Otwórz powiadomienia"
          />

          <DashboardCard
            href="/konto/poziomy"
            icon="route"
            title="Droga Cebularza"
            value={
              "Poziom " +
              reputation.level.order +
              "/25"
            }
            description={
              reputation.level
                .nextLevelName
                ? reputation.level
                    .pointsToNext +
                  " Cebulionów do: " +
                  reputation.level
                    .nextLevelName +
                  "."
                : "Masz najwyższy poziom reputacji."
            }
            cta="Zobacz poziomy"
          />

          <DashboardCard
            href="/konto/publiczny-profil"
            icon="users"
            title="Publiczny profil"
            value={
              !profile.username
                ? "Wymaga nicku"
                : dashboard.showPublicProfile
                  ? "Widoczny"
                  : "Prywatny"
            }
            description="Sam decydujesz, czy inni mogą zobaczyć Twój profil i publiczne statystyki."
            cta="Ustaw widoczność"
          />

          <DashboardCard
            href="/ranking"
            icon="trophy"
            title="Ranking Cebularzy"
            value={
              dashboard.showInLeaderboard
                ? "Włączony"
                : "Wyłączony"
            }
            description="Udział w publicznym rankingu jest dobrowolny i niezależny od publicznego profilu."
            cta="Otwórz ranking"
          />
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-line bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
                Reputacja
              </p>

              <h2 className="mt-2 text-2xl font-black">
                {
                  reputation.level
                    .name
                }
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                {
                  reputation.level
                    .description
                }
              </p>
            </div>

            <div className="shrink-0 rounded-2xl bg-brand-600 px-5 py-4 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-brand-100">
                Cebuliony
              </p>

              <p className="mt-1 text-3xl font-black">
                {
                  reputation.cebulions
                }
              </p>
            </div>
          </div>

          {reputation.level
            .nextLevelPoints !==
          null ? (
            <div className="mt-7">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-bold text-muted">
                  Następny:{" "}
                  <strong className="text-ink">
                    {
                      reputation.level
                        .nextLevelName
                    }
                  </strong>
                </span>

                <span className="shrink-0 font-black">
                  {
                    reputation.level
                      .pointsToNext
                  }{" "}
                  pkt
                </span>
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
            <div className="mt-7 rounded-2xl bg-accent-50 p-4 text-sm font-black text-accent-700">
              Osiągnięto najwyższy poziom reputacji.
            </div>
          )}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/konto/poziomy"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button bg-brand-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-brand-700"
            >
              Pełna ścieżka poziomów

              <Icon
                name="arrow-right"
                className="h-4 w-4"
              />
            </Link>

            <Link
              href="/konto/osiagniecia"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button border border-line bg-white px-5 py-2.5 text-sm font-black transition hover:bg-canvas"
            >
              Osiągnięcia

              <Icon
                name="trophy"
                className="h-4 w-4 text-brand-700"
              />
            </Link>
          </div>

          <div className="mt-8 border-t border-line pt-6">
            <h3 className="font-black">
              Ostatnie Cebuliony
            </h3>

            {recentReputation.length ===
            0 ? (
              <div className="mt-4 rounded-2xl bg-canvas p-5">
                <p className="font-black">
                  Na razie pusto.
                </p>

                <p className="mt-1 text-sm leading-6 text-muted">
                  Punkty pojawią się po zatwierdzeniu wartościowego działania.
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
        </div>

        <div className="space-y-6">
          <section className="rounded-[2rem] border border-line bg-canvas p-6 sm:p-7">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
              Twój wkład
            </p>

            <h2 className="mt-2 text-xl font-black">
              Co wysłałeś do społeczności
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <MiniStat
                value={
                  dashboard.placeSubmissionsCount
                }
                label="zgłoszonych miejsc"
              />

              <MiniStat
                value={
                  dashboard.placeReportsCount
                }
                label="raportów problemów"
              />
            </div>

            <p className="mt-4 text-xs leading-5 text-muted">
              Cebuliony dostajesz za zweryfikowany efekt, nie za samo wysłanie formularza.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <Link
                href="/mapy/dodaj"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button bg-brand-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-brand-700"
              >
                Dodaj miejsce

                <Icon
                  name="map-pin"
                  className="h-4 w-4"
                />
              </Link>

              <Link
                href="/spolecznosc"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button border border-line bg-white px-4 py-2.5 text-sm font-black transition hover:bg-brand-50"
              >
                Jak działa wkład

                <Icon
                  name="arrow-right"
                  className="h-4 w-4 text-brand-700"
                />
              </Link>
            </div>
          </section>

          {isStaff ? (
            <section className="rounded-[2rem] border border-brand-200 bg-brand-50 p-6 sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-700">
                <Icon
                  name="shield-check"
                  className="h-5 w-5"
                />
              </div>

              <h2 className="mt-4 text-xl font-black">
                Panel moderacji
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted">
                Masz uprawnienia do obsługi zgłoszeń miejsc i raportów społeczności.
              </p>

              <Link
                href="/moderacja"
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-button bg-brand-900 px-5 py-2.5 text-sm font-black text-white transition hover:bg-brand-800"
              >
                Przejdź do moderacji

                <Icon
                  name="arrow-right"
                  className="h-4 w-4"
                />
              </Link>
            </section>
          ) : null}
        </div>
      </section>

      <section className="mt-10">
        <SectionHeading
          eyebrow="Prywatność"
          title="Ty decydujesz, co jest publiczne."
          description="Publiczny profil i ranking to dwa niezależne ustawienia. Pomaganie społeczności nie wymaga wystawiania konta na widok publiczny."
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <VisibilityCard
            href="/konto/publiczny-profil"
            icon="users"
            title="Publiczny profil"
            status={
              !profile.username
                ? "Najpierw ustaw nick"
                : dashboard.showPublicProfile
                  ? "Włączony"
                  : "Wyłączony"
            }
            description="Steruje widocznością profilu pod adresem /ludzie/twoj_nick."
          />

          <VisibilityCard
            href="/ranking"
            icon="trophy"
            title="Publiczny ranking"
            status={
              dashboard.showInLeaderboard
                ? "Włączony"
                : "Wyłączony"
            }
            description="Steruje obecnością Twojego konta w tabeli Ranking Cebularzy."
          />
        </div>
      </section>

      <section
        id="dane-profilu"
        className="mt-10 scroll-mt-24 rounded-[2rem] border border-line bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <Icon
                name="users"
                className="h-5 w-5"
              />
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-brand-700">
              Dane profilu
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Jak widzi Cię Januszownia
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted">
              Nazwa wyświetlana i nick są używane w funkcjach społecznościowych. E-mail pozostaje prywatną daną konta.
            </p>

            <div className="mt-5 rounded-2xl bg-canvas p-4">
              <p className="text-xs font-bold text-muted">
                E-mail konta
              </p>

              <p className="mt-1 break-all text-sm font-black text-ink">
                {user.email ??
                  "Brak e-maila"}
              </p>
            </div>
          </div>

          <form
            action={updateProfile}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="displayName"
                className="mb-2 block text-sm font-bold"
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
                className="h-12 w-full rounded-xl border border-line bg-canvas px-4 text-base outline-none transition focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
              />

              <p className="mt-2 text-xs leading-5 text-muted">
                To główna nazwa widoczna w Januszowni.
              </p>
            </div>

            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-bold"
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
                className="h-12 w-full rounded-xl border border-line bg-canvas px-4 text-base outline-none transition placeholder:text-subtle focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
              />

              <p className="mt-2 text-xs leading-5 text-muted">
                3–24 znaki. Litery, cyfry i znak _. Nick tworzy adres publicznego profilu, jeśli go włączysz.
              </p>
            </div>

            <button
              type="submit"
              className="min-h-12 w-full rounded-button bg-brand-600 px-5 py-3 font-black text-white transition hover:bg-brand-700 sm:w-auto"
            >
              Zapisz zmiany profilu
            </button>
          </form>
        </div>
      </section>

      <section className="mt-6 rounded-[2rem] border border-line bg-canvas p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <p className="font-black text-ink">
            Koniec cebulowania na dziś?
          </p>

          <p className="mt-1 text-sm leading-6 text-muted">
            Wylogowanie zakończy bieżącą sesję na tym urządzeniu.
          </p>
        </div>

        <form
          action={signOut}
          className="mt-4 sm:mt-0"
        >
          <button
            type="submit"
            className="min-h-11 rounded-button border border-line bg-white px-5 py-2.5 text-sm font-black transition hover:bg-white/70"
          >
            Wyloguj się
          </button>
        </form>
      </section>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow:
    string;

  title:
    string;

  description:
    string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] sm:text-3xl">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
        {description}
      </p>
    </div>
  );
}

function DashboardCard({
  href,
  icon,
  title,
  value,
  description,
  cta,
}: {
  href:
    string;

  icon:
    IconName;

  title:
    string;

  value:
    string;

  description:
    string;

  cta:
    string;
}) {
  return (
    <Link
      href={
        href
      }
      className="group flex h-full flex-col rounded-[1.75rem] border border-line bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card sm:p-6"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <Icon
          name={
            icon
          }
          className="h-5 w-5"
        />
      </div>

      <h3 className="mt-4 font-black">
        {title}
      </h3>

      <p className="mt-1 text-xl font-black text-brand-800">
        {value}
      </p>

      <p className="mt-3 flex-1 text-sm leading-6 text-muted">
        {description}
      </p>

      <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-700">
        {cta}

        <Icon
          name="arrow-right"
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}

function VisibilityCard({
  href,
  icon,
  title,
  status,
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

  description:
    string;
}) {
  return (
    <Link
      href={
        href
      }
      className="group rounded-[1.5rem] border border-line bg-white p-5 shadow-sm transition hover:border-brand-200 hover:bg-brand-50/30"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <Icon
            name={
              icon
            }
            className="h-5 w-5"
          />
        </div>

        <span className="rounded-full bg-canvas px-3 py-1 text-xs font-black text-muted">
          {status}
        </span>
      </div>

      <h3 className="mt-4 font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted">
        {description}
      </p>

      <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-brand-700">
        Zarządzaj

        <Icon
          name="arrow-right"
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}

function StatusPill({
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

function HeroStat({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) {
  return (
    <div className="rounded-2xl bg-canvas p-4">
      <p className="text-xs font-bold text-muted">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black text-brand-800">
        {value}
      </p>
    </div>
  );
}

function MiniStat({
  value,
  label,
}: {
  value:
    number;

  label:
    string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <p className="text-2xl font-black text-brand-800">
        {value}
      </p>

      <p className="mt-1 text-xs leading-5 text-muted">
        {label}
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
      return "Zatwierdzone miejsce";

    case "valid_report":
      return "Trafne zgłoszenie problemu";
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
