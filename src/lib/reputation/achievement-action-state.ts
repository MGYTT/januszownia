export interface AchievementFeatureState {
  status:
    | "idle"
    | "success"
    | "error";

  message: string;

  featured: boolean;

  slot:
    number | null;
}