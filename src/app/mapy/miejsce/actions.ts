"use server";

import {
  revalidatePath,
  updateTag,
} from "next/cache";

import type {
  PlaceConfirmationActionState,
  PlaceReportActionState,
  PlaceReportReason,
  PlaceVerdict,
} from "@/lib/maps/community-types";

import { createClient } from "@/lib/supabase/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const REPORT_REASONS =
  new Set<PlaceReportReason>([
    "outdated",
    "closed",
    "wrong_location",
    "wrong_information",
    "duplicate",
    "other",
  ]);

function textValue(
  formData: FormData,
  name: string,
): string {
  const value =
    formData.get(name);

  return typeof value ===
    "string"
    ? value.trim()
    : "";
}

async function getAuthenticatedUser() {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } =
    await supabase.auth.getClaims();

  const userId =
    data?.claims?.sub;

  if (
    error ||
    !userId
  ) {
    return {
      supabase,
      userId: null,
    };
  }

  return {
    supabase,
    userId,
  };
}

export async function updatePlaceConfirmation(
  previousState:
    PlaceConfirmationActionState,

  formData: FormData,
): Promise<PlaceConfirmationActionState> {
  void previousState;

  const placeId =
    textValue(
      formData,
      "placeId",
    );

  const rawVerdict =
    textValue(
      formData,
      "verdict",
    );

  if (
    !UUID_PATTERN.test(
      placeId,
    )
  ) {
    return {
      status: "error",

      message:
        "Nieprawidłowe miejsce.",

      verdict: null,
    };
  }

  if (
    rawVerdict !==
      "confirmed" &&
    rawVerdict !==
      "outdated"
  ) {
    return {
      status: "error",

      message:
        "Nieprawidłowa odpowiedź.",

      verdict: null,
    };
  }

  const verdict =
    rawVerdict as PlaceVerdict;

  const {
    supabase,
    userId,
  } =
    await getAuthenticatedUser();

  if (!userId) {
    return {
      status: "error",

      message:
        "Musisz się zalogować, aby potwierdzić miejsce.",

      verdict: null,
    };
  }

  const {
    error,
  } =
    await supabase
      .from(
        "place_confirmations",
      )
      .upsert(
        {
          place_id:
            placeId,

          user_id:
            userId,

          verdict,

          observed_at:
            new Date().toISOString(),
        },
        {
          onConflict:
            "place_id,user_id",
        },
      );

  if (error) {
    return {
      status: "error",

      message:
        "Nie udało się zapisać Twojego potwierdzenia.",

      verdict: null,
    };
  }

  /*
   * Statystyki są cache'owane,
   * dlatego po zmianie głosu
   * natychmiast wygaszamy ich cache.
   */
  updateTag(
    `place-stats:${placeId}`,
  );

  revalidatePath(
    `/mapy/miejsce/${placeId}`,
  );

  return {
    status:
      "success",

    message:
      verdict ===
      "confirmed"
        ? "Dziękujemy. Zapisaliśmy, że miejsce jest aktualne."
        : "Dziękujemy. Zapisaliśmy sygnał, że miejsce może być nieaktualne.",

    verdict,
  };
}

export async function reportPlaceIssue(
  previousState:
    PlaceReportActionState,

  formData: FormData,
): Promise<PlaceReportActionState> {
  void previousState;

  const placeId =
    textValue(
      formData,
      "placeId",
    );

  const rawReason =
    textValue(
      formData,
      "reason",
    );

  const details =
    textValue(
      formData,
      "details",
    );

  if (
    !UUID_PATTERN.test(
      placeId,
    )
  ) {
    return {
      status: "error",

      message:
        "Nieprawidłowe miejsce.",
    };
  }

  if (
    !REPORT_REASONS.has(
      rawReason as PlaceReportReason,
    )
  ) {
    return {
      status: "error",

      message:
        "Wybierz powód zgłoszenia.",
    };
  }

  if (
    details.length >
    1500
  ) {
    return {
      status: "error",

      message:
        "Opis problemu może mieć maksymalnie 1500 znaków.",
    };
  }

  if (
    rawReason ===
      "other" &&
    details.length < 5
  ) {
    return {
      status: "error",

      message:
        "Przy opcji „Inny problem” krótko opisz, co jest nie tak.",
    };
  }

  const {
    supabase,
    userId,
  } =
    await getAuthenticatedUser();

  if (!userId) {
    return {
      status: "error",

      message:
        "Musisz się zalogować, aby zgłosić problem.",
    };
  }

  const {
    error,
  } =
    await supabase
      .from(
        "place_reports",
      )
      .insert({
        place_id:
          placeId,

        reporter_id:
          userId,

        reason:
          rawReason,

        details:
          details ||
          null,
      });

  if (error) {
    if (
      error.code ===
      "23505"
    ) {
      return {
        status:
          "error",

        message:
          "Masz już otwarte zgłoszenie dotyczące tego miejsca.",
      };
    }

    return {
      status:
        "error",

      message:
        "Nie udało się wysłać zgłoszenia.",
    };
  }

  return {
    status:
      "success",

    message:
      "Zgłoszenie zostało wysłane do moderacji.",
  };
}