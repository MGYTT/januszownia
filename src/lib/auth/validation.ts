export interface AuthValidationResult {
  valid: boolean;
  message?: string;
}

export function normalizeEmail(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase();
}

export function normalizeDisplayName(
  value: string,
): string {
  return value.trim();
}

export function normalizeUsername(
  value: string,
): string | null {
  const normalized =
    value.trim();

  return normalized.length > 0
    ? normalized
    : null;
}

/*
 * Celowo NIE używamy trim().
 *
 * Jeżeli użytkownik ustawi:
 *
 * " moje hasło "
 *
 * spacje są częścią hasła.
 */
export function normalizePassword(
  value: string,
): string {
  return value;
}

export function validateEmail(
  value: string,
): AuthValidationResult {
  if (
    value.length < 3 ||
    value.length > 254
  ) {
    return {
      valid: false,
      message:
        "Podaj poprawny adres e-mail.",
    };
  }

  /*
   * Nie próbujemy implementować
   * całego RFC 5322.
   *
   * Pełną walidację wykonuje
   * również Supabase Auth.
   */
  if (
    !value.includes("@")
  ) {
    return {
      valid: false,
      message:
        "Podaj poprawny adres e-mail.",
    };
  }

  return {
    valid: true,
  };
}

export function validatePassword(
  value: string,
): AuthValidationResult {
  /*
   * Liczymy dokładnie to,
   * co użytkownik wpisał.
   *
   * Żadnego trim().
   */
  if (
    value.length < 8
  ) {
    return {
      valid: false,
      message:
        "Hasło musi mieć co najmniej 8 znaków.",
    };
  }

  if (
    value.length > 128
  ) {
    return {
      valid: false,
      message:
        "Hasło może mieć maksymalnie 128 znaków.",
    };
  }

  return {
    valid: true,
  };
}

export function validateDisplayName(
  value: string,
): AuthValidationResult {
  if (
    value.length < 2 ||
    value.length > 60
  ) {
    return {
      valid: false,
      message:
        "Nazwa wyświetlana musi mieć od 2 do 60 znaków.",
    };
  }

  return {
    valid: true,
  };
}

export function validateUsername(
  value: string | null,
): AuthValidationResult {
  if (value === null) {
    return {
      valid: true,
    };
  }

  if (
    !/^[a-zA-Z0-9_]{3,24}$/.test(
      value,
    )
  ) {
    return {
      valid: false,
      message:
        "Nick musi mieć 3–24 znaki i może zawierać tylko litery, cyfry oraz _.",
    };
  }

  return {
    valid: true,
  };
}