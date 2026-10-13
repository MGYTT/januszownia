import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  signOut,
  updateProfile,
} from "@/app/auth/actions";

import { ReputationCard } from "@/components/account/reputation-card";

import { Icon } from "@/components/ui/icon";

import {
  requireAuthenticatedUser,
} from "@/lib/auth/server-session";

import {
  getUserReputation,
} from "@/lib/reputation/data";

export const instant =
  false;

export const metadata: Metadata = {
  title:
    "Moje konto",

  description:
    "Profil użytkownika Januszowni.",
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
    params,
  ] =
    await Promise.all([
      supabase.auth.getUser(),

      supabase
        .from("profiles")
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside>
          <div className="rounded-[2rem] border border-line bg-white p-6 shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-2xl font-black text-white">
              {(
                profile.display_name ??
                profile.username ??
                "J"
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            <h1 className="mt-5 text-2xl font-black">
              {profile.display_name ??
                "Janusz"}
            </h1>

            {profile.username ? (
              <p className="mt-1 text-sm font-semibold text-brand-700">
                @{profile.username}
              </p>
            ) : null}

            <p className="mt-3 break-all text-sm text-muted">
              {user.email ??
                "Brak e-maila"}
            </p>

            <div className="mt-5 inline-flex rounded-full bg-brand-50 px-3 py-1.5 text-xs font-black text-brand-700">
              {roleName(
                profile.role,
              )}
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl bg-canvas px-4 py-3">
              <span className="text-xs font-bold text-muted">
                Cebuliony
              </span>

              <span className="font-black text-brand-700">
                {
                  reputation.cebulions
                }
              </span>
            </div>

            {isStaff ? (
              <Link
                href="/moderacja"
                className="mt-5 flex min-h-11 items-center justify-center gap-2 rounded-button bg-brand-900 px-4 py-2.5 text-sm font-black text-white transition hover:bg-brand-800"
              >
                <Icon
                  name="shield-check"
                  className="h-4 w-4"
                />

                Panel moderacji
              </Link>
            ) : null}

            <form
              action={signOut}
              className="mt-4"
            >
              <button
                type="submit"
                className="min-h-11 w-full rounded-button border border-line bg-white px-4 py-2.5 text-sm font-black transition hover:bg-canvas"
              >
                Wyloguj się
              </button>
            </form>
          </div>
        </aside>

        <div className="space-y-6">
          <ReputationCard
            reputation={
              reputation
            }
          />

          <section className="rounded-[2rem] border border-line bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <Icon
                name="users"
                className="h-5 w-5"
              />
            </div>

            <h2 className="mt-5 text-2xl font-black">
              Twój profil
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              Tożsamość profilu
              jest używana w
              mapach, zgłoszeniach
              i społeczności.
            </p>

            {params.message ? (
              <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm font-bold text-brand-800">
                {
                  params.message
                }
              </div>
            ) : null}

            {params.error ? (
              <div
                role="alert"
                className="mt-6 rounded-2xl border border-danger-600/20 bg-danger-50 p-4 text-sm font-bold text-danger-600"
              >
                {
                  params.error
                }
              </div>
            ) : null}

            <form
              action={updateProfile}
              className="mt-7 space-y-5"
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
                  className="h-12 w-full rounded-xl border border-line bg-canvas px-4 text-base outline-none transition focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
                />
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
                  className="h-12 w-full rounded-xl border border-line bg-canvas px-4 text-base outline-none transition placeholder:text-subtle focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
                />

                <p className="mt-2 text-xs leading-5 text-muted">
                  3–24 znaki.
                  Litery, cyfry
                  i znak _.
                </p>
              </div>

              <button
                type="submit"
                className="min-h-12 rounded-button bg-brand-600 px-5 py-3 font-black text-white transition hover:bg-brand-700"
              >
                Zapisz profil
              </button>
            </form>
          </section>

          <section className="rounded-[2rem] border border-line bg-canvas p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
              Konto
            </p>

            <h2 className="mt-2 text-xl font-black">
              Twoja Januszownia
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <AccountFeature>
                Zapisane
                obliczenia
              </AccountFeature>

              <AccountFeature>
                Ulubione miejsca
              </AccountFeature>

              <AccountFeature>
                Historia zgłoszeń
              </AccountFeature>

              <AccountFeature>
                Kolekcje miejsc
              </AccountFeature>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function AccountFeature({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        <Icon
          name="check"
          className="h-4 w-4"
        />
      </span>

      <span className="text-sm font-bold">
        {children}
      </span>
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