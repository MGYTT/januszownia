import {
  cacheLife,
  cacheTag,
} from "next/cache";

import type {
  MapCategory,
  MapCategoryIcon,
} from "@/lib/maps/explorer-types";

import {
  createPublicClient,
} from "@/lib/supabase/public";

interface CategoryRow {
  id:
    number | string;

  slug: string;

  name: string;

  description:
    string | null;

  icon: string;

  sort_order:
    number | string;
}

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
          ascending:
            true,
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

function isMapCategoryIcon(
  value: string,
): value is MapCategoryIcon {
  return (
    value === "parking" ||
    value === "droplet" ||
    value === "toilet" ||
    value === "utensils" ||
    value === "sparkles" ||
    value === "tag"
  );
}