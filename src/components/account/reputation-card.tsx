import Link from "next/link";

import type {
  ReputationEventType,
  UserReputation,
} from "@/lib/reputation/types";

interface ReputationCardProps {
  reputation:
    UserReputation;
}

export function ReputationCard({
  reputation,
}: ReputationCardProps) {
  const {
    level,
  } =
    reputation;

  return (
    <section className="rounded-[2rem] border border-line bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
            Reputacja · poziom{" "}
            {level.order}
          </p>

          <h2 className="mt-2 text-2xl font-black">
            {level.name}
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            {
              level.description
            }
          </p>
        </div>

        <div className="shrink-0 rounded-2xl bg-brand-600 px-5 py-4 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-brand-100">
            Cebuliony
          </p>

          <p className="mt-1 text-3xl font-black">
            {
              reputation.cebulions
            }
          </p>
        </div>
      </div>

      {level.nextLevelPoints !==
      null ? (
        <div className="mt-7">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="font-bold text-muted">
              Poziom{" "}
              {
                level.nextLevelOrder
              }
              :{" "}
              <strong className="text-ink">
                {
                  level.nextLevelName
                }
              </strong>
            </span>

            <span className="shrink-0 font-black">
              {
                level.pointsToNext
              }{" "}
              pkt
            </span>
          </div>

          <div
            className="mt-3 h-3 overflow-hidden rounded-full bg-brand-100"
            role="progressbar"
            aria-label="Postęp do następnego poziomu"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={
              level.progressPercent
            }
          >
            <div
              className="h-full rounded-full bg-brand-600"
              style={{
                width:
                  `${level.progressPercent}%`,
              }}
            />
          </div>
        </div>
      ) : (
        <div className="mt-7 rounded-2xl bg-accent-50 p-4 text-sm font-black text-accent-700">
          Osiągnąłeś najwyższy
          poziom reputacji —
          Mit Januszowni.
        </div>
      )}

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-canvas p-4">
          <p className="text-xs font-bold text-muted">
            Nagrodzone działania
          </p>

          <p className="mt-1 text-2xl font-black">
            {
              reputation.rewardedActions
            }
          </p>
        </div>

        <div className="rounded-2xl bg-canvas p-4">
          <p className="text-xs font-bold text-muted">
            Poziom
          </p>

          <p className="mt-1 text-2xl font-black">
            {level.order}/25
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/konto/poziomy"
          className="flex min-h-11 items-center justify-center rounded-button bg-brand-600 px-4 py-2.5 text-center text-sm font-black text-white transition hover:bg-brand-700"
        >
          Poziomy
        </Link>

        <Link
          href="/konto/osiagniecia"
          className="flex min-h-11 items-center justify-center rounded-button border border-brand-200 bg-brand-50 px-4 py-2.5 text-center text-sm font-black text-brand-800 transition hover:bg-brand-100"
        >
          Osiągnięcia
        </Link>

        <Link
          href="/powiadomienia"
          className="flex min-h-11 items-center justify-center rounded-button border border-line bg-white px-4 py-2.5 text-center text-sm font-black transition hover:bg-canvas"
        >
          Powiadomienia
        </Link>

        <Link
          href="/ranking"
          className="flex min-h-11 items-center justify-center rounded-button border border-line bg-white px-4 py-2.5 text-center text-sm font-black transition hover:bg-canvas"
        >
          Ranking
        </Link>
      </div>

      <div className="mt-8 border-t border-line pt-7">
        <h3 className="text-lg font-black">
          Ostatnie Cebuliony
        </h3>

        {reputation.recentEntries.length ===
        0 ? (
          <div className="mt-4 rounded-2xl bg-canvas p-5">
            <p className="font-black">
              Na razie pusto.
            </p>

            <p className="mt-1 text-sm leading-6 text-muted">
              Punkty pojawią się
              po zatwierdzeniu
              wartościowego
              działania.
            </p>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-line">
            {reputation.recentEntries.map(
              (entry) => (
                <div
                  key={
                    entry.id
                  }
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="text-sm font-black">
                      {eventLabel(
                        entry.event_type,
                      )}
                    </p>

                    <p className="mt-1 text-xs text-muted">
                      {formatDateTime(
                        entry.created_at,
                      )}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-black text-brand-700">
                    +
                    {
                      entry.points
                    }
                  </span>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function eventLabel(
  eventType:
    ReputationEventType,
): string {
  switch (eventType) {
    case "place_approved":
      return "Zatwierdzone miejsce";

    case "valid_report":
      return "Trafne zgłoszenie problemu";
  }
}

const dateTimeFormatter =
  new Intl.DateTimeFormat(
    "pl-PL",
    {
      dateStyle:
        "medium",

      timeStyle:
        "short",
    },
  );

function formatDateTime(
  value: string,
): string {
  const date =
    new Date(
      value,
    );

  return Number.isNaN(
    date.getTime(),
  )
    ? "Brak daty"
    : dateTimeFormatter.format(
        date,
      );
}