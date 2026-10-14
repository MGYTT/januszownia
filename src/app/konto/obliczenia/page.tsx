import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  DeleteSavedCalculationButton,
} from "@/components/account/delete-saved-calculation-button";

import {
  Icon,
  type IconName,
} from "@/components/ui/icon";

import {
  getSavedCalculations,
  normalizeSavedCalculationPage,
} from "@/lib/account/saved-calculations";

import {
  requireAuthenticatedUser,
} from "@/lib/auth/server-session";

import {
  getAvailableTools,
  type ToolDefinition,
} from "@/lib/tools/catalog";

export const instant =
  false;

export const metadata: Metadata = {
  title:
    "Zapisane obliczenia",

  description:
    "Prywatna szuflada z zapisanymi wynikami kalkulatorów Januszowni.",
};

interface SavedCalculationsPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function SavedCalculationsPage({
  searchParams,
}: SavedCalculationsPageProps) {
  const {
    supabase,
    userId,
  } =
    await requireAuthenticatedUser();

  const params =
    await searchParams;

  const calculations =
    await getSavedCalculations(
      supabase,
      userId,
      normalizeSavedCalculationPage(
        params.page,
      ),
    );

  const tools =
    new Map<string, ToolDefinition>(
      getAvailableTools().map(
        (
          tool,
        ) =>
          [
            tool.slug,
            tool,
          ] as const,
      ),
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link
        href="/konto"
        className="inline-flex items-center gap-2 text-sm font-black text-brand-700 hover:underline"
      >
        ← Wróć do Teczki Cebularza
      </Link>

      <header className="mt-6 overflow-hidden rounded-[2rem] border border-line bg-white shadow-card">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-700">
              Konto · obliczenia
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Szuflada z obliczeniami
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted sm:text-base">
              Wynik, który warto zachować,
              nie musi kończyć życia po
              zamknięciu karty. Tu trzymasz
              własne zapisy z kalkulatorów
              Januszowni.
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-brand-900 px-6 py-5 text-white">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-brand-200">
              W szufladzie
            </p>

            <p className="mt-1 text-4xl font-black tracking-[-0.04em]">
              {
                calculations.totalItems
              }
            </p>

            <p className="mt-1 text-xs font-bold text-brand-100">
              {
                calculationWord(
                  calculations.totalItems,
                )
              }
            </p>
          </div>
        </div>
      </header>

      {calculations.items.length ===
      0 ? (
        <EmptyState />
      ) : (
        <section className="mt-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
                Prywatne zapisy
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-[-0.03em] sm:text-3xl">
                Najnowsze leżą na wierzchu.
              </h2>
            </div>

            <p className="text-xs font-bold text-muted">
              Tylko Ty masz dostęp do tej listy.
            </p>
          </div>

          <div className="mt-5 divide-y divide-line overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm">
            {calculations.items.map(
              (
                calculation,
              ) => {
                const tool =
                  tools.get(
                    calculation.toolSlug,
                  );

                return (
                  <SavedCalculationRow
                    key={
                      calculation.id
                    }
                    id={
                      calculation.id
                    }
                    title={
                      calculation.title
                    }
                    resultSummary={
                      calculation.resultSummary
                    }
                    createdAt={
                      calculation.createdAt
                    }
                    toolVersion={
                      calculation.toolVersion
                    }
                    tool={
                      tool
                    }
                    fallbackSlug={
                      calculation.toolSlug
                    }
                  />
                );
              },
            )}
          </div>

          {calculations.totalPages >
          1 ? (
            <Pagination
              page={
                calculations.page
              }
              totalPages={
                calculations.totalPages
              }
            />
          ) : null}
        </section>
      )}

      <section className="mt-8 rounded-[1.75rem] border border-line bg-canvas p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-brand-700">
              Co dokładnie zapisujemy?
            </p>

            <h2 className="mt-1 text-xl font-black">
              Liczby, nie zrzut ekranu.
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              Każdy zapis zachowuje
              strukturalne dane wejściowe,
              policzony wynik, nazwę
              narzędzia i jego wersję.
              Dzięki temu możemy później
              bezpiecznie dodać dokładne
              wczytywanie starych analiz,
              zamiast próbować odtwarzać je
              z tekstu albo obrazka.
            </p>
          </div>

          <Link
            href="/narzedzia"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button bg-white px-5 py-2.5 text-sm font-black text-brand-700 shadow-sm transition hover:bg-brand-50"
          >
            Otwórz narzędzia

            <Icon
              name="calculator"
              className="h-4 w-4"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}

function SavedCalculationRow({
  id,
  title,
  resultSummary,
  createdAt,
  toolVersion,
  tool,
  fallbackSlug,
}: {
  id:
    string;

  title:
    string;

  resultSummary:
    string;

  createdAt:
    string;

  toolVersion:
    number;

  tool:
    ToolDefinition | undefined;

  fallbackSlug:
    string;
}) {
  const icon:
    IconName =
      tool?.icon ??
      "calculator";

  return (
    <article className="grid gap-4 p-5 sm:p-6 lg:grid-cols-[48px_minmax(0,1fr)_auto] lg:items-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <Icon
          name={
            icon
          }
          className="h-5 w-5"
        />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-canvas px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-muted">
            {tool?.shortTitle ??
              fallbackSlug}
          </span>

          <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-subtle">
            model v
            {toolVersion}
          </span>
        </div>

        <h2 className="mt-2 truncate text-lg font-black text-ink">
          {title}
        </h2>

        <p className="mt-2 text-sm font-semibold leading-6 text-ink">
          {resultSummary}
        </p>

        <p className="mt-1 text-xs font-semibold text-muted">
          Zapisano{" "}
          {formatDateTime(
            createdAt,
          )}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
        {tool?.href ? (
          <Link
            href={
              tool.href
            }
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-button bg-brand-600 px-4 py-2 text-xs font-black text-white transition hover:bg-brand-700"
          >
            Otwórz kalkulator

            <Icon
              name="arrow-right"
              className="h-3.5 w-3.5"
            />
          </Link>
        ) : (
          <span className="inline-flex min-h-10 items-center justify-center rounded-button bg-canvas px-4 py-2 text-xs font-black text-muted">
            Narzędzie niedostępne
          </span>
        )}

        <DeleteSavedCalculationButton
          id={
            id
          }
        />
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <section className="mt-8 rounded-[2rem] border border-dashed border-line bg-white p-7 text-center shadow-sm sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        <Icon
          name="calculator"
          className="h-6 w-6"
        />
      </div>

      <h2 className="mt-5 text-2xl font-black tracking-[-0.03em]">
        Szuflada jeszcze pusta.
      </h2>

      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
        Policz coś w jednym z narzędzi.
        Pod wynikiem znajdziesz przycisk
        zapisu — bez przepisywania liczb
        do zeszytu w kratkę.
      </p>

      <Link
        href="/narzedzia"
        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-button bg-brand-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-brand-700"
      >
        Idź do kalkulatorów

        <Icon
          name="arrow-right"
          className="h-4 w-4"
        />
      </Link>
    </section>
  );
}

function Pagination({
  page,
  totalPages,
}: {
  page:
    number;

  totalPages:
    number;
}) {
  return (
    <nav
      aria-label="Stronicowanie zapisanych obliczeń"
      className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-3 shadow-sm"
    >
      {page >
      1 ? (
        <Link
          href={
            savedCalculationsHref(
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
            savedCalculationsHref(
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

function savedCalculationsHref(
  page:
    number,
): string {
  return page <=
    1
    ? "/konto/obliczenia"
    : "/konto/obliczenia?page=" +
        page;
}

function calculationWord(
  count:
    number,
): string {
  if (
    count ===
    1
  ) {
    return "zapisane obliczenie";
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
    return "zapisane obliczenia";
  }

  return "zapisanych obliczeń";
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
    ? "—"
    : dateTimeFormatter.format(
        date,
      );
}