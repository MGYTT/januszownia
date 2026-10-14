"use client";

import Link from "next/link";

import {
  type FormEvent,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import { Icon } from "@/components/ui/icon";

import {
  getAvailableTools,
} from "@/lib/tools/catalog";

interface SearchEntry {
  id: string;
  title: string;
  description: string;
  href: string;
  keywords: string[];
}

const portalSections: SearchEntry[] = [
  {
    id:
      "narzedzia",

    title:
      "Wszystkie narzędzia",

    description:
      "Pełny katalog kalkulatorów i praktycznych przeliczników Januszowni.",

    href:
      "/narzedzia",

    keywords: [
      "narzędzia",
      "narzedzia",
      "kalkulator",
      "kalkulatory",
      "liczenie",
      "koszt",
      "oszczędność",
      "oszczednosc",
    ],
  },

  {
    id:
      "mapy",

    title:
      "Mapa Cebularza",

    description:
      "Parkingi, woda, toalety, jedzenie, darmowe miejsca, targowiska i kolejne praktyczne punkty.",

    href:
      "/mapy",

    keywords: [
      "mapa",
      "mapy",
      "parking",
      "toaleta",
      "kibel",
      "woda",
      "miejsce",
      "okolica",
      "jedzenie",
      "targ",
      "targowisko",
      "darmowe",
    ],
  },

  {
    id:
      "spolecznosc",

    title:
      "Społeczność",

    description:
      "Dodawanie miejsc, potwierdzanie aktualności, zgłaszanie problemów i reputacja.",

    href:
      "/spolecznosc",

    keywords: [
      "społeczność",
      "spolecznosc",
      "użytkownicy",
      "uzytkownicy",
      "zgłoszenie",
      "zgloszenie",
      "potwierdzenie",
      "aktualność",
      "moderacja",
      "cebuliony",
      "reputacja",
    ],
  },

  {
    id:
      "ranking",

    title:
      "Ranking Cebularzy",

    description:
      "Dobrowolny publiczny ranking Cebulionów, poziomów i wkładu społeczności.",

    href:
      "/ranking",

    keywords: [
      "ranking",
      "cebuliony",
      "punkty",
      "poziom",
      "reputacja",
      "osiągnięcia",
      "osiagniecia",
      "profil",
    ],
  },

  {
    id:
      "rozrywka",

    title:
      "Strefa Beki",

    description:
      "Januszometr i lżejsza, rozrywkowa część portalu.",

    href:
      "/rozrywka",

    keywords: [
      "gra",
      "gry",
      "januszometr",
      "zabawa",
      "generator",
      "test",
      "beka",
      "rozrywka",
    ],
  },

  {
    id:
      "o-projekcie",

    title:
      "O projekcie",

    description:
      "Jak działa Januszownia, jakie ma zasady i w jaki sposób rozwijamy portal.",

    href:
      "/o-projekcie",

    keywords: [
      "projekt",
      "o projekcie",
      "jak działa",
      "jak dziala",
      "zasady",
      "januszownia",
      "prywatność",
      "prywatnosc",
    ],
  },
];

const toolEntries: SearchEntry[] =
  getAvailableTools().map(
    (
      tool,
    ) => ({
      id:
        tool.slug,

      title:
        tool.title,

      description:
        tool.description,

      href:
        tool.href!,

      keywords: [
        ...tool.keywords,
        tool.category,
        tool.shortTitle,
        tool.memeLine,
      ],
    }),
  );

const searchEntries: SearchEntry[] = [
  ...toolEntries,
  ...portalSections,
];

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

export function PortalSearch() {
  const router =
    useRouter();

  const [
    query,
    setQuery,
  ] =
    useState(
      "",
    );

  const results =
    useMemo(
      () => {
        const normalizedQuery =
          normalize(
            query,
          );

        if (
          normalizedQuery.length <
          2
        ) {
          return [];
        }

        return searchEntries
          .filter(
            (
              entry,
            ) => {
              const searchable =
                normalize(
                  [
                    entry.title,
                    entry.description,
                    ...entry.keywords,
                  ].join(
                    " ",
                  ),
                );

              return searchable.includes(
                normalizedQuery,
              );
            },
          )
          .slice(
            0,
            6,
          );
      },
      [
        query,
      ],
    );

  function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const firstResult =
      results[0];

    if (
      firstResult
    ) {
      router.push(
        firstResult.href,
      );
    }
  }

  return (
    <div className="relative w-full max-w-2xl">
      <form
        onSubmit={
          handleSubmit
        }
        role="search"
      >
        <label
          htmlFor="portal-search"
          className="sr-only"
        >
          Szukaj w Januszowni
        </label>

        <div className="relative">
          <Icon
            name="search"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
          />

          <input
            id="portal-search"
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
            placeholder="Np. abonament, paliwo, parking, ranking..."
            autoComplete="off"
            className="h-14 w-full rounded-2xl border border-line bg-white pl-12 pr-4 text-[16px] text-ink shadow-sm outline-none transition placeholder:text-subtle focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
          />
        </div>
      </form>

      {query.trim().length >=
      2 ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
          {results.length >
          0 ? (
            <div className="p-2">
              {results.map(
                (
                  result,
                ) => (
                  <Link
                    key={
                      result.id
                    }
                    href={
                      result.href
                    }
                    className="flex items-center justify-between gap-4 rounded-xl px-3 py-3 transition hover:bg-brand-50"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-ink">
                        {
                          result.title
                        }
                      </div>

                      <div className="mt-0.5 line-clamp-2 text-sm text-muted">
                        {
                          result.description
                        }
                      </div>
                    </div>

                    <Icon
                      name="arrow-right"
                      className="h-4 w-4 shrink-0 text-brand-600"
                    />
                  </Link>
                ),
              )}
            </div>
          ) : (
            <div className="p-5">
              <p className="font-black">
                Panie, nic takiego
                jeszcze nie mamy.
              </p>

              <p className="mt-1 text-sm leading-6 text-muted">
                Spróbuj „abonament”,
                „paliwo”, „parking”,
                „ranking” albo
                „Januszometr”.
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
