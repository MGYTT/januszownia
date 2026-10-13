import {
  cacheLife,
  cacheTag,
} from "next/cache";

import { createPublicClient } from "@/lib/supabase/public";
import type {
  MapBounds,
  MapCategory,
  MapCategorySlug,
  MapPlace,
  NearbyMapPlace,
} from "@/lib/maps/types";

export async function getMapCategories(): Promise<
  MapCategory[]
> {
  "use cache";

  /*
   * Kategorie są danymi publicznymi
   * i zmieniają się bardzo rzadko.
   *
   * Nie ma powodu pobierać ich
   * z Supabase przy każdym wejściu
   * użytkownika na /mapy.
   */
  cacheLife("hours");
  cacheTag("map-categories");

  const supabase =
    createPublicClient();

  const { data, error } =
    await supabase
      .from("place_categories")
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
    throw new Error(
      "Nie udało się pobrać kategorii mapy.",
    );
  }

  return (
    data ?? []
  ) as MapCategory[];
}

export async function getPlacesInView(
  bounds: MapBounds,
  categories?: MapCategorySlug[],
  limit = 300,
): Promise<MapPlace[]> {
  const supabase =
    createPublicClient();

  const { data, error } =
    await supabase.rpc(
      "places_in_view",
      {
        min_lat:
          bounds.minLat,

        min_long:
          bounds.minLong,

        max_lat:
          bounds.maxLat,

        max_long:
          bounds.maxLong,

        category_slugs:
          categories &&
          categories.length > 0
            ? categories
            : null,

        max_results:
          limit,
      },
    );

  if (error) {
    throw new Error(
      "Nie udało się pobrać miejsc znajdujących się na mapie.",
    );
  }

  return (
    data ?? []
  ) as MapPlace[];
}

export async function getPlacesNearby(
  latitude: number,
  longitude: number,
  radiusMeters = 5000,
  categories?: MapCategorySlug[],
  limit = 50,
): Promise<NearbyMapPlace[]> {
  const supabase =
    createPublicClient();

  const { data, error } =
    await supabase.rpc(
      "places_nearby",
      {
        search_lat:
          latitude,

        search_long:
          longitude,

        radius_meters:
          radiusMeters,

        category_slugs:
          categories &&
          categories.length > 0
            ? categories
            : null,

        max_results:
          limit,
      },
    );

  if (error) {
    throw new Error(
      "Nie udało się pobrać pobliskich miejsc.",
    );
  }

  return (
    data ?? []
  ) as NearbyMapPlace[];
}