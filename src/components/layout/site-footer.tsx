import Link from "next/link";

import { OnionMark } from "@/components/brand/onion-mark";
import { footerNavigation } from "@/lib/navigation";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="max-w-md">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 font-black tracking-tight"
            >
              <span className="text-brand-600">
                <OnionMark className="h-9 w-9" />
              </span>

              <span className="text-xl">
                Januszownia
              </span>
            </Link>

            <p className="mt-4 text-sm leading-6 text-muted">
              Mapy, kalkulatory,
              społeczność i rozrywka
              dla ludzi, którzy lubią
              wiedzieć, za co płacą.
            </p>

            <p className="mt-4 text-xs leading-5 text-subtle">
              Humor jest elementem
              charakteru portalu.
              Wyniki obliczeń i ważne
              informacje pozostają
              jednoznaczne.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {footerNavigation.map(
              (group) => (
                <div
                  key={group.title}
                >
                  <h2 className="text-sm font-black">
                    {group.title}
                  </h2>

                  <ul className="mt-4 space-y-3">
                    {group.links.map(
                      (link) => (
                        <li
                          key={
                            link.href
                          }
                        >
                          <Link
                            href={
                              link.href
                            }
                            className="text-sm text-muted transition hover:text-brand-700"
                          >
                            {
                              link.label
                            }
                          </Link>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-6 text-xs leading-5 text-subtle">
          Januszownia jest obecnie
          rozwijanym projektem. Dane
          zewnętrzne, mapowe i
          społecznościowe będą
          wyświetlane wraz ze źródłem
          i informacją o aktualności.
        </div>
      </div>
    </footer>
  );
}