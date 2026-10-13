export type PlaceCollectionKind =
  | "favorites"
  | "custom";

export interface SavedCollectionPlace {
  id: string;

  name: string;

  address:
    string | null;

  city:
    string | null;

  categoryId: number;

  categoryName:
    string | null;

  categorySlug:
    string | null;

  addedAt: string;
}

export interface PlaceCollection {
  id: string;

  name: string;

  kind:
    PlaceCollectionKind;

  sortOrder: number;

  createdAt: string;

  updatedAt: string;

  items:
    SavedCollectionPlace[];
}

export interface PlaceCollectionMembership {
  id: string;

  name: string;

  kind:
    PlaceCollectionKind;

  containsPlace: boolean;
}

export interface CollectionActionState {
  status:
    | "idle"
    | "success"
    | "error";

  message: string;
}