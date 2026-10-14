export default function ActivityLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Ładowanie Kroniki Cebularza"
      className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
    >
      <span className="sr-only">
        Ładowanie historii aktywności…
      </span>

      <div
        aria-hidden="true"
        className="space-y-7 motion-safe:animate-pulse"
      >
        <div className="h-5 w-44 rounded-full bg-canvas" />

        <section className="rounded-[2rem] bg-brand-900 p-6 sm:p-8">
          <div className="h-3 w-28 rounded-full bg-white/10" />

          <div className="mt-3 h-11 w-72 max-w-full rounded-xl bg-white/10" />

          <div className="mt-4 h-5 w-full max-w-2xl rounded-full bg-white/10" />

          <div className="mt-2 h-5 w-4/5 max-w-xl rounded-full bg-white/10" />
        </section>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Array.from({
            length: 4,
          }).map(
            (
              _,
              index,
            ) => (
              <div
                key={
                  index
                }
                className="h-28 rounded-2xl border border-line bg-white shadow-sm"
              />
            ),
          )}
        </div>

        <section>
          <div className="h-3 w-28 rounded-full bg-canvas" />

          <div className="mt-3 h-8 w-80 max-w-full rounded-xl bg-canvas" />

          <div className="mt-6 space-y-4">
            {Array.from({
              length: 5,
            }).map(
              (
                _,
                index,
              ) => (
                <div
                  key={
                    index
                  }
                  className="h-48 rounded-[1.75rem] border border-line bg-white shadow-sm"
                />
              ),
            )}
          </div>
        </section>
      </div>
    </div>
  );
}