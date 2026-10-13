"use client";

import {
  type FormEvent,
  useState,
} from "react";

import {
  calculatePromotionMeter,
  type PromotionMeterResult,
} from "@/lib/calculators/promotion-meter";

interface FormState {
  regularPrice: string;
  promotionalPrice: string;
  quantity: string;
  lowest30Days: string;
}

const initialForm: FormState = {
  regularPrice: "",
  promotionalPrice: "",
  quantity: "1",
  lowest30Days: "",
};

const currencyFormatter =
  new Intl.NumberFormat(
    "pl-PL",
    {
      style: "currency",
      currency: "PLN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  );

const percentFormatter =
  new Intl.NumberFormat(
    "pl-PL",
    {
      maximumFractionDigits: 2,
    },
  );

export function PromotionMeterCalculator() {
  const [
    form,
    setForm,
  ] =
    useState<FormState>(
      initialForm,
    );

  const [
    result,
    setResult,
  ] =
    useState<PromotionMeterResult | null>(
      null,
    );

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  function updateField(
    field: keyof FormState,
    value: string,
  ) {
    setForm(
      (
        current,
      ) => ({
        ...current,
        [field]: value,
      }),
    );

    setResult(null);
    setError(null);
  }

  function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      const lowest30Days =
        form.lowest30Days
          .trim() ===
        ""
          ? null
          : parsePolishDecimal(
              form.lowest30Days,
            );

      const nextResult =
        calculatePromotionMeter({
          regularPricePln:
            parsePolishDecimal(
              form.regularPrice,
            ),

          promotionalPricePln:
            parsePolishDecimal(
              form.promotionalPrice,
            ),

          quantity:
            parsePositiveInteger(
              form.quantity,
            ),

          lowest30DaysPln:
            lowest30Days,
        });

      setResult(
        nextResult,
      );

      setError(null);
    } catch (
      unknownError
    ) {
      setResult(null);

      setError(
        unknownError instanceof
          Error
          ? unknownError.message
          : "Nie udało się wykonać obliczenia.",
      );
    }
  }

  function reset() {
    setForm(initialForm);
    setResult(null);
    setError(null);
  }

  return (
    <div className="rounded-[2rem] border border-line bg-white p-5 shadow-card sm:p-7 lg:p-8">
      <form
        onSubmit={
          handleSubmit
        }
      >
        <div className="grid gap-5 md:grid-cols-2">
          <NumberField
            id="regular-price"
            label="Cena regularna"
            value={
              form.regularPrice
            }
            placeholder="np. 129,99"
            suffix="zł"
            onChange={
              (
                value,
              ) =>
                updateField(
                  "regularPrice",
                  value,
                )
            }
          />

          <NumberField
            id="promotional-price"
            label="Cena promocyjna"
            value={
              form.promotionalPrice
            }
            placeholder="np. 89,99"
            suffix="zł"
            onChange={
              (
                value,
              ) =>
                updateField(
                  "promotionalPrice",
                  value,
                )
            }
          />

          <NumberField
            id="quantity"
            label="Ile sztuk kupujesz?"
            value={
              form.quantity
            }
            placeholder="1"
            suffix="szt."
            inputMode="numeric"
            onChange={
              (
                value,
              ) =>
                updateField(
                  "quantity",
                  value,
                )
            }
          />

          <NumberField
            id="lowest-30-days"
            label="Najniższa cena z 30 dni"
            value={
              form.lowest30Days
            }
            placeholder="opcjonalnie"
            suffix="zł"
            help="Jeżeli masz tę wartość z etykiety sklepu, możemy matematycznie porównać z nią aktualną cenę."
            onChange={
              (
                value,
              ) =>
                updateField(
                  "lowest30Days",
                  value,
                )
            }
          />
        </div>

        {error ? (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-danger-600/20 bg-danger-50 px-4 py-3 text-sm font-medium text-danger-600"
          >
            {error}
          </div>
        ) : null}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="min-h-12 flex-1 rounded-button bg-brand-600 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-brand-700 active:translate-y-px"
          >
            Sprawdź promocję
          </button>

          <button
            type="button"
            onClick={
              reset
            }
            className="min-h-12 rounded-button border border-line bg-white px-5 py-3 font-semibold text-muted transition hover:bg-canvas hover:text-ink"
          >
            Wyczyść
          </button>
        </div>
      </form>

      <div
        aria-live="polite"
        className="mt-7"
      >
        {result ? (
          <PromotionResult
            result={
              result
            }
          />
        ) : null}
      </div>
    </div>
  );
}

function NumberField({
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
  suffix: string;
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
        htmlFor={
          id
        }
        className="mb-2 block text-sm font-bold"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={
            id
          }
          type="text"
          inputMode={
            inputMode
          }
          value={
            value
          }
          placeholder={
            placeholder
          }
          onChange={
            (
              event,
            ) =>
              onChange(
                event.target
                  .value,
              )
          }
          className="h-12 w-full rounded-xl border border-line bg-canvas px-4 pr-16 text-base font-semibold outline-none transition placeholder:font-normal placeholder:text-subtle focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
        />

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted">
          {suffix}
        </span>
      </div>

      {help ? (
        <p className="mt-2 text-xs leading-5 text-muted">
          {help}
        </p>
      ) : null}
    </div>
  );
}

