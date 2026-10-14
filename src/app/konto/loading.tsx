export default function AccountLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Ładowanie konta"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14"
    >
      <span className="sr-only">
        Ładowanie panelu konta…
      </span>

      <div
        aria-hidden="true"
        className="space-y-8 motion-safe:animate-pulse"
      >
        <section className="rounded-[2rem] border border-line bg-white p-6 shadow-card sm:p-8">
          <div className="flex items-start gap-5">
            <div className="h-16 w-16 shrink-0 rounded-2xl bg-canvas sm:h-20 sm:w-20" />

            <div className="min-w-0 flex-1">
              <div className="h-3 w-24 rounded-full bg-canvas" />
              <div className="mt-3 h-9 w-56 max-w-full rounded-xl bg-canvas" />
              <div className="mt-3 h-4 w-32 rounded-full bg-canvas" />

              <div className="mt-5 flex gap-2">
                <div className="h-8 w-24 rounded-full bg-canvas" />
                <div className="h-8 w-24 rounded-full bg-canvas" />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="h-3 w-24 rounded-full bg-canvas" />
          <div className="mt-3 h-8 w-80 max-w-full rounded-xl bg-canvas" />

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({
              length: 6,
            }).map(
              (
                _,
                index,
              ) => (
                <div
                  key={
                    index
                  }
                  className="h-52 rounded-[1.75rem] border border-line bg-white shadow-sm"
                />
              ),
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="h-[420px] rounded-[2rem] border border-line bg-white shadow-sm" />
          <div className="h-[300px] rounded-[2rem] border border-line bg-canvas" />
        </section>
      </div>
    </div>
  );
}
