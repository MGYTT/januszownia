"use client";

import {
  useActionState,
} from "react";

import {
  reportPlaceIssue,
  updatePlaceConfirmation,
} from "@/app/mapy/miejsce/actions";

import type {
  PlaceConfirmationActionState,
  PlaceReportActionState,
  PlaceVerdict,
} from "@/lib/maps/community-types";

interface PlaceCommunityControlsProps {
  placeId: string;

  initialVerdict:
    PlaceVerdict | null;
}

const initialReportState:
  PlaceReportActionState = {
    status: "idle",
    message: "",
  };

export function PlaceCommunityControls({
  placeId,
  initialVerdict,
}: PlaceCommunityControlsProps) {
  const initialConfirmationState:
    PlaceConfirmationActionState = {
      status: "idle",

      message: "",

      verdict:
        initialVerdict,
    };

  const [
    confirmationState,
    confirmationAction,
    confirmationPending,
  ] =
    useActionState(
      updatePlaceConfirmation,
      initialConfirmationState,
    );

  const [
    reportState,
    reportAction,
    reportPending,
  ] =
    useActionState(
      reportPlaceIssue,
      initialReportState,
    );

  const currentVerdict =
    confirmationState.verdict ??
    initialVerdict;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-line bg-white p-5 shadow-sm sm:p-6">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
          Pomóż społeczności
        </p>

        <h2 className="mt-2 text-xl font-black">
          To miejsce jest aktualne?
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          Jedno konto ma jeden
          aktualny głos dla tego
          miejsca. Możesz później
          zmienić swoją odpowiedź.
        </p>

        <form
          action={
            confirmationAction
          }
          className="mt-5 grid gap-3 sm:grid-cols-2"
        >
          <input
            type="hidden"
            name="placeId"
            value={placeId}
          />

          <button
            type="submit"
            name="verdict"
            value="confirmed"
            disabled={
              confirmationPending
            }
            className={
              currentVerdict ===
              "confirmed"
                ? "min-h-12 rounded-button bg-brand-600 px-4 py-3 text-sm font-black text-white"
                : "min-h-12 rounded-button border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-black text-brand-800 transition hover:bg-brand-100"
            }
          >
            ✓ Tak, aktualne
          </button>

          <button
            type="submit"
            name="verdict"
            value="outdated"
            disabled={
              confirmationPending
            }
            className={
              currentVerdict ===
              "outdated"
                ? "min-h-12 rounded-button bg-accent-500 px-4 py-3 text-sm font-black text-white"
                : "min-h-12 rounded-button border border-accent-200 bg-accent-50 px-4 py-3 text-sm font-black text-accent-700 transition hover:bg-accent-100"
            }
          >
            Może być nieaktualne
          </button>
        </form>

        {confirmationPending ? (
          <p className="mt-4 text-sm font-semibold text-muted">
            Zapisuję…
          </p>
        ) : null}

        {confirmationState.message ? (
          <div
            role={
              confirmationState.status ===
              "error"
                ? "alert"
                : "status"
            }
            className={
              confirmationState.status ===
              "error"
                ? "mt-4 rounded-2xl border border-danger-600/20 bg-danger-50 p-4 text-sm font-semibold text-danger-600"
                : "mt-4 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm font-semibold text-brand-800"
            }
          >
            {
              confirmationState.message
            }
          </div>
        ) : null}
      </section>

      <section className="rounded-[2rem] border border-line bg-white p-5 shadow-sm sm:p-6">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
          Zgłoszenie problemu
        </p>

        <h2 className="mt-2 text-xl font-black">
          Coś jest nie tak?
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          Formalne zgłoszenie
          trafia do moderatorów.
          Samo zgłoszenie nie usuwa
          miejsca z mapy.
        </p>

        <form
          action={
            reportAction
          }
          className="mt-5 space-y-4"
        >
          <input
            type="hidden"
            name="placeId"
            value={placeId}
          />

          <div>
            <label
              htmlFor="reason"
              className="mb-2 block text-sm font-bold"
            >
              Powód
            </label>

            <select
              id="reason"
              name="reason"
              required
              defaultValue=""
              className="h-12 w-full rounded-xl border border-line bg-canvas px-4 text-base outline-none transition focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
            >
              <option
                value=""
                disabled
              >
                Wybierz problem
              </option>

              <option value="outdated">
                Informacja jest
                nieaktualna
              </option>

              <option value="closed">
                Miejsce już nie
                istnieje / jest
                zamknięte
              </option>

              <option value="wrong_location">
                Błędna lokalizacja
              </option>

              <option value="wrong_information">
                Błędne informacje
              </option>

              <option value="duplicate">
                Duplikat miejsca
              </option>

              <option value="other">
                Inny problem
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="details"
              className="mb-2 block text-sm font-bold"
            >
              Szczegóły
            </label>

            <textarea
              id="details"
              name="details"
              rows={4}
              maxLength={1500}
              placeholder="Opcjonalnie opisz, co dokładnie wymaga sprawdzenia."
              className="w-full resize-y rounded-xl border border-line bg-canvas px-4 py-3 text-sm outline-none transition placeholder:text-subtle focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />
          </div>

          <button
            type="submit"
            disabled={
              reportPending
            }
            className="min-h-11 rounded-button border border-line bg-white px-4 py-2.5 text-sm font-black transition hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-60"
          >
            {reportPending
              ? "Wysyłam…"
              : "Wyślij zgłoszenie"}
          </button>
        </form>

        {reportState.message ? (
          <div
            role={
              reportState.status ===
              "error"
                ? "alert"
                : "status"
            }
            className={
              reportState.status ===
              "error"
                ? "mt-4 rounded-2xl border border-danger-600/20 bg-danger-50 p-4 text-sm font-semibold text-danger-600"
                : "mt-4 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm font-semibold text-brand-800"
            }
          >
            {
              reportState.message
            }
          </div>
        ) : null}
      </section>
    </div>
  );
}