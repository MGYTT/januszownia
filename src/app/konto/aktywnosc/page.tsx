import type {
  Metadata,
} from "next";

import Link from "next/link";

import type {
  ReactNode,
} from "react";

import {
  Icon,
  type IconName,
} from "@/components/ui/icon";

import {
  getAccountActivity,
  normalizeAccountActivityFilter,
  normalizeAccountActivityPage,
  type AccountActivityFilter,
  type AccountActivityItem,
  type ReportActivityItem,
  type ReportReason,
  type SubmissionActivityItem,
} from "@/lib/account/activity";

import {
  requireAuthenticatedUser,
} from "@/lib/auth/server-session";

import type {
  ReputationEventType,
} from "@/lib/reputation/types";

export const instant =
  false;

export const metadata: Metadata = {
  title:
    "Kronika Cebularza",

  description:
    "Historia własnych zgłoszeń miejsc, raportów moderacyjnych i zdobytych Cebulionów w Januszowni.",
};

interface ActivityPageProps {
  searchParams: Promise<{
    filter?: string;
    page?: string;
  }>;
}

const filterOptions: {
  key: AccountActivityFilter;
  label: string;
  shortLabel: string;
  icon: IconName;
}[] = [
  {
    key: "all",
    label: "Cała kronika",
    shortLabel: "Wszystko",
    icon: "route",
  },
  {
    key: "places",
    label: "Dodane miejsca",
    shortLabel: "Miejsca",
    icon: "map-pin",
  },
  {
    key: "reports",
    label: "Raporty problemów",
    shortLabel: "Raporty",
    icon: "shield-check",
  },
  {
    key: "cebulions",
    label: "Historia Cebulionów",
    shortLabel: "Cebuliony",
    icon: "wallet",
  },
];

