import type {
  SupabaseClient,
} from "@supabase/supabase-js";

import type {
  NotificationKind,
  UserNotification,
} from "@/lib/notifications/types";

interface NotificationRow {
  id: string;

  kind:
    NotificationKind;

  subject_key:
    string;

  title: string;

  message: string;

  metadata:
    unknown;

  read_at:
    string | null;

  created_at:
    string;
}

export async function getNotifications(
  supabase:
    SupabaseClient,

  limit = 50,
): Promise<UserNotification[]> {
  const {
    data,
    error,
  } =
    await supabase
      .from(
        "notifications",
      )
      .select(
        `
          id,
          kind,
          subject_key,
          title,
          message,
          metadata,
          read_at,
          created_at
        `,
      )
      .order(
        "created_at",
        {
          ascending: false,
        },
      )
      .limit(
        Math.max(
          1,
          Math.min(
            100,
            limit,
          ),
        ),
      );

  if (error) {
    throw new Error(
      "Nie udało się pobrać powiadomień.",
    );
  }

  return (
    (
      data ??
      []
    ) as NotificationRow[]
  ).map(
    (row) => ({
      id:
        row.id,

      kind:
        row.kind,

      subjectKey:
        row.subject_key,

      title:
        row.title,

      message:
        row.message,

      metadata:
        isRecord(
          row.metadata,
        )
          ? row.metadata
          : {},

      readAt:
        row.read_at,

      createdAt:
        row.created_at,
    }),
  );
}

export async function getUnreadNotificationCount(
  supabase:
    SupabaseClient,
): Promise<number> {
  const {
    count,
    error,
  } =
    await supabase
      .from(
        "notifications",
      )
      .select(
        "id",
        {
          count: "exact",
          head: true,
        },
      )
      .is(
        "read_at",
        null,
      );

  if (error) {
    throw new Error(
      "Nie udało się pobrać liczby nowych powiadomień.",
    );
  }

  return count ?? 0;
}

function isRecord(
  value: unknown,
): value is Record<
  string,
  unknown
> {
  return (
    typeof value ===
      "object" &&
    value !== null &&
    !Array.isArray(
      value,
    )
  );
}