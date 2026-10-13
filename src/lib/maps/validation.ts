export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export function validateLatitude(
  value: number,
): ValidationResult {
  if (!Number.isFinite(value)) {
    return {
      valid: false,
      message:
        "Szerokość geograficzna musi być liczbą.",
    };
  }

  if (
    value < -90 ||
    value > 90
  ) {
    return {
      valid: false,
      message:
        "Szerokość geograficzna musi mieścić się w zakresie od -90 do 90.",
    };
  }

  return {
    valid: true,
  };
}

export function validateLongitude(
  value: number,
): ValidationResult {
  if (!Number.isFinite(value)) {
    return {
      valid: false,
      message:
        "Długość geograficzna musi być liczbą.",
    };
  }

  if (
    value < -180 ||
    value > 180
  ) {
    return {
      valid: false,
      message:
        "Długość geograficzna musi mieścić się w zakresie od -180 do 180.",
    };
  }

  return {
    valid: true,
  };
}

export function validatePlaceName(
  value: string,
): ValidationResult {
  const normalized =
    value.trim();

  if (
    normalized.length < 2 ||
    normalized.length > 120
  ) {
    return {
      valid: false,
      message:
        "Nazwa miejsca musi mieć od 2 do 120 znaków.",
    };
  }

  return {
    valid: true,
  };
}

export function validateCountryCode(
  value: string,
): ValidationResult {
  if (
    !/^[A-Z]{2}$/.test(
      value,
    )
  ) {
    return {
      valid: false,
      message:
        "Kod kraju musi składać się z dwóch liter.",
    };
  }

  return {
    valid: true,
  };
}

export function validateOptionalLength(
  value: string | null,
  maxLength: number,
  fieldName: string,
): ValidationResult {
  if (
    value !== null &&
    value.length > maxLength
  ) {
    return {
      valid: false,
      message:
        `${fieldName} może mieć maksymalnie ${maxLength} znaków.`,
    };
  }

  return {
    valid: true,
  };
}

export function normalizeOptionalText(
  value: string,
): string | null {
  const normalized =
    value.trim();

  return normalized.length > 0
    ? normalized
    : null;
}

export function validateHttpUrl(
  value: string | null,
): ValidationResult {
  if (!value) {
    return {
      valid: true,
    };
  }

  if (
    value.length > 1000
  ) {
    return {
      valid: false,
      message:
        "Adres źródła jest zbyt długi.",
    };
  }

  try {
    const url =
      new URL(value);

    if (
      url.protocol !== "http:" &&
      url.protocol !== "https:"
    ) {
      return {
        valid: false,
        message:
          "Adres źródła musi zaczynać się od http:// lub https://.",
      };
    }

    return {
      valid: true,
    };
  } catch {
    return {
      valid: false,
      message:
        "Podany adres źródła nie jest poprawnym adresem URL.",
    };
  }
}