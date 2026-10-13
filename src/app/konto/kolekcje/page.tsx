import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  deletePlaceCollection,
  removeSavedPlace,
} from "@/app/konto/kolekcje/actions";

import {
  CreateCollectionForm,
} from "@/components/collections/create-collection-form";

import {
  Icon,
} from "@/components/ui/icon";

import {
  requireAuthenticatedUser,
} from "@/lib/auth/server-session";

import {
  getOwnPlaceCollections,
} from "@/lib/collections/data";

import type {
  PlaceCollection,
} from "@/lib/collections/types";

export const instant =
  false;

export const metadata: Metadata = {
  title:
    "Moje kolekcje",

  description:
    "Prywatne kolekcje zapisanych miejsc w Januszowni.",
};

export default async function CollectionsPage() {
  const {
    supabase,
    userId,
  } =
    await requireAuthenticatedUser();

  const collections =
    await getOwnPlaceCollections(
      supabase,
      userId,
    );

  const uniquePlaceIds =
    new Set(
      collections.flatMap(
        (collection) =>
          collection.items.map(
            (item) =>
              item.id,
          ),
      ),
    );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Link
        href="/konto"
        className="text-sm font-bold text-brand-700 hover:underline"
      >
        ← Wróć do konta
      </Link>

      <header className="mt-7">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-bold text-brand-700">
          <Icon
            name="grid"
            className="h-4 w-4"
          />

          Prywatne listy
        </div>

        <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
          Moje kolekcje
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
          Zapisuj miejsca, które
          chcesz odwiedzić ponownie,
          porównać później albo
          wykorzystać przy planowaniu
          wyjazdu.
        </p>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat
          label="Kolekcje"
          value={
            collections.length
          }
        />

        <Stat
          label="Własne listy"
          value={
            collections.filter(
              (collection) =>
                collection.kind ===
                "custom",
            ).length
          }
        />

        <Stat
          label="Zapisane miejsca"
          value={
            uniquePlaceIds.size
          }
        />
      </section>

      <div className="mt-7">
        <CreateCollectionForm />
      </div>

      <div className="mt-10 space-y-6">
        {collections.map(
          (collection) => (
            <CollectionSection
              key={
                collection.id
              }
              collection={
                collection
              }
            />
          ),
        )}
      </div>
    </div>
  );
}

function CollectionSection({
  collection,
}: {
  collection:
    PlaceCollection;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line p-5 sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black">
              {collection.kind ===
              "favorites"
                ? "★ "
                : ""}
              {
                collection.name
              }
            </h2>

            {collection.kind ===
            "favorites" ? (
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.06em] text-brand-700">
                systemowa
              </span>
            ) : null}
          </div>

          <p className="mt-1 text-sm text-muted">
            {
              collection.items.length
            }{" "}
            {placeCountLabel(
              collection.items.length,
            )}
          </p>
        </div>

        {collection.kind ===
        "custom" ? (
          <form
            action={
              deletePlaceCollection
            }
          >
            <input
              type="hidden"
              name="collectionId"
              value={
                collection.id
              }
            />

            <button
              type="submit"
              className="min-h-10 rounded-xl border border-line bg-white px-4 py-2 text-xs font-black text-muted transition hover:border-danger-600/20 hover:bg-danger-50 hover:text-danger-600"
            >
              Usuń kolekcję
            </button>
          </form>
        ) : null}
      </header>

      {collection.items.length ===
      0 ? (
        <div className="p-8 text-center sm:p-10">
          <Icon
            name="map-pin"
            className="mx-auto h-7 w-7 text-brand-700"
          />

          <p className="mt-3 font-black">
            Jeszcze pusto.
          </p>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
            Otwórz dowolne miejsce
            na mapie i dodaj je do
            tej kolekcji.
          </p>

          <Link
            href="/mapy"
            className="mt-4 inline-flex text-sm font-black text-brand-700 hover:underline"
          >
            Przejdź do mapy →
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-line">
          {collection.items.map(
            (place) => (
              <article
                key={
                  place.id
                }
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/mapy/miejsce/${place.id}`}
                      className="font-black hover:text-brand-700 hover:underline"
                    >
                      {
                        place.name
                      }
                    </Link>

                    {place.categoryName ? (
                      <span className="rounded-full bg-canvas px-2.5 py-1 text-[10px] font-black text-muted">
                        {
                          place.categoryName
                        }
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-1 text-sm text-muted">
                    {place.address ??
                      place.city ??
                      "Brak adresu"}
                  </p>

                  <p className="mt-1 text-xs text-subtle">
                    Zapisano{" "}
                    {formatDate(
                      place.addedAt,
                    )}
                  </p>
                </div>

                <form
                  action={
                    removeSavedPlace
                  }
                >
                  <input
                    type="hidden"
                    name="collectionId"
                    value={
                      collection.id
                    }
                  />

                  <input
                    type="hidden"
                    name="placeId"
                    value={
                      place.id
                    }
                  />

                  <button
                    type="submit"
                    className="min-h-10 rounded-xl border border-line px-4 py-2 text-xs font-black text-muted transition hover:bg-canvas hover:text-ink"
                  >
                    Usuń z listy
                  </button>
                </form>
              </article>
            ),
          )}
        </div>
      )}
    </section>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[1.5rem] border border-line bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black">
        {value}
      </p>
    </div>
  );
}

function placeCountLabel(
  count: number,
): string {
  if (
    count === 1
  ) {
    return "miejsce";
  }

  const lastTwo =
    count %
    100;

  const last =
    count %
    10;

  if (
    last >= 2 &&
    last <= 4 &&
    !(
      lastTwo >= 12 &&
      lastTwo <= 14
    )
  ) {
    return "miejsca";
  }

  return "miejsc";
}

const dateFormatter =
  new Intl.DateTimeFormat(
    "pl-PL",
    {
      dateStyle:
        "medium",
    },
  );

function formatDate(
  value: string,
): string {
  const date =
    new Date(
      value,
    );

  return Number.isNaN(
    date.getTime(),
  )
    ? "—"
    : dateFormatter.format(
        date,
      );
}