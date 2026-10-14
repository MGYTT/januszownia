import type {
  SupabaseClient,
} from "@supabase/supabase-js";

import type {
  ReputationEventType,
} from "@/lib/reputation/types";

export type AccountActivityFilter =
  | "all"
  | "places"
  | "reports"
  | "cebulions";

export type SubmissionActivityStatus =
  | "pending"
  | "approved"
  | "rejected";

export type ReportActivityStatus =
  | "open"
  | "resolved"
  | "dismissed";

export type ReportReason =
  | "outdated"
  | "closed"
  | "wrong_location"
  | "wrong_information"
  | "duplicate"
  | "other";

export interface SubmissionActivityItem {
  kind: "submission";
  id: string;

  name: string;
  categoryName: string;
  city: string | null;

  status: SubmissionActivityStatus;

  moderatorNote: string | null;

  createdAt: string;
  reviewedAt: string | null;

  rewardPoints: number | null;
}

export interface ReportActivityItem {
  kind: "report";
  id: string;

  placeId: string;
  placeName: string | null;

  reason: ReportReason;
  details: string | null;

  status: ReportActivityStatus;

  resolutionNote: string | null;

  createdAt: string;
  resolvedAt: string | null;

  rewardPoints: number | null;
}

export interface ReputationActivityItem {
  kind: "reputation";
  id: string;

  eventType: ReputationEventType;
  points: number;
  sourceId: string;

  createdAt: string;
}

export type AccountActivityItem =
  | SubmissionActivityItem
  | ReportActivityItem
  | ReputationActivityItem;

export interface AccountActivityCounts {
  all: number;
  places: number;
  reports: number;
  cebulions: number;
}

export interface AccountActivityData {
  filter: AccountActivityFilter;

  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;

  counts: AccountActivityCounts;

  items: AccountActivityItem[];
}

interface SubmissionRow {
  id: string;
  category_id: number;

  name: string;
  city: string | null;

  status: SubmissionActivityStatus;

  moderator_note: string | null;

  created_at: string;
  reviewed_at: string | null;
}

interface ReportRow {
  id: string;
  place_id: string;

  reason: ReportReason;
  details: string | null;

  status: ReportActivityStatus;

  resolution_note: string | null;

  created_at: string;
  resolved_at: string | null;
}

interface ReputationRow {
  id: string;

  event_type: ReputationEventType;

  points: number;

  source_id: string;

  created_at: string;
}

interface CategoryRow {
  id: number;
  name: string;
}

interface PlaceRow {
  id: string;
  name: string;
}

const PAGE_SIZE =
  12;

const VALID_FILTERS =
  new Set<AccountActivityFilter>([
    "all",
    "places",
    "reports",
    "cebulions",
  ]);

export function normalizeAccountActivityFilter(
  value:
    string | undefined,
): AccountActivityFilter {
  if (
    value &&
    VALID_FILTERS.has(
      value as AccountActivityFilter,
    )
  ) {
    return value as AccountActivityFilter;
  }

  return "all";
}

export function normalizeAccountActivityPage(
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

export async function getAccountActivity(
  supabase:
    SupabaseClient,

  userId:
    string,

  options: {
    filter:
      AccountActivityFilter;

    page:
      number;
  },
): Promise<AccountActivityData> {
  const [
    submissionsCountResult,
    reportsCountResult,
    reputationCountResult,
  ] =
    await Promise.all([
      supabase
        .from(
          "place_submissions",
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
        ),

      supabase
        .from(
          "place_reports",
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
          "reporter_id",
          userId,
        ),

      supabase
        .from(
          "reputation_ledger",
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
        ),
    ]);

  if (
    submissionsCountResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać historii zgłoszonych miejsc.",
    );
  }

  if (
    reportsCountResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać historii raportów.",
    );
  }

  if (
    reputationCountResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać historii Cebulionów.",
    );
  }

  const placesCount =
    submissionsCountResult.count ??
    0;

  const reportsCount =
    reportsCountResult.count ??
    0;

  const cebulionsCount =
    reputationCountResult.count ??
    0;

  const counts:
    AccountActivityCounts = {
      all:
        placesCount +
        reportsCount,

      places:
        placesCount,

      reports:
        reportsCount,

      cebulions:
        cebulionsCount,
    };

  const totalItems =
    counts[
      options.filter
    ];

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
        options.page,
      ),
      totalPages,
    );

  let items:
    AccountActivityItem[] = [];

  switch (
    options.filter
  ) {
    case "places":
      items =
        await getSubmissionActivity(
          supabase,
          userId,
          page,
          PAGE_SIZE,
        );
      break;

    case "reports":
      items =
        await getReportActivity(
          supabase,
          userId,
          page,
          PAGE_SIZE,
        );
      break;

    case "cebulions":
      items =
        await getReputationActivity(
          supabase,
          userId,
          page,
          PAGE_SIZE,
        );
      break;

    case "all":
    default:
      items =
        await getCombinedActivity(
          supabase,
          userId,
          page,
          PAGE_SIZE,
        );
      break;
  }

  return {
    filter:
      options.filter,

    page,

    pageSize:
      PAGE_SIZE,

    totalItems,

    totalPages,

    counts,

    items,
  };
}

