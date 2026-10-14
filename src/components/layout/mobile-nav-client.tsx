"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
} from "next/navigation";

import {
  signOut,
} from "@/app/auth/actions";

import {
  Icon,
  type IconName,
} from "@/components/ui/icon";

import {
  mobileNavigation,
} from "@/lib/navigation";

interface MobileNavClientProps {
  loggedIn:
    boolean;
}

interface MenuLink {
  href:
    string;

  label:
    string;

  description:
    string;

  icon:
    IconName;
}

const PUBLIC_MENU_LINKS:
  MenuLink[] = [
    {
      href:
        "/ranking",

      label:
        "Ranking Cebularzy",

      description:
        "Publiczny ranking osób, które dobrowolnie chcą się w nim pokazywać.",

      icon:
        "trophy",
    },

    {
      href:
        "/rozrywka",

      label:
        "Strefa Beki",

      description:
        "Januszometr i lżejsza część portalu.",

      icon:
        "smile",
    },

    {
      href:
        "/o-projekcie",

      label:
        "O Januszowni",

      description:
        "Jak działa portal, co liczymy i czego świadomie nie udajemy.",

      icon:
        "shield-check",
    },
  ];

const ACCOUNT_MENU_LINKS:
  MenuLink[] = [
    {
      href:
        "/konto",

      label:
        "Moje konto",

      description:
        "Teczka Cebularza, profil, reputacja i ustawienia.",

      icon:
        "users",
    },

    {
      href:
        "/powiadomienia",

      label:
        "Powiadomienia",

      description:
        "Informacje związane z Twoim kontem i aktywnością.",

      icon:
        "sparkles",
    },

    {
      href:
        "/konto/obliczenia",

      label:
        "Zapisane obliczenia",

      description:
        "Prywatna szuflada z wynikami kalkulatorów.",

      icon:
        "calculator",
    },

    {
      href:
        "/konto/kolekcje",

      label:
        "Kolekcje miejsc",

      description:
        "Twoje zapisane miejsca i własne kolekcje.",

      icon:
        "grid",
    },

    {
      href:
        "/konto/osiagniecia",

      label:
        "Osiągnięcia",

      description:
        "Odblokowane odznaki i postęp w Januszowni.",

      icon:
        "trophy",
    },
  ];

const MORE_PATH_PREFIXES = [
  "/ranking",
  "/rozrywka",
  "/o-projekcie",
  "/konto",
  "/powiadomienia",
  "/logowanie",
  "/rejestracja",
];

