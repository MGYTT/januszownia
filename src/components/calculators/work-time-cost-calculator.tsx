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
  calculateWorkTimeCost,
  type WorkTimeCostResult,
} from "@/lib/calculators/work-time-cost";

interface FormState {
  itemPrice: string;
  monthlyIncome: string;
  monthlyHours: string;
  workdayHours: string;
}

const initialForm: FormState = {
  itemPrice: "",
  monthlyIncome: "",
  monthlyHours: "160",
  workdayHours: "8",
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

const numberFormatter =
  new Intl.NumberFormat(
    "pl-PL",
    {
      maximumFractionDigits: 2,
    },
  );

export function WorkTimeCostCalculator() {
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
    useState<WorkTimeCostResult | null>(
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
      const nextResult =
        calculateWorkTimeCost({
          itemPricePln:
            parsePolishDecimal(
              form.itemPrice,
            ),

          monthlyNetIncomePln:
            parsePolishDecimal(
              form.monthlyIncome,
            ),

          monthlyWorkHours:
            parsePolishDecimal(
              form.monthlyHours,
            ),

          workdayHours:
            parsePolishDecimal(
              form.workdayHours,
            ),
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
          : "Nie udało się przeliczyć ceny na czas pracy.",
      );
    }
  }

  function reset() {
    setForm(initialForm);
    setResult(null);
    setError(null);
  }

  return (
    <CalculatorShell intro="Cena w złotówkach to jedno. Cena w godzinach własnej pracy potrafi wyglądać trochę bardziej osobiście.">
      <form
        onSubmit={
          handleSubmit
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <CalculatorField
            id="item-price"
            label="Cena zakupu"
            value={
              form.itemPrice
            }
            placeholder="np. 2499"
            suffix="zł"
            onChange={
              (
                value,
              ) =>
                updateField(
                  "itemPrice",
                  value,
                )
            }
          />

          <CalculatorField
            id="monthly-income"
            label="Miesięczny dochód netto"
            value={
              form.monthlyIncome
            }
            placeholder="np. 6500"
            suffix="zł"
            help="Wpisz kwotę, która faktycznie trafia do Twojego budżetu."
            onChange={
              (
                value,
              ) =>
                updateField(
                  "monthlyIncome",
                  value,
                )
            }
          />

          <CalculatorField
            id="monthly-hours"
            label="Godziny pracy w miesiącu"
            value={
              form.monthlyHours
            }
            placeholder="np. 160"
            suffix="h"
            onChange={
              (
                value,
              ) =>
                updateField(
                  "monthlyHours",
                  value,
                )
            }
          />

          <CalculatorField
            id="workday-hours"
            label="Twój typowy dzień pracy"
            value={
              form.workdayHours
            }
            placeholder="np. 8"
            suffix="h"
            onChange={
              (
                value,
              ) =>
                updateField(
                  "workdayHours",
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
          submitLabel="Przelicz cenę na czas życia"
          onReset={
            reset
          }
        />
      </form>

      {result ? (
        <>
          <WorkTimeResult
            result={
              result
            }
          />

          <SaveCalculationPanel
            toolSlug="ile-na-to-robisz"
            toolTitle="IleNaToRobisz?"
            resultSummary={
              formatWorkTime(
                result.workMinutesRequired,
              ) +
              " pracy · " +
              currencyFormatter.format(
                result.hourlyNetIncomePln,
              ) +
              " / godz."
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

function WorkTimeResult({
  result,
}: {
  result:
    WorkTimeCostResult;
}) {
  const tone =
    result.monthlyIncomeSharePercent >
    100
      ? "warning"
      : "good";

  return (
    <CalculatorResultShell
      tone={
        tone
      }
      title={
        formatWorkTime(
          result.workMinutesRequired,
        )
      }
      lead="Tyle czasu pracy odpowiada cenie zakupu przy wpisanym dochodzie netto i liczbie godzin pracy."
    >
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <CalculatorMetric
          label="Dochód netto / godzinę"
          value={
            currencyFormatter.format(
              result.hourlyNetIncomePln,
            )
          }
        />

        <CalculatorMetric
          label="Godziny pracy"
          value={
            numberFormatter.format(
              result.workHoursRequired,
            ) +
            " h"
          }
          accent
        />

        <CalculatorMetric
          label="Dni pracy"
          value={
            numberFormatter.format(
              result.workdaysRequired,
            )
          }
        />

        <CalculatorMetric
          label="Część miesięcznego dochodu"
          value={
            numberFormatter.format(
              result.monthlyIncomeSharePercent,
            ) +
            "%"
          }
        />
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-white p-4">
        <p className="text-xs font-black uppercase tracking-[0.08em] text-muted">
          Po zakupie względem jednego miesiąca
        </p>

        <p className="mt-2 text-xl font-black text-brand-800">
          {currencyFormatter.format(
            result.remainingMonthlyIncomePln,
          )}
        </p>

        <p className="mt-2 text-xs leading-5 text-muted">
          To nie jest dochód rozporządzalny. Nie odejmujemy czynszu, jedzenia, rat ani innych kosztów życia — porównujemy wyłącznie cenę z dochodem netto.
        </p>
      </div>
    </CalculatorResultShell>
  );
}

function formatWorkTime(
  minutes: number,
): string {
  const roundedMinutes =
    Math.round(
      minutes,
    );

  if (
    roundedMinutes <
    60
  ) {
    return (
      roundedMinutes +
      " min pracy"
    );
  }

  const hours =
    Math.floor(
      roundedMinutes /
      60,
    );

  const remainingMinutes =
    roundedMinutes %
    60;

  if (
    remainingMinutes ===
    0
  ) {
    return (
      hours +
      " h pracy"
    );
  }

  return (
    hours +
    " h " +
    remainingMinutes +
    " min pracy"
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
