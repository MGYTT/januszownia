"use client";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  Icon,
  type IconName,
} from "@/components/ui/icon";

interface MobileNavItem {
  href: string;

  label: string;

  icon:
    IconName;

  exact?: boolean;
}

const NAV_ITEMS:
  MobileNavItem[] = [
    {
      href: "/",
      label: "Start",
      icon: "home",
      exact: true,
    },

    {
      href: "/mapy",
      label: "Mapy",
      icon: "map-pin",
    },

    {
      href: "/narzedzia",
      label:
        "Narzędzia",
      icon: "calculator",
    },

    {
      href: "/ranking",
      label: "Ludzie",
      icon: "users",
    },

    {
      href: "/januszometr",
      label: "Beka",
      icon: "smile",
    },
  ];

export function MobileNav() {
  const pathname =
    usePathname();

  return (
    <nav
      aria-label="Główna nawigacja mobilna"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <div className="mx-auto grid h-16 max-w-lg grid-cols-5 px-2">
        {NAV_ITEMS.map(
          (item) => {
            const active =
              isActivePath(
                pathname,
                item,
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
                className={[
                  "relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-bold transition",
                  active
                    ? "text-brand-700"
                    : "text-muted hover:text-foreground",
                ].join(
                  " ",
                )}
              >
                {active ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-1 h-1 w-6 rounded-full bg-brand-600"
                  />
                ) : null}

                <Icon
                  name={
                    item.icon
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
      </div>
    </nav>
  );
}

function isActivePath(
  pathname: string,
  item:
    MobileNavItem,
): boolean {
  if (
    item.exact
  ) {
    return (
      pathname ===
      item.href
    );
  }

  return (
    pathname ===
      item.href ||
    pathname.startsWith(
      `${item.href}/`,
    )
  );
}