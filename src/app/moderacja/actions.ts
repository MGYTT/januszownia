"use server";

import {
  revalidatePath,
  updateTag,
} from "next/cache";

import {
  redirect,
} from "next/navigation";

import { requireStaff } from "@/lib/moderation/auth";

import {
  normalizeModeratorNote,
  validateModeratorNote,
  validateSubmissionId,
} from "@/lib/moderation/validation";

function textValue(
  formData: FormData,
  name: string,
): string {
  const value =
    formData.get(name);

  return typeof value ===
    "string"
    ? value
    : "";
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
    `/moderacja?${params.toString()}`,
  );
}

export async function approveSubmission(
  formData: FormData,
) {
  const submissionId =
    textValue(
      formData,
      "submissionId",
    ).trim();

  const note =
    textValue(
      formData,
      "note",
    );

  const idValidation =
    validateSubmissionId(
      submissionId,
    );

  if (
    !idValidation.valid
  ) {
    redirectWithMessage(
      "error",

      idValidation.message ??
        "Nieprawidłowe zgłoszenie.",
    );
  }

  const noteValidation =
    validateModeratorNote(
      note,
    );

  if (
    !noteValidation.valid
  ) {
    redirectWithMessage(
      "error",

      noteValidation.message ??
        "Nieprawidłowa notatka.",
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
      "approve_place_submission",
      {
        p_submission_id:
          submissionId,

        p_note:
          normalizeModeratorNote(
            note,
          ),
      },
    );

  if (
    error ||
    typeof placeId !==
      "string"
  ) {
    redirectWithMessage(
      "error",

      "Nie udało się zatwierdzić zgłoszenia. Możliwe, że zostało już rozpatrzone.",
    );
  }

  /*
   * Zatwierdzenie tworzy miejsce
   * i trigger może przyznać +25.
   */
  updateTag(
    "reputation-leaderboard",
  );

  revalidatePath(
    "/mapy",
  );

  revalidatePath(
    "/moderacja",
  );

  revalidatePath(
    `/mapy/miejsce/${placeId}`,
  );

  redirectWithMessage(
    "message",

    "Zgłoszenie zostało zatwierdzone i opublikowane na mapie.",
  );
}

export async function rejectSubmission(
  formData: FormData,
) {
  const submissionId =
    textValue(
      formData,
      "submissionId",
    ).trim();

  const note =
    textValue(
      formData,
      "note",
    );

  const idValidation =
    validateSubmissionId(
      submissionId,
    );

  if (
    !idValidation.valid
  ) {
    redirectWithMessage(
      "error",

      idValidation.message ??
        "Nieprawidłowe zgłoszenie.",
    );
  }

  const noteValidation =
    validateModeratorNote(
      note,
    );

  if (
    !noteValidation.valid
  ) {
    redirectWithMessage(
      "error",

      noteValidation.message ??
        "Nieprawidłowa notatka.",
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
      "reject_place_submission",
      {
        p_submission_id:
          submissionId,

        p_note:
          normalizeModeratorNote(
            note,
          ),
      },
    );

  if (error) {
    redirectWithMessage(
      "error",

      "Nie udało się odrzucić zgłoszenia. Możliwe, że zostało już rozpatrzone.",
    );
  }

  revalidatePath(
    "/moderacja",
  );

  redirectWithMessage(
    "message",

    "Zgłoszenie zostało odrzucone.",
  );
}