"use client";

import {
  type FormEvent,
  useState,
} from "react";

import {
  calculateWorkTimeCost,
  type WorkTimeCostResult,
} from "@/lib/calculators/work-time-cost";

interface FormState {
  itemPrice:
    string;

  monthlyIncome:
    string;

  monthlyHours:
    string;

  workdayHours:
    string;
}

const initialForm:
  FormState = {
    itemPrice:
      "",

    monthlyIncome:
      "",

    monthlyHours:
      "160",

    workdayHours:
      "8",
  };

const currencyFormatter =
  new Intl.NumberFormat(
    "pl-PL",
    {
      style:
        "currency",

      currency:
        "PLN",

      minimumFractionDigits:
        2,

      maximumFractionDigits:
        2,
    },
  );

const numberFormatter =
  new Intl.NumberFormat(
    "pl-PL",
    {
      maximumFractionDigits:
        2,
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
    field:
      keyof FormState,

    value:
      string,
  ) {
    setForm(
      (
        current,
      ) => ({
        ...current,

        [field]:
          value,
      }),
    );

    setResult(
      null,
    );

    setError(
      null,
    );
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

      setError(
        null,
      );
    } catch (
      unknownError
    ) {
      setResult(
        null,
      );

      setError(
        unknownError instanceof
          Error
          ? unknownError.message
          : "Nie udało się wykonać obliczenia.",
      );
    }
  }

  function reset() {
    setForm(
      initialForm,
    );

    setResult(
      null,
    );

    setError(
      null,
    );
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

          <NumberField
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

          <NumberField
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

          <NumberField
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
            Przelicz na czas pracy
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
          <WorkTimeResult
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
  onChange,
}: {
  id:
    string;

  label:
    string;

  value:
    string;

  placeholder:
    string;

  suffix:
    string;

  help?:
    string;

  onChange:
    (
      value:
        string,
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
          inputMode="decimal"
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

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted">
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

function WorkTimeResult({
  result,
}: {
  result:
    WorkTimeCostResult;
}) {
  const timeLabel =
    formatWorkTime(
      result.workMinutesRequired,
    );

  return (
    <section className="rounded-card border border-brand-200 bg-brand-50 p-5 sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">
        IleNaToRobisz?
      </p>

      <h2 className="mt-2 text-3xl font-black text-brand-900">
        {timeLabel}
      </h2>

      <p className="mt-2 text-sm leading-6 text-brand-900">
        Tyle czasu pracy odpowiada cenie
        zakupu przy wpisanym dochodzie
        netto i liczbie godzin pracy.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ResultTile
          label="Dochód netto / godzinę"
          value={
            currencyFormatter.format(
              result.hourlyNetIncomePln,
            )
          }
        />

        <ResultTile
          label="Godziny pracy"
          value={
            numberFormatter.format(
              result.workHoursRequired,
            ) +
            " h"
          }
        />

        <ResultTile
          label="Dni pracy"
          value={
            numberFormatter.format(
              result.workdaysRequired,
            )
          }
        />

        <ResultTile
          label="Część miesięcznego dochodu"
          value={
            numberFormatter.format(
              result.monthlyIncomeSharePercent,
            ) +
            "%"
          }
        />
      </div>

      <div className="mt-5 rounded-2xl border border-line bg-white p-4">
        <p className="text-sm font-black">
          Po zakupie względem jednego
          miesięcznego dochodu
        </p>

        <p className="mt-2 text-xl font-black text-brand-800">
          {currencyFormatter.format(
            result.remainingMonthlyIncomePln,
          )}
        </p>

        <p className="mt-2 text-xs leading-5 text-muted">
          To porównanie ceny z dochodem
          netto, a nie z faktycznym
          dochodem rozporządzalnym.
          Kalkulator nie odejmuje czynszu,
          jedzenia, rat ani innych kosztów
          życia.
        </p>
      </div>
    </section>
  );
}

function ResultTile({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
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

function formatWorkTime(
  minutes:
    number,
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
  value:
    string,
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