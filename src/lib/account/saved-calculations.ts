import type {
  SupabaseClient,
} from "@supabase/supabase-js";

export interface SaveCalculationPayload {
  toolSlug: string;
  toolVersion: number;
  title: string;
  inputData: unknown;
  resultData: unknown;
}

export type SaveCalculationActionResult =
  | {
      status: "saved";
      id: string;
    }
  | {
      status: "unauthenticated";
    }
  | {
      status: "error";
      message: string;
    };

export interface SavedCalculationListItem {
  id: string;

  toolSlug: string;
  toolVersion: number;

  title: string;

  createdAt: string;
}

export interface SavedCalculationList {
  items: SavedCalculationListItem[];

  page: number;
  pageSize: number;

  totalItems: number;
  totalPages: number;
}

const PAGE_SIZE =
  12;

interface SavedCalculationRow {
  id: string;

  tool_slug: string;
  tool_version: number;

  title: string;

  created_at: string;
}

export function normalizeSavedCalculationPage(
  value:
    string | undefined,
): number {
  if (!value) {
    return 1;
  }

  const parsed =
    Number(
      value,
    );

  if (
    !Number.isInteger(
      parsed,
    ) ||
    parsed <
      1
  ) {
    return 1;
  }

  return parsed;
}

export async function getSavedCalculations(
  supabase:
    SupabaseClient,

  userId:
    string,

  requestedPage:
    number,
): Promise<SavedCalculationList> {
  const countResult =
    await supabase
      .from(
        "saved_calculations",
      )
      .select(
        "id",
        {
          count:
            "exact",

          head:
            true,
        },
      )
      .eq(
        "user_id",
        userId,
      );

  if (
    countResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać liczby zapisanych obliczeń.",
    );
  }

  const totalItems =
    countResult.count ??
    0;

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalItems /
        PAGE_SIZE,
      ),
    );

  const page =
    Math.min(
      Math.max(
        1,
        requestedPage,
      ),
      totalPages,
    );

  if (
    totalItems ===
    0
  ) {
    return {
      items:
        [],

      page:
        1,

      pageSize:
        PAGE_SIZE,

      totalItems:
        0,

      totalPages:
        1,
    };
  }

  const from =
    (
      page -
      1
    ) *
    PAGE_SIZE;

  const to =
    from +
    PAGE_SIZE -
    1;

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "saved_calculations",
      )
      .select(
        `
          id,
          tool_slug,
          tool_version,
          title,
          created_at
        `,
      )
      .eq(
        "user_id",
        userId,
      )
      .order(
        "created_at",
        {
          ascending:
            false,
        },
      )
      .range(
        from,
        to,
      );

  if (error) {
    throw new Error(
      "Nie udało się pobrać zapisanych obliczeń.",
    );
  }

  const rows =
    (
      data ??
      []
    ) as SavedCalculationRow[];

  return {
    items:
      rows.map(
        (
          row,
        ) => ({
          id:
            row.id,

          toolSlug:
            row.tool_slug,

          toolVersion:
            Number(
              row.tool_version,
            ),

          title:
            row.title,

          createdAt:
            row.created_at,
        }),
      ),

    page,

    pageSize:
      PAGE_SIZE,

    totalItems,

    totalPages,
  };
}
