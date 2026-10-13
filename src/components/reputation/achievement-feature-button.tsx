"use client";

import {
  useActionState,
} from "react";

import {
  setAchievementFeatured,
} from "@/app/konto/osiagniecia/actions";

import type {
  AchievementFeatureState,
} from "@/lib/reputation/achievement-action-state";

interface AchievementFeatureButtonProps {
  achievementCode:
    string;

  initialFeatured:
    boolean;

  initialSlot:
    number | null;
}

export function AchievementFeatureButton({
  achievementCode,
  initialFeatured,
  initialSlot,
}: AchievementFeatureButtonProps) {
  const initialState:
    AchievementFeatureState = {
      status:
        "idle",

      message: "",

      featured:
        initialFeatured,

      slot:
        initialSlot,
    };

  const [
    state,
    formAction,
    pending,
  ] =
    useActionState(
      setAchievementFeatured,
      initialState,
    );

  return (
    <div className="mt-3">
      <form
        action={
          formAction
        }
      >
        <input
          type="hidden"
          name="achievementCode"
          value={
            achievementCode
          }
        />

        <input
          type="hidden"
          name="featured"
          value={
            state.featured
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
            state.featured
              ? "min-h-10 w-full rounded-xl border border-line bg-white px-4 py-2 text-xs font-black transition hover:bg-canvas disabled:opacity-50"
              : "min-h-10 w-full rounded-xl bg-brand-600 px-4 py-2 text-xs font-black text-white transition hover:bg-brand-700 disabled:opacity-50"
          }
        >
          {pending
            ? "Zapisuję…"
            : state.featured
              ? `Usuń z gabloty${state.slot ? ` · slot ${state.slot}` : ""}`
              : "Wyróżnij na profilu"}
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
              ? "mt-2 text-xs font-semibold text-danger-600"
              : "mt-2 text-xs font-semibold text-brand-700"
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