export interface PublicProfileVisibilityState {
  status:
    | "idle"
    | "success"
    | "error";

  message: string;

  visible: boolean;
}