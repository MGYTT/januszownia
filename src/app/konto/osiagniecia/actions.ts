"use server";

import {
  revalidatePath,
  updateTag,
} from "next/cache";

import type {
  AchievementFeatureState,
} from "@/lib/reputation/achievement-action-state";

import {
  createClient,
} from "@/lib/supabase/server";

const CODE_PATTERN =
  /^[a-z0-9_]{3,80}$/;

interface AchievementFeatureRpcRow {
  profile_username:
    string | null;

  is_featured:
    boolean;

  showcase_slot:
    number | string | null;
}

export async function setAchievementFeatured(
  previousState:
    AchievementFeatureState,

  formData: FormData,
): Promise<AchievementFeatureState> {
  const rawCode =
    formData.get(
      "achievementCode",
    );

  const rawFeatured =
    formData.get(
      "featured",
    );

  const achievementCode =
    typeof rawCode ===
      "string"
      ? rawCode
      : "";

  if (
    !CODE_PATTERN.test(
      achievementCode,
    )
  ) {
    return {
      ...previousState,
      status:
        "error",
      message:
        "Nieprawidłowe osiągnięcie.",
    };
  }

  if (
    rawFeatured !==
      "true" &&
    rawFeatured !==
      "false"
  ) {
    return {
      ...previousState,
      status:
        "error",
      message:
        "Nieprawidłowa operacja.",
    };
  }

  const featured =
    rawFeatured ===
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
      ...previousState,
      status:
        "error",
      message:
        "Sesja wygasła. Zaloguj się ponownie.",
    };
  }

  const {
    data,
    error,
  } =
    await supabase
      .rpc(
        "set_my_achievement_featured",
        {
          p_achievement_code:
            achievementCode,

          p_featured:
            featured,
        },
      )
      .maybeSingle();

  if (error) {
    console.error(
      "Błąd gabloty osiągnięć:",
      error,
    );

    if (
      error.message.includes(
        "SHOWCASE_FULL",
      )
    ) {
      return {
        ...previousState,
        status:
          "error",
        message:
          "Gablotka jest pełna. Możesz wyróżnić maksymalnie 5 osiągnięć.",
      };
    }

    if (
      error.message.includes(
        "ACHIEVEMENT_NOT_EARNED",
      )
    ) {
      return {
        ...previousState,
        status:
          "error",
        message:
          "Możesz wyróżniać tylko zdobyte osiągnięcia.",
      };
    }

    return {
      ...previousState,
      status:
        "error",
      message:
        "Nie udało się zmienić gabloty osiągnięć.",
    };
  }

  const result =
    parseAchievementFeatureRpcRow(
      data,
    );

  if (!result) {
    console.error(
      "Nieprawidłowa odpowiedź RPC set_my_achievement_featured:",
      data,
    );

    return {
      ...previousState,
      status:
        "error",
      message:
        "Serwer nie zwrócił poprawnego potwierdzenia zmiany.",
    };
  }

  const username =
    result.profile_username;

  const savedFeatured =
    result.is_featured;

  const slot =
    result.showcase_slot ===
      null
      ? null
      : Number(
          result.showcase_slot,
        );

  if (
    slot !== null &&
    (
      !Number.isInteger(
        slot,
      ) ||
      slot < 1 ||
      slot > 5
    )
  ) {
    return {
      ...previousState,
      status:
        "error",
      message:
        "Serwer zwrócił nieprawidłowe miejsce w gablocie.",
    };
  }

  if (username) {
    updateTag(
      `public-profile:${username}`,
    );

    revalidatePath(
      `/ludzie/${username}`,
    );
  }

  revalidatePath(
    "/konto/osiagniecia",
  );

  revalidatePath(
    "/konto",
  );

  return {
    status:
      "success",

    message:
      savedFeatured
        ? "Odznaka została wyróżniona na profilu."
        : "Odznaka została usunięta z wyróżnionych.",

    featured:
      savedFeatured,

    slot,
  };
}

function parseAchievementFeatureRpcRow(
  value: unknown,
): AchievementFeatureRpcRow | null {
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

  if (
    row.profile_username !==
      null &&
    typeof row.profile_username !==
      "string"
  ) {
    return null;
  }

  if (
    typeof row.is_featured !==
    "boolean"
  ) {
    return null;
  }

  if (
    row.showcase_slot !==
      null &&
    typeof row.showcase_slot !==
      "number" &&
    typeof row.showcase_slot !==
      "string"
  ) {
    return null;
  }

  return {
    profile_username:
      row.profile_username,

    is_featured:
      row.is_featured,

    showcase_slot:
      row.showcase_slot,
  };
}