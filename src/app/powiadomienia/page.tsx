import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/app/powiadomienia/actions";

import {
  Icon,
} from "@/components/ui/icon";

import {
  requireAuthenticatedUser,
} from "@/lib/auth/server-session";

import {
  getNotifications,
  getUnreadNotificationCount,
} from "@/lib/notifications/data";

import type {
  UserNotification,
} from "@/lib/notifications/types";

export const instant =
  false;

export const metadata: Metadata = {
  title:
    "Powiadomienia",

  description:
    "Powiadomienia konta Januszowni.",
};

export default async function NotificationsPage() {
  const {
    supabase,
  } =
    await requireAuthenticatedUser();

  const [
    notifications,
    unreadCount,
  ] =
    await Promise.all([
      getNotifications(
        supabase,
      ),

      getUnreadNotificationCount(
        supabase,
      ),
    ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Link
        href="/konto"
        className="text-sm font-bold text-brand-700 hover:underline"
      >
        ← Wróć do konta
      </Link>

      <header className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-bold text-brand-700">
            <Icon
              name="sparkles"
              className="h-4 w-4"
            />

            Twoje centrum
          </div>

          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Powiadomienia
          </h1>

          <p className="mt-3 text-sm text-muted">
            Nieprzeczytane:{" "}
            <strong className="text-ink">
              {unreadCount}
            </strong>
          </p>
        </div>

        {unreadCount > 0 ? (
          <form
            action={
              markAllNotificationsRead
            }
          >
            <button
              type="submit"
              className="min-h-11 rounded-button border border-line bg-white px-5 py-2.5 text-sm font-black transition hover:bg-canvas"
            >
              Oznacz wszystkie jako przeczytane
            </button>
          </form>
        ) : null}
      </header>

      {notifications.length ===
      0 ? (
        <section className="mt-8 rounded-[2rem] border border-line bg-white p-10 text-center shadow-sm">
          <Icon
            name="check"
            className="mx-auto h-8 w-8 text-brand-700"
          />

          <h2 className="mt-4 text-xl font-black">
            Na razie cisza.
          </h2>

          <p className="mt-2 text-sm text-muted">
            Tutaj pojawią się
            m.in. gratulacje za
            zdobywanie kolejnych
            poziomów.
          </p>
        </section>
      ) : (
        <div className="mt-8 space-y-3">
          {notifications.map(
            (notification) => (
              <NotificationCard
                key={
                  notification.id
                }
                notification={
                  notification
                }
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}

function NotificationCard({
  notification,
}: {
  notification:
    UserNotification;
}) {
  const unread =
    notification.readAt ===
    null;

  const levelOrder =
    readMetadataNumber(
      notification.metadata,
      "level_order",
    );

  return (
    <article
      className={[
        "rounded-[1.5rem] border p-5 shadow-sm sm:p-6",
        unread
          ? "border-brand-200 bg-brand-50/60"
          : "border-line bg-white",
      ].join(
        " ",
      )}
    >
      <div className="flex gap-4">
        <div
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            notification.kind ===
            "level_up"
              ? "bg-accent-50 text-accent-700"
              : "bg-canvas text-brand-700",
          ].join(
            " ",
          )}
        >
          <Icon
            name={
              notification.kind ===
              "level_up"
                ? "trophy"
                : "sparkles"
            }
            className="h-5 w-5"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-black">
              {
                notification.title
              }
            </h2>

            {unread ? (
              <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] text-white">
                Nowe
              </span>
            ) : null}

            {levelOrder ? (
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-muted">
                Poziom{" "}
                {levelOrder}
              </span>
            ) : null}
          </div>

          <p className="mt-2 text-sm leading-6 text-muted">
            {
              notification.message
            }
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-muted">
              {formatDateTime(
                notification.createdAt,
              )}
            </span>

            {unread ? (
              <form
                action={
                  markNotificationRead
                }
              >
                <input
                  type="hidden"
                  name="notificationId"
                  value={
                    notification.id
                  }
                />

                <button
                  type="submit"
                  className="text-xs font-black text-brand-700 hover:underline"
                >
                  Oznacz jako przeczytane
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function readMetadataNumber(
  metadata:
    Record<
      string,
      unknown
    >,

  key: string,
): number | null {
  const raw =
    metadata[key];

  const value =
    Number(
      raw,
    );

  return Number.isFinite(
    value,
  )
    ? value
    : null;
}

const dateTimeFormatter =
  new Intl.DateTimeFormat(
    "pl-PL",
    {
      dateStyle:
        "medium",

      timeStyle:
        "short",
    },
  );

function formatDateTime(
  value: string,
): string {
  const date =
    new Date(
      value,
    );

  return Number.isNaN(
    date.getTime(),
  )
    ? "—"
    : dateTimeFormatter.format(
        date,
      );
}