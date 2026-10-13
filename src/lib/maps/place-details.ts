import {
  cacheLife,
  cacheTag,
} from "next/cache";

import { createPublicClient } from "@/lib/supabase/public";

export interface PublicPlaceSource {
  id: string;

  source_type:
    | "official"
    | "public_data"
    | "business"
    | "user"
    | "partner";

  label: string;

  source_url:
    string | null;

  observed_at:
    string | null;

  created_at:
    string;
}

export interface PublicPlaceDetails {
  id: string;

  category_id: number;

  category_slug: string;

  category_name: string;

  category_icon: string;

  name: string;

  description:
    string | null;

  address:
    string | null;

  city:
    string | null;

  postal_code:
    string | null;

  country_code: string;

  latitude: number;

  longitude: number;

  verified_at:
    string | null;

  published_at:
    string | null;

  created_at: string;

  updated_at: string;

  sources:
    PublicPlaceSource[];
}

export interface PublicPlaceStats {
  confirmed_total:
    number;

  outdated_total:
    number;

  confirmed_current_window:
    number;

  outdated_current_window:
    number;

  signal_window_start:
    string;

  last_confirmed_at:
    string | null;

  last_outdated_at:
    string | null;
}

export async function getPublicPlaceDetails(
  placeId: string,
): Promise<PublicPlaceDetails | null> {
  "use cache";

  cacheLife(
    "minutes",
  );

  cacheTag(
    `place:${placeId}`,
  );

  const supabase =
    createPublicClient();

  const [
    placeResult,
    sourcesResult,
  ] =
    await Promise.all([
      supabase
        .rpc(
          "public_place_detail",
          {
            p_place_id:
              placeId,
          },
        )
        .maybeSingle(),

      supabase
        .from(
          "place_sources",
        )
        .select(
          `
            id,
            source_type,
            label,
            source_url,
            observed_at,
            created_at
          `,
        )
        .eq(
          "place_id",
          placeId,
        )
        .order(
          "observed_at",
          {
            ascending:
              false,

            nullsFirst:
              false,
          },
        ),
    ]);

  if (
    placeResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać miejsca.",
    );
  }

  if (
    !placeResult.data
  ) {
    return null;
  }

  if (
    sourcesResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać źródeł miejsca.",
    );
  }

  return {
    ...(placeResult.data as Omit<
      PublicPlaceDetails,
      "sources"
    >),

    sources:
      (sourcesResult.data ??
        []) as PublicPlaceSource[],
  };
}

export async function getPublicPlaceStats(
  placeId: string,
): Promise<PublicPlaceStats | null> {
  "use cache";

  cacheLife({
    stale: 30,
    revalidate: 60,
    expire: 300,
  });

  cacheTag(
    `place-stats:${placeId}`,
  );

  const supabase =
    createPublicClient();

  const {
    data,
    error,
  } =
    await supabase
      .rpc(
        "public_place_stats",
        {
          p_place_id:
            placeId,
        },
      )
      .maybeSingle();

  if (error) {
    throw new Error(
      "Nie udało się pobrać statystyk miejsca.",
    );
  }

  if (!data) {
    return null;
  }

  return data as PublicPlaceStats;
}