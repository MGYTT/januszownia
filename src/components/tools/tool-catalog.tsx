"use client";

import Link from "next/link";
import {
  useMemo,
  useState,
} from "react";

import { Icon } from "@/components/ui/icon";
import {
  toolCatalog,
  type ToolCategory,
  type ToolDefinition,
} from "@/lib/tools/catalog";

type ToolFilter =
  | "Wszystkie"
  | ToolCategory;

const filters: ToolFilter[] = [
  "Wszystkie",
  "Jedzenie",
  "Samochód",
  "Zakupy",
  "Dom",
  "Pieniądze",
  "Podróże",
];

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function ToolCatalog() {
  const [activeFilter, setActiveFilter] =
    useState<ToolFilter>("Wszystkie");

  const [query, setQuery] =
    useState("");

  const visibleTools = useMemo(() => {
    const normalizedQuery =
      normalize(query);

    return toolCatalog.filter(
      (tool) => {
        const categoryMatches =
          activeFilter === "Wszystkie" ||
          tool.category === activeFilter;

        if (!categoryMatches) {
          return false;
        }

        if (!normalizedQuery) {
          return true;
        }

        const searchable = normalize(
          [
            tool.title,
            tool.description,
            tool.category,
            ...tool.keywords,
          ].join(" "),
        );

        return searchable.includes(
          normalizedQuery,
        );
      },
    );
  }, [activeFilter, query]);

  return (
    <div>
      <div className="rounded-card border border-line bg-white p-4 shadow-sm sm:p-5">
        <label
          htmlFor="tool-search"
          className="text-sm font-bold"
        >
          Szukaj narzędzia
        </label>

        <div className="relative mt-2">
          <Icon
            name="search"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
          />

          <input
            id="tool-search"
            type="search"
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value,
              )
            }
            placeholder="Np. paliwo, pizza, prąd..."
            className="h-12 w-full rounded-xl border border-line bg-canvas pl-12 pr-4 text-base outline-none transition placeholder:text-subtle focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
          />
        </div>

        <div
          className="mt-4 flex gap-2 overflow-x-auto pb-1"
          aria-label="Kategorie narzędzi"
        >
          {filters.map((filter) => {
            const active =
              activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  setActiveFilter(filter)
                }
                className={
                  active
                    ? "min-h-10 shrink-0 rounded-full bg-brand-600 px-4 text-sm font-bold text-white"
                    : "min-h-10 shrink-0 rounded-full border border-line bg-white px-4 text-sm font-semibold text-muted transition hover:border-brand-200 hover:text-ink"
                }
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between gap-4">
        <p className="text-sm text-muted">
          Znaleziono{" "}
          <strong className="text-ink">
            {visibleTools.length}
          </strong>{" "}
          {visibleTools.length === 1
            ? "narzędzie"
            : "narzędzi"}
        </p>
      </div>

      {visibleTools.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleTools.map((tool) => (
            <ToolCard
              key={tool.slug}
              tool={tool}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-card border border-line bg-white p-8 text-center">
          <p className="text-lg font-black">
            Nic z tego, Januszu.
          </p>

          <p className="mt-2 text-sm leading-6 text-muted">
            Nie znaleźliśmy
            narzędzia pasującego do
            podanego hasła i wybranej
            kategorii.
          </p>
        </div>
      )}
    </div>
  );
}

function ToolCard({
  tool,
}: {
  tool: ToolDefinition;
}) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <Icon
            name={tool.icon}
            className="h-5 w-5"
          />
        </div>

        <span
          className={
            tool.status === "available"
              ? "rounded-full bg-brand-100 px-2.5 py-1 text-xs font-black text-brand-800"
              : "rounded-full bg-canvas px-2.5 py-1 text-xs font-bold text-muted"
          }
        >
          {tool.status === "available"
            ? "Działa"
            : "W planach"}
        </span>
      </div>

      <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-brand-700">
        {tool.category}
      </p>

      <h2 className="mt-1 text-xl font-black tracking-tight">
        {tool.title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-muted">
        {tool.description}
      </p>

      {tool.status === "available" ? (
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-700">
          Uruchom

          <Icon
            name="arrow-right"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
          />
        </span>
      ) : (
        <span className="mt-6 inline-block text-sm font-semibold text-subtle">
          Jeszcze nieaktywne
        </span>
      )}
    </>
  );

  if (
    tool.status === "available" &&
    tool.href
  ) {
    return (
      <Link
        href={tool.href}
        className="group rounded-card border border-line bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
      >
        {content}
      </Link>
    );
  }

  return (
    <article className="rounded-card border border-line bg-canvas p-5">
      {content}
    </article>
  );
}