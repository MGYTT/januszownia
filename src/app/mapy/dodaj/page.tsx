import type {
  Metadata,
} from "next";

import Link from "next/link";

import { AddPlaceForm } from "@/components/maps/add-place-form";

import { Icon } from "@/components/ui/icon";

import {
  requireAuthenticatedUser,
} from "@/lib/auth/server-session";

import { getMapCategories } from "@/lib/maps/data";

export const instant =
  false;

export const metadata: Metadata = {
  title:
    "Dodaj miejsce",

  description:
    "Zgłoś nowe miejsce do Mapy Cebularza.",
};

interface AddPlacePageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

export default async function AddPlacePage({
  searchParams,
}: AddPlacePageProps) {
  /*
   * Ta strona jest prywatna.
   * Auth zawsze rozpoczyna się
   * od connection().
   */
  await requireAuthenticatedUser();

  const [
    categories,
    params,
  ] =
    await Promise.all([
      getMapCategories(),
      searchParams,
    ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Link
        href="/mapy"
        className="text-sm font-bold text-brand-700 hover:underline"
      >
        ← Wróć do mapy
      </Link>

      <header className="mt-6 max-w-3xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <Icon
            name="map-pin"
            className="h-6 w-6"
          />
        </div>

        <p className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-brand-700">
          Mapa Cebularza
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
          Dodaj miejsce
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-muted">
          Wypełnij informacje
          i wskaż dokładny punkt
          na mapie. Zgłoszenie
          trafi najpierw do
          weryfikacji.
        </p>
      </header>

      {params.message ? (
        <div className="mt-8 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm font-bold text-brand-800">
          {
            params.message
          }
        </div>
      ) : null}

      {params.error ? (
        <div
          role="alert"
          className="mt-8 rounded-2xl border border-danger-600/20 bg-danger-50 p-4 text-sm font-bold text-danger-600"
        >
          {
            params.error
          }
        </div>
      ) : null}

      <div className="mt-8">
        <AddPlaceForm
          categories={
            categories
          }
        />
      </div>
    </div>
  );
}