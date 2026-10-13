import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import {
  connection,
} from "next/server";

import { ReportReviewForm } from "@/components/moderation/report-review-form";

import { requireStaff } from "@/lib/moderation/auth";

import { getModerationReportDetail } from "@/lib/moderation/data";

import { validateReportId } from "@/lib/moderation/validation";

import { getMapCategories } from "@/lib/maps/data";

import type {
  PlaceReportReason,
} from "@/lib/maps/community-types";

export const instant =
  false;

export const metadata: Metadata = {
  title:
    "Sprawdź zgłoszenie",

  description:
    "Weryfikacja zgłoszonego problemu z miejscem.",
};

interface ReportDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReportDetailPage({
  params,
}: ReportDetailPageProps) {
  /*
   * Auth, RPC i dane moderatora
   * są request-specific.
   */
  await connection();

  await requireStaff();

  const {
    id,
  } =
    await params;

  if (
    !validateReportId(
      id,
    ).valid
  ) {
    notFound();
  }

  const [
    report,
    categories,
  ] =
    await Promise.all([
      getModerationReportDetail(
        id,
      ),

      getMapCategories(),
    ]);

  if (!report) {
    notFound();
  }

  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/moderacja/zgloszenia"
            className="text-sm font-bold text-brand-700 hover:underline"
          >
            ← Wróć do zgłoszeń
          </Link>

          <div className="mt-7">
            <span className="rounded-full bg-danger-50 px-3 py-1.5 text-xs font-black text-danger-600">
              {reasonLabel(
                report.reason,
              )}
            </span>

            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              {report.name}
            </h1>

            <p className="mt-3 text-sm text-muted">
              Zgłoszono{" "}
              {formatDateTime(
                report.report_created_at,
              )}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-7 grid gap-5 md:grid-cols-2">
          <section className="rounded-[2rem] border border-line bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
              Treść zgłoszenia
            </p>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted">
              {report.details ??
                "Użytkownik nie podał dodatkowego opisu."}
            </p>
          </section>

          <section className="rounded-[2rem] border border-line bg-canvas p-6">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
              Obecny rekord
            </p>

            <p className="mt-3 font-black">
              {
                report.category_name
              }
            </p>

            <p className="mt-2 text-sm text-muted">
              {[
                report.address,
                report.city,
              ]
                .filter(
                  Boolean,
                )
                .join(", ") ||
                "Brak adresu"}
            </p>

            <Link
              href={`/mapy/miejsce/${report.place_id}`}
              target="_blank"
              className="mt-4 inline-block text-sm font-black text-brand-700 hover:underline"
            >
              Otwórz publiczną
              kartę ↗
            </Link>
          </section>
        </div>

        <ReportReviewForm
          report={
            report
          }
          categories={
            categories
          }
        />
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
      return "Błędne informacje";

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