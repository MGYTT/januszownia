import {
  cacheLife,
  cacheTag,
} from "next/cache";

import type {
  ReputationCapability,
  ReputationCapabilityCategory,
  ReputationCapabilityStatus,
  ReputationLevelDefinition,
  ReputationLevelIcon,
  ReputationLevelTier,
} from "@/lib/reputation/types";

import {
  createPublicClient,
} from "@/lib/supabase/public";

interface LevelRow {
  id:
    number | string;

  level_order:
    number | string;

  code: string;

  name: string;

  description: string;

  min_cebulions:
    number | string;

  tier:
    ReputationLevelTier;

  icon_key:
    ReputationLevelIcon;
}

interface CapabilityRow {
  capability_key:
    string;

  name: string;

  description: string;

  min_level_order:
    number | string;

  category:
    ReputationCapabilityCategory;

  status:
    ReputationCapabilityStatus;

  icon_key:
    ReputationCapability["iconKey"];

  sort_order:
    number | string;
}

export async function getReputationLevels():
  Promise<ReputationLevelDefinition[]> {
  "use cache";

  cacheLife({
    stale: 3600,
    revalidate: 3600,
    expire: 86400,
  });

  cacheTag(
    "reputation-levels",
  );

  const supabase =
    createPublicClient();

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "reputation_levels",
      )
      .select(
        `
          id,
          level_order,
          code,
          name,
          description,
          min_cebulions,
          tier,
          icon_key
        `,
      )
      .order(
        "level_order",
        {
          ascending: true,
        },
      );

  if (error) {
    throw new Error(
      "Nie udało się pobrać poziomów reputacji.",
    );
  }

  const levels =
    (
      data ??
      []
    ).map(
      (
        rawRow,
      ) => {
        const row =
          rawRow as LevelRow;

        return {
          id:
            Number(
              row.id,
            ),

          order:
            Number(
              row.level_order,
            ),

          code:
            row.code,

          name:
            row.name,

          description:
            row.description,

          minPoints:
            Number(
              row.min_cebulions,
            ),

          tier:
            row.tier,

          iconKey:
            row.icon_key,
        };
      },
    );

  if (
    levels.length ===
    0
  ) {
    throw new Error(
      "Katalog poziomów reputacji jest pusty.",
    );
  }

  return levels;
}

export async function getReputationCapabilities():
  Promise<ReputationCapability[]> {
  "use cache";

  cacheLife({
    stale: 3600,
    revalidate: 3600,
    expire: 86400,
  });

  cacheTag(
    "reputation-capabilities",
  );

  const supabase =
    createPublicClient();

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "reputation_level_capabilities",
      )
      .select(
        `
          capability_key,
          name,
          description,
          min_level_order,
          category,
          status,
          icon_key,
          sort_order
        `,
      )
      .order(
        "sort_order",
        {
          ascending: true,
        },
      );

  if (error) {
    throw new Error(
      "Nie udało się pobrać możliwości poziomów.",
    );
  }

  return (
    data ??
    []
  ).map(
    (
      rawRow,
    ) => {
      const row =
        rawRow as CapabilityRow;

      return {
        key:
          row.capability_key,

        name:
          row.name,

        description:
          row.description,

        minLevelOrder:
          Number(
            row.min_level_order,
          ),

        category:
          row.category,

        status:
          row.status,

        iconKey:
          row.icon_key,

        sortOrder:
          Number(
            row.sort_order,
          ),
      };
    },
  );
}