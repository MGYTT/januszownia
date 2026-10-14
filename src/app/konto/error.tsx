"use client";

import Link from "next/link";

import {
  useEffect,
} from "react";

export default function AccountError({
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
        "Błąd strony konta:",
        error,
      );
    },
    [
      error,
    ],
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-line bg-white p-7 text-center shadow-card sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-50 text-2xl">
          🧅
        </div>

        <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-brand-700">
          Konto
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-[-0.03em]">
          Panel konta chwilowo nie chce współpracować.
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted sm:text-base">
          Twoje dane nie zostały zmienione. Możesz ponowić pobieranie panelu albo wrócić do strony głównej.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
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
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-button border border-line bg-white px-5 py-3 font-black transition hover:bg-canvas"
          >
            Wróć na start
          </Link>
        </div>
      </section>
    </div>
  );
}
