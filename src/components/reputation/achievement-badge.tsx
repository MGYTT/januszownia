import {
  Icon,
  type IconName,
} from "@/components/ui/icon";

import {
  achievementCategoryLabel,
  achievementRarityLabel,
  type AchievementCategory,
  type AchievementIcon,
  type AchievementRarity,
} from "@/lib/reputation/achievements";

interface AchievementBadgeProps {
  name: string;

  description: string;

  category:
    AchievementCategory;

  rarity:
    AchievementRarity;

  iconKey:
    AchievementIcon;

  earned:
    boolean;

  progressPercent?: number;

  currentValue?: number;

  threshold?: number;

  earnedAt?:
    string | null;

  featured?: boolean;

  compact?: boolean;
}

export function AchievementBadge({
  name,
  description,
  category,
  rarity,
  iconKey,
  earned,
  progressPercent = 0,
  currentValue,
  threshold,
  earnedAt = null,
  featured = false,
  compact = false,
}: AchievementBadgeProps) {
  const visual =
    rarityVisual(
      rarity,
    );

  return (
    <article
      className={[
        "relative overflow-hidden rounded-[1.5rem] border transition",
        earned
          ? visual.container
          : "border-line bg-canvas opacity-70",
        compact
          ? "p-4"
          : "p-5",
      ].join(" ")}
    >
      {featured ? (
        <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-brand-700 shadow-sm">
          Wyróżnione
        </div>
      ) : null}

      <div
        className={[
          "flex items-center justify-center rounded-2xl border",
          compact
            ? "h-11 w-11"
            : "h-14 w-14",
          earned
            ? visual.icon
            : "border-line bg-white text-subtle",
        ].join(" ")}
      >
        <Icon
          name={
            iconKey as IconName
          }
          className={
            compact
              ? "h-5 w-5"
              : "h-7 w-7"
          }
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={[
            "rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em]",
            earned
              ? visual.label
              : "bg-white text-muted",
          ].join(" ")}
        >
          {achievementRarityLabel(
            rarity,
          )}
        </span>

        <span className="text-xs font-bold text-muted">
          {achievementCategoryLabel(
            category,
          )}
        </span>
      </div>

      <h3
        className={
          compact
            ? "mt-3 text-base font-black"
            : "mt-3 text-lg font-black"
        }
      >
        {name}
      </h3>

      {!compact ? (
        <p className="mt-2 text-sm leading-6 text-muted">
          {description}
        </p>
      ) : null}

      {!earned &&
      currentValue !==
        undefined &&
      threshold !==
        undefined ? (
        <div className="mt-4">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="font-bold text-muted">
              Postęp
            </span>

            <span className="font-black">
              {Math.min(
                currentValue,
                threshold,
              )}
              /
              {threshold}
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-brand-500"
              style={{
                width:
                  `${progressPercent}%`,
              }}
            />
          </div>
        </div>
      ) : null}

      {earned &&
      earnedAt &&
      !compact ? (
        <p className="mt-4 border-t border-current/10 pt-4 text-xs font-semibold text-muted">
          Zdobyte{" "}
          {formatDate(
            earnedAt,
          )}
        </p>
      ) : null}
    </article>
  );
}

function rarityVisual(
  rarity:
    AchievementRarity,
) {
  switch (rarity) {
    case "common":
      return {
        container:
          "border-line bg-white",

        icon:
          "border-line bg-canvas text-ink",

        label:
          "bg-canvas text-muted",
      };

    case "uncommon":
      return {
        container:
          "border-emerald-200 bg-emerald-50/60",

        icon:
          "border-emerald-200 bg-white text-emerald-700",

        label:
          "bg-emerald-100 text-emerald-800",
      };

    case "rare":
      return {
        container:
          "border-sky-200 bg-sky-50/70",

        icon:
          "border-sky-200 bg-white text-sky-700",

        label:
          "bg-sky-100 text-sky-800",
      };

    case "epic":
      return {
        container:
          "border-violet-200 bg-violet-50/70",

        icon:
          "border-violet-200 bg-white text-violet-700",

        label:
          "bg-violet-100 text-violet-800",
      };

    case "legendary":
      return {
        container:
          "border-amber-300 bg-amber-50",

        icon:
          "border-amber-300 bg-white text-amber-700",

        label:
          "bg-amber-100 text-amber-900",
      };

    case "mythic":
      return {
        container:
          "border-fuchsia-300 bg-gradient-to-br from-fuchsia-50 to-amber-50",

        icon:
          "border-fuchsia-300 bg-white text-fuchsia-700",

        label:
          "bg-fuchsia-100 text-fuchsia-900",
      };
  }
}

const dateFormatter =
  new Intl.DateTimeFormat(
    "pl-PL",
    {
      dateStyle:
        "medium",
    },
  );

function formatDate(
  value: string,
): string {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "—";
  }

  return dateFormatter.format(
    date,
  );
}