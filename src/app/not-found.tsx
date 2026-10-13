import Link from "next/link";

import { OnionMark } from "@/components/brand/onion-mark";
import { Icon } from "@/components/ui/icon";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-3xl items-center justify-center px-4 py-16 sm:px-6">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-brand-50 text-brand-600">
          <OnionMark className="h-12 w-12" />
        </div>

        <p className="mt-7 text-sm font-black uppercase tracking-[0.14em] text-brand-700">
          Błąd 404
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-[-0.04em]">
          Panie, tu nic nie ma.
        </h1>

        <p className="mx-auto mt-4 max-w-lg leading-7 text-muted">
          Adres nie prowadzi do żadnej
          istniejącej części
          Januszowni.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-button bg-brand-600 px-5 py-3 font-black text-white transition hover:bg-brand-700"
          >
            Wróć na start
          </Link>

          <Link
            href="/narzedzia"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-button border border-line bg-white px-5 py-3 font-black transition hover:bg-canvas"
          >
            Narzędzia

            <Icon
              name="arrow-right"
              className="h-4 w-4"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}