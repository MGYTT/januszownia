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
  CalculatorMetric,
  CalculatorResultShell,
  CalculatorShell,
} from "@/components/calculators/calculator-ui";

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
        unknownError instanceof Error
          ? unknownError.message
          : "Nie udało się sprawdzić promocji.",
      );
    }
  }

  function reset() {
    setForm(initialForm);
    setResult(null);
    setError(null);
  }

  return (
    <CalculatorShell intro="Czerwona etykieta może krzyczeć PROMOCJA. My spokojnie sprawdzimy, ile złotówek naprawdę zostaje w kieszeni.">
      <form
        onSubmit={
          handleSubmit
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <CalculatorField
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

          <CalculatorField
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

          <CalculatorField
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

          <CalculatorField
            id="lowest-30-days"
            label="Najniższa cena z 30 dni"
            value={
              form.lowest30Days
            }
            placeholder="opcjonalnie"
            suffix="zł"
            help="Jeżeli masz tę wartość z etykiety sklepu, porównamy ją matematycznie z aktualną ceną."
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

        <CalculatorError
          message={
            error
          }
        />

        <CalculatorActions
          submitLabel="Prześwietl promocję"
          onReset={
            reset
          }
        />
      </form>

      {result ? (
        <>
          <PromotionResult
            result={
              result
            }
          />

          <SaveCalculationPanel
            toolSlug="promocjometr"
            toolTitle="Promocjometr"
            resultSummary={
              formatSignedPercent(
                result.discountPercent,
              ) +
              " zmiany ceny · " +
              formatSignedCurrency(
                result.totalSavingPln,
              ) +
              " łącznie"
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

function PromotionResult({
  result,
}: {
  result:
    PromotionMeterResult;
}) {
  return (
    <CalculatorResultShell
      tone={
        ratingTone(
          result,
        )
      }
      title={
        ratingTitle(
          result,
        )
      }
      lead={
        ratingDescription(
          result,
        )
      }
    >
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <CalculatorMetric
          label="Różnica na sztuce"
          value={
            formatSignedCurrency(
              result.savingPerItemPln,
            )
          }
        />

        <CalculatorMetric
          label="Zmiana ceny"
          value={
            formatSignedPercent(
              result.discountPercent,
            )
          }
        />

        <CalculatorMetric
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

        <CalculatorMetric
          label="Łączna różnica"
          value={
            formatSignedCurrency(
              result.totalSavingPln,
            )
          }
          accent
        />
      </div>

      {result.lowest30DaysPln !==
      null ? (
        <div className="mt-4 rounded-2xl border border-line bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.08em] text-muted">
            Cena z 30 dni
          </p>

          <p className="mt-2 text-sm font-bold leading-6 text-ink">
            {lowest30DaysMessage(
              result,
            )}
          </p>

          <p className="mt-2 text-xs leading-5 text-muted">
            To porównanie liczb podanych przez użytkownika, nie ocena zgodności promocji z przepisami.
          </p>
        </div>
      ) : null}
    </CalculatorResultShell>
  );
}

function ratingTone(
  result:
    PromotionMeterResult,
):
  | "good"
  | "neutral"
  | "warning" {
  if (
    result.rating ===
    "worse"
  ) {
    return "warning";
  }

  if (
    result.rating ===
      "none" ||
    result.rating ===
      "small"
  ) {
    return "neutral";
  }

  return "good";
}

function ratingTitle(
  result:
    PromotionMeterResult,
): string {
  switch (
    result.rating
  ) {
    case "worse":
      return "Stop. Ta „promocja” jest droższa.";

    case "none":
      return "Cena stoi w miejscu. Promocja też.";

    case "small":
      return "Mała obniżka. Cebulka, nie cebula.";

    case "good":
      return "Solidna obniżka. Portfel oddycha.";

    case "strong":
      return "Tu już jest konkretna cebula.";
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
      "Cena promocyjna jest wyższa od regularnej o " +
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
    return "Wpisana cena promocyjna jest dokładnie taka sama jak regularna.";
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
    "% mniej względem ceny regularnej."
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
      value > 0
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
      value > 0
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
