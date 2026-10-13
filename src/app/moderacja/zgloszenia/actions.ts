"use server";

import {
  revalidatePath,
  updateTag,
} from "next/cache";

import {
  redirect,
} from "next/navigation";

import {
  normalizeModeratorNote,
  validateDismissNote,
  validatePlaceCorrection,
  validateReportId,
} from "@/lib/moderation/validation";

import { requireStaff } from "@/lib/moderation/auth";

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

function nullableText(
  value: string,
): string | null {
  return value.length > 0
    ? value
    : null;
}

function numberValue(
  formData: FormData,
  name: string,
): number {
  return Number(
    textValue(
      formData,
      name,
    ).replace(
      ",",
      ".",
    ),
  );
}

function redirectWithMessage(
  type:
    | "error"
    | "message",

  message: string,
): never {
  const params =
    new URLSearchParams();

  params.set(
    type,
    message,
  );

  redirect(
    `/moderacja/zgloszenia?${params.toString()}`,
  );
}

export async function resolvePlaceReport(
  formData: FormData,
) {
  const reportId =
    textValue(
      formData,
      "reportId",
    );

  const idValidation =
    validateReportId(
      reportId,
    );

  if (
    !idValidation.valid
  ) {
    redirectWithMessage(
      "error",

      idValidation.message ??
        "Nieprawidłowy raport.",
    );
  }

  const note =
    normalizeModeratorNote(
      textValue(
        formData,
        "note",
      ),
    );

  const input = {
    categoryId:
      Number(
        textValue(
          formData,
          "categoryId",
        ),
      ),

    name:
      textValue(
        formData,
        "name",
      ),

    description:
      nullableText(
        textValue(
          formData,
          "description",
        ),
      ),

    latitude:
      numberValue(
        formData,
        "latitude",
      ),

    longitude:
      numberValue(
        formData,
        "longitude",
      ),

    address:
      nullableText(
        textValue(
          formData,
          "address",
        ),
      ),

    city:
      nullableText(
        textValue(
          formData,
          "city",
        ),
      ),

    postalCode:
      nullableText(
        textValue(
          formData,
          "postalCode",
        ),
      ),

    countryCode:
      textValue(
        formData,
        "countryCode",
      ).toUpperCase(),

    note,
  };

  const validation =
    validatePlaceCorrection(
      input,
    );

  if (
    !validation.valid
  ) {
    redirectWithMessage(
      "error",

      validation.message ??
        "Nieprawidłowe dane miejsca.",
    );
  }

  const {
    supabase,
  } =
    await requireStaff();

  const {
    data: placeId,
    error,
  } =
    await supabase.rpc(
      "resolve_place_report",
      {
        p_report_id:
          reportId,

        p_category_id:
          input.categoryId,

        p_name:
          input.name,

        p_description:
          input.description,

        p_latitude:
          input.latitude,

        p_longitude:
          input.longitude,

        p_address:
          input.address,

        p_city:
          input.city,

        p_postal_code:
          input.postalCode,

        p_country_code:
          input.countryCode,

        p_note:
          input.note,
      },
    );

  if (
    error ||
    typeof placeId !==
      "string"
  ) {
    redirectWithMessage(
      "error",

      "Nie udało się poprawić miejsca i zamknąć zgłoszenia.",
    );
  }

  updateTag(
    `place:${placeId}`,
  );

  updateTag(
    `place-stats:${placeId}`,
  );

  /*
   * Trafnie rozwiązany raport
   * może przyznać reporterowi +10.
   */
  updateTag(
    "reputation-leaderboard",
  );

  revalidatePath(
    "/mapy",
  );

  revalidatePath(
    `/mapy/miejsce/${placeId}`,
  );

  revalidatePath(
    "/moderacja/zgloszenia",
  );

  redirectWithMessage(
    "message",

    "Miejsce zostało poprawione, ponownie zweryfikowane, a zgłoszenie zamknięte.",
  );
}

export async function dismissPlaceReport(
  formData: FormData,
) {
  const reportId =
    textValue(
      formData,
      "reportId",
    );

  const note =
    textValue(
      formData,
      "note",
    );

  const idValidation =
    validateReportId(
      reportId,
    );

  if (
    !idValidation.valid
  ) {
    redirectWithMessage(
      "error",

      idValidation.message ??
        "Nieprawidłowy raport.",
    );
  }

  const noteValidation =
    validateDismissNote(
      note,
    );

  if (
    !noteValidation.valid
  ) {
    redirectWithMessage(
      "error",

      noteValidation.message ??
        "Podaj uzasadnienie.",
    );
  }

  const {
    supabase,
  } =
    await requireStaff();

  const {
    error,
  } =
    await supabase.rpc(
      "dismiss_place_report",
      {
        p_report_id:
          reportId,

        p_note:
          note.trim(),
      },
    );

  if (error) {
    redirectWithMessage(
      "error",

      "Nie udało się odrzucić zgłoszenia.",
    );
  }

  revalidatePath(
    "/moderacja/zgloszenia",
  );

  redirectWithMessage(
    "message",

    "Zgłoszenie zostało odrzucone i zapisane w historii moderacji.",
  );
}