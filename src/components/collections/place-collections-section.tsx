import Link from "next/link";

import {
  setPlaceCollectionMembership,
} from "@/app/konto/kolekcje/actions";

import {
  getRequestAuth,
} from "@/lib/auth/server-session";

import {
  getPlaceCollectionMembership,
} from "@/lib/collections/data";

interface PlaceCollectionsSectionProps {
  placeId: string;
}

export async function PlaceCollectionsSection({
  placeId,
}: PlaceCollectionsSectionProps) {
  const {
    supabase,
    userId,
  } =
    await getRequestAuth();

  if (!userId) {
    return (
      <section className="rounded-[2rem] border border-line bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
          Zapisz miejsce
        </p>

        <h2 className="mt-2 text-xl font-black">
          Zachowaj na później
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          Zaloguj się, aby dodawać
          miejsca do Ulubionych
          i własnych kolekcji.
        </p>

        <Link
          href="/logowanie"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-button bg-brand-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-brand-700"
        >
          Zaloguj się
        </Link>
      </section>
    );
  }

  const collections =
    await getPlaceCollectionMembership(
      supabase,
      userId,
      placeId,
    );

  return (
    <section className="rounded-[2rem] border border-line bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
            Kolekcje
          </p>

          <h2 className="mt-2 text-xl font-black">
            Zapisz to miejsce
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted">
            To prywatne listy
            widoczne tylko na
            Twoim koncie.
          </p>
        </div>

        <Link
          href="/konto/kolekcje"
          className="text-sm font-black text-brand-700 hover:underline"
        >
          Zarządzaj →
        </Link>
      </div>

      <div className="mt-5 space-y-2">
        {collections.map(
          (collection) => (
            <form
              key={
                collection.id
              }
              action={
                setPlaceCollectionMembership
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
                  placeId
                }
              />

              <input
                type="hidden"
                name="present"
                value={
                  collection.containsPlace
                    ? "false"
                    : "true"
                }
              />

              <button
                type="submit"
                className={[
                  "flex min-h-12 w-full items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition",
                  collection.containsPlace
                    ? "border-brand-200 bg-brand-50"
                    : "border-line bg-white hover:bg-canvas",
                ].join(
                  " ",
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-black">
                    {collection.kind ===
                    "favorites"
                      ? "★ "
                      : ""}
                    {
                      collection.name
                    }
                  </span>

                  <span className="mt-0.5 block text-xs text-muted">
                    {collection.kind ===
                    "favorites"
                      ? "Ulubione"
                      : "Własna kolekcja"}
                  </span>
                </span>

                <span
                  className={
                    collection.containsPlace
                      ? "text-sm font-black text-brand-700"
                      : "text-sm font-black text-muted"
                  }
                >
                  {collection.containsPlace
                    ? "✓ Zapisane"
                    : "+ Dodaj"}
                </span>
              </button>
            </form>
          ),
        )}
      </div>
    </section>
  );
}