export type MapCategoryIcon =
  | "parking"
  | "droplet"
  | "toilet"
  | "utensils"
  | "sparkles"
  | "tag";

export type MapViewMode =
  | "list"
  | "map";

export interface MapCategory {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  icon: MapCategoryIcon;
  sortOrder: number;
}

export interface MapExplorerPlace {
  id: string;

  categorySlug: string;
  categoryName: string;

  name: string;
  description: string | null;

  address: string | null;
  city: string | null;
  countryCode: string;

  latitude: number;
  longitude: number;

  verifiedAt: string | null;
  updatedAt: string;
}

export interface MapBounds {
  minLat: number;
  minLong: number;
  maxLat: number;
  maxLong: number;
}

export interface MapFocus {
  latitude: number;
  longitude: number;
  zoom: number;
  token: number;
  showLocationMarker: boolean;
}

export interface MapPlacesApiResponse {
  places: MapExplorerPlace[];
  truncated: boolean;
}