"use client";

import {
  type FormEvent,
  useState,
} from "react";

import {
  compareUnitPrices,
  type QuantityUnit,
  type UnitPriceComparison,
} from "@/lib/calculators/unit-price";

interface ProductFormState {
  price: string;
  quantity: string;
  unit: QuantityUnit;
}

interface FormState {
  a: ProductFormState;
  b: ProductFormState;
}

const initialForm: FormState = {
  a: {
    price: "",
    quantity: "",
    unit: "g",
  },
  b: {
    price: "",
    quantity: "",
    unit: "g",
  },
};

const currencyFormatter =
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const percentFormatter =
  new Intl.NumberFormat("pl-PL", {
    maximumFractionDigits: 2,
  });

function parsePolishDecimal(
  value: string,
): number {
  const normalized = value
    .trim()
    .replace(/\s/g, "")
    .replace(",", ".");

  if (normalized === "") {
    throw new Error(
      "Uzupełnij wszystkie pola.",
    );
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    throw new Error(
      "Wpisz poprawną liczbę.",
    );
  }

  return parsed;
}

export function UnitPriceCalculator() {
  const [form, setForm] =
    useState<FormState>(initialForm);

  const [result, setResult] =
    useState<UnitPriceComparison | null>(
      null,
    );

  const [error, setError] =
    useState<string | null>(null);

  function updateProduct(
    product: "a" | "b",
    field: keyof ProductFormState,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [product]: {
        ...current[product],
        [field]: value,
      },
    }));

    setResult(null);
    setError(null);
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      const comparison =
        compareUnitPrices(
          {
            pricePln:
              parsePolishDecimal(
                form.a.price,
              ),
            quantity:
              parsePolishDecimal(
                form.a.quantity,
              ),
            unit: form.a.unit,
          },
          {
            pricePln:
              parsePolishDecimal(
                form.b.price,
              ),
            quantity:
              parsePolishDecimal(
                form.b.quantity,
              ),
            unit: form.b.unit,
          },
        );

      setResult(comparison);
      setError(null);
    } catch (unknownError) {
      setResult(null);

      if (
        unknownError instanceof Error
      ) {
        setError(
          unknownError.message,
        );
      } else {
        setError(
          "Nie udało się wykonać obliczenia.",
        );
      }
    }
  }

  function reset() {
    setForm(initialForm);
    setResult(null);
    setError(null);
  }

  return (
    <div className="rounded-[2rem] border border-line bg-white p-5 shadow-card sm:p-7 lg:p-8">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <ProductFields
            title="Produkt A"
            prefix="product-a"
            value={form.a}
            onChange={(
              field,
              value,
            ) =>
              updateProduct(
                "a",
                field,
                value,
              )
            }
          />

          <ProductFields
            title="Produkt B"
            prefix="product-b"
            value={form.b}
            onChange={(
              field,
              value,
            ) =>
              updateProduct(
                "b",
                field,
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
            Porównaj produkty
          </button>

          <button
            type="button"
            onClick={reset}
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
          <ComparisonResult
            result={result}
          />
        ) : null}
      </div>
    </div>
  );
}

interface ProductFieldsProps {
  title: string;
  prefix: string;
  value: ProductFormState;
  onChange: (
    field: keyof ProductFormState,
    value: string,
  ) => void;
}

function ProductFields({
  title,
  prefix,
  value,
  onChange,
}: ProductFieldsProps) {
  return (
    <fieldset className="rounded-card border border-line bg-canvas p-5">
      <legend className="px-2 text-lg font-black">
        {title}
      </legend>

      <div className="mt-2 space-y-5">
        <TextField
          id={`${prefix}-price`}
          label="Cena"
          value={value.price}
          placeholder="np. 8,99"
          suffix="zł"
          onChange={(newValue) =>
            onChange(
              "price",
              newValue,
            )
          }
        />

        <div>
          <label
            htmlFor={`${prefix}-quantity`}
            className="mb-2 block text-sm font-bold"
          >
            Ilość
          </label>

          <div className="grid grid-cols-[1fr_96px] gap-2">
            <input
              id={`${prefix}-quantity`}
              type="text"
              inputMode="decimal"
              value={value.quantity}
              placeholder="np. 500"
              onChange={(event) =>
                onChange(
                  "quantity",
                  event.target.value,
                )
              }
              className="h-12 min-w-0 rounded-xl border border-line bg-white px-4 text-base font-semibold outline-none transition placeholder:font-normal placeholder:text-subtle focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
            />

            <select
              aria-label={`Jednostka dla ${title}`}
              value={value.unit}
              onChange={(event) =>
                onChange(
                  "unit",
                  event.target.value,
                )
              }
              className="h-12 rounded-xl border border-line bg-white px-3 text-base font-bold outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
            >
              <option value="g">
                g
              </option>

              <option value="kg">
                kg
              </option>

              <option value="ml">
                ml
              </option>

              <option value="l">
                l
              </option>

              <option value="szt">
                szt.
              </option>
            </select>
          </div>
        </div>
      </div>
    </fieldset>
  );
}

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  suffix: string;
  onChange: (value: string) => void;
}

function TextField({
  id,
  label,
  value,
  placeholder,
  suffix,
  onChange,
}: TextFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(
              event.target.value,
            )
          }
          className="h-12 w-full rounded-xl border border-line bg-white px-4 pr-12 text-base font-semibold outline-none transition placeholder:font-normal placeholder:text-subtle focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
        />

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted">
          {suffix}
        </span>
      </div>
    </div>
  );
}

function ComparisonResult({
  result,
}: {
  result: UnitPriceComparison;
}) {
  const winnerText =
    result.winner === "tie"
      ? "Oba warianty kosztują tyle samo."
      : result.winner === "a"
        ? "Produkt A jest tańszy jednostkowo."
        : "Produkt B jest tańszy jednostkowo.";

  return (
    <section className="rounded-card border border-brand-200 bg-brand-50 p-5 sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
        Wynik
      </p>

      <h2 className="mt-2 text-2xl font-black">
        {winnerText}
      </h2>

      {result.winner !== "tie" ? (
        <p className="mt-2 text-sm leading-6 text-brand-800">
          Tańszy wariant ma cenę
          jednostkową niższą o{" "}
          <strong>
            {percentFormatter.format(
              result.betterValuePercent,
            )}
            %
          </strong>
          .
        </p>
      ) : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <ProductResult
          title="Produkt A"
          price={
            result.a.pricePerBaseUnit
          }
          unit={result.a.baseUnit}
          winner={
            result.winner === "a"
          }
        />

        <ProductResult
          title="Produkt B"
          price={
            result.b.pricePerBaseUnit
          }
          unit={result.b.baseUnit}
          winner={
            result.winner === "b"
          }
        />
      </div>
    </section>
  );
}

function ProductResult({
  title,
  price,
  unit,
  winner,
}: {
  title: string;
  price: number;
  unit: string;
  winner: boolean;
}) {
  return (
    <div
      className={
        winner
          ? "rounded-2xl border border-brand-300 bg-white p-4"
          : "rounded-2xl border border-line bg-white/75 p-4"
      }
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-black">
          {title}
        </h3>

        {winner ? (
          <span className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-black text-brand-800">
            taniej
          </span>
        ) : null}
      </div>

      <p className="mt-4 text-xs text-muted">
        Cena za {unit}
      </p>

      <p className="mt-1 text-xl font-black text-brand-700">
        {currencyFormatter.format(
          price,
        )}
      </p>
    </div>
  );
}