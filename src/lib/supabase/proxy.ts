import {
  createServerClient,
} from "@supabase/ssr";

import {
  NextResponse,
  type NextRequest,
} from "next/server";

export async function updateSession(
  request: NextRequest,
) {
  const url =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const publishableKey =
    process.env
      .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (
    !url ||
    !publishableKey
  ) {
    throw new Error(
      "Brakuje konfiguracji Supabase.",
    );
  }

  let supabaseResponse =
    NextResponse.next({
      request,
    });

  const supabase =
    createServerClient(
      url,
      publishableKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },

          setAll(
            cookiesToSet,
            headers,
          ) {
            /*
             * Najpierw aktualizujemy cookies
             * bieżącego requestu.
             */
            cookiesToSet.forEach(
              ({
                name,
                value,
              }) => {
                request.cookies.set(
                  name,
                  value,
                );
              },
            );

            /*
             * Tworzymy odpowiedź powiązaną
             * z tym samym requestem.
             */
            supabaseResponse =
              NextResponse.next({
                request,
              });

            /*
             * Cookies dla przeglądarki.
             */
            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) => {
                supabaseResponse.cookies.set(
                  name,
                  value,
                  options,
                );
              },
            );

            /*
             * @supabase/ssr przekazuje również
             * nagłówki dotyczące cache/session.
             *
             * Nie możemy ich wyrzucić.
             */
            Object.entries(
              headers,
            ).forEach(
              ([
                key,
                value,
              ]) => {
                supabaseResponse.headers.set(
                  key,
                  value,
                );
              },
            );
          },
        },
      },
    );

  /*
   * Niczego nie wykonujemy pomiędzy
   * createServerClient() a getClaims().
   *
   * getClaims() może odświeżyć sesję,
   * a setAll() zapisze nowe cookies.
   */
  await supabase.auth.getClaims();

  /*
   * WAŻNE:
   *
   * Proxy zajmuje się WYŁĄCZNIE
   * utrzymaniem sesji.
   *
   * Nie robimy tutaj:
   *
   * - redirect("/logowanie")
   * - ochrony /konto
   * - ochrony /moderacja
   *
   * To robią Server Components.
   *
   * Dzięki temu Proxy nie przechwytuje
   * POST-ów Server Actions i nie zamienia
   * ich odpowiedzi w HTML/redirect.
   */
  return supabaseResponse;
}