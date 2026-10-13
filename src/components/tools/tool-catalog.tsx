"use client";

import Link from "next/link";

import {
  useMemo,
  useState,
} from "react";

import {
  Icon,
} from "@/components/ui/icon";

import {
  toolCatalog,
  type ToolCategory,
  type ToolDefinition,
} from "@/lib/tools/catalog";

type ToolFilter =
  | "Wszystkie"
  | ToolCategory;

interface FilterDefinition {
  value: ToolFilter;
  label: string;
  emoji: string;
}

const filters:
  FilterDefinition[] = [
    {
      value:
        "Wszystkie",

      label:
        "Wszystkie",

      emoji:
        "🧰",
    },

    {
      value:
        "Jedzenie",

      label:
        "Jedzenie",

      emoji:
        "🍕",
    },

    {
      value:
        "Samochód",

      label:
        "Auto",

      emoji:
        "🚗",
    },

    {
      value:
        "Zakupy",

      label:
        "Zakupy",

      emoji:
        "🛒",
    },

    {
      value:
        "Dom",

      label:
        "Dom",

      emoji:
        "🏠",
    },

    {
      value:
        "Pieniądze",

      label:
        "Kasa",

      emoji:
        "💸",
    },

    {
      value:
        "Podróże",

      label:
        "Trasa",

      emoji:
        "🗺️",
    },
  ];

