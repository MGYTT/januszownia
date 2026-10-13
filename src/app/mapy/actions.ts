"use server";

import {
  redirect,
} from "next/navigation";

import {
  normalizeOptionalText,
  validateCountryCode,
  validateHttpUrl,
  validateLatitude,
  validateLongitude,
  validateOptionalLength,
  validatePlaceName,
} from "@/lib/maps/validation";

import {
  createClient,
} from "@/lib/supabase/server";

function textValue(
  formData: FormData,
  name: string,
): string {
  const value =
    formData.get(name);

  return typeof value === "string"
    ? value
    : "";
}

function numberValue(
  formData: FormData,
  name: string,
): number {
  const raw =
    textValue(
      formData,
      name,
    )
      .trim()
      .replace(
        ",",
        ".",
      );

  if (raw.length === 0) {
    return Number.NaN;
  }

  return Number(raw);
}

function redirectWithError(
  message: string,
): never {
  const params =
    new URLSearchParams();

  params.set(
    "error",
    message,
  );

  redirect(
    `/mapy/dodaj?${params.toString()}`,
  );
}

function redirectWithMessage(
  message: string,
): never {
  const params =
    new URLSearchParams();

  params.set(
    "message",
    message,
  );

  redirect(
    `/mapy/dodaj?${params.toString()}`,
  );
}

export async function submitPlace(
  formData: FormData,
) {
  const categoryId =
    Number(
      textValue(
        formData,
        "categoryId",
      ),
    );

  const name =
    textValue(
      formData,
      "name",
    ).trim();

  const description =
    normalizeOptionalText(
      textValue(
        formData,
        "description",
      ),
    );

  const address =
    normalizeOptionalText(
      textValue(
        formData,
        "address",
      ),
    );

  const city =
    normalizeOptionalText(
      textValue(
        formData,
        "city",
      ),
    );

  const postalCode =
    normalizeOptionalText(
      textValue(
        formData,
        "postalCode",
      ),
    );

  const countryCode =
    textValue(
      formData,
      "countryCode",
    )
      .trim()
      .toUpperCase();

  const sourceLabel =
    normalizeOptionalText(
      textValue(
        formData,
        "sourceLabel",
      ),
    );

  const sourceUrl =
    normalizeOptionalText(
      textValue(
        formData,
        "sourceUrl",
      ),
    );

  /*
   * Jedna nazwa pól w całej aplikacji:
   *
   * latitude
   * longitude
   */
  const latitude =
    numberValue(
      formData,
      "latitude",
    );

  const longitude =
    numberValue(
      formData,
      "longitude",
    );

  if (
    !Number.isInteger(
      categoryId,
    ) ||
    categoryId <= 0
  ) {
    redirectWithError(
      "Wybierz poprawną kategorię.",
    );
  }

  const nameValidation =
    validatePlaceName(
      name,
    );

  if (
    !nameValidation.valid
  ) {
    redirectWithError(
      nameValidation.message ??
        "Nieprawidłowa nazwa miejsca.",
    );
  }

  const latitudeValidation =
    validateLatitude(
      latitude,
    );

  if (
    !latitudeValidation.valid
  ) {
    redirectWithError(
      latitudeValidation.message ??
        "Nieprawidłowa lokalizacja.",
    );
  }

  const longitudeValidation =
    validateLongitude(
      longitude,
    );

  if (
    !longitudeValidation.valid
  ) {
    redirectWithError(
      longitudeValidation.message ??
        "Nieprawidłowa lokalizacja.",
    );
  }

  const countryValidation =
    validateCountryCode(
      countryCode,
    );

  if (
    !countryValidation.valid
  ) {
    redirectWithError(
      countryValidation.message ??
        "Nieprawidłowy kod kraju.",
    );
  }

  const lengthChecks = [
    validateOptionalLength(
      description,
      2000,
      "Opis",
    ),

    validateOptionalLength(
      address,
      200,
      "Adres",
    ),

    validateOptionalLength(
      city,
      100,
      "Miasto",
    ),

    validateOptionalLength(
      postalCode,
      20,
      "Kod pocztowy",
    ),

    validateOptionalLength(
      sourceLabel,
      120,
      "Nazwa źródła",
    ),
  ];

  const failedLengthCheck =
    lengthChecks.find(
      (result) =>
        !result.valid,
    );

  if (failedLengthCheck) {
    redirectWithError(
      failedLengthCheck.message ??
        "Jedno z pól jest zbyt długie.",
    );
  }

  const urlValidation =
    validateHttpUrl(
      sourceUrl,
    );

  if (!urlValidation.valid) {
    redirectWithError(
      urlValidation.message ??
        "Nieprawidłowy adres źródła.",
    );
  }

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
    redirect(
      "/logowanie",
    );
  }

  /*
   * Nie ufamy categoryId pochodzącemu
   * z formularza.
   *
   * Sprawdzamy, czy kategoria nadal
   * istnieje i jest aktywna.
   */
  const {
    data: category,
    error: categoryError,
  } =
    await supabase
      .from(
        "place_categories",
      )
      .select(
        "id",
      )
      .eq(
        "id",
        categoryId,
      )
      .eq(
        "is_active",
        true,
      )
      .maybeSingle();

  if (
    categoryError ||
    !category
  ) {
    redirectWithError(
      "Wybrana kategoria nie jest dostępna.",
    );
  }

  /*
   * PostGIS:
   *
   * POINT(longitude latitude)
   *
   * Kolejność jest celowo odwrotna
   * względem zwyczajowego lat/lng.
   */
  const location =
    `POINT(${longitude} ${latitude})`;

  const {
    error: insertError,
  } =
    await supabase
      .from(
        "place_submissions",
      )
      .insert({
        user_id:
          userId,

        category_id:
          categoryId,

        name,

        description,

        location,

        address,

        city,

        postal_code:
          postalCode,

        country_code:
          countryCode,

        source_label:
          sourceLabel,

        source_url:
          sourceUrl,
      });

  if (insertError) {
    console.error(
      "Nie udało się zapisać zgłoszenia miejsca:",
      insertError,
    );

    redirectWithError(
      "Nie udało się wysłać zgłoszenia. Spróbuj ponownie.",
    );
  }

  redirectWithMessage(
    "Miejsce zostało wysłane do weryfikacji.",
  );
}