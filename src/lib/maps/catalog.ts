import {
  cacheLife,
  cacheTag,
} from "next/cache";

import type {
  MapCategory,
  MapCategoryIcon,
  MapExplorerPlace,
} from "@/lib/maps/explorer-types";

import {
  createPublicClient,
} from "@/lib/supabase/public";

interface CategoryRow {
  id: number | string;
  slug: string;
  name: string;
  description: string | null;
  icon: string;
  sort_order: number | string;
}

interface PlaceRow {
  id: string;

  category_slug: string;
  category_name: string;

  name: string;
  description: string | null;

  address: string | null;
  city: string | null;
  country_code: string;

  latitude: number | string;
  longitude: number | string;

  verified_at: string | null;
  updated_at: string;
}

interface MapCatalogOptions {
  query?: string;
  categorySlugs?: readonly string[];
  limit?: number;
}

const CATEGORY_PATTERN =
  /^[a-z0-9-]{1,60}$/;

export async function getMapCategories():
  Promise<MapCategory[]> {
  "use cache";

  cacheLife({
    stale: 3600,
    revalidate: 3600,
    expire: 86400,
  });

  cacheTag(
    "map-categories",
  );

  const supabase =
    createPublicClient();

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "place_categories",
      )
      .select(
        `
          id,
          slug,
          name,
          description,
          icon,
          sort_order
        `,
      )
      .eq(
        "is_active",
        true,
      )
      .order(
        "sort_order",
        {
          ascending: true,
        },
      );

  if (error) {
    console.error(
      "Błąd pobierania kategorii mapy:",
      error,
    );

    throw new Error(
      "Nie udało się pobrać kategorii mapy.",
    );
  }

  return (
    (
      data ??
      []
    ) as CategoryRow[]
  )
    .map(
      (
        row,
      ): MapCategory | null => {
        if (
          !isMapCategoryIcon(
            row.icon,
          )
        ) {
          console.warn(
            "Pominięto kategorię z nieobsługiwaną ikoną:",
            row.slug,
            row.icon,
          );

          return null;
        }

        return {
          id:
            Number(
              row.id,
            ),

          slug:
            row.slug,

          name:
            row.name,

          description:
            row.description,

          icon:
            row.icon,

          sortOrder:
            Number(
              row.sort_order,
            ),
        };
      },
    )
    .filter(
      (
        category,
      ): category is MapCategory =>
        category !==
        null,
    );
}

export async function getMapCatalogPlaces({
  query = "",
  categorySlugs = [],
  limit = 80,
}: MapCatalogOptions = {}):
  Promise<MapExplorerPlace[]> {
  "use cache";

  cacheLife({
    stale: 30,
    revalidate: 60,
    expire: 300,
  });

  cacheTag(
    "map-catalog",
  );

  const normalizedQuery =
    normalizeMapQuery(
      query,
    );

  const normalizedCategories =
    [
      ...new Set(
        categorySlugs
          .map(
            (
              slug,
            ) =>
              slug.trim(),
          )
          .filter(
            (
              slug,
            ) =>
              CATEGORY_PATTERN.test(
                slug,
              ),
          ),
      ),
    ].slice(
      0,
      20,
    );

  const normalizedLimit =
    Math.max(
      1,
      Math.min(
        100,
        Math.trunc(
          limit,
        ),
      ),
    );

  const supabase =
    createPublicClient();

  const {
    data,
    error,
  } =
    await supabase.rpc(
      "map_places_catalog",
      {
        search_query:
          normalizedQuery ||
          null,

        category_slugs:
          normalizedCategories.length >
          0
            ? normalizedCategories
            : null,

        max_results:
          normalizedLimit,
      },
    );

  if (error) {
    console.error(
      "Błąd RPC map_places_catalog:",
      error,
    );

    throw new Error(
      "Nie udało się pobrać katalogu miejsc.",
    );
  }

  return (
    (
      data ??
      []
    ) as PlaceRow[]
  )
    .map(
      parsePlaceRow,
    )
    .filter(
      (
        place,
      ): place is MapExplorerPlace =>
        place !==
        null,
    );
}

export function normalizeMapQuery(
  value: string,
): string {
  return value
    .trim()
    .replace(
      /\s+/g,
      " ",
    )
    .slice(
      0,
      80,
    );
}

function parsePlaceRow(
  row: PlaceRow,
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
      row.country_code.trim(),

    latitude,

    longitude,

    verifiedAt:
      row.verified_at,

    updatedAt:
      row.updated_at,
  };
}

function isMapCategoryIcon(
  value: string,
): value is MapCategoryIcon {
  return (
    value ===
      "parking" ||
    value ===
      "droplet" ||
    value ===
      "toilet" ||
    value ===
      "utensils" ||
    value ===
      "sparkles" ||
    value ===
      "tag"
  );
}