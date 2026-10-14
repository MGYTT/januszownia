export default function SavedCalculationsLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Ładowanie zapisanych obliczeń"
      className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
    >
      <span className="sr-only">
        Ładowanie zapisanych obliczeń…
      </span>

      <div
        aria-hidden="true"
        className="space-y-8 motion-safe:animate-pulse"
      >
        <div className="h-5 w-44 rounded-full bg-canvas" />

        <section className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-card">
          <div className="p-6 sm:p-8">
            <div className="h-3 w-32 rounded-full bg-canvas" />

            <div className="mt-3 h-11 w-96 max-w-full rounded-xl bg-canvas" />

            <div className="mt-4 h-5 w-full max-w-2xl rounded-full bg-canvas" />

            <div className="mt-2 h-5 w-4/5 max-w-xl rounded-full bg-canvas" />
          </div>
        </section>

        <section>
          <div className="h-3 w-28 rounded-full bg-canvas" />

          <div className="mt-3 h-8 w-80 max-w-full rounded-xl bg-canvas" />

          <div className="mt-5 divide-y divide-line overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm">
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
                  className="h-32"
                />
              ),
            )}
          </div>
        </section>
      </div>
    </div>
  );
}