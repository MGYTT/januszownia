"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
  useTransition,
} from "react";

import {
  saveCalculation,
} from "@/app/konto/obliczenia/actions";

export function SaveCalculationPanel({
  toolSlug,
  toolTitle,
  inputData,
  resultData,
  resultSummary,
  toolVersion = 1,
  suggestedTitle,
}: {
  toolSlug:
    string;

  toolTitle:
    string;

  inputData:
    unknown;

  resultData:
    unknown;

  resultSummary:
    string;

  toolVersion?:
    number;

  suggestedTitle?:
    string;
}) {
  const defaultTitle =
    (
      suggestedTitle ??
      toolTitle
    ).trim() ||
    toolTitle;

  const [
    title,
    setTitle,
  ] =
    useState(
      defaultTitle,
    );

  const [
    status,
    setStatus,
  ] =
    useState<
      | "idle"
      | "saved"
      | "unauthenticated"
      | "error"
    >(
      "idle",
    );

  const [
    message,
    setMessage,
  ] =
    useState<string | null>(
      null,
    );

  const [
    isPending,
    startTransition,
  ] =
    useTransition();

  useEffect(
    () => {
      setTitle(
        defaultTitle,
      );

      setStatus(
        "idle",
      );

      setMessage(
        null,
      );
    },
    [
      defaultTitle,
      resultData,
    ],
  );

  function handleSave() {
    const cleanTitle =
      title.trim();

    if (!cleanTitle) {
      setStatus(
        "error",
      );

      setMessage(
        "Nadaj zapisowi nazwę, żeby później wiedzieć, co to było.",
      );

      return;
    }

    setMessage(
      null,
    );

    startTransition(
      async () => {
        const response =
          await saveCalculation({
            toolSlug,
            toolVersion,
            title:
              cleanTitle,
            resultSummary,
            inputData,
            resultData,
          });

        if (
          response.status ===
          "saved"
        ) {
          setStatus(
            "saved",
          );

          setMessage(
            "Schowane. Ten wynik już nie zginie między paragonem a instrukcją od pralki.",
          );

          return;
        }

        if (
          response.status ===
          "unauthenticated"
        ) {
          setStatus(
            "unauthenticated",
          );

          setMessage(
            "Zaloguj się, żeby zapisywać obliczenia na swoim koncie.",
          );

          return;
        }

        setStatus(
          "error",
        );

        setMessage(
          response.message,
        );
      },
    );
  }

  return (
    <section className="mt-4 rounded-[1.5rem] border border-line bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-brand-700">
            Schowaj na później
          </p>

          <label
            htmlFor={
              "save-calculation-" +
              toolSlug
            }
            className="mt-2 block text-sm font-black text-ink"
          >
            Nazwa zapisu
          </label>

          <input
            id={
              "save-calculation-" +
              toolSlug
            }
            type="text"
            value={
              title
            }
            maxLength={80}
            disabled={
              isPending ||
              status ===
                "saved"
            }
            onChange={(
              event,
            ) => {
              setTitle(
                event.target.value,
              );

              if (
                status !==
                "idle"
              ) {
                setStatus(
                  "idle",
                );

                setMessage(
                  null,
                );
              }
            }}
            className="mt-2 h-11 w-full rounded-xl border border-line bg-canvas px-3 text-sm font-semibold outline-none transition focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>

        <button
          type="button"
          onClick={
            handleSave
          }
          disabled={
            isPending ||
            status ===
              "saved"
          }
          className="min-h-11 rounded-button bg-brand-900 px-5 py-2.5 text-sm font-black text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? "Chowam..."
            : status ===
                "saved"
              ? "Zapisano"
              : "Zapisz obliczenie"}
        </button>
      </div>

      <p className="mt-3 text-xs leading-5 text-muted">
        Zapisujemy dane wpisane do kalkulatora i policzony wynik. Niczego nie publikujemy na profilu ani w rankingu.
      </p>

      {message ? (
        <div
          role={
            status ===
            "error"
              ? "alert"
              : "status"
          }
          className={
            status ===
            "error"
              ? "mt-3 rounded-xl bg-danger-50 px-3 py-2.5 text-xs font-bold leading-5 text-danger-600"
              : status ===
                  "saved"
                ? "mt-3 rounded-xl bg-brand-50 px-3 py-2.5 text-xs font-bold leading-5 text-brand-800"
                : "mt-3 rounded-xl bg-accent-50 px-3 py-2.5 text-xs font-bold leading-5 text-accent-700"
          }
        >
          {message}

          {status ===
          "saved" ? (
            <>
              {" "}

              <Link
                href="/konto/obliczenia"
                className="font-black underline"
              >
                Otwórz zapisane obliczenia
              </Link>
            </>
          ) : null}

          {status ===
          "unauthenticated" ? (
            <>
              {" "}

              <Link
                href="/logowanie"
                className="font-black underline"
              >
                Przejdź do logowania
              </Link>
            </>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
