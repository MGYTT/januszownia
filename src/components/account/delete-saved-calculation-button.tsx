"use client";

import {
  useRouter,
} from "next/navigation";

import {
  useState,
  useTransition,
} from "react";

import {
  deleteSavedCalculation,
} from "@/app/konto/obliczenia/actions";

export function DeleteSavedCalculationButton({
  id,
}: {
  id:
    string;
}) {
  const router =
    useRouter();

  const [
    confirming,
    setConfirming,
  ] =
    useState(
      false,
    );

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    isPending,
    startTransition,
  ] =
    useTransition();

  function handleDelete() {
    setError(
      null,
    );

    startTransition(
      async () => {
        try {
          const formData =
            new FormData();

          formData.set(
            "id",
            id,
          );

          await deleteSavedCalculation(
            formData,
          );

          router.refresh();
        } catch {
          setError(
            "Nie udało się usunąć zapisu.",
          );
        }
      },
    );
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={
          () => {
            setConfirming(
              true,
            );

            setError(
              null,
            );
          }
        }
        className="min-h-10 w-full rounded-button border border-line bg-white px-4 py-2 text-xs font-black text-muted transition hover:border-danger-600/30 hover:bg-danger-50 hover:text-danger-600"
      >
        Usuń zapis
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-danger-600/20 bg-danger-50 p-2.5">
      <p className="text-[11px] font-black text-danger-600">
        Na pewno usunąć?
      </p>

      <div className="mt-2 flex gap-2">
        <button
          type="button"
          disabled={
            isPending
          }
          onClick={
            handleDelete
          }
          className="min-h-9 flex-1 rounded-lg bg-danger-600 px-3 py-1.5 text-[11px] font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? "Usuwam..."
            : "Tak, usuń"}
        </button>

        <button
          type="button"
          disabled={
            isPending
          }
          onClick={
            () => {
              setConfirming(
                false,
              );

              setError(
                null,
              );
            }
          }
          className="min-h-9 rounded-lg bg-white px-3 py-1.5 text-[11px] font-black text-muted transition hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          Anuluj
        </button>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-2 text-[11px] font-bold text-danger-600"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}