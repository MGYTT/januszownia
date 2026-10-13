export type AchievementCategory =
  | "places"
  | "reports"
  | "reputation"
  | "community"
  | "versatile";

export type AchievementMetric =
  | "approved_places"
  | "valid_reports"
  | "cebulions"
  | "rewarded_actions"
  | "balanced_contributions";

export type AchievementRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic";

export type AchievementIcon =
  | "map-pin"
  | "shield-check"
  | "trophy"
  | "users"
  | "sparkles"
  | "tag"
  | "check"
  | "route";

export interface AchievementDefinition {
  id: number;

  code: string;

  name: string;

  description: string;

  category:
    AchievementCategory;

  metric:
    AchievementMetric;

  threshold: number;

  rarity:
    AchievementRarity;

  iconKey:
    AchievementIcon;

  sortOrder: number;
}

export interface AchievementProgress
  extends AchievementDefinition {
  currentValue: number;

  progressPercent: number;

  earnedAt:
    string | null;

  featuredOrder:
    number | null;
}

export interface AchievementDashboard {
  totalCount: number;

  unlockedCount: number;

  featuredCount: number;

  achievements:
    AchievementProgress[];
}

export interface PublicAchievement {
  code: string;

  name: string;

  description: string;

  category:
    AchievementCategory;

  rarity:
    AchievementRarity;

  iconKey:
    AchievementIcon;

  threshold: number;

  earnedAt: string;

  featuredOrder:
    number | null;
}

export function achievementCategoryLabel(
  category:
    AchievementCategory,
): string {
  switch (category) {
    case "places":
      return "Mapa";

    case "reports":
      return "Czujność";

    case "reputation":
      return "Reputacja";

    case "community":
      return "Wkład";

    case "versatile":
      return "Wszechstronność";
  }
}

export function achievementRarityLabel(
  rarity:
    AchievementRarity,
): string {
  switch (rarity) {
    case "common":
      return "Zwykłe";

    case "uncommon":
      return "Niezwykłe";

    case "rare":
      return "Rzadkie";

    case "epic":
      return "Epickie";

    case "legendary":
      return "Legendarne";

    case "mythic":
      return "Mityczne";
  }
}

export function achievementRarityWeight(
  rarity:
    AchievementRarity,
): number {
  switch (rarity) {
    case "common":
      return 1;

    case "uncommon":
      return 2;

    case "rare":
      return 3;

    case "epic":
      return 4;

    case "legendary":
      return 5;

    case "mythic":
      return 6;
  }
}