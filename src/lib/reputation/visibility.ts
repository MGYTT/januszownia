export interface LeaderboardVisibilityState {
  status:
    | "idle"
    | "success"
    | "error";

  message: string;

  visible: boolean;
}