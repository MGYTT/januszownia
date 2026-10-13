import {
  validateLatitude,
  validateLongitude,
} from "@/lib/maps/validation";

export interface ModerationValidationResult {
  valid: boolean;
  message?: string;
}

export interface PlaceCorrectionInput {
  categoryId: number;

  name: string;

  description:
    string | null;

  latitude: number;

  longitude: number;

  address:
    string | null;

  city:
    string | null;

  postalCode:
    string | null;

  countryCode:
    string;

  note:
    string | null;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validateSubmissionId(
  value: string,
): ModerationValidationResult {
  return validateUuid(
    value,
    "Nieprawidłowy identyfikator zgłoszenia.",
  );
}

export function validateReportId(
  value: string,
): ModerationValidationResult {
  return validateUuid(
    value,
    "Nieprawidłowy identyfikator raportu.",
  );
}

export function normalizeModeratorNote(
  value: string,
): string | null {
  const normalized =
    value.trim();

  return normalized.length > 0
    ? normalized
    : null;
}

export function validateModeratorNote(
  value: string,
): ModerationValidationResult {
  const normalized =
    value.trim();

  if (
    normalized.length >
    1000
  ) {
    return {
      valid: false,

      message:
        "Notatka moderatora może mieć maksymalnie 1000 znaków.",
    };
  }

  return {
    valid: true,
  };
}

export function validateDismissNote(
  value: string,
): ModerationValidationResult {
  const normalized =
    value.trim();

  if (
    normalized.length < 3
  ) {
    return {
      valid: false,

      message:
        "Przy odrzuceniu zgłoszenia podaj krótkie uzasadnienie.",
    };
  }

  return validateModeratorNote(
    normalized,
  );
}

export function validatePlaceCorrection(
  input: PlaceCorrectionInput,
): ModerationValidationResult {
  if (
    !Number.isInteger(
      input.categoryId,
    ) ||
    input.categoryId <= 0
  ) {
    return {
      valid: false,

      message:
        "Wybierz poprawną kategorię.",
    };
  }

  const name =
    input.name.trim();

  if (
    name.length < 2 ||
    name.length > 120
  ) {
    return {
      valid: false,

      message:
        "Nazwa miejsca musi mieć od 2 do 120 znaków.",
    };
  }

  if (
    input.description &&
    input.description.length >
      2000
  ) {
    return {
      valid: false,

      message:
        "Opis może mieć maksymalnie 2000 znaków.",
    };
  }

  if (
    input.address &&
    input.address.length >
      200
  ) {
    return {
      valid: false,

      message:
        "Adres może mieć maksymalnie 200 znaków.",
    };
  }

  if (
    input.city &&
    input.city.length >
      100
  ) {
    return {
      valid: false,

      message:
        "Nazwa miasta może mieć maksymalnie 100 znaków.",
    };
  }

  if (
    input.postalCode &&
    input.postalCode.length >
      20
  ) {
    return {
      valid: false,

      message:
        "Kod pocztowy może mieć maksymalnie 20 znaków.",
    };
  }

  if (
    !/^[A-Z]{2}$/.test(
      input.countryCode,
    )
  ) {
    return {
      valid: false,

      message:
        "Kod kraju musi składać się z dwóch liter.",
    };
  }

  const latitudeValidation =
    validateLatitude(
      input.latitude,
    );

  if (
    !latitudeValidation.valid
  ) {
    return latitudeValidation;
  }

  const longitudeValidation =
    validateLongitude(
      input.longitude,
    );

  if (
    !longitudeValidation.valid
  ) {
    return longitudeValidation;
  }

  if (
    input.note &&
    input.note.length >
      1000
  ) {
    return {
      valid: false,

      message:
        "Notatka moderatora może mieć maksymalnie 1000 znaków.",
    };
  }

  return {
    valid: true,
  };
}

function validateUuid(
  value: string,
  message: string,
): ModerationValidationResult {
  if (
    !UUID_PATTERN.test(
      value,
    )
  ) {
    return {
      valid: false,
      message,
    };
  }

  return {
    valid: true,
  };
}