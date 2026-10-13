import type {
  ModerationReportDetail,
  ModerationReportSummary,
  ModerationSubmission,
} from "@/lib/moderation/types";

import { createClient } from "@/lib/supabase/server";

export async function getModerationQueue():
  Promise<ModerationSubmission[]> {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } =
    await supabase.rpc(
      "moderation_submission_queue",
    );

  if (error) {
    throw new Error(
      "Nie udało się pobrać kolejki moderacyjnej.",
    );
  }

  return (
    data ?? []
  ) as ModerationSubmission[];
}

export async function getModerationReportQueue():
  Promise<ModerationReportSummary[]> {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } =
    await supabase.rpc(
      "moderation_report_queue",
    );

  if (error) {
    throw new Error(
      "Nie udało się pobrać zgłoszeń problemów.",
    );
  }

  return (
    data ?? []
  ) as ModerationReportSummary[];
}

export async function getModerationReportDetail(
  reportId: string,
): Promise<ModerationReportDetail | null> {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } =
    await supabase
      .rpc(
        "moderation_report_detail",
        {
          p_report_id:
            reportId,
        },
      )
      .maybeSingle();

  if (error) {
    throw new Error(
      "Nie udało się pobrać zgłoszenia.",
    );
  }

  return (
    data ??
    null
  ) as ModerationReportDetail | null;
}