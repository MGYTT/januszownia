import {
  achievementRarityWeight,
  type PublicAchievement,
} from "@/lib/reputation/achievements";

export function selectTopAchievements(
  achievements:
    PublicAchievement[],
  limit = 5,
): PublicAchievement[] {
  if (
    limit <= 0 ||
    achievements.length === 0
  ) {
    return [];
  }

  /*
   * Ręcznie wyróżnione przez użytkownika
   * mają pierwszeństwo.
   */
  const manuallyFeatured =
    achievements
      .filter(
        (achievement) =>
          achievement.featuredOrder !==
          null,
      )
      .sort(
        compareFeaturedAchievements,
      );

  const featuredCodes =
    new Set(
      manuallyFeatured.map(
        (achievement) =>
          achievement.code,
      ),
    );

  /*
   * Jeśli użytkownik nie wybrał pełnych 5,
   * uzupełniamy automatycznie:
   *
   * 1. rzadsze
   * 2. nowsze
   * 3. nazwa jako stabilny tie-breaker
   */
  const automatic =
    achievements
      .filter(
        (achievement) =>
          !featuredCodes.has(
            achievement.code,
          ),
      )
      .sort(
        compareAutomaticAchievements,
      );

  return [
    ...manuallyFeatured,
    ...automatic,
  ].slice(
    0,
    limit,
  );
}

function compareFeaturedAchievements(
  left:
    PublicAchievement,
  right:
    PublicAchievement,
): number {
  const leftOrder =
    left.featuredOrder ??
    Number.MAX_SAFE_INTEGER;

  const rightOrder =
    right.featuredOrder ??
    Number.MAX_SAFE_INTEGER;

  if (
    leftOrder !==
    rightOrder
  ) {
    return (
      leftOrder -
      rightOrder
    );
  }

  return compareAutomaticAchievements(
    left,
    right,
  );
}

function compareAutomaticAchievements(
  left:
    PublicAchievement,
  right:
    PublicAchievement,
): number {
  const rarityDifference =
    achievementRarityWeight(
      right.rarity,
    ) -
    achievementRarityWeight(
      left.rarity,
    );

  if (
    rarityDifference !==
    0
  ) {
    return rarityDifference;
  }

  const dateDifference =
    safeTimestamp(
      right.earnedAt,
    ) -
    safeTimestamp(
      left.earnedAt,
    );

  if (
    dateDifference !==
    0
  ) {
    return dateDifference;
  }

  return left.name.localeCompare(
    right.name,
    "pl",
  );
}

function safeTimestamp(
  value: string,
): number {
  const timestamp =
    new Date(
      value,
    ).getTime();

  return Number.isFinite(
    timestamp,
  )
    ? timestamp
    : 0;
}