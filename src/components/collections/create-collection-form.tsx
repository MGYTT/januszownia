"use client";

import {
  useActionState,
} from "react";

import {
  createPlaceCollection,
} from "@/app/konto/kolekcje/actions";

import type {
  CollectionActionState,
} from "@/lib/collections/types";

const INITIAL_STATE:
  CollectionActionState = {
    status:
      "idle",

    message: "",
  };

export function CreateCollectionForm() {
  const [
    state,
    formAction,
    pending,
  ] =
    useActionState(
      createPlaceCollection,
      INITIAL_STATE,
    );

  return (
    <div className="rounded-[1.5rem] border border-line bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-brand-700">
        Nowa kolekcja
      </p>

      <h2 className="mt-2 text-xl font-black">
        Utwórz własną listę
      </h2>

      <p className="mt-2 text-sm leading-6 text-muted">
        Możesz stworzyć maksymalnie
        30 własnych kolekcji.
        „Ulubione” jest kolekcją
        systemową i zawsze pozostaje
        na koncie.
      </p>

      <form
        action={
          formAction
        }
        className="mt-5 flex flex-col gap-3 sm:flex-row"
      >
        <label
          htmlFor="collection-name"
          className="sr-only"
        >
          Nazwa kolekcji
        </label>

        <input
          id="collection-name"
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={60}
          placeholder="np. Na weekend"
          className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-canvas px-4 outline-none transition placeholder:text-subtle focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
        />

        <button
          type="submit"
          disabled={
            pending
          }
          className="min-h-11 rounded-button bg-brand-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending
            ? "Tworzę…"
            : "Utwórz"}
        </button>
      </form>

      {state.message ? (
        <p
          role={
            state.status ===
            "error"
              ? "alert"
              : "status"
          }
          className={
            state.status ===
            "error"
              ? "mt-3 text-sm font-semibold text-danger-600"
              : "mt-3 text-sm font-semibold text-brand-700"
          }
        >
          {
            state.message
          }
        </p>
      ) : null}
    </div>
  );
}