import Link from "next/link";

import {
  connection,
} from "next/server";

import {
  Icon,
} from "@/components/ui/icon";

import {
  createClient,
} from "@/lib/supabase/server";

export async function HeaderAuthAction() {
  /*
   * Ten fragment UI zależy od konkretnego requestu
   * i cookies użytkownika.
   *
   * connection() informuje Next.js 16,
   * że kod poniżej nie może być wykonywany
   * podczas prerenderingu statycznej powłoki.
   */
  await connection();

  const supabase =
    await createClient();

  const {
    data,
    error,
  } =
    await supabase.auth.getClaims();

  const loggedIn =
    !error &&
    Boolean(
      data?.claims?.sub,
    );

  return (
    <Link
      href={
        loggedIn
          ? "/konto"
          : "/logowanie"
      }
      aria-label={
        loggedIn
          ? "Otwórz moje konto"
          : "Zaloguj się do Januszowni"
      }
      className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-button bg-brand-600 px-3 py-2 text-xs font-black text-white shadow-sm transition hover:bg-brand-700 sm:min-h-11 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
    >
      <span className="sm:hidden">
        {loggedIn
          ? "Konto"
          : "Zaloguj"}
      </span>

      <span className="hidden sm:inline">
        {loggedIn
          ? "Moje konto"
          : "Zaloguj"}
      </span>

      <Icon
        name="arrow-right"
        className="h-3.5 w-3.5 sm:h-4 sm:w-4"
      />
    </Link>
  );
}
