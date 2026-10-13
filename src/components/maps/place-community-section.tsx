import Link from "next/link";

import {
  connection,
} from "next/server";

import { PlaceCommunityControls } from "@/components/maps/place-community-controls";

import type {
  PlaceVerdict,
} from "@/lib/maps/community-types";

import { createClient } from "@/lib/supabase/server";

interface PlaceCommunitySectionProps {
  placeId: string;
}

interface ConfirmationRow {
  verdict:
    PlaceVerdict;

  observed_at:
    string;
}

export async function PlaceCommunitySection({
  placeId,
}: PlaceCommunitySectionProps) {
  await connection();

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
    return (
      <section className="rounded-[2rem] border border-line bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
          Społeczność
        </p>

        <h2 className="mt-2 text-xl font-black">
          Chcesz potwierdzić
          informacje?
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          Zaloguj się, aby
          potwierdzić aktualność
          miejsca albo zgłosić
          problem moderatorom.
        </p>

        <Link
          href="/logowanie"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-button bg-brand-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-brand-700"
        >
          Zaloguj się
        </Link>
      </section>
    );
  }

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "place_confirmations",
      )
      .select(
        `
          verdict,
          observed_at
        `,
      )
      .eq(
        "place_id",
        placeId,
      )
      .eq(
        "user_id",
        userId,
      )
      .maybeSingle();

  if (error) {
    throw new Error(
      "Nie udało się pobrać Twojego potwierdzenia.",
    );
  }

  const confirmation =
    data as
      | ConfirmationRow
      | null;

  return (
    <PlaceCommunityControls
      placeId={placeId}
      initialVerdict={
        confirmation?.verdict ??
        null
      }
    />
  );
}