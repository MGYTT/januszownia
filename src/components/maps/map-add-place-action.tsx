import Link from "next/link";
import { connection } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function MapAddPlaceAction() {
  /*
   * Ten fragment zależy od sesji
   * konkretnego użytkownika.
   *
   * Komponent MUSI być używany
   * wewnątrz Suspense.
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
          ? "/mapy/dodaj"
          : "/logowanie"
      }
      className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-button bg-brand-600 px-5 py-3 font-black text-white transition hover:bg-brand-700 lg:self-auto"
    >
      Dodaj miejsce
    </Link>
  );
}