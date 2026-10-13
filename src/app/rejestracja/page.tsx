import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  redirect,
} from "next/navigation";

import { signUp } from "@/app/auth/actions";

import { OnionMark } from "@/components/brand/onion-mark";

import {
  getRequestAuth,
} from "@/lib/auth/server-session";

export const instant =
  false;

export const metadata: Metadata = {
  title:
    "Rejestracja",

  description:
    "Załóż konto w Januszowni.",
};

interface RegisterPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const [
    auth,
    params,
  ] =
    await Promise.all([
      getRequestAuth(),
      searchParams,
    ]);

  if (auth.userId) {
    redirect(
      "/konto",
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-[2rem] border border-line bg-white p-6 shadow-card sm:p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <OnionMark className="h-9 w-9" />
        </div>

        <p className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-brand-700">
          Nowy Cebularz
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-[-0.03em]">
          Załóż konto.
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted">
          Konto będzie wspólną
          podstawą zapisanych
          narzędzi, map,
          osiągnięć i
          społeczności.
        </p>

        {params.error ? (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-danger-600/20 bg-danger-50 p-4 text-sm font-semibold text-danger-600"
          >
            {
              params.error
            }
          </div>
        ) : null}

        <form
          action={signUp}
          className="mt-7 space-y-5"
        >
          <div>
            <label
              htmlFor="displayName"
              className="mb-2 block text-sm font-bold"
            >
              Nazwa
              wyświetlana
            </label>

            <input
              id="displayName"
              name="displayName"
              type="text"
              autoComplete="name"
              minLength={2}
              maxLength={60}
              required
              placeholder="np. Mirek"
              className="h-12 w-full rounded-xl border border-line bg-canvas px-4 text-base outline-none transition placeholder:text-subtle focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-bold"
            >
              E-mail
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="h-12 w-full rounded-xl border border-line bg-canvas px-4 text-base outline-none transition focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-bold"
            >
              Hasło
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
              className="h-12 w-full rounded-xl border border-line bg-canvas px-4 text-base outline-none transition focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />

            <p className="mt-2 text-xs leading-5 text-muted">
              Minimum 8 znaków.
            </p>
          </div>

          <div>
            <label
              htmlFor="passwordConfirm"
              className="mb-2 block text-sm font-bold"
            >
              Powtórz hasło
            </label>

            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
              className="h-12 w-full rounded-xl border border-line bg-canvas px-4 text-base outline-none transition focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />
          </div>

          <button
            type="submit"
            className="min-h-12 w-full rounded-button bg-brand-600 px-5 py-3 font-black text-white transition hover:bg-brand-700"
          >
            Załóż konto
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Masz już konto?{" "}
          <Link
            href="/logowanie"
            className="font-black text-brand-700 hover:underline"
          >
            Zaloguj się
          </Link>
        </p>
      </div>
    </div>
  );
}