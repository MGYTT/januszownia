"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  getRequestAuth,
} from "@/lib/auth/server-session";

import type {
  SaveCalculationActionResult,
  SaveCalculationPayload,
} from "@/lib/account/saved-calculations";

import {
  getAvailableTools,
} from "@/lib/tools/catalog";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const MAX_INPUT_BYTES =
  32768;

const MAX_RESULT_BYTES =
  65536;

export async function saveCalculation(
  payload:
    SaveCalculationPayload,
): Promise<SaveCalculationActionResult> {
  const {
    supabase,
    userId,
  } =
    await getRequestAuth();

  if (!userId) {
    return {
      status:
        "unauthenticated",
    };
  }

  const tool =
    getAvailableTools().find(
      (
        candidate,
      ) =>
        candidate.slug ===
        payload.toolSlug,
    );

  if (
    !tool ||
    !tool.href
  ) {
    return {
      status:
        "error",

      message:
        "Nie rozpoznajemy tego kalkulatora.",
    };
  }

  const title =
    normalizeTitle(
      payload.title,
    );

  if (!title) {
    return {
      status:
        "error",

      message:
        "Nadaj zapisowi krótką nazwę.",
    };
  }

  if (
    !Number.isInteger(
      payload.toolVersion,
    ) ||
    payload.toolVersion <
      1 ||
    payload.toolVersion >
      1000
  ) {
    return {
      status:
        "error",

      message:
        "Wersja kalkulatora jest nieprawidłowa.",
    };
  }

  const resultSummary =
    normalizeResultSummary(
      payload.resultSummary,
    );

  if (!resultSummary) {
    return {
      status:
        "error",

      message:
        "Nie udało się przygotować krótkiego podsumowania wyniku.",
    };
  }

  const inputData =
    normalizeJsonPayload(
      payload.inputData,
      MAX_INPUT_BYTES,
    );

  if (
    !inputData.ok
  ) {
    return {
      status:
        "error",

      message:
        inputData.message,
    };
  }

  const resultData =
    normalizeJsonPayload(
      payload.resultData,
      MAX_RESULT_BYTES,
    );

  if (
    !resultData.ok
  ) {
    return {
      status:
        "error",

      message:
        resultData.message,
    };
  }

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "saved_calculations",
      )
      .insert({
        user_id:
          userId,

        tool_slug:
          tool.slug,

        tool_version:
          payload.toolVersion,

        title,

        result_summary:
          resultSummary,

        input_data:
          inputData.value,

        result_data:
          resultData.value,
      })
      .select(
        "id",
      )
      .single();

  if (
    error ||
    !data?.id
  ) {
    return {
      status:
        "error",

      message:
        "Nie udało się zapisać obliczenia. Spróbuj ponownie.",
    };
  }

  revalidatePath(
    "/konto",
  );

  revalidatePath(
    "/konto/obliczenia",
  );

  return {
    status:
      "saved",

    id:
      String(
        data.id,
      ),
  };
}

export async function deleteSavedCalculation(
  formData:
    FormData,
): Promise<void> {
  const {
    supabase,
    userId,
  } =
    await getRequestAuth();

  if (!userId) {
    return;
  }

  const id =
    String(
      formData.get(
        "id",
      ) ??
        "",
    ).trim();

  if (
    !UUID_PATTERN.test(
      id,
    )
  ) {
    throw new Error(
      "Nieprawidłowy identyfikator zapisu.",
    );
  }

  const {
    error,
  } =
    await supabase
      .from(
        "saved_calculations",
      )
      .delete()
      .eq(
        "id",
        id,
      )
      .eq(
        "user_id",
        userId,
      );

  if (error) {
    throw new Error(
      "Nie udało się usunąć zapisanego obliczenia.",
    );
  }

  revalidatePath(
    "/konto",
  );

  revalidatePath(
    "/konto/obliczenia",
  );
}

function normalizeTitle(
  value:
    string,
): string | null {
  const normalized =
    value
      .trim()
      .replace(
        /\s+/g,
        " ",
      );

  if (
    normalized.length <
      1 ||
    normalized.length >
      80
  ) {
    return null;
  }

  return normalized;
}

function normalizeResultSummary(
  value:
    string,
): string | null {
  const normalized =
    value
      .trim()
      .replace(
        /\s+/g,
        " ",
      );

  if (
    normalized.length <
      1 ||
    normalized.length >
      200
  ) {
    return null;
  }

  return normalized;
}

function normalizeJsonPayload(
  value:
    unknown,

  maxBytes:
    number,
):
  | {
      ok: true;
      value: unknown;
    }
  | {
      ok: false;
      message: string;
    } {
  if (
    value ===
      null ||
    typeof value !==
      "object"
  ) {
    return {
      ok:
        false,

      message:
        "Dane obliczenia mają nieprawidłowy format.",
    };
  }

  try {
    const serialized =
      JSON.stringify(
        value,
      );

    if (
      !serialized
    ) {
      return {
        ok:
          false,

        message:
          "Nie udało się przygotować danych do zapisu.",
      };
    }

    const bytes =
      new TextEncoder()
        .encode(
          serialized,
        )
        .byteLength;

    if (
      bytes >
      maxBytes
    ) {
      return {
        ok:
          false,

        message:
          "Ten wynik jest zbyt duży, aby zapisać go w Tecce.",
      };
    }

    return {
      ok:
        true,

      value:
        JSON.parse(
          serialized,
        ) as unknown,
    };
  } catch {
    return {
      ok:
        false,

      message:
        "Nie udało się przygotować danych do zapisu.",
    };
  }
}