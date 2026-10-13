import Link from "next/link";

type ModerationSection =
  | "submissions"
  | "reports";

interface ModerationTabsProps {
  active: ModerationSection;
}

export function ModerationTabs({
  active,
}: ModerationTabsProps) {
  return (
    <nav
      aria-label="Sekcje moderacji"
      className="flex flex-wrap gap-2"
    >
      <Link
        href="/moderacja"
        aria-current={
          active ===
          "submissions"
            ? "page"
            : undefined
        }
        className={
          active ===
          "submissions"
            ? "rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-black text-white"
            : "rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-black text-muted transition hover:bg-canvas hover:text-ink"
        }
      >
        Nowe miejsca
      </Link>

      <Link
        href="/moderacja/zgloszenia"
        aria-current={
          active ===
          "reports"
            ? "page"
            : undefined
        }
        className={
          active ===
          "reports"
            ? "rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-black text-white"
            : "rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-black text-muted transition hover:bg-canvas hover:text-ink"
        }
      >
        Zgłoszone problemy
      </Link>
    </nav>
  );
}