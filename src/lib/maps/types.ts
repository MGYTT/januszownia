export type MapCategorySlug =
  | "parking"
  | "water"
  | "toilets"
  | "food"
  | "free"
  | "markets";

export interface MapCategory {
  id: number;
  slug: MapCategorySlug;
  name: string;
  description: string | null;
  icon: string;
  sort_order: number;
}

export interface MapPlace {
  id: string;
  category_slug: MapCategorySlug;
  category_name: string;
  name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  country_code: string;
  latitude: number;
  longitude: number;
  verified_at: string | null;
  updated_at: string;
}

export interface NearbyMapPlace
  extends Omit<
    MapPlace,
    "country_code" | "updated_at"
  > {
  distance_meters: number;
}

export interface MapBounds {
  minLat: number;
  minLong: number;
  maxLat: number;
  maxLong: number;
}

export interface NewPlaceSubmission {
  categoryId: number;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  countryCode: string;
  sourceLabel: string | null;
  sourceUrl: string | null;
}