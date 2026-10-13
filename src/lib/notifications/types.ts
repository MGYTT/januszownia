export type NotificationKind =
  | "level_up"
  | "achievement_unlocked"
  | "system";

export interface UserNotification {
  id: string;

  kind:
    NotificationKind;

  subjectKey: string;

  title: string;

  message: string;

  metadata:
    Record<
      string,
      unknown
    >;

  readAt:
    string | null;

  createdAt:
    string;
}