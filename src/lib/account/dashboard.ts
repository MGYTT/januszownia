import type {
  SupabaseClient,
} from "@supabase/supabase-js";

import {
  getUnreadNotificationCount,
} from "@/lib/notifications/data";

export interface AccountDashboardSummary {
  collectionsCount: number;
  savedPlaceEntriesCount: number;

  unlockedAchievementsCount: number;
  totalAchievementsCount: number;

  unreadNotificationsCount: number;

  placeSubmissionsCount: number;
  placeReportsCount: number;

  showPublicProfile: boolean;
  showInLeaderboard: boolean;
}

interface PreferenceRow {
  show_public_profile:
    boolean;

  show_in_leaderboard:
    boolean;
}

export async function getAccountDashboardSummary(
  supabase:
    SupabaseClient,

  userId:
    string,
): Promise<AccountDashboardSummary> {
  const [
    collectionsResult,
    savedPlacesResult,
    achievementsResult,
    achievementDefinitionsResult,
    submissionsResult,
    reportsResult,
    preferenceResult,
    unreadNotificationsCount,
  ] =
    await Promise.all([
      supabase
        .from(
          "place_collections",
        )
        .select(
          "id",
          {
            count:
              "exact",

            head:
              true,
          },
        )
        .eq(
          "user_id",
          userId,
        ),

      supabase
        .from(
          "place_collection_items",
        )
        .select(
          "place_id",
          {
            count:
              "exact",

            head:
              true,
          },
        )
        .eq(
          "user_id",
          userId,
        ),

      supabase
        .from(
          "user_achievements",
        )
        .select(
          "achievement_id",
          {
            count:
              "exact",

            head:
              true,
          },
        )
        .eq(
          "user_id",
          userId,
        ),

      supabase
        .from(
          "achievement_definitions",
        )
        .select(
          "id",
          {
            count:
              "exact",

            head:
              true,
          },
        )
        .eq(
          "is_active",
          true,
        ),

      supabase
        .from(
          "place_submissions",
        )
        .select(
          "id",
          {
            count:
              "exact",

            head:
              true,
          },
        )
        .eq(
          "user_id",
          userId,
        ),

      supabase
        .from(
          "place_reports",
        )
        .select(
          "id",
          {
            count:
              "exact",

            head:
              true,
          },
        )
        .eq(
          "reporter_id",
          userId,
        ),

      supabase
        .from(
          "reputation_preferences",
        )
        .select(
          `
            show_public_profile,
            show_in_leaderboard
          `,
        )
        .eq(
          "user_id",
          userId,
        )
        .maybeSingle(),

      getUnreadNotificationCount(
        supabase,
      ),
    ]);

  if (
    collectionsResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać liczby kolekcji.",
    );
  }

  if (
    savedPlacesResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać liczby zapisów miejsc.",
    );
  }

  if (
    achievementsResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać liczby zdobytych osiągnięć.",
    );
  }

  if (
    achievementDefinitionsResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać liczby osiągnięć.",
    );
  }

  if (
    submissionsResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać liczby zgłoszonych miejsc.",
    );
  }

  if (
    reportsResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać liczby zgłoszeń problemów.",
    );
  }

  if (
    preferenceResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać ustawień widoczności.",
    );
  }

  const preference =
    preferenceResult.data as
      | PreferenceRow
      | null;

  return {
    collectionsCount:
      collectionsResult.count ??
      0,

    savedPlaceEntriesCount:
      savedPlacesResult.count ??
      0,

    unlockedAchievementsCount:
      achievementsResult.count ??
      0,

    totalAchievementsCount:
      achievementDefinitionsResult.count ??
      0,

    unreadNotificationsCount,

    placeSubmissionsCount:
      submissionsResult.count ??
      0,

    placeReportsCount:
      reportsResult.count ??
      0,

    showPublicProfile:
      Boolean(
        preference
          ?.show_public_profile,
      ),

    showInLeaderboard:
      Boolean(
        preference
          ?.show_in_leaderboard,
      ),
  };
}