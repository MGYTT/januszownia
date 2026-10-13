import type {
  SupabaseClient,
} from "@supabase/supabase-js";

import type {
  PlaceCollection,
  PlaceCollectionKind,
  PlaceCollectionMembership,
  SavedCollectionPlace,
} from "@/lib/collections/types";

interface CollectionRow {
  id: string;

  name: string;

  kind:
    PlaceCollectionKind;

  sort_order:
    number | string;

  created_at: string;

  updated_at: string;
}

interface ItemRow {
  collection_id: string;

  place_id: string;

  added_at: string;
}

interface PlaceRow {
  id: string;

  name: string;

  address:
    string | null;

  city:
    string | null;

  category_id:
    number | string;
}

interface CategoryRow {
  id:
    number | string;

  name: string;

  slug: string;
}

export async function getOwnPlaceCollections(
  supabase:
    SupabaseClient,

  userId: string,
): Promise<PlaceCollection[]> {
  const [
    collectionsResult,
    itemsResult,
  ] =
    await Promise.all([
      supabase
        .from(
          "place_collections",
        )
        .select(
          `
            id,
            name,
            kind,
            sort_order,
            created_at,
            updated_at
          `,
        )
        .eq(
          "user_id",
          userId,
        ),

      supabase
        .from(
          "place_collection_items",
        )
        .select(
          `
            collection_id,
            place_id,
            added_at
          `,
        )
        .eq(
          "user_id",
          userId,
        )
        .order(
          "added_at",
          {
            ascending:
              false,
          },
        ),
    ]);

  if (
    collectionsResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać kolekcji.",
    );
  }

  if (
    itemsResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać zapisanych miejsc.",
    );
  }

  const collections =
    (
      collectionsResult.data ??
      []
    ) as CollectionRow[];

  const itemRows =
    (
      itemsResult.data ??
      []
    ) as ItemRow[];

  const placeIds =
    [
      ...new Set(
        itemRows.map(
          (item) =>
            item.place_id,
        ),
      ),
    ];

  let places:
    PlaceRow[] = [];

  if (
    placeIds.length > 0
  ) {
    const {
      data,
      error,
    } =
      await supabase
        .from(
          "places",
        )
        .select(
          `
            id,
            name,
            address,
            city,
            category_id
          `,
        )
        .in(
          "id",
          placeIds,
        )
        .eq(
          "status",
          "published",
        );

    if (error) {
      throw new Error(
        "Nie udało się pobrać miejsc z kolekcji.",
      );
    }

    places =
      (
        data ??
        []
      ) as PlaceRow[];
  }

  const categoryIds =
    [
      ...new Set(
        places.map(
          (place) =>
            Number(
              place.category_id,
            ),
        ),
      ),
    ];

  let categories:
    CategoryRow[] = [];

  if (
    categoryIds.length > 0
  ) {
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
            name,
            slug
          `,
        )
        .in(
          "id",
          categoryIds,
        );

    if (error) {
      throw new Error(
        "Nie udało się pobrać kategorii miejsc.",
      );
    }

    categories =
      (
        data ??
        []
      ) as CategoryRow[];
  }

  const placesById =
    new Map(
      places.map(
        (place) => [
          place.id,
          place,
        ],
      ),
    );

  const categoriesById =
    new Map(
      categories.map(
        (category) => [
          Number(
            category.id,
          ),
          category,
        ],
      ),
    );

  const itemsByCollection =
    new Map<
      string,
      SavedCollectionPlace[]
    >();

  for (
    const item
    of itemRows
  ) {
    const place =
      placesById.get(
        item.place_id,
      );

    /*
     * Jeśli zapisane kiedyś miejsce
     * przestało być publiczne,
     * nie pokazujemy jego danych.
     */
    if (!place) {
      continue;
    }

    const categoryId =
      Number(
        place.category_id,
      );

    const category =
      categoriesById.get(
        categoryId,
      );

    const savedPlace:
      SavedCollectionPlace = {
        id:
          place.id,

        name:
          place.name,

        address:
          place.address,

        city:
          place.city,

        categoryId,

        categoryName:
          category?.name ??
          null,

        categorySlug:
          category?.slug ??
          null,

        addedAt:
          item.added_at,
      };

    const existing =
      itemsByCollection.get(
        item.collection_id,
      ) ??
      [];

    existing.push(
      savedPlace,
    );

    itemsByCollection.set(
      item.collection_id,
      existing,
    );
  }

  return collections
    .map(
      (
        collection,
      ): PlaceCollection => ({
        id:
          collection.id,

        name:
          collection.name,

        kind:
          collection.kind,

        sortOrder:
          Number(
            collection.sort_order,
          ),

        createdAt:
          collection.created_at,

        updatedAt:
          collection.updated_at,

        items:
          itemsByCollection.get(
            collection.id,
          ) ??
          [],
      }),
    )
    .sort(
      (
        left,
        right,
      ) => {
        if (
          left.kind !==
          right.kind
        ) {
          return left.kind ===
            "favorites"
            ? -1
            : 1;
        }

        if (
          left.sortOrder !==
          right.sortOrder
        ) {
          return (
            left.sortOrder -
            right.sortOrder
          );
        }

        return left.name.localeCompare(
          right.name,
          "pl",
        );
      },
    );
}

export async function getPlaceCollectionMembership(
  supabase:
    SupabaseClient,

  userId: string,

  placeId: string,
): Promise<
  PlaceCollectionMembership[]
> {
  const [
    collectionsResult,
    itemsResult,
  ] =
    await Promise.all([
      supabase
        .from(
          "place_collections",
        )
        .select(
          `
            id,
            name,
            kind,
            sort_order,
            created_at,
            updated_at
          `,
        )
        .eq(
          "user_id",
          userId,
        ),

      supabase
        .from(
          "place_collection_items",
        )
        .select(
          "collection_id",
        )
        .eq(
          "user_id",
          userId,
        )
        .eq(
          "place_id",
          placeId,
        ),
    ]);

  if (
    collectionsResult.error ||
    itemsResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać kolekcji miejsca.",
    );
  }

  const collections =
    (
      collectionsResult.data ??
      []
    ) as CollectionRow[];

  const selectedIds =
    new Set(
      (
        itemsResult.data ??
        []
      ).map(
        (row) =>
          String(
            row.collection_id,
          ),
      ),
    );

  return collections
    .map(
      (
        collection,
      ): PlaceCollectionMembership => ({
        id:
          collection.id,

        name:
          collection.name,

        kind:
          collection.kind,

        containsPlace:
          selectedIds.has(
            collection.id,
          ),
      }),
    )
    .sort(
      (
        left,
        right,
      ) => {
        if (
          left.kind ===
            "favorites" &&
          right.kind !==
            "favorites"
        ) {
          return -1;
        }

        if (
          right.kind ===
            "favorites" &&
          left.kind !==
            "favorites"
        ) {
          return 1;
        }

        return left.name.localeCompare(
          right.name,
          "pl",
        );
      },
    );
}