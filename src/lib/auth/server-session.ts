import {
  redirect,
} from "next/navigation";

import {
  connection,
} from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function getRequestAuth() {
  /*
   * Wszystko poniżej może zależeć od:
   *
   * - cookies,
   * - tokenu użytkownika,
   * - czasu wygaśnięcia JWT,
   * - aktualnego requestu.
   *
   * Dlatego najpierw wychodzimy
   * z prerenderingu.
   */
  await connection();

  const supabase =
    await createClient();

  const {
    data,
    error,
  } =
    await supabase.auth.getClaims();

  const userId =
    !error
      ? data?.claims?.sub ??
        null
      : null;

  return {
    supabase,
    userId,
  };
}

export async function requireAuthenticatedUser() {
  const {
    supabase,
    userId,
  } =
    await getRequestAuth();

  if (!userId) {
    redirect(
      "/logowanie",
    );
  }

  return {
    supabase,
    userId,
  };
}