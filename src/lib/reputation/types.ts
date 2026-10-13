export type ReputationEventType =
  | "place_approved"
  | "valid_report";

export type ReputationLevelTier =
  | "sprout"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "legendary"
  | "mythic";

export type ReputationLevelIcon =
  | "tag"
  | "wallet"
  | "trophy"
  | "sparkles"
  | "map-pin"
  | "route"
  | "shield-check"
  | "users";

export interface ReputationLedgerEntry {
  id: string;

  event_type:
    ReputationEventType;

  points: number;

  source_id: string;

  created_at: string;
}

export interface ReputationLevelDefinition {
  id: number;

  order: number;

  code: string;

  name: string;

  description: string;

  minPoints: number;

  tier:
    ReputationLevelTier;

  iconKey:
    ReputationLevelIcon;
}

export interface ReputationLevel
  extends ReputationLevelDefinition {
  nextLevelOrder:
    number | null;

  nextLevelName:
    string | null;

  nextLevelPoints:
    number | null;

  pointsToNext:
    number;

  progressPercent:
    number;
}

export type ReputationCapabilityCategory =
  | "profile"
  | "collections"
  | "alerts"
  | "tools"
  | "community"
  | "cosmetic";

export type ReputationCapabilityStatus =
  | "active"
  | "planned";

export interface ReputationCapability {
  key: string;

  name: string;

  description: string;

  minLevelOrder: number;

  category:
    ReputationCapabilityCategory;

  status:
    ReputationCapabilityStatus;

  iconKey:
    | ReputationLevelIcon
    | "grid";

  sortOrder: number;
}

export interface UserReputation {
  cebulions: number;

  rewardedActions: number;

  level:
    ReputationLevel;

  recentEntries:
    ReputationLedgerEntry[];
}

export interface LeaderboardEntry {
  position: number;

  displayName: string;

  username:
    string | null;

  cebulions: number;

  publicProfileEnabled:
    boolean;

  updatedAt: string;

  level:
    ReputationLevel;
}

export interface OwnLeaderboardPosition {
  position: number;

  totalParticipants: number;

  cebulions: number;
}