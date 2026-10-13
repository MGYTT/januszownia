import type { Metadata } from "next";

import { Januszometer } from "@/components/entertainment/januszometer";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "Rozrywka",
  description:
    "Januszometr i rozrywkowa część Januszowni.",
};

export default function EntertainmentPage() {
  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-bold text-brand-700">
              <Icon
                name="smile"
                className="h-4 w-4"
              />

              Strefa Beki
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Sprawdź swój poziom
              cebulactwa.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Januszometr jest
              humorystycznym testem.
              Wynik nie ocenia
              rzeczywistych umiejętności
              finansowych — tutaj
              możemy sobie pozwolić na
              trochę absurdu.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Januszometer />
      </section>

      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-700">
            Kolejne moduły
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Rozrywka będzie rosła.
          </h2>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <Planned
              icon="sparkles"
              title="Dylemat dnia"
            />

            <Planned
              icon="trophy"
              title="Wyzwania"
            />

            <Planned
              icon="smile"
              title="Januszex Simulator"
            />
          </div>
        </div>
      </section>
    </>
  );
}

function Planned({
  icon,
  title,
}: {
  icon:
    | "sparkles"
    | "trophy"
    | "smile";
  title: string;
}) {
  return (
    <article className="rounded-card border border-line bg-canvas p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-muted">
        <Icon
          name={icon}
          className="h-5 w-5"
        />
      </div>

      <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-subtle">
        W planach
      </p>

      <h3 className="mt-1 font-black">
        {title}
      </h3>
    </article>
  );
}