export function ToolCatalog() {
  const [
    activeFilter,
    setActiveFilter,
  ] =
    useState<ToolFilter>(
      "Wszystkie",
    );

  const [
    query,
    setQuery,
  ] =
    useState(
      "",
    );

  const normalizedQuery =
    normalize(
      query,
    );

  const visibleTools =
    useMemo(
      () =>
        toolCatalog.filter(
          (
            tool,
          ) => {
            const categoryMatches =
              activeFilter ===
                "Wszystkie" ||
              tool.category ===
                activeFilter;

            if (
              !categoryMatches
            ) {
              return false;
            }

            if (
              !normalizedQuery
            ) {
              return true;
            }

            const searchable =
              normalize(
                [
                  tool.title,
                  tool.shortTitle,
                  tool.memeLine,
                  tool.description,
                  tool.whatYouGet,
                  tool.category,
                  ...tool.keywords,
                ].join(
                  " ",
                ),
              );

            return searchable.includes(
              normalizedQuery,
            );
          },
        ),
      [
        activeFilter,
        normalizedQuery,
      ],
    );

  const activeCount =
    visibleTools.filter(
      (
        tool,
      ) =>
        tool.status ===
        "available",
    ).length;

  const hasActiveFilters =
    activeFilter !==
      "Wszystkie" ||
    query.trim() !==
      "";

  function resetFilters() {
    setActiveFilter(
      "Wszystkie",
    );

    setQuery(
      "",
    );
  }

  return (
    <section>
      <div className="rounded-[1.7rem] border border-line bg-white p-4 shadow-card sm:p-5 lg:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-brand-700">
              Wyszukiwarka cebularza
            </p>

            <h2 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">
              Co dziś kombinujemy?
            </h2>
          </div>

          <p className="max-w-lg text-xs leading-5 text-muted sm:text-right">
            Nie musisz znać nazwy
            narzędzia. Napisz problem:
            paliwo, pizza, prąd,
            promocja, prysznic…
          </p>
        </div>

        <div className="relative mt-5">
          <Icon
            name="search"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
          />

          <input
            id="tool-search"
            type="search"
            value={
              query
            }
            onChange={
              (
                event,
              ) =>
                setQuery(
                  event.target.value,
                )
            }
            placeholder="Np. czy ta promocja ma sens?"
            className="h-14 w-full rounded-2xl border border-line bg-canvas pl-12 pr-20 text-base font-semibold outline-none transition placeholder:font-normal placeholder:text-subtle focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
          />

          {query ? (
            <button
              type="button"
              onClick={
                () =>
                  setQuery(
                    "",
                  )
              }
              className="absolute right-2.5 top-1/2 min-h-9 -translate-y-1/2 rounded-xl px-3 text-xs font-black text-brand-700 transition hover:bg-brand-50"
            >
              Wyczyść
            </button>
          ) : null}
        </div>

        <div
          className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Kategorie narzędzi"
        >
          {filters.map(
            (
              filter,
            ) => {
              const active =
                activeFilter ===
                filter.value;

              const count =
                toolCatalog.filter(
                  (
                    tool,
                  ) =>
                    filter.value ===
                      "Wszystkie" ||
                    tool.category ===
                      filter.value,
                ).length;

              return (
                <button
                  key={
                    filter.value
                  }
                  type="button"
                  aria-pressed={
                    active
                  }
                  onClick={
                    () =>
                      setActiveFilter(
                        filter.value,
                      )
                  }
                  className={[
                    "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-black transition",
                    active
                      ? "border-brand-600 bg-brand-600 text-white shadow-sm"
                      : "border-line bg-white text-muted hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800",
                  ].join(
                    " ",
                  )}
                >
                  <span
                    aria-hidden="true"
                  >
                    {filter.emoji}
                  </span>

                  <span>
                    {filter.label}
                  </span>

                  <span
                    className={[
                      "rounded-full px-1.5 py-0.5 text-[10px]",
                      active
                        ? "bg-white/15 text-white"
                        : "bg-canvas text-subtle",
                    ].join(
                      " ",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            },
          )}
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3 px-1">
        <div>
          <p className="text-sm font-black">
            {activeCount}{" "}
            {toolWord(
              activeCount,
            )}{" "}
            gotowe do roboty
          </p>

          <p className="mt-0.5 text-xs text-muted">
            Liczymy na danych, które
            wpiszesz. Bez magicznych
            „średnich z internetu”.
          </p>
        </div>

        {hasActiveFilters ? (
          <button
            type="button"
            onClick={
              resetFilters
            }
            className="min-h-10 rounded-xl border border-line bg-white px-3 text-xs font-black text-brand-700 transition hover:bg-brand-50"
          >
            Pokaż wszystko
          </button>
        ) : null}
      </div>

      {visibleTools.length >
      0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleTools.map(
            (
              tool,
            ) => (
              <ToolCard
                key={
                  tool.slug
                }
                tool={
                  tool
                }
              />
            ),
          )}
        </div>
      ) : (
        <EmptyState
          onReset={
            resetFilters
          }
        />
      )}
    </section>
  );
}

function ToolCard({
  tool,
}: {
  tool:
    ToolDefinition;
}) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-100 bg-brand-50 text-brand-700">
          <Icon
            name={
              tool.icon
            }
            className="h-5 w-5"
          />
        </div>

        <span
          className={[
            "rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em]",
            tool.status ===
            "available"
              ? "bg-brand-100 text-brand-800"
              : "bg-canvas text-muted",
          ].join(
            " ",
          )}
        >
          {tool.status ===
          "available"
            ? "Gotowe"
            : "W planach"}
        </span>
      </div>

      <div className="mt-5">
        <p className="text-[11px] font-black uppercase tracking-[0.12em] text-brand-700">
          {tool.category}
        </p>

        <h3 className="mt-1 text-xl font-black tracking-[-0.02em] text-ink">
          {tool.title}
        </h3>
      </div>

      <div className="mt-4 rounded-2xl border border-accent-200 bg-accent-50 px-4 py-3">
        <p className="text-sm font-black leading-5 text-accent-700">
          „{tool.memeLine}”
        </p>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted">
        {tool.description}
      </p>

      <div className="mt-4 flex gap-2 rounded-2xl bg-canvas px-4 py-3">
        <Icon
          name="check"
          className="mt-0.5 h-4 w-4 shrink-0 text-brand-700"
        />

        <p className="text-xs font-semibold leading-5 text-ink">
          {tool.whatYouGet}
        </p>
      </div>

      {tool.status ===
      "available" ? (
        <span className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-black text-white transition group-hover:bg-brand-700">
          Policz bez ściemy

          <Icon
            name="arrow-right"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
          />
        </span>
      ) : (
        <span className="mt-5 inline-flex min-h-10 items-center text-sm font-bold text-subtle">
          Jeszcze grzejemy kalkulator
        </span>
      )}
    </>
  );

  if (
    tool.status ===
      "available" &&
    tool.href
  ) {
    return (
      <Link
        href={
          tool.href
        }
        className="group flex h-full flex-col rounded-[1.6rem] border border-line bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card sm:p-6"
      >
        {content}
      </Link>
    );
  }

  return (
    <article className="flex h-full flex-col rounded-[1.6rem] border border-line bg-canvas p-5 opacity-80 sm:p-6">
      {content}
    </article>
  );
}

function EmptyState({
  onReset,
}: {
  onReset:
    () => void;
}) {
  return (
    <div className="mt-5 rounded-[1.6rem] border border-line bg-white p-8 text-center shadow-sm sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-50 text-2xl">
        🧅
      </div>

      <p className="mt-4 text-xl font-black">
        Tego jeszcze nawet Janusz nie
        wykombinował.
      </p>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
        Nie mamy narzędzia pasującego
        jednocześnie do wpisanego hasła
        i wybranej kategorii. Wyczyść
        filtry i spróbuj prostszego
        hasła.
      </p>

      <button
        type="button"
        onClick={
          onReset
        }
        className="mt-5 min-h-11 rounded-xl bg-brand-600 px-5 text-sm font-black text-white transition hover:bg-brand-700"
      >
        Dobra, pokaż wszystko
      </button>
    </div>
  );
}

function normalize(
  value:
    string,
): string {
  return value
    .normalize(
      "NFD",
    )
    .replace(
      /\p{Diacritic}/gu,
      "",
    )
    .toLowerCase()
    .trim();
}

function toolWord(
  count:
    number,
): string {
  if (
    count ===
    1
  ) {
    return "narzędzie";
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
    return "narzędzia";
  }

  return "narzędzi";
}