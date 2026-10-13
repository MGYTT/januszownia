export type IconName =
  | "arrow-right"
  | "calculator"
  | "check"
  | "droplet"
  | "grid"
  | "home"
  | "map-pin"
  | "parking"
  | "route"
  | "search"
  | "shield-check"
  | "smile"
  | "sparkles"
  | "tag"
  | "toilet"
  | "trophy"
  | "users"
  | "utensils"
  | "wallet";

interface IconProps {
  name: IconName;
  className?: string;
}

export function Icon({
  name,
  className = "h-5 w-5",
}: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {renderIcon(name)}
    </svg>
  );
}

function renderIcon(name: IconName) {
  switch (name) {
    case "search":
      return (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4.2-4.2" />
        </>
      );

    case "wallet":
      return (
        <>
          <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v11H6a2 2 0 0 1-2-2V7.5Z" />
          <path d="M16 10h5v5h-5a2.5 2.5 0 0 1 0-5Z" />
          <circle
            cx="16.5"
            cy="12.5"
            r=".5"
            fill="currentColor"
            stroke="none"
          />
        </>
      );

    case "calculator":
      return (
        <>
          <rect
            x="5"
            y="3"
            width="14"
            height="18"
            rx="2"
          />
          <path d="M8 7h8v3H8z" />
          <path d="M8.5 14h.01M12 14h.01M15.5 14h.01M8.5 17.5h.01M12 17.5h.01M15.5 17.5h.01" />
        </>
      );

    case "map-pin":
      return (
        <>
          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle
            cx="12"
            cy="10"
            r="2.5"
          />
        </>
      );

    case "smile":
      return (
        <>
          <circle
            cx="12"
            cy="12"
            r="9"
          />
          <path d="M8.5 10h.01M15.5 10h.01" />
          <path d="M8.5 14.5c1 1.2 2.1 1.8 3.5 1.8s2.5-.6 3.5-1.8" />
        </>
      );

    case "arrow-right":
      return (
        <>
          <path d="M5 12h14" />
          <path d="m14 7 5 5-5 5" />
        </>
      );

    case "home":
      return (
        <>
          <path d="m3 11 9-8 9 8" />
          <path d="M5.5 10v10h13V10" />
          <path d="M9.5 20v-6h5v6" />
        </>
      );

    case "grid":
      return (
        <>
          <rect
            x="4"
            y="4"
            width="6"
            height="6"
            rx="1"
          />
          <rect
            x="14"
            y="4"
            width="6"
            height="6"
            rx="1"
          />
          <rect
            x="4"
            y="14"
            width="6"
            height="6"
            rx="1"
          />
          <rect
            x="14"
            y="14"
            width="6"
            height="6"
            rx="1"
          />
        </>
      );

    case "users":
      return (
        <>
          <circle
            cx="9"
            cy="8"
            r="3"
          />
          <path d="M3.5 19c.4-4 2.3-6 5.5-6s5.1 2 5.5 6" />
          <path d="M15 6.3a3 3 0 0 1 0 5.4" />
          <path d="M16 14c2.6.4 4 2.1 4.5 5" />
        </>
      );

    case "trophy":
      return (
        <>
          <path d="M8 4h8v4c0 4-1.7 6-4 6s-4-2-4-6V4Z" />
          <path d="M8 6H4v1c0 3 1.5 5 4.5 5" />
          <path d="M16 6h4v1c0 3-1.5 5-4.5 5" />
          <path d="M12 14v4" />
          <path d="M8 21h8" />
          <path d="M9 18h6" />
        </>
      );

    case "sparkles":
      return (
        <>
          <path d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3L12 3Z" />
          <path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" />
          <path d="m5 13 .7 1.8 1.8.7-1.8.7L5 18l-.7-1.8-1.8-.7 1.8-.7L5 13Z" />
        </>
      );

    case "shield-check":
      return (
        <>
          <path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6l-7-3Z" />
          <path d="m9 12 2 2 4-4" />
        </>
      );

    case "route":
      return (
        <>
          <circle
            cx="6"
            cy="18"
            r="2"
          />
          <circle
            cx="18"
            cy="6"
            r="2"
          />
          <path d="M8 18h3c4 0 4-5 0-5h-1c-4 0-4-5 0-5h6" />
        </>
      );

    case "parking":
      return (
        <>
          <rect
            x="4"
            y="3"
            width="16"
            height="18"
            rx="3"
          />
          <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
        </>
      );

    case "droplet":
      return (
        <path d="M12 3s6 6.2 6 11a6 6 0 0 1-12 0c0-4.8 6-11 6-11Z" />
      );

    case "toilet":
      return (
        <>
          <circle
            cx="8"
            cy="5"
            r="2"
          />
          <path d="M5 20v-7l-2-3h5l2 3v7" />
          <circle
            cx="17"
            cy="5"
            r="2"
          />
          <path d="M14 20v-7l-2-3h7l-2 3v7" />
        </>
      );

    case "utensils":
      return (
        <>
          <path d="M7 3v7" />
          <path d="M4 3v4c0 2 1 3 3 3s3-1 3-3V3" />
          <path d="M7 10v11" />
          <path d="M16 3v18" />
          <path d="M16 3c3 2 4 5 4 8h-4" />
        </>
      );

    case "tag":
      return (
        <>
          <path d="M4 4h7l9 9-7 7-9-9V4Z" />
          <circle
            cx="8"
            cy="8"
            r="1"
          />
        </>
      );

    case "check":
      return <path d="m5 12 4 4L19 6" />;

    default:
      return null;
  }
}