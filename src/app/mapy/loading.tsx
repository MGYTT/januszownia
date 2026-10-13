export default function MapsLoading() {
  return (
    <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-5 sm:py-6 lg:px-7">
      <div className="max-w-3xl">
        <div className="h-7 w-36 animate-pulse rounded-full bg-brand-100" />

        <div className="mt-4 h-10 w-full max-w-xl animate-pulse rounded-xl bg-line" />

        <div className="mt-3 h-5 w-full max-w-2xl animate-pulse rounded-lg bg-line" />
      </div>

      <div className="mt-6 overflow-hidden rounded-[1.6rem] border border-line bg-white shadow-sm sm:rounded-[2rem]">
        <div className="space-y-3 border-b border-line p-4 sm:p-5">
          <div className="h-12 animate-pulse rounded-2xl bg-canvas" />

          <div className="flex gap-2 overflow-hidden">
            {Array.from({
              length:
                5,
            }).map(
              (
                _,
                index,
              ) => (
                <div
                  key={
                    index
                  }
                  className="h-10 w-28 shrink-0 animate-pulse rounded-full bg-canvas"
                />
              ),
            )}
          </div>
        </div>

        <div className="divide-y divide-line">
          {Array.from({
            length:
              5,
          }).map(
            (
              _,
              index,
            ) => (
              <div
                key={
                  index
                }
                className="p-5"
              >
                <div className="h-3 w-24 animate-pulse rounded bg-brand-100" />

                <div className="mt-3 h-5 w-2/3 animate-pulse rounded bg-line" />

                <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-canvas" />
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
