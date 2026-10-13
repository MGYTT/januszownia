import {
  redirect,
} from "next/navigation";

import {
  requireAuthenticatedUser,
} from "@/lib/auth/server-session";

export type StaffRole =
  | "moderator"
  | "admin";

interface StaffProfile {
  role:
    | "user"
    | StaffRole;
}

export async function requireStaff() {
  const {
    supabase,
    userId,
  } =
    await requireAuthenticatedUser();

  const {
    data: profileData,
    error: profileError,
  } =
    await supabase
      .from("profiles")
      .select("role")
      .eq(
        "id",
        userId,
      )
      .single();

  if (
    profileError ||
    !profileData
  ) {
    redirect(
      "/konto",
    );
  }

  const profile =
    profileData as StaffProfile;

  if (
    profile.role !==
      "moderator" &&
    profile.role !==
      "admin"
  ) {
    redirect(
      "/konto?error=Nie+masz+uprawnień+do+panelu+moderacji.",
    );
  }

  return {
    supabase,
    userId,
    role:
      profile.role,
  };
}