function PromotionResult({
  result,
}: {
  result:
    PromotionMeterResult;
}) {
  return (
    <section className="rounded-card border border-brand-200 bg-brand-50 p-5 sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
        Wynik Promocjometru
      </p>

      <h2 className="mt-2 text-2xl font-black">
        {ratingTitle(
          result,
        )}
      </h2>

      <p className="mt-2 text-sm leading-6 text-brand-900">
        {ratingDescription(
          result,
        )}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ResultTile
          label="Różnica ceny"
          value={
            formatSignedCurrency(
              result.savingPerItemPln,
            )
          }
        />

        <ResultTile
          label="Zmiana procentowa"
          value={
            formatSignedPercent(
              result.discountPercent,
            )
          }
        />

        <ResultTile
          label={
            "Łącznie za " +
            result.quantity +
            " szt."
          }
          value={
            currencyFormatter.format(
              result.promotionalTotalPln,
            )
          }
        />

        <ResultTile
          label="Łączna oszczędność"
          value={
            formatSignedCurrency(
              result.totalSavingPln,
            )
          }
        />
      </div>

      {result.lowest30DaysPln !==
      null ? (
        <div className="mt-5 rounded-2xl border border-line bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.08em] text-muted">
            Porównanie z podaną ceną z 30 dni
          </p>

          <p className="mt-2 text-sm font-bold leading-6">
            {lowest30DaysMessage(
              result,
            )}
          </p>

          <p className="mt-2 text-xs leading-5 text-muted">
            To wyłącznie porównanie matematyczne wpisanych cen, a nie ocena zgodności promocji z przepisami.
          </p>
        </div>
      ) : null}
    </section>
  );
}

function ResultTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <p className="text-xs leading-5 text-muted">
        {label}
      </p>

      <p className="mt-1 text-lg font-black text-brand-800">
        {value}
      </p>
    </div>
  );
}

function ratingTitle(
  result:
    PromotionMeterResult,
): string {
  switch (
    result.rating
  ) {
    case "worse":
      return "To nie jest obniżka ceny.";

    case "none":
      return "Cena się nie zmieniła.";

    case "small":
      return "Mała obniżka.";

    case "good":
      return "Solidna obniżka.";

    case "strong":
      return "Duża obniżka.";
  }
}

function ratingDescription(
  result:
    PromotionMeterResult,
): string {
  if (
    result.rating ===
    "worse"
  ) {
    return (
      "Cena promocyjna jest wyższa od wpisanej regularnej o " +
      currencyFormatter.format(
        Math.abs(
          result.savingPerItemPln,
        ),
      ) +
      " na sztuce."
    );
  }

  if (
    result.rating ===
    "none"
  ) {
    return "Wpisana cena promocyjna jest taka sama jak cena regularna.";
  }

  return (
    "Na jednej sztuce zostaje " +
    currencyFormatter.format(
      result.savingPerItemPln,
    ) +
    ", czyli " +
    percentFormatter.format(
      result.discountPercent,
    ) +
    "% ceny regularnej."
  );
}

function lowest30DaysMessage(
  result:
    PromotionMeterResult,
): string {
  const difference =
    result
      .differenceVsLowest30DaysPln ??
    0;

  const percent =
    result
      .discountVsLowest30DaysPercent ??
    0;

  switch (
    result.relationToLowest30Days
  ) {
    case "lower":
      return (
        "Aktualna cena jest niższa od podanej najniższej ceny z 30 dni o " +
        currencyFormatter.format(
          difference,
        ) +
        " (" +
        percentFormatter.format(
          percent,
        ) +
        "%)."
      );

    case "same":
      return "Aktualna cena jest równa podanej najniższej cenie z 30 dni.";

    case "higher":
      return (
        "Aktualna cena jest wyższa od podanej najniższej ceny z 30 dni o " +
        currencyFormatter.format(
          Math.abs(
            difference,
          ),
        ) +
        "."
      );

    case null:
      return "";
  }
}

function formatSignedCurrency(
  value: number,
): string {
  if (
    Math.abs(
      value,
    ) <
    1e-9
  ) {
    return currencyFormatter.format(
      0,
    );
  }

  return (
    (
      value >
      0
        ? "+"
        : "−"
    ) +
    currencyFormatter.format(
      Math.abs(
        value,
      ),
    )
  );
}

function formatSignedPercent(
  value: number,
): string {
  if (
    Math.abs(
      value,
    ) <
    1e-9
  ) {
    return "0%";
  }

  return (
    (
      value >
      0
        ? "−"
        : "+"
    ) +
    percentFormatter.format(
      Math.abs(
        value,
      ),
    ) +
    "%"
  );
}

function parsePolishDecimal(
  value: string,
): number {
  const normalized =
    value
      .trim()
      .replace(
        /\s/g,
        "",
      )
      .replace(
        ",",
        ".",
      );

  if (
    normalized ===
    ""
  ) {
    throw new Error(
      "Uzupełnij wszystkie wymagane pola.",
    );
  }

  const parsed =
    Number(
      normalized,
    );

  if (
    !Number.isFinite(
      parsed,
    )
  ) {
    throw new Error(
      "Wpisz poprawną liczbę.",
    );
  }

  return parsed;
}

function parsePositiveInteger(
  value: string,
): number {
  const parsed =
    parsePolishDecimal(
      value,
    );

  if (
    !Number.isInteger(
      parsed,
    )
  ) {
    throw new Error(
      "Liczba sztuk musi być liczbą całkowitą.",
    );
  }

  return parsed;
}
