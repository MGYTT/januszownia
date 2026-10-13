import type {
  ReactNode,
} from "react";

export type CalculatorResultTone =
  | "good"
  | "neutral"
  | "warning";

export function CalculatorShell({
  intro,
  children,
}: {
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-card">
      <div className="border-b border-line bg-canvas/80 px-5 py-4 sm:px-6">
        <div className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 text-lg"
          >
            🧅
          </span>

          <p className="text-sm font-semibold leading-6 text-muted">
            {intro}
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6 lg:p-7">
        {children}
      </div>
    </div>
  );
}

export function CalculatorGroup({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-2xl border border-line bg-canvas/70 p-4 sm:p-5">
      <legend className="px-1">
        <span className="inline-flex items-center gap-2 text-base font-black text-ink">
          {title}

          {badge ? (
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] text-brand-800">
              {badge}
            </span>
          ) : null}
        </span>
      </legend>

      <div className="mt-2">
        {children}
      </div>
    </fieldset>
  );
}

export function CalculatorField({
  id,
  label,
  value,
  placeholder,
  suffix,
  help,
  inputMode = "decimal",
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  suffix?: string;
  help?: string;

  inputMode?:
    | "decimal"
    | "numeric";

  onChange:
    (
      value: string,
    ) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-ink"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode={inputMode}
          value={value}
          placeholder={placeholder}
          onChange={(
            event,
          ) =>
            onChange(
              event.target.value,
            )
          }
          className={[
            "h-12 w-full rounded-xl border border-line bg-white px-4 text-base font-semibold outline-none transition",
            "placeholder:font-normal placeholder:text-subtle",
            "focus:border-brand-300 focus:ring-4 focus:ring-brand-100",
            suffix
              ? "pr-24"
              : "",
          ].join(" ")}
        />

        {suffix ? (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted">
            {suffix}
          </span>
        ) : null}
      </div>

      {help ? (
        <p className="mt-2 text-xs leading-5 text-muted">
          {help}
        </p>
      ) : null}
    </div>
  );
}

export function CalculatorActions({
  submitLabel,
  resetLabel = "Wyczyść",
  onReset,
}: {
  submitLabel: string;
  resetLabel?: string;
  onReset: () => void;
}) {
  return (
    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
      <button
        type="submit"
        className="min-h-12 flex-1 rounded-xl bg-brand-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-brand-700 active:translate-y-px sm:text-base"
      >
        {submitLabel}
      </button>

      <button
        type="button"
        onClick={onReset}
        className="min-h-12 rounded-xl border border-line bg-white px-5 py-3 text-sm font-bold text-muted transition hover:bg-canvas hover:text-ink"
      >
        {resetLabel}
      </button>
    </div>
  );
}

export function CalculatorError({
  message,
}: {
  message: string | null;
}) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      className="mt-5 rounded-2xl border border-danger-600/20 bg-danger-50 px-4 py-3 text-sm font-semibold leading-6 text-danger-600"
    >
      <span className="font-black">
        Coś się nie spina:
      </span>{" "}
      {message}
    </div>
  );
}

export function CalculatorNotice({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mt-5 rounded-2xl border border-line bg-canvas px-4 py-3 text-sm leading-6 text-muted">
      {children}
    </div>
  );
}

export function CalculatorResultShell({
  title,
  lead,
  tone = "good",
  children,
}: {
  title: string;
  lead?: ReactNode;
  tone?: CalculatorResultTone;
  children: ReactNode;
}) {
  const toneClass =
    tone === "good"
      ? "border-brand-200 bg-brand-50"
      : tone === "warning"
        ? "border-accent-200 bg-accent-50"
        : "border-line bg-canvas";

  const titleClass =
    tone === "warning"
      ? "text-accent-700"
      : "text-brand-900";

  return (
    <section
      className={[
        "mt-7 rounded-[1.5rem] border p-5 sm:p-6",
        toneClass,
      ].join(" ")}
    >
      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-brand-700">
        Cebulowy werdykt
      </p>

      <h2
        className={[
          "mt-2 text-2xl font-black tracking-[-0.02em] sm:text-3xl",
          titleClass,
        ].join(" ")}
      >
        {title}
      </h2>

      {lead ? (
        <div className="mt-2 text-sm font-medium leading-6 text-muted">
          {lead}
        </div>
      ) : null}

      {children}
    </section>
  );
}

export function CalculatorMetric({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <p className="text-xs leading-5 text-muted">
        {label}
      </p>

      <p
        className={[
          "mt-1 text-lg font-black",
          accent
            ? "text-brand-800"
            : "text-ink",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}