async function getCombinedActivity(
  supabase:
    SupabaseClient,

  userId:
    string,

  page:
    number,

  pageSize:
    number,
): Promise<AccountActivityItem[]> {
  /*
   * Aby poprawnie stronicować połączoną
   * historię dwóch tabel, pobieramy
   * pierwsze page * pageSize rekordów
   * z każdego źródła, łączymy je,
   * sortujemy i dopiero wycinamy
   * właściwe okno.
   */
  const fetchLimit =
    page *
    pageSize;

  const [
    submissions,
    reports,
  ] =
    await Promise.all([
      getSubmissionRows(
        supabase,
        userId,
        0,
        fetchLimit -
          1,
      ),

      getReportRows(
        supabase,
        userId,
        0,
        fetchLimit -
          1,
      ),
    ]);

  const [
    submissionItems,
    reportItems,
  ] =
    await Promise.all([
      enrichSubmissionRows(
        supabase,
        userId,
        submissions,
      ),

      enrichReportRows(
        supabase,
        userId,
        reports,
      ),
    ]);

  const start =
    (
      page -
      1
    ) *
    pageSize;

  return [
    ...submissionItems,
    ...reportItems,
  ]
    .sort(
      (
        left,
        right,
      ) =>
        Date.parse(
          right.createdAt,
        ) -
        Date.parse(
          left.createdAt,
        ),
    )
    .slice(
      start,
      start +
        pageSize,
    );
}

async function getSubmissionActivity(
  supabase:
    SupabaseClient,

  userId:
    string,

  page:
    number,

  pageSize:
    number,
): Promise<SubmissionActivityItem[]> {
  const start =
    (
      page -
      1
    ) *
    pageSize;

  const rows =
    await getSubmissionRows(
      supabase,
      userId,
      start,
      start +
        pageSize -
        1,
    );

  return enrichSubmissionRows(
    supabase,
    userId,
    rows,
  );
}

async function getReportActivity(
  supabase:
    SupabaseClient,

  userId:
    string,

  page:
    number,

  pageSize:
    number,
): Promise<ReportActivityItem[]> {
  const start =
    (
      page -
      1
    ) *
    pageSize;

  const rows =
    await getReportRows(
      supabase,
      userId,
      start,
      start +
        pageSize -
        1,
    );

  return enrichReportRows(
    supabase,
    userId,
    rows,
  );
}

async function getReputationActivity(
  supabase:
    SupabaseClient,

  userId:
    string,

  page:
    number,

  pageSize:
    number,
): Promise<ReputationActivityItem[]> {
  const start =
    (
      page -
      1
    ) *
    pageSize;

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "reputation_ledger",
      )
      .select(
        `
          id,
          event_type,
          points,
          source_id,
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
        start,
        start +
          pageSize -
          1,
      );

  if (error) {
    throw new Error(
      "Nie udało się pobrać historii Cebulionów.",
    );
  }

  return (
    (
      data ??
      []
    ) as ReputationRow[]
  ).map(
    (
      row,
    ) => ({
      kind:
        "reputation",

      id:
        row.id,

      eventType:
        row.event_type,

      points:
        Number(
          row.points,
        ),

      sourceId:
        row.source_id,

      createdAt:
        row.created_at,
    }),
  );
}

async function getSubmissionRows(
  supabase:
    SupabaseClient,

  userId:
    string,

  from:
    number,

  to:
    number,
): Promise<SubmissionRow[]> {
  const {
    data,
    error,
  } =
    await supabase
      .from(
        "place_submissions",
      )
      .select(
        `
          id,
          category_id,
          name,
          city,
          status,
          moderator_note,
          created_at,
          reviewed_at
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
      "Nie udało się pobrać historii zgłoszonych miejsc.",
    );
  }

  return (
    data ??
    []
  ) as SubmissionRow[];
}

async function getReportRows(
  supabase:
    SupabaseClient,

  userId:
    string,

  from:
    number,

  to:
    number,
): Promise<ReportRow[]> {
  const {
    data,
    error,
  } =
    await supabase
      .from(
        "place_reports",
      )
      .select(
        `
          id,
          place_id,
          reason,
          details,
          status,
          resolution_note,
          created_at,
          resolved_at
        `,
      )
      .eq(
        "reporter_id",
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
      "Nie udało się pobrać historii raportów.",
    );
  }

  return (
    data ??
    []
  ) as ReportRow[];
}

