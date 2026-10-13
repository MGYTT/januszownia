import type { Metadata } from "next";

import { ToolCatalog } from "@/components/tools/tool-catalog";
import { getAvailableTools } from "@/lib/tools/catalog";

export const metadata: Metadata = {
  title: "Narzędzia",
  description:
    "Kalkulatory i praktyczne narzędzia Januszowni.",
};

export default function ToolsPage() {
  const availableCount =
    getAvailableTools().length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <header className="max-w-3xl">
        <div className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-bold text-brand-700">
          🧰 Centrum narzędzi
        </div>

        <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
          Wszystkie narzędzia
          Januszowni
        </h1>

        <p className="mt-5 text-base leading-7 text-muted sm:text-lg sm:leading-8">
          Nie musisz znać nazw
          kalkulatorów. Wyszukaj problem
          albo wybierz kategorię.
          Narzędzia oznaczone jako
          działające wykonują rzeczywiste
          obliczenia.
        </p>

        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-brand-100 px-3 py-1.5 font-bold text-brand-800">
            {availableCount} działające
          </span>

          <span className="rounded-full border border-line bg-white px-3 py-1.5 font-semibold text-muted">
            kolejne dokładamy etapami
          </span>
        </div>
      </header>

      <div className="mt-10">
        <ToolCatalog />
      </div>
    </div>
  );
}