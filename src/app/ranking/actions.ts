"use server";

import {
  revalidatePath,
  updateTag,
} from "next/cache";

import type {
  LeaderboardVisibilityState,
} from "@/lib/reputation/visibility";

import {
  createClient,
} from "@/lib/supabase/server";

export async function setLeaderboardVisibility(
  previousState:
    LeaderboardVisibilityState,

  formData: FormData,
): Promise<LeaderboardVisibilityState> {
  const rawVisible =
    formData.get(
      "visible",
    );

  if (
    rawVisible !==
      "true" &&
    rawVisible !==
      "false"
  ) {
    return {
      status:
        "error",

      message:
        "Nieprawidłowe ustawienie rankingu.",

      visible:
        previousState.visible,
    };
  }

  const visible =
    rawVisible ===
    "true";

  const supabase =
    await createClient();

  const {
    data: claimsData,
    error: claimsError,
  } =
    await supabase.auth.getClaims();

  const userId =
    claimsData?.claims?.sub;

  if (
    claimsError ||
    !userId
  ) {
    return {
      status:
        "error",

      message:
        "Twoja sesja wygasła. Zaloguj się ponownie.",

      visible:
        previousState.visible,
    };
  }

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "reputation_preferences",
      )
      .update({
        show_in_leaderboard:
          visible,
      })
      .eq(
        "user_id",
        userId,
      )
      .select(
        `
          show_in_leaderboard
        `,
      )
      .maybeSingle();

  if (
    error ||
    !data
  ) {
    console.error(
      "Nie udało się zmienić widoczności w rankingu:",
      error,
    );

    return {
      status:
        "error",

      message:
        "Nie udało się zmienić ustawienia rankingu.",

      visible:
        previousState.visible,
    };
  }

  const savedVisible =
    Boolean(
      data.show_in_leaderboard,
    );

  /*
   * Trigger PostgreSQL aktualizuje
   * public.reputation_leaderboard.
   *
   * Teraz wygaszamy jego publiczny cache.
   */
  updateTag(
    "reputation-leaderboard",
  );

  /*
   * Prywatny panel użytkownika również
   * powinien dostać świeżą wartość.
   */
  revalidatePath(
    "/ranking",
  );

  revalidatePath(
    "/konto",
  );

  return {
    status:
      "success",

    message:
      savedVisible
        ? "Jesteś teraz widoczny w Rankingu Cebularzy."
        : "Twój profil został ukryty z Rankingu Cebularzy.",

    visible:
      savedVisible,
  };
}