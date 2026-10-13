import type {
  Metadata,
} from "next";

import {
  connection,
} from "next/server";

import {
  approveSubmission,
  rejectSubmission,
} from "@/app/moderacja/actions";

import { ModerationTabs } from "@/components/moderation/moderation-tabs";

import { SubmissionMap } from "@/components/moderation/submission-map";

import { Icon } from "@/components/ui/icon";

import { requireStaff } from "@/lib/moderation/auth";

import { getModerationQueue } from "@/lib/moderation/data";

export const instant =
  false;

export const metadata: Metadata = {
  title:
    "Moderacja nowych miejsc",

  description:
    "Panel moderacyjny Januszowni.",
};

interface ModerationPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

export default async function ModerationPage({
  searchParams,
}: ModerationPageProps) {
  /*
   * Ta strona jest w całości prywatna
   * i zależy od sesji aktualnego użytkownika.
   *
   * Supabase podczas walidacji tokenu może
   * korzystać z bieżącego czasu, dlatego
   * przechodzimy do request-time zanim
   * utworzymy klienta Auth lub wywołamy RPC.
   */
  await connection();

  await requireStaff();

  const [
    submissions,
    params,
  ] =
    await Promise.all([
      getModerationQueue(),
      searchParams,
    ]);

  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-bold text-brand-700">
              <Icon
                name="check"
                className="h-4 w-4"
              />

              Panel moderacyjny
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Moderacja Januszowni
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Najpierw
              weryfikujemy nowe
              miejsca. Osobna
              kolejka obsługuje
              problemy dotyczące
              już opublikowanych
              punktów.
            </p>

            <div className="mt-7">
              <ModerationTabs
                active="submissions"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
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
            Nowe miejsca
          </h2>

          <span className="rounded-full bg-canvas px-4 py-2 text-sm font-black">
            {submissions.length}
          </span>
        </div>

        {submissions.length ===
        0 ? (
          <EmptyQueue />
        ) : (
          <div className="space-y-7">
            {submissions.map(
              (submission) => (
                <article
                  key={
                    submission.id
                  }
                  className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-card"
                >
                  <div className="grid lg:grid-cols-[1fr_420px]">
                    <div className="p-5 sm:p-7 lg:p-8">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-black text-brand-700">
                          {
                            submission.category_name
                          }
                        </span>

                        <span className="rounded-full bg-accent-50 px-3 py-1.5 text-xs font-black text-accent-700">
                          Oczekuje
                        </span>
                      </div>

                      <h3 className="mt-5 text-2xl font-black tracking-tight">
                        {
                          submission.name
                        }
                      </h3>

                      {submission.description ? (
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted">
                          {
                            submission.description
                          }
                        </p>
                      ) : null}

                      <dl className="mt-7 grid gap-4 sm:grid-cols-2">
                        <Info
                          label="Adres"
                          value={
                            submission.address ??
                            "Brak"
                          }
                        />

                        <Info
                          label="Miasto"
                          value={
                            submission.city ??
                            "Brak"
                          }
                        />

                        <Info
                          label="Latitude"
                          value={submission.latitude.toFixed(
                            6,
                          )}
                        />

                        <Info
                          label="Longitude"
                          value={submission.longitude.toFixed(
                            6,
                          )}
                        />
                      </dl>

                      <div className="mt-7 rounded-2xl bg-canvas p-5">
                        <p className="text-xs font-black uppercase tracking-[0.12em] text-brand-700">
                          Zgłaszający
                        </p>

                        <p className="mt-2 font-black">
                          {
                            submission.submitter_name
                          }
                        </p>

                        {submission.submitter_username ? (
                          <p className="mt-1 text-sm text-muted">
                            @
                            {
                              submission.submitter_username
                            }
                          </p>
                        ) : null}

                        <p className="mt-3 text-xs text-subtle">
                          {formatDateTime(
                            submission.created_at,
                          )}
                        </p>
                      </div>

                      {submission.source_label ||
                      submission.source_url ? (
                        <div className="mt-5 rounded-2xl border border-line p-5">
                          <p className="text-xs font-black uppercase tracking-[0.12em] text-brand-700">
                            Źródło
                          </p>

                          {submission.source_label ? (
                            <p className="mt-2 text-sm font-bold">
                              {
                                submission.source_label
                              }
                            </p>
                          ) : null}

                          {submission.source_url ? (
                            <a
                              href={
                                submission.source_url
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 block break-all text-sm font-bold text-brand-700 hover:underline"
                            >
                              Otwórz
                              źródło ↗
                            </a>
                          ) : null}
                        </div>
                      ) : null}
                    </div>

                    <div className="border-t border-line bg-canvas p-5 sm:p-7 lg:border-l lg:border-t-0">
                      <SubmissionMap
                        latitude={
                          submission.latitude
                        }
                        longitude={
                          submission.longitude
                        }
                      />

                      <form className="mt-6">
                        <input
                          type="hidden"
                          name="submissionId"
                          value={
                            submission.id
                          }
                        />

                        <label
                          htmlFor={`note-${submission.id}`}
                          className="mb-2 block text-sm font-black"
                        >
                          Notatka
                          moderatora
                        </label>

                        <textarea
                          id={`note-${submission.id}`}
                          name="note"
                          maxLength={1000}
                          rows={4}
                          placeholder="Opcjonalna przy zatwierdzeniu. Przy odrzuceniu warto opisać powód."
                          className="w-full resize-y rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition placeholder:text-subtle focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
                        />

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <button
                            type="submit"
                            formAction={
                              approveSubmission
                            }
                            className="min-h-12 rounded-button bg-brand-600 px-4 py-3 text-sm font-black text-white transition hover:bg-brand-700"
                          >
                            ✓ Zatwierdź
                          </button>

                          <button
                            type="submit"
                            formAction={
                              rejectSubmission
                            }
                            className="min-h-12 rounded-button border border-danger-600/30 bg-white px-4 py-3 text-sm font-black text-danger-600 transition hover:bg-danger-50"
                          >
                            Odrzuć
                          </button>
                        </div>
                      </form>
                    </div>
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

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="text-xs font-bold text-muted">
        {label}
      </dt>

      <dd className="mt-1 break-words text-sm font-black">
        {value}
      </dd>
    </div>
  );
}

function EmptyQueue() {
  return (
    <div className="rounded-[2rem] border border-line bg-white p-8 text-center shadow-sm sm:p-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        <Icon
          name="check"
          className="h-7 w-7"
        />
      </div>

      <h2 className="mt-5 text-2xl font-black">
        Brak nowych miejsc.
      </h2>

      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted">
        Kolejka nowych
        zgłoszeń jest obecnie
        pusta.
      </p>
    </div>
  );
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
    return "Brak danych";
  }

  return dateTimeFormatter.format(
    date,
  );
}