async function enrichSubmissionRows(
  supabase:
    SupabaseClient,

  userId:
    string,

  rows:
    SubmissionRow[],
): Promise<SubmissionActivityItem[]> {
  if (
    rows.length ===
    0
  ) {
    return [];
  }

  const categoryIds =
    [
      ...new Set(
        rows.map(
          (
            row,
          ) =>
            row.category_id,
        ),
      ),
    ];

  const sourceIds =
    rows.map(
      (
        row,
      ) =>
        row.id,
    );

  const [
    categoryResult,
    rewardResult,
  ] =
    await Promise.all([
      supabase
        .from(
          "place_categories",
        )
        .select(
          "id, name",
        )
        .in(
          "id",
          categoryIds,
        ),

      supabase
        .from(
          "reputation_ledger",
        )
        .select(
          "source_id, points",
        )
        .eq(
          "user_id",
          userId,
        )
        .eq(
          "event_type",
          "place_approved",
        )
        .in(
          "source_id",
          sourceIds,
        ),
    ]);

  if (
    categoryResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać kategorii zgłoszonych miejsc.",
    );
  }

  if (
    rewardResult.error
  ) {
    throw new Error(
      "Nie udało się powiązać Cebulionów ze zgłoszeniami.",
    );
  }

  const categories =
    new Map(
      (
        (
          categoryResult.data ??
          []
        ) as CategoryRow[]
      ).map(
        (
          category,
        ) => [
          Number(
            category.id,
          ),
          category.name,
        ],
      ),
    );

  const rewards =
    new Map(
      (
        rewardResult.data ??
        []
      ).map(
        (
          reward,
        ) => [
          String(
            reward.source_id,
          ),
          Number(
            reward.points,
          ),
        ],
      ),
    );

  return rows.map(
    (
      row,
    ) => ({
      kind:
        "submission",

      id:
        row.id,

      name:
        row.name,

      categoryName:
        categories.get(
          Number(
            row.category_id,
          ),
        ) ??
        "Inna kategoria",

      city:
        row.city,

      status:
        row.status,

      moderatorNote:
        row.moderator_note,

      createdAt:
        row.created_at,

      reviewedAt:
        row.reviewed_at,

      rewardPoints:
        rewards.get(
          row.id,
        ) ??
        null,
    }),
  );
}

async function enrichReportRows(
  supabase:
    SupabaseClient,

  userId:
    string,

  rows:
    ReportRow[],
): Promise<ReportActivityItem[]> {
  if (
    rows.length ===
    0
  ) {
    return [];
  }

  const placeIds =
    [
      ...new Set(
        rows.map(
          (
            row,
          ) =>
            row.place_id,
        ),
      ),
    ];

  const sourceIds =
    rows.map(
      (
        row,
      ) =>
        row.id,
    );

  const [
    placesResult,
    rewardResult,
  ] =
    await Promise.all([
      supabase
        .from(
          "places",
        )
        .select(
          "id, name",
        )
        .in(
          "id",
          placeIds,
        ),

      supabase
        .from(
          "reputation_ledger",
        )
        .select(
          "source_id, points",
        )
        .eq(
          "user_id",
          userId,
        )
        .eq(
          "event_type",
          "valid_report",
        )
        .in(
          "source_id",
          sourceIds,
        ),
    ]);

  if (
    placesResult.error
  ) {
    throw new Error(
      "Nie udało się pobrać nazw miejsc z raportów.",
    );
  }

  if (
    rewardResult.error
  ) {
    throw new Error(
      "Nie udało się powiązać Cebulionów z raportami.",
    );
  }

  const places =
    new Map(
      (
        (
          placesResult.data ??
          []
        ) as PlaceRow[]
      ).map(
        (
          place,
        ) => [
          place.id,
          place.name,
        ],
      ),
    );

  const rewards =
    new Map(
      (
        rewardResult.data ??
        []
      ).map(
        (
          reward,
        ) => [
          String(
            reward.source_id,
          ),
          Number(
            reward.points,
          ),
        ],
      ),
    );

  return rows.map(
    (
      row,
    ) => ({
      kind:
        "report",

      id:
        row.id,

      placeId:
        row.place_id,

      placeName:
        places.get(
          row.place_id,
        ) ??
        null,

      reason:
        row.reason,

      details:
        row.details,

      status:
        row.status,

      resolutionNote:
        row.resolution_note,

      createdAt:
        row.created_at,

      resolvedAt:
        row.resolved_at,

      rewardPoints:
        rewards.get(
          row.id,
        ) ??
        null,
    }),
  );
}
