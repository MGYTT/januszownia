import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  Icon,
  type IconName,
} from "@/components/ui/icon";

import {
  requireAuthenticatedUser,
} from "@/lib/auth/server-session";

import {
  getUserReputation,
} from "@/lib/reputation/data";

import {
  getReputationCapabilities,
  getReputationLevels,
} from "@/lib/reputation/level-data";

import type {
  ReputationCapability,
  ReputationLevelDefinition,
  ReputationLevelTier,
} from "@/lib/reputation/types";

export const instant =
  false;

export const metadata: Metadata = {
  title:
    "Poziomy reputacji",

  description:
    "System poziomów i przyszłych możliwości Januszowni.",
};

export default async function LevelsPage() {
  const {
    supabase,
    userId,
  } =
    await requireAuthenticatedUser();

  const [
    reputation,
    levels,
    capabilities,
  ] =
    await Promise.all([
      getUserReputation(
        supabase,
        userId,
      ),

      getReputationLevels(),

      getReputationCapabilities(),
    ]);

  const current =
    reputation.level;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Link
        href="/konto"
        className="text-sm font-bold text-brand-700 hover:underline"
      >
        ← Wróć do konta
      </Link>

      <header className="mt-7">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-3 py-1.5 text-sm font-bold text-accent-700">
          <Icon
            name="trophy"
            className="h-4 w-4"
          />

          Progresja
        </div>

        <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
          Droga Cebularza
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
          25 poziomów sprawia,
          że najwyższe rangi są
          wynikiem długiego,
          zweryfikowanego wkładu,
          a nie kilku szybkich
          akcji.
        </p>
      </header>

      <section className="mt-8 rounded-[2rem] bg-brand-900 p-6 text-white sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-brand-100">
              Poziom{" "}
              {current.order}/
              {levels.length}
            </p>

            <h2 className="mt-2 text-3xl font-black">
              {current.name}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-100">
              {
                current.description
              }
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 px-5 py-4">
            <p className="text-xs font-bold text-brand-100">
              Cebuliony
            </p>

            <p className="mt-1 text-3xl font-black">
              {
                reputation.cebulions
              }
            </p>
          </div>
        </div>

        {current.nextLevelPoints !==
        null ? (
          <div className="mt-7">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span>
                Następny:{" "}
                <strong>
                  {
                    current.nextLevelName
                  }
                </strong>
              </span>

              <strong>
                {
                  current.pointsToNext
                }{" "}
                pkt
              </strong>
            </div>

            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-white"
                style={{
                  width:
                    `${current.progressPercent}%`,
                }}
              />
            </div>
          </div>
        ) : (
          <p className="mt-7 font-black text-accent-200">
            Osiągnięto najwyższy
            poziom Januszowni.
          </p>
        )}
      </section>

      <section className="mt-10">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
            25 rang
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Pełna ścieżka poziomów
          </h2>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          {levels.map(
            (level) => (
              <LevelRow
                key={
                  level.code
                }
                level={
                  level
                }
                currentOrder={
                  current.order
                }
              />
            ),
          )}
        </div>
      </section>

      <section className="mt-12">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
          Przyszłość
        </p>

        <h2 className="mt-2 text-2xl font-black">
          Możliwości zależne od poziomu
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
          To jest przygotowany
          katalog przyszłych
          funkcji. Osiągnięcie
          poziomu nigdy nie nada
          uprawnień moderatora,
          administratora ani nie
          ominie moderacji danych.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {capabilities.map(
            (capability) => (
              <CapabilityCard
                key={
                  capability.key
                }
                capability={
                  capability
                }
                currentOrder={
                  current.order
                }
              />
            ),
          )}
        </div>
      </section>
    </div>
  );
}

function LevelRow({
  level,
  currentOrder,
}: {
  level:
    ReputationLevelDefinition;

  currentOrder: number;
}) {
  const reached =
    currentOrder >=
    level.order;

  const current =
    currentOrder ===
    level.order;

  return (
    <article
      className={[
        "flex items-center gap-4 rounded-[1.4rem] border p-4",
        current
          ? "border-brand-300 bg-brand-50"
          : reached
            ? "border-line bg-white"
            : "border-line bg-canvas/70",
      ].join(
        " ",
      )}
    >
      <div
        className={[
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black",
          current
            ? "bg-brand-600 text-white"
            : reached
              ? "bg-brand-50 text-brand-700"
              : "bg-white text-muted",
        ].join(
          " ",
        )}
      >
        {level.order}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-black">
            {level.name}
          </h3>

          <span className="text-xs font-bold text-muted">
            {tierLabel(
              level.tier,
            )}
          </span>

          {current ? (
            <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-black uppercase text-white">
              Teraz
            </span>
          ) : null}
        </div>

        <p className="mt-1 text-xs text-muted">
          od{" "}
          <strong className="text-ink">
            {
              level.minPoints
            }
          </strong>{" "}
          Cebulionów
        </p>
      </div>

      {reached ? (
        <Icon
          name="check"
          className="h-5 w-5 shrink-0 text-brand-700"
        />
      ) : null}
    </article>
  );
}

function CapabilityCard({
  capability,
  currentOrder,
}: {
  capability:
    ReputationCapability;

  currentOrder:
    number;
}) {
  const thresholdReached =
    currentOrder >=
    capability.minLevelOrder;

  const active =
    capability.status ===
    "active";

  return (
    <article className="rounded-[1.5rem] border border-line bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <Icon
          name={
            capability.iconKey as IconName
          }
          className="h-5 w-5"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-canvas px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.06em]">
          Poziom{" "}
          {
            capability.minLevelOrder
          }
        </span>

        <span className="rounded-full bg-accent-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.06em] text-accent-700">
          {active
            ? thresholdReached
              ? "Odblokowane"
              : "Do odblokowania"
            : thresholdReached
              ? "Próg osiągnięty · w przygotowaniu"
              : "Planowane"}
        </span>
      </div>

      <h3 className="mt-4 font-black">
        {capability.name}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted">
        {
          capability.description
        }
      </p>
    </article>
  );
}

function tierLabel(
  tier:
    ReputationLevelTier,
): string {
  switch (tier) {
    case "sprout":
      return "Początek";

    case "bronze":
      return "Brąz";

    case "silver":
      return "Srebro";

    case "gold":
      return "Złoto";

    case "platinum":
      return "Platyna";

    case "legendary":
      return "Legenda";

    case "mythic":
      return "Mit";
  }
}