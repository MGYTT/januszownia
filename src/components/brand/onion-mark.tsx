interface OnionMarkProps {
  className?: string;
}

export function OnionMark({
  className = "h-9 w-9",
}: OnionMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      viewBox="0 0 48 48"
    >
      <path
        d="M26.3 3.5c.2 4.7 3 7.2 7.5 8.5-3.6.6-6.7.1-9.2-1.8-1.6-1.3-2.5-3.2-2.6-5.7 1.5.2 2.9-.1 4.3-1Z"
        fill="currentColor"
        opacity=".65"
      />

      <path
        d="M22.4 7.2c.7 5.4-1 8.3-4.8 10.8 1.1-4.4.1-7.8-3-10.2 2.9-.2 5.5-.4 7.8-.6Z"
        fill="currentColor"
        opacity=".85"
      />

      <path
        d="M24 12.5c-3.8 5.4-12.5 9.8-12.5 19.1C11.5 40 17.2 45 24 45s12.5-5 12.5-13.4C36.5 22.3 27.8 17.9 24 12.5Z"
        fill="currentColor"
      />

      <path
        d="M24 17.7c-2.1 5.6-6.4 9.2-6.4 14.9 0 4.5 2.6 7.8 6.4 9.3"
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeWidth="2.1"
        opacity=".55"
      />
    </svg>
  );
}