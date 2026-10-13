"use server";

import {
  revalidatePath,
  updateTag,
} from "next/cache";

import {
  redirect,
} from "next/navigation";

import {
  normalizeDisplayName,
  normalizeEmail,
  normalizePassword,
  normalizeUsername,
  validateDisplayName,
  validateEmail,
  validatePassword,
  validateUsername,
} from "@/lib/auth/validation";

import {
  createClient,
} from "@/lib/supabase/server";

function trimmedTextValue(
  formData: FormData,
  name: string,
): string {
  const value =
    formData.get(name);

  return typeof value === "string"
    ? value.trim()
    : "";
}

function rawTextValue(
  formData: FormData,
  name: string,
): string {
  const value =
    formData.get(name);

  return typeof value === "string"
    ? value
    : "";
}

function redirectWithParam(
  path: string,
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
    `${path}?${params.toString()}`,
  );
}

export async function signIn(
  formData: FormData,
) {
  const email =
    normalizeEmail(
      trimmedTextValue(
        formData,
        "email",
      ),
    );

  const password =
    normalizePassword(
      rawTextValue(
        formData,
        "password",
      ),
    );

  const emailValidation =
    validateEmail(
      email,
    );

  if (
    !emailValidation.valid
  ) {
    redirectWithParam(
      "/logowanie",
      "error",
      emailValidation.message ??
        "Nieprawidłowy e-mail.",
    );
  }

  const passwordValidation =
    validatePassword(
      password,
    );

  if (
    !passwordValidation.valid
  ) {
    redirectWithParam(
      "/logowanie",
      "error",
      passwordValidation.message ??
        "Nieprawidłowe hasło.",
    );
  }

  const supabase =
    await createClient();

  const {
    error,
  } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    redirectWithParam(
      "/logowanie",
      "error",
      "Nieprawidłowy e-mail lub hasło.",
    );
  }

  revalidatePath(
    "/",
    "layout",
  );

  redirect(
    "/konto",
  );
}

export async function signUp(
  formData: FormData,
) {
  const displayName =
    normalizeDisplayName(
      trimmedTextValue(
        formData,
        "displayName",
      ),
    );

  const email =
    normalizeEmail(
      trimmedTextValue(
        formData,
        "email",
      ),
    );

  const password =
    normalizePassword(
      rawTextValue(
        formData,
        "password",
      ),
    );

  const passwordConfirm =
    normalizePassword(
      rawTextValue(
        formData,
        "passwordConfirm",
      ),
    );

  const displayNameValidation =
    validateDisplayName(
      displayName,
    );

  if (
    !displayNameValidation.valid
  ) {
    redirectWithParam(
      "/rejestracja",
      "error",
      displayNameValidation.message ??
        "Nieprawidłowa nazwa.",
    );
  }

  const emailValidation =
    validateEmail(
      email,
    );

  if (
    !emailValidation.valid
  ) {
    redirectWithParam(
      "/rejestracja",
      "error",
      emailValidation.message ??
        "Nieprawidłowy e-mail.",
    );
  }

  const passwordValidation =
    validatePassword(
      password,
    );

  if (
    !passwordValidation.valid
  ) {
    redirectWithParam(
      "/rejestracja",
      "error",
      passwordValidation.message ??
        "Nieprawidłowe hasło.",
    );
  }

  if (
    password !==
    passwordConfirm
  ) {
    redirectWithParam(
      "/rejestracja",
      "error",
      "Hasła nie są identyczne.",
    );
  }

  const supabase =
    await createClient();

  const {
    data,
    error,
  } =
    await supabase.auth.signUp({
      email,
      password,

      options: {
        data: {
          display_name:
            displayName,
        },
      },
    });

  if (error) {
    console.error(
      "Błąd rejestracji Supabase:",
      error,
    );

    redirectWithParam(
      "/rejestracja",
      "error",
      "Nie udało się utworzyć konta. Sprawdź dane lub spróbuj ponownie.",
    );
  }

  if (!data.session) {
    redirectWithParam(
      "/logowanie",
      "message",
      "Konto zostało utworzone. Sprawdź skrzynkę e-mail i potwierdź adres.",
    );
  }

  revalidatePath(
    "/",
    "layout",
  );

  redirect(
    "/konto",
  );
}

export async function signOut() {
  const supabase =
    await createClient();

  const {
    error,
  } =
    await supabase.auth.signOut();

  if (error) {
    console.error(
      "Błąd wylogowania Supabase:",
      error,
    );
  }

  revalidatePath(
    "/",
    "layout",
  );

  redirect(
    "/",
  );
}

export async function updateProfile(
  formData: FormData,
) {
  const displayName =
    normalizeDisplayName(
      trimmedTextValue(
        formData,
        "displayName",
      ),
    );

  const username =
    normalizeUsername(
      trimmedTextValue(
        formData,
        "username",
      ),
    );

  const displayNameValidation =
    validateDisplayName(
      displayName,
    );

  if (
    !displayNameValidation.valid
  ) {
    redirectWithParam(
      "/konto",
      "error",
      displayNameValidation.message ??
        "Nieprawidłowa nazwa.",
    );
  }

  const usernameValidation =
    validateUsername(
      username,
    );

  if (
    !usernameValidation.valid
  ) {
    redirectWithParam(
      "/konto",
      "error",
      usernameValidation.message ??
        "Nieprawidłowy nick.",
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

  const {
    data: existingProfile,
  } =
    await supabase
      .from(
        "profiles",
      )
      .select(
        "username",
      )
      .eq(
        "id",
        userId,
      )
      .maybeSingle();

  const oldUsername =
    typeof existingProfile?.username ===
      "string"
      ? existingProfile.username
      : null;

  const {
    error,
  } =
    await supabase
      .from(
        "profiles",
      )
      .update({
        display_name:
          displayName,

        username,
      })
      .eq(
        "id",
        userId,
      );

  if (error) {
    console.error(
      "Błąd aktualizacji profilu:",
      error,
    );

    if (
      error.code ===
      "23505"
    ) {
      redirectWithParam(
        "/konto",
        "error",
        "Ten nick jest już zajęty.",
      );
    }

    redirectWithParam(
      "/konto",
      "error",
      "Nie udało się zapisać profilu.",
    );
  }

  if (oldUsername) {
    updateTag(
      `public-profile:${oldUsername}`,
    );
  }

  if (username) {
    updateTag(
      `public-profile:${username}`,
    );
  }

  updateTag(
    "reputation-leaderboard",
  );

  revalidatePath(
    "/konto",
  );

  revalidatePath(
    "/konto/publiczny-profil",
  );

  revalidatePath(
    "/ranking",
  );

  redirectWithParam(
    "/konto",
    "message",
    "Profil został zapisany.",
  );
}