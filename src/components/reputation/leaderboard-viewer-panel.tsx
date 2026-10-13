import Link from "next/link";

import {
  LeaderboardVisibilityControl,
} from "@/components/reputation/leaderboard-visibility-control";

import {
  getRequestAuth,
} from "@/lib/auth/server-session";

import {
  getOwnLeaderboardPosition,
} from "@/lib/reputation/leaderboard";

interface PreferenceRow {
  show_in_leaderboard:
    boolean;
}

export async function LeaderboardViewerPanel() {
  /*
   * To jest Server Component,
   * więc tutaj getRequestAuth()
   * i jego connection() są właściwe.
   */
  const {
    supabase,
    userId,
  } =
    await getRequestAuth();

  if (!userId) {
    return (
      <section className="rounded-[2rem] border border-line bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
          Twój ranking
        </p>

        <h2 className="mt-2 text-xl font-black">
          Chcesz wejść do
          tabeli?
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          Ranking jest
          dobrowolny. Po
          zalogowaniu możesz
          zdecydować, czy Twój
          nick, nazwa i liczba
          Cebulionów mają być
          publiczne.
        </p>

        <Link
          href="/logowanie"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-button bg-brand-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-brand-700"
        >
          Zaloguj się
        </Link>
      </section>
    );
  }

  const [
    preferenceResult,
    ownPosition,
  ] =
    await Promise.all([
      supabase
        .from(
          "reputation_preferences",
        )
        .select(
          `
            show_in_leaderboard
          `,
        )
        .eq(
          "user_id",
          userId,
        )
        .maybeSingle(),

      getOwnLeaderboardPosition(
        supabase,
      ),
    ]);

  if (
    preferenceResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać ustawienia rankingu.",
    );
  }

  const preference =
    preferenceResult.data as
      | PreferenceRow
      | null;

  const visible =
    Boolean(
      preference
        ?.show_in_leaderboard,
    );

  return (
    <section className="rounded-[2rem] border border-line bg-white p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
        Twój ranking
      </p>

      {visible ? (
        <>
          <h2 className="mt-2 text-xl font-black">
            Jesteś widoczny.
          </h2>

          {ownPosition ? (
            <div className="mt-5 rounded-2xl bg-brand-50 p-5">
              <p className="text-xs font-bold text-brand-700">
                Twoja pozycja
              </p>

              <p className="mt-1 text-3xl font-black">
                #
                {
                  ownPosition.position
                }
              </p>

              <p className="mt-2 text-sm text-muted">
                Spośród{" "}
                <strong className="text-ink">
                  {
                    ownPosition.totalParticipants
                  }
                </strong>{" "}
                uczestników
                rankingu.
              </p>

              <p className="mt-1 text-sm text-muted">
                Cebuliony:{" "}
                <strong className="text-ink">
                  {
                    ownPosition.cebulions
                  }
                </strong>
              </p>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl bg-canvas p-4 text-sm leading-6 text-muted">
              Ranking jest
              włączony. Pozycja
              zostanie pokazana,
              gdy publiczna
              projekcja zostanie
              zsynchronizowana.
            </div>
          )}

          <p className="mt-5 text-sm leading-6 text-muted">
            Publiczne są
            wyłącznie nazwa,
            opcjonalny nick,
            Cebuliony i poziom
            wynikający z liczby
            punktów.
          </p>
        </>
      ) : (
        <>
          <h2 className="mt-2 text-xl font-black">
            Jesteś niewidoczny.
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted">
            To ustawienie jest
            domyślne. Twoje konto,
            wynik i pozycja nie są
            publikowane w tabeli.
          </p>
        </>
      )}

      <LeaderboardVisibilityControl
        initialVisible={
          visible
        }
      />
    </section>
  );
}