import type {
  SupabaseClient,
} from "@supabase/supabase-js";

import {
  getReputationLevels,
} from "@/lib/reputation/level-data";

import {
  getReputationLevel,
} from "@/lib/reputation/levels";

import type {
  ReputationLedgerEntry,
  UserReputation,
} from "@/lib/reputation/types";

interface ReputationAccountRow {
  cebulions: number;

  rewarded_actions:
    number;
}

export async function getUserReputation(
  supabase:
    SupabaseClient,

  userId: string,
): Promise<UserReputation> {
  const [
    accountResult,
    ledgerResult,
    levels,
  ] =
    await Promise.all([
      supabase
        .from(
          "reputation_accounts",
        )
        .select(
          `
            cebulions,
            rewarded_actions
          `,
        )
        .eq(
          "user_id",
          userId,
        )
        .maybeSingle(),

      supabase
        .from(
          "reputation_ledger",
        )
        .select(
          `
            id,
            event_type,
            points,
            source_id,
            created_at
          `,
        )
        .eq(
          "user_id",
          userId,
        )
        .order(
          "created_at",
          {
            ascending:
              false,
          },
        )
        .limit(
          8,
        ),

      getReputationLevels(),
    ]);

  if (
    accountResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać salda Cebulionów.",
    );
  }

  if (
    ledgerResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać historii Cebulionów.",
    );
  }

  const account =
    accountResult.data as
      | ReputationAccountRow
      | null;

  const cebulions =
    Number(
      account?.cebulions ??
        0,
    );

  const rewardedActions =
    Number(
      account?.rewarded_actions ??
        0,
    );

  const recentEntries =
    (
      ledgerResult.data ??
      []
    ).map(
      (entry) => ({
        ...entry,

        points:
          Number(
            entry.points,
          ),
      }),
    ) as ReputationLedgerEntry[];

  return {
    cebulions,

    rewardedActions,

    level:
      getReputationLevel(
        cebulions,
        levels,
      ),

    recentEntries,
  };
}