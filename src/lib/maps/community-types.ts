export type PlaceVerdict =
  | "confirmed"
  | "outdated";

export type PlaceReportReason =
  | "outdated"
  | "closed"
  | "wrong_location"
  | "wrong_information"
  | "duplicate"
  | "other";

export interface PlaceConfirmationActionState {
  status:
    | "idle"
    | "success"
    | "error";

  message: string;

  verdict: PlaceVerdict | null;
}

export interface PlaceReportActionState {
  status:
    | "idle"
    | "success"
    | "error";

  message: string;
}