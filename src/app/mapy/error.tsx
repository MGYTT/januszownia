"use client";

export default function MapsError({
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
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-50 text-2xl">
        🗺️
      </div>

      <h1 className="mt-5 text-2xl font-black">
        Nie udało się wczytać map
      </h1>

      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
        Nie udało się pobrać katalogu miejsc.
        Spróbuj ponownie. Twoje konto i zapisane
        miejsca nie zostały zmienione.
      </p>

      <button
        type="button"
        onClick={
          reset
        }
        className="mt-6 min-h-11 rounded-xl bg-brand-600 px-5 text-sm font-black text-white transition hover:bg-brand-700"
      >
        Spróbuj ponownie
      </button>
    </div>
  );
}
