"use client";

import {
  useActionState,
} from "react";

import {
  setLeaderboardVisibility,
} from "@/app/ranking/actions";

import type {
  LeaderboardVisibilityState,
} from "@/lib/reputation/visibility";

interface LeaderboardVisibilityControlProps {
  initialVisible:
    boolean;
}

export function LeaderboardVisibilityControl({
  initialVisible,
}: LeaderboardVisibilityControlProps) {
  const initialState:
    LeaderboardVisibilityState = {
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
      setLeaderboardVisibility,
      initialState,
    );

  return (
    <>
      <form
        action={
          formAction
        }
        className="mt-5"
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
              ? "Ukryj mnie z rankingu"
              : "Pokaż mnie w rankingu"}
        </button>
      </form>

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