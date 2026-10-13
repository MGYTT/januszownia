import type {
  SupabaseClient,
} from "@supabase/supabase-js";

import {
  cacheLife,
  cacheTag,
} from "next/cache";

import {
  getReputationLevels,
} from "@/lib/reputation/level-data";

import {
  getReputationLevel,
} from "@/lib/reputation/levels";

import type {
  LeaderboardEntry,
  OwnLeaderboardPosition,
} from "@/lib/reputation/types";

import {
  createPublicClient,
} from "@/lib/supabase/public";

interface LeaderboardRpcRow {
  rank_position:
    number | string;

  display_name:
    string;

  username:
    string | null;

  cebulions:
    number | string;

  public_profile_enabled:
    boolean;

  updated_at:
    string;
}

interface OwnPositionRpcRow {
  rank_position:
    number | string;

  total_participants:
    number | string;

  cebulions:
    number | string;
}

export async function getPublicLeaderboard():
  Promise<LeaderboardEntry[]> {
  "use cache";

  cacheLife({
    stale: 60,
    revalidate: 300,
    expire: 3600,
  });

  cacheTag(
    "reputation-leaderboard",
  );

  const supabase =
    createPublicClient();

  const [
    leaderboardResult,
    levels,
  ] =
    await Promise.all([
      supabase.rpc(
        "reputation_leaderboard_top",
      ),

      getReputationLevels(),
    ]);

  if (
    leaderboardResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać rankingu.",
    );
  }

  return (
    (
      leaderboardResult.data ??
      []
    ) as LeaderboardRpcRow[]
  ).map(
    (row) => {
      const cebulions =
        Number(
          row.cebulions,
        );

      return {
        position:
          Number(
            row.rank_position,
          ),

        displayName:
          row.display_name,

        username:
          row.username,

        cebulions,

        publicProfileEnabled:
          Boolean(
            row.public_profile_enabled,
          ),

        updatedAt:
          row.updated_at,

        level:
          getReputationLevel(
            cebulions,
            levels,
          ),
      };
    },
  );
}

export async function getOwnLeaderboardPosition(
  supabase:
    SupabaseClient,
): Promise<OwnLeaderboardPosition | null> {
  const {
    data,
    error,
  } =
    await supabase
      .rpc(
        "my_reputation_leaderboard_position",
      )
      .maybeSingle();

  if (error) {
    throw new Error(
      "Nie udało się pobrać Twojej pozycji w rankingu.",
    );
  }

  if (!data) {
    return null;
  }

  const row =
    data as OwnPositionRpcRow;

  return {
    position:
      Number(
        row.rank_position,
      ),

    totalParticipants:
      Number(
        row.total_participants,
      ),

    cebulions:
      Number(
        row.cebulions,
      ),
  };
}