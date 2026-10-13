"use server";

import {
  revalidatePath,
} from "next/cache";

import type {
  CollectionActionState,
} from "@/lib/collections/types";

import {
  createClient,
} from "@/lib/supabase/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeCollectionName(
  value: string,
): string {
  return value
    .trim()
    .replace(
      /\s+/g,
      " ",
    );
}

async function getAuthenticatedContext() {
  const supabase =
    await createClient();

  const {
    data: claimsData,
    error,
  } =
    await supabase.auth.getClaims();

  const userId =
    claimsData?.claims?.sub;

  if (
    error ||
    !userId
  ) {
    return null;
  }

  return {
    supabase,
    userId,
  };
}

export async function createPlaceCollection(
  previousState:
    CollectionActionState,

  formData: FormData,
): Promise<CollectionActionState> {
  const rawName =
    formData.get(
      "name",
    );

  const name =
    normalizeCollectionName(
      typeof rawName ===
        "string"
        ? rawName
        : "",
    );

  if (
    name.length < 2 ||
    name.length > 60
  ) {
    return {
      status:
        "error",

      message:
        "Nazwa kolekcji musi mieć od 2 do 60 znaków.",
    };
  }

  const context =
    await getAuthenticatedContext();

  if (!context) {
    return {
      status:
        "error",

      message:
        "Sesja wygasła. Zaloguj się ponownie.",
    };
  }

  const {
    supabase,
    userId,
  } =
    context;

  const {
    error,
  } =
    await supabase
      .from(
        "place_collections",
      )
      .insert({
        user_id:
          userId,

        name,

        kind:
          "custom",

        sort_order:
          100,
      });

  if (error) {
    console.error(
      "Błąd tworzenia kolekcji:",
      error,
    );

    if (
      error.code ===
      "23505"
    ) {
      return {
        status:
          "error",

        message:
          "Masz już kolekcję o takiej nazwie.",
      };
    }

    if (
      error.message.includes(
        "COLLECTION_LIMIT_REACHED",
      )
    ) {
      return {
        status:
          "error",

        message:
          "Osiągnięto limit 30 własnych kolekcji.",
      };
    }

    return {
      status:
        "error",

      message:
        "Nie udało się utworzyć kolekcji.",
    };
  }

  revalidatePath(
    "/konto/kolekcje",
  );

  return {
    status:
      "success",

    message:
      `Utworzono kolekcję „${name}”.`,
  };
}

export async function deletePlaceCollection(
  formData: FormData,
): Promise<void> {
  const rawId =
    formData.get(
      "collectionId",
    );

  const collectionId =
    typeof rawId ===
      "string"
      ? rawId
      : "";

  if (
    !UUID_PATTERN.test(
      collectionId,
    )
  ) {
    return;
  }

  const context =
    await getAuthenticatedContext();

  if (!context) {
    return;
  }

  const {
    supabase,
    userId,
  } =
    context;

  const {
    error,
  } =
    await supabase
      .from(
        "place_collections",
      )
      .delete()
      .eq(
        "id",
        collectionId,
      )
      .eq(
        "user_id",
        userId,
      )
      .eq(
        "kind",
        "custom",
      );

  if (error) {
    console.error(
      "Błąd usuwania kolekcji:",
      error,
    );

    return;
  }

  revalidatePath(
    "/konto/kolekcje",
  );
}

export async function removeSavedPlace(
  formData: FormData,
): Promise<void> {
  const rawCollectionId =
    formData.get(
      "collectionId",
    );

  const rawPlaceId =
    formData.get(
      "placeId",
    );

  const collectionId =
    typeof rawCollectionId ===
      "string"
      ? rawCollectionId
      : "";

  const placeId =
    typeof rawPlaceId ===
      "string"
      ? rawPlaceId
      : "";

  if (
    !UUID_PATTERN.test(
      collectionId,
    ) ||
    !UUID_PATTERN.test(
      placeId,
    )
  ) {
    return;
  }

  const context =
    await getAuthenticatedContext();

  if (!context) {
    return;
  }

  const {
    supabase,
    userId,
  } =
    context;

  const {
    error,
  } =
    await supabase
      .from(
        "place_collection_items",
      )
      .delete()
      .eq(
        "collection_id",
        collectionId,
      )
      .eq(
        "place_id",
        placeId,
      )
      .eq(
        "user_id",
        userId,
      );

  if (error) {
    console.error(
      "Błąd usuwania miejsca z kolekcji:",
      error,
    );

    return;
  }

  revalidatePath(
    "/konto/kolekcje",
  );

  revalidatePath(
    `/mapy/miejsce/${placeId}`,
  );
}

export async function setPlaceCollectionMembership(
  formData: FormData,
): Promise<void> {
  const rawCollectionId =
    formData.get(
      "collectionId",
    );

  const rawPlaceId =
    formData.get(
      "placeId",
    );

  const rawPresent =
    formData.get(
      "present",
    );

  const collectionId =
    typeof rawCollectionId ===
      "string"
      ? rawCollectionId
      : "";

  const placeId =
    typeof rawPlaceId ===
      "string"
      ? rawPlaceId
      : "";

  const present =
    rawPresent ===
    "true";

  if (
    !UUID_PATTERN.test(
      collectionId,
    ) ||
    !UUID_PATTERN.test(
      placeId,
    )
  ) {
    return;
  }

  const context =
    await getAuthenticatedContext();

  if (!context) {
    return;
  }

  const {
    supabase,
    userId,
  } =
    context;

  if (present) {
    const {
      error,
    } =
      await supabase
        .from(
          "place_collection_items",
        )
        .insert({
          collection_id:
            collectionId,

          user_id:
            userId,

          place_id:
            placeId,
        });

    if (
      error &&
      error.code !==
        "23505"
    ) {
      console.error(
        "Błąd dodawania miejsca do kolekcji:",
        error,
      );

      return;
    }
  } else {
    const {
      error,
    } =
      await supabase
        .from(
          "place_collection_items",
        )
        .delete()
        .eq(
          "collection_id",
          collectionId,
        )
        .eq(
          "place_id",
          placeId,
        )
        .eq(
          "user_id",
          userId,
        );

    if (error) {
      console.error(
        "Błąd usuwania miejsca z kolekcji:",
        error,
      );

      return;
    }
  }

  revalidatePath(
    `/mapy/miejsce/${placeId}`,
  );

  revalidatePath(
    "/konto/kolekcje",
  );
}