export function MobileNavClient({
  loggedIn,
}: MobileNavClientProps) {
  const pathname =
    usePathname();

  const [
    menuOpen,
    setMenuOpen,
  ] =
    useState(
      false,
    );

  useEffect(
    () => {
      setMenuOpen(
        false,
      );
    },
    [
      pathname,
    ],
  );

  useEffect(
    () => {
      if (
        !menuOpen
      ) {
        return;
      }

      const previousOverflow =
        document.body.style.overflow;

      document.body.style.overflow =
        "hidden";

      function handleKeyDown(
        event:
          KeyboardEvent,
      ) {
        if (
          event.key ===
          "Escape"
        ) {
          setMenuOpen(
            false,
          );
        }
      }

      window.addEventListener(
        "keydown",
        handleKeyDown,
      );

      return () => {
        document.body.style.overflow =
          previousOverflow;

        window.removeEventListener(
          "keydown",
          handleKeyDown,
        );
      };
    },
    [
      menuOpen,
    ],
  );

  const moreActive =
    menuOpen ||
    MORE_PATH_PREFIXES.some(
      (
        prefix,
      ) =>
        pathname ===
          prefix ||
        pathname.startsWith(
          prefix +
            "/",
        ),
    );

  return (
    <>
      {menuOpen ? (
        <MobileMenuSheet
          loggedIn={
            loggedIn
          }
          onClose={
            () =>
              setMenuOpen(
                false,
              )
          }
        />
      ) : null}

      <nav
        aria-label="Główna nawigacja mobilna"
        className="fixed inset-x-0 bottom-0 z-[70] border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        <div className="mx-auto grid h-16 max-w-lg grid-cols-5 px-2">
          {mobileNavigation.map(
            (
              item,
            ) => {
              const active =
                isActivePath(
                  pathname,
                  item.href,
                  item.href ===
                    "/",
                );

              return (
                <Link
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  aria-current={
                    active
                      ? "page"
                      : undefined
                  }
                  className={
                    mobileItemClass(
                      active,
                    )
                  }
                >
                  {active ? (
                    <ActiveMarker />
                  ) : null}

                  <Icon
                    name={
                      item.icon ??
                      "home"
                    }
                    className="h-5 w-5"
                  />

                  <span className="max-w-full truncate">
                    {
                      item.label
                    }
                  </span>
                </Link>
              );
            },
          )}

          <button
            type="button"
            aria-expanded={
              menuOpen
            }
            aria-controls="mobile-more-menu"
            onClick={
              () =>
                setMenuOpen(
                  (
                    current,
                  ) =>
                    !current,
                )
            }
            className={
              mobileItemClass(
                moreActive,
              )
            }
          >
            {moreActive ? (
              <ActiveMarker />
            ) : null}

            <Icon
              name="grid"
              className="h-5 w-5"
            />

            <span className="max-w-full truncate">
              Więcej
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}

function MobileMenuSheet({
  loggedIn,
  onClose,
}: {
  loggedIn:
    boolean;

  onClose:
    () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] md:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-more-menu-title"
    >
      <button
        type="button"
        aria-label="Zamknij menu"
        onClick={
          onClose
        }
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
      />

      <div
        id="mobile-more-menu"
        className="absolute inset-x-0 bottom-0 max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-t-[2rem] border-t border-line bg-white pb-[calc(5.5rem+env(safe-area-inset-bottom))] shadow-2xl"
      >
        <div className="sticky top-0 z-10 border-b border-line bg-white/95 px-4 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-brand-700">
                Nawigacja
              </p>

              <h2
                id="mobile-more-menu-title"
                className="mt-0.5 text-xl font-black tracking-[-0.03em] text-ink"
              >
                Cała Januszownia
              </h2>
            </div>

            <button
              type="button"
              onClick={
                onClose
              }
              aria-label="Zamknij menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-canvas text-xl font-black text-muted transition hover:text-ink"
            >
              ×
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-lg space-y-6 px-4 py-5">
          {loggedIn ? (
            <LoggedInAccountBlock />
          ) : (
            <LoggedOutAccountBlock />
          )}

          <section>
            <SectionLabel>
              Portal
            </SectionLabel>

            <div className="mt-3 space-y-2">
              {PUBLIC_MENU_LINKS.map(
                (
                  item,
                ) => (
                  <MenuRow
                    key={
                      item.href
                    }
                    item={
                      item
                    }
                  />
                ),
              )}
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-line bg-canvas p-4">
            <p className="text-xs font-black uppercase tracking-[0.1em] text-brand-700">
              Szybkie przejście
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <CompactLink
                href="/mapy"
                icon="map-pin"
                label="Mapa"
              />

              <CompactLink
                href="/narzedzia"
                icon="calculator"
                label="Narzędzia"
              />

              <CompactLink
                href="/spolecznosc"
                icon="users"
                label="Społeczność"
              />

              <CompactLink
                href="/rozrywka"
                icon="smile"
                label="Rozrywka"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function LoggedOutAccountBlock() {
  return (
    <section className="overflow-hidden rounded-[1.75rem] bg-brand-900 text-white">
      <div className="p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-brand-100">
          <Icon
            name="users"
            className="h-5 w-5"
          />
        </div>

        <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-brand-200">
          Konto Januszowni
        </p>

        <h3 className="mt-1 text-xl font-black">
          Masz już Teczkę Cebularza?
        </h3>

        <p className="mt-2 text-sm leading-6 text-brand-100">
          Zaloguj się, żeby zapisywać obliczenia, miejsca, osiągnięcia i korzystać z funkcji społecznościowych.
        </p>
      </div>

      <div className="grid gap-2 border-t border-white/10 bg-black/10 p-4 sm:grid-cols-2">
        <Link
          href="/logowanie"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button bg-white px-4 py-2.5 text-sm font-black text-brand-900 transition hover:bg-brand-50"
        >
          Zaloguj się

          <Icon
            name="arrow-right"
            className="h-4 w-4"
          />
        </Link>

        <Link
          href="/rejestracja"
          className="inline-flex min-h-11 items-center justify-center rounded-button border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-black text-white transition hover:bg-white/15"
        >
          Załóż konto
        </Link>
      </div>
    </section>
  );
}

function LoggedInAccountBlock() {
  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <SectionLabel>
          Twoje konto
        </SectionLabel>

        <Link
          href="/konto"
          className="text-xs font-black text-brand-700 hover:underline"
        >
          Otwórz Teczkę →
        </Link>
      </div>

      <div className="mt-3 space-y-2">
        {ACCOUNT_MENU_LINKS.map(
          (
            item,
          ) => (
            <MenuRow
              key={
                item.href
              }
              item={
                item
              }
            />
          ),
        )}
      </div>

      <form
        action={
          signOut
        }
        className="mt-3"
      >
        <button
          type="submit"
          className="min-h-11 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-left text-sm font-black text-muted transition hover:bg-canvas hover:text-ink"
        >
          Wyloguj się
        </button>
      </form>
    </section>
  );
}

function MenuRow({
  item,
}: {
  item:
    MenuLink;
}) {
  return (
    <Link
      href={
        item.href
      }
      className="group flex items-start gap-3 rounded-[1.25rem] border border-line bg-white p-4 transition hover:border-brand-200 hover:bg-brand-50/40"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <Icon
          name={
            item.icon
          }
          className="h-5 w-5"
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-black text-ink">
          {
            item.label
          }
        </span>

        <span className="mt-1 block text-xs leading-5 text-muted">
          {
            item.description
          }
        </span>
      </span>

      <Icon
        name="arrow-right"
        className="mt-2 h-4 w-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand-700"
      />
    </Link>
  );
}

function CompactLink({
  href,
  icon,
  label,
}: {
  href:
    string;

  icon:
    IconName;

  label:
    string;
}) {
  return (
    <Link
      href={
        href
      }
      className="flex min-h-12 items-center gap-2 rounded-xl border border-line bg-white px-3 text-sm font-black text-ink transition hover:border-brand-200 hover:bg-brand-50"
    >
      <Icon
        name={
          icon
        }
        className="h-4 w-4 text-brand-700"
      />

      {
        label
      }
    </Link>
  );
}

function SectionLabel({
  children,
}: {
  children:
    string;
}) {
  return (
    <p className="text-xs font-black uppercase tracking-[0.12em] text-brand-700">
      {children}
    </p>
  );
}

function ActiveMarker() {
  return (
    <span
      aria-hidden="true"
      className="absolute top-1 h-1 w-6 rounded-full bg-brand-600"
    />
  );
}

function mobileItemClass(
  active:
    boolean,
): string {
  return [
    "relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-bold transition",
    active
      ? "text-brand-700"
      : "text-muted hover:text-foreground",
  ].join(
    " ",
  );
}

function isActivePath(
  pathname:
    string,

  href:
    string,

  exact =
    false,
): boolean {
  if (exact) {
    return (
      pathname ===
      href
    );
  }

  return (
    pathname ===
      href ||
    pathname.startsWith(
      href +
        "/",
    )
  );
}
