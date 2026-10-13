import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getPlacesInView,
} from "@/lib/maps/data";

import type {
  MapCategorySlug,
} from "@/lib/maps/types";

const ALLOWED_CATEGORIES =
  new Set<MapCategorySlug>([
    "parking",
    "water",
    "toilets",
    "food",
    "free",
    "markets",
  ]);

function readNumber(
  request: NextRequest,
  key: string,
): number | null {
  const raw =
    request.nextUrl.searchParams.get(
      key,
    );

  if (
    raw === null ||
    raw.trim() === ""
  ) {
    return null;
  }

  const value =
    Number(raw);

  return Number.isFinite(value)
    ? value
    : null;
}

export async function GET(
  request: NextRequest,
) {
  const minLat =
    readNumber(
      request,
      "minLat",
    );

  const minLong =
    readNumber(
      request,
      "minLong",
    );

  const maxLat =
    readNumber(
      request,
      "maxLat",
    );

  const maxLong =
    readNumber(
      request,
      "maxLong",
    );

  if (
    minLat === null ||
    minLong === null ||
    maxLat === null ||
    maxLong === null
  ) {
    return errorResponse(
      "Brakuje poprawnych granic mapy.",
      400,
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
    maxLong > 180
  ) {
    return errorResponse(
      "Granice mapy wykraczają poza poprawny zakres współrzędnych.",
      400,
    );
  }

  if (
    minLat >= maxLat ||
    minLong >= maxLong
  ) {
    return errorResponse(
      "Nieprawidłowa kolejność granic mapy.",
      400,
    );
  }

  const rawCategories =
    request.nextUrl.searchParams.getAll(
      "category",
    );

  const invalidCategory =
    rawCategories.find(
      (category) =>
        !ALLOWED_CATEGORIES.has(
          category as MapCategorySlug,
        ),
    );

  if (invalidCategory) {
    return errorResponse(
      "Podano nieobsługiwaną kategorię mapy.",
      400,
    );
  }

  const categories =
    rawCategories as MapCategorySlug[];

  try {
    const places =
      await getPlacesInView(
        {
          minLat,
          minLong,
          maxLat,
          maxLong,
        },
        categories.length > 0
          ? categories
          : undefined,
        300,
      );

    /*
     * MapExplorer oczekuje dokładnie:
     *
     * {
     *   places: [...]
     * }
     */
    return NextResponse.json(
      {
        places,
      },
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    );
  } catch (
    unknownError
  ) {
    console.error(
      "Błąd pobierania miejsc mapy:",
      unknownError,
    );

    return errorResponse(
      "Nie udało się pobrać miejsc.",
      500,
    );
  }
}

function errorResponse(
  message: string,
  status: number,
) {
  return NextResponse.json(
    {
      error: message,
    },
    {
      status,

      headers: {
        "Cache-Control":
          "no-store",
      },
    },
  );
}