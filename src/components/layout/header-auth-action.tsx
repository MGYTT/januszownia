import Link from "next/link";
import { connection } from "next/server";

import { Icon } from "@/components/ui/icon";
import { createClient } from "@/lib/supabase/server";

export async function HeaderAuthAction() {
  /*
   * Ten fragment UI zależy od konkretnego requestu
   * i cookies użytkownika.
   *
   * connection() informuje Next.js 16,
   * że kod poniżej nie może być wykonywany
   * podczas prerenderingu statycznej powłoki.
   */
  await connection();

  const supabase = await createClient();

  const { data, error } =
    await supabase.auth.getClaims();

  const loggedIn =
    !error &&
    Boolean(data?.claims?.sub);

  return (
    <Link
      href={
        loggedIn
          ? "/konto"
          : "/logowanie"
      }
      className="inline-flex min-h-11 items-center gap-2 rounded-button bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700"
    >
      {loggedIn
        ? "Moje konto"
        : "Zaloguj"}

      <Icon
        name="arrow-right"
        className="h-4 w-4"
      />
    </Link>
  );
}