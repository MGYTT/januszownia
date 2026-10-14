"use client";

import Link from "next/link";

import {
  useEffect,
} from "react";

export default function ActivityError({
  error,
  reset,
}: {
  error:
    Error & {
      digest?:
        string;
    };

  reset:
    () => void;
}) {
  useEffect(
    () => {
      console.error(
        "Błąd Kroniki Cebularza:",
        error,
      );
    },
    [
      error,
    ],
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-card">
        <div className="bg-brand-900 p-6 text-white sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-200">
            Kronika Cebularza
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
            Archiwista poszedł po kawę.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-brand-100 sm:text-base">
            Nie udało się pobrać całej historii konta. Twoje zgłoszenia, raporty i Cebuliony nadal są zapisane w bazie.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-sm leading-6 text-muted">
            Spróbuj pobrać Kronikę ponownie. Jeśli problem się powtarza, możesz wrócić do głównego panelu konta.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={
                reset
              }
              className="min-h-12 rounded-button bg-brand-600 px-5 py-3 font-black text-white transition hover:bg-brand-700"
            >
              Spróbuj ponownie
            </button>

            <Link
              href="/konto"
              className="inline-flex min-h-12 items-center justify-center rounded-button border border-line bg-white px-5 py-3 font-black transition hover:bg-canvas"
            >
              Wróć do konta
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}