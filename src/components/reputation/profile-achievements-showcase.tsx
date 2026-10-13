"use client";

import {
  useRef,
} from "react";

import {
  Icon,
  type IconName,
} from "@/components/ui/icon";

import {
  achievementCategoryLabel,
  achievementRarityLabel,
  type AchievementCategory,
  type AchievementRarity,
  type PublicAchievement,
} from "@/lib/reputation/achievements";

interface ProfileAchievementsShowcaseProps {
  achievements:
    PublicAchievement[];

  topAchievements:
    PublicAchievement[];
}

const CATEGORY_ORDER:
  AchievementCategory[] = [
    "places",
    "reports",
    "reputation",
    "community",
    "versatile",
  ];

export function ProfileAchievementsShowcase({
  achievements,
  topAchievements,
}: ProfileAchievementsShowcaseProps) {
  const dialogRef =
    useRef<HTMLDialogElement>(
      null,
    );

  if (
    achievements.length ===
    0
  ) {
    return null;
  }

  function openGallery() {
    dialogRef.current?.showModal();
  }

  function closeGallery() {
    dialogRef.current?.close();
  }

  return (
    <>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="mr-1">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-muted">
            Najlepsze odznaki
          </p>

          <p className="mt-1 text-xs text-muted">
            {
              achievements.length
            }{" "}
            zdobytych
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {topAchievements.map(
            (achievement) => (
              <MiniBadge
                key={
                  achievement.code
                }
                achievement={
                  achievement
                }
              />
            ),
          )}

          <button
            type="button"
            onClick={
              openGallery
            }
            aria-label={`Pokaż wszystkie osiągnięcia. Zdobyto ${achievements.length}.`}
            className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-white text-lg font-black tracking-[0.12em] text-muted shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
          >
            •••
          </button>
        </div>
      </div>

      <dialog
        ref={
          dialogRef
        }
        aria-labelledby="achievement-gallery-title"
        onClick={
          (event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeGallery();
            }
          }
        }
        className="m-auto w-[calc(100%-2rem)] max-w-4xl overflow-hidden rounded-[2rem] border border-line bg-white p-0 text-ink shadow-2xl backdrop:bg-black/45"
      >
        <div className="flex max-h-[85vh] flex-col">
          <header className="flex shrink-0 items-start justify-between gap-5 border-b border-line p-5 sm:p-7">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
                Kolekcja
              </p>

              <h2
                id="achievement-gallery-title"
                className="mt-1 text-2xl font-black"
              >
                Zdobyte osiągnięcia
              </h2>

              <p className="mt-2 text-sm text-muted">
                {
                  achievements.length
                }{" "}
                zdobytych odznak
              </p>
            </div>

            <form
              method="dialog"
            >
              <button
                type="submit"
                aria-label="Zamknij galerię osiągnięć"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white text-2xl font-light text-muted transition hover:bg-canvas hover:text-ink"
              >
                ×
              </button>
            </form>
          </header>

          <div className="overflow-y-auto p-5 sm:p-7">
            <div className="space-y-9">
              {CATEGORY_ORDER.map(
                (category) => {
                  const categoryAchievements =
                    achievements.filter(
                      (achievement) =>
                        achievement.category ===
                        category,
                    );

                  if (
                    categoryAchievements.length ===
                    0
                  ) {
                    return null;
                  }

                  return (
                    <section
                      key={
                        category
                      }
                    >
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <h3 className="text-base font-black">
                          {achievementCategoryLabel(
                            category,
                          )}
                        </h3>

                        <span className="rounded-full bg-canvas px-2.5 py-1 text-xs font-black text-muted">
                          {
                            categoryAchievements.length
                          }
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {categoryAchievements.map(
                          (
                            achievement,
                          ) => (
                            <GalleryBadge
                              key={
                                achievement.code
                              }
                              achievement={
                                achievement
                              }
                            />
                          ),
                        )}
                      </div>
                    </section>
                  );
                },
              )}
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}

function MiniBadge({
  achievement,
}: {
  achievement:
    PublicAchievement;
}) {
  const visual =
    rarityVisual(
      achievement.rarity,
    );

  return (
    <div
      className="group relative"
      title={`${achievement.name} — ${achievementRarityLabel(
        achievement.rarity,
      )}`}
    >
      <div
        className={[
          "relative flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm transition",
          "group-hover:-translate-y-1 group-hover:shadow-md",
          visual.icon,
        ].join(
          " ",
        )}
      >
        <Icon
          name={
            achievement.iconKey as IconName
          }
          className="h-5 w-5"
        />

        {achievement.featuredOrder !==
        null ? (
          <span
            aria-label="Wyróżniona odznaka"
            className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-brand-600 text-[8px] font-black text-white"
          >
            ★
          </span>
        ) : null}
      </div>

      <div className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-20 hidden w-48 -translate-x-1/2 rounded-xl border border-line bg-white p-3 text-center shadow-xl group-hover:block">
        <p className="text-xs font-black">
          {
            achievement.name
          }
        </p>

        <p
          className={[
            "mt-1 text-[10px] font-black uppercase tracking-[0.08em]",
            visual.text,
          ].join(
            " ",
          )}
        >
          {achievementRarityLabel(
            achievement.rarity,
          )}
        </p>
      </div>
    </div>
  );
}

function GalleryBadge({
  achievement,
}: {
  achievement:
    PublicAchievement;
}) {
  const visual =
    rarityVisual(
      achievement.rarity,
    );

  return (
    <article className="flex items-start gap-4 rounded-2xl border border-line bg-canvas/60 p-4">
      <div
        className={[
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-white",
          visual.icon,
        ].join(
          " ",
        )}
      >
        <Icon
          name={
            achievement.iconKey as IconName
          }
          className="h-5 w-5"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-black">
            {
              achievement.name
            }
          </h4>

          {achievement.featuredOrder !==
          null ? (
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.06em] text-brand-700">
              Wyróżniona
            </span>
          ) : null}
        </div>

        <p className="mt-1 text-xs leading-5 text-muted">
          {
            achievement.description
          }
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
          <span
            className={[
              "font-black uppercase tracking-[0.07em]",
              visual.text,
            ].join(
              " ",
            )}
          >
            {achievementRarityLabel(
              achievement.rarity,
            )}
          </span>

          <span className="text-muted">
            {formatDate(
              achievement.earnedAt,
            )}
          </span>
        </div>
      </div>
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
        icon:
          "border-line bg-white text-muted",

        text:
          "text-muted",
      };

    case "uncommon":
      return {
        icon:
          "border-emerald-200 bg-emerald-50 text-emerald-700",

        text:
          "text-emerald-700",
      };

    case "rare":
      return {
        icon:
          "border-sky-200 bg-sky-50 text-sky-700",

        text:
          "text-sky-700",
      };

    case "epic":
      return {
        icon:
          "border-violet-200 bg-violet-50 text-violet-700",

        text:
          "text-violet-700",
      };

    case "legendary":
      return {
        icon:
          "border-amber-300 bg-amber-50 text-amber-700",

        text:
          "text-amber-700",
      };

    case "mythic":
      return {
        icon:
          "border-fuchsia-300 bg-gradient-to-br from-fuchsia-50 to-amber-50 text-fuchsia-700",

        text:
          "text-fuchsia-700",
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
    new Date(
      value,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Brak daty";
  }

  return dateFormatter.format(
    date,
  );
}