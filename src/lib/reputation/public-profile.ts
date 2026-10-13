import {
  cacheLife,
  cacheTag,
} from "next/cache";

import {
  type AchievementCategory,
  type AchievementIcon,
  type AchievementRarity,
  type PublicAchievement,
} from "@/lib/reputation/achievements";

import {
  selectTopAchievements,
} from "@/lib/reputation/achievement-ranking";

import {
  getReputationLevels,
} from "@/lib/reputation/level-data";

import {
  getReputationLevel,
} from "@/lib/reputation/levels";

import type {
  ReputationLevel,
} from "@/lib/reputation/types";

import {
  createPublicClient,
} from "@/lib/supabase/public";

export interface PublicJanuszProfile {
  username: string;

  displayName: string;

  cebulions: number;

  approvedPlaces: number;

  validReports: number;

  rewardedActions: number;

  updatedAt: string;

  level:
    ReputationLevel;

  achievements:
    PublicAchievement[];

  featuredAchievements:
    PublicAchievement[];
}

interface PublicProfileRow {
  username: string;

  display_name: string;

  cebulions:
    number | string;

  approved_places:
    number | string;

  valid_reports:
    number | string;

  updated_at: string;
}

interface PublicAchievementRow {
  code: string;

  name: string;

  description: string;

  category:
    AchievementCategory;

  rarity:
    AchievementRarity;

  icon_key:
    AchievementIcon;

  threshold:
    number | string;

  earned_at: string;

  featured_order:
    number | string | null;
}

const USERNAME_PATTERN =
  /^[a-zA-Z0-9_]{3,24}$/;

export async function getPublicProfileByUsername(
  username: string,
): Promise<PublicJanuszProfile | null> {
  "use cache";

  if (
    !USERNAME_PATTERN.test(
      username,
    )
  ) {
    return null;
  }

  cacheLife({
    stale: 30,
    revalidate: 60,
    expire: 300,
  });

  cacheTag(
    `public-profile:${username}`,
  );

  const supabase =
    createPublicClient();

  const [
    profileResult,
    achievementsResult,
    levels,
  ] =
    await Promise.all([
      supabase
        .from(
          "public_profile_cards",
        )
        .select(
          `
            username,
            display_name,
            cebulions,
            approved_places,
            valid_reports,
            updated_at
          `,
        )
        .eq(
          "username",
          username,
        )
        .maybeSingle(),

      supabase
        .from(
          "public_profile_achievements",
        )
        .select(
          `
            code,
            name,
            description,
            category,
            rarity,
            icon_key,
            threshold,
            earned_at,
            featured_order
          `,
        )
        .eq(
          "username",
          username,
        ),

      getReputationLevels(),
    ]);

  if (
    profileResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać publicznego profilu.",
    );
  }

  if (
    achievementsResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać publicznych osiągnięć.",
    );
  }

  if (
    !profileResult.data
  ) {
    return null;
  }

  const row =
    profileResult.data as PublicProfileRow;

  const cebulions =
    Number(
      row.cebulions,
    );

  const approvedPlaces =
    Number(
      row.approved_places,
    );

  const validReports =
    Number(
      row.valid_reports,
    );

  const achievements =
    (
      (
        achievementsResult.data ??
        []
      ) as PublicAchievementRow[]
    ).map(
      (
        achievement,
      ): PublicAchievement => ({
        code:
          achievement.code,

        name:
          achievement.name,

        description:
          achievement.description,

        category:
          achievement.category,

        rarity:
          achievement.rarity,

        iconKey:
          achievement.icon_key,

        threshold:
          Number(
            achievement.threshold,
          ),

        earnedAt:
          achievement.earned_at,

        featuredOrder:
          achievement.featured_order ===
            null
            ? null
            : Number(
                achievement.featured_order,
              ),
      }),
    );

  return {
    username:
      row.username,

    displayName:
      row.display_name,

    cebulions,

    approvedPlaces,

    validReports,

    rewardedActions:
      approvedPlaces +
      validReports,

    updatedAt:
      row.updated_at,

    level:
      getReputationLevel(
        cebulions,
        levels,
      ),

    achievements,

    featuredAchievements:
      selectTopAchievements(
        achievements,
        5,
      ),
  };
}