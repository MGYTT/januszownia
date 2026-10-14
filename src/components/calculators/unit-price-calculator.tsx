"use client";

import {
  type FormEvent,
  useState,
} from "react";

import {
  SaveCalculationPanel,
} from "@/components/calculators/save-calculation-panel";

import {
  CalculatorActions,
  CalculatorError,
  CalculatorField,
  CalculatorGroup,
  CalculatorResultShell,
  CalculatorShell,
} from "@/components/calculators/calculator-ui";

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

export function UnitPriceCalculator() {
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
    useState<UnitPriceComparison | null>(
      null,
    );

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  function updateProduct<
    Key extends keyof ProductFormState,
  >(
    product:
      | "a"
      | "b",

    field:
      Key,

    value:
      ProductFormState[Key],
  ) {
    setForm(
      (
        current,
      ) => ({
        ...current,

        [product]: {
          ...current[
            product
          ],

          [field]:
            value,
        },
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

            unit:
              form.a.unit,
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

            unit:
              form.b.unit,
          },
        );

      setResult(
        comparison,
      );

      setError(null);
    } catch (
      unknownError
    ) {
      setResult(null);

      setError(
        unknownError instanceof Error
          ? unknownError.message
          : "Nie udało się porównać produktów.",
      );
    }
  }

  function reset() {
    setForm(initialForm);
    setResult(null);
    setError(null);
  }

  return (
    <CalculatorShell intro="Duże opakowanie wygląda poważnie. Cena za kilogram albo litr dopiero mówi, czy faktycznie jest z czego być dumnym.">
      <form
        onSubmit={
          handleSubmit
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <ProductFields
            title="Produkt A"
            badge="pierwszy"
            prefix="product-a"
            value={
              form.a
            }
            onChange={
              (
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
            badge="drugi"
            prefix="product-b"
            value={
              form.b
            }
            onChange={
              (
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

        <CalculatorError
          message={
            error
          }
        />

        <CalculatorActions
          submitLabel="Sprawdź, gdzie cebula większa"
          onReset={
            reset
          }
        />
      </form>

      {result ? (
        <>
          <ComparisonResult
            result={
              result
            }
          />

          <SaveCalculationPanel
            toolSlug="cena-jednostkowa"
            toolTitle="Cena Jednostkowa"
            resultSummary={
              result.winner ===
              "tie"
                ? "Remis ceny jednostkowej"
                : "Produkt " +
                  result.winner.toUpperCase() +
                  " wygrywa o " +
                  percentFormatter.format(
                    result.betterValuePercent,
                  ) +
                  "%"
            }
            inputData={
              form
            }
            resultData={
              result
            }
          />
        </>
      ) : null}
    </CalculatorShell>
  );
}

function ProductFields({
  title,
  badge,
  prefix,
  value,
  onChange,
}: {
  title: string;
  badge: string;
  prefix: string;
  value: ProductFormState;

  onChange:
    <
      Key extends keyof ProductFormState,
    >(
      field:
        Key,
      value:
        ProductFormState[Key],
    ) => void;
}) {
  return (
    <CalculatorGroup
      title={
        title
      }
      badge={
        badge
      }
    >
      <div className="space-y-4">
        <CalculatorField
          id={
            prefix +
            "-price"
          }
          label="Cena"
          value={
            value.price
          }
          placeholder="np. 8,99"
          suffix="zł"
          onChange={
            (
              newValue,
            ) =>
              onChange(
                "price",
                newValue,
              )
          }
        />

        <div>
          <label
            htmlFor={
              prefix +
              "-quantity"
            }
            className="mb-2 block text-sm font-bold text-ink"
          >
            Ilość
          </label>

          <div className="grid grid-cols-[minmax(0,1fr)_92px] gap-2">
            <input
              id={
                prefix +
                "-quantity"
              }
              type="text"
              inputMode="decimal"
              value={
                value.quantity
              }
              placeholder="np. 500"
              onChange={
                (
                  event,
                ) =>
                  onChange(
                    "quantity",
                    event.target.value,
                  )
              }
              className="h-12 min-w-0 rounded-xl border border-line bg-white px-4 text-base font-semibold outline-none transition placeholder:font-normal placeholder:text-subtle focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
            />

            <select
              aria-label={
                "Jednostka dla " +
                title
              }
              value={
                value.unit
              }
              onChange={
                (
                  event,
                ) =>
                  onChange(
                    "unit",
                    event.target.value as QuantityUnit,
                  )
              }
              className="h-12 rounded-xl border border-line bg-white px-3 text-base font-black outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
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
    </CalculatorGroup>
  );
}

function ComparisonResult({
  result,
}: {
  result:
    UnitPriceComparison;
}) {
  const isTie =
    result.winner ===
    "tie";

  const winnerName =
    result.winner ===
    "a"
      ? "Produkt A"
      : "Produkt B";

  return (
    <CalculatorResultShell
      tone={
        isTie
          ? "neutral"
          : "good"
      }
      title={
        isTie
          ? "Remis. Portfel nie ma tu faworyta."
          : winnerName +
            " jest tańszy jednostkowo."
      }
      lead={
        isTie
          ? "Oba warianty kosztują praktycznie tyle samo po przeliczeniu na wspólną jednostkę."
          : (
              <>
                Tańszy wariant ma cenę jednostkową niższą o{" "}
                <strong className="text-ink">
                  {percentFormatter.format(
                    result.betterValuePercent,
                  )}
                  %
                </strong>
                .
              </>
            )
      }
    >
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <ProductResult
          title="Produkt A"
          price={
            result.a.pricePerBaseUnit
          }
          unit={
            result.a.baseUnit
          }
          winner={
            result.winner ===
            "a"
          }
        />

        <ProductResult
          title="Produkt B"
          price={
            result.b.pricePerBaseUnit
          }
          unit={
            result.b.baseUnit
          }
          winner={
            result.winner ===
            "b"
          }
        />
      </div>
    </CalculatorResultShell>
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
      className={[
        "rounded-2xl border bg-white p-4",
        winner
          ? "border-brand-300"
          : "border-line",
      ].join(
        " ",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-black">
          {title}
        </p>

        {winner ? (
          <span className="rounded-full bg-brand-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-brand-800">
            taniej
          </span>
        ) : null}
      </div>

      <p className="mt-4 text-xs text-muted">
        Cena za{" "}
        {unit}
      </p>

      <p className="mt-1 text-xl font-black text-brand-800">
        {currencyFormatter.format(
          price,
        )}
      </p>
    </div>
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
      "Uzupełnij wszystkie pola.",
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