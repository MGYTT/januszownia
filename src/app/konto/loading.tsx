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
                length: 8,
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

        <main className="min-w-0 space-y-8">
          <section className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm">
            <div className="p-6 sm:p-8">
              <div className="h-3 w-24 rounded-full bg-canvas" />

              <div className="mt-3 h-10 w-80 max-w-full rounded-xl bg-canvas" />

              <div className="mt-4 h-5 w-full max-w-2xl rounded-full bg-canvas" />

              <div className="mt-2 h-5 w-4/5 max-w-xl rounded-full bg-canvas" />
            </div>

            <div className="grid grid-cols-2 gap-px border-t border-line bg-line lg:grid-cols-4">
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
                    className="h-24 bg-canvas"
                  />
                ),
              )}
            </div>
          </section>

          <section>
            <div className="flex gap-3">
              <div className="h-9 w-9 rounded-xl bg-brand-900" />

              <div className="flex-1">
                <div className="h-3 w-32 rounded-full bg-canvas" />

                <div className="mt-3 h-8 w-72 max-w-full rounded-xl bg-canvas" />

                <div className="mt-3 h-5 w-full max-w-2xl rounded-full bg-canvas" />
              </div>
            </div>

            <div className="mt-5 h-[560px] rounded-[2rem] border border-line bg-white shadow-sm" />
          </section>

          <section>
            <div className="flex gap-3">
              <div className="h-9 w-9 rounded-xl bg-brand-900" />

              <div className="flex-1">
                <div className="h-3 w-24 rounded-full bg-canvas" />

                <div className="mt-3 h-8 w-64 max-w-full rounded-xl bg-canvas" />
              </div>
            </div>

            <div className="mt-5 h-52 rounded-[2rem] border border-line bg-white shadow-sm" />
          </section>

          <section>
            <div className="flex gap-3">
              <div className="h-9 w-9 rounded-xl bg-brand-900" />

              <div className="flex-1">
                <div className="h-3 w-28 rounded-full bg-canvas" />

                <div className="mt-3 h-8 w-64 max-w-full rounded-xl bg-canvas" />
              </div>
            </div>

            <div className="mt-5 h-96 rounded-[2rem] border border-line bg-white shadow-sm" />
          </section>
        </main>
      </div>
    </div>
  );
}