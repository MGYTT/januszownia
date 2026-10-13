import type {
  PlaceReportReason,
} from "@/lib/maps/community-types";

export interface ModerationSubmission {
  id: string;

  user_id: string;

  category_id: number;

  category_slug: string;

  category_name: string;

  name: string;

  description: string | null;

  address: string | null;

  city: string | null;

  postal_code: string | null;

  country_code: string;

  latitude: number;

  longitude: number;

  source_label: string | null;

  source_url: string | null;

  status: "pending";

  created_at: string;

  submitter_name: string;

  submitter_username: string | null;
}

export interface ModerationReportSummary {
  report_id: string;

  place_id: string;

  reason:
    PlaceReportReason;

  details:
    string | null;

  report_created_at:
    string;

  place_name:
    string;

  place_city:
    string | null;

  category_name:
    string;

  verified_at:
    string | null;
}

export interface ModerationReportDetail {
  report_id: string;

  place_id: string;

  reason:
    PlaceReportReason;

  details:
    string | null;

  report_created_at:
    string;

  category_id:
    number;

  category_slug:
    string;

  category_name:
    string;

  name:
    string;

  description:
    string | null;

  address:
    string | null;

  city:
    string | null;

  postal_code:
    string | null;

  country_code:
    string;

  latitude:
    number;

  longitude:
    number;

  verified_at:
    string | null;
}