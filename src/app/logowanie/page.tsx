import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  redirect,
} from "next/navigation";

import { signIn } from "@/app/auth/actions";

import { OnionMark } from "@/components/brand/onion-mark";

import {
  getRequestAuth,
} from "@/lib/auth/server-session";

export const instant =
  false;

export const metadata: Metadata = {
  title:
    "Logowanie",

  description:
    "Zaloguj się do Januszowni.",
};

interface LoginPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
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
          Konto Januszowni
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-[-0.03em]">
          Witaj ponownie.
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted">
          Zaloguj się, aby
          zapisywać obliczenia,
          miejsca i aktywność
          społecznościową.
        </p>

        {params.message ? (
          <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm font-semibold text-brand-800">
            {
              params.message
            }
          </div>
        ) : null}

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
          action={signIn}
          className="mt-7 space-y-5"
        >
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
              autoComplete="current-password"
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
            Zaloguj się
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Nie masz konta?{" "}
          <Link
            href="/rejestracja"
            className="font-black text-brand-700 hover:underline"
          >
            Załóż konto
          </Link>
        </p>
      </div>
    </div>
  );
}