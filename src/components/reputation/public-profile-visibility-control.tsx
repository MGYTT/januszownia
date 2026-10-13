"use client";

import Link from "next/link";

import {
  useActionState,
} from "react";

import {
  setPublicProfileVisibility,
} from "@/app/konto/publiczny-profil/actions";

import type {
  PublicProfileVisibilityState,
} from "@/lib/reputation/public-profile-visibility";

interface PublicProfileVisibilityControlProps {
  username:
    string | null;

  initialVisible:
    boolean;
}

export function PublicProfileVisibilityControl({
  username,
  initialVisible,
}: PublicProfileVisibilityControlProps) {
  const initialState:
    PublicProfileVisibilityState = {
      status:
        "idle",

      message: "",

      visible:
        initialVisible,
    };

  const [
    state,
    formAction,
    pending,
  ] =
    useActionState(
      setPublicProfileVisibility,
      initialState,
    );

  if (!username) {
    return (
      <div className="rounded-2xl border border-accent-200 bg-accent-50 p-5">
        <p className="font-black text-accent-700">
          Najpierw ustaw nick.
        </p>

        <p className="mt-2 text-sm leading-6 text-muted">
          Publiczny profil
          potrzebuje stabilnego
          adresu w formie
          /ludzie/twoj_nick.
        </p>

        <Link
          href="/konto"
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-button bg-brand-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-brand-700"
        >
          Ustaw nick
        </Link>
      </div>
    );
  }

  return (
    <>
      <form
        action={
          formAction
        }
      >
        <input
          type="hidden"
          name="visible"
          value={
            state.visible
              ? "false"
              : "true"
          }
        />

        <button
          type="submit"
          disabled={
            pending
          }
          className={
            state.visible
              ? "min-h-11 rounded-button border border-line bg-white px-5 py-2.5 text-sm font-black transition hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-60"
              : "min-h-11 rounded-button bg-brand-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          }
        >
          {pending
            ? "Zapisuję…"
            : state.visible
              ? "Wyłącz publiczny profil"
              : "Włącz publiczny profil"}
        </button>
      </form>

      {state.visible ? (
        <Link
          href={`/ludzie/${username}`}
          className="mt-3 inline-block text-sm font-black text-brand-700 hover:underline"
        >
          Otwórz mój publiczny profil →
        </Link>
      ) : null}

      {state.message ? (
        <div
          role={
            state.status ===
            "error"
              ? "alert"
              : "status"
          }
          className={
            state.status ===
            "error"
              ? "mt-4 rounded-2xl border border-danger-600/20 bg-danger-50 p-4 text-sm font-semibold text-danger-600"
              : "mt-4 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm font-semibold text-brand-800"
          }
        >
          {
            state.message
          }
        </div>
      ) : null}
    </>
  );
}