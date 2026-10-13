import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  PublicProfileVisibilityControl,
} from "@/components/reputation/public-profile-visibility-control";

import {
  requireAuthenticatedUser,
} from "@/lib/auth/server-session";

export const instant =
  false;

export const metadata: Metadata = {
  title:
    "Publiczny profil",

  description:
    "Ustaw widoczność publicznego profilu Januszowni.",
};

interface ProfileRow {
  username:
    string | null;

  display_name:
    string | null;
}

interface PreferenceRow {
  show_public_profile:
    boolean;
}

export default async function PublicProfileSettingsPage() {
  const {
    supabase,
    userId,
  } =
    await requireAuthenticatedUser();

  const [
    profileResult,
    preferenceResult,
  ] =
    await Promise.all([
      supabase
        .from(
          "profiles",
        )
        .select(
          `
            username,
            display_name
          `,
        )
        .eq(
          "id",
          userId,
        )
        .single(),

      supabase
        .from(
          "reputation_preferences",
        )
        .select(
          `
            show_public_profile
          `,
        )
        .eq(
          "user_id",
          userId,
        )
        .maybeSingle(),
    ]);

  if (
    profileResult.error ||
    !profileResult.data
  ) {
    throw new Error(
      "Nie udało się pobrać profilu.",
    );
  }

  if (
    preferenceResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać ustawienia publicznego profilu.",
    );
  }

  const profile =
    profileResult.data as ProfileRow;

  const preference =
    preferenceResult.data as
      | PreferenceRow
      | null;

  const visible =
    Boolean(
      preference
        ?.show_public_profile,
    );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Link
        href="/konto"
        className="text-sm font-bold text-brand-700 hover:underline"
      >
        ← Wróć do konta
      </Link>

      <header className="mt-7">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
          Prywatność
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
          Publiczny profil
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-muted">
          Sam decydujesz, czy
          Januszownia ma pokazywać
          Twój profil innym
          użytkownikom.
        </p>
      </header>

      <section className="mt-8 rounded-[2rem] border border-line bg-white p-6 shadow-sm sm:p-8">
        <div className="rounded-2xl bg-canvas p-5">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-brand-700">
            Publicznie pokażemy
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <PublicField>
              Nazwę wyświetlaną
            </PublicField>

            <PublicField>
              Nick
            </PublicField>

            <PublicField>
              Cebuliony i poziom
            </PublicField>

            <PublicField>
              Liczbę zatwierdzonych
              miejsc
            </PublicField>

            <PublicField>
              Liczbę trafnych
              zgłoszeń
            </PublicField>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-line p-5">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-muted">
            Nie publikujemy
          </p>

          <p className="mt-3 text-sm leading-7 text-muted">
            E-maila, identyfikatora
            konta, pełnego ledgera
            Cebulionów, prywatnych
            zgłoszeń ani danych
            autoryzacyjnych.
          </p>
        </div>

        <div className="mt-7">
          <p className="mb-4 font-black">
            Aktualny status
          </p>

          <PublicProfileVisibilityControl
            username={
              profile.username
            }
            initialVisible={
              visible
            }
          />
        </div>
      </section>
    </div>
  );
}

function PublicField({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-4 text-sm font-bold">
      ✓ {children}
    </div>
  );
}