export default async function AccountActivityPage({
  searchParams,
}: ActivityPageProps) {
  const {
    supabase,
    userId,
  } =
    await requireAuthenticatedUser();

  const params =
    await searchParams;

  const filter =
    normalizeAccountActivityFilter(
      params.filter,
    );

  const requestedPage =
    normalizeAccountActivityPage(
      params.page,
    );

  const activity =
    await getAccountActivity(
      supabase,
      userId,
      {
        filter,
        page:
          requestedPage,
      },
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link
        href="/konto"
        className="inline-flex items-center gap-2 text-sm font-black text-brand-700 hover:underline"
      >
        ← Wróć do Teczki Cebularza
      </Link>

      <header className="mt-6 grid gap-6 rounded-[2rem] bg-brand-900 p-6 text-white shadow-card sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-200">
            Konto · aktywność
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
            Kronika Cebularza
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-brand-100 sm:text-base">
            Wszystko, co zostawiło ślad:
            dodane miejsca, raporty,
            decyzje moderacji i zdobyte
            Cebuliony. Bez szukania po
            zakamarkach konta.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:min-w-[280px]">
          <HeaderStat
            label="Miejsca"
            value={
              activity.counts.places
            }
          />

          <HeaderStat
            label="Raporty"
            value={
              activity.counts.reports
            }
          />

          <HeaderStat
            label="Nagrody"
            value={
              activity.counts.cebulions
            }
          />

          <HeaderStat
            label="Wkład łącznie"
            value={
              activity.counts.all
            }
          />
        </div>
      </header>

      <section className="mt-7">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {filterOptions.map(
            (
              option,
            ) => (
              <ActivityFilter
                key={
                  option.key
                }
                option={
                  option
                }
                active={
                  activity.filter ===
                  option.key
                }
                count={
                  activity.counts[
                    option.key
                  ]
                }
              />
            ),
          )}
        </div>

        {activity.filter ===
        "all" ? (
          <p className="mt-3 text-xs leading-5 text-muted">
            Widok „Wszystko” pokazuje
            zgłoszenia miejsc i raporty.
            Jeśli za konkretną akcję
            wpadły Cebuliony, nagroda jest
            pokazana przy tym samym wpisie,
            żeby nie dublować historii.
          </p>
        ) : null}
      </section>

      <section className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
              {
                filterTitle(
                  activity.filter,
                )
              }
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-[-0.03em] sm:text-3xl">
              {
                activity.totalItems ===
                0
                  ? "Tu jeszcze wiatr hula po papierach."
                  : "Najnowsze wpisy są na górze."
              }
            </h2>
          </div>

          {activity.totalItems >
          0 ? (
            <p className="text-sm font-bold text-muted">
              {activity.totalItems}{" "}
              {
                resultWord(
                  activity.totalItems,
                )
              }
            </p>
          ) : null}
        </div>

        {activity.items.length ===
        0 ? (
          <EmptyActivity
            filter={
              activity.filter
            }
          />
        ) : (
          <div className="relative mt-6">
            <div
              aria-hidden="true"
              className="absolute bottom-5 left-[21px] top-5 hidden w-px bg-line sm:block"
            />

            <div className="space-y-4">
              {activity.items.map(
                (
                  item,
                ) => (
                  <ActivityEntry
                    key={
                      item.kind +
                      ":" +
                      item.id
                    }
                    item={
                      item
                    }
                  />
                ),
              )}
            </div>
          </div>
        )}

        {activity.totalPages >
        1 ? (
          <Pagination
            filter={
              activity.filter
            }
            page={
              activity.page
            }
            totalPages={
              activity.totalPages
            }
          />
        ) : null}
      </section>

      <section className="mt-9 rounded-[1.75rem] border border-line bg-canvas p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
              Jak czytać Kronikę
            </p>

            <h2 className="mt-1 text-xl font-black">
              Wysłane nie znaczy od razu
              zaakceptowane.
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              Nowe miejsca i formalne
              raporty przechodzą przez
              moderację. Cebuliony
              pojawiają się dopiero wtedy,
              gdy działanie zostanie
              zweryfikowane jako
              wartościowe.
            </p>
          </div>

          <Link
            href="/spolecznosc"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button bg-white px-5 py-2.5 text-sm font-black text-brand-700 shadow-sm transition hover:bg-brand-50"
          >
            Zasady społeczności

            <Icon
              name="arrow-right"
              className="h-4 w-4"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}

function HeaderStat({
  label,
  value,
}: {
  label:
    string;

  value:
    number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-brand-200">
        {label}
      </p>

      <p className="mt-1 text-xl font-black">
        {value}
      </p>
    </div>
  );
}

function ActivityFilter({
  option,
  active,
  count,
}: {
  option: {
    key:
      AccountActivityFilter;

    label:
      string;

    shortLabel:
      string;

    icon:
      IconName;
  };

  active:
    boolean;

  count:
    number;
}) {
  return (
    <Link
      href={
        activityHref(
          option.key,
          1,
        )
      }
      aria-current={
        active
          ? "page"
          : undefined
      }
      className={
        active
          ? "rounded-2xl border border-brand-600 bg-brand-600 p-4 text-white shadow-sm"
          : "rounded-2xl border border-line bg-white p-4 text-ink shadow-sm transition hover:border-brand-200 hover:bg-brand-50"
      }
    >
      <div className="flex items-center justify-between gap-3">
        <Icon
          name={
            option.icon
          }
          className="h-5 w-5"
        />

        <span
          className={
            active
              ? "rounded-full bg-white/15 px-2 py-1 text-[10px] font-black"
              : "rounded-full bg-canvas px-2 py-1 text-[10px] font-black text-muted"
          }
        >
          {count}
        </span>
      </div>

      <p className="mt-3 text-sm font-black sm:hidden">
        {option.shortLabel}
      </p>

      <p className="mt-3 hidden text-sm font-black sm:block">
        {option.label}
      </p>
    </Link>
  );
}

function ActivityEntry({
  item,
}: {
  item:
    AccountActivityItem;
}) {
  return (
    <div className="relative sm:grid sm:grid-cols-[44px_minmax(0,1fr)] sm:gap-4">
      <div className="relative z-10 hidden h-11 w-11 items-center justify-center rounded-full border-4 border-canvas bg-white text-brand-700 shadow-sm sm:flex">
        <Icon
          name={
            activityIcon(
              item,
            )
          }
          className="h-4 w-4"
        />
      </div>

      {item.kind ===
      "submission" ? (
        <SubmissionEntry
          item={
            item
          }
        />
      ) : item.kind ===
        "report" ? (
        <ReportEntry
          item={
            item
          }
        />
      ) : (
        <ReputationEntry
          item={
            item
          }
        />
      )}
    </div>
  );
}

function SubmissionEntry({
  item,
}: {
  item:
    SubmissionActivityItem;
}) {
  const status =
    submissionStatus(
      item.status,
    );

  return (
    <article className="rounded-[1.75rem] border border-line bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-brand-700">
              Dodane miejsce
            </span>

            <StatusBadge
              tone={
                status.tone
              }
            >
              {status.label}
            </StatusBadge>
          </div>

          <h3 className="mt-3 text-xl font-black tracking-[-0.02em]">
            {item.name}
          </h3>

          <p className="mt-1 text-sm font-semibold text-muted">
            {item.categoryName}

            {item.city
              ? " · " +
                item.city
              : ""}
          </p>
        </div>

        <ActivityDate
          value={
            item.createdAt
          }
          label="Wysłano"
        />
      </div>

      <p className="mt-4 text-sm leading-6 text-muted">
        {status.description}
      </p>

      {item.reviewedAt ? (
        <p className="mt-3 text-xs font-semibold text-muted">
          Rozpatrzono:{" "}
          {formatDateTime(
            item.reviewedAt,
          )}
        </p>
      ) : null}

      {item.moderatorNote ? (
        <ModeratorNote>
          {item.moderatorNote}
        </ModeratorNote>
      ) : null}

      {item.rewardPoints ? (
        <RewardNotice
          points={
            item.rewardPoints
          }
          text="Za zaakceptowane miejsce"
        />
      ) : null}
    </article>
  );
}

function ReportEntry({
  item,
}: {
  item:
    ReportActivityItem;
}) {
  const status =
    reportStatus(
      item.status,
    );

  return (
    <article className="rounded-[1.75rem] border border-line bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-accent-700">
              Raport problemu
            </span>

            <StatusBadge
              tone={
                status.tone
              }
            >
              {status.label}
            </StatusBadge>
          </div>

          <h3 className="mt-3 text-xl font-black tracking-[-0.02em]">
            {item.placeName ??
              "Miejsce z mapy"}
          </h3>

          <p className="mt-1 text-sm font-semibold text-muted">
            {reportReasonLabel(
              item.reason,
            )}
          </p>
        </div>

        <ActivityDate
          value={
            item.createdAt
          }
          label="Zgłoszono"
        />
      </div>

      <p className="mt-4 text-sm leading-6 text-muted">
        {status.description}
      </p>

      {item.details ? (
        <div className="mt-4 rounded-2xl bg-canvas p-4">
          <p className="text-xs font-black uppercase tracking-[0.1em] text-muted">
            Twój opis
          </p>

          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink">
            {item.details}
          </p>
        </div>
      ) : null}

      {item.resolvedAt ? (
        <p className="mt-3 text-xs font-semibold text-muted">
          Rozpatrzono:{" "}
          {formatDateTime(
            item.resolvedAt,
          )}
        </p>
      ) : null}

      {item.resolutionNote ? (
        <ModeratorNote>
          {item.resolutionNote}
        </ModeratorNote>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {item.placeName ? (
          <Link
            href={
              "/mapy/miejsce/" +
              item.placeId
            }
            className="inline-flex items-center gap-2 text-sm font-black text-brand-700 hover:underline"
          >
            Otwórz miejsce

            <Icon
              name="arrow-right"
              className="h-4 w-4"
            />
          </Link>
        ) : null}

        {item.rewardPoints ? (
          <RewardNotice
            points={
              item.rewardPoints
            }
            text="Za trafny raport"
            compact
          />
        ) : null}
      </div>
    </article>
  );
}

function ReputationEntry({
  item,
}: {
  item:
    Extract<
      AccountActivityItem,
      {
        kind:
          "reputation";
      }
    >;
}) {
  return (
    <article className="rounded-[1.75rem] border border-brand-200 bg-brand-50 p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-brand-700 shadow-sm">
            Cebuliony
          </span>

          <h3 className="mt-3 text-xl font-black tracking-[-0.02em]">
            {reputationEventLabel(
              item.eventType,
            )}
          </h3>

          <p className="mt-2 text-sm leading-6 text-muted">
            {reputationEventDescription(
              item.eventType,
            )}
          </p>
        </div>

        <div className="rounded-2xl bg-brand-900 px-5 py-4 text-white">
          <p className="text-xs font-black uppercase tracking-[0.1em] text-brand-200">
            Wpadło
          </p>

          <p className="mt-1 text-2xl font-black">
            +
            {item.points}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs font-semibold text-muted">
        Naliczono:{" "}
        {formatDateTime(
          item.createdAt,
        )}
      </p>
    </article>
  );
}

function StatusBadge({
  tone,
  children,
}: {
  tone:
    "good"
    | "waiting"
    | "bad";

  children:
    ReactNode;
}) {
  const className =
    tone ===
    "good"
      ? "bg-brand-100 text-brand-800"
      : tone ===
          "bad"
        ? "bg-danger-50 text-danger-600"
        : "bg-accent-50 text-accent-700";

  return (
    <span
      className={
        "rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] " +
        className
      }
    >
      {children}
    </span>
  );
}

function ActivityDate({
  value,
  label,
}: {
  value:
    string;

  label:
    string;
}) {
  return (
    <div className="shrink-0 text-right">
      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-subtle">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-muted">
        {formatDateTime(
          value,
        )}
      </p>
    </div>
  );
}

function ModeratorNote({
  children,
}: {
  children:
    ReactNode;
}) {
  return (
    <div className="mt-4 rounded-2xl border border-line bg-canvas p-4">
      <p className="text-xs font-black uppercase tracking-[0.1em] text-brand-700">
        Notatka moderatora
      </p>

      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink">
        {children}
      </p>
    </div>
  );
}

function RewardNotice({
  points,
  text,
  compact = false,
}: {
  points:
    number;

  text:
    string;

  compact?:
    boolean;
}) {
  return (
    <div
      className={
        compact
          ? "inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-2 text-xs font-black text-brand-800"
          : "mt-4 flex items-center justify-between gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4"
      }
    >
      <span>
        {text}
      </span>

      <span className="shrink-0">
        +
        {points} C
      </span>
    </div>
  );
}

function EmptyActivity({
  filter,
}: {
  filter:
    AccountActivityFilter;
}) {
  const content =
    emptyContent(
      filter,
    );

  return (
    <div className="mt-6 rounded-[2rem] border border-dashed border-line bg-white p-7 text-center sm:p-10">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        <Icon
          name={
            content.icon
          }
          className="h-6 w-6"
        />
      </div>

      <h3 className="mt-4 text-xl font-black">
        {content.title}
      </h3>

      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted">
        {content.description}
      </p>

      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/mapy/dodaj"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button bg-brand-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-brand-700"
        >
          Dodaj miejsce

          <Icon
            name="map-pin"
            className="h-4 w-4"
          />
        </Link>

        <Link
          href="/mapy"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button border border-line bg-white px-5 py-2.5 text-sm font-black transition hover:bg-brand-50"
        >
          Przejdź do mapy
        </Link>
      </div>
    </div>
  );
}

function Pagination({
  filter,
  page,
  totalPages,
}: {
  filter:
    AccountActivityFilter;

  page:
    number;

  totalPages:
    number;
}) {
  return (
    <nav
      aria-label="Stronicowanie aktywności"
      className="mt-7 flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-3 shadow-sm"
    >
      {page >
      1 ? (
        <Link
          href={
            activityHref(
              filter,
              page -
                1,
            )
          }
          className="inline-flex min-h-10 items-center rounded-xl px-3 text-sm font-black text-brand-700 transition hover:bg-brand-50"
        >
          ← Nowsze
        </Link>
      ) : (
        <span className="min-h-10 px-3" />
      )}

      <span className="text-xs font-black text-muted">
        Strona{" "}
        {page} z{" "}
        {totalPages}
      </span>

      {page <
      totalPages ? (
        <Link
          href={
            activityHref(
              filter,
              page +
                1,
            )
          }
          className="inline-flex min-h-10 items-center rounded-xl px-3 text-sm font-black text-brand-700 transition hover:bg-brand-50"
        >
          Starsze →
        </Link>
      ) : (
        <span className="min-h-10 px-3" />
      )}
    </nav>
  );
}

function submissionStatus(
  status:
    SubmissionActivityItem["status"],
): {
  label:
    string;

  description:
    string;

  tone:
    "good"
    | "waiting"
    | "bad";
} {
  switch (status) {
    case "approved":
      return {
        label:
          "Opublikowane",

        description:
          "Miejsce przeszło moderację i zostało zaakceptowane. Cebula dostała urzędową pieczątkę.",

        tone:
          "good",
      };

    case "rejected":
      return {
        label:
          "Odrzucone",

        description:
          "Moderator nie opublikował tego zgłoszenia. Jeśli zostawił uzasadnienie, znajdziesz je poniżej.",

        tone:
          "bad",
      };

    default:
      return {
        label:
          "Oczekuje",

        description:
          "Zgłoszenie siedzi w kolejce moderacyjnej. Na mapę trafi dopiero po sprawdzeniu.",

        tone:
          "waiting",
      };
  }
}

function reportStatus(
  status:
    ReportActivityItem["status"],
): {
  label:
    string;

  description:
    string;

  tone:
    "good"
    | "waiting"
    | "bad";
} {
  switch (status) {
    case "resolved":
      return {
        label:
          "Uznane",

        description:
          "Raport został uznany, miejsce poprawiono i ponownie zweryfikowano.",

        tone:
          "good",
      };

    case "dismissed":
      return {
        label:
          "Odrzucone",

        description:
          "Moderator zamknął raport bez uznania problemu. Uzasadnienie, jeśli zostało zapisane, zobaczysz poniżej.",

        tone:
          "bad",
      };

    default:
      return {
        label:
          "W moderacji",

        description:
          "Raport czeka na sprawdzenie. Samo zgłoszenie nie usuwa ani nie zmienia miejsca na mapie.",

        tone:
          "waiting",
      };
  }
}

function reportReasonLabel(
  reason:
    ReportReason,
): string {
  switch (reason) {
    case "outdated":
      return "Nieaktualne dane";

    case "closed":
      return "Miejsce zamknięte";

    case "wrong_location":
      return "Błędna lokalizacja";

    case "wrong_information":
      return "Błędne informacje";

    case "duplicate":
      return "Duplikat";

    case "other":
      return "Inny problem";
  }
}

function reputationEventLabel(
  eventType:
    ReputationEventType,
): string {
  switch (eventType) {
    case "place_approved":
      return "Miejsce dostało zielone światło";

    case "valid_report":
      return "Raport okazał się trafny";
  }
}

function reputationEventDescription(
  eventType:
    ReputationEventType,
): string {
  switch (eventType) {
    case "place_approved":
      return "Moderator zaakceptował zgłoszone przez Ciebie miejsce i zostało naliczone wynagrodzenie reputacyjne.";

    case "valid_report":
      return "Twój raport doprowadził do poprawienia istniejącego miejsca i został uznany za wartościowy.";
  }
}

function activityIcon(
  item:
    AccountActivityItem,
): IconName {
  switch (item.kind) {
    case "submission":
      return "map-pin";

    case "report":
      return "shield-check";

    case "reputation":
      return "wallet";
  }
}

function filterTitle(
  filter:
    AccountActivityFilter,
): string {
  switch (filter) {
    case "places":
      return "Dodane miejsca";

    case "reports":
      return "Raporty problemów";

    case "cebulions":
      return "Historia Cebulionów";

    case "all":
    default:
      return "Cała kronika";
  }
}

function emptyContent(
  filter:
    AccountActivityFilter,
): {
  icon:
    IconName;

  title:
    string;

  description:
    string;
} {
  switch (filter) {
    case "places":
      return {
        icon:
          "map-pin",

        title:
          "Jeszcze nic nie zgłosiłeś do mapy.",

        description:
          "Gdy dodasz pierwsze miejsce, tutaj zobaczysz jego status i wynik moderacji.",
      };

    case "reports":
      return {
        icon:
          "shield-check",

        title:
          "Brak raportów. I bardzo dobrze.",

        description:
          "Jeśli kiedyś znajdziesz błędne albo nieaktualne miejsce, jego raport pojawi się właśnie tutaj.",
      };

    case "cebulions":
      return {
        icon:
          "wallet",

        title:
          "Portfel jeszcze nie szeleści.",

        description:
          "Pierwsze Cebuliony pojawią się po zaakceptowaniu wartościowego miejsca albo trafnego raportu.",
      };

    case "all":
    default:
      return {
        icon:
          "route",

        title:
          "Kronika jeszcze pachnie drukarnią.",

        description:
          "Dodaj miejsce albo pomóż poprawić istniejące dane. Pierwsze wpisy pojawią się tutaj automatycznie.",
      };
  }
}

function activityHref(
  filter:
    AccountActivityFilter,

  page:
    number,
): string {
  const params =
    new URLSearchParams();

  if (
    filter !==
    "all"
  ) {
    params.set(
      "filter",
      filter,
    );
  }

  if (
    page >
    1
  ) {
    params.set(
      "page",
      String(
        page,
      ),
    );
  }

  const query =
    params.toString();

  return query
    ? "/konto/aktywnosc?" +
        query
    : "/konto/aktywnosc";
}

function resultWord(
  count:
    number,
): string {
  if (
    count ===
    1
  ) {
    return "wpis";
  }

  const lastDigit =
    count %
    10;

  const lastTwoDigits =
    count %
    100;

  if (
    lastDigit >=
      2 &&
    lastDigit <=
      4 &&
    !(
      lastTwoDigits >=
        12 &&
      lastTwoDigits <=
        14
    )
  ) {
    return "wpisy";
  }

  return "wpisów";
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
  value:
    string,
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