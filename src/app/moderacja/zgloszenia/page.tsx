import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  connection,
} from "next/server";

import { ModerationTabs } from "@/components/moderation/moderation-tabs";

import { Icon } from "@/components/ui/icon";

import { requireStaff } from "@/lib/moderation/auth";

import { getModerationReportQueue } from "@/lib/moderation/data";

import type {
  PlaceReportReason,
} from "@/lib/maps/community-types";

export const instant =
  false;

export const metadata: Metadata = {
  title:
    "Zgłoszone problemy",

  description:
    "Moderacja problemów zgłoszonych dla miejsc w Januszowni.",
};

interface ReportsPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

export default async function ReportsPage({
  searchParams,
}: ReportsPageProps) {
  /*
   * Cała strona jest zależna
   * od zalogowanego moderatora.
   */
  await connection();

  await requireStaff();

  const [
    reports,
    params,
  ] =
    await Promise.all([
      getModerationReportQueue(),
      searchParams,
    ]);

  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-bold text-brand-700">
              <Icon
                name="map-pin"
                className="h-4 w-4"
              />

              Utrzymanie danych
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Zgłoszone problemy
            </h1>

            <p className="mt-5 max-w-2xl leading-7 text-muted">
              Tutaj poprawiamy
              lub odrzucamy
              zgłoszenia dotyczące
              miejsc, które są już
              publiczne.
            </p>

            <div className="mt-7">
              <ModerationTabs
                active="reports"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {params.message ? (
          <div className="mb-6 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm font-bold text-brand-800">
            {params.message}
          </div>
        ) : null}

        {params.error ? (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-danger-600/20 bg-danger-50 p-4 text-sm font-bold text-danger-600"
          >
            {params.error}
          </div>
        ) : null}

        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black">
            Oczekujące
          </h2>

          <span className="rounded-full bg-canvas px-4 py-2 text-sm font-black">
            {reports.length}
          </span>
        </div>

        {reports.length ===
        0 ? (
          <div className="rounded-[2rem] border border-line bg-white p-10 text-center shadow-sm">
            <Icon
              name="check"
              className="mx-auto h-8 w-8 text-brand-700"
            />

            <h2 className="mt-4 text-2xl font-black">
              Wszystko
              sprawdzone.
            </h2>

            <p className="mt-2 text-sm text-muted">
              Nie ma obecnie
              otwartych zgłoszeń.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map(
              (report) => (
                <article
                  key={
                    report.report_id
                  }
                  className="rounded-[1.5rem] border border-line bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-danger-50 px-3 py-1 text-xs font-black text-danger-600">
                          {reasonLabel(
                            report.reason,
                          )}
                        </span>

                        <span className="rounded-full bg-canvas px-3 py-1 text-xs font-bold text-muted">
                          {
                            report.category_name
                          }
                        </span>
                      </div>

                      <h3 className="mt-3 truncate text-lg font-black">
                        {
                          report.place_name
                        }
                      </h3>

                      {report.place_city ? (
                        <p className="mt-1 text-sm text-muted">
                          {
                            report.place_city
                          }
                        </p>
                      ) : null}

                      {report.details ? (
                        <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-muted">
                          {
                            report.details
                          }
                        </p>
                      ) : null}

                      <p className="mt-3 text-xs text-subtle">
                        Zgłoszono{" "}
                        {formatDateTime(
                          report.report_created_at,
                        )}
                      </p>
                    </div>

                    <Link
                      href={`/moderacja/zgloszenia/${report.report_id}`}
                      className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-button bg-brand-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-brand-700"
                    >
                      Sprawdź
                    </Link>
                  </div>
                </article>
              ),
            )}
          </div>
        )}
      </div>
    </>
  );
}

function reasonLabel(
  reason:
    PlaceReportReason,
): string {
  switch (reason) {
    case "outdated":
      return "Nieaktualne";

    case "closed":
      return "Miejsce zamknięte";

    case "wrong_location":
      return "Błędna lokalizacja";

    case "wrong_information":
      return "Błędne dane";

    case "duplicate":
      return "Duplikat";

    default:
      return "Inny problem";
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
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "brak daty";
  }

  return dateTimeFormatter.format(
    date,
  );
}