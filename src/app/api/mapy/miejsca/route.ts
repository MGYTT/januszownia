import {
  NextResponse,
  type NextRequest,
} from "next/server";

import type {
  MapExplorerPlace,
  MapPlacesApiResponse,
} from "@/lib/maps/explorer-types";

import {
  createPublicClient,
} from "@/lib/supabase/public";

interface PlaceRpcRow {
  id: string;

  category_slug: string;

  category_name: string;

  name: string;

  description:
    string | null;

  address:
    string | null;

  city:
    string | null;

  country_code: string;

  latitude:
    number | string;

  longitude:
    number | string;

  verified_at:
    string | null;

  updated_at: string;
}

const CATEGORY_PATTERN =
  /^[a-z0-9-]{1,60}$/;

const MAX_RESULTS =
  300;

export async function GET(
  request: NextRequest,
) {
  const {
    searchParams,
  } =
    request.nextUrl;

  const minLat =
    readNumber(
      searchParams,
      "minLat",
    );

  const minLong =
    readNumber(
      searchParams,
      "minLong",
    );

  const maxLat =
    readNumber(
      searchParams,
      "maxLat",
    );

  const maxLong =
    readNumber(
      searchParams,
      "maxLong",
    );

  if (
    minLat === null ||
    minLong === null ||
    maxLat === null ||
    maxLong === null
  ) {
    return NextResponse.json(
      {
        error:
          "Nieprawidłowe granice mapy.",
      },
      {
        status:
          400,
      },
    );
  }

  if (
    minLat < -90 ||
    minLat > 90 ||
    maxLat < -90 ||
    maxLat > 90 ||
    minLong < -180 ||
    minLong > 180 ||
    maxLong < -180 ||
    maxLong > 180 ||
    minLat > maxLat ||
    minLong > maxLong
  ) {
    return NextResponse.json(
      {
        error:
          "Granice mapy są poza dozwolonym zakresem.",
      },
      {
        status:
          400,
      },
    );
  }

  const categories =
    parseCategories(
      searchParams.get(
        "categories",
      ),
    );

  const supabase =
    createPublicClient();

  const {
    data,
    error,
  } =
    await supabase.rpc(
      "places_in_view",
      {
        min_lat:
          minLat,

        min_long:
          minLong,

        max_lat:
          maxLat,

        max_long:
          maxLong,

        category_slugs:
          categories.length >
          0
            ? categories
            : null,

        max_results:
          MAX_RESULTS,
      },
    );

  if (error) {
    console.error(
      "Błąd RPC places_in_view:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Nie udało się pobrać miejsc z mapy.",
      },
      {
        status:
          500,
      },
    );
  }

  const rows =
    (
      data ??
      []
    ) as PlaceRpcRow[];

  const places:
    MapExplorerPlace[] =
    rows
      .map(
        parsePlace,
      )
      .filter(
        (
          place,
        ): place is MapExplorerPlace =>
          place !==
          null,
      );

  const response:
    MapPlacesApiResponse = {
      places,

      /*
       * RPC ma limit 300.
       *
       * Jeśli zwrócił dokładnie
       * limit, istnieje możliwość,
       * że w obszarze jest więcej
       * punktów.
       */
      truncated:
        rows.length >=
        MAX_RESULTS,
    };

  return NextResponse.json(
    response,
    {
      headers: {
        "Cache-Control":
          "public, s-maxage=30, stale-while-revalidate=60",
      },
    },
  );
}

function readNumber(
  searchParams:
    URLSearchParams,

  key: string,
): number | null {
  const raw =
    searchParams.get(
      key,
    );

  if (
    raw === null ||
    raw.trim() ===
      ""
  ) {
    return null;
  }

  const value =
    Number(
      raw,
    );

  return Number.isFinite(
    value,
  )
    ? value
    : null;
}

function parseCategories(
  value:
    string | null,
): string[] {
  if (!value) {
    return [];
  }

  return [
    ...new Set(
      value
        .split(",")
        .map(
          (slug) =>
            slug.trim(),
        )
        .filter(
          (slug) =>
            CATEGORY_PATTERN.test(
              slug,
            ),
        ),
    ),
  ].slice(
    0,
    20,
  );
}

function parsePlace(
  row:
    PlaceRpcRow,
): MapExplorerPlace | null {
  const latitude =
    Number(
      row.latitude,
    );

  const longitude =
    Number(
      row.longitude,
    );

  if (
    !Number.isFinite(
      latitude,
    ) ||
    !Number.isFinite(
      longitude,
    )
  ) {
    return null;
  }

  return {
    id:
      row.id,

    categorySlug:
      row.category_slug,

    categoryName:
      row.category_name,

    name:
      row.name,

    description:
      row.description,

    address:
      row.address,

    city:
      row.city,

    countryCode:
      row.country_code,

    latitude,

    longitude,

    verifiedAt:
      row.verified_at,

    updatedAt:
      row.updated_at,
  };
}