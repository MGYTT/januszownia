"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  createClient,
} from "@/lib/supabase/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function markNotificationRead(
  formData: FormData,
) {
  const rawId =
    formData.get(
      "notificationId",
    );

  const notificationId =
    typeof rawId ===
      "string"
      ? rawId
      : "";

  if (
    !UUID_PATTERN.test(
      notificationId,
    )
  ) {
    return;
  }

  const supabase =
    await createClient();

  const {
    data: claimsData,
    error: claimsError,
  } =
    await supabase.auth.getClaims();

  if (
    claimsError ||
    !claimsData?.claims?.sub
  ) {
    return;
  }

  const {
    error,
  } =
    await supabase
      .from(
        "notifications",
      )
      .update({
        read_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        notificationId,
      )
      .is(
        "read_at",
        null,
      );

  if (error) {
    console.error(
      "Nie udało się oznaczyć powiadomienia jako przeczytane:",
      error,
    );

    return;
  }

  revalidatePath(
    "/powiadomienia",
  );
}

export async function markAllNotificationsRead() {
  const supabase =
    await createClient();

  const {
    data: claimsData,
    error: claimsError,
  } =
    await supabase.auth.getClaims();

  if (
    claimsError ||
    !claimsData?.claims?.sub
  ) {
    return;
  }

  const {
    error,
  } =
    await supabase
      .from(
        "notifications",
      )
      .update({
        read_at:
          new Date().toISOString(),
      })
      .is(
        "read_at",
        null,
      );

  if (error) {
    console.error(
      "Nie udało się oznaczyć wszystkich powiadomień jako przeczytane:",
      error,
    );

    return;
  }

  revalidatePath(
    "/powiadomienia",
  );
}