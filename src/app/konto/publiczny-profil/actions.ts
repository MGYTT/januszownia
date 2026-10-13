"use server";

import {
  revalidatePath,
  updateTag,
} from "next/cache";

import type {
  PublicProfileVisibilityState,
} from "@/lib/reputation/public-profile-visibility";

import {
  createClient,
} from "@/lib/supabase/server";

interface PublicProfileVisibilityRpcRow {
  profile_visible:
    boolean;

  profile_username:
    string | null;
}

export async function setPublicProfileVisibility(
  previousState:
    PublicProfileVisibilityState,

  formData: FormData,
): Promise<PublicProfileVisibilityState> {
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
        "Nieprawidłowe ustawienie profilu.",

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
      .rpc(
        "set_my_public_profile_visibility",
        {
          p_visible:
            visible,
        },
      )
      .maybeSingle();

  if (error) {
    console.error(
      "Błąd zmiany widoczności publicznego profilu:",
      error,
    );

    if (
      error.message.includes(
        "USERNAME_REQUIRED",
      )
    ) {
      return {
        status:
          "error",

        message:
          "Najpierw ustaw nick na stronie konta.",

        visible:
          previousState.visible,
      };
    }

    if (
      error.message.includes(
        "AUTHENTICATION_REQUIRED",
      )
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

    return {
      status:
        "error",

      message:
        "Nie udało się zmienić widoczności profilu.",

      visible:
        previousState.visible,
    };
  }

  const result =
    parsePublicProfileVisibilityRpcRow(
      data,
    );

  if (!result) {
    console.error(
      "Nieprawidłowa odpowiedź RPC set_my_public_profile_visibility:",
      data,
    );

    return {
      status:
        "error",

      message:
        "Serwer nie zwrócił poprawnego potwierdzenia zmiany.",

      visible:
        previousState.visible,
    };
  }

  const savedVisible =
    result.profile_visible;

  const username =
    result.profile_username;

  /*
   * Zmienia się:
   *
   * - karta publicznego profilu,
   * - publiczne osiągnięcia,
   * - stan linkowania z rankingu.
   */
  updateTag(
    "reputation-leaderboard",
  );

  if (username) {
    updateTag(
      `public-profile:${username}`,
    );

    revalidatePath(
      `/ludzie/${username}`,
    );
  }

  revalidatePath(
    "/ranking",
  );

  revalidatePath(
    "/konto",
  );

  revalidatePath(
    "/konto/publiczny-profil",
  );

  return {
    status:
      "success",

    message:
      savedVisible
        ? "Publiczny profil został włączony."
        : "Publiczny profil został wyłączony.",

    visible:
      savedVisible,
  };
}

function parsePublicProfileVisibilityRpcRow(
  value: unknown,
): PublicProfileVisibilityRpcRow | null {
  if (
    typeof value !==
      "object" ||
    value === null
  ) {
    return null;
  }

  const row =
    value as Record<
      string,
      unknown
    >;

  const visible =
    row.profile_visible;

  const username =
    row.profile_username;

  if (
    typeof visible !==
    "boolean"
  ) {
    return null;
  }

  if (
    username !== null &&
    typeof username !==
      "string"
  ) {
    return null;
  }

  return {
    profile_visible:
      visible,

    profile_username:
      username,
  };
}