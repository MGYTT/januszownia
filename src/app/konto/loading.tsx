export default function AccountLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Ładowanie konta"
      className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
    >
      <span className="sr-only">
        Ładowanie Teczki Cebularza…
      </span>

      <div
        aria-hidden="true"
        className="grid gap-6 motion-safe:animate-pulse lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]"
      >
        <aside>
          <div className="overflow-hidden rounded-[2rem] bg-brand-900 shadow-card">
            <div className="p-6">
              <div className="h-16 w-16 rounded-2xl bg-white/10" />

              <div className="mt-5 h-3 w-28 rounded-full bg-white/10" />

              <div className="mt-3 h-8 w-44 rounded-xl bg-white/10" />

              <div className="mt-3 h-4 w-28 rounded-full bg-white/10" />

              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="h-20 rounded-xl bg-white/10" />
                <div className="h-20 rounded-xl bg-white/10" />
              </div>

              <div className="mt-5 h-24 rounded-2xl bg-white/10" />
            </div>

            <div className="border-t border-white/10 bg-black/10 p-3">
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
                    className="mb-1 h-11 rounded-xl bg-white/5 last:mb-0"
                  />
                ),
              )}
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <section className="rounded-[2rem] border border-line bg-white p-6 shadow-sm sm:p-8">
            <div className="h-3 w-28 rounded-full bg-canvas" />
            <div className="mt-3 h-10 w-96 max-w-full rounded-xl bg-canvas" />
            <div className="mt-4 h-5 w-full max-w-2xl rounded-full bg-canvas" />
            <div className="mt-2 h-5 w-4/5 max-w-xl rounded-full bg-canvas" />
          </section>

          <section className="mt-8">
            <div className="h-3 w-24 rounded-full bg-canvas" />
            <div className="mt-3 h-8 w-72 max-w-full rounded-xl bg-canvas" />

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
                    className="h-44 rounded-[1.5rem] border border-line bg-white shadow-sm"
                  />
                ),
              )}
            </div>
          </section>

          <section className="mt-9">
            <div className="h-3 w-24 rounded-full bg-canvas" />
            <div className="mt-3 h-8 w-64 max-w-full rounded-xl bg-canvas" />

            <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
              <div className="h-[520px] rounded-[2rem] border border-line bg-white shadow-sm" />

              <div className="h-[320px] rounded-[2rem] border border-line bg-accent-50" />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
