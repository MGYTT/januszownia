import "server-only";

import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

let publicClient:
  SupabaseClient | null =
    null;

export function createPublicClient():
  SupabaseClient {
  if (publicClient) {
    return publicClient;
  }

  const url =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const publishableKey =
    process.env
      .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url) {
    throw new Error(
      "Brakuje NEXT_PUBLIC_SUPABASE_URL.",
    );
  }

  if (!publishableKey) {
    throw new Error(
      "Brakuje NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  publicClient =
    createClient(
      url,
      publishableKey,
      {
        auth: {
          persistSession: false,

          autoRefreshToken:
            false,

          detectSessionInUrl:
            false,
        },
      },
    );

  return publicClient;
}