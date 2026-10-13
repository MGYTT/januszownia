import type {
  SupabaseClient,
} from "@supabase/supabase-js";

import type {
  AchievementCategory,
  AchievementDashboard,
  AchievementDefinition,
  AchievementIcon,
  AchievementMetric,
  AchievementProgress,
  AchievementRarity,
} from "@/lib/reputation/achievements";

interface DefinitionRow {
  id: number | string;

  code: string;

  name: string;

  description: string;

  category:
    AchievementCategory;

  metric:
    AchievementMetric;

  threshold:
    number | string;

  rarity:
    AchievementRarity;

  icon_key:
    AchievementIcon;

  sort_order:
    number | string;
}

interface LedgerRow {
  event_type:
    | "place_approved"
    | "valid_report";

  points:
    number | string;
}

interface EarnedRow {
  achievement_id:
    number | string;

  earned_at:
    string;
}

interface ShowcaseRow {
  achievement_id:
    number | string;

  slot:
    number | string;
}

export async function getOwnAchievementDashboard(
  supabase:
    SupabaseClient,

  userId: string,
): Promise<AchievementDashboard> {
  const [
    definitionsResult,
    ledgerResult,
    earnedResult,
    showcaseResult,
  ] =
    await Promise.all([
      supabase
        .from(
          "achievement_definitions",
        )
        .select(
          `
            id,
            code,
            name,
            description,
            category,
            metric,
            threshold,
            rarity,
            icon_key,
            sort_order
          `,
        )
        .order(
          "sort_order",
          {
            ascending: true,
          },
        ),

      supabase
        .from(
          "reputation_ledger",
        )
        .select(
          `
            event_type,
            points
          `,
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
          `
            achievement_id,
            earned_at
          `,
        )
        .eq(
          "user_id",
          userId,
        ),

      supabase
        .from(
          "achievement_showcase",
        )
        .select(
          `
            achievement_id,
            slot
          `,
        )
        .eq(
          "user_id",
          userId,
        ),
    ]);

  if (
    definitionsResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać katalogu osiągnięć.",
    );
  }

  if (
    ledgerResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać postępu osiągnięć.",
    );
  }

  if (
    earnedResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać zdobytych osiągnięć.",
    );
  }

  if (
    showcaseResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać gabloty osiągnięć.",
    );
  }

  const definitions =
    (
      definitionsResult.data ??
      []
    ).map(
      (row) => {
        const definition =
          row as DefinitionRow;

        return {
          id:
            Number(
              definition.id,
            ),

          code:
            definition.code,

          name:
            definition.name,

          description:
            definition.description,

          category:
            definition.category,

          metric:
            definition.metric,

          threshold:
            Number(
              definition.threshold,
            ),

          rarity:
            definition.rarity,

          iconKey:
            definition.icon_key,

          sortOrder:
            Number(
              definition.sort_order,
            ),
        };
      },
    ) as AchievementDefinition[];

  const ledger =
    (
      ledgerResult.data ??
      []
    ) as LedgerRow[];

  const approvedPlaces =
    ledger.filter(
      (entry) =>
        entry.event_type ===
        "place_approved",
    ).length;

  const validReports =
    ledger.filter(
      (entry) =>
        entry.event_type ===
        "valid_report",
    ).length;

  const cebulions =
    ledger.reduce(
      (
        total,
        entry,
      ) =>
        total +
        Number(
          entry.points,
        ),
      0,
    );

  const rewardedActions =
    ledger.length;

  const balancedContributions =
    Math.min(
      approvedPlaces,
      validReports,
    );

  const earnedMap =
    new Map<
      number,
      string
    >();

  for (
    const rawRow
    of (
      earnedResult.data ??
      []
    ) as EarnedRow[]
  ) {
    earnedMap.set(
      Number(
        rawRow.achievement_id,
      ),
      rawRow.earned_at,
    );
  }

  const showcaseMap =
    new Map<
      number,
      number
    >();

  for (
    const rawRow
    of (
      showcaseResult.data ??
      []
    ) as ShowcaseRow[]
  ) {
    showcaseMap.set(
      Number(
        rawRow.achievement_id,
      ),
      Number(
        rawRow.slot,
      ),
    );
  }

  const achievements =
    definitions.map(
      (
        definition,
      ): AchievementProgress => {
        const currentValue =
          metricValue(
            definition.metric,
            {
              approvedPlaces,
              validReports,
              cebulions,
              rewardedActions,
              balancedContributions,
            },
          );

        return {
          ...definition,

          currentValue,

          progressPercent:
            Math.max(
              0,
              Math.min(
                100,
                Math.round(
                  (
                    currentValue /
                    definition.threshold
                  ) *
                    100,
                ),
              ),
            ),

          earnedAt:
            earnedMap.get(
              definition.id,
            ) ??
            null,

          featuredOrder:
            showcaseMap.get(
              definition.id,
            ) ??
            null,
        };
      },
    );

  return {
    totalCount:
      achievements.length,

    unlockedCount:
      achievements.filter(
        (achievement) =>
          achievement.earnedAt !==
          null,
      ).length,

    featuredCount:
      showcaseMap.size,

    achievements,
  };
}

function metricValue(
  metric:
    AchievementMetric,

  values: {
    approvedPlaces: number;
    validReports: number;
    cebulions: number;
    rewardedActions: number;
    balancedContributions: number;
  },
): number {
  switch (metric) {
    case "approved_places":
      return values.approvedPlaces;

    case "valid_reports":
      return values.validReports;

    case "cebulions":
      return values.cebulions;

    case "rewarded_actions":
      return values.rewardedActions;

    case "balanced_contributions":
      return values.balancedContributions;
  }
}